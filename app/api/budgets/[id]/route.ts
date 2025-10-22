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

    return Response.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return Response.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

export async function PATCH(
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

    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.category !== undefined)
      updateData.category = body.category;
    if (body.amount !== undefined)
      updateData.amount = body.amount;
    if (body.period !== undefined)
      updateData.period = body.period;

    if (
      body.startDate !== undefined ||
      body.period !== undefined
    ) {
      const startDate = body.startDate
        ? new Date(body.startDate)
        : new Date(budget.startDate);
      const period = body.period || budget.period;

      const endDate = new Date(startDate);
      switch (period) {
        case "weekly":
          endDate.setDate(endDate.getDate() + 7);
          break;
        case "monthly":
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case "yearly":
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      updateData.startDate = startDate;
      updateData.endDate = endDate;
    }

    const updated = await prisma.budget.update({
      where: { id: params.id },
      data: updateData,
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating budget:", error);
    return Response.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

export async function DELETE(
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

    await prisma.budget.delete({
      where: { id: params.id },
    });

    return Response.json({
      message: "Budget deleted successfully",
      id: params.id,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return Response.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
