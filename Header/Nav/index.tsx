"use client"

import React, { Fragment } from "react"
import Link from "next/link"
import type { Header as HeaderType } from "@/payload-types"
import type { User } from "@/payload-types.ts"
import { Menu, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { CMSLink } from "@/components/Link"
import { useAuth } from "@/app/(app)/_providers/Auth"

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const { user, permissions } = useAuth<User>()
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center justify-between">
      <div className="hidden items-center gap-3 md:flex">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}

        {!user ? (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        ) : (
          <Fragment>
            <Button variant="outline" asChild>
              <Link href="/account">{user.email}</Link>
            </Button>
            <Button asChild>
              <Link href="/logout">Logout</Link>
            </Button>
          </Fragment>
        )}
        {user && permissions?.canAccessAdmin && (
          <Fragment>
            <Button asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </Fragment>
        )}

        <ThemeToggle />
        <Button variant="ghost" asChild>
          <Link href="/search">
            <span className="sr-only">Search</span>
            <SearchIcon className="w-5 text-primary" />
          </Link>
        </Button>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              <SheetDescription>
                What would you like to do next?
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 flex flex-col space-y-4 px-6">
              {navItems.map(({ link }, i) => {
                return (
                  <SheetClose key={i} asChild>
                    <CMSLink key={i} {...link} appearance="link" />
                  </SheetClose>
                )
              })}

              {!user ? (
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </SheetClose>
              ) : (
                <Fragment>
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link href="/account">{user.email}</Link>
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button asChild>
                      <Link href="/logout">Logout</Link>
                    </Button>
                  </SheetClose>
                </Fragment>
              )}
              {user && permissions?.canAccessAdmin && (
                <Fragment>
                  <SheetClose asChild>
                    <Button asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  </SheetClose>
                </Fragment>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
