import type { Metadata } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { draftMode } from "next/headers";
import { Footer } from "@/Footer/Component";
import { Header } from "@/Header/Component";
import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import config from "@/payload.config";

import { AdminBar } from "@/components/AdminBar";
import { ThemeProvider } from "next-themes";
import { getServerSideURL } from "@/utilities/getURL";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import { AuthProvider } from "./_providers/Auth";
import { Toaster } from "sonner";
import { NavMenu } from "@/components/ui/nav-menu";

export const dynamic = "force-dynamic";

const oxaniumSans = Oxanium({
  variable: "--font-oxanium-sans",
  subsets: ["latin"],
});

const sourceMono = Source_Code_Pro({
  variable: "--font-source-code-pro-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const { isEnabled } = await draftMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body
        className={`h-screen ${oxaniumSans.variable} ${sourceMono.variable} antialiased font-sans`}
      >
        <AuthProvider api="rest">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
          >
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            {user && <NavMenu />}
            {children}
            <Toaster position="top-right" richColors />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
};
