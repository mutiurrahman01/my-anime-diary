import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { RatingStars } from "./rating-stars"
import { ImageIcon } from "lucide-react"

interface AnimeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  coverImage?: string
  releaseYear?: number
  rating?: number
  slug: string
}

export function AnimeCard({
  title,
  coverImage,
  releaseYear,
  rating,
  slug,
  className,
  ...props
}: AnimeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:border-primary/50 hover:shadow-md",
        className
      )}
      {...props}
    >
      <Link href={`/anime/${slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <ImageIcon className="h-12 w-12" strokeWidth={1} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-card-foreground">
            {title}
          </h3>
          {releaseYear && (
            <p className="text-xs text-muted-foreground">{releaseYear}</p>
          )}
        </div>
        {rating !== undefined && (
          <div className="mt-2">
            <RatingStars rating={rating} />
          </div>
        )}
      </div>
    </div>
  )
}
