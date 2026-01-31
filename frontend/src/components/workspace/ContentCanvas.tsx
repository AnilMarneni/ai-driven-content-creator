"use client";

import { useState, useEffect } from "react";
import { Copy, Check, FileText, Download, Edit3, Eye, SplitSquareHorizontal, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SmartEditor } from "../editor/SmartEditor";

interface ContentCanvasProps {
    content: string;
    loading: boolean;
    metrics?: any;
}

export function ContentCanvas({ content, loading, metrics }: ContentCanvasProps) {
    const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('editor');
    const [displayContent, setDisplayContent] = useState(content);
    const [copied, setCopied] = useState(false);

    // Sync content prop changes
    useEffect(() => {
        setDisplayContent(content);
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(displayContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Empty State
    if (!content && !loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 p-10 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 animate-fade-in">
                    <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Create</h3>
                <p className="text-gray-500 max-w-sm text-sm">
                    Configure your parameters in the Control Deck and hit Generate to see magic happen here.
                </p>
            </div>
        );
    }

    // Loading State
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white">
                <div className="w-full max-w-md p-8 space-y-6">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/20 w-1/3 animate-[shimmer_1s_infinite_linear]" />
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto animate-pulse delay-75" />
                    </div>

                    <p className="text-xs text-center font-bold text-primary tracking-widest uppercase animate-pulse">
                        Synthesizing Token Stream...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50/30">

            {/* Toolbar */}
            <div className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-200/50">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Edit3 className="w-3.5 h-3.5" /> Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('split')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'split' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <SplitSquareHorizontal className="w-3.5 h-3.5" /> Split
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary transition-colors">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-200px)] p-8 md:p-12 relative">
                    {activeTab === 'editor' && (
                        <SmartEditor
                            initialContent={displayContent}
                            onUpdate={(newContent) => {
                                setDisplayContent(newContent);
                            }}
                        />
                    )}

                    {activeTab === 'preview' && (
                        <div className="prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-bold prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-table:border-collapse prose-th:border-b prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:p-2 prose-td:border-b prose-td:border-gray-100 prose-td:p-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
                        </div>
                    )}

                    {activeTab === 'split' && (
                        <div className="grid grid-cols-2 gap-8 h-full">
                            <div className="border-r border-gray-100 pr-8">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Markdown Source</h4>
                                <textarea
                                    className="w-full h-full text-sm font-mono text-gray-600 bg-gray-50 p-4 rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={displayContent}
                                    onChange={(e) => setDisplayContent(e.target.value)}
                                // active sync enabled
                                />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Live Preview</h4>
                                <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-blockquote:border-l-primary/50">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Metrics Footnote */}
                {metrics && (
                    <div className="max-w-6xl mx-auto mt-6 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{metrics.readability_score || "N/A"}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Readability</span>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{metrics.word_count || 0}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Words</span>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{metrics.sentiment_label || "Neutral"}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tone</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
