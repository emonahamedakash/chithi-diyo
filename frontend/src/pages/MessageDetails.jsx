import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCopy,
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaReply,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../baseUrl";

const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setMessage({
            id,
            content:
              "Your presentation at the conference was absolutely brilliant! The way you explained complex concepts with such clarity was truly impressive. I've already shared your insights with my team and we're implementing some of your suggestions.",
            sender: "Anonymous",
            receivedAt: "2025-06-15 at 14:30",
            link: "chithidiyo.me/john",
            isRead: true,
            likes: 24,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            filter: "normal",
            layout: "modern",
          });
          setLoading(false);
        }, 800);

        // In a real app:
        // const response = await axios.get(`${baseUrl}/messages/${id}`);
        // setMessage(response.data);
        // setLoading(false);
      } catch (error) {
        toast.error("Failed to load message");
        navigate("/inbox");
      }
    };

    fetchMessage();
  }, [id, navigate]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app: API call to update like status
  };

  const handleDelete = () => {
    // In a real app: API call to delete message
    toast.success("Message deleted");
    setTimeout(() => navigate("/inbox"), 1000);
  };

  const handleReply = () => {
    // In a real app: Navigate to reply page
    toast.info("Reply feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 text-center">
          <FiMessageSquare className="h-12 w-12 text-blue-400 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading your message...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 text-center">
          <FiMessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800 mt-4">
            Message Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The requested message couldn't be loaded
          </p>
          <button
            onClick={() => navigate("/inbox")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="h-5 w-5" />
          </motion.button>
          <h2 className="text-xl font-bold text-gray-800">Message Details</h2>
        </div>

        {/* Message Content */}
        <div className="p-6">
          {/* Sender Info */}
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={message.image}
                alt="Sender"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full p-1">
                <FiMessageSquare className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{message.sender}</h3>
              <p className="text-sm text-gray-500">{message.receivedAt}</p>
            </div>
          </div>

          {/* Link Info */}
          {message.link && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
              <FaLink className="text-blue-600 mr-2" />
              <span className="text-sm text-blue-600 truncate">
                From: {message.link}
              </span>
            </div>
          )}

          {/* Message Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4 mb-6 relative"
          >
            <p className="text-gray-800 whitespace-pre-line">
              {message.content}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyMessage}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="Copy message"
            >
              <FaCopy
                className={`h-4 w-4 ${isCopied ? "text-green-500" : ""}`}
              />
            </motion.button>
          </motion.div>

          {/* Image (if exists) */}
          {message.image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 rounded-lg overflow-hidden"
              style={{
                filter:
                  message.filter === "bw"
                    ? "grayscale(100%)"
                    : message.filter === "vintage"
                    ? "sepia(70%) brightness(110%) contrast(90%)"
                    : message.filter === "warm"
                    ? "brightness(110%) contrast(110%) saturate(130%)"
                    : message.filter === "cool"
                    ? "brightness(110%) contrast(110%) hue-rotate(180deg)"
                    : "none",
                border:
                  message.layout === "minimal"
                    ? "10px solid white"
                    : message.layout === "framed"
                    ? "20px solid #f0f0f0"
                    : "none",
                backgroundColor:
                  message.layout === "polaroid" ? "white" : "transparent",
                padding:
                  message.layout === "polaroid" ? "20px 20px 60px 20px" : "0",
              }}
            >
              <img
                src={message.image}
                alt="Message content"
                className="w-full h-auto object-cover"
              />
              {message.layout === "polaroid" && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-white flex items-center px-4">
                  <p className="text-gray-800 font-medium">
                    {message.link || "WhisperWave"}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-between border-t border-gray-200 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              {isLiked ? (
                <FaHeart className="text-red-500 mr-2" />
              ) : (
                <FaRegHeart className="mr-2" />
              )}
              <span>{isLiked ? message.likes + 1 : message.likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReply}
              className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FaReply className="mr-2" />
              <span>Reply</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FaTrash className="mr-2" />
              <span>Delete</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageDetails;
