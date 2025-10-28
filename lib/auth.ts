import configPromise from "@payload-config"
import { getPayload } from "payload"

export async function getAuthenticatedUser(request: Request) {
  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({ headers: request.headers })

  return user
}
