import { toast } from "react-toastify";

// toast error
const toastError = (message: string) => {
  toast.error(message);
};
// toast info
const toastInfo = (message: string) => {
  toast.info(message);
};
// toast success
const toastSuccess = (message: string) => {
  toast.success(message);
};
// toast loading
const toastLoading = (message: string) => {
  toast.info(message);
};

// toast warning
const toastWarning = (message: string) => {
  toast.warn(message);
};

// export the functions

export { toastError, toastInfo, toastSuccess, toastLoading, toastWarning };
