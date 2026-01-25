const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const messagesRouter = require('./messages');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://fdm_user:fdm_password@postgres:5432/fdm_db',
});

// Middleware
app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Messages routes
app.use('/', messagesRouter(authenticateToken));

// Routes pour les annonces

// Obtenir toutes les annonces (avec pagination et filtres)
app.get('/api/ads', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, minPrice, maxPrice } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT a.*, u.first_name, u.last_name, u.phone FROM ads a JOIN users u ON a.user_id = u.id WHERE a.status = $1';
    const params = ['active'];
    let paramIndex = 2;

    if (category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (minPrice) {
      query += ` AND a.price >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      query += ` AND a.price <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    // Compter le total
    let countQuery = 'SELECT COUNT(*) FROM ads WHERE status = $1';
    const countParams = ['active'];
    if (category) {
      countQuery += ' AND category = $2';
      countParams.push(category);
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${countParams.length + 1} OR description ILIKE $${countParams.length + 1})`;
      countParams.push(`%${search}%`);
    }
    if (minPrice) {
      countQuery += ` AND price >= $${countParams.length + 1}`;
      countParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      countQuery += ` AND price <= $${countParams.length + 1}`;
      countParams.push(parseFloat(maxPrice));
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      ads: result.rows.map(ad => ({
        id: ad.id,
        userId: ad.user_id,
        title: ad.title,
        description: ad.description,
        price: parseFloat(ad.price),
        category: ad.category,
        location: ad.location,
        imageUrl: ad.image_url,
        status: ad.status,
        createdAt: ad.created_at,
        updatedAt: ad.updated_at,
        user: {
          firstName: ad.first_name,
          lastName: ad.last_name,
          phone: ad.phone,
        },
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir une annonce par ID
app.get('/api/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT a.*, u.first_name, u.last_name, u.phone, u.email FROM ads a JOIN users u ON a.user_id = u.id WHERE a.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }

    const ad = result.rows[0];
    res.json({
      id: ad.id,
      userId: ad.user_id,
      title: ad.title,
      description: ad.description,
      price: parseFloat(ad.price),
      category: ad.category,
      location: ad.location,
      imageUrl: ad.image_url,
      status: ad.status,
      createdAt: ad.created_at,
      updatedAt: ad.updated_at,
      user: {
        firstName: ad.first_name,
        lastName: ad.last_name,
        phone: ad.phone,
        email: ad.email,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une nouvelle annonce
app.post('/api/ads', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, location, imageUrl } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Titre et prix requis' });
    }

    const result = await pool.query(
      'INSERT INTO ads (user_id, title, description, price, category, location, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.userId, title, description || null, price, category || null, location || null, imageUrl || null]
    );

    const ad = result.rows[0];
    res.status(201).json({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: parseFloat(ad.price),
      category: ad.category,
      location: ad.location,
      imageUrl: ad.image_url,
      status: ad.status,
      createdAt: ad.created_at,
      updatedAt: ad.updated_at,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour une annonce
app.put('/api/ads/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, location, imageUrl, status } = req.body;

    // Vérifier que l'annonce appartient à l'utilisateur
    const checkResult = await pool.query('SELECT user_id FROM ads WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    if (checkResult.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette annonce' });
    }

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (location !== undefined) {
      updateFields.push(`location = $${paramIndex++}`);
      values.push(location);
    }
    if (imageUrl !== undefined) {
      updateFields.push(`image_url = $${paramIndex++}`);
      values.push(imageUrl);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    }

    values.push(id);
    const query = `UPDATE ads SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    const ad = result.rows[0];
    res.json({
      id: ad.id,
      userId: ad.user_id,
      title: ad.title,
      description: ad.description,
      price: parseFloat(ad.price),
      category: ad.category,
      location: ad.location,
      imageUrl: ad.image_url,
      status: ad.status,
      createdAt: ad.created_at,
      updatedAt: ad.updated_at,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer une annonce
app.delete('/api/ads/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'annonce appartient à l'utilisateur
    const checkResult = await pool.query('SELECT user_id FROM ads WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    if (checkResult.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cette annonce' });
    }

    await pool.query('DELETE FROM ads WHERE id = $1', [id]);
    res.json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les annonces d'un utilisateur
app.get('/api/ads/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur demande ses propres annonces
    if (parseInt(userId) !== req.user.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await pool.query(
      'SELECT * FROM ads WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      ads: result.rows.map(ad => ({
        id: ad.id,
        userId: ad.user_id,
        title: ad.title,
        description: ad.description,
        price: parseFloat(ad.price),
        category: ad.category,
        location: ad.location,
        imageUrl: ad.image_url,
        status: ad.status,
        createdAt: ad.created_at,
        updatedAt: ad.updated_at,
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-business' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Métier démarrée sur le port ${PORT}`);
});
