import Link from "next/link"
import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { Container } from "@/components/layout/container"
import { createClient } from "@/lib/supabase/server"

export default async function SignupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">Get started</p>
          <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground">
            Sign up with email and password. Your profile will be created automatically.
          </p>
        </div>

        <AuthForm mode="signup" redirectTo="/dashboard" />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? {" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  )
}