-- =============================================
-- CLEANUP
-- =============================================
DROP TABLE IF EXISTS comments, likes, follows, game_list_games, game_lists, users CASCADE;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- USERS
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  profile_image TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed users with bcrypt-hashed passwords
INSERT INTO users (username, email, password, profile_image, email_verified) VALUES
('PixelPioneer', 'pixelpioneer@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=1', TRUE),
('RetroRaven', 'retroraven@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=2', TRUE),
('GameGuru', 'gameguru@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=3', TRUE),
('IndieNinja', 'indieninja@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=4', TRUE),
('ArcadeQueen', 'arcadequeen@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=5', TRUE),
('QuestSeeker', 'questseeker@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=6', TRUE),
('LootLlama', 'lootllama@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=7', TRUE),
('RogueByte', 'roguebyte@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=8', TRUE),
('XPCollector', 'xpcollector@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=9', TRUE),
('BossBattler', 'bossbattler@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=10', TRUE),
('SpeedRunner', 'speedrunner@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=11', TRUE),
('CozyGamer', 'cozygamer@example.com', crypt('password123', gen_salt('bf')), 'https://i.pravatar.cc/150?img=12', TRUE);

-- =============================================
-- GAME LISTS
-- =============================================
CREATE TABLE game_lists (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  is_ranked BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- GAME LIST GAMES
-- =============================================
CREATE TABLE game_list_games (
  id SERIAL PRIMARY KEY,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  igdb_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_id TEXT,
  position INTEGER
);

-- =============================================
-- FOLLOWS
-- =============================================
CREATE TABLE follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, followed_id),
  CHECK (follower_id <> followed_id)
);

-- =============================================
-- LIKES
-- =============================================
CREATE TABLE likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, game_list_id)
);

-- =============================================
-- COMMENTS
-- =============================================
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TEMPORARY GAMES SEED TABLE
-- =============================================
CREATE TEMP TABLE seed_games (
  igdb_id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_id TEXT
);

INSERT INTO seed_games (igdb_id, name, slug, image_id) VALUES
(350392, 'Rival Species', 'rival-species', 'coa0fw'),
(14297, 'MX vs. ATV: Supercross - Encore', 'mx-vs-atv-supercross-encore', 'co3bcn'),
(339266, 'Power Guy World', 'power-guy-world', 'co9tq2'),
(34800, 'Super Hipster Lumberjack', 'super-hipster-lumberjack', 'co86ki');

-- =============================================
-- PROCEDURAL SEEDING
-- =============================================
DO $$
DECLARE
  adjs TEXT[] := ARRAY['Ultimate','Best','Top','Cozy','Hidden','Essential','Retro','Modern','Speedrun','Relaxing'];
  nouns TEXT[] := ARRAY['Games','RPGs','Indie Gems','Switch Picks','Playlists','Favorites','Collection','Backlog'];
  desc_templates TEXT[] := ARRAY[
    'A curated list of games I''ve loved over the years.',
    'Relaxing titles perfect for unwinding in the evening.',
    'Fast-paced and challenging games for thrill-seekers.'
  ];
  u RECORD;
  i INT;
  list_count INT;
  list_id INT;
  list_name TEXT;
  description TEXT;
  is_public BOOLEAN;
  is_ranked BOOLEAN;
  is_pinned BOOLEAN;
  pinned_idx INT;
  game_count INT;
  g RECORD;
  pos INT;
BEGIN
  FOR u IN SELECT id FROM users ORDER BY id LOOP
    pinned_idx := 1;
    list_count := (floor(random()*5)::int + 3); -- 3..7 lists per user
    FOR i IN 1..list_count LOOP
      list_name := adjs[(floor(random()*array_length(adjs,1)) + 1)::int] || ' ' ||
                   nouns[(floor(random()*array_length(nouns,1)) + 1)::int];
      description := desc_templates[(floor(random()*array_length(desc_templates,1)) + 1)::int];
      is_public := (random() < 0.8);
      is_ranked := (random() < 0.35);
      is_pinned := (random() < 0.3);

      INSERT INTO game_lists(user_id, name, description, is_public, is_ranked, is_pinned, created_at)
      VALUES (u.id, list_name, description, is_public, is_ranked, is_pinned, NOW() - (round(random()*365)) * INTERVAL '1 day')
      RETURNING id INTO list_id;

      IF is_pinned THEN
        UPDATE game_lists SET pinned_order = pinned_idx WHERE id = list_id;
        pinned_idx := pinned_idx + 1;
      END IF;

      -- Add games (2..5)
      game_count := (floor(random()*4)::int + 2);
      pos := 1;
      FOR g IN SELECT * FROM seed_games ORDER BY random() LIMIT game_count LOOP
        INSERT INTO game_list_games(game_list_id, igdb_id, name, slug, image_id, position)
        VALUES (list_id, g.igdb_id, g.name, g.slug, g.image_id, pos);
        pos := pos + 1;
      END LOOP;
    END LOOP;
  END LOOP;
END
$$;
