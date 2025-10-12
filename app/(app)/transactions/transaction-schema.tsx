import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(2).max(50),
  date: z.date(),
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .max(1000000, "Amount is too large"),
  category: z.string().min(2).max(50),
});
