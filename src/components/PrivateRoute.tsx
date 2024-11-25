import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { requiresPasswordChange } from '@/utils/auth';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiresPasswordChange(user)) {
    return <Navigate to="/change-password" />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
