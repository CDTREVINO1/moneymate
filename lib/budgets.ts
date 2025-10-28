import prisma from "@/lib/prisma"

export interface Budget {
  id: string
  name: string
  category: string
  amount: number
  period: string
  startDate: string
  endDate?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export async function getBudgetsByUserId(userId: string): Promise<Budget[]> {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return budgets.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      amount: b.amount,
      period: b.period,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate?.toISOString() || null,
      userId: b.userId,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return []
  }
}

export async function getActiveBudgetsByUserId(
  userId: string
): Promise<Budget[]> {
  try {
    const now = new Date()

    const budgets = await prisma.budget.findMany({
      where: {
        userId: userId,
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return budgets.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      amount: b.amount,
      period: b.period,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate?.toISOString() || null,
      userId: b.userId,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching active budgets:", error)
    return []
  }
}
