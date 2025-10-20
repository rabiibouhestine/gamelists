"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthSchema } from "@/lib/schemas";

export async function login(
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

  const { error } = await supabase.auth.signInWithPassword(parseResult.data);

  if (error) {
    console.error("Failed to login:", error);
    return {
      validationErrors: {
        errors:
          error.status === 400 ? "Invalid Credentials" : "Failed to login",
        properties: null,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
