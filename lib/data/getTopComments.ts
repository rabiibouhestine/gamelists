import sql from "@/lib/db";
import { CommentType } from "@/lib/definitions";

export async function getTopComments(
  list_id: number,
  current_user_id?: string
) {
  const comments = await sql<CommentType[]>`
    SELECT
      c.id AS id,
      c.content,
      c.updated_at,
      u.id AS user_id,
      u.username,
      u.profile_image,
      COUNT(cl.user_id) AS nb_likes,
      ${
        current_user_id
          ? sql`EXISTS (
            SELECT 1 
            FROM comments_likes 
            WHERE comment_id = c.id 
            AND user_id = ${current_user_id}::UUID
          )`
          : sql`FALSE`
      } AS is_liked
    FROM comments c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN comments_likes cl ON c.id = cl.comment_id
    WHERE c.game_list_id = ${list_id}
    GROUP BY c.id, u.id, u.username, u.profile_image
    ORDER BY nb_likes DESC, c.updated_at DESC
    LIMIT 5;
  `;

  return comments;
}
