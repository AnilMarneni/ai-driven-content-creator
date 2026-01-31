"use client";

import { useState, useRef, useEffect } from "react";
import { Wand2, Sparkles, Check, RotateCcw, MessageSquarePlus, PenTool, Loader2 } from "lucide-react";

interface SmartEditorProps {
    initialContent: string;
    onUpdate: (newContent: string) => void;
}

export function SmartEditor({ initialContent, onUpdate }: SmartEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // History for Undo
    const [history, setHistory] = useState<string[]>([initialContent]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Sync external updates
    useEffect(() => {
        if (initialContent !== content && historyIndex === 0) {
            setContent(initialContent);
            setHistory([initialContent]);
        }
    }, [initialContent]);

    const updateContent = (newText: string) => {
        const next = [...history.slice(0, historyIndex + 1), newText];
        setHistory(next);
        setHistoryIndex(next.length - 1);
        setContent(newText);
        onUpdate(newText);
    };

    const handleRefine = async (instruction: string) => {
        if (!content) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/edit/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: content, instruction })
            });
            const data = await res.json();
            if (data.result) {
                updateContent(data.result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleGetSuggestions = async () => {
        if (showSuggestions) {
            setShowSuggestions(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/edit/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: content })
            });
            const data = await res.json();
            setSuggestions(data.suggestions || []);
            setShowSuggestions(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prev = history[historyIndex - 1];
            setHistoryIndex(historyIndex - 1);
            setContent(prev);
            onUpdate(prev);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <PenTool className="w-3 h-3" /> Smart Editor
                    </span>

                    <div className="h-4 w-px bg-gray-300 mx-2" />

                    <button
                        onClick={() => handleRefine("Make it more concise")}
                        disabled={loading}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:text-violet-600 rounded-md transition-colors"
                    >
                        Shorten
                    </button>
                    <button
                        onClick={() => handleRefine("Make it more professional and persuasive")}
                        disabled={loading}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:text-violet-600 rounded-md transition-colors"
                    >
                        Poliish
                    </button>
                    <button
                        onClick={() => handleRefine("Add relevant emojis")}
                        disabled={loading}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:text-violet-600 rounded-md transition-colors"
                    >
                        Emojify
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleGetSuggestions}
                        disabled={loading}
                        className={`p-1.5 rounded-lg transition-colors ${showSuggestions ? 'bg-violet-100 text-violet-600' : 'hover:bg-gray-200 text-gray-500'}`}
                        title="Get AI Suggestions"
                    >
                        {loading && !showSuggestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleUndo}
                        disabled={historyIndex === 0}
                        className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 disabled:opacity-30"
                        title="Undo"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Suggestions Panel */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="bg-violet-50 px-4 py-3 border-b border-violet-100 animate-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2">AI Suggestions</h4>
                    <div className="space-y-2">
                        {suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-violet-800 bg-white/60 p-2 rounded-lg border border-violet-100/50">
                                <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-violet-500" />
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 relative">
                <textarea
                    ref={textAreaRef}
                    value={content}
                    onChange={(e) => updateContent(e.target.value)}
                    className="w-full h-full p-6 resize-none outline-none text-gray-800 leading-relaxed text-sm font-medium"
                    placeholder="Generated content will appear here..."
                />

                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 text-violet-600 text-xs font-bold gap-2">
                        <Wand2 className="w-5 h-5 animate-pulse" /> Refining...
                    </div>
                )}
            </div>

            <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between">
                <span>{content.length} characters</span>
                <span>Version {historyIndex + 1}/{history.length}</span>
            </div>
        </div>
    );
}
