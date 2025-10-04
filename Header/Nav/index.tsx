"use client";

import React from "react"
import Link from "next/link"
import type { Header as HeaderType } from "@/payload-types"
import { SearchIcon } from "lucide-react"

import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { CMSLink } from "@/components/Link"

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-3">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <ThemeToggle />
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}