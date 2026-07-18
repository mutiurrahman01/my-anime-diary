import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <Container className="py-8 space-y-8">
      <PageHeader title="Profile" description="Manage your public profile and statistics." />
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">OtakuMaster</h2>
          <p className="text-sm text-muted-foreground">Joined July 2024</p>
        </div>
        
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-3xl font-bold text-primary">142</div>
            <div className="text-sm text-muted-foreground">Anime Watched</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-3xl font-bold text-primary">28</div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-3xl font-bold text-primary">8.5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-3xl font-bold text-primary">3,450</div>
            <div className="text-sm text-muted-foreground">Episodes</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
