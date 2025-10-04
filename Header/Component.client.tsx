"use client"

import Link from "next/link"
import type { Header } from "@/payload-types"

import { Logo } from "@/components/Logo/Logo"

import { HeaderNav } from "./Nav"

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  return (
    <header className="relative z-20">
      <div className="container flex justify-between py-8">
        <Link href="/">
          <Logo
            loading="eager"
            priority="high"
            className="invert dark:invert-0"
          />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
