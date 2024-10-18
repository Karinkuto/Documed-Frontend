import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '@/utils/auth';

const PrivateRoute = () => {
  const currentUser = getCurrentUser();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
