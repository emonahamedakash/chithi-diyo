import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaUser,
  FaArrowRight,
  FaSpinner,
  FaGoogle,
  FaFacebook,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { errorMsg } from "../helpers/notificationMessage";
import { baseUrl } from "../../baseUrl";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${baseUrl}/user/login`,
        data: {
          email,
          password,
        },
      });

      if (response.data.flag === "SUCCESS") {
        errorMsg("Login Successful ✅");
        const data = {
          token: response.data.user.token,
          id: response.data.user.id,
        };
        sessionStorage.setItem("user_auth", JSON.stringify(data));
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Login failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    // Simulate social login API call
    setTimeout(() => {
      toast.info(`Redirecting to ${provider} authentication...`);
      setSocialLoading(null);
      // In a real app, you would redirect to the provider's auth endpoint
      // window.location.href = `${baseUrl}/auth/${provider}`;
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4"
            >
              <FaLock className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your Chithi Diyo account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="person@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-2"
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength="4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="hover:cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </motion.div>

              <motion.button
                whileHover={{ x: 5 }}
                type="button"
                className="hover:cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </motion.button>
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="hover:cursor-pointer w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <FaArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading === "google"}
              className="hover:cursor-pointer w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {socialLoading === "google" ? (
                <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
              ) : (
                <>
                  <FaGoogle className="h-5 w-5 text-red-600 mr-2" />
                  Google
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin("facebook")}
              disabled={socialLoading === "facebook"}
              className="hover:cursor-pointer w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {socialLoading === "facebook" ? (
                <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
              ) : (
                <>
                  <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                  Facebook
                </>
              )}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Don't have an account?{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/register")}
              className="hover:cursor-pointer font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
            >
              Sign up
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 text-center text-xs text-gray-500"
        >
          Your privacy is our priority. All messages are anonymous and secure.
        </motion.div>
      </motion.div>
    </div>
  );
}
