import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Container className="py-12 md:py-24 space-y-16">
      {/* Hero Section Placeholder */}
      <section className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-primary">
          Your Private Anime Diary
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Track what you watch, rate your favorites, and keep a personal journal of your anime journey.
        </p>
        <div className="flex gap-4">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Search Anime
          </Button>
        </div>
      </section>

      {/* Recent Activity Placeholder */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Recent Additions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[250px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-4"
            >
              <span className="text-sm text-muted-foreground">Anime {i + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
