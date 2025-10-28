import { headers as getHeaders } from "next/headers.js"
import { redirect } from "next/navigation"
import config from "@/payload.config"
import { getPayload } from "payload"

import { HydrateClientUser } from "../_components/HydrateClientUser"
import { AccountForm } from "./AccountForm"

export default async function Account() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("You must be logged in to access your account.")}&redirect=/account`
    )
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-center p-6">
        <HydrateClientUser permissions={permissions} user={user} />
        <AccountForm />
      </div>
    </div>
  )
}
