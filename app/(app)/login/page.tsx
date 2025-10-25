import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import React, { Fragment } from "react";

import config from "../../../payload.config";
import { LoginForm } from "./LoginForm";

export default async function Login() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  if (user) {
    redirect(
      `/account?message=${encodeURIComponent("You are already logged in.")}`
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-center p-6">
        <LoginForm />
      </div>
    </div>
  );
}
