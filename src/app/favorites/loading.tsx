import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function FavoritesLoading() {
  return (
    <Container className="py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-6 w-[min(100%,28rem)]" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-lg" />
        ))}
      </div>
    </Container>
  )
}
