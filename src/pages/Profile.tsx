import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { showToast } from "../component/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetUserByIdQuery,
  useDeleteUserMutation,
} from "../features/user/userApi";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const userId = useMemo(() => {
    if (!token) return undefined;
    const decoded = parseJwt(token);
    return (decoded?.sub ??
      decoded?.id ??
      decoded?.userId) as string | undefined;
  }, [token]);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(userId!, {
    skip: !token || !userId,
  });

  const [deleteUserMutation, { isLoading: isDeleting }] =
    useDeleteUserMutation();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!userId) {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  useEffect(() => {
    if (isError && error && "data" in error) {
      const data = error.data as { message?: string } | undefined;
      showToast(data?.message || "Failed to load user", "error");
      navigate("/login");
    }
  }, [isError, error, navigate]);

  const confirmDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteUserMutation(user.id).unwrap();
      showToast("Account deleted", "success");
      setConfirmDeleteOpen(false);
      localStorage.removeItem("token");
      navigate("/register");
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      showToast(e?.data?.message || e?.message || "Delete failed", "error");
    }
  };

  if (!token || !userId || isLoading || !user) {
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
          <Button onClick={() => setConfirmEditOpen(true)}>Edit</Button>

          <Button
            variant="destructive"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmEditOpen}
        onOpenChange={setConfirmEditOpen}
      >
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Open the page to edit your name and email?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                navigate(`/updateuser/${user.id}`, {
                  state: { name: user.name, email: user.email },
                });
                setConfirmEditOpen(false);
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account
              {user?.name ? ` (${user.name})` : ""}. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void confirmDeleteAccount()}
            >
              {isDeleting ? "Deleting…" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
