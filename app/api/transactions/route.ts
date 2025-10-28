import { getAuthenticatedUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const GET = async (request: Request) => {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { authorId: user.id },
      orderBy: {
        date: "desc",
      },
    })

    return Response.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { description, amount, date, category } = body

    if (!description || !amount || !date || !category) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        authorId: user.id,
      },
    })

    return Response.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return Response.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}

export const PATCH = async (request: Request) => {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { description, amount, date, category, transactionId } = body

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.authorId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: any = {}
    if (description !== undefined) updateData.description = description
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (date !== undefined) updateData.date = new Date(date)
    if (category !== undefined) updateData.category = category

    // Never allow updating authorId
    delete updateData.authorId

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
    })

    return Response.json(updated)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return Response.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    )
  }
}

export const DELETE = async (request: Request) => {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id: transactionId } = body

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.authorId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    })

    return Response.json({
      message: "Transaction deleted successfully",
      id: transactionId,
    })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return Response.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    )
  }
}
