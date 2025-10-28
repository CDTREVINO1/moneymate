import type { User } from "@/payload-types"
import type { FieldHook } from "payload"

// ensure there is always a `user` role
// do not let non-admins change roles
export const protectRoles: FieldHook<{ id: string } & User> = ({
  data,
  req,
}) => {
  const isAdmin =
    req.user?.roles.includes("admin") || data.email === "demo@payloadcms.com" // for the seed script

  if (!isAdmin) {
    return ["user"]
  }

  const userRoles = new Set(data?.roles || [])
  userRoles.add("user")
  return [...userRoles]
}
