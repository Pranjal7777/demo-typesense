import { toast } from "sonner";

interface ToastOptions {
  message: string;
  messageType?: 'success' | 'error' | 'info' | 'warning'; 
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}
const showToast = ({ message, messageType = 'success', duration = 4000, position = 'top-center' }: ToastOptions, onClose?:()=>void): void => {
  toast[messageType](message, {
    duration,
    position,
  });
  if (onClose) {
    setTimeout(() => {
      onClose();
    }, duration);
  }
};

export default showToast;