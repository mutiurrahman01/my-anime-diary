import { cn } from "@/lib/utils"
import React from "react"

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}
