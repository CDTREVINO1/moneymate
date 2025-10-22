export interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  period: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string | Date;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  daysRemaining: number;
  status: "good" | "warning" | "danger";
}

/**
 * Calculate total spent in a category for a given period
 */
export function calculateSpentInCategory(
  transactions: Transaction[],
  category: string,
  startDate: Date,
  endDate: Date
): number {
  return transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return t.category === category && tDate >= startDate && tDate <= endDate;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate budget progress including spent, remaining, and percentage
 */
export function getBudgetProgress(
  budget: Budget,
  transactions: Transaction[]
): BudgetProgress {
  const startDate = new Date(budget.startDate);
  const endDate = budget.endDate ? new Date(budget.endDate) : new Date();

  const spent = calculateSpentInCategory(
    transactions,
    budget.category,
    startDate,
    endDate
  );

  const remaining = budget.amount - spent;
  const percentage = (spent / budget.amount) * 100;
  const isOverBudget = spent > budget.amount;

  // Calculate days remaining
  const now = new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  // Determine status
  let status: "good" | "warning" | "danger" = "good";
  if (isOverBudget) {
    status = "danger";
  } else if (percentage >= 80) {
    status = "warning";
  }

  return {
    budget,
    spent: Math.round(spent * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    isOverBudget,
    daysRemaining,
    status,
  };
}

/**
 * Check if a budget is over the limit
 */
export function isOverBudget(budget: Budget, spent: number): boolean {
  return spent > budget.amount;
}

/**
 * Calculate remaining budget
 */
export function getRemainingBudget(budget: Budget, spent: number): number {
  return Math.round((budget.amount - spent) * 100) / 100;
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressColor(
  percentage: number,
  isOverBudget: boolean
): string {
  if (isOverBudget) return "bg-red-500";
  if (percentage >= 80) return "bg-yellow-500";
  return "bg-green-500";
}

/**
 * Get status color classes for budget cards
 */
export function getStatusColorClasses(status: "good" | "warning" | "danger"): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "good":
      return {
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-200",
      };
    case "warning":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-200",
      };
    case "danger":
      return {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
      };
  }
}

/**
 * Format period for display
 */
export function formatPeriod(period: string): string {
  const periods: Record<string, string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  };
  return periods[period] || period;
}

/**
 * Check if budget is currently active (within date range)
 */
export function isBudgetActive(budget: Budget): boolean {
  const now = new Date();
  const startDate = new Date(budget.startDate);
  const endDate = budget.endDate ? new Date(budget.endDate) : new Date();

  return now >= startDate && now <= endDate;
}
