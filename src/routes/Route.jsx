import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FrendProfile from '../pages/FrendProfile';
import Friends from '../pages/Friends';
import Home from '../pages/Home';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
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
				path: '/notifications',
				element: <Notifications />,
			},
		],
	},
]);

const Routes = () => {
	return <RouterProvider router={router} />;
};

export default Routes;
