import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
// React Icons
import { FaPlus, FaCopy, FaEye } from "react-icons/fa";

export default function MessageLinksList() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useAuth();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get("/messages/links");
        setLinks(response.data.messageLinks);
      } catch (error) {
        toast({
          title: "Failed to load links",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const toggleLinkStatus = async (linkId, currentStatus) => {
    try {
      await api.patch(`/messages/links/${linkId}/toggle`);
      setLinks(
        links.map((link) =>
          link.id === linkId ? { ...link, isActive: !currentStatus } : link
        )
      );
    } catch (error) {
      toast(error.message || "Failed to update link");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Message Links</h2>
        <Button asChild>
          <Link to="/dashboard/create-link">
            <FaPlus className="mr-2 h-4 w-4" />
            New Link
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Messages</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>{link.title || "Untitled"}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-2">
                    {`${window.location.origin}/m/${link.uniqueLink}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/m/${link.uniqueLink}`
                      )
                    }
                  >
                    <FaCopy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{link.messageCount || 0}</TableCell>
              <TableCell>
                <Switch
                  checked={link.isActive}
                  onCheckedChange={() =>
                    toggleLinkStatus(link.id, link.isActive)
                  }
                />
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="icon">
                  <Link to={`/dashboard/links/${link.id}`}>
                    <FaEye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
