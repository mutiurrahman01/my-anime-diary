import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimeGrid } from "./anime-grid"

export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-3 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/2 mt-2" />
      </div>
    </div>
  )
}

interface AnimeGridSkeletonProps {
  count?: number
}

export function AnimeGridSkeleton({ count = 10 }: AnimeGridSkeletonProps) {
  return (
    <AnimeGrid>
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </AnimeGrid>
  )
}
