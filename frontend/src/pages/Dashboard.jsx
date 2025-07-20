import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import MessageLinksList from "../components/dashboard/MessageLinksList";
import { useMessages } from "../hooks/useMessages";
import { Button } from "../components/ui/button";
import { FaPlus } from "react-icons/fa"; // ✅ react-icons import

export default function Dashboard() {
  const { messageLinks, fetchMessageLinks } = useMessages();

  React.useEffect(() => {
    fetchMessageLinks();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Message Links</h2>
        <Button asChild>
          <Link to="/dashboard/create-link">
            <FaPlus className="mr-2 h-4 w-4" /> {/* ✅ replaced Icons.plus */}
            New Link
          </Link>
        </Button>
      </div>
      <MessageLinksList />
    </DashboardLayout>
  );
}
