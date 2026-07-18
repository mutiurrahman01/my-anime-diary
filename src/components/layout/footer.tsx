import React from "react"
import { Container } from "./container"

export function Footer() {
  return (
    <footer className="mt-auto border-t py-6">
      <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} My Anime Diary. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
