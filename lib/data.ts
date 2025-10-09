import sql from "@/lib/db";

export async function getRecentGameLists() {
  const lists = await sql`
    SELECT *
    FROM game_lists
  `;

  return lists;
}
