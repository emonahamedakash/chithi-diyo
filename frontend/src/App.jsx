import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/layouts/ErrorFallback";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MessageProvider } from "./contexts/MessageContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MessageLink from "./pages/MessageLink";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import AuthLayout from "./components/auth/AuthLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import SystemStats from "./components/admin/SystemStats";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <AuthProvider>
          {/* <MessageProvider> */}
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Auth Routes with Layout */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/dashboard/links/:linkId"
                    element={<MessageLink />}
                  />
                  {/* <Route
                    path="/dashboard/create-link"
                    element={<CreateMessageLink />}
                  /> */}
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin" element={<Admin />}>
                    <Route index element={<SystemStats />} />
                    <Route path="stats" element={<SystemStats />} />
                    {/* <Route path="users" element={<UserManagement />} /> */}
                  </Route>
                </Route>
              </Route>

              {/* 404 Handling */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
          {/* </MessageProvider> */}
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
    </ErrorBoundary>
  );
}

export default App;
