import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";

export const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messageLinks, setMessageLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();

  const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

  const fetchMessageLinks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/messages/links");
      setMessageLinks(response.data.messageLinks);
      return response.data.messageLinks;
    } catch (error) {
      toast(getErrorMessage(error, "Please try again later"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (linkId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/messages/links/${linkId}/messages`);
      setMessages(response.data.messages);
      return response.data.messages;
    } catch (error) {
      toast(getErrorMessage(error, "Please try again later"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createMessageLink = async (title) => {
    try {
      const response = await api.post("/messages/links", { title });
      setMessageLinks((prev) => [response.data.messageLink, ...prev]);
      toast("Link created successfully");
      return response.data.messageLink;
    } catch (error) {
      toast(getErrorMessage(error, "Failed to create link"));
      throw error;
    }
  };

  const toggleLinkStatus = async (linkId) => {
    try {
      await api.patch(`/messages/links/${linkId}/toggle`);
      setMessageLinks((prev) =>
        prev.map((link) =>
          link.id === linkId ? { ...link, isActive: !link.isActive } : link
        )
      );
    } catch (error) {
      toast(getErrorMessage(error, "Failed to update link"));
      throw error;
    }
  };

  const deleteMessageLink = async (linkId) => {
    try {
      await api.delete(`/messages/links/${linkId}`);
      setMessageLinks((prev) => prev.filter((link) => link.id !== linkId));
      toast("Link deleted successfully");
    } catch (error) {
      toast(getErrorMessage(error, "Failed to delete link"));
      throw error;
    }
  };

  const sendAnonymousMessage = async (linkId, content) => {
    try {
      const response = await api.post(`/messages/send/${linkId}`, { content });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to send message"));
    }
  };

  // Optional: Clear messages when link changes
  useEffect(() => {
    setMessages([]);
  }, [selectedLink]);

  const value = useMemo(
    () => ({
      messageLinks,
      selectedLink,
      setSelectedLink,
      messages,
      isLoading,
      fetchMessageLinks,
      fetchMessages,
      createMessageLink,
      toggleLinkStatus,
      deleteMessageLink,
      sendAnonymousMessage,
    }),
    [messageLinks, selectedLink, messages, isLoading]
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}
