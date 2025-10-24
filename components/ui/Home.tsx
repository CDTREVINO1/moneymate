import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigRight } from "lucide-react";

export default function Home() {
  return (
    <section className="h-full flex flex-col justify-center bg-card">
      <div className="flex flex-col justify-center items-center text-center space-y-8 py-8">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
          MoneyMate
        </h1>
        <p className="text-lg font-normal lg:text-xl sm:px-16 lg:px-48">
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
  );
}
