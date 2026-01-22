"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [contentType, setContentType] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateContent = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_type: contentType,
          topic: topic,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setResult(data.content);
    } catch (err) {
      setError("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-semibold">
        Generate AI Content
      </h1>

      <div className="space-y-4">
        <input
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Content type (blog, tweet, post)"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        />

        <input
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generateContent}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {result && (
        <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
