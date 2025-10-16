import sql from "@/lib/db";
import type { GameType, GameListType } from "@/lib/definitions";

export async function getPopularGameLists() {
  const lists = await sql<GameListType[]>`
    SELECT
      gl.id AS list_id,
      gl.name AS title,
      gl.description,
      u.id AS creator_id,
      u.username AS creator_username,
      u.profile_image AS creator_profile_img,
      COALESCE(likes_count.count, 0) AS nb_likes,
      COALESCE(comments_count.count, 0) AS nb_comments,
      COALESCE(total_games.total_count, 0) AS total_games_count,
      json_agg(
        json_build_object(
          'id', glg.id,
          'name', glg.name,
          'img', glg.image_id
        ) ORDER BY glg.position
      ) AS games
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS count
      FROM likes
      GROUP BY game_list_id
    ) AS likes_count ON likes_count.game_list_id = gl.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS count
      FROM comments
      GROUP BY game_list_id
    ) AS comments_count ON comments_count.game_list_id = gl.id
    LEFT JOIN (
      SELECT *
      FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY game_list_id ORDER BY position) AS rn
        FROM game_list_games
      ) glg_sub
      WHERE rn <= 7
    ) glg ON glg.game_list_id = gl.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ) total_games ON total_games.game_list_id = gl.id
    GROUP BY gl.id, u.id, likes_count.count, comments_count.count, total_games.total_count
    ORDER BY nb_likes DESC, gl.created_at DESC
    LIMIT 10;
  `;

  return lists;
}

