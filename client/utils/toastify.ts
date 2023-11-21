import { toast, ToastOptions } from "react-toastify";

interface IOptions {
  position: string;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  progress: undefined;
}

const options: ToastOptions<IOptions> = {
  position: "bottom-right",
  autoClose: 3500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const customOptions: ToastOptions<IOptions> = {
  position: "bottom-right",
  autoClose: 3500,
  hideProgressBar: true,
  pauseOnHover: true,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  className: "toast-container",
};

export const ToastError = (message: string) => toast.error(message, options);
export const ToastSuccess = (message: string) =>
  toast.success(message, options);
export const ToastInfo = (message: string) => toast.info(message, options);
export const ToastComponent = (message: JSX.Element) =>
  toast(message, customOptions);
