"use client";

import { useState, useRef, useEffect } from "react";
import { Wand2, Sparkles, Check, RotateCcw, MessageSquarePlus, PenTool, Loader2, Layers, X, FileText, Calendar } from "lucide-react";

interface SmartEditorProps {
    initialContent: string;
    onUpdate: (newContent: string) => void;
}


interface HistoryItem {
    id: number;
    content_type: string;
    topic: string;
    tone: string;
    content: string;
    timestamp: string;
}

export function SmartEditor({ initialContent, onUpdate }: SmartEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Merge State
    const [showMergePicker, setShowMergePicker] = useState(false);
    const [mergeHistory, setMergeHistory] = useState<HistoryItem[]>([]);
    const [selectedMergeIds, setSelectedMergeIds] = useState<number[]>([]);
    const [isMerging, setIsMerging] = useState(false);

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
            const res = await fetch("http://127.0.0.1:8000/edit/refine", {
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
            const res = await fetch("http://127.0.0.1:8000/edit/suggest", {
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

    const openMergePicker = async () => {
        setShowMergePicker(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/history");
            const data = await res.json();
            if (Array.isArray(data)) {
                setMergeHistory(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleMergeSelection = (id: number) => {
        setSelectedMergeIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const executeMerge = async () => {
        const selectedItems = mergeHistory.filter(h => selectedMergeIds.includes(h.id));
        const contentsToMerge = [content, ...selectedItems.map(h => h.content)].filter(c => c.trim().length > 0);

        if (contentsToMerge.length < 2) return;

        setIsMerging(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/edit/merge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: contentsToMerge })
            });
            const data = await res.json();
            if (data.result) {
                updateContent(data.result);
                setShowMergePicker(false);
                setSelectedMergeIds([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsMerging(false);
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
                        Polish
                    </button>
                    <button
                        onClick={() => handleRefine("Add relevant emojis")}
                        disabled={loading}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:text-violet-600 rounded-md transition-colors"
                    >
                        Emojify
                    </button>
                </div>

            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={openMergePicker}
                    disabled={loading}
                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500"
                    title="Merge with other content"
                >
                    <Layers className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
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

            {/* Suggestions Panel */}
            {
                showSuggestions && suggestions.length > 0 && (
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
                )
            }

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


            {/* Merge Picker Modal Overlay */}
            {
                showMergePicker && (
                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-violet-600" /> Merge with History
                            </h3>
                            <button onClick={() => setShowMergePicker(false)} className="p-1 hover:bg-gray-200 rounded-full">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">Select items to combine with your current editor content.</p>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {mergeHistory.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleMergeSelection(item.id)}
                                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${selectedMergeIds.includes(item.id)
                                        ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                                        : 'border-gray-200 hover:border-violet-300 bg-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-xs text-gray-700 line-clamp-1">{item.topic || "Untitled"}</span>
                                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{item.content_type}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 line-clamp-2">{item.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={() => setShowMergePicker(false)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeMerge}
                                disabled={selectedMergeIds.length === 0 || isMerging}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-md shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isMerging ? <Loader2 className="w-3 h-3 animate-spin" /> : "Merge & Combine"}
                            </button>
                        </div>
                    </div>
                )
            }

            <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between">
                <span>{content.length} characters</span>
                <span>Version {historyIndex + 1}/{history.length}</span>
            </div>
        </div >
    );
}
