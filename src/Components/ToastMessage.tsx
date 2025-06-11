import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warn(message, { ...defaultOptions, ...options });
};

const ToastMessage = () => {
  return <ToastContainer />;
};

export {
  ToastMessage,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
};
