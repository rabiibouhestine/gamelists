"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql from "@/lib/db";

import { createClient } from "@/utils/supabase/server";

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

export async function CreateList(formData: FormData) {
  const supabase = await createClient();

  // Get the current authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/error");
  }

  // Parse form data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const is_public = (formData.get("is_public") as string) === "true";
  const is_ranked = (formData.get("is_ranked") as string) === "true";
  const gamesJson = formData.get("games") as string;

  const games = JSON.parse(gamesJson) as {
    id: number;
    name: string;
    slug: string;
    cover?: { image_id: string };
  }[];

  // Insert the new game list
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
    .single(); // get the inserted id

  if (listError || !listData) {
    console.error("Failed to create list:", listError);
    redirect("/error");
  }

  const list_id = listData.id;

  // Insert all games in a single bulk insert
  if (games.length > 0) {
    const rows = games.map((game, i) => ({
      game_list_id: list_id,
      igdb_id: game.id,
      name: game.name,
      slug: game.slug,
      image_id: game.cover?.image_id ?? null,
      position: i,
    }));

    const { error: gamesError } = await supabase
      .from("game_list_games")
      .insert(rows);

    if (gamesError) {
      console.error("Failed to insert games:", gamesError);
      redirect("/error");
    }
  }

  // Redirect
  redirect(`/lists/${list_id}`);
}
