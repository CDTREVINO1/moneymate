"use client"

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { Message } from "../../_components/Message"
import { useAuth } from "../../_providers/Auth"

type FormData = {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { setUser, user, permissions } = useAuth()
  const [changePassword, setChangePassword] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  })

  const password = useRef({})
  password.current = form.watch("password", "")

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
          {
            // Make sure to include cookies with fetch
            body: JSON.stringify(data),
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
          }
        )

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          setSuccess("Successfully updated account.")
          setError("")
          setChangePassword(false)
          form.reset({
            name: json.doc.name,
            email: json.doc.email,
            password: "",
            passwordConfirm: "",
          })
        } else {
          setError("There was a problem updating your account.")
        }
      }
    },
    [user, setUser, form]
  )

  useEffect(() => {
    if (user === null) {
      router.push(`/login?unauthorized=account`)
    }

    // Once user is loaded, reset form to have default values
    if (user) {
      form.reset({
        email: user.email,
        password: "",
        passwordConfirm: "",
      })
    }
  }, [user, router, form, changePassword])

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          {`This is your account dashboard. Here you can update your account information and more.`}
          {user && permissions?.canAccessAdmin && (
            <Fragment>
              <br />
              To manage all users:
              <br />
              <Button variant="destructive" asChild>
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/users`}
                >
                  Login to the admin dashboard
                </Link>
              </Button>
            </Fragment>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-account" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Message error={error} success={success} />
            {!changePassword ? (
              <Fragment>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-account-email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Email"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Fragment>
            ) : (
              <Fragment>
                <p>
                  {"Change your password below, or "}
                  <Button
                    className="cursor-pointer"
                    onClick={() => setChangePassword(!changePassword)}
                    type="button"
                  >
                    cancel
                  </Button>
                  .
                </p>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-account-password">
                        New Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-account-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="New Password"
                        autoComplete="off"
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="passwordConfirm"
                  control={form.control}
                  rules={{
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-account-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-account-confirm-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm Password"
                        autoComplete="off"
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Fragment>
            )}
            <Button
              className="cursor-pointer"
              disabled={!form.formState.isDirty || form.formState.isLoading}
              type="submit"
            >
              {form.formState.isLoading
                ? "Processing"
                : changePassword
                  ? "Change password"
                  : "Update account"}
              <Save />
            </Button>
            <div className="flex flex-row justify-evenly">
              <Button
                className="cursor-pointer"
                onClick={() => setChangePassword(!changePassword)}
                type="button"
              >
                {form.formState.isLoading
                  ? "Processing"
                  : changePassword
                    ? "Update account"
                    : "Change password"}
              </Button>
              <Button asChild>
                <Link href="/logout">Logout</Link>
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
