import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { showToast } from "../component/toast"
import { apiFetch } from "../utils/api"

type FormData = {
  name: string
  email: string
}

export default function UpdateUser() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { register, handleSubmit, reset } = useForm<FormData>()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch(`/users/${id}`)
        const data = await res.json()

        const user = data?.data

        if (!user) {
          showToast("User not found", "error")
          return
        }

        // ✅ old data auto fill
        reset({
          name: user?.name || "",
          email: user?.email || "",
        })

      } catch (err) {
        console.error(err)
        showToast("Error fetching user", "error")
      }
    }

    fetchUser()
  }, [id, reset])

  const onSubmit = async (formData: FormData) => {
    try {
      const res = await apiFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        showToast("User updated successfully", "success")
        navigate("/")
      } else {
        showToast("Update failed", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Something went wrong", "error")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6 text-center">Update User</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name Field */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter name"
          />
        </div>

        {/* Email Field */}
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
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          Update
        </button>

      </form>
    </div>
  )
}