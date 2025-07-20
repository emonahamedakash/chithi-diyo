import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useApi } from "../../hooks/useApi";
import { Loader } from "../layouts/Loader";

export function AnonymousMessageForm({ linkId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await api.post(`/messages/send/${linkId}`, { content: message });
      setMessage("");
      toast({
        title: "Message sent!",
        description: "Your anonymous message has been delivered.",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Send Anonymous Message</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          className="min-h-[120px]"
          disabled={loading}
          required
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !message.trim()}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </form>
      <p className="text-sm text-gray-500">
        Your identity will remain hidden. Be kind!
      </p>
    </div>
  );
}
