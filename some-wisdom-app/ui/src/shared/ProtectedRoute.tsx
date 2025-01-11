import { Navigate, Outlet } from 'react-router';
import { useUser } from './UserContext';

export default function ProtectedRoute({ allowedRoles = [] }) {
	const { user } = useUser();
	if (user.loading) {
		return null;
	}
	if (!user.data) {
		return <Navigate to="sign-in" replace></Navigate>;
	}
	// TODO
	// if (allowedRoles && !allowedRoles.includes(user.data.role)) {
	// 	return <Navigate to="/unauthorized" replace />;
	//   }
	return <Outlet />;
}