export async function getGameLists({
  page = 1,
  limit = 10,
  sortColumn = "created_at",
  orderDirection = "DESC",
  searchTerm = "",
}: {
  page?: number;
  limit?: number;
  sortColumn?: "created_at" | "nb_likes" | "nb_comments" | "total_games_count";
  orderDirection?: "ASC" | "DESC";
  searchTerm?: string;
} = {}) {
  const offset = (page - 1) * limit;

  const validSortColumns = {
    created_at: "gl.created_at",
    nb_likes: "COALESCE(lc.count, 0)",
    nb_comments: "COALESCE(cc.count, 0)",
    total_games_count: "COALESCE(tg.total_count, 0)",
  };
  const sortExpr = validSortColumns[sortColumn] ?? "gl.created_at";
  const direction = orderDirection === "ASC" ? "ASC" : "DESC";

  const whereClause = searchTerm
    ? sql`gl.name ILIKE ${"%" + searchTerm + "%"}`
    : sql`TRUE`;

  // Count total number of results
  const [{ count: total }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM game_lists gl
    WHERE ${whereClause};
  `;

  // Main paginated query
  const results = await sql<GameListType[]>`
    WITH likes_count AS (
      SELECT game_list_id, COUNT(*) AS count
      FROM likes
      GROUP BY game_list_id
    ),
    comments_count AS (
      SELECT game_list_id, COUNT(*) AS count
      FROM comments
      GROUP BY game_list_id
    ),
    total_games AS (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ),
    games_preview AS (
      SELECT *
      FROM (
        SELECT *,
              ROW_NUMBER() OVER (PARTITION BY game_list_id ORDER BY position) AS rn
        FROM game_list_games
      ) glg_sub
      WHERE rn <= 7
    )
    SELECT
      gl.id AS list_id,
      gl.name AS title,
      gl.description,
      u.id AS creator_id,
      u.username AS creator_username,
      u.profile_image AS creator_profile_img,
      COALESCE(lc.count, 0) AS nb_likes,
      COALESCE(cc.count, 0) AS nb_comments,
      COALESCE(tg.total_count, 0) AS total_games_count,
      json_agg(
        json_build_object(
          'id', gp.id,
          'name', gp.name,
          'img', gp.image_id
        ) ORDER BY gp.position
      ) AS games
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    LEFT JOIN likes_count lc ON lc.game_list_id = gl.id
    LEFT JOIN comments_count cc ON cc.game_list_id = gl.id
    LEFT JOIN total_games tg ON tg.game_list_id = gl.id
    LEFT JOIN games_preview gp ON gp.game_list_id = gl.id
    WHERE ${whereClause}
    GROUP BY gl.id, u.id, lc.count, cc.count, tg.total_count
    ORDER BY ${sql.unsafe(`${sortExpr} ${direction}`)}
    LIMIT ${limit} OFFSET ${offset};
  `;

  return { results, total };
}

export async function getGameSlugLists({
  page = 1,
  limit = 10,
  sortColumn = "created_at",
  orderDirection = "DESC",
  gameSlug,
}: {
  page?: number;
  limit?: number;
  sortColumn?: "created_at" | "nb_likes" | "nb_comments" | "total_games_count";
  orderDirection?: "ASC" | "DESC";
  gameSlug?: string;
} = {}) {
  const validPage = page || 1;
  const validLimit = limit || 10;
  const offset = (validPage - 1) * validLimit;

  const validSortColumns = {
    created_at: "gl.created_at",
    nb_likes: "COALESCE(lc.count, 0)",
    nb_comments: "COALESCE(cc.count, 0)",
    total_games_count: "COALESCE(tg.total_count, 0)",
  };
  const sortExpr = validSortColumns[sortColumn] ?? "gl.created_at";
  const direction = orderDirection === "ASC" ? "ASC" : "DESC";

  // WHERE clause: filter by game slug if provided
  const whereClause = gameSlug
    ? sql`gl.id IN (
        SELECT game_list_id
        FROM game_list_games
        WHERE slug = ${gameSlug}
      )`
    : sql`TRUE`;

  // Count total results
  const [{ count: total }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM game_lists gl
    WHERE ${whereClause};
  `;

  // Main paginated query
  const results = await sql<GameListType[]>`
    WITH likes_count AS (
      SELECT game_list_id, COUNT(*) AS count
      FROM likes
      GROUP BY game_list_id
    ),
    comments_count AS (
      SELECT game_list_id, COUNT(*) AS count
      FROM comments
      GROUP BY game_list_id
    ),
    total_games AS (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ),
    games_preview AS (
      SELECT *
      FROM (
        SELECT *,
              ROW_NUMBER() OVER (PARTITION BY game_list_id ORDER BY position) AS rn
        FROM game_list_games
      ) glg_sub
      WHERE rn <= 7
    )
    SELECT
      gl.id AS list_id,
      gl.name AS title,
      gl.description,
      u.id AS creator_id,
      u.username AS creator_username,
      u.profile_image AS creator_profile_img,
      COALESCE(lc.count, 0) AS nb_likes,
      COALESCE(cc.count, 0) AS nb_comments,
      COALESCE(tg.total_count, 0) AS total_games_count,
      json_agg(
        json_build_object(
          'id', gp.id,
          'name', gp.name,
          'img', gp.image_id
        ) ORDER BY gp.position
      ) AS games
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    LEFT JOIN likes_count lc ON lc.game_list_id = gl.id
    LEFT JOIN comments_count cc ON cc.game_list_id = gl.id
    LEFT JOIN total_games tg ON tg.game_list_id = gl.id
    LEFT JOIN games_preview gp ON gp.game_list_id = gl.id
    WHERE ${whereClause}
    GROUP BY gl.id, u.id, lc.count, cc.count, tg.total_count
    ORDER BY ${sql.unsafe(`${sortExpr} ${direction}`)}
    LIMIT ${limit} OFFSET ${offset};
  `;

  return { results, total };
}

export async function getUsernameLists({
  page = 1,
  limit = 10,
  sortColumn = "created_at",
  orderDirection = "DESC",
  username,
}: {
  page?: number;
  limit?: number;
  sortColumn?: "created_at" | "nb_likes" | "nb_comments" | "total_games_count";
  orderDirection?: "ASC" | "DESC";
  username?: string;
} = {}) {
  const validPage = page || 1;
  const validLimit = limit || 10;
  const offset = (validPage - 1) * validLimit;

  const validSortColumns = {
    created_at: "gl.created_at",
    nb_likes: "COALESCE(lc.count, 0)",
    nb_comments: "COALESCE(cc.count, 0)",
    total_games_count: "COALESCE(tg.total_count, 0)",
  };
  const sortExpr = validSortColumns[sortColumn] ?? "gl.created_at";
  const direction = orderDirection === "ASC" ? "ASC" : "DESC";

  // WHERE clause: filter by username if provided
  const whereClause = username ? sql`u.username = ${username}` : sql`TRUE`;

  // Count total results
  const [{ count: total }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    WHERE ${whereClause};
  `;

  // Main paginated query
  const results = await sql<GameListType[]>`
    WITH likes_count AS (
      SELECT game_list_id, COUNT(*) AS count
      FROM likes
      GROUP BY game_list_id
    ),
    comments_count AS (
      SELECT game_list_id, COUNT(*) AS count
      FROM comments
      GROUP BY game_list_id
    ),
    total_games AS (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ),
    games_preview AS (
      SELECT *
      FROM (
        SELECT *,
              ROW_NUMBER() OVER (PARTITION BY game_list_id ORDER BY position) AS rn
        FROM game_list_games
      ) glg_sub
      WHERE rn <= 7
    )
    SELECT
      gl.id AS list_id,
      gl.name AS title,
      gl.description,
      u.id AS creator_id,
      u.username AS creator_username,
      u.profile_image AS creator_profile_img,
      COALESCE(lc.count, 0) AS nb_likes,
      COALESCE(cc.count, 0) AS nb_comments,
      COALESCE(tg.total_count, 0) AS total_games_count,
      json_agg(
        json_build_object(
          'id', gp.id,
          'name', gp.name,
          'img', gp.image_id
        ) ORDER BY gp.position
      ) AS games
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    LEFT JOIN likes_count lc ON lc.game_list_id = gl.id
    LEFT JOIN comments_count cc ON cc.game_list_id = gl.id
    LEFT JOIN total_games tg ON tg.game_list_id = gl.id
    LEFT JOIN games_preview gp ON gp.game_list_id = gl.id
    WHERE ${whereClause}
    GROUP BY gl.id, u.id, lc.count, cc.count, tg.total_count
    ORDER BY ${sql.unsafe(`${sortExpr} ${direction}`)}
    LIMIT ${limit} OFFSET ${offset};
  `;

  return { results, total };
}

export async function fetchGameListInfo(id: number) {
  const gamelist = await sql<GameListType[]>`
    SELECT
      gl.id AS list_id,
      gl.name AS title,
      gl.description,
      gl.is_public,
      gl.is_ranked,
      u.id AS creator_id,
      u.username AS creator_username,
      u.profile_image AS creator_profile_img,
      COALESCE(likes_count.count, 0) AS nb_likes,
      COALESCE(comments_count.count, 0) AS nb_comments,
      COALESCE(total_games.total_count, 0) AS total_games_count
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS count
      FROM likes
      GROUP BY game_list_id
    ) AS likes_count ON likes_count.game_list_id = gl.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS count
      FROM comments
      GROUP BY game_list_id
    ) AS comments_count ON comments_count.game_list_id = gl.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ) AS total_games ON total_games.game_list_id = gl.id
    WHERE gl.id = ${id};
  `;
  return gamelist[0];
}

export async function fetchGameListGames(
  id: number,
  page: number,
  limit: number
) {
  const validPage = page || 1;
  const validLimit = limit || 10;
  const offset = (validPage - 1) * validLimit;

  // First, get the total count
  const totalResult = await sql<{ count: number }[]>`
    SELECT COUNT(*) AS count
    FROM game_list_games
    WHERE game_list_id = ${id};
  `;
  const total = totalResult[0]?.count ?? 0;

  // Then, get the paginated games
  const games = await sql<GameType[]>`
    SELECT
      igdb_id,
      name,
      slug,
      image_id,
      position
    FROM game_list_games
    WHERE game_list_id = ${id}
    ORDER BY position
    LIMIT ${limit} OFFSET ${offset};
  `;

  return { total, games };
}

export async function fetchGameListAllGames(id: number) {
  const games = await sql<GameType[]>`
    SELECT
      igdb_id::int AS igdb_id,
      name,
      slug,
      image_id,
      first_release_date::int AS first_release_date,
      position
    FROM game_list_games
    WHERE game_list_id = ${id}
    ORDER BY position;
  `;

  return { games };
}

export async function fetchUserInfo(username: string) {
  const userInfo = await sql<
    {
      id: string;
      username: string;
      profile_image: string;
      created_at: string;
      nb_likes_made: number;
      nb_comments_made: number;
      nb_lists_created: number;
      nb_following: number;
      nb_followers: number;
    }[]
  >`
    SELECT
      u.id,
      u.username,
      u.profile_image,
      u.created_at,
      COALESCE(likes_made.count, 0) AS nb_likes_made,
      COALESCE(comments_made.count, 0) AS nb_comments_made,
      COALESCE(lists_created.count, 0) AS nb_lists_created,
      COALESCE(following.count, 0) AS nb_following,
      COALESCE(followers.count, 0) AS nb_followers
    FROM users u
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS count
      FROM likes
      GROUP BY user_id
    ) AS likes_made ON likes_made.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS count
      FROM comments
      GROUP BY user_id
    ) AS comments_made ON comments_made.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS count
      FROM game_lists
      GROUP BY user_id
    ) AS lists_created ON lists_created.user_id = u.id
    LEFT JOIN (
      SELECT follower_id, COUNT(*) AS count
      FROM follows
      GROUP BY follower_id
    ) AS following ON following.follower_id = u.id
    LEFT JOIN (
      SELECT followed_id, COUNT(*) AS count
      FROM follows
      GROUP BY followed_id
    ) AS followers ON followers.followed_id = u.id
    WHERE u.username = ${username};
  `;

  return userInfo[0];
}

export const sortOptions = [
  {
    value: "created_at",
    label: "Sort by Creation Date",
  },
  {
    value: "nb_likes",
    label: "Sort by Likes",
  },
  {
    value: "nb_comments",
    label: "Sort by Comments",
  },
  {
    value: "total_games_count",
    label: "Sort by Games",
  },
];

export const orderOptions = [
  {
    value: "DESC",
    label: "Descending",
  },
  {
    value: "ASC",
    label: "Ascending",
  },
];
