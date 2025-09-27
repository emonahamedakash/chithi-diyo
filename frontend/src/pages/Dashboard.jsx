// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaInbox,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Layout from "../components/layouts/Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalMessages: 0,
  });

  const [recentLinks, setRecentLinks] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setStats({
        totalLinks: 24,
        totalMessages: 156,
      });
      setRecentLinks([
        {
          id: 1,
          name: "My Public Profile",
          url: "chithidiyo.me/john",
          createdAt: "2023-06-15",
        },
        {
          id: 2,
          name: "Feedback Link",
          url: "chithidiyo.me/feedback",
          createdAt: "2023-06-10",
        },
      ]);
      setMessages([
        {
          id: 1,
          content: "You're doing an amazing job! Keep up the great work!",
          receivedAt: "2 hours ago",
        },
        {
          id: 2,
          content:
            "I really appreciate your help last week. You saved my project!",
          receivedAt: "1 day ago",
        },
        {
          id: 3,
          content: "Just wanted to say hi and that I admire your work!",
          receivedAt: "3 days ago",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const nextCarousel = () => {
    setActiveCarousel((prev) => (prev === messages.length - 1 ? 0 : prev + 1));
  };

  const prevCarousel = () => {
    setActiveCarousel((prev) => (prev === 0 ? messages.length - 1 : prev - 1));
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 md:mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard
        </h2>
        <p className="text-gray-600">
          Welcome back! Here's your activity summary.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 border-l-4 border-blue-500"
        >
          <h3 className="text-base md:text-lg font-medium text-gray-500 mb-2">
            Total Links
          </h3>
          {loading ? (
            <div className="h-6 md:h-8 w-16 md:w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-800">
              {stats.totalLinks}
            </p>
          )}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 border-l-4 border-cyan-500"
        >
          <h3 className="text-base md:text-lg font-medium text-gray-500 mb-2">
            Messages
          </h3>
          {loading ? (
            <div className="h-6 md:h-8 w-16 md:w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-800">
              {stats.totalMessages}
            </p>
          )}
        </motion.div>
      </div>

      {/* Create New Link Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-6 md:mb-8"
      >
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg md:rounded-xl shadow-md text-sm md:text-base font-medium"
        >
          <FaPlus className="mr-2" />
          Create New Link
        </motion.button>
      </motion.div>

      {/* Recent Link Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-6 md:mb-8"
      >
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
          Your Recent Link
        </h3>
        {loading ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 h-24 md:h-32 animate-pulse"></div>
        ) : recentLinks.length > 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4">
              <div className="mb-2 md:mb-0">
                <h4 className="font-medium text-gray-900">
                  {recentLinks[0].name}
                </h4>
                <p className="text-blue-600 text-sm md:text-base">
                  {recentLinks[0].url}
                </p>
              </div>
              <span className="text-xs md:text-sm text-gray-500">
                Created: {recentLinks[0].createdAt}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 md:pt-4">
              <h5 className="text-xs md:text-sm font-medium text-gray-500 mb-2 md:mb-3">
                Recent Messages
              </h5>

              {/* Messages Carousel */}
              <div className="relative overflow-hidden h-32 md:h-40">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === activeCarousel ? 1 : 0,
                      x: `${(index - activeCarousel) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 p-3 md:p-4 bg-blue-50 rounded-lg flex flex-col ${index === activeCarousel ? "z-10" : "z-0"
                      }`}
                  >
                    <div className="flex items-start mb-1 md:mb-2">
                      <FiMessageSquare className="text-blue-500 mt-0.5 md:mt-1 mr-1 md:mr-2" />
                      <p className="text-gray-800 text-sm md:text-base flex-1">
                        {message.content}
                      </p>
                    </div>
                    <div className="mt-auto text-right text-xs md:text-sm text-gray-500">
                      {message.receivedAt}
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={prevCarousel}
                  className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-1 md:p-2 rounded-full shadow-md text-blue-600 hover:text-blue-800"
                >
                  <FaChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <button
                  onClick={nextCarousel}
                  className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-1 md:p-2 rounded-full shadow-md text-blue-600 hover:text-blue-800"
                >
                  <FaChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 text-center text-sm md:text-base text-gray-500">
            You haven't created any links yet
          </div>
        )}
      </motion.div>

      {/* Go to Inbox Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.2)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/inbox")}
          className="flex items-center px-4 md:px-6 py-2 md:py-3 bg-white text-blue-600 border border-blue-200 rounded-lg md:rounded-xl shadow-sm text-sm md:text-base font-medium hover:bg-blue-50 transition-colors"
        >
          <FaInbox className="mr-1 md:mr-2" />
          Go to Inbox
        </motion.button>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;