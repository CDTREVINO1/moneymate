import React from "react";
import Link from "next/link"
import type { Footer } from "@/payload-types"

import { CMSLink } from "@/components/Link"
import { Logo } from "@/components/Logo/Logo"
import { getCachedGlobal } from "@/utilities/getGlobals"

export async function Footer() {
  const footerData: Footer = await getCachedGlobal("footer", 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="" key={i} {...link} />;
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}