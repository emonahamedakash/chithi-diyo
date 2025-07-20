import React from "react";
import { Link } from "react-router-dom";
import RegistrationForm from "../components/auth/RegistrationForm";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";

export default function Register() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-gray-500 mt-2">
            Enter your details to get started
          </p>
        </div>
        <RegistrationForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SocialAuthButtons />
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
