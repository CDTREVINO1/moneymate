import React from "react"
import Image from "next/image"

interface Props {
  className?: string
  loading?: "lazy" | "eager"
  priority?: "auto" | "high" | "low"
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
  } = props

  const loading = loadingFromProps || "lazy"
  const priority = priorityFromProps || "low"

  return (
    <Image
      src="/moneymate-logo.png"
      className="dark:brightness-0 dark:invert"
      width={100}
      height={100}
      alt="MoneyMate logo"
    />
  )
}
