import sql from "@/lib/db";
import type { GameType } from "@/lib/definitions";

export async function getGameListGames(
  id: number,
  page?: number,
  limit?: number
) {
  // If page and limit are provided, use pagination
  const isPaginated = page !== undefined && limit !== undefined;

  let total = 0;
  let games: GameType[] = [];

  if (isPaginated) {
    const validPage = page || 1;
    const validLimit = limit || 10;
    const offset = (validPage - 1) * validLimit;

    // Get total count
    const totalResult = await sql<{ count: number }[]>`
      SELECT COUNT(*) AS count
      FROM game_list_games
      WHERE game_list_id = ${id};
    `;
    total = totalResult[0]?.count ?? 0;

    // Get paginated games
    games = await sql<GameType[]>`
      SELECT
        igdb_id::int AS igdb_id,
        name,
        slug,
        image_id,
        first_release_date::int AS first_release_date,
        position
      FROM game_list_games
      WHERE game_list_id = ${id}
      ORDER BY position
      LIMIT ${validLimit} OFFSET ${offset};
    `;
  } else {
    // Get all games
    games = await sql<GameType[]>`
      SELECT
        igdb_id::int AS id,
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
  }

  return isPaginated ? { total, games } : { games };
}
