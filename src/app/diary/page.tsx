import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { AnimeGrid } from "@/components/shared/anime-grid";
import { AnimeCard } from "@/components/shared/anime-card";

export default function DiaryPage() {
  const placeholderDiary = Array.from({ length: 12 }).map((_, i) => ({
    title: `My Diary Entry ${i + 1}`,
    releaseYear: 2023 - (i % 3),
    rating: (i % 10) + 1,
    slug: `diary-entry-${i + 1}`,
  }));

  return (
    <Container className="py-8 space-y-8">
      <PageHeader 
        title="My Diary" 
        description="A complete record of the anime you have watched." 
      />
      
      <AnimeGrid>
        {placeholderDiary.map((anime) => (
          <AnimeCard key={anime.slug} {...anime} />
        ))}
      </AnimeGrid>
    </Container>
  );
}
