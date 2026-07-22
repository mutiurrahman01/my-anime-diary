import Link from "next/link"
import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { Container } from "@/components/layout/container"
import { createClient } from "@/lib/supabase/server"

interface LoginPageProps {
  searchParams?: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  const params = searchParams ? await searchParams : undefined
  const redirectTo = params?.next ?? "/dashboard"

  return (
    <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
          <p className="text-sm text-muted-foreground">
            Use your email and password to continue.
          </p>
        </div>

        <AuthForm mode="login" redirectTo={redirectTo} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? {" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Container>
  )
}