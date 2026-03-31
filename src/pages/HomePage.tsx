import { useEffect, useState } from "react";
import TaskForm from "./taskForm";
import TaskItem from "../component/TaskItem";
import { showToast } from "../component/toast";
import { Button } from "@/components/ui/button";
import { useGetUserTasksQuery } from "../features/task/taskApi";

type TaskRow = {
  id: string;
  title: string;
  description?: string;
  status?: string;
};

export default function HomePage() {
  const [editTask, setEditTask] = useState<TaskRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  /** Bumps on each "Create Task" open so TaskForm remounts with empty fields (no effect-based reset). */
  const [createFormKey, setCreateFormKey] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { data, isError, error } = useGetUserTasksQuery(userId!, {
    skip: !userId || !token,
  });
  const tasks: TaskRow[] = Array.isArray(data) ? (data as TaskRow[]) : [];

  useEffect(() => {
    if (isError && error && "data" in error) {
      const data = error.data as { message?: string } | undefined;
      showToast(data?.message || "Failed to load tasks", "error");
    }
  }, [isError, error]);

  const openCreateForm = () => {
    setEditTask(null);
    setCreateFormKey((k) => k + 1);
    setShowForm(true);
  };

  return (
    <div className="p-[30px] font-sans">
      <div className="flex justify-between items-center">
        <h1 className="mb-6 text-2xl font-bold">Task Manager</h1>

        <Button
          onClick={openCreateForm}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mb-2 rounded-lg shadow-md transition"
        >
          Create Task
        </Button>
      </div>

      {showForm && (
        <TaskForm
          key={editTask?.id ?? `new-${createFormKey}`}
          editTask={editTask}
          open={showForm}
          setOpen={setShowForm}
          setEditTask={setEditTask}
        />
      )}

      <div className="mt-5">
        {tasks.length === 0 ? (
          <p>No Tasks Found</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              setEditTask={setEditTask}
              setShowForm={setShowForm}
            />
          ))
        )}
      </div>
    </div>
  );
}
