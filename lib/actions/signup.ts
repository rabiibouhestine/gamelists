"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthSchema } from "@/lib/schemas";

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

export async function signup(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
) {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate fields
  const parseResult = AuthSchema.safeParse(rawData);
  if (!parseResult.success) {
    const treeErrors = z.treeifyError(parseResult.error);
    return { validationErrors: treeErrors };
  }

  // Signup
  const { data: authData, error: authError } = await supabase.auth.signUp(
    parseResult.data
  );
  if (authError) {
    console.error("Failed to register user:", authError);
    return {
      validationErrors: {
        errors:
          authError.status === 422
            ? "A user with this email already exists"
            : "Failed to register user",
        properties: null,
      },
    };
  }

  // Add user profile defaults
  const userId = authData.user?.id;
  const username = generateUsername();

  const { error: insertError } = await supabase.from("users").insert({
    id: userId,
    username,
  });

  if (insertError) {
    console.error("Failed to generate user profile:", insertError);
    return {
      validationErrors: {
        errors: "Failed to generate user profile",
        properties: null,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect(`/users/${username}`);
}
