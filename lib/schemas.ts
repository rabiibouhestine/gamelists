import { z } from "zod";

export const GameSchema = z.object({
  igdb_id: z.number(),
  name: z.string(),
  slug: z.string(),
  image_id: z.string().nullable().optional(),
  first_release_date: z.number(),
});

const toBoolean = z
  .union([z.string(), z.boolean()])
  .transform((val) => (typeof val === "string" ? val === "true" : val));

export const ListSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  description: z.string().optional(),
  is_public: toBoolean,
  is_ranked: toBoolean,
  games: z.array(GameSchema).min(1, "A list should have at least one game!"),
});

export const CloneSchema = z.object({
  list_id: z.coerce.number(),
  user_id: z.uuid(),
});

export const UsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

export const AvatarSchema = z
  .instanceof(File)
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only JPEG, PNG, or WEBP images are allowed"
  )
  .refine((file) => file.size <= 1024 * 1024, "File size must be under 1MB");

export const AuthSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be less than 100 characters"),
});

export const DeleteAccountSchema = z.object({
  user_id: z.string(),
  confirmation: z
    .string()
    .refine(
      (str) => str === "delete account",
      "please type 'delete account' below"
    ),
});
