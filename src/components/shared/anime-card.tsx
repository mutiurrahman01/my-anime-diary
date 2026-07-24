import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { RatingStars } from "./rating-stars"
import { ImageIcon } from "lucide-react"

interface AnimeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  coverImage?: string
  releaseYear?: number
  rating?: number
  slug?: string
  malId?: number | null
}

export function AnimeCard({
  title,
  coverImage,
  releaseYear,
  rating,
  slug,
  malId,
  className,
  ...props
}: AnimeCardProps) {
  const href = slug ? `/anime/${slug}` : malId != null ? `/anime/${malId}` : "/"

  if (process.env.NODE_ENV !== "production") {
    console.log("🔗 AnimeCard:", { title, slug, malId, href })
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:border-primary/50 hover:shadow-md",
        className
      )}
      {...props}
    >
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 33vw"
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
