import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa"; // react-icons

export function AlertMessage({ variant = "default", title, message }) {
  const variants = {
    default: {
      icon: <FaInfoCircle className="h-4 w-4 text-blue-500" />,
      style: "",
    },
    destructive: {
      icon: <FaExclamationTriangle className="h-4 w-4 text-red-500" />,
      style: "destructive",
    },
    success: {
      icon: <FaCheckCircle className="h-4 w-4 text-green-500" />,
      style: "success",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <Alert variant={currentVariant.style}>
      <div className="flex items-start gap-3">
        {currentVariant.icon}
        <div>
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{message}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
