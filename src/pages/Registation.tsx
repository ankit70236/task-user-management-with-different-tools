import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { showToast } from "../component/toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/utils/api"

// ✅ Schema
const registerSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/@gmail\.com$/, "Email must end with @gmail.com"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await apiFetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.fullname,
        }),
      })

      showToast("Registration successful!", "success")
      navigate("/login")

    } catch (err: any) {
      const message = err?.message?.toLowerCase() || ""

      if (message.includes("exist")) {
        showToast("Email already registered!", "error")
      } else {
        showToast(err.message || "Registration failed!", "error")
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[380px] bg-white p-8 rounded-2xl shadow-xl space-y-6">

        <h2 className="text-2xl font-bold text-center">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Full Name */}
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("fullname")}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

        </form>

        <p className="text-center text-sm">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 ml-1 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}