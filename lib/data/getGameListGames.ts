import sql from "@/lib/db";
import type { GameType } from "@/lib/definitions";

export async function getGameListGames(
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
