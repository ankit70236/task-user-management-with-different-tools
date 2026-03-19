import { useEffect, useState } from "react";
import { showToast } from "../component/toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { taskSchema } from "@/component/TaskSchema";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { apiFetch } from "../utils/api";

const TaskForm = ({
  fetchTasks,
  editTask,
  open,
  setOpen,
  setEditTask,
}: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status || "pending");
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
    }
  }, [editTask]);

  const saveTask = async () => {
    if (!token || !userId) {
      showToast("Please login first", "error");
      return;
    }

    // Zod validation
    const result = taskSchema.safeParse({ title, description, status });

    if (!result.success) {
      const errors = result.error.format();

      if (errors.title?._errors?.length)
        showToast(errors.title._errors[0], "error");
      else if (errors.description?._errors?.length)
        showToast(errors.description._errors[0], "error");
      else if (errors.status?._errors?.length)
        showToast(errors.status._errors[0], "error");

      return;
    }

    const validData = result.data;

    try {
      if (editTask) {
        await apiFetch(`/tasks/${editTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(validData),
        });

        showToast("Task updated successfully!", "success");
      } else {
        await apiFetch(`/users/${userId}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(validData),
        });

        showToast("Task created successfully!", "success");
      }

      // Refresh + reset
      fetchTasks();
      setOpen(false);
      setEditTask(null);
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Something went wrong!", "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-6 space-y-4 bg-white rounded-xl shadow-md">
        <DialogTitle>
          <VisuallyHidden>
            {editTask ? "Update Task" : "Create Task"}
          </VisuallyHidden>
        </DialogTitle>

        <h3 className="text-xl font-semibold">
          {editTask ? "Update Task" : "Create Task"}
        </h3>

        <DialogDescription>
          Fill out the task details below
        </DialogDescription>

        {/* Title */}
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            value={title}
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            value={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Submit */}
        <Button
          onClick={saveTask}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {editTask ? "Update Task" : "Create Task"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;