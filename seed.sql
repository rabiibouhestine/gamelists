-- Drop existing tables
DROP TABLE IF EXISTS comments, likes, follows, game_list_games, game_lists, users CASCADE;

-- Users table (optional app metadata, links to auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game list games
CREATE TABLE game_list_games (
  id SERIAL PRIMARY KEY,
  game_list_id INTEGER REFERENCES game_lists(id) ON DELETE CASCADE,
  igdb_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_id TEXT,
  first_release_date BIGINT,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the 3 existing auth users into app users table
INSERT INTO users (id, username, profile_image) VALUES
('0ddfbf6d-58e7-465f-8e78-3e44f72a2f41', 'PixelPioneer', 'https://i.pravatar.cc/150?img=1'),
('f7811a80-ab6a-48ac-b717-584d930e0fa8', 'RetroRaven', 'https://i.pravatar.cc/150?img=2'),
('1ad6c87d-7f7e-4039-90a7-fa7eddc8bdcb', 'GameGuru', 'https://i.pravatar.cc/150?img=3');

-- Temporary seed table with the exact game objects you supplied (100 entries)
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
(34800, 'Super Hipster Lumberjack', 'super-hipster-lumberjack', 'co86ki'),
(63844, 'Ace wo Nerae!', 'ace-wo-nerae', 'co2kux'),
(371149, 'The Deal', 'the-deal--2', NULL),
(330684, 'Nightmare Kart: The Old Karts', 'nightmare-kart-the-old-karts', 'co9d8y'),
(349387, 'Gladiato Potato', 'gladiato-potato', NULL),
(293775, 'Final Fantasy XIV Online: Complete Edition', 'final-fantasy-xiv-online-complete-edition--1', 'co7zaz'),
(369967, 'Reduce Yourself', 'reduce-yourself', 'coajwf'),
(120563, 'Yokai Dungeon', 'yokai-dungeon', 'co1rm0'),
(367989, 'Electro Havoc', 'electro-havoc', 'coaheq'),
(128168, 'Sanguine Soul', 'sanguine-soul', 'co272p'),
(28815, 'LEGO Marvel Super Heroes 2', 'lego-marvel-super-heroes-2', 'co27zd'),
(27149, 'Doodle Farm', 'doodle-farm', 'vb7lnlwq8xhfikcvkwek'),
(282461, 'Pultimush', 'pultimush', 'co7v38'),
(194844, 'Chowder: Rump-A-Thump', 'chowder-rump-a-thump', 'co4l46'),
(94975, 'Wubble Bubbles', 'wubble-bubbles', NULL),
(319926, 'Gullet', 'gullet', 'co8y4i'),
(340494, 'Hunter Hitman', 'hunter-hitman--1', 'co9op2'),
(274434, 'Merge Games Horror Bundle', 'merge-games-horror-bundle', 'co7d6t'),
(130742, 'Flashy Maze', 'flashy-maze', 'co2q64'),
(325939, 'DCS World: NS 430 Navigation System for SA342 Gazelle by Eagle Dynamics, Polychop Simulations', 'dcs-world-ns-430-navigation-system-for-sa342-gazelle-by-eagle-dynamics-polychop-simulations', 'co95wz'),
(363948, 'SushiCat: Bento', 'sushicat-bento', 'coacxz'),
(20089, 'Kung Fu Panda: Showdown of Legendary Legends', 'kung-fu-panda-showdown-of-legendary-legends', 'co1wm3'),
(227130, 'Soccer Cup 2022', 'soccer-cup-2022', NULL),
(371216, 'Football Manager Touch 2016', 'football-manager-touch-2016', 'coals3'),
(347330, 'Street Vendor Simulator', 'street-vendor-simulator', 'co9z6v'),
(260316, 'Banners of Ruin: Iris', 'banners-of-ruin-iris', 'co7185'),
(204100, 'Space Shells', 'space-shells', 'co5ma3'),
(350786, 'Maroxyn Drarea', 'maroxyn-drarea', 'coa13x'),
(164895, 'Narvas', 'narvas', 'co3q02'),
(317171, 'Dance Break Dance', 'dance-break-dance', 'co9t6j'),
(55705, 'Trianga''s Project: Battle Splash 2.0', 'triangas-project-battle-splash-2-dot-0', 'co97ku'),
(255115, 'Maid for Loving You', 'maid-for-loving-you--1', 'co6owy'),
(209391, 'Icosi-Do', 'icosi-do', 'co5h5w'),
(205075, 'Security Booth: Director''s Cut', 'security-booth-directors-cut', 'co53r2'),
(127801, 'VolticPistol', 'volticpistol', 'co3ost'),
(27912, 'Grand Theft Auto IV: Complete Edition', 'grand-theft-auto-iv-complete-edition', 'co1twe'),
(321705, 'Bear No Grudge', 'bear-no-grudge', 'co97gb'),
(226044, 'Phones Not Allowed', 'phones-not-allowed', 'co5sd8'),
(123569, 'Warplanes: WW1 Sky Aces', 'warplanes-ww1-sky-aces', 'co3lvi'),
(166754, 'Yeoubul', 'yeoubul', 'co4gkv'),
(214388, 'Coastline to Atmosphere', 'coastline-to-atmosphere', 'co8z5x'),
(146649, 'Coven', 'coven', 'co2z7r'),
(164662, 'Five Nights at Freddy''s: Original Series', 'five-nights-at-freddys-original-series', 'co68yd'),
(226623, 'Smells Like Burnt Rubber', 'smells-like-burnt-rubber', 'co6td0'),
(81577, 'DWK 5: Hinter dem Horizont', 'dwk-5-hinter-dem-horizont', 'co916a'),
(280885, 'Project Vic', 'project-vic', 'co7kd3'),
(318630, 'Sonic Uprising', 'sonic-uprising', 'co8yq3'),
(268876, 'Astral Dodge', 'astral-dodge', 'co75aq'),
(279966, 'Zlime: Return Of Demon Lord', 'zlime-return-of-demon-lord', 'co8gae'),
(100708, 'Destined', 'destined', NULL),
(230577, 'Warrior''s Way', 'warriors-way', 'co854n'),
(319264, 'Zugnaex', 'zugnaex', 'co8x1x'),
(333677, 'Sonic: StarLight', 'sonic-starlight', 'co9gxy'),
(317112, 'Dragons Brew', 'dragons-brew', 'co8tzc'),
(81253, 'Altero', 'altero', 'co5oxl'),
(333673, 'Sonic: Skyline', 'sonic-skyline', 'co9gy0'),
(112949, 'Steel Sword Story', 'steel-sword-story', 'co423f'),
(159959, 'Re.Surs', 're-dot-surs', 'co3ygt'),
(76324, 'OrbusVR', 'orbusvr', 'co22ta'),
(347577, 'Trauma Record', 'trauma-record', 'co9xt5'),
(133438, 'Doofas', 'doofas', 'co62lg'),
(202993, 'You Understand Kawaii', 'you-understand-kawaii', 'co4stt'),
(186327, 'LinearShooter Remixed', 'linearshooter-remixed', 'co4wwg'),
(31023, 'Nanomedix Inc', 'nanomedix-inc', NULL),
(340144, 'Evil Forest', 'evil-forest', 'co9odk'),
(152234, 'Desperados III: Money for the Vultures - Part 1: Late to the Party', 'desperados-iii-money-for-the-vultures-part-1-late-to-the-party', 'co39r5'),
(214962, 'Cursed Colors', 'cursed-colors', 'co55ay'),
(32757, 'Super Space Pug', 'super-space-pug', 'co6jrz'),
(113711, 'Attack of the Giant Mutant Lizard', 'attack-of-the-giant-mutant-lizard', 'co3lrb'),
(76317, 'Flight of the Athena', 'flight-of-the-athena', 'co23yw'),
(19156, 'The Granstream Saga', 'the-granstream-saga', 'co66ib'),
(319234, 'Another Way of Gettin'' Paid', 'another-way-of-gettin-paid', 'co8x0z'),
(332996, 'Braise', 'braise', 'co9g1u'),
(55749, 'Scarlett''s Dungeon', 'scarletts-dungeon', 'co27d5'),
(311200, 'Crowded. Followed.', 'crowded-followed--1', 'co8w3a'),
(245990, 'Luminite Era: Expedition', 'luminite-era-expedition', 'co8e59'),
(368692, 'Through Blood and Dragons: Dragon Wars', 'through-blood-and-dragons-dragon-wars--1', 'coaidj'),
(219550, 'The Chronicles of Overlord', 'the-chronicles-of-overlord', 'co5evs'),
(185945, 'Cryonauts', 'cryonauts', 'co4b6j'),
(339164, 'Maximum Frustration 2', 'maximum-frustration-2', 'co9n5e'),
(326577, 'Puniru ha Kawaii Slime no Game wo "Ano Game" de Tsukuttemita Keredo, Hatashite Anata ha Clear Dekirunoka?', 'puniru-ha-kawaii-slime-no-game-wo-ano-game-de-tsukuttemita-keredo-hatashite-anata-ha-clear-dekirunoka', NULL),
(174111, 'Kaboom: The Suicide Bombing Game', 'kaboom-the-suicide-bombing-game', NULL),
(314671, 'Zombie Tactics', 'zombie-tactics', 'co8q9d'),
(314473, 'Horizons: The End Of Words', 'horizons-the-end-of-words', 'co8zxd'),
(190432, 'Far Away From Home', 'far-away-from-home', 'co4rfw'),
(336006, 'Shadow of The Forgotten', 'shadow-of-the-forgotten', 'co9jti'),
(275087, 'Cozy Space Survivors', 'cozy-space-survivors', 'co865e'),
(114068, 'Cyber Ops', 'cyber-ops', 'co1xm4'),
(348966, 'Dragon Slayer and The Leaf Town', 'dragon-slayer-and-the-leaf-town', 'co9ypb'),
(325571, 'DCS World: Iraq Map', 'dcs-world-iraq-map', 'co95f7'),
(319195, 'Fortress', 'fortress--5', 'co9t77'),
(340720, 'The Pool Invasion', 'the-pool-invasion', 'co9oua'),
(411, 'Final Fantasy XI Online', 'final-fantasy-xi-online', 'co205x'),
(18563, 'Parsec', 'parsec', 'ap4ltb42lektozl2kwkp'),
(237944, 'Train Sim World 3: Amtrak''s Acela', 'train-sim-world-3-amtraks-acela', 'co65tw'),
(156296, 'DCS World: Flaming Cliffs 3', 'dcs-world-flaming-cliffs-3', 'co7lt6'),
(103877, 'Gnumz: Arcane Power', 'gnumz-arcane-power', 'coafez');

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
