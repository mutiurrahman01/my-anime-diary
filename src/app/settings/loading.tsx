import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <Container className="space-y-8 py-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-[min(100%,28rem)]" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl border" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-[520px] rounded-2xl border" />
        <Skeleton className="h-[520px] rounded-2xl border" />
      </div>
    </Container>
  )
}