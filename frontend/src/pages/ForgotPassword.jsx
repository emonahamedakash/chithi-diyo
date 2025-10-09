import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaArrowLeft,
  FaCheck,
  FaSpinner,
  FaLock,
} from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { baseUrl } from "../../baseUrl";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would use:
      // const response = await axios.post(`${baseUrl}/auth/forgot-password`, { email });

      toast.success("Password reset link sent to your email!");
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
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
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to login
          </motion.button>

          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4"
            >
              <FaLock className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {success ? "Check Your Email" : "Forgot Password"}
            </h2>
            <p className="text-gray-600">
              {success
                ? "We've sent a password reset link to your email address"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {!success ? (
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
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </motion.div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-6"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <FaCheck className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-6">
                If you don't see the email, check your spam folder or try
                resending.
              </p>
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Resending...
                  </>
                ) : (
                  "Resend Link"
                )}
              </motion.button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Need help?{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/contact")}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
            >
              Contact support
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
          Your security is important to us. We'll never share your email.
        </motion.div>
      </motion.div>
    </div>
  );
}
