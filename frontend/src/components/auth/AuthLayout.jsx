import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/assets/images/logo/logo.png" className="h-12 w-auto" />
        </div>
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
