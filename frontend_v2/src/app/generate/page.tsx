"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [contentType, setContentType] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateContent = async () => {
    if (!contentType || !topic) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          topic,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setResult(data.content);
    } catch {
      setError("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Generate AI Content
          </h2>
          <p className="text-sm text-gray-500">
            Blogs, LinkedIn posts, tweets & more
          </p>
        </div>

        <select
          className="w-full border rounded-md px-4 py-2"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="">Select content type</option>
          <option value="blog">Blog</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tweet">Tweet</option>
          <option value="email">Email</option>
        </select>

        <input
          className="w-full border rounded-md px-4 py-2"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generateContent}
          disabled={!contentType || !topic || loading}
          className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {result && (
          <div className="bg-gray-50 border rounded-md p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Output</span>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-sm text-blue-600 hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
