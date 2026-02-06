import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, BarChart2, Hash, BookOpen, Search } from "lucide-react";

interface SEOAnalysisProps {
    content: string;
    keywords: string;
    onClose?: () => void;
}

export function SEOPanel({ content, keywords, onClose }: SEOAnalysisProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState("");

    // Auto-analyze when content stops changing (debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (content.length > 50) {
                analyze();
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [content, keywords]);

    const analyze = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://127.0.0.1:8000/seo/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, keywords })
            });

            if (!res.ok) throw new Error("Analysis failed");

            const result = await res.json();
            setData(result);
        } catch (err: any) {
            setError("Could not analyze content");
        } finally {
            setLoading(false);
        }
    };

    if (!data && !loading) return (
        <div className="p-6 text-center text-gray-400 text-sm">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Start typing to see SEO insights...
        </div>
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl w-full md:w-[320px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                    <BarChart2 className="w-4 h-4 text-blue-600" />
                    SEO Insights
                </div>
                {loading && <span className="text-xs text-blue-500 animate-pulse">Analyzing...</span>}
            </div>

            {/* Content */}
            {data && (
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

                    {/* Overall Score */}
                    <div className={`p-4 rounded-xl border flex flex-col items-center ${getScoreColor(data.score)}`}>
                        <span className="text-3xl font-bold">{data.score}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">SEO Score</span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1">
                                <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Readability
                            </div>
                            <div className="text-xl font-bold text-gray-800">{data.readability_score}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1">
                                <Hash className="w-3.5 h-3.5 text-blue-500" /> Word Count
                            </div>
                            <div className="text-xl font-bold text-gray-800">{data.word_count}</div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Structural Checks</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium p-2 rounded bg-gray-50">
                                <span>Main Title (H1)</span>
                                {data.checks.has_h1 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium p-2 rounded bg-gray-50">
                                <span>Subheadings (H2)</span>
                                {data.checks.has_h2 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                    </div>

                    {/* Keyword Analysis */}
                    {data.keyword_analysis.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Keywords</h4>
                            <div className="space-y-2">
                                {data.keyword_analysis.map((k: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-white">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${k.status === 'Good' ? 'bg-green-500' : (k.status === 'Low' ? 'bg-orange-400' : 'bg-red-500')}`} />
                                            <span className="text-xs font-bold text-gray-700">{k.keyword}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-gray-400">{k.density}%</div>
                                            <div className={`text-[9px] font-bold ${k.status === 'Good' ? 'text-green-600' : 'text-orange-500'}`}>{k.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
