import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa"; // react-icon replacement

export function MessagesInbox() {
  const { linkId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkInfo, setLinkInfo] = useState(null);
  const { user } = useAuth(); // fixed hook call

  // You need access to api instance – fix: extract from context or use a custom hook
  const api = user?.api || {
    get: async () => ({ data: {} }), // fallback dummy
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messagesRes, linkRes] = await Promise.all([
          api.get(`/messages/links/${linkId}/messages`),
          api.get(`/messages/links/${linkId}`),
        ]);
        setMessages(messagesRes.data.messages || []);
        setLinkInfo(linkRes.data.messageLink || {});
      } catch (error) {
        toast.error(error.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Messages for: {linkInfo?.title || "Untitled Link"}
          </h2>
          <p className="text-gray-500">
            {messages.length} message{messages.length !== 1 ? "s" : ""} received
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard/links">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Links
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{message.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No messages yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Share your link to start receiving messages</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
