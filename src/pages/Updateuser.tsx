import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { showToast } from "../component/toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/utils/api"

// ✅ Schema
const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/@gmail\.com$/, "Email must end with @gmail.com"),
})

type UpdateUserFormData = z.infer<typeof updateUserSchema>

function UpdateUser() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
  })

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch(`/users/${id}`)

        // API के हिसाब से adjust करो
        const user = data.data || data

        setValue("name", user.name)
        setValue("email", user.email)

      } catch (err: any) {
        showToast(err.message || "Failed to load user", "error")
        navigate("/login")
      }
    }

    fetchUser()
  }, [id, setValue])

  // ✅ Submit
  const onSubmit = async (formData: UpdateUserFormData) => {
    try {
      await apiFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })

      showToast("User updated successfully!", "success")
      navigate("/profile")

    } catch (err: any) {
      showToast(err.message || "Update failed!", "error")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[380px] bg-white p-8 rounded-2xl shadow-xl space-y-6">

        <h2 className="text-2xl font-bold text-center">Update User</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Update User
          </Button>

        </form>

      </div>
    </div>
  )
}

export default UpdateUser