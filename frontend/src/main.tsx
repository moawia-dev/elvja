import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import { Login } from './pages/Login'
import Dashboard  from './pages/Dashboard'
import { Onboarding } from './pages/Onboarding'
import { Brandkit } from './pages/Brandkit'
import { Editor } from './pages/Editor'
import { AiTools } from './pages/AiTools'
import { Layout } from './ui/Layout'
import { getToken, setAuth } from './api'
import App from './App'

const token = getToken(); if (token) setAuth(token)

const RequireAuth: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const t = getToken(); if (!t) return <Navigate to="/login" replace />; return <>{children}</>;
};

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: <RequireAuth><Layout /></RequireAuth>, children: [
    { index: true, element: <App /> },
    { path: 'onboarding', element: <Onboarding /> },
    { path: 'brandkit', element: <Brandkit /> },
    { path: 'editor', element: <Editor /> },
    { path: 'ai', element: <AiTools /> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)
