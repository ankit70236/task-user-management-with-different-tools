import { useEffect, useState } from "react";
import TaskForm from "./taskForm";
import TaskItem from "../component/TaskItem";
import { showToast } from "../component/toast";
import { Button } from "@/components/ui/button";
import { apiFetch } from "../utils/api";

export default function HomePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editTask, setEditTask] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ FIXED FUNCTION
  const fetchTasks = async () => {
    if (!userId || !token) {
      showToast("User not logged in!", "error");
      return;
    }

    try {
      const data = await apiFetch(`/users/${userId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(data.data ?? []);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to load tasks", "error");
      setTasks([]);
    }
  };

  // ✅ NOW OUTSIDE FUNCTION
  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateForm = () => {
    setEditTask(null);
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
          fetchTasks={fetchTasks}
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
              fetchTasks={fetchTasks}
              setEditTask={setEditTask}
              setShowForm={setShowForm}
            />
          ))
        )}
      </div>
    </div>
  );
}