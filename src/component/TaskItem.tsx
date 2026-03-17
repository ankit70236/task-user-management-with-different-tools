import { showToast } from "./toast";

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

const TaskItem = ({ task, fetchTasks, setEditTask, setShowForm }: TaskItemProps) => {

  const token = localStorage.getItem("token");

  const deleteTask = async () => {

    if (!token) {
      showToast("Please login first","error")
      return;
    }

    try {

      const res = await fetch(`/api/v1/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        showToast("delete failed!", "error")
        return;
      }else{
        showToast("Task deleted!", "success")
      }

      fetchTasks();

    } catch (err) {
      console.error(err);
    }

  };

  const handleEdit = () => {
    setEditTask(task);
    setShowForm(true);
  };

  return (

    <div style={{
      border: "1px solid #ddd",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "5px",
      background: "#fafafa"
    }}>

      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: <b>{task.status}</b></p>

      <button
        onClick={handleEdit}
        style={{
          marginRight: "10px",
          backgroundColor: "#ffc107",
          border: "none",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        Edit
      </button>

      <button
        onClick={deleteTask}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        Delete
      </button>

    </div>

  );

};

export default TaskItem;