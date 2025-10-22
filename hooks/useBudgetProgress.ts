"use client";

import { useEffect } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import { getBudgetProgress } from "@/lib/budget-utils";

/**
 * Hook to calculate budget progress using local transaction data
 * This provides real-time updates without additional API calls
 */
export function useBudgetProgress(budgetId: string) {
  const { state: budgetState } = useBudgets();
  const { state: transactionState } = useTransactions();

  const budget = budgetState.budgets.find((b) => b.id === budgetId);

  if (!budget) {
    return null;
  }

  // Calculate progress using local transaction data
  const progress = getBudgetProgress(budget, transactionState.transactions);

  return progress;
}

/**
 * Hook to get all budget progress data
 */
export function useAllBudgetsProgress() {
  const { state: budgetState } = useBudgets();
  const { state: transactionState } = useTransactions();

  return budgetState.budgets.map((budget) =>
    getBudgetProgress(budget, transactionState.transactions)
  );
}

/**
 * Hook to fetch budget progress from API (server data)
 */
export function useFetchBudgetProgress(budgetId: string) {
  const { state, fetchBudgetProgress } = useBudgets();

  useEffect(() => {
    if (budgetId) {
      fetchBudgetProgress(budgetId);
    }
  }, [budgetId]);

  return state.budgetProgress[budgetId] || null;
}
