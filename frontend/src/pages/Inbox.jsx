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

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/message/fetch-message-list?user_id=${userId}`);
      if (response.data.success) {
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
      const response = await axios.patch(`${baseUrl}/message/add-to-favourite/${messageId}`);
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
        await axios.delete(`${baseUrl}/message/delete-message/${messageId}`);
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
        toast.error("Failed to delete message");
      }
    }
  };

  const handleMarkAsRead = async (messageId, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await axios.patch(`${baseUrl}/message/mark-as-read/${messageId}`);

      // Update message read status locally - using mark_as_read from API response
      setMessageList(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, mark_as_read: 1 } : msg
        )
      );
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
    if (message.mark_as_read === 0) {
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
      copyMessage(selectedMessage.message_text);
    }
  };

  // Format timestamp to be more readable
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Extract time from timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format full date for dialog
  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
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
    if (!message) return '';
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
                      className={`relative rounded-2xl shadow-lg overflow-hidden border-2 ${message.mark_as_read === 1
                        ? "bg-gradient-to-r from-gray-50 to-white border-gray-100 shadow-sm"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100/50"
                        } transition-all duration-300`}
                    >
                      {/* Message Header */}
                      <div className={`p-5 ${message.mark_as_read === 1 ? '' : 'border-b border-blue-100/50'}`}>
                        {/* Link Info */}
                        {message.link_title && (
                          <div className={`mb-3 p-3 rounded-xl ${message.mark_as_read === 1
                            ? "bg-gray-100/80"
                            : "bg-blue-100/80 border border-blue-200/50"
                            }`}>
                            <div className="flex items-center mb-1">
                              <FaLink className={`mr-2 ${message.mark_as_read === 1 ? "text-gray-600" : "text-blue-600"
                                }`} />
                              <span className={`text-sm font-medium truncate ${message.mark_as_read === 1 ? "text-gray-700" : "text-blue-700"
                                }`}>
                                {message.link_title}
                              </span>
                            </div>
                            {message.link && (
                              <div className="text-xs text-slate-500 truncate" title={message.link}>
                                {message.link}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="flex items-start mt-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className={`text-base font-semibold leading-relaxed ${message.mark_as_read === 1 ? "text-gray-700" : "text-gray-900"
                                }`}>
                                {truncateMessage(message.message_text)}
                              </h3>
                              <span className={`text-sm ml-3 whitespace-nowrap flex items-center ${message.mark_as_read === 1 ? "text-gray-500" : "text-blue-600 font-medium"
                                }`}>
                                <FaClock className={`mr-1 ${message.mark_as_read === 1 ? "text-gray-400" : "text-blue-400"
                                  }`} />
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`px-5 py-4 flex justify-between items-center ${message.mark_as_read === 1
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
                              : `text-gray-500 hover:text-red-600 ${message.mark_as_read === 1
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
                            className={`p-3 rounded-xl transition-all text-gray-500 hover:text-red-600 ${message.mark_as_read === 1
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
                            className={`p-3 rounded-xl transition-all text-gray-500 hover:text-purple-600 ${message.mark_as_read === 1
                              ? "hover:bg-gray-100"
                              : "hover:bg-blue-100"
                              }`}
                            title="See full message"
                          >
                            <FaEye className="h-4 w-4" />
                          </motion.button>

                          {/* Mark as Read Button */}
                          {message.mark_as_read === 0 && (
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
                              copyMessage(message.message_text);
                            }}
                            className={`p-3 rounded-xl transition-all text-gray-500 hover:text-blue-600 ${message.mark_as_read === 1
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
                {/* Link Info */}
                {selectedMessage.link_title && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center text-sm text-blue-700 mb-1">
                      <FaLink className="mr-2 h-4 w-4" />
                      <span className="font-medium">{selectedMessage.link_title}</span>
                    </div>
                    {selectedMessage.link && (
                      <div className="text-xs text-blue-600 truncate" title={selectedMessage.link}>
                        {selectedMessage.link}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message_text}
                  </p>
                </div>

                {/* Message Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaClock className="h-3 w-3" />
                    <span>{formatFullDate(selectedMessage.created_at)}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${selectedMessage.mark_as_read === 1
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-100 text-blue-600"
                    }`}>
                    {selectedMessage.mark_as_read === 1 ? "Read" : "Unread"}
                  </div>
                </div>

                {/* Click Count */}
                {selectedMessage.click_count !== null && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Clicks:</span> {selectedMessage.click_count}
                  </div>
                )}

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