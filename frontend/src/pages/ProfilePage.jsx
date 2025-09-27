import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaLink,
  FaInbox,
  FaGoogle,
  FaFacebook,
  FaCheck,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import Layout from "../components/layouts/Layout";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setUserData({
        username: "test",
        email: "test@example.com",
        socialConnections: {
          google: true,
          facebook: false,
        },
        stats: {
          receivedMessages: 42,
          createdLinks: 7,
        },
      });
      setFormData({
        username: "test",
        email: "test@example.com",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Add password validation and API call here
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const toggleSocialConnection = (provider) => {
    setUserData((prev) => ({
      ...prev,
      socialConnections: {
        ...prev.socialConnections,
        [provider]: !prev.socialConnections[provider],
      },
    }));
    // In a real app, you would call API to connect/disconnect
    const action = userData.socialConnections[provider]
      ? "disconnected"
      : "connected";
    toast.info(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} ${action}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full animate-pulse mx-auto"></div>
          <div className="h-6 w-3/4 bg-gray-200 rounded mt-4 mx-auto animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mx-auto h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4"
            >
              <FaUser className="h-12 w-12" />
            </motion.div>
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <p className="text-blue-100">{userData.email}</p>
          </div>

          <div className="p-6 md:p-8">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Account Information
                </h2>
                {editMode ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-500 mr-3" />
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-700">{userData.username}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-3" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-700">{userData.email}</p>
                  )}
                </div>

                {editMode && (
                  <>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Social Connections */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Social Connections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["google", "facebook"].map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      {provider === "google" && (
                        <FaGoogle className="text-red-500 mr-3" />
                      )}
                      {provider === "facebook" && (
                        <FaFacebook className="text-blue-600 mr-3" />
                      )}

                      <span className="capitalize">{provider}</span>
                    </div>
                    {userData.socialConnections[provider] ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSocialConnection(provider)}
                        className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm"
                      >
                        <FaTimes className="mr-1" /> Disconnect
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSocialConnection(provider)}
                        className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm"
                      >
                        <FaCheck className="mr-1" /> Connect
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center">
                  <FaInbox className="text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Received Messages
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData.stats.receivedMessages}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-500">
                <div className="flex items-center">
                  <FaLink className="text-cyan-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Created Links
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData.stats.createdLinks}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
