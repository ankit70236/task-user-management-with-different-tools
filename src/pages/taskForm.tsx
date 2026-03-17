import { useEffect, useState } from "react";
import { showToast } from "../component/toast";

const TaskForm = ({ fetchTasks, editTask, setShowForm, setEditTask }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status || "pending");
    }
  }, [editTask]);

  const saveTask = async () => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    if (!title.trim()) {
      showToast("Title cannot be empty!", "error");
      return;
    }

    try {
      let response;

      if (editTask) {
        // Edit task
        response = await fetch(`/api/v1/tasks/${editTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, status }),
        });

        if (!response.ok) {
          showToast("Failed to edit task!", "error");
          return;
        }

        await response.json();
        showToast("Task edited successfully!", "success"); // ✅ only after success

      } else {
        // Create task
        response = await fetch(`/api/v1/users/${userId}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, status }),
        });

        if (!response.ok) {
          showToast("Failed to create task!", "error");
          return;
        }

        await response.json();
        showToast("Task created successfully!", "success"); // ✅ only after success
      }

      // Refresh tasks and reset form
      fetchTasks();
      setShowForm(false);
      setEditTask(null);
      setTitle("");
      setDescription("");
      setStatus("pending");

    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error"); // catch unexpected errors
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px", borderRadius: "5px" }}>
      <h3>{editTask ? "Update Task" : "Create Task"}</h3>

      <input
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <input
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button
        onClick={saveTask}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        {editTask ? "Update Task" : "Create Task"}
      </button>
    </div>
  );
};

export default TaskForm;