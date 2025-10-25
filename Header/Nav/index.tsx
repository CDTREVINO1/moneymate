"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import type { Header as HeaderType } from "@/payload-types";
import { SearchIcon } from "lucide-react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CMSLink } from "@/components/Link";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/app/(app)/_providers/Auth";
import type { User } from "@/payload-types.ts";

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const { user, permissions } = useAuth<User>();
  const navItems = data?.navItems || [];

  return (
    <nav className="flex items-center gap-3">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />;
      })}

      {user && permissions?.canAccessAdmin && (
        <Fragment>
          <Button asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </Fragment>
      )}

      {!user ? (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      ) : (
        <Fragment>
          <Button variant="outline" asChild>
            <Link href="/account">Account</Link>
          </Button>
          <Button asChild>
            <Link href="/logout">Logout</Link>
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
    </nav>
  );
};
