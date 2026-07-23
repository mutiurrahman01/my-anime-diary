import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function DiaryLoading() {
  return (
    <Container className="space-y-8 py-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-6 w-[min(100%,28rem)]" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-32 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  )
}
