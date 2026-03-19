import { showToast } from "./toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "../utils/api";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    status?: string;
  };
  fetchTasks: () => void;
  setEditTask: (task: any) => void;
  setShowForm: (show: boolean) => void;
}

const TaskItem = ({
  task,
  fetchTasks,
  setEditTask,
  setShowForm,
}: TaskItemProps) => {
  const token = localStorage.getItem("token");

  const deleteTask = async () => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      console.log("Deleting task ID:", task.id); // ✅ debug

      const res = await apiFetch(`/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response:", res); // ✅ debug

      showToast("Task deleted successfully!", "success");
      fetchTasks();
    } catch (err: any) {
      console.error("DELETE ERROR:", err.message);

      showToast(err.message || "Delete failed!", "error");
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
              task.status === "completed"
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

          <Button onClick={deleteTask} variant="destructive">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;