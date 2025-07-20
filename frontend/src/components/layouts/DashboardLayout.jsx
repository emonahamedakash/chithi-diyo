import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNav from "../dashboard/DashboardNav";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";
// import { Toaster } from "../ui/toaster";
// import { toast } from "react-toastify";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <DashboardNav user={user} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
    </div>
  );
}
