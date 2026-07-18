import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { Heart, ImageIcon, Plus } from "lucide-react";

export default function AnimeDetailsPage() {
  return (
    <Container className="py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <ImageIcon className="h-16 w-16" strokeWidth={1} />
          </div>
          <div className="flex gap-2">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add to Diary
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Anime Title Placeholder</h1>
            <p className="text-lg text-muted-foreground">Original Japanese Title</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="rounded-full bg-secondary px-3 py-1 font-medium">TV Series</div>
            <div className="text-muted-foreground">24 Episodes</div>
            <div className="text-muted-foreground">Finished Airing</div>
            <div className="text-muted-foreground">2023</div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Synopsis</h2>
            <p className="leading-relaxed text-muted-foreground">
              This is a placeholder synopsis for the anime. It describes the main plot, characters, and setting. 
              The application does not currently fetch real data, so this static text is shown to demonstrate the layout.
              In a real scenario, this would be populated from a database or an external API.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Rating</h2>
            <div className="flex items-center gap-4">
              <RatingStars rating={8} />
              <span className="text-sm text-muted-foreground">8 / 10</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
