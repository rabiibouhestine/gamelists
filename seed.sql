-- Drop existing tables
DROP TABLE IF EXISTS comments, likes, follows, game_list_games, game_lists, users CASCADE;

-- Users table (optional app metadata, links to auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game lists
CREATE TABLE game_lists (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  is_ranked BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game list games
CREATE TABLE game_list_games (
  id SERIAL PRIMARY KEY,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  igdb_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_id TEXT,
  position INTEGER
);

-- Follows
CREATE TABLE follows (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, followed_id),
  CHECK (follower_id <> followed_id)
);

-- Likes
CREATE TABLE likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, game_list_id)
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert the 3 existing auth users into app users table
INSERT INTO users (id, username, profile_image) VALUES
('0ddfbf6d-58e7-465f-8e78-3e44f72a2f41', 'PixelPioneer', 'https://i.pravatar.cc/150?img=1'),
('f7811a80-ab6a-48ac-b717-584d930e0fa8', 'RetroRaven', 'https://i.pravatar.cc/150?img=2'),
('1ad6c87d-7f7e-4039-90a7-fa7eddc8bdcb', 'GameGuru', 'https://i.pravatar.cc/150?img=3');

-- Temporary seed table with the exact game objects
CREATE TEMP TABLE seed_games (
  igdb_id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_id TEXT
);

-- (Insert 100 game entries as before, omitted here for brevity)
-- ... INSERT INTO seed_games (...)

-- Seeding logic
DO $$
DECLARE
  adjs TEXT[] := ARRAY[
    'Ultimate','Best','Top','Cozy','Hidden','Essential','Retro','Modern','Speedrun','Relaxing',
    'Challenging','Narrative','Multiplayer','Single-player','Indie','Open-world','Arcade','Platformer',
    'Strategy','Horror','Family','Competitive','Casual','Collector','Dream'
  ];
  nouns TEXT[] := ARRAY[
    'Games','RPGs','Indie Gems','Switch Picks','Playlists','Favorites','Collection','Backlog',
    'Must-Plays','Classics','Speedrun Projects','Cozy Vibes','Horror Bundle','Action Adventures',
    'Open Worlds','Multiplayer Madness','Pixel Classics','Weekend Picks','Narratives','Soulslikes',
    'Simulations','Strategy Picks','Hidden Gems','Top 100','My Picks'
  ];
  desc_templates TEXT[] := ARRAY[
    'A curated list of games I''ve loved over the years.',
    'Relaxing titles perfect for unwinding in the evening.',
    'Fast-paced and challenging games for thrill-seekers.',
    'Indie gems with unique mechanics and heart.',
    'Narrative-driven experiences that stick with you.',
    'Titles I play when I want to focus on replayability.',
    'A mix of retro and modern classics I recommend.',
    'Multiplayer favourites to enjoy with friends.',
    'Small studios, big impact — indie highlights.',
    'Games that look great and feel even better.'
  ];
  comment_templates TEXT[] := ARRAY[
    'Love this list — adding a few to my backlog!',
    'Great picks, especially the hidden gems.',
    'Nice curation, I disagree with one pick but overall solid.',
    'This gave me ideas for my next purchase.',
    'Perfect for a cozy weekend of gaming.',
    'Some of these surprised me, will try them out.',
    'Great selection — bookmarked.',
    'You can''t go wrong with these titles!'
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
  follow_count INT;
  f RECORD;
  num_likes INT;
  max_users INT;
  l RECORD;
  num_comments INT;
  c_user UUID;  -- changed from INT
  c TEXT;
  days_ago INT;
BEGIN
  -- Create lists per user (4..12 each)
  FOR u IN SELECT id FROM users ORDER BY id LOOP
    pinned_idx := 1;
    list_count := (floor(random()*9)::int + 4);
    FOR i IN 1..list_count LOOP
      list_name := adjs[ (floor(random()*array_length(adjs,1)) + 1)::int ] || ' ' || nouns[ (floor(random()*array_length(nouns,1)) + 1)::int ];
      description := desc_templates[ (floor(random()*array_length(desc_templates,1)) + 1)::int ];
      is_public := (random() < 0.80);
      is_ranked := (random() < 0.35);
      is_pinned := (random() < 0.28);

      INSERT INTO game_lists (user_id, name, description, is_public, is_ranked, is_pinned, created_at)
      VALUES (u.id, list_name, description, is_public, is_ranked, is_pinned, NOW() - (round(random()*365)) * INTERVAL '1 day')
      RETURNING id INTO list_id;

      IF is_pinned THEN
        UPDATE game_lists SET pinned_order = pinned_idx WHERE id = list_id;
        pinned_idx := pinned_idx + 1;
      END IF;

      -- Add games to the list (4..24 unique games)
      game_count := (floor(random()*21)::int + 4);
      pos := 1;
      FOR g IN SELECT * FROM seed_games ORDER BY random() LIMIT game_count LOOP
        INSERT INTO game_list_games (game_list_id, igdb_id, name, slug, image_id, position)
        VALUES (list_id, g.igdb_id, g.name, g.slug, g.image_id, pos);
        pos := pos + 1;
      END LOOP;
    END LOOP;
  END LOOP;

  -- Follows: each user follows 0..6 other users
  FOR u IN SELECT id FROM users ORDER BY id LOOP
    follow_count := (floor(random()*7))::int;
    FOR f IN SELECT id FROM users WHERE id <> u.id ORDER BY random() LIMIT follow_count LOOP
      INSERT INTO follows (follower_id, followed_id) VALUES (u.id, f.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- Likes: each list gets between 3 and min(total_users,40) likes
  SELECT count(*) INTO max_users FROM users;
  FOR l IN SELECT id FROM game_lists LOOP
    num_likes := (floor(random()*38)::int + 3);
    IF num_likes > max_users THEN
      num_likes := max_users;
    END IF;
    FOR f IN SELECT id FROM users ORDER BY random() LIMIT num_likes LOOP
      INSERT INTO likes (user_id, game_list_id) VALUES (f.id, l.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- Comments: each list gets between 2 and 12 comments
  FOR l IN SELECT id FROM game_lists LOOP
    num_comments := (floor(random()*11)::int + 2);
    FOR i IN 1..num_comments LOOP
      SELECT id INTO c_user FROM users ORDER BY random() LIMIT 1;
      c := comment_templates[(floor(random()*array_length(comment_templates,1)) + 1)::int];
      days_ago := (floor(random()*365))::int;
      INSERT INTO comments (user_id, game_list_id, content, created_at)
      VALUES (c_user, l.id, c, NOW() - (days_ago * INTERVAL '1 day'));
    END LOOP;
  END LOOP;

END
$$;

-- Clean up temporary seed table
DROP TABLE IF EXISTS seed_games;
