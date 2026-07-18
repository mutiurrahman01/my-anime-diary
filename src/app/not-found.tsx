import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Ghost } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="flex-1 flex items-center justify-center py-12">
      <EmptyState
        icon={Ghost}
        title="Page Not Found"
        description="The anime you are looking for has vanished into thin air."
        action={
          <Link href="/" className={buttonVariants()}>
            Return Home
          </Link>
        }
      />
    </Container>
  );
}
