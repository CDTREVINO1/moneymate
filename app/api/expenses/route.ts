import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const GET = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: { authorId: user.id },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return Response.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { description, amount, date, category } = body;

    if (!description || !amount || !date || !category) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        authorId: user.id,
      },
    });

    return Response.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return Response.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { description, amount, date, category, transactionId } = body;

    const expense = await prisma.expense.findUnique({
      where: { id: transactionId },
    });

    if (!expense) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }

    if (expense.authorId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (date !== undefined) updateData.date = new Date(date);
    if (category !== undefined) updateData.category = category;

    // Never allow updating authorId
    delete updateData.authorId;

    const updated = await prisma.expense.update({
      where: { id: transactionId },
      data: updateData,
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating expense:", error);
    return Response.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id: expenseId } = body;

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }

    if (expense.authorId !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return Response.json({
      message: "Expense deleted successfully",
      id: expenseId,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return Response.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
};
