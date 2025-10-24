"use client";

import { Transaction, TransactionProvider } from "@/context/TransactionContext";
import { TransactionsList } from "./TransactionsList";

interface TransactionPageWrapperProps {
  initialTransactions: Transaction[];
}

function TransactionPageContent() {
  return (
    <div className="min-h-screen">
      <TransactionsList />
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
