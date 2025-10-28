// components/CategorySelect.tsx
import { Controller } from "react-hook-form"

import { TRANSACTION_CATEGORIES } from "@/lib/categories"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CategorySelectProps {
  control: any
  error?: any
}

export default function CategorySelect({
  control,
  error,
}: CategorySelectProps) {
  return (
    <Controller
      name="category"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Select
            {...field}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {TRANSACTION_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

// Optional: Enhanced version with descriptions
export function CategorySelectWithDescriptions({
  control,
  error,
}: CategorySelectProps) {
  return (
    <Controller
      name="category"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Select
            {...field}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {TRANSACTION_CATEGORIES.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  title={category.description}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.value && (
            <p className="mt-1 text-xs text-gray-500">
              {
                TRANSACTION_CATEGORIES.find((c) => c.id === field.value)
                  ?.description
              }
            </p>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
