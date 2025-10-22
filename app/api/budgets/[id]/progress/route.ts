import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
    });

    if (!budget) {
      return Response.json({ error: "Budget not found" }, { status: 404 });
    }

    if (budget.userId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate spent amount from transactions in this budget period
    const transactions = await prisma.transaction.findMany({
      where: {
        authorId: user.id,
        category: budget.category,
        date: {
          gte: budget.startDate,
          lte: budget.endDate || new Date(),
        },
      },
    });

    const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;
    const isOverBudget = spent > budget.amount;

    // Calculate days remaining
    const now = new Date();
    const endDate = budget.endDate || new Date();
    const daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Response.json({
      budget: {
        id: budget.id,
        name: budget.name,
        category: budget.category,
        amount: budget.amount,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
      },
      spent: spent,
      remaining: remaining,
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimals
      isOverBudget: isOverBudget,
      daysRemaining: Math.max(0, daysRemaining),
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error("Error fetching budget progress:", error);
    return Response.json(
      { error: "Failed to fetch budget progress" },
      { status: 500 }
    );
  }
}
