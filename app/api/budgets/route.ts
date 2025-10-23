import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, amount, period, startDate } = body;

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

    const budget = await prisma.budget.create({
      data: {
        name: name,
        category: category,
        amount: amount,
        period: period,
        startDate: startDate,
        endDate: endDate,
        userId: user.id,
      },
    });

    return Response.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return Response.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    return Response.json({ error: "Failed to create budget" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    const where: any = {
      userId: user.id,
    };

    if (category) {
      where.category = category;
    }

    if (active === "true") {
      where.endDate = {
        gte: new Date(),
      };
    }

    const budgets = await prisma.budget.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return Response.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}
