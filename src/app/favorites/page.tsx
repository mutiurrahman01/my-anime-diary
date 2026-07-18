import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { AnimeGrid } from "@/components/shared/anime-grid";
import { AnimeCard } from "@/components/shared/anime-card";

export default function FavoritesPage() {
  const placeholderFavorites = Array.from({ length: 6 }).map((_, i) => ({
    title: `Favorite Anime ${i + 1}`,
    releaseYear: 2022,
    rating: 10,
    slug: `favorite-anime-${i + 1}`,
  }));

  return (
    <Container className="py-8 space-y-8">
      <PageHeader 
        title="Favorites" 
        description="Your most beloved anime shows." 
      />
      
      <AnimeGrid>
        {placeholderFavorites.map((anime) => (
          <AnimeCard key={anime.slug} {...anime} />
        ))}
      </AnimeGrid>
    </Container>
  );
}
