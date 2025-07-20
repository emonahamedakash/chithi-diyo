export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US").format(num);
};
