import React from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { MessagesInbox } from "../components/dashboard/MessagesInbox";

export default function MessageLink() {
  return (
    <DashboardLayout>
      <MessagesInbox />
    </DashboardLayout>
  );
}
