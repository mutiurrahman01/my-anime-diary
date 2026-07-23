"use client"

import { useTransition, useActionState } from "react"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toggleFavoriteAction, type DiaryActionState } from "@/lib/actions/diary.actions"

interface ToggleFavoriteButtonProps {
  entryId: string
  isFavorite: boolean
}

export function ToggleFavoriteButton({ entryId, isFavorite }: ToggleFavoriteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const initialState: DiaryActionState = {
    error: null,
    message: null,
  }
  const [state, formAction] = useActionState(toggleFavoriteAction, initialState)

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          formAction(formData)
        })
      }}
      className="relative z-20"
    >
      <input type="hidden" name="entryId" value={entryId} />
      <Button
        type="submit"
        variant="secondary"
        size="icon"
        disabled={isPending}
        className="absolute right-2 top-2 h-8 w-8 rounded-full border bg-background/80 backdrop-blur hover:bg-background"
      >
        <Heart
          className={isFavorite ? "h-4 w-4 fill-rose-500 text-rose-500" : "h-4 w-4"}
        />
        <span className="sr-only">
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      </Button>
    </form>
  )
}
