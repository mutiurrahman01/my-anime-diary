"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle className="text-left font-bold">My Anime Diary</SheetTitle>
        <nav className="mt-8 flex flex-col gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            My Diary
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            Favorites
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
