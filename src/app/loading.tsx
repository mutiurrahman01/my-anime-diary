import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <Container className="py-12 md:py-24 space-y-16">
      <section className="flex flex-col items-center justify-center text-center space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-[42rem]" />
        <div className="flex gap-4">
          <Skeleton className="h-11 w-32 rounded-lg" />
          <Skeleton className="h-11 w-40 rounded-lg" />
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-lg" />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-lg" />
          ))}
        </div>
      </section>
    </Container>
  )
}
