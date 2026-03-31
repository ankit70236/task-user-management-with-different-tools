import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { showToast } from "../component/toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../features/user/userApi"

type FormData = {
  name: string
  email: string
}

type UpdateUserLocationState = {
  name?: string
  email?: string
}

function isValidUserIdParam(id: string | undefined): id is string {
  return Boolean(id && id !== "undefined")
}

export default function UpdateUser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const fromNav = (location.state as UpdateUserLocationState | null) ?? {}

  const idOk = isValidUserIdParam(id)

  useEffect(() => {
    if (!idOk) {
      showToast("Invalid user link", "error")
      navigate("/", { replace: true })
    }
  }, [idOk, navigate])

  const { data: user, isError, error } = useGetUserByIdQuery(id ?? "", {
    skip: !idOk,
  })

  const formValues = useMemo<FormData>(() => {
    if (user) {
      return { name: user.name ?? "", email: user.email ?? "" }
    }
    return {
      name: fromNav.name ?? "",
      email: fromNav.email ?? "",
    }
  }, [user, fromNav.name, fromNav.email])

  const { register, handleSubmit } = useForm<FormData>({
    values: formValues,
  })

  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingData, setPendingData] = useState<FormData | null>(null)

  useEffect(() => {
    if (isError) {
      const data =
        error && "data" in error
          ? (error.data as { message?: string } | undefined)
          : undefined
      showToast(data?.message || "Error fetching user", "error")
    }
  }, [isError, error])

  const onSubmit = (formData: FormData) => {
    if (!idOk || !id) return
    setPendingData(formData)
    setConfirmOpen(true)
  }

  const confirmUpdate = async () => {
    if (!idOk || !id || !pendingData) return
    try {
      await updateUser({ id, ...pendingData }).unwrap()
      showToast("User updated successfully", "success")
      setConfirmOpen(false)
      setPendingData(null)
      navigate("/")
    } catch (err: unknown) {
      const e = err as {
        data?: {
          message?: string
          error?: { message?: string; fields?: Record<string, string> }
        }
        message?: string
      }
      const msg =
        e?.data?.error?.message ??
        e?.data?.message ??
        e?.message ??
        "Something went wrong"
      showToast(msg, "error")
    }
  }

  if (!idOk) {
    return null
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6 text-center">Update User</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !idOk}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          Update
        </button>

      </form>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open)
          if (!open) setPendingData(null)
        }}
      >
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Save changes to your name and email? This will update your
              profile on the server.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmOpen(false)
                setPendingData(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => void confirmUpdate()}
            >
              {isLoading ? "Updating…" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
