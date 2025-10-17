"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function FollowUser(
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

  const user_id = formData.get("user_id");
  if (!user_id) {
    console.error("Missing user_id");
    redirect("/error");
  }

  // Check if the user already followed the user
  const { data: existingFollow, error: fetchError } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", user.id)
    .eq("followed_id", user_id)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Failed to check existing like:", fetchError);
    redirect("/error");
  }

  if (existingFollow) {
    // Remove follow
    const { error: deleteError } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("followed_id", user_id);

    if (deleteError) {
      console.error("Failed to unfollow user:", deleteError);
      redirect("/error");
    }
  } else {
    // Follow
    const { error: insertError } = await supabase.from("follows").insert({
      follower_id: user.id,
      followed_id: user_id,
    });

    if (insertError) {
      console.error("Failed to follow user:", insertError);
      redirect("/error");
    }
  }
}
