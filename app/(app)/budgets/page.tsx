import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import config from "@/payload.config";
import { BudgetPageWrapper } from "@/components/ui/BudgetPageWrapper";
import { getBudgetsByUserId } from "@/lib/budgets";
import { getTransactionsByUserId } from "@/lib/transactions";
import { redirect } from "next/navigation";

export default async function BudgetsPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/login");
  }

  const [initialBudgets, initialTransactions] = await Promise.all([
    getBudgetsByUserId(user.id),
    getTransactionsByUserId(user.id),
  ]);

  return (
    <BudgetPageWrapper
      initialBudgets={initialBudgets}
      initialTransactions={initialTransactions}
    />
  );
}
