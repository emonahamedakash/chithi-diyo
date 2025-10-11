import React from "react";
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Inbox from "./pages/Inbox";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateMessageLink from "./pages/CreateMessageLink";
import ProfilePage from "./pages/ProfilePage";


function App() {
  const id = JSON.parse(sessionStorage.getItem("user_auth"));

  if (id) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            {/* Protected Routes */}
            <Route index element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/create-link" element={<CreateMessageLink />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </>
    );
  } else {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position='top-center' />
      </>
    );
  }
}

export default App;
