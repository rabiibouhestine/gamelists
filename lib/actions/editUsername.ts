"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UsernameSchema } from "@/lib/schemas";

export async function EditUsername(
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

  // Extract username
  const rawData = {
    username: formData.get("username"),
  };

  // Validate username
  const parseResult = UsernameSchema.safeParse(rawData);
  if (!parseResult.success) {
    const treeErrors = z.treeifyError(parseResult.error);
    return { validationErrors: treeErrors };
  }

  // Update username
  const { error: updateError } = await supabase
    .from("users")
    .update({
      username: parseResult.data.username,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update username:", updateError);
    return {
      validationErrors: {
        properties: {
          username: {
            errors:
              updateError.code === "23505"
                ? [`The username ${parseResult.data.username} already exists.`]
                : [updateError.details],
          },
        },
      },
    };
  }

  redirect(`/users/${parseResult.data.username}`);
}
