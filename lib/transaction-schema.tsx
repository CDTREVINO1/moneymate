import { z } from "zod"

import { TRANSACTION_CATEGORIES } from "@/lib/categories"

const validCategories = TRANSACTION_CATEGORIES.map((cat) => cat.id) as [
  string,
  ...string[],
]

export const transactionSchema = z.object({
  description: z.string().min(2).max(50),
  date: z.date(),
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .max(1000000, "Amount is too large"),
  category: z.enum(validCategories, {
    error: () => ({ message: "Please select a valid category" }),
  }),
})

export type TransactionData = z.infer<typeof transactionSchema>
