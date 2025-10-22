import sql from "@/lib/db";
import type { GameListType } from "@/lib/definitions";

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
      WHERE rn <= 8
    ) glg ON glg.game_list_id = gl.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ) total_games ON total_games.game_list_id = gl.id
    WHERE gl.is_public = TRUE
    GROUP BY gl.id, u.id, likes_count.count, comments_count.count, total_games.total_count
    ORDER BY nb_likes DESC, gl.created_at DESC
    LIMIT 5;
  `;

  return lists;
}
