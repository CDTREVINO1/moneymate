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
    /* eslint-disable @next/next/no-img-element */
    <Image
      src="/ehh-logo.png"
      className="dark:brightness-0 dark:invert"
      width={100}
      height={100}
      alt="Emshappyhens logo"
    />
  )
}
