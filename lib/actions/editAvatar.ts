"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AvatarSchema } from "@/lib/schemas"; // same schema from earlier

export async function EditAvatar(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
) {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/error");
  }

  // Extract file and username
  const file = formData.get("avatar");
  const username = formData.get("username");

  // Validate file
  const parseResult = AvatarSchema.safeParse(file);
  if (!parseResult.success) {
    const treeErrors = z.treeifyError(parseResult.error);
    return { validationErrors: treeErrors };
  }

  const validatedFile = parseResult.data;
  const fileExt = validatedFile.name.split(".").pop();
  const newImageId = Date.now(); // numeric unique ID
  const fileName = `${newImageId}.${fileExt}`;
  const filePath = `${fileName}`;

  // Get current profile image URL from DB
  const { data: userData, error: userFetchError } = await supabase
    .from("users")
    .select("profile_image")
    .eq("id", user.id)
    .single();

  if (userFetchError) {
    console.error("Failed to fetch current profile image:", userFetchError);
  }

  const oldImageUrl = userData?.profile_image || null;

  // Upload new image to storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, validatedFile, {
      upsert: true,
      contentType: validatedFile.type,
    });

  if (uploadError) {
    console.error("Failed to upload avatar:", uploadError);
    return {
      validationErrors: {
        errors: "Failed to upload avatar.",
      },
    };
  }

  // Get public URL for new image
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // Update profile_image in DB
  const { error: updateError } = await supabase
    .from("users")
    .update({
      profile_image: publicUrl,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update profile image:", updateError);
    return {
      validationErrors: {
        errors: "Failed to update profile image.",
      },
    };
  }

  // Delete old image if it exists
  if (oldImageUrl) {
    try {
      // Extract filename from oldImageUrl (last part of path)
      const oldFileName = oldImageUrl.split("/").pop();
      if (oldFileName) {
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([oldFileName]);
        if (deleteError) {
          console.warn("Failed to delete old image:", deleteError.message);
        }
      }
    } catch (err) {
      console.warn("Error cleaning up old image:", err);
    }
  }

  redirect(`/users/${username}`);
}
