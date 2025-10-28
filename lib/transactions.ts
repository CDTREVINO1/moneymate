import prisma from "@/lib/prisma"

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export async function getTransactionsByUserId(
  userId: string
): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        authorId: userId,
      },
    })

    return transactions.map((t) => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      date: t.date.toISOString(),
      category: t.category,
      authorId: t.authorId,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}
