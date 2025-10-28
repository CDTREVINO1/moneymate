import Link from "next/link"
import { ArrowBigRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="flex h-full flex-col justify-center bg-card">
      <div className="flex flex-col items-center justify-center space-y-8 py-8 text-center">
        <h1 className="text-4xl leading-none font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          MoneyMate
        </h1>
        <p className="px-6 text-lg font-normal lg:px-48 lg:text-xl">
          MoneyMate is a personal financial management service designed to help
          users track their expenses, create budgets, and achieve financial
          goals. With MoneyMate, you can easily manage your finances, make
          informed decisions, and take control of your financial future.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">
            Start Here <ArrowBigRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}
