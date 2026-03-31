import { useState } from "react";
import { showToast } from "./toast";
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
import { useDeleteTaskMutation } from "../features/task/taskApi";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
      status?: string;
  };
  setEditTask: (task: TaskItemProps["task"]) => void;
  setShowForm: (show: boolean) => void;
}

const TaskItem = ({
  task,
  setEditTask,
  setShowForm,
}: TaskItemProps) => {
  const token = localStorage.getItem("token");
  const [deleteTaskMutation, { isLoading: isDeleting }] =
    useDeleteTaskMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requestDelete = () => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTaskMutation(task.id).unwrap();
      showToast("Task deleted successfully!", "success");
      setConfirmOpen(false);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      showToast(e?.data?.message || e?.message || "Delete failed!", "error");
    }
  };

  const handleEdit = () => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    setEditTask(task);
    setShowForm(true);
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {task.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm">{task.description}</p>

        <p className="text-sm">
          Status:{" "}
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              task.status === "done" || task.status === "completed"
                ? "bg-green-100 text-green-700"
                : task.status === "in_progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {task.status || "pending"}
          </span>
        </p>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleEdit}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Edit
          </Button>

          <Button onClick={requestDelete} variant="destructive">
            Delete
          </Button>
        </div>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{task.title}&rdquo;. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void confirmDelete()}
            >
              {isDeleting ? "Deleting…" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskItem;
