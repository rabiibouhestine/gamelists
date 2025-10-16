"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ListSchema } from "@/lib/schemas";

export async function CreateList(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
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

  const parseResult = ListSchema.safeParse(rawData);

  if (!parseResult.success) {
    const treeErrors = z.treeifyError(parseResult.error);
    return { validationErrors: treeErrors };
  }

  const { name, description, is_public, is_ranked, games } = parseResult.data;

  // Insert new list
  const { data: listData, error: listError } = await supabase
    .from("game_lists")
    .insert({
      user_id: user.id,
      name,
      description,
      is_public,
      is_ranked,
    })
    .select("id")
    .single();

  if (listError || !listData) {
    console.error("Failed to create list:", listError);
    redirect("/error");
  }

  const list_id = listData.id;

  // Insert games
  const rows = games.map((game, i) => ({
    game_list_id: list_id,
    igdb_id: game.igdb_id,
    name: game.name,
    slug: game.slug,
    image_id: game.image_id ?? null,
    first_release_date: game.first_release_date,
    position: i,
  }));

  const { error: gamesError } = await supabase
    .from("game_list_games")
    .insert(rows);

  if (gamesError) {
    console.error("Failed to insert games:", gamesError);
    redirect("/error");
  }

  redirect(`/lists/${list_id}`);
}
