import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const searchQuerySchema = z.object({
  q: z.string(),
});

export type SearchQueryValues = z.infer<typeof searchQuerySchema>;
