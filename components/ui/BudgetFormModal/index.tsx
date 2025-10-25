"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, SquarePlus, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { budgetSchema, BudgetFormData } from "@/lib/budget-schema";
import { useBudgets } from "@/context/BudgetContext";
import CategorySelect from "../category-select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export const BudgetFormModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addBudget } = useBudgets();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: "",
      category: "",
      amount: 0,
      period: "monthly",
      startDate: format(new Date(), "yyyy-MM-dd"),
    },
    mode: "onBlur",
  });

  async function onSubmit(data: BudgetFormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          category: data.category,
          amount: data.amount,
          period: data.period,
          startDate: data.startDate,
        }),
      });

      const result = await response.json();

      toast.success("Budget created successfully!");

      addBudget(result);

      form.reset();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create budget");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error("Failed to create budget", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }

    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => form.reset()} variant="outline">
          <SquarePlus className="h-5 w-5" />
          Add a budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add budget</DialogTitle>
          <DialogDescription>Add A New Budget</DialogDescription>
        </DialogHeader>

        <form id="form-add-budget" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-budget-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-add-budget-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Monthly Food Budget"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <CategorySelect control={form.control} />

            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-budget-amount">
                    Amount
                  </FieldLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      id="form-add-budget-amount"
                      aria-invalid={fieldState.invalid}
                      placeholder="500.00"
                      className="pl-10"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="period"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-budget-period">
                    Budget Period
                  </FieldLabel>
                  <select
                    {...field}
                    id="form-add-budget-period"
                    aria-invalid={fieldState.invalid}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-budget-startDate">
                    Start Date
                  </FieldLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <p className="text-sm text-gray-600">
            The end date will be automatically calculated based on the selected
            period.
          </p>
        </form>

        <DialogFooter>
          <Field orientation="horizontal">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              form="form-add-budget"
              type="submit"
              disabled={!form.formState.isDirty || isLoading}
            >
              {isLoading ? "Saving changes..." : "Save Changes"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
