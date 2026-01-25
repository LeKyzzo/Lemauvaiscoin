const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://fdm_user:fdm_password@localhost:5432/fdm_db',
});

async function executeQuery(query, description) {
  try {
    if (description) console.log(`  ${description}...`);
    await pool.query(query);
    if (description) console.log(`  ✅ ${description} terminé`);
  } catch (error) {
    console.error(`  ❌ Erreur: ${error.message}`);
    throw error;
  }
}

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Début de la migration vers le système de conversations...\n');

    await client.query('BEGIN');

    // 1. Créer la table conversations
    await executeQuery(
      `CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id),
        CONSTRAINT valid_user_order CHECK (user1_id < user2_id)
      )`,
      '1. Création de la table conversations'
    );

    // 2. Ajouter la colonne conversation_id si elle n'existe pas
    const columnExists = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'conversation_id'
    `);
    
    if (columnExists.rows.length === 0) {
      await executeQuery(
        'ALTER TABLE messages ADD COLUMN conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE',
        '2. Ajout de la colonne conversation_id'
      );
    } else {
      console.log('  ℹ️  La colonne conversation_id existe déjà');
    }

    // 3. Créer la fonction get_or_create_conversation
    await executeQuery(
      `CREATE OR REPLACE FUNCTION get_or_create_conversation(user1 INTEGER, user2 INTEGER)
      RETURNS INTEGER AS $$
      DECLARE
          conv_id INTEGER;
          min_user INTEGER;
          max_user INTEGER;
      BEGIN
          IF user1 < user2 THEN
              min_user := user1;
              max_user := user2;
          ELSE
              min_user := user2;
              max_user := user1;
          END IF;

          SELECT id INTO conv_id
          FROM conversations
          WHERE user1_id = min_user AND user2_id = max_user;

          IF conv_id IS NULL THEN
              INSERT INTO conversations (user1_id, user2_id)
              VALUES (min_user, max_user)
              RETURNING id INTO conv_id;
          END IF;

          RETURN conv_id;
      END;
      $$ LANGUAGE plpgsql`,
      '3. Création de la fonction get_or_create_conversation'
    );

    // 4. Migrer les messages existants
    const messagesToMigrate = await client.query(`
      SELECT DISTINCT 
        LEAST(sender_id, receiver_id) as user1,
        GREATEST(sender_id, receiver_id) as user2
      FROM messages
      WHERE conversation_id IS NULL
    `);

    if (messagesToMigrate.rows.length > 0) {
      console.log(`  📦 Migration de ${messagesToMigrate.rows.length} paires d'utilisateurs...`);
      
      for (const row of messagesToMigrate.rows) {
        // Créer la conversation
        const convResult = await client.query(
          `INSERT INTO conversations (user1_id, user2_id)
           VALUES ($1, $2)
           ON CONFLICT (user1_id, user2_id) DO NOTHING
           RETURNING id`,
          [row.user1, row.user2]
        );

        let convId;
        if (convResult.rows.length > 0) {
          convId = convResult.rows[0].id;
        } else {
          const existingConv = await client.query(
            'SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2',
            [row.user1, row.user2]
          );
          convId = existingConv.rows[0].id;
        }

        // Mettre à jour les messages
        await client.query(
          `UPDATE messages
           SET conversation_id = $1
           WHERE ((sender_id = $2 AND receiver_id = $3)
              OR (sender_id = $3 AND receiver_id = $2))
             AND conversation_id IS NULL`,
          [convId, row.user1, row.user2]
        );
      }
      console.log('  ✅ Migration des messages terminée');
    } else {
      console.log('  ℹ️  Aucun message à migrer');
    }

    // 5. Rendre conversation_id obligatoire (si possible)
    try {
      await executeQuery(
        'ALTER TABLE messages ALTER COLUMN conversation_id SET NOT NULL',
        '5. Rendre conversation_id obligatoire'
      );
    } catch (error) {
      console.log('  ⚠️  Impossible de rendre conversation_id obligatoire (peut-être des valeurs NULL)');
    }

    // 6. Créer les index
    await executeQuery(
      'CREATE INDEX IF NOT EXISTS idx_conversations_user1_id ON conversations(user1_id)',
      '6.1. Index conversations user1_id'
    );
    await executeQuery(
      'CREATE INDEX IF NOT EXISTS idx_conversations_user2_id ON conversations(user2_id)',
      '6.2. Index conversations user2_id'
    );
    await executeQuery(
      'CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC)',
      '6.3. Index conversations updated_at'
    );
    await executeQuery(
      'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)',
      '6.4. Index messages conversation_id'
    );

    // 7. Créer le trigger
    await executeQuery(
      `CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
      '7. Création du trigger updated_at'
    );

    // 8. Mettre à jour updated_at des conversations
    await executeQuery(
      `UPDATE conversations c
       SET updated_at = (
         SELECT MAX(created_at)
         FROM messages m
         WHERE m.conversation_id = c.id
       )`,
      '8. Mise à jour updated_at des conversations'
    );

    await client.query('COMMIT');
    
    console.log('\n✅ Migration terminée avec succès !');
    console.log('Les conversations ont été créées et les messages existants ont été migrés.\n');
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Erreur lors de la migration:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
