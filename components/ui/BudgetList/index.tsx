"use client";

import { format } from "date-fns";
import {
  Trash2,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import EditBudgetModal from "../EditBudgetModal";
import { Button } from "@/components/ui/button";
import { getCategoryLabel, getCategoryColor } from "@/lib/categories";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import {
  getBudgetProgress,
  getProgressColor,
  formatPeriod,
} from "@/lib/budget-utils";
import { BudgetFormModal } from "../BudgetFormModal";

export default function BudgetList() {
  const { state: budgetState, deleteBudget } = useBudgets();
  const { state: transactionState } = useTransactions();

  if (budgetState.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (budgetState.error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {budgetState.error}
      </div>
    );
  }

  if (budgetState.budgets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <BudgetFormModal />
        <div className="text-center py-12 mt-6 rounded-lg border-2 border-dashed border-secondary">
          <p className="text-lg">No budgets yet.</p>
          <p className="mt-2">
            Create your first budget to start tracking your spending!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <BudgetFormModal />
      <h2 className="text-2xl font-bold mb-4">Your Budgets</h2>
      {budgetState.budgets.map((budget) => {
        const progress = getBudgetProgress(
          budget,
          transactionState.transactions
        );
        const progressColor = getProgressColor(
          progress.percentage,
          progress.isOverBudget
        );

        return (
          <div
            key={budget.id}
            className={`bg-card border-2 rounded-lg p-5 hover:shadow-lg transition-shadow ${
              progress.status === "danger"
                ? "border-red-200"
                : progress.status === "warning"
                  ? "border-yellow-200"
                  : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{budget.name}</h3>
                  {progress.isOverBudget && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(budget.category)}`}
                >
                  {getCategoryLabel(budget.category)}
                </span>
              </div>

              <div className="flex gap-2">
                <EditBudgetModal budget={budget} />

                <Button
                  variant="ghost"
                  onClick={() => deleteBudget(budget.id)}
                  disabled={budgetState.deletingId === budget.id}
                  className="p-2 rounded-md transition-colors disabled:opacity-50"
                  title="Delete budget"
                >
                  {budgetState.deletingId === budget.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm text-gray-600">
                  {formatPeriod(budget.period)} Budget
                </span>
                <span className="text-sm font-medium text-gray-700">
                  ${progress.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${progressColor} transition-all duration-300`}
                  style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-sm font-semibold ${
                    progress.isOverBudget ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {progress.percentage.toFixed(1)}% used
                </span>
                <span className="text-sm text-gray-600">
                  {progress.daysRemaining} days left
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                progress.isOverBudget
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              {progress.isOverBudget ? (
                <>
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Over Budget
                    </p>
                    <p className="text-xs text-red-600">
                      ${Math.abs(progress.remaining).toFixed(2)} over limit
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Remaining
                    </p>
                    <p className="text-xs text-green-600">
                      ${progress.remaining.toFixed(2)} left to spend
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {format(new Date(budget.startDate), "MMM d, yyyy")} -{" "}
                {budget.endDate
                  ? format(new Date(budget.endDate), "MMM d, yyyy")
                  : "Ongoing"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
