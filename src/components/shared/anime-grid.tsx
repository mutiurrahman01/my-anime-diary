import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AnimeGrid({ children, className, ...props }: AnimeGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
