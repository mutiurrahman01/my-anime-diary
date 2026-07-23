"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2, Star, StarOff } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  addToDiaryAction,
  deleteDiaryEntryAction,
  toggleFavoriteAction,
  updateDiaryAction,
  type DiaryActionState,
} from "@/lib/actions/diary.actions"
import type { UserAnimeRow, WatchStatus } from "@/types/database"

const watchStatusOptions: Array<{ value: WatchStatus; label: string }> = [
  { value: "PLAN_TO_WATCH", label: "Plan to watch" },
  { value: "WATCHING", label: "Watching" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "DROPPED", label: "Dropped" },
]

const initialState: DiaryActionState = {
  error: null,
  message: null,
}

function formatStatus(value: WatchStatus) {
  return value.replaceAll("_", " ").toLowerCase()
}

function ActionMessage({ state }: { state: DiaryActionState }) {
  if (state.error) {
    return <p className="text-sm text-destructive">{state.error}</p>
  }

  if (state.message) {
    return <p className="text-sm text-emerald-600">{state.message}</p>
  }

  return null
}

type DiaryEntryDialogProps = {
  animeId: string
  animeTitle: string
  entry?: UserAnimeRow | null
  isLoggedIn: boolean
}

export function DiaryEntryDialog({ animeId, animeTitle, entry, isLoggedIn }: DiaryEntryDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState({
    watchStatus: (entry?.watch_status ?? "PLAN_TO_WATCH") as WatchStatus,
    episodesWatched: entry?.episodes_watched ?? 0,
    rating: entry?.rating ?? 0,
    favorite: entry?.favorite ?? false,
    notes: entry?.notes ?? "",
  })

  useEffect(() => {
    setFormState({
      watchStatus: (entry?.watch_status ?? "PLAN_TO_WATCH") as WatchStatus,
      episodesWatched: entry?.episodes_watched ?? 0,
      rating: entry?.rating ?? 0,
      favorite: entry?.favorite ?? false,
      notes: entry?.notes ?? "",
    })
  }, [entry])

  const action = entry ? updateDiaryAction : addToDiaryAction
  const [submitState, submitAction, submitPending] = useActionState(action, initialState)
  const [favoriteState, favoriteAction, favoritePending] = useActionState(toggleFavoriteAction, initialState)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteDiaryEntryAction, initialState)

  useEffect(() => {
    if (submitState.message) {
      setOpen(false)
      router.refresh()
    }
  }, [router, submitState.message])

  useEffect(() => {
    if (favoriteState.message || deleteState.message) {
      router.refresh()
    }
  }, [deleteState.message, favoriteState.message, router])

  if (!isLoggedIn) {
    return (
      <Button type="button" onClick={() => router.push("/login")}>
        Login to Add
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {entry ? (
          <>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button type="button" variant="default" />}>
                Edit Entry
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit diary entry</DialogTitle>
                  <DialogDescription>
                    Update your progress for {animeTitle} and keep your notes in sync.
                  </DialogDescription>
                </DialogHeader>

                <form action={submitAction} className="space-y-4">
                  <input type="hidden" name="animeId" value={animeId} />
                  <input type="hidden" name="entryId" value={entry.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Status</span>
                      <Select
                        name="watchStatus"
                        value={formState.watchStatus}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            watchStatus: event.target.value as WatchStatus,
                          }))
                        }
                      >
                        {watchStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </label>

                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Episodes watched</span>
                      <Input
                        type="number"
                        min="0"
                        name="episodesWatched"
                        value={formState.episodesWatched}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            episodesWatched: Number(event.target.value),
                          }))
                        }
                      />
                    </label>

                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Rating</span>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 10 }, (_, index) => {
                          const starValue = index + 1
                          const active = formState.rating >= starValue

                          return (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => setFormState((current) => ({ ...current, rating: starValue }))}
                              className="text-amber-500"
                            >
                              {active ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                            </button>
                          )
                        })}
                        <span className="text-sm text-muted-foreground">
                          {formState.rating ? `${formState.rating}/10` : "No rating"}
                        </span>
                      </div>
                      <Input type="hidden" name="rating" value={formState.rating} />
                    </label>

                    <label className="flex items-center gap-2 rounded-lg border border-input p-3 text-sm">
                      <input
                        type="checkbox"
                        name="favorite"
                        checked={formState.favorite}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, favorite: event.target.checked }))
                        }
                        className="h-4 w-4"
                      />
                      <span className="font-medium">Favorite this anime</span>
                    </label>
                  </div>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Notes</span>
                    <Textarea
                      name="notes"
                      value={formState.notes}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, notes: event.target.value }))
                      }
                      placeholder="Write a few thoughts about this anime..."
                    />
                  </label>

                  <ActionMessage state={submitState} />

                  <DialogFooter className="flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <form action={deleteAction} className="inline-flex">
                      <input type="hidden" name="entryId" value={entry.id} />
                      <Button type="submit" variant="destructive" disabled={deletePending}>
                        {deletePending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Removing
                          </>
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    </form>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitPending}>
                        {submitPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <form action={favoriteAction} className="inline-flex">
              <input type="hidden" name="entryId" value={entry.id} />
              <Button type="submit" variant="outline" disabled={favoritePending}>
                {favoritePending ? <Loader2 className="h-4 w-4 animate-spin" /> : formState.favorite ? "★ Favorite" : "☆ Favorite"}
              </Button>
            </form>
          </>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button type="button" />}>
              Add to Diary
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add to your diary</DialogTitle>
                <DialogDescription>
                  Track your progress for {animeTitle} and keep your notes in sync.
                </DialogDescription>
              </DialogHeader>

              <form action={submitAction} className="space-y-4">
                <input type="hidden" name="animeId" value={animeId} />
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Status</span>
                    <Select
                      name="watchStatus"
                      value={formState.watchStatus}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          watchStatus: event.target.value as WatchStatus,
                        }))
                      }
                    >
                      {watchStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Episodes watched</span>
                    <Input
                      type="number"
                      min="0"
                      name="episodesWatched"
                      value={formState.episodesWatched}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          episodesWatched: Number(event.target.value),
                        }))
                      }
                    />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Rating</span>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 10 }, (_, index) => {
                        const starValue = index + 1
                        const active = formState.rating >= starValue

                        return (
                          <button
                            key={starValue}
                            type="button"
                            onClick={() => setFormState((current) => ({ ...current, rating: starValue }))}
                            className="text-amber-500"
                          >
                            {active ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                          </button>
                        )
                      })}
                      <span className="text-sm text-muted-foreground">
                        {formState.rating ? `${formState.rating}/10` : "No rating"}
                      </span>
                    </div>
                    <Input type="hidden" name="rating" value={formState.rating} />
                  </label>

                  <label className="flex items-center gap-2 rounded-lg border border-input p-3 text-sm">
                    <input
                      type="checkbox"
                      name="favorite"
                      checked={formState.favorite}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, favorite: event.target.checked }))
                      }
                      className="h-4 w-4"
                    />
                    <span className="font-medium">Favorite this anime</span>
                  </label>
                </div>

                <label className="space-y-2 text-sm">
                  <span className="font-medium">Notes</span>
                  <Textarea
                    name="notes"
                    value={formState.notes}
                    onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
                    placeholder="Write a few thoughts about this anime..."
                  />
                </label>

                <ActionMessage state={submitState} />

                <DialogFooter className="flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <div />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitPending}>
                      {submitPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding
                        </>
                      ) : (
                        "Add to diary"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {entry ? (
        <p className="text-sm text-muted-foreground">
          In your diary as {formatStatus(entry.watch_status)}{entry.rating ? ` · ${entry.rating}/10` : ""}
        </p>
      ) : null}

      {favoriteState.error ? <p className="text-sm text-destructive">{favoriteState.error}</p> : null}
      {deleteState.error ? <p className="text-sm text-destructive">{deleteState.error}</p> : null}
    </div>
  )
}
