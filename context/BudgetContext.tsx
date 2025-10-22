"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { toast } from "sonner";

export interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  period: string;
  startDate: string;
  endDate?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  daysRemaining: number;
  transactionCount: number;
}

type BudgetAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_BUDGETS"; payload: Budget[] }
  | { type: "ADD_BUDGET"; payload: Budget }
  | { type: "UPDATE_BUDGET"; payload: Budget }
  | { type: "REMOVE_BUDGET"; payload: string }
  | { type: "SET_DELETING"; payload: string | null }
  | {
      type: "SET_BUDGET_PROGRESS";
      payload: { budgetId: string; progress: BudgetProgress };
    };

interface BudgetState {
  budgets: Budget[];
  budgetProgress: Record<string, BudgetProgress>;
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
}

interface BudgetContextType {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
  fetchBudgets: () => Promise<void>;
  fetchBudgetProgress: (budgetId: string) => Promise<void>;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_BUDGETS":
      return { ...state, budgets: action.payload, isLoading: false };

    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [action.payload, ...state.budgets],
      };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case "REMOVE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
      };

    case "SET_DELETING":
      return { ...state, deletingId: action.payload };

    case "SET_BUDGET_PROGRESS":
      return {
        ...state,
        budgetProgress: {
          ...state.budgetProgress,
          [action.payload.budgetId]: action.payload.progress,
        },
      };

    default:
      return state;
  }
}

export function BudgetProvider({
  children,
  initialBudgets = [],
}: {
  children: ReactNode;
  initialBudgets?: Budget[];
}) {
  const initialState: BudgetState = {
    budgets: initialBudgets,
    budgetProgress: {},
    isLoading: false,
    error: null,
    deletingId: null,
  };

  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const fetchBudgets = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await fetch("/api/budgets", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }

      const data = await response.json();
      dispatch({ type: "SET_BUDGETS", payload: data });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error("Failed to load budgets", { description: errorMessage });
    }
  };

  const fetchBudgetProgress = async (budgetId: string) => {
    try {
      const response = await fetch(`/api/budgets/${budgetId}/progress`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budget progress");
      }

      const progress = await response.json();
      dispatch({
        type: "SET_BUDGET_PROGRESS",
        payload: { budgetId, progress },
      });
    } catch (err) {
      console.error("Error fetching budget progress:", err);
    }
  };

  const addBudget = (budget: Budget) => {
    dispatch({ type: "ADD_BUDGET", payload: budget });
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: "UPDATE_BUDGET", payload: budget });
  };

  const deleteBudget = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    dispatch({ type: "SET_DELETING", payload: id });

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      dispatch({ type: "REMOVE_BUDGET", payload: id });
      toast.success("Budget deleted");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete budget";
      toast.error("Delete failed", { description: errorMessage });
    } finally {
      dispatch({ type: "SET_DELETING", payload: null });
    }
  };

  const value: BudgetContextType = {
    state,
    dispatch,
    fetchBudgets,
    fetchBudgetProgress,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
}
