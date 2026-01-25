-- Script de migration pour ajouter le support des conversations
-- À exécuter uniquement si vous avez une base de données existante avec des messages

-- 1. Créer la table conversations
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id),
    CONSTRAINT valid_user_order CHECK (user1_id < user2_id)
);

-- 2. Ajouter la colonne conversation_id à la table messages (si elle n'existe pas)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'conversation_id'
    ) THEN
        ALTER TABLE messages ADD COLUMN conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Créer la fonction get_or_create_conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1 INTEGER, user2 INTEGER)
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
$$ LANGUAGE plpgsql;

-- 4. Migrer les messages existants vers des conversations
DO $$
DECLARE
    msg_record RECORD;
    conv_id INTEGER;
    min_user INTEGER;
    max_user INTEGER;
BEGIN
    FOR msg_record IN 
        SELECT DISTINCT 
            LEAST(sender_id, receiver_id) as user1,
            GREATEST(sender_id, receiver_id) as user2
        FROM messages
        WHERE conversation_id IS NULL
    LOOP
        -- Créer la conversation
        INSERT INTO conversations (user1_id, user2_id)
        VALUES (msg_record.user1, msg_record.user2)
        ON CONFLICT (user1_id, user2_id) DO NOTHING
        RETURNING id INTO conv_id;
        
        -- Si la conversation existait déjà, récupérer son ID
        IF conv_id IS NULL THEN
            SELECT id INTO conv_id
            FROM conversations
            WHERE user1_id = msg_record.user1 AND user2_id = msg_record.user2;
        END IF;
        
        -- Mettre à jour les messages de cette conversation
        UPDATE messages
        SET conversation_id = conv_id
        WHERE (sender_id = msg_record.user1 AND receiver_id = msg_record.user2)
           OR (sender_id = msg_record.user2 AND receiver_id = msg_record.user1)
           AND conversation_id IS NULL;
    END LOOP;
END $$;

-- 5. Rendre conversation_id obligatoire (après migration)
ALTER TABLE messages ALTER COLUMN conversation_id SET NOT NULL;

-- 6. Créer les index
CREATE INDEX IF NOT EXISTS idx_conversations_user1_id ON conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2_id ON conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- 7. Créer le trigger pour updated_at sur conversations
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Mettre à jour updated_at des conversations avec la date du dernier message
UPDATE conversations c
SET updated_at = (
    SELECT MAX(created_at)
    FROM messages m
    WHERE m.conversation_id = c.id
);
