import React from "react";
import { Button } from "../ui/button";
import { FaGoogle, FaFacebookF } from "react-icons/fa"; // Importing icons from react-icons

export default function SocialAuthButtons() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/facebook`;
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
        <FaGoogle className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleFacebookLogin}
      >
        <FaFacebookF className="mr-2 h-4 w-4" />
        Continue with Facebook
      </Button>
    </div>
  );
}
