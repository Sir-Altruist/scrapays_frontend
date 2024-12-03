import { useLocation, Navigate, Outlet } from 'react-router-dom'


const ProtectedRoute = () => {
  const location = useLocation()
  const token = localStorage.getItem('access_token')
  return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
}

export default ProtectedRoute