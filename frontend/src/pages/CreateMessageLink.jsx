import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaCopy, FaShare, FaSpinner } from "react-icons/fa";

const CreateMessageLink = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const { id } = JSON.parse(sessionStorage.getItem("user_auth"));

  const handleGenerateLink = async () => {
    console.log("Button clicked");
    setIsLoading(true);

    try {
      // API call to generate link
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/links/create`,
        data: {
          user_id: id,
          title: title,
        },
      });
      console.log("Response from server: ", response);
      if (response.status === 201) {
        setGeneratedLink(response.data.link);
        navigator.clipboard.writeText(response.data.link);
        toast.success("Link generated and copied to clipboard!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleShareLink = () => {
    if (!generatedLink) return;

    if (navigator.share) {
      navigator
        .share({
          title: "Chithi Diyo Message Link",
          text: `Check out my Chithi Diyo message: ${title}`,
          url: generatedLink,
        })
        .catch(() => {
          toast.info("Share action was cancelled");
        });
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out my Chithi Diyo message: ${title}`
      )}&url=${encodeURIComponent(generatedLink)}`;
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Create Message Link
        </h1>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your message"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Generate Button */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleGenerateLink}
            disabled={isLoading || !title.trim()}
            className={`flex items-center px-6 py-2 rounded-lg text-white font-medium ${
              isLoading || !title.trim()
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate Link"
            )}
          </button>

          {generatedLink && (
            <button
              onClick={handleCopyLink}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
            >
              <FaCopy className="mr-2" />
              Copy Link
            </button>
          )}
        </div>

        {/* Preview Section */}
        {generatedLink && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Your Generated Link
            </h3>
            <div className="flex items-center">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-white text-gray-700 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                <FaCopy />
              </button>
            </div>
          </div>
        )}

        {/* Share Button */}
        {generatedLink && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareLink}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium"
            >
              <FaShare className="mr-2" />
              Share Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMessageLink;
