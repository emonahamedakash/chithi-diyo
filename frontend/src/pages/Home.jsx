import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { FaLink, FaEnvelopeOpenText, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="container py-12 mx-auto">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Send and Receive Anonymous Messages
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create your personal link to start receiving anonymous feedback from
          anyone
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="border rounded-lg p-6">
          <FaLink className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Create Your Link</h3>
          <p className="text-gray-600">
            Generate a unique URL to share with friends and colleagues
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FaEnvelopeOpenText className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Receive Messages</h3>
          <p className="text-gray-600">
            People can send you messages without revealing their identity
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FaShieldAlt className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Stay Protected</h3>
          <p className="text-gray-600">We don't store any sender information</p>
        </div>
      </div>
    </div>
  );
}
