"use client";

import { useState } from "react";
import { InputDeck } from "@/components/cockpit/InputDeck";
import { ContentCanvas } from "@/components/workspace/ContentCanvas";
import { PromptStudio } from "@/components/advanced/PromptStudio";
import { BatchUploader } from "@/components/cockpit/BatchUploader";

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Image State
  const [metrics, setMetrics] = useState<any>(null);

  // A/B State
  const [isAB, setIsAB] = useState(false);
  const [resultB, setResultB] = useState("");
  const [metricsB, setMetricsB] = useState<any>(null);

  const [error, setError] = useState("");
  const [view, setView] = useState<'canvas' | 'studio'>('canvas');
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [activeOverride, setActiveOverride] = useState<{ templateId: string, overrides: Record<string, string> } | null>(null);
  const [currentKeywords, setCurrentKeywords] = useState("");

  const handleGenerate = async (data: any) => {
    setLoading(true);
    setError("");
    setLoading(true);
    setError("");
    setResult("");
    setImageUrl(""); // Reset image
    setCurrentKeywords(data.keywords);

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
      } else if (data.customPrompt) {
        // Legacy/Simple custom prompt fallback
        payload.prompt_override = { custom_template: data.customPrompt };
      }

      let res;
      if (data.isAB) {
        setIsAB(true);
        // Construct A/B Payload
        const payloadA = { ...payload };
        const payloadB = { ...payload, ...data.variantB }; // Overlay B settings
        // Ensure prompt override logic is also applied to B if needed, 
        // but for V1 let's assume B just takes standard build unless specified.
        // If A has override, B might not inherit it unless we explicitly say so.
        // simpler: just apply model/tone override which are the only ones exposed in UI for B currently.

        const abPayload = {
          variant_a: payloadA,
          variant_b: payloadB
        };

        res = await fetch("http://127.0.0.1:8000/ab/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(abPayload),
        });

      } else {
        setIsAB(false);

        // Parallel execution for Image Gen if requested
        const textPromise = fetch("http://127.0.0.1:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const imagePromise = data.generateImage ? fetch("http://127.0.0.1:8000/generate/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `A ${data.imageStyle || 'realistic'} image for a ${data.contentType} about ${data.topic}`,
            style: data.imageStyle || "realistic",
            size: "1024x1024"
          })
        }) : Promise.resolve(null);

        const [textRes, imageRes] = await Promise.all([textPromise, imagePromise]);
        res = textRes; // Main response is text for now regarding error handling flow

        if (imageRes && imageRes.ok) {
          const imgData = await imageRes.json();
          setImageUrl(imgData.image_url);
        }
      }

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || "Failed to generate content");
      }

      if (data.isAB) {
        setResult(responseData.result_a.content);
        setMetrics(responseData.result_a.metrics);
        setResultB(responseData.result_b.content);
        setMetricsB(responseData.result_b.metrics);
      } else {
        setResult(responseData.content);
        setMetrics(responseData.metrics);
      }

      // Auto-switch back to canvas to see result
      if (view === 'studio') setView('canvas');

    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'batch') {
    return (
      <div className="h-full w-full bg-slate-50">
        <BatchUploader onBack={() => setMode('single')} />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">

      {/* Sidebar: Control Deck */}
      <aside className="w-[400px] h-full flex-shrink-0 z-20">
        <InputDeck
          onGenerate={handleGenerate}
          loading={loading}
          onViewChange={setView}
          currentView={view}
          onSwitchMode={setMode}
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
            isAB={isAB}
            contentB={resultB}
            metricsB={metricsB}
            imageUrl={imageUrl}
            keywords={currentKeywords}
          />
        )}
      </main>

    </div>
  );
}

