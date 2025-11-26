import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaSpinner,
  FaFacebook,
} from "react-icons/fa";
import { toast } from "sonner"
import axios from "axios";
import { baseUrl } from "../../baseUrl";
export default function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        url: `${baseUrl}/auth/register`,
        data: {
          user_name: username,
          email,
          password,
        },
      });

      console.log("response: ", response);

      if (response?.data?.success) {
        toast.success("Registration Successful ✅");
        window.location.href = "/login"
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.error(error.response?.data?.message || "User already exist.");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log("trying to register with facebook");
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
              Create Account
            </h2>
            <p className="text-gray-600">Join our Chithi Diyo community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  placeholder="arafat_hossain"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="test@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters
              </p>
            </motion.div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account <FaArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Social Registration Divider */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div> */}

          {/* Social Registration Buttons */}
          <div>


            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialRegister("facebook")}
              disabled={socialLoading === "facebook"}
              className="cursor-pointer w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {socialLoading === "facebook" ? (
                <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
              ) : (
                <>
                  <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                  Facebook
                </>
              )}
            </motion.button> */}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Already have an account?{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
            >
              Sign in
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
