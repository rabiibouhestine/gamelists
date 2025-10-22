import sql from "@/lib/db";
import { redirect } from "next/navigation";

export async function getUserInfo(username: string) {
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

  const user = userInfo[0];

  if (!user) {
    // No user found with this username
    redirect("/error");
  } else {
    return userInfo[0];
  }
}
