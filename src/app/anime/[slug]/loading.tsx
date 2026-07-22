import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnimeDetailsLoading() {
  return (
    <Container className="space-y-8 py-8">
      <div className="space-y-6 rounded-3xl border border-border bg-card p-6">
        <div className="h-64 rounded-3xl bg-muted" />
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <Skeleton className="h-[420px] rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/5 rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </Container>
  )
}
