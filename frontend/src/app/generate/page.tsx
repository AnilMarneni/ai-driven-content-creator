"use client";

import { useState } from "react";
import { InputDeck } from "@/components/cockpit/InputDeck";
import { ContentCanvas } from "@/components/workspace/ContentCanvas";

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (data: any) => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: data.contentType,
          tone: data.tone,
          topic: data.topic,
          target_audience: data.audience || "General Audience",
          content_length: data.contentLength,
          keywords: data.keywords,
          formality: data.formality,
          include_emojis: data.includeEmojis,
          model: data.model,
          prompt_override: data.customPrompt ? { custom_template: data.customPrompt } : undefined
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || "Failed to generate content");
      }

      setResult(responseData.content);
      setMetrics(responseData.metrics);

    } catch (err: any) {
      setError(err.message);
      // You might want a toast here
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden">

      {/* Sidebar: Control Deck */}
      {/* Fixed width for the cockpit, adjustable if needed */}
      <aside className="w-[400px] h-full flex-shrink-0">
        <InputDeck
          onGenerate={handleGenerate}
          loading={loading}
        />
      </aside>

      {/* Main: Content Canvas */}
      <main className="flex-1 h-full min-w-0 bg-gray-50/50 relative">
        <ContentCanvas
          content={result}
          loading={loading}
          metrics={metrics}
        />
      </main>

    </div>
  );
}

