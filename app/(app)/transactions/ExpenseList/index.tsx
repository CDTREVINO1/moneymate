"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import EditTransactionModal from "../EditTransactionModal";

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-800",
  transport: "bg-blue-100 text-blue-800",
  utilities: "bg-yellow-100 text-yellow-800",
  entertainment: "bg-purple-100 text-purple-800",
  healthcare: "bg-red-100 text-red-800",
  shopping: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800",
};

const categoryLabels: Record<string, string> = {
  food: "Food & Dining",
  transport: "Transportation",
  utilities: "Utilities",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  shopping: "Shopping",
  other: "Other",
};

// IDEA: Change this to a server component and fetch the transactions from here

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/expenses", {
        method: "GET",
        credentials: "include", // Important: includes cookies for Payload auth
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/expenses`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      // Remove from local state
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
          onClick={fetchExpenses}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg">No expenses yet.</p>
          <p className="text-gray-500 mt-2">
            Start by adding your first expense!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Expenses</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-blue-600">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">
                    {expense.description}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      categoryColors[expense.category] || categoryColors.other
                    }`}
                  >
                    {categoryLabels[expense.category] || expense.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(expense.date), "MMMM d, yyyy")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <EditTransactionModal
                    transactionId={expense.id}
                    description={expense.description}
                    date={expense.date}
                    amount={expense.amount}
                    category={expense.category}
                  />

                  {/* IDEA: CHanges this to shadcn button component */}
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title="Delete expense"
                  >
                    {deletingId === expense.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={fetchExpenses}
        className="mt-6 w-full py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
      >
        Refresh List
      </button>
    </div>
  );
}
