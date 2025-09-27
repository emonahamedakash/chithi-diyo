import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRegCopy,
  FaRegEye,
  FaRegEyeSlash,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { baseUrl } from "../../baseUrl";

const InboxPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const id = 1;

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/inbox/fetch-message-list/${id}`);
      console.log(response);

      if (response.data.flag === "SUCCESS") {
        // Transform API data to match component format
        const transformedMessages = response.data.list.map(msg => ({
          id: msg.id,
          senderImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          senderName: "Anonymous",
          messagePreview: msg.message.length > 60 ? `${msg.message.substring(0, 60)}...` : msg.message,
          fullMessage: msg.message,
          date: new Date(msg.created_at).toLocaleDateString('en-CA'), // YYYY-MM-DD format
          time: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          isRead: msg.is_read === 1,
          link: "chithidiyo.me/user", // Default link since API doesn't provide this
          clickCount: msg.click_count,
          created_at: msg.created_at
        }));

        setMessages(transformedMessages);
      } else {
        console.log('No messages found or API error');
        setMessages([]);
      }
    } catch (err) {
      console.log(err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Update local state immediately for better UX
      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
      );

      // Call API to mark as read
      await axios.patch(`${baseUrl}/inbox/mark-as-read/${id}`);
    } catch (err) {
      console.log("Error marking as read:", err);
      // Revert local state on error
      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, isRead: false } : msg))
      );
    }
  };

  const markAsUnread = async (id) => {
    try {
      // Update local state immediately for better UX
      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, isRead: false } : msg))
      );

      // Call API to mark as unread
      await axios.patch(`${baseUrl}/inbox/mark-as-unread/${id}`);
    } catch (err) {
      console.log("Error marking as unread:", err);
      // Revert local state on error
      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
      );
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification in a real app
  };

  const filteredMessages = messages.filter((msg) =>
    msg.fullMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.messagePreview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Your Inbox
            </h1>
            <p className="text-gray-600">
              All your anonymous messages in one place
            </p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mb-6 md:mb-8"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </motion.div>

          {/* Message List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md p-4 h-24 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.01 }}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${message.isRead ? "border-gray-200" : "border-blue-500"
                        }`}
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => {
                          if (!message.isRead) {
                            markAsRead(message.id);
                          }
                          navigate(`/messages/${message.id}`);
                        }}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <img
                              src={message.senderImage}
                              alt="Sender"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {message.senderName}
                              </h3>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDate(message.created_at)} • {message.time}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${message.isRead
                                ? "text-gray-600"
                                : "text-gray-800 font-medium"
                                } truncate`}
                            >
                              {message.messagePreview}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-blue-600 truncate">
                                From: {message.link}
                              </p>
                              <span className="text-xs text-gray-400">
                                Clicks: {message.clickCount}
                              </span>
                            </div>
                          </div>
                          <FaChevronRight className="text-gray-400 ml-2 mt-1" />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (message.isRead) {
                              markAsUnread(message.id);
                            } else {
                              markAsRead(message.id);
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                          title={
                            message.isRead ? "Mark as unread" : "Mark as read"
                          }
                        >
                          {message.isRead ? (
                            <FaRegEyeSlash className="h-4 w-4" />
                          ) : (
                            <FaRegEye className="h-4 w-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyMessage(message.fullMessage);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                          title="Copy message"
                        >
                          <FaRegCopy className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl shadow-md p-8 text-center"
                  >
                    <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {searchQuery ? "No messages found" : "No messages yet"}
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? "Try a different search term"
                        : "You don't have any messages yet"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default InboxPage;