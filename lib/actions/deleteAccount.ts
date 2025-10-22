"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { DeleteAccountSchema } from "@/lib/schemas";

export async function DeleteAccount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
) {
  // Extract raw data
  const rawData = {
    user_id: formData.get("user_id"),
    confirmation: formData.get("confirmation"),
  };

  // Validate data
  const parseResult = DeleteAccountSchema.safeParse(rawData);
  if (!parseResult.success) {
    const treeErrors = z.treeifyError(parseResult.error);
    return { validationErrors: treeErrors };
  }

  // Delete account
  const supabase = await createClient(true);
  const { error } = await supabase.auth.admin.deleteUser(
    parseResult.data.user_id
  );

  if (error) {
    console.error("Failed to delete user:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
