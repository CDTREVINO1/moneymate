"use client";

import { format } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import EditTransactionModal from "../EditTransactionModal";
import { Button } from "@/components/ui/button";
import { getCategoryLabel, getCategoryColor } from "@/lib/categories";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionFormModal } from "../TransactionFormModal";

export function TransactionsList() {
  const { state, deleteTransaction } = useTransactions();

  if (state.isLoading) {
      return (
          <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
}

if (state.error) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {state.error}
      </div>
    </div>
  );
}

if (state.transactions.length === 0) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-lg">No transactions yet.</p>
        <p className="mt-2">Start by adding your first transaction!</p>
      </div>
    </div>
  );
}

const total = state.transactions.reduce(
  (sum, transaction) => sum + transaction.amount,
  0
);

return (
  <div className="max-w-4xl mx-auto p-6">
    <TransactionFormModal />
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Your Transactions</h2>
      <div className="text-right">
        <p className="text-sm">Total Spent</p>
        <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
      </div>
    </div>

    <div className="space-y-3">
      {state.transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">
                  {transaction.description}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${getCategoryColor(transaction.category)}`}
                >
                  {getCategoryLabel(transaction.category)}
                </span>
              </div>
              <p className="text-sm">
                {format(new Date(transaction.date), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${transaction.amount.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2">
                <EditTransactionModal
                  transactionId={transaction.id}
                  description={transaction.description}
                  date={transaction.date}
                  amount={transaction.amount}
                  category={transaction.category}
                />

                <Button
                  variant="ghost"
                  onClick={() => deleteTransaction(transaction.id)}
                  disabled={state.deletingId === transaction.id}
                  className="p-2 rounded-md transition-colors disabled:opacity-50"
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
);
}
