import React from "react";
import { Routes, Route } from "react-router-dom";
import { Admin } from "../pages/Admin";
import { SystemStats } from "../components/admin/SystemStats";
import { UserManagement } from "../components/admin/UserManagement";
import { ProtectedRoute } from "../components/layouts/ProtectedRoute";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/" element={<Admin />}>
          <Route index element={<SystemStats />} />
          <Route path="stats" element={<SystemStats />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}
