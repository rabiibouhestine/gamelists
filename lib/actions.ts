"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CreateListSchema } from "@/lib/schemas";
import sql from "@/lib/db";
import { z } from "zod";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

function generateUsername() {
  const adjectives = [
    "Cozy",
    "Hidden",
    "Fast",
    "Cool",
    "Lazy",
    "Clever",
    "Brave",
    "Quiet",
    "Happy",
    "Sleepy",
    "Crazy",
    "Mysterious",
    "Wild",
    "Tiny",
    "Epic",
  ];
  const nouns = [
    "Panda",
    "Dragon",
    "Tiger",
    "Fox",
    "Wolf",
    "Bear",
    "Eagle",
    "Shark",
    "Ninja",
    "Wizard",
    "Knight",
    "Pirate",
    "Samurai",
    "Hero",
    "Rogue",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  // Use a 4-digit suffix from timestamp to guarantee uniqueness
  const suffix = Date.now().toString().slice(-4);

  return `${adj}${noun}${suffix}`;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error: authError } = await supabase.auth.signUp(data);

  if (authError) {
    redirect("/error");
  }

  // add user profile defaults
  const userId = authData.user?.id;
  if (!userId) throw new Error("User ID not available");
  const username = generateUsername();
  await sql`
    INSERT INTO users (id, username, profile_image)
    VALUES (${userId}, ${username}, 'https://i.pravatar.cc/150')
  `;

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

type ValidationErrorsState = {
  validationErrors: {
    errors: string[];
    properties?: {
      name?: { errors: string[] };
      is_public?: { errors: string[] };
      is_ranked?: { errors: string[] };
      games?: {
        errors: string[];
        items?: {
          errors: string[];
          properties?: {
            id?: { errors: string[] };
            name?: { errors: string[] };
            slug?: { errors: string[] };
            first_release_date?: { errors: string[] };
            cover?:
              | { errors: string[] }
              | {
                  errors: string[];
                  properties?: { image_id?: { errors: string[] } };
                };
          };
        }[];
      };
      description?: { errors: string[] };
    };
  };
};

export async function CreateList(
  initialState: ValidationErrorsState,
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

  const parseResult = CreateListSchema.safeParse(rawData);

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

export async function EditList(
  initialState: ValidationErrorsState,
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

  const parseResult = CreateListSchema.safeParse(rawData);

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
