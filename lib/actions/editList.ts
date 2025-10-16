"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ListSchema } from "@/lib/schemas";
import type { ListFormValidationErrorsType } from "@/lib/definitions";

export async function EditList(
  initialState: {
    validationErrors: ListFormValidationErrorsType;
  },
  formData: FormData
) {
  const supabase = await createClient();

  // Authenticate
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/error");
  }

  // Extract and validate
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    is_public: formData.get("is_public"),
    is_ranked: formData.get("is_ranked"),
    games: (() => {
      const json = formData.get("games");
      try {
        return json ? JSON.parse(json as string) : [];
      } catch {
        return [];
      }
    })(),
  };

  // Ensure we have an ID
  const list_id = Number(rawData.id);
  if (!list_id || Number.isNaN(list_id)) {
    console.error("Invalid list ID");
    redirect("/error");
  }

  const parseResult = ListSchema.safeParse(rawData);

  if (!parseResult.success) {
    const treeErrors = z.treeifyError(parseResult.error);
    return { validationErrors: treeErrors };
  }

  const { name, description, is_public, is_ranked, games } = parseResult.data;

  // Update list metadata
  const { error: updateError } = await supabase
    .from("game_lists")
    .update({
      name,
      description,
      is_public,
      is_ranked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", list_id)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Failed to update list:", updateError);
    redirect("/error");
  }

  // Clear existing games
  const { error: deleteError } = await supabase
    .from("game_list_games")
    .delete()
    .eq("game_list_id", list_id);

  if (deleteError) {
    console.error("Failed to clear old games:", deleteError);
    redirect("/error");
  }

  // Insert updated games
  const rows = games.map((game, i) => ({
    game_list_id: list_id,
    igdb_id: game.igdb_id,
    name: game.name,
    slug: game.slug,
    image_id: game.image_id ?? null,
    first_release_date: game.first_release_date,
    position: i,
  }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("game_list_games")
      .insert(rows);

    if (insertError) {
      console.error("Failed to insert updated games:", insertError);
      redirect("/error");
    }
  }
  redirect(`/lists/${list_id}`);
}
