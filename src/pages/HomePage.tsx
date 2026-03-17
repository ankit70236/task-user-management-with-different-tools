// HomePage.tsx
import { useEffect, useState } from "react";
import TaskForm from "./taskForm";
import TaskItem from "../component/TaskItem";
import { showToast } from "../component/toast";

const HomePage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editTask, setEditTask] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    if (!userId || !token) {
      showToast("User not logged in!", "error");
      return;
    }
    try {
      const res = await fetch(`/api/v1/users/${userId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(res.ok ? data.data ?? [] : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateForm = () => {
    setEditTask(null);
    setShowForm(true);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Task Manager</h1>

      <button onClick={openCreateForm}>Create Task</button>

      {showForm && (
        <TaskForm
          fetchTasks={fetchTasks}
          editTask={editTask}
          setShowForm={setShowForm}
          setEditTask={setEditTask}
        />
      )}

      <div style={{ marginTop: "20px" }}>
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
};

export default HomePage;