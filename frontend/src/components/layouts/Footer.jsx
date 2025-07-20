import React from "react";
import { Icons } from "../ui/icons";

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-medium">Anonymous Messages</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/terms"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Terms
          </a>
          <a
            href="/privacy"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Privacy
          </a>
          <a
            href="/contact"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Contact
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Anonymous Messages. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
