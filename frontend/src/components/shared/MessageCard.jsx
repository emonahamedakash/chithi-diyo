import React from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { useToast } from "../ui/use-toast";

export function MessageCard({ message, onDelete, isOwner = false }) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied to clipboard",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8"
          >
            <Icons.copy className="h-4 w-4" />
          </Button>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(message.id)}
              className="h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{message.content}</p>
      </CardContent>
    </Card>
  );
}
