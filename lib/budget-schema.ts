import { z } from "zod"

import { TRANSACTION_CATEGORIES } from "@/lib/categories"

const validCategories = TRANSACTION_CATEGORIES.map((cat) => cat.id) as [
  string,
  ...string[],
]

export const budgetSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(100, "Budget name is too long"),
  category: z.enum(validCategories, {
    error: () => ({ message: "Please select a valid category" }),
  }),
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .max(1000000, "Amount is too large"),
  period: z.enum(["weekly", "monthly", "yearly"], {
    error: () => ({ message: "Please select a valid period" }),
  }),
  startDate: z.date(),
})

export type BudgetFormData = z.infer<typeof budgetSchema>
