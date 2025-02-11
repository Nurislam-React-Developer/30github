import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';


const router = createBrowserRouter([
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
  }
])

const Routes = () => {
  return <RouterProvider router={router}/>
}

export default Routes