import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { FaTachometerAlt, FaLink, FaPlus, FaCog } from "react-icons/fa"; // ✅ Importing icons from react-icons

export function DashboardSidebar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt className="h-4 w-4" />,
      path: "/dashboard",
    },
    {
      name: "Message Links",
      icon: <FaLink className="h-4 w-4" />,
      path: "/dashboard/links",
    },
    {
      name: "Settings",
      icon: <FaCog className="h-4 w-4" />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <aside className="hidden w-64 border-r md:block">
      <div className="p-4">
        <Button asChild variant="default" className="w-full">
          <Link to="/dashboard/create-link">
            <FaPlus className="mr-2 h-4 w-4" />
            Create New Link
          </Link>
        </Button>
      </div>
      <nav className="space-y-1 p-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            asChild
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link to={item.path}>
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
