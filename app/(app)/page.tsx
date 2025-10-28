import { Fragment } from "react"
import { headers as getHeaders } from "next/headers.js"
import config from "@/payload.config"
import { getPayload } from "payload"

import { getTransactionsByUserId } from "@/lib/transactions"
import Home from "@/components/ui/Home"
import SpendingChart from "@/components/ui/SpendingChart"

import { HydrateClientUser } from "./_components/HydrateClientUser"

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

  if (!user) return <Home />

  const transactions = await getTransactionsByUserId(user.id)

  return (
    <Fragment>
      <HydrateClientUser permissions={permissions} user={user} />
      <SpendingChart transactions={transactions} />
    </Fragment>
  )
}
