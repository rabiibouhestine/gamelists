"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function LikeComment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
) {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/error");
  }

  const comment_id = formData.get("comment_id");
  if (!comment_id) {
    console.error("Missing comment_id");
    redirect("/error");
  }

  // Check if the user already liked the comment
  const { data: existingLike, error: fetchError } = await supabase
    .from("comments_likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("comment_id", comment_id)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Failed to check existing like:", fetchError);
    redirect("/error");
  }

  if (existingLike) {
    // Unlike (remove like)
    const { error: deleteError } = await supabase
      .from("comments_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("comment_id", comment_id);

    if (deleteError) {
      console.error("Failed to unlike comment:", deleteError);
      redirect("/error");
    }
  } else {
    // Like (add new like)
    const { error: insertError } = await supabase
      .from("comments_likes")
      .insert({
        user_id: user.id,
        comment_id: comment_id,
      });

    if (insertError) {
      console.error("Failed to like comment:", insertError);
      redirect("/error");
    }
  }
}
