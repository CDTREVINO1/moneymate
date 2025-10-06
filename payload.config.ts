// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { defaultLexical } from "@/fields/defaultLexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { getServerSideURL } from "./utilities/getURL";
import { Footer } from "./Footer/config";
import { Header } from "./Header/config";
import { plugins } from "./plugins";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ["@/components/BeforeLogin"],
      beforeDashboard: ["@/components/BeforeDashboard"],
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          name: "mobile",
          height: 667,
          label: "Mobile",
          width: 375,
        },
      ],
    },
  },
  collections: [Users, Media, Pages, Posts, Categories],
  cors: [getServerSideURL()].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ""].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  editor: defaultLexical,
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
