"use client"

import { format } from "date-fns"
import { Loader2, Trash2 } from "lucide-react"

import { getCategoryColor, getCategoryLabel } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { useTransactions } from "@/context/TransactionContext"

import EditTransactionModal from "../EditTransactionModal"
import { TransactionFormModal } from "../TransactionFormModal"

export function TransactionsList() {
  const { state, deleteTransaction } = useTransactions()

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {state.error}
        </div>
      </div>
    )
  }

  if (state.transactions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <TransactionFormModal />
        <div className="mt-6 rounded-lg border-2 border-dashed border-secondary py-12 text-center">
          <p className="text-lg">No transactions yet.</p>
          <p className="mt-2">Start by adding your first transaction!</p>
        </div>
      </div>
    )
  }

  const total = state.transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  )

  return (
    <div className="mx-auto max-w-4xl p-6">
      <TransactionFormModal />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold md:text-2xl">Your Transactions</h2>
        <div className="text-right">
          <p className="text-xs md:text-sm">Total Spent</p>
          <p className="text-xl font-bold text-blue-600 md:text-3xl">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {state.transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-lg border border-gray-200 bg-card p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <div className="mb-6 flex items-center justify-around md:justify-start md:gap-4">
                  <h3 className="font-semibold md:text-lg">
                    {transaction.description}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(transaction.category)}`}
                  >
                    {getCategoryLabel(transaction.category)}
                  </span>
                </div>
                <p className="text-xs md:text-sm">
                  {format(new Date(transaction.date), "MMMM d, yyyy")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold md:text-2xl">
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex-row gap-2 text-right">
                  <EditTransactionModal
                    transactionId={transaction.id}
                    description={transaction.description}
                    date={transaction.date}
                    amount={transaction.amount}
                    category={transaction.category}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTransaction(transaction.id)}
                    disabled={state.deletingId === transaction.id}
                    title="Delete transaction"
                  >
                    {state.deletingId === transaction.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
