import * as React from "react"
import { Star, StarHalf } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number // 1 to 10
  maxRating?: number // default 10
}

export function RatingStars({
  rating,
  maxRating = 10,
  className,
  ...props
}: RatingStarsProps) {
  // Convert 10-point scale to 5-star representation
  const normalizedRating = Math.max(0, Math.min(maxRating, rating))
  const starValue = (normalizedRating / maxRating) * 5

  const fullStars = Math.floor(starValue)
  const hasHalfStar = starValue - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div
      className={cn("flex items-center gap-0.5 text-accent", className)}
      title={`${normalizedRating} / ${maxRating}`}
      {...props}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
      ))}
    </div>
  )
}
