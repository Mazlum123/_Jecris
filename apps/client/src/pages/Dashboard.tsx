// apps/client/src/pages/Dashboard.tsx
import { useAuthStore } from '../store/authStore';

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
};