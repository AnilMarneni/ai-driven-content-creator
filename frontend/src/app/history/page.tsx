"use client";

import { useEffect, useState } from "react";
import { History, Search, FileText, Calendar, ArrowRight, Zap, Copy, Check, Layers } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface HistoryItem {
    id: number;
    content_type: string;
    topic: string;
    tone: string;
    target_audience: string | null;
    content: string;
    timestamp: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState<number | null>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/history")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setHistory(data);
                }
            })
            .catch(err => console.error("Failed to fetch history:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleCopy = (content: string, id: number) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredHistory = history.filter(item =>
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-500 rotate-180" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-600" />
                            <h1 className="text-lg font-bold text-gray-800">History</h1>
                        </div>
                    </div>

                    <div className="relative w-64 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search generated content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-2 w-2/3">
                                        <div className="h-6 bg-gray-100 rounded w-3/4" />
                                        <div className="flex gap-2">
                                            <div className="h-4 bg-gray-100 rounded w-20" />
                                            <div className="h-4 bg-gray-100 rounded w-32" />
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-100 rounded w-16" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No history found</h3>
                        <p className="text-gray-500 mb-6">You haven't generated any content yet.</p>
                        <Link href="/generate" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/20">
                            <Zap className="w-4 h-4" /> Start Generating
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                {/* Card Header */}
                                <div className="px-5 py-4 border-b border-gray-50 flex items-start justify-between bg-white">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 p-2 rounded-lg ${item.content_type === 'Batch Job' ? 'bg-indigo-50 text-indigo-600' :
                                            item.content_type === 'Blog' ? 'bg-blue-50 text-blue-600' :
                                                item.content_type === 'LinkedIn Post' ? 'bg-blue-50 text-sky-700' :
                                                    'bg-purple-50 text-purple-600'
                                            }`}>
                                            {item.content_type === 'Batch Job' ? <Layers className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{item.topic || "Untitled"}</h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                                <span>{item.content_type}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600">
                                            {item.tone}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Preview */}
                                <div className="p-5 bg-gray-50/30">
                                    <div className="relative">
                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 font-medium font-mono opacity-80">
                                            {item.content}
                                        </p>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none" />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {item.content.split(' ').length} words
                                        </span>
                                        <button
                                            onClick={() => handleCopy(item.content, item.id)}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                                        >
                                            {copiedId === item.id ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" /> Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" /> Copy Content
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
