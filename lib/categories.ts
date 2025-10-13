export interface TransactionCategory {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string; // For future use with icon libraries
}

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  {
    id: "food_dining",
    label: "Food & Dining",
    description: "Groceries, restaurants, takeout, coffee",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "utensils",
  },
  {
    id: "transportation",
    label: "Transportation",
    description: "Gas, public transit, parking, car maintenance",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "car",
  },
  {
    id: "housing",
    label: "Housing",
    description: "Rent, mortgage, property tax, HOA fees",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "home",
  },
  {
    id: "utilities",
    label: "Utilities",
    description: "Electricity, water, gas, internet, phone",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "zap",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    description: "Doctor visits, prescriptions, insurance",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "heart",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    description: "Movies, concerts, hobbies, streaming services",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "film",
  },
  {
    id: "shopping",
    label: "Shopping",
    description: "Clothing, electronics, personal items",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "shopping-bag",
  },
  {
    id: "education",
    label: "Education",
    description: "Tuition, books, courses, supplies",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "book",
  },
  {
    id: "personal_care",
    label: "Personal Care",
    description: "Haircuts, gym, spa, beauty products",
    color: "bg-teal-100 text-teal-800 border-teal-200",
    icon: "scissors",
  },
  {
    id: "insurance",
    label: "Insurance",
    description: "Health, auto, home, life insurance",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    icon: "shield",
  },
  {
    id: "debt_loans",
    label: "Debt & Loans",
    description: "Credit card payments, student loans, personal loans",
    color: "bg-slate-100 text-slate-800 border-slate-200",
    icon: "credit-card",
  },
  {
    id: "savings_investments",
    label: "Savings & Investments",
    description: "401k, IRA, stocks, emergency fund",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "trending-up",
  },
  {
    id: "pets",
    label: "Pets",
    description: "Pet food, vet visits, grooming, supplies",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "paw-print",
  },
  {
    id: "travel",
    label: "Travel",
    description: "Flights, hotels, vacation expenses",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    icon: "plane",
  },
  {
    id: "gifts_donations",
    label: "Gifts & Donations",
    description: "Presents, charity, tips",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    icon: "gift",
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    description: "Netflix, Spotify, software, memberships",
    color: "bg-violet-100 text-violet-800 border-violet-200",
    icon: "repeat",
  },
  {
    id: "taxes",
    label: "Taxes",
    description: "Income tax, property tax, other taxes",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "file-text",
  },
  {
    id: "other",
    label: "Other",
    description: "Miscellaneous expenses",
    color: "bg-neutral-100 text-neutral-800 border-neutral-200",
    icon: "more-horizontal",
  },
];

// Helper function to get category by ID
export function getCategoryById(id: string): TransactionCategory | undefined {
  return TRANSACTION_CATEGORIES.find((cat) => cat.id === id);
}

// Helper function to get category label
export function getCategoryLabel(id: string): string {
  return getCategoryById(id)?.label || "Unknown";
}

// Helper function to get category color
export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color || "bg-gray-100 text-gray-800";
}

// For form select options
export function getCategoryOptions() {
  return TRANSACTION_CATEGORIES.map((cat) => ({
    value: cat.id,
    label: cat.label,
  }));
}
