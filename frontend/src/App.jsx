import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Inbox from "./pages/Inbox";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import CreateMessageLink from "./pages/CreateMessageLink";
import MessageDetails from "./pages/MessageDetails";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const id = JSON.parse(sessionStorage.getItem("user_auth"));

  if (id) {
    return (
      <BrowserRouter>
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/inbox/details" element={<MessageDetails />} />
          <Route path="/create-link" element={<CreateMessageLink />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

// function App() {
//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <BrowserRouter>
//         <AuthProvider>
//           {/* <MessageProvider> */}
//           <div className="min-h-screen bg-background text-foreground">
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<Home />} />

//               {/* Auth Routes with Layout */}
//               <Route element={<AuthLayout />}>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//               </Route>

//               {/* Protected Dashboard Routes */}
//               <Route element={<ProtectedRoute />}>
//                 <Route element={<DashboardLayout />}>
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route
//                     path="/dashboard/links/:linkId"
//                     element={<MessageLink />}
//                   />
//                   {/* <Route
//                     path="/dashboard/create-link"
//                     element={<CreateMessageLink />}
//                   /> */}
//                 </Route>
//               </Route>

//               {/* Protected Admin Routes */}
//               <Route element={<ProtectedRoute roles={["admin"]} />}>
//                 <Route element={<DashboardLayout />}>
//                   <Route path="/admin" element={<Admin />}>
//                     <Route index element={<SystemStats />} />
//                     <Route path="stats" element={<SystemStats />} />
//                     {/* <Route path="users" element={<UserManagement />} /> */}
//                   </Route>
//                 </Route>
//               </Route>

//               {/* 404 Handling */}
//               <Route path="/404" element={<NotFound />} />
//               <Route path="*" element={<Navigate to="/404" replace />} />
//             </Routes>
//           </div>
//           {/* </MessageProvider> */}
//         </AuthProvider>
//       </BrowserRouter>
//       <ToastContainer position="top-center" autoClose={3000} />
//     </ErrorBoundary>
//   );
// }

export default App;
