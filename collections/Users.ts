import { admins } from "@/access/admins"
import { adminsAndUser } from "@/access/adminsAndUser"
import { anyone } from "@/access/anyone"
import { checkRole } from "@/access/checkRole"
import type { CollectionConfig } from "payload"

import { protectRoles } from "./hooks/protectRoles"

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite: "none",
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  access: {
    admin: ({ req: { user } }) => checkRole(["admin"], user),
    create: anyone,
    delete: admins,
    read: adminsAndUser,
    update: adminsAndUser,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "email",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      access: {
        read: adminsAndUser,
        update: adminsAndUser,
      },
    },
    {
      name: "password",
      type: "password",
      required: true,
      admin: {
        description: "Leave blank to keep the current password.",
      },
    },
    {
      name: "resetPasswordToken",
      type: "text",
      hidden: true,
    },
    {
      name: "resetPasswordExpiration",
      type: "date",
      hidden: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      saveToJWT: true,
      access: {
        read: admins,
        update: admins,
        create: admins,
      },
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
  timestamps: true,
}
