import { useContext } from "react";
import { MessageContext } from "../contexts/MessageContext";

export function useMessages() {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }

  return {
    messageLinks: context.messageLinks,
    selectedLink: context.selectedLink,
    setSelectedLink: context.setSelectedLink,
    messages: context.messages,
    isLoading: context.isLoading,
    fetchMessageLinks: context.fetchMessageLinks,
    fetchMessages: context.fetchMessages,
    createMessageLink: context.createMessageLink,
    toggleLinkStatus: context.toggleLinkStatus,
    deleteMessageLink: context.deleteMessageLink,
    sendAnonymousMessage: context.sendAnonymousMessage,
  };
}
