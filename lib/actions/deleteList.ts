"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function DeleteList(formData: FormData) {
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
    id: formData.get("id"),
  };

  // Update list metadata
  const { error: deleteError } = await supabase
    .from("game_lists")
    .delete()
    .eq("id", rawData.id);

  if (deleteError) {
    console.error("Failed to delete list:", deleteError);
    redirect("/error");
  }

  // get user username
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Failed to fetch username:", deleteError);
    redirect("/");
  }

  redirect(`/users/${userData?.username}`);
}
