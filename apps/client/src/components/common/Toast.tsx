interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};