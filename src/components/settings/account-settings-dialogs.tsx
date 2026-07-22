"use client"

import * as React from "react"
import { useActionState } from "react"
import { Loader2, Mail, Lock, TriangleAlert, Trash2 } from "lucide-react"

import {
  deleteAccountAction,
  updateEmailAction,
  updatePasswordAction,
  type FormState,
} from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AccountSettingsDialogsProps {
  email: string
}

const initialState: FormState = {
  error: null,
  message: null,
}

function ActionMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {state.error}
      </p>
    )
  }

  if (state.message) {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-foreground">
        {state.message}
      </p>
    )
  }

  return null
}

export function AccountSettingsDialogs({ email }: AccountSettingsDialogsProps) {
  const [emailState, emailAction, emailPending] = useActionState(
    updateEmailAction,
    initialState
  )
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePasswordAction,
    initialState
  )
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteAccountAction,
    initialState
  )

  const emailFormRef = React.useRef<HTMLFormElement>(null)
  const passwordFormRef = React.useRef<HTMLFormElement>(null)
  const deleteFormRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (emailState.message) {
      emailFormRef.current?.reset()
    }
  }, [emailState.message])

  React.useEffect(() => {
    if (passwordState.message) {
      passwordFormRef.current?.reset()
    }
  }, [passwordState.message])

  React.useEffect(() => {
    if (deleteState.error) {
      deleteFormRef.current?.reset()
    }
  }, [deleteState.error])

  return (
    <div className="grid gap-6">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline" className="w-full justify-start sm:w-auto" />}
        >
          <Mail className="h-4 w-4" />
          Change Email
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change email</DialogTitle>
            <DialogDescription>
              We will send a confirmation message to the new email address.
            </DialogDescription>
          </DialogHeader>

          <form ref={emailFormRef} action={emailAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                New email address
              </label>
              <Input id="email" name="email" type="email" defaultValue={email} required />
            </div>

            <ActionMessage state={emailState} />

            <DialogFooter>
              <DialogClose render={<Button variant="ghost" type="button" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={emailPending}>
                {emailPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save email"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger
          render={<Button variant="outline" className="w-full justify-start sm:w-auto" />}
        >
          <Lock className="h-4 w-4" />
          Change Password
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Choose a strong new password for your account.
            </DialogDescription>
          </DialogHeader>

          <form ref={passwordFormRef} action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                New password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a new password"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat the new password"
                minLength={8}
                required
              />
            </div>

            <ActionMessage state={passwordState} />

            <DialogFooter>
              <DialogClose render={<Button variant="ghost" type="button" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={passwordPending}>
                {passwordPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating
                  </>
                ) : (
                  "Save password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger
          render={<Button variant="destructive" className="w-full justify-start sm:w-auto" />}
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This permanently removes your profile and diary data. Type DELETE to continue.
            </DialogDescription>
          </DialogHeader>

          <form ref={deleteFormRef} action={deleteAction} className="space-y-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 text-destructive">
                <TriangleAlert className="h-4 w-4" />
                This cannot be undone.
              </div>
              Your anime diary, favorites, ratings, and Supabase auth account will be removed.
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmation"
                className="text-sm font-medium text-foreground"
              >
                Type DELETE to confirm
              </label>
              <Input
                id="confirmation"
                name="confirmation"
                type="text"
                placeholder="DELETE"
                autoComplete="off"
                required
              />
            </div>

            <ActionMessage state={deleteState} />

            <DialogFooter>
              <DialogClose render={<Button variant="ghost" type="button" />}>
                Cancel
              </DialogClose>
              <Button type="submit" variant="destructive" disabled={deletePending}>
                {deletePending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting
                  </>
                ) : (
                  "Delete account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}