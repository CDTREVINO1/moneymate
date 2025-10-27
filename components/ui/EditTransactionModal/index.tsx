import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionData } from "@/lib/transaction-schema";
import { format } from "date-fns";
import { CalendarIcon, Edit, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "@/context/TransactionContext";
import CategorySelect from "@/components/ui/category-select";

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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type EditTransactionModalProps = {
  transactionId: string;
  description: string;
  date: string;
  amount: number;
  category: string;
};

export default function EditTransactionModal({
  transactionId,
  description,
  date,
  amount,
  category,
}: EditTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateTransaction } = useTransactions();

  const form = useForm<TransactionData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: description,
      amount: amount,
      category: category,
      date: new Date(format(date, "yyyy-MM-dd")),
    },
  });

  async function onSubmit(data: TransactionData) {
    try {
      const response = await fetch("/api/transactions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          transactionId: transactionId,
          description: data.description,
          amount: data.amount,
          date: data.date,
          category: data.category,
        }),
      });

      const result = await response.json();

      toast.success("Transaction updated successfully!");

      updateTransaction(result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to update transaction");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error("Failed to update transaction", {
        description: errorMessage,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" onClick={() => form.reset()} variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>
            Make changes to your transaction here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <form id="form-edit-transaction" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-transaction-description">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Transaction description"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-transaction-date">
                    Date
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

            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-transaction-amount">
                    Amount
                  </FieldLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      id="amount"
                      aria-invalid={fieldState.invalid}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <CategorySelect control={form.control} />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Field orientation="horizontal">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              form="form-edit-transaction"
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
}
