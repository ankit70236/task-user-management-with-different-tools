import { Button } from "@/components/ui/button";
import { apiFetch } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../component/toast";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
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
    const userId = decoded?.sub || decoded?.id || decoded?.userId;

    if (!userId) {
      navigate("/login");
      return;
    }

    apiFetch(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        const userData = data?.data || data;
        setUser(userData);
      })
      .catch((err) => {
        showToast(err.message || "Failed to load user", "error");
        navigate("/login");
      });
  }, [token, navigate]);

  const deleteAccount = async () => {
    if (!user) return;

    try {
      await apiFetch(`/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("Account deleted", "success");
      localStorage.removeItem("token");
      navigate("/register");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  if (!user) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>Name</p>
            <p className="font-semibold">{user?.name || "No Name"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p>Email</p>
            <p className="font-semibold">{user?.email || "No Email"}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={() => navigate(`/updateuser/${user.id}`)}>
            Edit
          </Button>

          <Button variant="destructive" onClick={deleteAccount}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}