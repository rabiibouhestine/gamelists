"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CloneSchema } from "@/lib/schemas";

export async function CloneList(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
) {
  const supabase = await createClient();

  // Extract and validate
  const rawData = {
    list_id: formData.get("list_id"),
    user_id: formData.get("user_id"),
  };

  const parseResult = CloneSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error(
      "Failed to validate clone list form data:",
      parseResult.error
    );
    redirect("/error");
  }

  const { list_id, user_id } = parseResult.data;

  // Fetch list info
  const { data: listData, error: listError } = await supabase
    .from("game_lists")
    .select("name, description, is_public, is_ranked")
    .eq("id", list_id)
    .single();

  if (listError || !listData) {
    console.error("Failed to fetch list info:", listError);
    redirect("/error");
  }

  // Create the new list
  const { data: newListData, error: newListError } = await supabase
    .from("game_lists")
    .insert({
      user_id,
      name: listData.name,
      description: listData.description,
      is_public: listData.is_public,
      is_ranked: listData.is_ranked,
    })
    .select("id")
    .single();

  if (newListError || !newListData) {
    console.error("Failed to create list:", newListError);
    redirect("/error");
  }

  const newListId = newListData.id;

  // Fetch the games of the original list
  const { data: gamesData, error: gamesError } = await supabase
    .from("game_list_games")
    .select("igdb_id, name, slug, image_id, first_release_date, position")
    .eq("game_list_id", list_id);

  if (gamesError) {
    console.error("Failed to fetch games:", gamesError);
    redirect("/error");
  }

  if (gamesData && gamesData.length > 0) {
    // Insert cloned games into the new list
    const clonedGames = gamesData.map((game) => ({
      game_list_id: newListId,
      igdb_id: game.igdb_id,
      name: game.name,
      slug: game.slug,
      image_id: game.image_id,
      first_release_date: game.first_release_date,
      position: game.position,
    }));

    const { error: insertGamesError } = await supabase
      .from("game_list_games")
      .insert(clonedGames);

    if (insertGamesError) {
      console.error("Failed to clone games:", insertGamesError);
      redirect("/error");
    }
  }

  // Redirect to the new list page
  redirect(`/lists/${newListId}`);
}
