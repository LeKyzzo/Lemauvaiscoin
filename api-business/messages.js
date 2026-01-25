const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://fdm_user:fdm_password@postgres:5432/fdm_db',
});

// Fonction pour créer les routes de messages
function createMessagesRoutes(authenticateToken) {
  const express = require('express');
  const router = express.Router();

  // Envoyer un message
  router.post('/api/messages', authenticateToken, async (req, res) => {
    try {
      const { receiverId, content } = req.body;

      if (!receiverId || !content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Destinataire et contenu requis' });
      }

      if (req.user.userId === parseInt(receiverId)) {
        return res.status(400).json({ error: 'Vous ne pouvez pas vous envoyer un message' });
      }

      // Vérifier que le destinataire existe
      const receiverCheck = await pool.query('SELECT id FROM users WHERE id = $1', [receiverId]);
      if (receiverCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Destinataire non trouvé' });
      }

      // Obtenir ou créer une conversation entre les deux utilisateurs
      const conversationResult = await pool.query(
        'SELECT get_or_create_conversation($1, $2) as conversation_id',
        [req.user.userId, receiverId]
      );
      const conversationId = conversationResult.rows[0].conversation_id;

      // Mettre à jour updated_at de la conversation
      await pool.query(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [conversationId]
      );

      // Insérer le message avec la conversation_id
      const result = await pool.query(
        'INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
        [conversationId, req.user.userId, receiverId, content.trim()]
      );

      const message = result.rows[0];
      res.status(201).json({
        id: message.id,
        conversationId: message.conversation_id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        content: message.content,
        readAt: message.read_at,
        createdAt: message.created_at,
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Obtenir les conversations (liste des utilisateurs avec qui on a échangé)
  router.get('/api/messages/conversations', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;

      // Récupérer toutes les conversations où l'utilisateur est participant
      const result = await pool.query(
        `SELECT 
          c.id as conversation_id,
          CASE 
            WHEN c.user1_id = $1 THEN c.user2_id
            ELSE c.user1_id
          END as other_user_id,
          u.first_name,
          u.last_name,
          u.email,
          (SELECT content FROM messages 
           WHERE conversation_id = c.id
           ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT created_at FROM messages 
           WHERE conversation_id = c.id
           ORDER BY created_at DESC LIMIT 1) as last_message_date,
          (SELECT COUNT(*) FROM messages 
           WHERE conversation_id = c.id
             AND receiver_id = $1 
             AND read_at IS NULL) as unread_count,
          c.updated_at
        FROM conversations c
        JOIN users u ON (
          CASE 
            WHEN c.user1_id = $1 THEN u.id = c.user2_id
            ELSE u.id = c.user1_id
          END
        )
        WHERE c.user1_id = $1 OR c.user2_id = $1
        ORDER BY c.updated_at DESC`,
        [userId]
      );

      res.json({
        conversations: result.rows.map(row => ({
          conversationId: row.conversation_id,
          userId: row.other_user_id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          lastMessage: row.last_message,
          lastMessageDate: row.last_message_date,
          unreadCount: parseInt(row.unread_count) || 0,
        })),
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Obtenir les messages avec un utilisateur spécifique
  router.get('/api/messages/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.userId;

      if (parseInt(userId) === currentUserId) {
        return res.status(400).json({ error: 'Vous ne pouvez pas consulter vos propres messages' });
      }

      // Vérifier que l'utilisateur existe
      const userCheck = await pool.query('SELECT id, first_name, last_name, email FROM users WHERE id = $1', [userId]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Obtenir ou créer la conversation entre les deux utilisateurs
      const conversationResult = await pool.query(
        'SELECT get_or_create_conversation($1, $2) as conversation_id',
        [currentUserId, userId]
      );
      const conversationId = conversationResult.rows[0].conversation_id;

      // Récupérer les messages de la conversation
      const messagesResult = await pool.query(
        `SELECT m.*, 
          s.first_name as sender_first_name, 
          s.last_name as sender_last_name,
          r.first_name as receiver_first_name,
          r.last_name as receiver_last_name
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        JOIN users r ON m.receiver_id = r.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC`,
        [conversationId]
      );

      // Marquer les messages comme lus
      await pool.query(
        'UPDATE messages SET read_at = CURRENT_TIMESTAMP WHERE conversation_id = $1 AND receiver_id = $2 AND read_at IS NULL',
        [conversationId, currentUserId]
      );

      res.json({
        conversationId: conversationId,
        user: {
          id: userCheck.rows[0].id,
          firstName: userCheck.rows[0].first_name,
          lastName: userCheck.rows[0].last_name,
          email: userCheck.rows[0].email,
        },
        messages: messagesResult.rows.map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          readAt: msg.read_at,
          createdAt: msg.created_at,
          isFromCurrentUser: msg.sender_id === currentUserId,
        })),
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Compter les messages non lus
  router.get('/api/messages/unread/count', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND read_at IS NULL',
        [req.user.userId]
      );

      res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
}

module.exports = createMessagesRoutes;
