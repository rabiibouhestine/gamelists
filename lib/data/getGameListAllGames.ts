import sql from "@/lib/db";
import type { GameType } from "@/lib/definitions";

export async function getGameListAllGames(id: number) {
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
