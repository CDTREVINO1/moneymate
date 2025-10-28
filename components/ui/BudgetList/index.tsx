"use client"

import { useBudgets } from "@/context/BudgetContext"
import { useTransactions } from "@/context/TransactionContext"
import { format } from "date-fns"
import {
  AlertCircle,
  Loader2,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import {
  formatPeriod,
  getBudgetProgress,
  getProgressColor,
} from "@/lib/budget-utils"
import { getCategoryColor, getCategoryLabel } from "@/lib/categories"
import { Button } from "@/components/ui/button"

import { BudgetFormModal } from "../BudgetFormModal"
import EditBudgetModal from "../EditBudgetModal"

export default function BudgetList() {
  const { state: budgetState, deleteBudget } = useBudgets()
  const { state: transactionState } = useTransactions()

  if (budgetState.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (budgetState.error) {
    return (
      <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        {budgetState.error}
      </div>
    )
  }

  if (budgetState.budgets.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <BudgetFormModal />
        <div className="mt-6 rounded-lg border-2 border-dashed border-secondary py-12 text-center">
          <p className="text-lg">No budgets yet.</p>
          <p className="mt-2">
            Create your first budget to start tracking your spending!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <BudgetFormModal />
      <h2 className="mb-4 text-2xl font-bold">Your Budgets</h2>
      {budgetState.budgets.map((budget) => {
        const progress = getBudgetProgress(
          budget,
          transactionState.transactions
        )
        const progressColor = getProgressColor(
          progress.percentage,
          progress.isOverBudget
        )

        return (
          <div
            key={budget.id}
            className={`rounded-lg border-2 bg-card p-5 transition-shadow hover:shadow-lg ${
              progress.status === "danger"
                ? "border-red-200"
                : progress.status === "warning"
                  ? "border-yellow-200"
                  : "border-gray-200"
            }`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-bold">{budget.name}</h3>
                  {progress.isOverBudget && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(budget.category)}`}
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
                  className="rounded-md p-2 transition-colors disabled:opacity-50"
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
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm text-gray-600">
                  {formatPeriod(budget.period)} Budget
                </span>
                <span className="text-sm font-medium text-gray-700">
                  ${progress.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full ${progressColor} transition-all duration-300`}
                  style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
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
              className={`flex items-center gap-2 rounded-lg p-3 ${
                progress.isOverBudget
                  ? "border border-red-200 bg-red-50"
                  : "border border-green-200 bg-green-50"
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

            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500">
                {format(new Date(budget.startDate), "MMM d, yyyy")} -{" "}
                {budget.endDate
                  ? format(new Date(budget.endDate), "MMM d, yyyy")
                  : "Ongoing"}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
