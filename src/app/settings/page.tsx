import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <Container className="py-8 space-y-8">
      <PageHeader title="Settings" description="Manage your account preferences." />
      
      <div className="max-w-xl space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <div className="space-y-2">
            <div className="text-sm font-medium">Email Address</div>
            <div className="text-sm text-muted-foreground">user@example.com</div>
          </div>
          <Button variant="outline">Change Email</Button>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Security</h2>
          <Button variant="outline">Change Password</Button>
        </section>

        <section className="space-y-4 pt-4 border-t border-destructive/20">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </section>
      </div>
    </Container>
  );
}
