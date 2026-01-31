"use client";

import { useState } from "react";
import { InputDeck } from "@/components/cockpit/InputDeck";
import { ContentCanvas } from "@/components/workspace/ContentCanvas";
import { PromptStudio } from "@/components/advanced/PromptStudio";

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<'canvas' | 'studio'>('canvas');
  const [activeOverride, setActiveOverride] = useState<{ templateId: string, overrides: Record<string, string> } | null>(null);

  const handleGenerate = async (data: any) => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const payload: any = {
        content_type: data.contentType,
        tone: data.tone,
        topic: data.topic,
        target_audience: data.audience || "General Audience",
        content_length: data.contentLength,
        keywords: data.keywords,
        formality: data.formality,
        include_emojis: data.includeEmojis,
        model: data.model,
      };

      // Apply Override if active
      if (activeOverride) {
        payload.prompt_override = {
          template_id: activeOverride.templateId,
          block_overrides: activeOverride.overrides
        };
      } else if (data.customPrompt) {
        // Legacy/Simple custom prompt fallback
        payload.prompt_override = { custom_template: data.customPrompt };
      }

      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || "Failed to generate content");
      }

      setResult(responseData.content);
      setMetrics(responseData.metrics);

      // Auto-switch back to canvas to see result
      if (view === 'studio') setView('canvas');

    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">

      {/* Sidebar: Control Deck */}
      <aside className="w-[400px] h-full flex-shrink-0 z-20">
        <InputDeck
          onGenerate={handleGenerate}
          loading={loading}
          onViewChange={setView}
          currentView={view}
        // Optional: activeOverride={activeOverride} to show badge
        />
      </aside>

      {/* Main: Content Canvas or Prompt Studio */}
      <main className="flex-1 h-full min-w-0 bg-gray-50/50 relative">
        {view === 'studio' ? (
          <PromptStudio
            onUseOverride={(tid, ovr) => {
              setActiveOverride({ templateId: tid, overrides: ovr });
              setView('canvas');
            }}
            initialTemplateId={activeOverride?.templateId}
            initialOverrides={activeOverride?.overrides}
          />
        ) : (
          <ContentCanvas
            content={result}
            loading={loading}
            metrics={metrics}
          />
        )}
      </main>

    </div>
  );
}

