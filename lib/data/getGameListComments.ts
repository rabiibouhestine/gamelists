import sql from "@/lib/db";
import type { CommentType } from "@/lib/definitions";

export async function getGameListComments(
  game_list_id: number,
  page?: number,
  limit?: number,
  current_user_id?: string
) {
  const isPaginated = page !== undefined && limit !== undefined;
  let total = 0;
  let comments: CommentType[] = [];

  if (isPaginated) {
    const validPage = page || 1;
    const validLimit = limit || 10;
    const offset = (validPage - 1) * validLimit;

    // Total comment count
    const totalResult = await sql<{ count: number }[]>`
      SELECT COUNT(*) AS count
      FROM comments
      WHERE game_list_id = ${game_list_id};
    `;
    total = totalResult[0]?.count ?? 0;

    // Paginated comments
    comments = await sql<CommentType[]>`
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.updated_at,
        c.user_id,
        u.username,
        u.profile_image,
        COUNT(cl.comment_id)::int AS nb_likes,
        ${
          current_user_id
            ? sql`BOOL_OR(cl.user_id = ${current_user_id}) AS is_liked`
            : sql`false AS is_liked`
        }
      FROM comments c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN comments_likes cl ON cl.comment_id = c.id
      WHERE c.game_list_id = ${game_list_id}
      GROUP BY c.id, u.id
      ORDER BY nb_likes DESC, c.updated_at DESC
      LIMIT ${validLimit} OFFSET ${offset};
    `;
  } else {
    // All comments
    comments = await sql<CommentType[]>`
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.updated_at,
        c.user_id,
        u.username,
        u.profile_image,
        COUNT(cl.comment_id)::int AS nb_likes,
        ${
          current_user_id
            ? sql`BOOL_OR(cl.user_id = ${current_user_id}) AS is_liked`
            : sql`false AS is_liked`
        }
      FROM comments c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN comments_likes cl ON cl.comment_id = c.id
      WHERE c.game_list_id = ${game_list_id}
      GROUP BY c.id, u.id
      ORDER BY nb_likes DESC, c.updated_at DESC
    `;
  }

  return isPaginated ? { total, comments } : { comments };
}
