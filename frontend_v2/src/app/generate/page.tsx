"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("LinkedIn Post");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setOutput("");

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
        throw new Error("Failed to generate content");
      }

      const data = await res.json();
      setOutput(data.content);
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">✍️ Generate Content</h1>

      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Topic (e.g. Why AI is important)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <Input
            placeholder="Content Type (e.g. LinkedIn Post)"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          />

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
