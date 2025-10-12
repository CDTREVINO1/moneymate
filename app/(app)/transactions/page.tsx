import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import React, { Fragment } from "react";

import config from "@/payload.config";
import { HydrateClientUser } from "../_components/HydrateClientUser";
import { TransactionInputForm } from "./TransactionInputForm";
import { TransactionsList } from "./TransactionsList";

export default async function TransactionsPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { permissions, user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("You must be logged in to access your account.")}&redirect=/account`
    );
  }

  return (
    <Fragment>
      <HydrateClientUser permissions={permissions} user={user} />
      <div>Transactions Page</div>

      <TransactionInputForm />

      <TransactionsList />
    </Fragment>
  );
}
