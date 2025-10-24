// components/SpendingChart.tsx
"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Transaction } from "@/context/TransactionContext";
import { getCategoryLabel } from "@/lib/categories";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SpendingChartProps {
  transactions: Transaction[];
  title?: string;
  showTotal?: boolean;
}

// Color palette for categories
const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#84cc16", // lime
  "#f43f5e", // rose
];

export default function SpendingChart({
  transactions,
  title = "Spending Breakdown",
  showTotal = true,
}: SpendingChartProps) {
  // Calculate spending by category
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;
    });

    const total = Object.values(categoryTotals).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        name: getCategoryLabel(category),
        value: amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom label for pie chart
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">${data.value.toFixed(2)}</p>
          <p className="text-xs">{data.percentage.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 mb-3" />
          <p>No spending data available</p>
          <p className="text-sm mt-1">
            Add some transactions to see your spending breakdown
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow p-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {showTotal && (
          <div className="text-right">
            <p className="text-sm">Total Spent</p>
            <p className="text-2xl font-bold">${totalSpending.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => {
                const item = chartData.find((d) => d.name === value);
                return `${value} (${item?.percentage.toFixed(1)}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      <div className="mt-6 space-y-2">
        {chartData.slice(0, 5).map((item, index) => (
          <div
            key={item.category}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold">
                ${item.value.toFixed(2)}
              </span>
              <span className="text-xs ml-2">
                ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
        {chartData.length > 5 && (
          <p className="text-xs text-center pt-2">
            +{chartData.length - 5} more{" "}
            {chartData.length - 5 === 1 ? "category" : "categories"}
          </p>
        )}
      </div>
    </div>
  );
}
