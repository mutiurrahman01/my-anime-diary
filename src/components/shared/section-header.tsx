import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  action?: React.ReactNode
}

export function SectionHeader({
  title,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-6 flex items-center justify-between gap-4", className)}
      {...props}
    >
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  )
}
