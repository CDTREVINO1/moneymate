import { admins } from "@/access/admins"
import { anyone } from "@/access/anyone"
import { slugField } from "@/fields/slug"
import type { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    ...slugField(),
  ],
}
