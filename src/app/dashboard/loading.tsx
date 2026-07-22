import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <Container className="space-y-10 py-8 md:py-12">
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-6 w-[min(100%,28rem)]" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl border" />
        ))}
      </div>

      <Skeleton className="h-[340px] rounded-2xl border" />
      <Skeleton className="h-[260px] rounded-2xl border" />
    </Container>
  )
}