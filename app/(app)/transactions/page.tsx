import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import React, { Fragment } from "react";

import config from "@/payload.config";
import { HydrateClientUser } from "../_components/HydrateClientUser";
import { TransactionPageWrapper } from "@/components/ui/TransactionPageWrapper";
import { getTransactionsByUserId } from "@/lib/transactions";

export default async function TransactionsPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { permissions, user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("You must be logged in to access your account.")}&redirect=/account`
    );
  }

  const initialTransactions = await getTransactionsByUserId(user.id);

  return (
    <Fragment>
      <HydrateClientUser permissions={permissions} user={user} />

      <TransactionPageWrapper initialTransactions={initialTransactions} />
    </Fragment>
  );
}
