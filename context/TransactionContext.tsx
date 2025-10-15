"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

type TransactionAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "REMOVE_TRANSACTION"; payload: string }
  | { type: "SET_DELETING"; payload: string | null };

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
}

interface TransactionContextType {
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

const initialState: TransactionState = {
  transactions: [],
  isLoading: true,
  error: null,
  deletingId: null,
};

function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload, isLoading: false };

    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "REMOVE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "SET_DELETING":
      return { ...state, deletingId: action.payload };

    default:
      return state;
  }
}

export function TransactionProvider({
  children,
  initialTransactions,
}: {
  children: ReactNode;
  initialTransactions: Transaction[];
}) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_TRANSACTIONS", payload: initialTransactions });
  }, [initialTransactions]);

  const fetchTransactions = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await fetch("/api/transactions", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error("Failed to load transactions", { description: errorMessage });
    }
  };

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    dispatch({ type: "SET_DELETING", payload: id });

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

      dispatch({ type: "REMOVE_TRANSACTION", payload: id });
      toast.success("Transaction deleted");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete transaction";
      toast.error("Delete failed", { description: errorMessage });
    } finally {
      dispatch({ type: "SET_DELETING", payload: null });
    }
  };

  const value: TransactionContextType = {
    state,
    dispatch,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}
