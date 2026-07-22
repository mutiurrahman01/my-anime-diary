"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
        aria-label="Toggle Menu"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle className="text-left font-bold">My Anime Diary</SheetTitle>
        <nav className="mt-8 flex flex-col gap-4">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/diary"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            My Diary
          </Link>
          <Link
            href="/favorites"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            Favorites
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary"
          >
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
