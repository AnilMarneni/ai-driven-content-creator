"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Sparkles, Copy, Check, Settings2, Sliders, History, ChevronRight, Download, FileText, LayoutTemplate } from "lucide-react";

import { LinkedInPreview } from "@/components/previews/LinkedInPreview";
import { TwitterPreview } from "@/components/previews/TwitterPreview";

function GenerateContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("editor"); // New Tab State

  const [formData, setFormData] = useState({
    contentType: "Blog",
    tone: "Professional",
    topic: "",
    audience: "",
    contentLength: "Medium",
    keywords: "",
    formality: 3,
    includeEmojis: true
  });

  // Pre-fill from Preferences & URL params
  useEffect(() => {
    const init = async () => {
      let defaults = {
        contentType: "Blog",
        tone: "Professional",
        contentLength: "Medium",
        formality: 3,
        includeEmojis: true
      };

      // 1. Load User Preferences
      try {
        const res = await fetch("http://localhost:8000/preferences");
        if (res.ok) {
          const prefs = await res.json();
          defaults.tone = prefs.default_tone || defaults.tone;
          defaults.contentLength = prefs.default_length || defaults.contentLength;
          // Map audience if needed, though form uses text input vs select
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      }

      // 2. Override with URL Search Params (Templates)
      if (searchParams) {
        const type = searchParams.get("contentType");
        const tone = searchParams.get("tone");
        const length = searchParams.get("contentLength");
        const formality = searchParams.get("formality");
        const emojis = searchParams.get("includeEmojis");

        defaults.contentType = type || defaults.contentType;
        defaults.tone = tone || defaults.tone;
        defaults.contentLength = length || defaults.contentLength;
        defaults.formality = formality ? parseInt(formality) : defaults.formality;
        defaults.includeEmojis = emojis === "true" ? true : emojis === "false" ? false : defaults.includeEmojis;

        if (length || formality || emojis) {
          setShowAdvanced(true);
        }
      }

      setFormData(prev => ({ ...prev, ...defaults }));
    };

    init();
  }, [searchParams]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCopy = async () => {
    try {
      const plainText = result;
      // Simple HTML conversion: replace newlines with <br> for rich text clipboard
      const htmlText = result.replace(/\n/g, '<br>');

      const blobText = new Blob([plainText], { type: 'text/plain' });
      const blobHtml = new Blob([htmlText], { type: 'text/html' });

      const data = [new ClipboardItem({
        'text/plain': blobText,
        'text/html': blobHtml,
      })];

      await navigator.clipboard.write(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy rich text", err);
      // Fallback to simple text copy
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!formData.topic) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: formData.contentType,
          tone: formData.tone,
          topic: formData.topic,
          target_audience: formData.audience || "General Audience",
          content_length: formData.contentLength,
          keywords: formData.keywords,
          formality: parseInt(formData.formality.toString()),
          include_emojis: formData.includeEmojis
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate content");
      }

      setResult(data.content);
      setMetrics(data.metrics);
      setActiveTab('editor'); // Switch to editor
      setActiveTab('analytics'); // Wait, no, maybe show analytics if user wants? No, Editor is best.
      // Actually, let's keep it 'editor' but make sure it resets. 
      // I will just use setActiveTab('editor')
      setActiveTab('editor');
      fetchHistory(); // Refresh history
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center relative overflow-hidden">
      {/* History Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white/90 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/50 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" /> History
            </h2>
            <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {history.map((item, idx) => (
              <div key={idx} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setResult(item.content)}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.content_type}</span>
                  <span className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.topic}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Toggle Button */}
      {!showHistory && (
        <button
          onClick={() => setShowHistory(true)}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-l-xl z-40 hover:pr-4 transition-all group border border-gray-100"
        >
          <History className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
        </button>
      )}

      <div className="glass-card rounded-2xl shadow-xl w-full max-w-5xl grid md:grid-cols-2 overflow-hidden relative min-h-[600px]">

        {/* Left: Input Form */}
        {/* Left: Input Cockpit */}
        <div className="p-8 space-y-8 z-10 flex flex-col h-full overflow-y-auto custom-scrollbar bg-white/50">
          <div className="space-y-2 pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Content Cockpit
            </h1>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Configure your generation engine</p>
          </div>

          <div className="space-y-6 flex-1">

            {/* Section 1: Context */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                CORE CONTEXT
              </div>
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content Type</label>
                  <select name="contentType" value={formData.contentType} onChange={handleChange} className="input-field border-blue-100 focus:border-blue-300">
                    <option>Blog</option>
                    <option>LinkedIn Post</option>
                    <option>Twitter/Tweet</option>
                    <option>Email</option>
                    <option>Ad Copy</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topic / Headline</label>
                  <input
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g. The Future of AI in Healthcare"
                    className="input-field font-medium border-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Voice */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-800 font-semibold text-sm">
                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                VOICE & AUDIENCE
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Audience</label>
                  <input
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    placeholder="e.g. CTOs"
                    className="input-field border-purple-100 focus:border-purple-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tone</label>
                  <select name="tone" value={formData.tone} onChange={handleChange} className="input-field border-purple-100 focus:border-purple-300">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Persuasive</option>
                    <option>Friendly</option>
                    <option>Witty</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Refinement (Collapsible) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-600 hover:text-blue-600 transition p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  <span>FINE TUNING</span>
                </div>
                {showAdvanced ? <ChevronRight className="w-4 h-4 rotate-90 transition-transform" /> : <ChevronRight className="w-4 h-4 transition-transform" />}
              </button>

              {showAdvanced && (
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Keywords</label>
                    <input
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      placeholder="e.g. innovation, scale"
                      className="input-field text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Length</label>
                      <select name="contentLength" value={formData.contentLength} onChange={handleChange} className="input-field text-sm">
                        <option>Short</option>
                        <option>Medium</option>
                        <option>Long</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        Formality: {formData.formality}
                        <Sliders className="w-3 h-3 text-gray-400" />
                      </label>
                      <input
                        type="range"
                        name="formality"
                        min="1" max="5"
                        value={formData.formality}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[9px] text-gray-400 font-medium px-1 uppercase tracking-wide">
                        <span>Casual</span>
                        <span>Formal</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition border border-transparent hover:border-gray-100">
                    <input
                      type="checkbox"
                      id="emojis"
                      name="includeEmojis"
                      checked={formData.includeEmojis}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="emojis" className="text-sm text-gray-700 font-medium cursor-pointer select-none flex-1">Use Emojis</label>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in">
                <span>🚨</span> {error}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 text-base tracking-wide"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? "GENERATING..." : "GENERATE CONTENT"}
            </button>
          </div>
        </div>

        {/* Right: Output Suite */}
        <div className="relative bg-white/60 flex flex-col h-[600px] md:h-auto z-10 border-l border-white/50 backdrop-blur-sm">
          {loading ? (
            <div className="flex-1 p-8 space-y-6 animate-pulse flex flex-col justify-center">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="space-y-3 pt-8">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-center pt-8 gap-4">
                <div className="h-8 w-24 bg-blue-100 rounded-lg"></div>
                <div className="h-8 w-24 bg-purple-100 rounded-lg"></div>
              </div>
              <div className="text-center pt-4 text-xs font-bold text-gray-400 tracking-widest uppercase animate-bounce">
                Analyzing Context...
              </div>
            </div>
          ) : !result ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 px-10 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <Sparkles className="w-10 h-10 text-blue-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-gray-700 font-bold text-lg">Ready to Create</h3>
                <p className="text-sm opacity-75 max-w-xs mx-auto">Configure your settings in the cockpit and launch the engine.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex bg-gray-100/80 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    EDITOR
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    PREVIEW
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    ANALYTICS
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white/40">

                {/* EDITOR TAB */}
                {activeTab === 'editor' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div id="generated-content" className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-line font-medium p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                      {result}
                    </div>

                    {/* Export Toolbar */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      <button onClick={() => {
                        const blob = new Blob([result], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${formData.topic.replace(/\s+/g, '_')}_content.md`;
                        a.click();
                      }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition">
                        <FileText className="w-3.5 h-3.5" /> Export Markdown
                      </button>

                      <button onClick={async () => {
                        try {
                          const html2canvas = (await import("html2canvas")).default;
                          const { jsPDF } = await import("jspdf");

                          const element = document.getElementById("generated-content");
                          if (!element) return;

                          const canvas = await html2canvas(element, {
                            scale: 2,
                            backgroundColor: "#ffffff",
                            useCORS: true,
                            logging: false,
                            onclone: (clonedDoc) => {
                              const clonedElement = clonedDoc.getElementById("generated-content");
                              if (clonedElement) {
                                clonedElement.style.color = "#000000";
                                clonedElement.style.backgroundColor = "#ffffff";
                                const allElements = clonedElement.getElementsByTagName("*");
                                for (let i = 0; i < allElements.length; i++) {
                                  (allElements[i] as HTMLElement).style.color = "#000000";
                                }
                              }
                            }
                          });
                          const imgData = canvas.toDataURL("image/png");
                          const pdf = new jsPDF("p", "mm", "a4");
                          const pdfWidth = pdf.internal.pageSize.getWidth();
                          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                          pdf.save(`${formData.topic.replace(/\s+/g, '_')}_content.pdf`);
                        } catch (err) {
                          console.error("PDF Export failed", err);
                        }
                      }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-red-600 transition">
                        <Download className="w-3.5 h-3.5" /> Export PDF
                      </button>
                    </div>
                  </div>
                )}

                {/* PREVIEW TAB */}
                {activeTab === 'preview' && (
                  <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {(formData.contentType === "LinkedIn Post" || formData.contentType === "Twitter/Tweet") ? (
                      <>
                        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                          Live {formData.contentType} Preview
                        </div>
                        <div className="w-full max-w-md">
                          {formData.contentType === "LinkedIn Post" && <LinkedInPreview content={result} />}
                          {formData.contentType === "Twitter/Tweet" && <TwitterPreview content={result} />}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                          <LayoutTemplate className="w-8 h-8" />
                        </div>
                        <h3 className="text-gray-600 font-bold">No Visual Preview</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">Visual previews are currently available for LinkedIn and Twitter posts only.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ANALYTICS TAB */}
                {activeTab === 'analytics' && metrics ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100 text-center shadow-sm">
                        <div className="text-3xl font-bold text-blue-700">{metrics.readability_score}</div>
                        <div className="text-[10px] font-bold uppercase text-blue-400 mt-1 tracking-wider">Readability</div>
                        <div className="text-xs text-blue-600 mt-1 font-semibold bg-blue-100 px-2 py-0.5 rounded-full inline-block">{metrics.readability_label}</div>
                      </div>
                      <div className={`p-4 rounded-xl border text-center shadow-sm bg-gradient-to-br transition ${metrics.sentiment_score > 0 ? 'from-green-50 to-white border-green-100' : 'from-red-50 to-white border-red-100'}`}>
                        <div className={`text-3xl font-bold ${metrics.sentiment_score > 0 ? 'text-green-700' : 'text-red-700'}`}>{metrics.sentiment_score}</div>
                        <div className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${metrics.sentiment_score > 0 ? 'text-green-400' : 'text-red-400'}`}>Sentiment</div>
                        <div className={`text-xs mt-1 font-semibold px-2 py-0.5 rounded-full inline-block ${metrics.sentiment_score > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{metrics.sentiment_label}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100 text-center shadow-sm">
                        <div className="text-3xl font-bold text-purple-700">{metrics.reading_time_seconds}<span className="text-sm font-medium text-purple-400 ml-0.5">s</span></div>
                        <div className="text-[10px] font-bold uppercase text-purple-400 mt-1 tracking-wider">Read Time</div>
                        <div className="text-xs text-purple-600 mt-1 font-semibold">{metrics.word_count} words</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                          This content is optimized for a <b>{formData.audience}</b> audience.
                        </li>
                        <li className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                          Tone detected as <b>{metrics.sentiment_label}</b>, matching your request.
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  activeTab === 'analytics' && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">Metrics will appear here after generation.</p>
                    </div>
                  )
                )}

              </div>
            </>
          )}
        </div>

        {/* Decorative Background Blurs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
