"use client";

import { Transaction, TransactionProvider } from "@/context/TransactionContext";
import { TransactionFormModal } from "./TransactionFormModal";
import { TransactionsList } from "./TransactionsList";

interface TransactionPageWrapperProps {
  initialTransactions: Transaction[];
}

function TransactionPageContent() {
  return (
    <div className="min-h-screen py-8">
      <TransactionFormModal />
      <div className="mt-8">
        <TransactionsList />
      </div>
    </div>
  );
}

export function TransactionPageWrapper({
  initialTransactions,
}: TransactionPageWrapperProps) {
  return (
    <TransactionProvider initialTransactions={initialTransactions}>
      <TransactionPageContent />
    </TransactionProvider>
  );
}
