import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";
import { MessageLink } from "../pages/MessageLink";
import { Admin } from "../pages/Admin";
import { NotFound } from "../pages/NotFound";
import { ProtectedRoute } from "../components/layouts/ProtectedRoute";
import { AuthLayout } from "../components/auth/AuthLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      {/* Auth routes with layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/links/:linkId" element={<MessageLink />} />
      </Route>

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* 404 handler */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
