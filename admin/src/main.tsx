import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';

import Account from './pages/Account.tsx';
import Invoices from './pages/Invoices.tsx';
import Products from './pages/Products.tsx';
import Banners from './pages/Banners.tsx';

import Brands from './pages/Brands.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Categories from './pages/Categories.tsx';
import UsersPage from './pages/Users.tsx';



const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/", element: <App />, children: [{
      index: true,
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/dashboard/account",
      element: <Account />
    },
    {
      path: "/dashboard/users",
      element: <UsersPage />
    },
    {
      path: "/dashboard/invoices",
      element: <Invoices />
    },
    {
      path: "/dashboard/products",
      element: <Products />
    },
    {
      path: "/dashboard/banners",
      element: <Banners />
    },
    {
      path: "/dashboard/categories",
      element: <Categories />
    },
    {
      path: "/dashboard/brands",
      element: <Brands />
    },

    ]
  },


]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,

  <RouterProvider router={router} />
)
