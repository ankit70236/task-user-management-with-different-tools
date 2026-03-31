import { useState } from "react";
import { z } from "zod";
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
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../features/task/taskApi";

type TaskPayload = z.infer<typeof taskSchema>;

function initialStatus(
  s: string | undefined
): "pending" | "in_progress" | "done" {
  if (s === "in_progress" || s === "done") return s;
  if (s === "completed") return "done";
  return "pending";
}

type TaskFormProps = {
  editTask: {
    id: string;
    title: string;
    description?: string;
    status?: string;
  } | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setEditTask: (task: TaskFormProps["editTask"]) => void;
};

const TaskForm = ({
  editTask,
  open,
  setOpen,
  setEditTask,
}: TaskFormProps) => {
  const [title, setTitle] = useState(() => editTask?.title ?? "");
  const [description, setDescription] = useState(
    () => editTask?.description ?? ""
  );
  const [status, setStatus] = useState(() => initialStatus(editTask?.status));

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [createTask] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<TaskPayload | null>(
    null
  );

  const resetFormAndClose = () => {
    setOpen(false);
    setEditTask(null);
    setTitle("");
    setDescription("");
    setStatus("pending");
    setShowUpdateConfirm(false);
    setPendingUpdate(null);
  };

  const executeUpdate = async () => {
    if (!editTask || !pendingUpdate) return;
    try {
      await updateTask({
        id: editTask.id,
        ...pendingUpdate,
      }).unwrap();
      showToast("Task updated successfully!", "success");
      resetFormAndClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      showToast(
        e?.data?.message || e?.message || "Something went wrong!",
        "error"
      );
    }
  };

  const saveTask = async () => {
    if (!token || !userId) {
      showToast("Please login first", "error");
      return;
    }

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

    if (editTask) {
      setPendingUpdate(validData);
      setShowUpdateConfirm(true);
      return;
    }

    try {
      await createTask({
        userId,
        ...validData,
      }).unwrap();

      showToast("Task created successfully!", "success");
      resetFormAndClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      showToast(
        e?.data?.message || e?.message || "Something went wrong!",
        "error"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setEditTask(null);
          setShowUpdateConfirm(false);
          setPendingUpdate(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md p-6 space-y-4 bg-white rounded-xl shadow-md">
        {editTask && showUpdateConfirm ? (
          <>
            <DialogTitle>
              <VisuallyHidden>Confirm update task</VisuallyHidden>
            </DialogTitle>
            <h3 className="text-xl font-semibold">Are you sure?</h3>
            <DialogDescription>
              Save changes to &ldquo;{editTask.title}&rdquo;? This will update
              the task on the server.
            </DialogDescription>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUpdateConfirm(false);
                  setPendingUpdate(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
                onClick={() => void executeUpdate()}
              >
                {isUpdating ? "Saving…" : "OK"}
              </Button>
            </div>
          </>
        ) : (
          <>
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

            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                value={title}
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={description}
                placeholder="Enter description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "pending" | "in_progress" | "done"
                  )
                }
                className="w-full border rounded-md p-2"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <Button
              onClick={() => void saveTask()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {editTask ? "Update Task" : "Create Task"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
