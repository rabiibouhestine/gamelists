import sql from "@/lib/db";
import type { GameListType } from "@/lib/definitions";
import { notFound } from "next/navigation";

export async function getGameListInfo(id: number) {
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
      COALESCE(total_games.total_count, 0) AS total_games_count
    FROM game_lists gl
    JOIN users u ON gl.user_id = u.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS count
      FROM likes
      GROUP BY game_list_id
    ) AS likes_count ON likes_count.game_list_id = gl.id
    LEFT JOIN (
      SELECT game_list_id, COUNT(*) AS total_count
      FROM game_list_games
      GROUP BY game_list_id
    ) AS total_games ON total_games.game_list_id = gl.id
    WHERE gl.id = ${id};
  `;

  const list = gamelist[0];

  if (!list) {
    // No game list found with this id
    notFound();
  }

  return list;
}
