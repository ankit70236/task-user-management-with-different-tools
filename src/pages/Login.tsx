import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../component/toast";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLButtonElement>) => {

    e.preventDefault();

    fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })

      .then(res => res.json())
      .then(data => {

        console.log("LOGIN RESPONSE:", data);
        console.log("USER DATA:", data.data);

        if (data.data) {

          // ✅ token save
          localStorage.setItem("token", data.data.token);
          showToast("Login successfully!", "success");
          // ✅ userId save
          localStorage.setItem("userId", data.data.user.id);
           
          // redirect
          navigate("/home");

        } else {

          showToast("Login unsuccessful!", "error");

        }

      })
      .catch(err => console.error(err));

  };


  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-96 bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?

          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 ml-1 cursor-pointer"
          >
            Register
          </span>

        </p>

      </div>

    </div>

  );
}

export default Login;