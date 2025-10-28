import React, { Fragment } from "react"
import { headers as getHeaders } from "next/headers.js"
import Link from "next/link"
import config from "@/payload.config"
import { getPayload } from "payload"

import { LogoutPage } from "./LogoutPage"

export default async function Logout() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center p-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              You are already logged out.
            </h1>
            <p>
              {" What would you like to do next? "}
              <br />
              <Link className="underline hover:text-primary" href="/">
                Click here
              </Link>
              {` to go to the home page. To log back in, `}
              <Link className="underline hover:text-primary" href="/login">
                click here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="flex justify-center p-6">
          <LogoutPage />
        </div>
      </div>
    </Fragment>
  )
}
