import React, { useState, useEffect, useContext, useRef } from "react";
import { toast } from "sonner"
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from '../contexts/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTimes,
  FaEdit,
  FaCamera,
  FaSpinner,
  FaImage
} from "react-icons/fa";
import Layout from "../components/layouts/Layout";
import { baseUrl } from "../../baseUrl";
import { frontEndUrl } from "../../frontEndUrl";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [totalReceivedMessageCount, setTotalReceivedMessageCount] = useState(0);
  const [totalCreatedLinkCount, setTotalCreatedLinkCount] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState("");

  const fileInputRef = useRef(null);
  const { userId } = useContext(AuthContext);
  console.log("preview image:", previewImage)
  useEffect(() => {
    fetchDetails();
    getDashboardData();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/profile/fetch-details/?user_id=${userId}`)
      if (response.status === 200) {
        setUserDetails(response.data.details || {});
        setCurrentPassword(response.data.details.password || "");
        setNewUserName(response.data.details.user_name || "");
        // Set profile image if exists
        if (response.data.details.profile_picture) {
          const imageUrl = `${frontEndUrl}/images/profile/${response.data.details.profile_picture}`;
          setPreviewImage(imageUrl);
        }
      }
      if (response.status === 404) {
        setUserDetails({});
        toast.error("No user found");
      }
      if (response.status === 500) {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dashboard/fetch-dashboard-data`,
        {
          params: { user_id: userId } // Fixed: use userId from context
        }
      )

      if (response.status === 200) {
        setTotalReceivedMessageCount(response.data.total_messages);
        setTotalCreatedLinkCount(response.data.total_links);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  const handleSaveChanges = async () => {
    // Password validation
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      setEditLoading(true);
      const formData = { updated_at: Math.floor(Date.now / 1000) };
      formData.user_id = userId;

      if (newUserName && newUserName !== userDetails.user_name) {
        formData.user_name = newUserName;
      }

      if (newPassword) {
        formData.new_password = newPassword;
        formData.current_password = currentPassword;
      }

      // If there's a new image selected, append it
      if (uploadedImageName) {
        formData.profile_picture = profileImage;
      }

      const response = await axios.post(
        `${baseUrl}/profile/update-profile`,
        formData
      );

      if (response.data.success) {
        setUserDetails(prev => ({
          ...prev,
          user_name: newUserName || prev.user_name,
          profile_picture: response.data.profile_picture || prev.profile_picture
        }));

        if (response.data.profile_picture) {
          const imageUrl = response.data.profile_picture.startsWith('http')
            ? response.data.profile_picture
            : `${baseUrl}${response.data.profile_picture}`;
          setPreviewImage(imageUrl);
        }

        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const handleImageClick = () => {
    if (editMode) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Store the file object for upload
    setProfileImage(file);
  };

  const uploadProfilePicture = async () => {
    if (!profileImage || typeof profileImage === 'string') {
      toast.error("Please select a new image first");
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('profile_picture', profileImage);
      formData.append('user_id', userId);

      const response = await axios.post(
        `${baseUrl}/profile/upload-profile-picture/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("upload profile picture response: ", response);
      if (response.data.success) {
        toast.success("Profile picture updated successfully!");

        // Update local state with new image URL
        if (response.data.profile_picture) {
          setUploadedImageName(response.data.file || "");
          const imageUrl = `${baseUrl}/${response.data.profile_picture}`;
          setPreviewImage(imageUrl);
          setUserDetails(prev => ({
            ...prev,
            profile_picture: response.data.profile_picture
          }));
        }

        // Reset profileImage to string to prevent re-upload
        setProfileImage(response.data.profile_picture);
      } else {
        toast.error(response.data.message || "Failed to upload picture");
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploadLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      setUploadLoading(true);
      const response = await axios.post(`${baseUrl}/profile/remove-profile-picture/${userId}`);
      if (response.data.success) {
        setPreviewImage(null);
        setProfileImage(null);
        setUserDetails(prev => ({
          ...prev,
          profile_picture: null
        }));
        toast.success("Profile picture removed successfully!");
      } else {
        toast.error(response.data.message || "Failed to remove picture");
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error(error.response?.data?.message || "Failed to remove profile picture");
    } finally {
      setUploadLoading(false);
    }
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
          {/* Profile Header with Picture */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white text-center relative">
            <motion.div
              whileHover={{ scale: editMode ? 1.05 : 1 }}
              className={`mx-auto h-32 w-32 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4 border-4 border-white relative ${editMode ? 'cursor-pointer hover:bg-opacity-30' : ''}`}
              onClick={handleImageClick}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-blue-800 flex items-center justify-center">
                  <FaUser className="h-12 w-12" />
                </div>
              )}

              {editMode && (
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white">
                  <FaCamera className="h-4 w-4" />
                </div>
              )}
            </motion.div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {editMode && (
              <div className="mt-4 flex justify-center gap-2">
                {previewImage && profileImage && typeof profileImage !== 'string' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={uploadProfilePicture}
                    disabled={uploadLoading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaImage />
                        Save Picture
                      </>
                    )}
                  </motion.button>
                )}

                {previewImage && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeProfilePicture}
                    disabled={uploadLoading}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaTimes />
                    Remove Picture
                  </motion.button>
                )}
              </div>
            )}

            <h1 className="text-2xl font-bold">{userDetails?.user_name}</h1>
            <p className="text-blue-100">{userDetails?.email}</p>
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
                      onClick={() => {
                        setEditMode(false);
                        setNewUserName(userDetails?.user_name || "");
                        setNewPassword("");
                        setConfirmPassword("");
                        setCurrentPassword("");
                        // Reset preview if image was changed but not saved
                        if (userDetails?.profile_picture) {
                          const imageUrl = `${baseUrl}/images/profile/${userDetails.profile_picture}`;
                          setPreviewImage(imageUrl);
                        } else {
                          setPreviewImage(null);
                        }
                        setProfileImage(userDetails?.profile_picture || null);
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={editLoading}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {editLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit /> Edit Profile
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
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                      placeholder="Username"
                    />
                  ) : (
                    <p className="text-gray-700">{userDetails?.user_name}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-3" />
                  <p className="text-gray-700">{userDetails?.email}</p>
                </div>

                {editMode && (
                  <>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password (required for password change)"
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password (leave empty to keep current)"
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaLock className="text-gray-500 mr-3" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Messages Received</h3>
                <p className="text-2xl font-bold text-blue-600">{totalReceivedMessageCount}</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Links Created</h3>
                <p className="text-2xl font-bold text-cyan-600">{totalCreatedLinkCount}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;