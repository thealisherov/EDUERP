import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/students/Students';
import StudentDetails from '../pages/students/StudentDetails';
import Teachers from '../pages/Teachers';
import Groups from '../pages/Groups';
import Payments from '../pages/Payments';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import NotFound from '../pages/NotFound';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'students/:id',
        element: <StudentDetails />,
      },
      {
        path: 'teachers',
        element: <Teachers />,
      },
      {
        path: 'groups',
        element: <Groups />,
      },
      {
        path: 'payments',
        element: <Payments />,
      },
      {
        path: 'expenses',
        element: <Expenses />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

