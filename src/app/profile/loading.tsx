import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <Container className="space-y-8 py-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-[min(100%,30rem)]" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-[420px] rounded-2xl border" />
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl border" />
            ))}
          </div>
          <Skeleton className="h-40 rounded-2xl border" />
          <Skeleton className="h-28 rounded-2xl border" />
        </div>
      </div>
    </Container>
  )
}