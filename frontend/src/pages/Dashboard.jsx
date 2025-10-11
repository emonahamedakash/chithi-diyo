// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../baseUrl";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaInbox,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Layout from "../components/layouts/Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [loading, setLoading] = useState(true);

  const [totalLinks, setTotalLinks] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/fetch-dashboard-data`,
        {
          params: { user_id: 1 }
        }
      )

      console.log(response);

      if (response.status === 200) {
        setTotalLinks(response.data.total_links);
        setTotalMessages(response.data.total_messages);
        setRecentMessages(response.data.recent_messages);
        setRecentLinks(response.data.recent_links);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const nextCarousel = () => {
    setActiveCarousel((prev) => (prev === recentMessages.length - 1 ? 0 : prev + 1));
  };

  const prevCarousel = () => {
    setActiveCarousel((prev) => (prev === 0 ? recentMessages.length - 1 : prev - 1));
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

      {/* Top Cards */}
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
              {totalLinks}
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
              {totalMessages}
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

      {/* Recent Messages Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Recent Messages
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            Total: {totalMessages || 0}
          </span>
        </div>
        {loading ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 h-24 md:h-32 animate-pulse"></div>
        ) : recentMessages && recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6"
              >
                <div className="flex items-start mb-3">
                  <FiMessageSquare className={`mt-0.5 mr-2 flex-shrink-0 ${message.is_read ? 'text-green-500' : 'text-blue-500'}`} />
                  <p className="text-gray-800 text-sm md:text-base line-clamp-3">
                    {message.message}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
                  <span>Received: {new Date(message.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded ${message.is_read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {message.is_read ? 'Read' : 'Unread'}
                    </span>
                    <span>Clicks: {message.click_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 text-center text-sm md:text-base text-gray-500">
            No recent messages
          </div>
        )}
      </motion.div>

      {/* Recent Links Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Your Recent Links
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            Total: {totalLinks || 0}
          </span>
        </div>
        {loading ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 h-24 md:h-32 animate-pulse"></div>
        ) : recentLinks && recentLinks.length > 0 ? (
          <div className="space-y-4">
            {recentLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4">
                  <div className="mb-2 md:mb-0 flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {link.title}
                    </h4>
                    <p className="text-blue-600 text-sm md:text-base break-all hover:text-blue-800 cursor-pointer">
                      {link.link}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end space-y-1">
                    <span className="text-xs md:text-sm text-gray-500">
                      Created: {new Date(link.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${link.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {link.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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