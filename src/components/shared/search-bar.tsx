import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchBarProps extends React.ComponentProps<typeof Input> {
  wrapperClassName?: string
}

export function SearchBar({ className, wrapperClassName, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search anime..."
        className={cn("w-full bg-muted/50 pl-8", className)}
        {...props}
      />
    </div>
  )
}
