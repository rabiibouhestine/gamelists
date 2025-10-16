"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function LikeList(formData: FormData) {
  const supabase = await createClient();

  // Authenticate
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/error");
  }

  // Extract id
  const rawData = {
    list_id: formData.get("list_id"),
  };

  // Update list metadata
  const { error: deleteError } = await supabase.from("likes").insert({
    user_id: user.id,
    game_list_id: rawData.list_id,
  });

  if (deleteError) {
    console.error("Failed to like list:", deleteError);
    redirect("/error");
  }

  redirect(`/lists/${rawData.list_id}`);
}
