import React, { useEffect } from "react";
import {
  FaLock,
  FaUserPlus,
  FaPaperPlane,
  FaEyeSlash,
  FaHeart,
  FaSmile,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [ref2, inView2] = useInView();
  const [ref3, inView3] = useInView();
  const [ref4, inView4] = useInView();

  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm fixed w-full z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="flex-shrink-0 flex items-center">
                <FaEnvelope className="h-8 w-8 text-blue-600 animate-pulse" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Chithi Diyo
                </span>
              </div>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium transition-all duration-300"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Send Messages Anonymously
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-lg mx-auto text-xl text-gray-600"
          >
            Share your thoughts, confessions, or compliments without revealing
            your identity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex justify-center space-x-4"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(37, 99, 235, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium transition-all duration-300 flex items-center"
              onClick={() => navigate("/login")}
            >
              <FaUserPlus className="mr-2" />
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-white text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300 flex items-center"
            >
              <FaLock className="mr-2" />
              How It Works
            </motion.button>
          </motion.div>
        </div>

        {/* App Preview */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-2xl h-64 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-3xl blur-3xl opacity-60 animate-pulse"></div>
          </div>
          <div className="relative flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Social media app preview"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            ref={ref2}
            initial={{ opacity: 0, y: 20 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold text-center text-gray-900 mb-12"
          >
            Why Choose Chithi Diyo?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{
                y: -10,
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <FaEyeSlash className="h-8 w-8 text-blue-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                100% Anonymous
              </h3>
              <p className="text-gray-600">
                Your identity stays hidden. We don't store any personal
                information about senders.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{
                y: -10,
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mb-4">
                <FaPaperPlane className="h-8 w-8 text-cyan-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Instant Delivery
              </h3>
              <p className="text-gray-600">
                Messages arrive instantly with real-time notifications for
                recipients.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{
                y: -10,
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                <FaHeart className="h-8 w-8 text-indigo-600 animate-ping" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Spread Positivity
              </h3>
              <p className="text-gray-600">
                Perfect for sending compliments, confessions, or constructive
                feedback.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            ref={ref3}
            initial={{ opacity: 0, y: 20 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold text-center text-gray-900 mb-12"
          >
            Join Our Community
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                alt="Social media users"
                className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                alt="Social media users"
                className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                alt="Social media users"
                className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                alt="Social media users"
                className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
              />
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <motion.img
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                  alt="User"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Sumaiya</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I received the most beautiful anonymous compliment through
                Chithi Diyo. It made my whole week!"
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <motion.img
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                  alt="User"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Riaz</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Finally a way to give honest feedback without worrying about
                awkwardness. Chithi Diyo is brilliant!"
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        ref={ref4}
        initial={{ opacity: 0, y: 20 }}
        animate={inView4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            Ready to Start Sending Anonymous Messages?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are spreading positivity and honesty
            anonymously.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 20px rgba(255, 255, 255, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-white text-blue-600 font-bold transition-all duration-300 flex items-center"
              onClick={() => navigate("/register")}
            >
              Sign Up Free <FaArrowRight className="ml-2" />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold transition-all duration-300"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div>
              <h3 className="text-lg font-bold mb-4">Chithi Diyo</h3>
              <p className="text-gray-400">
                The safest way to send anonymous messages online.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    About
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    Careers
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    Privacy
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    Terms
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    Blog
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    Help Center
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ color: "#ffffff", x: 5 }}
                    href="#"
                    className="text-gray-400 transition-all duration-300"
                  >
                    Community
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400"
          >
            <p>&copy; 2025 Chithi Diyo. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
