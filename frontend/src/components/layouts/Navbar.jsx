// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLink,
  FaInbox,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaList
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/",
      icon: FaLink,
      label: "Dashboard",

    },
    {
      path: "/create-link",
      icon: FaLink,
      label: "Create Link",
    },
    {
      path: "/link-list",
      icon: FaList,
      label: "Link List",
    },
    {
      path: "/inbox",
      icon: FaInbox,
      label: "Inbox",
    },
    {
      path: "/profile",
      icon: FaUser,
      label: "Profile",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileNavOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation Toggle Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <button
          onClick={toggleMobileNav}
          className="text-gray-600 focus:outline-none"
        >
          {isMobileNavOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Chithi Diyo
        </h1>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isMobileNavOpen || windowWidth > 768) && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-64 bg-white shadow-lg flex flex-col fixed md:static inset-y-0 z-50 md:z-0 ${isMobileNavOpen ? "block" : "hidden md:block"
              }`}
          >
            <div className="p-6 border-b border-gray-200 hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Chithi Diyo
              </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-colors ${isActiveRoute(item.path) || item.isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile nav */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileNav}
        />
      )}
    </>
  );
};

export default Navbar;