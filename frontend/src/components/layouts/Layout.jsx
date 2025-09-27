// components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
            <Navbar />
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;