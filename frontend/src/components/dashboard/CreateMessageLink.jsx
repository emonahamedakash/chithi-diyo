import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../ui/use-toast";

export function CreateMessageLink() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/messages/links", { title });
      navigate("/dashboard/links");
      toast({
        title: "Link created successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to create link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create New Message Link</h1>
        <p className="text-gray-500">
          Create a unique link to receive anonymous messages
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Link Title (Optional)</Label>
          <Input
            id="title"
            placeholder="e.g., Feedback for my work"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Link"}
        </Button>
      </form>
    </div>
  );
}
