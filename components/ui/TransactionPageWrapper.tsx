"use client";

import { Transaction, TransactionProvider } from "@/context/TransactionContext";
import { TransactionInputModal } from "./TransactionInputModal";
import { TransactionsList } from "./TransactionsList";

interface TransactionPageWrapperProps {
  initialTransactions: Transaction[];
}

function TransactionPageContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TransactionInputModal />
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
