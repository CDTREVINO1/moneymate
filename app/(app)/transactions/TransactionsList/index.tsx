"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import EditTransactionModal from "../EditTransactionModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCategoryLabel, getCategoryColor } from "@/lib/categories";

type Transactions = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/transactions", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error("Failed to fetch transactions", {
        description: errorMessage,
      });
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/transactions`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to delete transaction"
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const total = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={fetchTransactions}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg">No transactions yet.</p>
          <p className="text-gray-500 mt-2">
            Start by adding your first transaction!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Transactions</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-blue-600">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                <p className="text-sm text-gray-600">
                  {format(new Date(transaction.date), "MMMM d, yyyy")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
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
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title="Delete transaction"
                  >
                    {deletingId === transaction.id ? (
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

      <button
        onClick={fetchTransactions}
        className="mt-6 w-full py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
      >
        Refresh List
      </button>
    </div>
  );
}
