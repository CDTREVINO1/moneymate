"use client";

import { Budget, BudgetProvider } from "@/context/BudgetContext";
import { Transaction, TransactionProvider } from "@/context/TransactionContext";

import { BudgetFormModal } from "@/components/ui/BudgetFormModal";
import BudgetList from "./BudgetList";

interface BudgetPageWrapperProps {
  initialBudgets: Budget[];
  initialTransactions: Transaction[]
}

function BudgetPageContent() {
  return (
    <div className="min-h-screen py-8">
      <BudgetFormModal />
      <div className="mt-8">
        <BudgetList />
      </div>
    </div>
  );
}

export function BudgetPageWrapper({ initialBudgets, initialTransactions }: BudgetPageWrapperProps,) {
  return (
    <TransactionProvider initialTransactions={initialTransactions}>
      <BudgetProvider initialBudgets={initialBudgets}>
        <BudgetPageContent />
      </BudgetProvider>
    </TransactionProvider>
  );
}
