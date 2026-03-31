import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { showToast } from "../component/toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginMutation } from "../features/auth/authApi";

function Login() {
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.endsWith("@gmail.com")) {
      showToast("Email must end with @gmail.com", "error")
      return
    }

    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters", "error")
      return
    }

    try {
      const res = await login({ email, password }).unwrap()
      console.log(res)
    
      if (!res?.data) {
        showToast("Login failed", "error")
        return
      }
    
      const { token, user } = res.data
    
      if (token && user) {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", user.id)
    
        showToast("Login successfully!", "success")
        navigate("/home")
      } else {
        showToast("Invalid response from server", "error")
      }
    
    } catch (err) {
      console.error(err)
      showToast("Invalid email or password", "error")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[380px] bg-white p-8 rounded-2xl shadow-xl space-y-6">

        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Logging in..." : "Login"}
          </Button>

        </form>

        <p className="text-center text-sm">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 ml-1 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login