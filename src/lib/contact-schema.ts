import { z } from "zod";

const EMAIL_PATTERN = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name needs at least 2 characters")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .refine((value) => z.email().safeParse(value).success, {
      message: "Enter a valid email address",
    })
    .refine((value) => EMAIL_PATTERN.test(value) && !value.includes(".."), {
      message: "Enter a valid email address",
    }),
  message: z
    .string()
    .trim()
    .min(10, "Message needs at least 10 characters")
    .max(4000, "Keep it under 4,000 characters"),
  company_website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export function contactFieldErrors(error: z.ZodError) {
  const fields: Partial<Record<"name" | "email" | "message", string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "name" || key === "email" || key === "message") && !fields[key]) {
      fields[key] = issue.message;
    }
  }
  return fields;
}
