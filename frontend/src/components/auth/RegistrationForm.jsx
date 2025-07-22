import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../../baseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { errorMsg } from "../../helpers/notificationMessage";

export default function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  //Calling API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Calling api...");
      const response = await axios({
        method: "post",
        url: `${baseUrl}/auth/register`,
        data: {
          user_name: username,
          email,
          password,
        },
      });
      console.log("Response: ", response);
      if (response.data.flag === "SUCCESS") {
        toast.success({
          autoClose: 1500,
        });
        errorMsg("Register Successfull...\n Redirecting to login page...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log("Error: ", error);
      errorMsg(
        error?.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="john_doe"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters
          </p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button
          variant="link"
          className="px-0"
          onClick={() => navigate("/login")}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
