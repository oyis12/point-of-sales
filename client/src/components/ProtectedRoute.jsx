import {useState, useEffect} from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Ring from './loader/Ring';

const ProtectedRoute = ({ roles }) => {
  const { user, getRole, loginStatus } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const role = getRole(user);
  // console.log('ProtectedRoute:', { user, role, roles });

  if (isLoading) {
    return <Ring />
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;