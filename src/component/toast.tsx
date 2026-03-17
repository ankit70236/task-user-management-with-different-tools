import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Allowed types
type ToastType = "success" | "error" | "info" | "warning";

// Reusable function
export const showToast = (message: string, type: ToastType = "info") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message,);
      break;
    case "warning":
      toast.warn(message);
      break;
    default:
      toast(message);
  }
};