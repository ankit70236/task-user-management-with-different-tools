import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Profile() {

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // JWT decode
  function parseJwt(token: string) {
    try {
      const base64 = token.split(".")[1];
      const decoded = atob(base64);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = parseJwt(token);
    console.log("Decoded JWT:", decoded);
    const userId = decoded.sub || decoded.id || decoded.userId;

    fetch(`/api/v1/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
          if(data.error){
            alert(data.error.message);
            navigate("/login");
            return;
          }
          setUser(data.data || data);
        })
      .catch(err => console.log(err));

  }, [token]);

  // DELETE USER
  const deleteAccount = async () => {

    if (!user) return;

    const res = await fetch(`/api/v1/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      alert("Account deleted");
      localStorage.removeItem("token");
      navigate("/register");
    }

  };

  if (!user) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-6">
          My Profile
        </h2>

        <div className="space-y-4">

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

        </div>

        <div className="flex gap-4 mt-6">

          <button
            onClick={() => navigate(`/updateuser/${user.id}`)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Edit Profile
          </button>

          <button
            onClick={deleteAccount}
            className="w-full bg-red-500 text-white py-2 rounded-lg"
          >
            Delete Account
          </button>

        </div>

      </div>

    </div>
  );
}