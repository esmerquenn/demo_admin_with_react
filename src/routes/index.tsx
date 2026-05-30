import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('@/pages/Dashboard') },
      { path: 'categories', lazy: () => import('@/pages/categories/List') },
    ],
  },
  { path: '/login', lazy: () => import('@/pages/Login') },
  { path: '*', lazy: () => import('@/pages/NotFound') },
])
