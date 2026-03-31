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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../features/user/userApi";

type UserRow = {
  id: string;
  name?: string;
  email?: string;
};

export default function ListUser() {
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

  const { data, isError, error } = useGetUsersQuery(undefined, {
    skip: !token,
  });
  const users: UserRow[] = Array.isArray(data) ? (data as UserRow[]) : [];

  const [deleteUserMutation, { isLoading: isDeleting }] =
    useDeleteUserMutation();
  const [userPendingDelete, setUserPendingDelete] = useState<UserRow | null>(
    null
  );
  const [userPendingUpdate, setUserPendingUpdate] = useState<UserRow | null>(
    null
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isError && error && "data" in error) {
      const data = error.data as { message?: string } | undefined;
      showToast(data?.message || "Failed to load users", "error");
    }
  }, [isError, error]);

  const requestDeleteUser = (user: UserRow) => {
    if (user.id !== loggedUserId) {
      showToast("You can delete only your account!", "error");
      return;
    }
    setUserPendingDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userPendingDelete) return;
    const id = userPendingDelete.id;
    try {
      await deleteUserMutation(id).unwrap();
      showToast("User deleted!", "success");
      setUserPendingDelete(null);
      if (id === loggedUserId) {
        localStorage.removeItem("token");
        navigate("/register");
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      showToast(
        e?.data?.message || e?.message || "Delete failed!",
        "error"
      );
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
                    setUserPendingUpdate(user);
                  }}
                >
                  Update
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => requestDeleteUser(user)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={userPendingUpdate !== null}
        onOpenChange={(open) => {
          if (!open) setUserPendingUpdate(null);
        }}
      >
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Open the edit page to update your profile
              {userPendingUpdate?.name
                ? ` (${userPendingUpdate.name})`
                : ""}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUserPendingUpdate(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!userPendingUpdate) return;
                navigate(`/updateuser/${userPendingUpdate.id}`, {
                  state: {
                    name: userPendingUpdate.name,
                    email: userPendingUpdate.email,
                  },
                });
                setUserPendingUpdate(null);
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={userPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setUserPendingDelete(null);
        }}
      >
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account
              {userPendingDelete?.name
                ? ` (${userPendingDelete.name})`
                : ""}
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUserPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void confirmDeleteUser()}
            >
              {isDeleting ? "Deleting…" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
