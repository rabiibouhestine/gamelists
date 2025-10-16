"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function LikeList(
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

  const list_id = formData.get("list_id");
  if (!list_id) {
    console.error("Missing list_id");
    redirect("/error");
  }

  // Check if the user already liked the list
  const { data: existingLike, error: fetchError } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("game_list_id", list_id)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Failed to check existing like:", fetchError);
    redirect("/error");
  }

  if (existingLike) {
    // Unlike (remove like)
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("game_list_id", list_id);

    if (deleteError) {
      console.error("Failed to unlike list:", deleteError);
      redirect("/error");
    }
  } else {
    // Like (add new like)
    const { error: insertError } = await supabase.from("likes").insert({
      user_id: user.id,
      game_list_id: list_id,
    });

    if (insertError) {
      console.error("Failed to like list:", insertError);
      redirect("/error");
    }
  }
}
