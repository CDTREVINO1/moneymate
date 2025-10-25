"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "../../_components/Message";
import { useAuth } from "../../_providers/Auth";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";
  const redirect = useRef(searchParams.get("redirect"));
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = React.useState<null | string>(null);

  const form = useForm<FormData>({
    defaultValues: {
      email: "demo@payloadcms.com",
      password: "demo",
    },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data);
        if (redirect?.current) {
          router.push(redirect.current);
        } else {
          router.push("/account");
        }
      } catch (_) {
        setError(
          "There was an error with the credentials provided. Please try again."
        );
      }
    },
    [login, router]
  );

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Log In</CardTitle>
        <CardDescription>
          <p>
            {"To log in, use the email "}
            <b>demo@payloadcms.com</b>
            {" with the password "}
            <b>demo</b>
            {". To manage your users, "}
            <Link
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/users`}
            >
              login to the admin dashboard
            </Link>
            .
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Message error={error} />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-email"
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-login-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              className="cursor-pointer"
              disabled={form.formState.isLoading}
              type="submit"
            >
              Login
            </Button>
            <div className="flex flex-row justify-center">
              <Button variant="link" asChild>
                <Link href={`/create-account${allParams}`}>
                  Create an account
                </Link>
              </Button>
              <br />
              <Button variant="link" asChild>
                <Link href={`/recover-password${allParams}`}>
                  Recover your password
                </Link>
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
