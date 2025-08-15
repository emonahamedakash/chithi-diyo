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

const InboxPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          senderImage:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          senderName: "Anonymous",
          messagePreview:
            "Your work on the project was amazing! I really appreciate your attention to detail...",
          fullMessage:
            "Your work on the project was amazing! I really appreciate your attention to detail and the way you handled the challenges that came up. Looking forward to seeing more of your great work in the future!",
          date: "2025-06-15",
          time: "14:30",
          isRead: false,
          link: "chithidiyo.me/john",
        },
        {
          id: 2,
          senderImage:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          senderName: "Anonymous",
          messagePreview:
            "Just wanted to say you're doing great! Keep up the good work...",
          fullMessage:
            "Just wanted to say you're doing great! Keep up the good work and don't let anyone tell you otherwise. Your dedication is inspiring to those around you.",
          date: "2025-06-14",
          time: "09:15",
          isRead: true,
          link: "chithidiyo.me/feedback",
        },
        {
          id: 3,
          senderImage:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          senderName: "Anonymous",
          messagePreview:
            "I noticed your presentation yesterday - it was outstanding!...",
          fullMessage:
            "I noticed your presentation yesterday - it was outstanding! The way you explained complex concepts so clearly was impressive. You have a real talent for communication.",
          date: "2025-06-12",
          time: "16:45",
          isRead: false,
          link: "chithidiyo.me/work",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification in a real app
  };

  const filteredMessages = messages.filter((msg) =>
    msg.messagePreview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
                    className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                      message.isRead ? "border-gray-200" : "border-blue-500"
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => {
                        markAsRead(message.id);
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
                              {message.date} • {message.time}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              message.isRead
                                ? "text-gray-600"
                                : "text-gray-800 font-medium"
                            } truncate`}
                          >
                            {message.messagePreview}
                          </p>
                          <p className="text-xs text-blue-600 mt-1 truncate">
                            From: {message.link}
                          </p>
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
                          markAsRead(message.id);
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
                    No messages found
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
  );
};

export default InboxPage;
