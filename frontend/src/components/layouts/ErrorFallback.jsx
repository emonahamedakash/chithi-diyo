import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

export function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border border-destructive">
        <div className="flex flex-col items-center">
          <FaExclamationTriangle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mt-2">
            We encountered an unexpected error
          </p>
        </div>

        <div className="bg-destructive/10 p-4 rounded-md text-left">
          <p className="text-sm font-mono text-destructive">{error.message}</p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="default"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <FaHome className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={resetErrorBoundary}
            className="flex items-center gap-2"
          >
            <FaRedo className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
