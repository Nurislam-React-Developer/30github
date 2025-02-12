import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Layout from '../components/layout/Layout';
import Friends from '../pages/Friends';
import Notifications from '../pages/Notifications';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Home/>
      }, 
      {
    path: '/profile',
    element: <Profile/>
      },
      {
    path: '/settings',
    element: <Settings/>
      },
      {
    path: '/friends',
    element: <Friends/>
      },
      {
    path: '/notifications',
    element: <Notifications/>
      }
    ]
  }
])

const Routes = () => {
  return <RouterProvider router={router}/>
}

export default Routes