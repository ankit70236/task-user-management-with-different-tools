import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../component/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/utils/api";

type User = {
  id: string;
  email: string;
  name: string;
};

export default function ListUser() {
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const loggedUser = token ? parseJwt(token) : null;
  const loggedUserId = loggedUser?.sub;

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await apiFetch("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersData = Array.isArray(data)
          ? data
          : data?.data || [];

        setUsers(usersData);
      } catch (err: any) {
        showToast(err.message || "Failed to load users", "error");
      }
    }

    if (!token) {
      navigate("/login");
      return;
    }

    getUsers();
  }, [token, navigate]);

  const deleteUser = async (id: string) => {
    try {
      await apiFetch(`/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted!", "success");

      if (id === loggedUserId) {
        localStorage.removeItem("token");
        navigate("/register");
      }
    } catch (err: any) {
      showToast(err.message || "Delete failed!", "error");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">List of Users</h1>

      <div className="grid gap-5">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user?.name || "No Name"}</CardTitle>
            </CardHeader>

            <CardContent>
              <p>{user?.email || "No Email"}</p>

              <div className="flex gap-4 mt-3">
                <Button
                  onClick={() => {
                    if (user.id !== loggedUserId) {
                      showToast("You can update only your account!", "error");
                      return;
                    }
                    navigate(`/updateuser/${user.id}`);
                  }}
                >
                  Update
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    if (user.id !== loggedUserId) {
                      showToast("You can delete only your account!", "error");
                      return;
                    }
                    deleteUser(user.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}