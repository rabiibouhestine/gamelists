import sql from "@/lib/db";
import type { GameListGameType, GameListType } from "@/lib/definitions";

export async function getRecentGameLists() {
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
    ORDER BY gl.created_at DESC
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

export async function fetchGameListInfo(id: number) {
  const gamelist = await sql<GameListType[]>`
    SELECT
      gl.id AS list_id,
      gl.name AS title,
      gl.description,
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

export async function fetchGameListGames(id: number) {
  const gamelistGames = await sql<GameListGameType[]>`
    SELECT
      id AS game_id,
      igdb_id,
      name,
      slug,
      image_id,
      position
    FROM game_list_games
    WHERE game_list_id = ${id}
    ORDER BY position;
  `;
  return gamelistGames;
}
