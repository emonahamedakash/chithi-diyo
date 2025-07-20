import React from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import SystemStats from "../components/admin/SystemStats";
import UserManagement from "../components/admin/UserManagement";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Admin() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <SystemStats />
          </TabsContent>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
