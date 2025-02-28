import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CreatePost from '../pages/CreatePost';
import FrendProfile from '../pages/FrendProfile';
import Friends from '../pages/Friends';
import Home from '../pages/Home';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const ProtectedRoute = ({ children }) => {
	const token = localStorage.getItem('token');
	if (!token) {
		return <Navigate to="/signin" />;
	}
	return children;
};

const AuthRoute = ({ children }) => {
	const token = localStorage.getItem('token');
	if (token) {
		return <Navigate to="/" />;
	}
	return children;
};

const router = createBrowserRouter([
	{
		path: '/signin',
		element: (
			<AuthRoute>
				<SignIn />
			</AuthRoute>
		),
	},
	{
		path: '/signup',
		element: (
			<AuthRoute>
				<SignUp />
			</AuthRoute>
		),
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Layout />
			</ProtectedRoute>
		),
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/profile',
				element: <Profile />,
			},
			{
				path: '/profile/:id',
				element: <FrendProfile />,
			},
			{
				path: '/settings',
				element: <Settings />,
			},
			{
				path: '/friends',
				element: <Friends />,
			},
			{
				path: '/create-post',
				element: <CreatePost />,
			},
			{
				path: '/notifications',
				element: <Notifications />,
			},
      {
        path: '*',
        element: <NotFound/>
      }
		],
	},
]);

const Routes = () => {
	return <RouterProvider router={router} />;
};

export default Routes;
