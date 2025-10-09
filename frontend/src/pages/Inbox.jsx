import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaLink,
  FaCopy,
  FaEnvelopeOpen,
  FaClock,
  FaEye
} from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { FiMessageSquare } from "react-icons/fi";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { baseUrl } from "../../baseUrl";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

const InboxPage = () => {
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [favouritedMessages, setFavouritedMessages] = useState(new Set());
  const { userId } = useContext(AuthContext);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  console.log("user id from context: ", userId);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/inbox/fetch-message-list/${userId}`);
      console.log(response);

      if (response.status === 200 && response.data.flag === "SUCCESS") {
        setMessageList(response.data.list || []);
      } else {
        console.log('No messages found or API error');
        setMessageList([]);
      }
    } catch (err) {
      console.log(err);
      setMessageList([]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddToFavourite = async (messageId, e) => {
    e.stopPropagation();
    try {
      const response = await axios.patch(`${baseUrl}/inbox/add-to-favourite/${messageId}`);
      console.log("handleAddToFavourite: ", response);
      setFavouritedMessages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(messageId)) {
          newSet.delete(messageId);
          toast.success("Removed from favourites");
        } else {
          newSet.add(messageId);
          toast.success("Added to favourites");
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error liking message:", error);
      toast.error("Failed to update favourite status");
    }
  };

  const handleDelete = async (messageId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${baseUrl}/inbox/delete-message/${messageId}`);
        toast.success("Message deleted");

        // Remove message from local state
        setMessageList(prev => prev.filter(msg => msg.id !== messageId));

        // Remove from favourites if it was favourited
        setFavouritedMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });

        // Close dialog if the deleted message was open
        if (selectedMessage && selectedMessage.id === messageId) {
          setIsDialogOpen(false);
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  const handleMarkAsRead = async (messageId, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await axios.patch(`${baseUrl}/inbox/mark-as-read/${messageId}`);
      console.log("handleMarkAsRead: ", response);

      // Update message read status locally
      setMessageList(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
      toast.success("Message marked as read");
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to mark message as read");
    }
  };

  // Open dialog and set selected message
  const handleSeeDetails = (message, e) => {
    e.stopPropagation();
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // Mark as read when opening details if not already read
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMessage(null);
  };

  // Copy message from dialog
  const handleCopyMessage = () => {
    if (selectedMessage) {
      copyMessage(selectedMessage.message);
    }
  };

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

  // Extract time from date string
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format full date for dialog
  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Truncate message for title
  const truncateMessage = (message, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
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
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence>
                {messageList.length > 0 ? (
                  messageList.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative rounded-2xl shadow-lg overflow-hidden border-2 ${message.is_read
                        ? "bg-gradient-to-r from-gray-50 to-white border-gray-100 shadow-sm"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100/50"
                        } transition-all duration-300`}
                    >
                      {/* Message Header */}
                      <div className={`p-5 ${message.is_read ? '' : 'border-b border-blue-100/50'}`}>
                        {/* Link Info */}
                        {message.title && (
                          <div className={`mb-3 p-3 rounded-xl ${message.is_read
                            ? "bg-gray-100/80"
                            : "bg-blue-100/80 border border-blue-200/50"
                            }`}>
                            <FaLink className={`mr-2 ${message.is_read ? "text-gray-600" : "text-blue-600"
                              }`} />
                            <span className={`text-sm font-medium truncate ${message.is_read ? "text-gray-700" : "text-blue-700"
                              }`}>
                              From: {message.title}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <CiCalendar className="w-4 h-4" />
                              <span>Link created {formatDate(message.link_created_at)} at {formatTime(message.link_created_at)}</span>
                            </div>
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="flex items-start mt-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className={`text-base font-semibold leading-relaxed ${message.is_read ? "text-gray-700" : "text-gray-900"
                                }`}>
                                {truncateMessage(message.message)}
                              </h3>
                              <span className={`text-sm ml-3 whitespace-nowrap flex items-center ${message.is_read ? "text-gray-500" : "text-blue-600 font-medium"
                                }`}>
                                <FaClock className={`mr-1 ${message.is_read ? "text-gray-400" : "text-blue-400"
                                  }`} />
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`px-5 py-4 flex justify-between items-center ${message.is_read
                        ? "bg-gray-50/80 border-t border-gray-100"
                        : "bg-blue-50/80 border-t border-blue-100"
                        }`}>
                        <div className="flex space-x-1">
                          {/* Favourite Button */}
                          <motion.button
                            whileHover={{ scale: 1.1, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleAddToFavourite(message.id, e)}
                            className={`p-3 rounded-xl transition-all ${favouritedMessages.has(message.id)
                              ? "text-red-500 bg-red-50 shadow-sm"
                              : `text-gray-500 hover:text-red-600 ${message.is_read
                                ? "hover:bg-gray-100"
                                : "hover:bg-blue-100"
                              }`
                              }`}
                            title={favouritedMessages.has(message.id) ? "Remove from favourites" : "Add to favourites"}
                          >
                            {favouritedMessages.has(message.id) ? (
                              <FaHeart className="h-4 w-4" />
                            ) : (
                              <FaRegHeart className="h-4 w-4" />
                            )}
                          </motion.button>

                          {/* Delete Button */}
                          <motion.button
                            whileHover={{ scale: 1.1, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleDelete(message.id, e)}
                            className={`p-3 rounded-xl transition-all text-gray-500 hover:text-red-600 ${message.is_read
                              ? "hover:bg-gray-100"
                              : "hover:bg-blue-100"
                              }`}
                            title="Delete message"
                          >
                            <FaTrash className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <div className="flex space-x-1">
                          {/* See Details Button */}
                          <motion.button
                            whileHover={{ scale: 1.1, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleSeeDetails(message, e)}
                            className={`p-3 rounded-xl transition-all text-gray-500 hover:text-purple-600 ${message.is_read
                              ? "hover:bg-gray-100"
                              : "hover:bg-blue-100"
                              }`}
                            title="See full message"
                          >
                            <FaEye className="h-4 w-4" />
                          </motion.button>

                          {/* Mark as Read Button */}
                          {!message.is_read && (
                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleMarkAsRead(message.id, e)}
                              className="p-3 rounded-xl transition-all text-gray-500 hover:text-green-600 hover:bg-green-50"
                              title="Mark as read"
                            >
                              <FaEnvelopeOpen className="h-4 w-4" />
                            </motion.button>
                          )}

                          {/* Copy Button */}
                          <motion.button
                            whileHover={{ scale: 1.1, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              copyMessage(message.message);
                            }}
                            className={`p-3 rounded-xl transition-all text-gray-500 hover:text-blue-600 ${message.is_read
                              ? "hover:bg-gray-100"
                              : "hover:bg-blue-100"
                              }`}
                            title="Copy message"
                          >
                            <FaCopy className={`h-4 w-4 ${isCopied ? "text-green-500" : ""}`} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMessageSquare className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Your inbox is empty. New messages will appear here when you receive them.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Shadcn Dialog for Message Details */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FiMessageSquare className="h-5 w-5 text-blue-600" />
                Message Details
              </DialogTitle>
              <DialogDescription>
                Full message content and details
              </DialogDescription>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-4">
                {/* Sender Info */}
                {selectedMessage.title && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center text-sm text-blue-700">
                      <FaLink className="mr-2 h-4 w-4" />
                      <span className="font-medium">From: {selectedMessage.title}</span>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Message Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaClock className="h-3 w-3" />
                    <span>{formatFullDate(selectedMessage.created_at)}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${selectedMessage.is_read
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-100 text-blue-600"
                    }`}>
                    {selectedMessage.is_read ? "Read" : "Unread"}
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="flex items-center gap-2"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <FaCopy className="h-4 w-4" />
                    Copy Message
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default InboxPage;