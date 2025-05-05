import React, { useState } from "react";
import axios from "axios";

const SmartMail = () => {
  const [formData, setFormData] = useState({
    email_type: "",
    recipient: "",
    sender_name: "",
    message_content: "",
  });

  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkServerStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/health-check");
      if (response.status === 200) {
        setServerReady(true);
        alert("Server is ready to use!");
      }
    } catch (error) {
      console.error("Error checking server status:", error);
      alert("Failed to connect to the server. Please ensure the backend is running.");
    }
  };

  const handleGenerate = async () => {
    if (!serverReady) {
      alert("Please start the server first!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate-mail", formData);
      setGeneratedEmail(response.data.content);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8">Smart Mail Generator</h1>
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
        <button
          onClick={checkServerStatus}
          className={`w-full py-3 px-6 rounded-lg text-lg font-semibold ${
            serverReady ? "bg-green-600 text-white" : "bg-gray-600 text-white"
          } hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        >
          {serverReady ? "Server is Ready" : "Start Server"}
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Type</label>
            <input
              type="text"
              name="email_type"
              value={formData.email_type}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
              placeholder="e.g., Newsletter, Promotion"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Recipient</label>
            <input
              type="email"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
              placeholder="e.g., john.doe@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Sender Name</label>
            <input
              type="text"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
              placeholder="e.g., John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Message Content</label>
            <textarea
              name="message_content"
              value={formData.message_content}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
              placeholder="e.g., Welcome to our service!"
              rows="4"
            ></textarea>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={!serverReady || loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {generatedEmail && (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Email</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-wrap border border-gray-300">
            {generatedEmail}
          </div>
          <button
            onClick={handleCopy}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Copy to Clipboard
          </button>
          {copySuccess && (
            <p className="mt-2 text-sm text-green-600">Copied to clipboard!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartMail;