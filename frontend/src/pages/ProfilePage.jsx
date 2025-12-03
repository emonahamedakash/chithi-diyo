import React, { useState, useEffect, useContext } from "react";
import { toast } from "sonner"
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from '../contexts/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaLink,
  FaInbox,
  FaFacebook,
  FaCheck,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import Layout from "../components/layouts/Layout";
import { baseUrl } from "../../baseUrl";

const ProfilePage = () => {
  const [userDetails, setuserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [totalReceivedMessageCount, setTotalReceivedMessageCount] = useState(0);
  const [totalCreatedLinkCount, setTotalCreatedLinkCount] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userId } = useContext(AuthContext);

  useEffect(() => {
    fetchDetails();
    getDashboardData();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/profile/fetch-details/?user_id=${userId}`)
      if (response.status === 200) {
        setuserDetails(response.data.details || {});
        setCurrentPassword(response.data.details.password || "");
      }
      if (response.status === 404) {
        setuserDetails({});
        toast.error("No user found");
      }
      if (response.status === 500) {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dashboard/fetch-dashboard-data`,
        {
          params: { user_id: 1 }
        }
      )

      if (response.status === 200) {
        setTotalReceivedMessageCount(response.data.total_messages);
        setTotalCreatedLinkCount(response.data.total_links);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveChanges = async () => {
    try {
      setEditLoading(true);
      const response = await axios.post(`${baseUrl}/profile/edit`, {
        user_id: userId,
        new_user_name: newUserName,
        new_password: newPassword
      })
    } catch (error) {
      console.log(error)
    } finally {
      setEditLoading(false);
    }
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const toggleSocialConnection = (facebookStatus) => {
    console.log("Facebook button clicked")
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
            <h1 className="text-2xl font-bold">{userDetails.user_name}</h1>
            <p className="text-blue-100">{userDetails.email}</p>
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
              {/* Edit form */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-500 mr-3" />
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={userDetails.user_name}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-700">{userDetails.user_name}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-3" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      disabled
                      className="flex-1 p-2 "
                    />
                  ) : (
                    <p className="text-gray-700">{userDetails.email}</p>
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
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
