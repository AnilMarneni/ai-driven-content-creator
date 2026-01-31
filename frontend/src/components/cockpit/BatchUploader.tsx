"use client";

import { useState, useEffect } from "react";
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2, Download, RefreshCw, FileText, X, Play, Sparkles, LayoutTemplate, Users, Eye, Maximize2, Copy, Check } from "lucide-react";
import Papa from "papaparse";

export function BatchUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [viewingItem, setViewingItem] = useState<any | null>(null); // For Modal
    const [copied, setCopied] = useState(false);

    // Batch Settings
    const [settings, setSettings] = useState({
        tone: "Professional",
        audience: "General Audience",
        model: "models/gemini-flash-latest"
    });

    const tones = ["Professional", "Casual", "Enthusiastic", "Witty", "Empathetic"];
    const models = [
        { id: "models/gemini-flash-latest", name: "Gemini Flash (Recommended)" },
        { id: "models/gemini-1.5-pro", name: "Gemini 1.5 Pro (High Quality)" }
    ];

    // Poll for jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("http://localhost:8000/batch/");
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);

                    if (selectedJob) {
                        const updated = data.find((j: any) => j.id === selectedJob.id);
                        if (updated) setSelectedJob(updated);
                    }
                }
            } catch (err) {
                console.error("Poll failed", err);
            }
        };

        fetchJobs();
        const interval = setInterval(fetchJobs, 2000);
        return () => clearInterval(interval);
    }, [selectedJob]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);

            Papa.parse(f, {
                header: true,
                preview: 5,
                skipEmptyLines: true,
                complete: (results) => {
                    setPreviewData(results.data);
                }
            });
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("settings", JSON.stringify(settings));

        try {
            const res = await fetch("http://localhost:8000/batch/upload", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setFile(null);
                setPreviewData([]);
            } else {
                const err = await res.json();
                setUploadError(err.detail || "Upload failed");
                setTimeout(() => setUploadError(""), 5000);
            }
        } catch (err) {
            console.error(err);
            setUploadError("Network error during upload");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        window.open(`http://localhost:8000/batch/${jobId}/download`, '_blank');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        // Layout: Standardized Page Container
        <div className="h-full flex flex-col bg-gray-50/50">
            <div className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 flex gap-8 h-full overflow-hidden">

                {/* Left Panel: Controls */}
                <div className="w-[450px] flex flex-col gap-6 h-full overflow-hidden shrink-0">

                    {/* Upload Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 max-h-[60%] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 text-violet-700 font-bold text-sm uppercase tracking-wide sticky top-0 bg-white z-10">
                            <FileUp className="w-4 h-4" /> New Batch
                        </div>

                        {!file ? (
                            <div className="group relative border border-dashed border-gray-300 rounded-xl p-6 hover:border-violet-400 hover:bg-violet-50/10 transition-all duration-300">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    id="csv-upload"
                                />
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center mb-3 transition-colors shadow-sm text-gray-400 group-hover:text-violet-500 group-hover:scale-110 duration-300">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 group-hover:text-violet-700 transition-colors">Upload CSV File</p>
                                    <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                                        Required: <code className="bg-gray-100 px-1 rounded text-gray-500 font-mono">topic</code><br />
                                        Optional: <code className="bg-gray-100 px-1 rounded text-gray-500 font-mono">tone</code>, <code className="bg-gray-100 px-1 rounded text-gray-500 font-mono">audience</code>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
                                {/* File Active State */}
                                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl border border-violet-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <FileText className="w-4 h-4 text-violet-600" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-xs text-gray-800 truncate">{file.name}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <span>{previewData.length} items detected</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => { setFile(null); setPreviewData([]); }} className="p-1.5 hover:bg-white/50 rounded-full text-violet-400 hover:text-red-500 transition-colors z-20">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* CSV Preview Table (Always Visible) */}
                                {previewData.length > 0 && (
                                    <div className="overflow-hidden border border-violet-100 rounded-lg shadow-sm bg-white">
                                        <div className="overflow-x-auto max-w-full">
                                            <table className="w-full text-[10px] text-left">
                                                <thead className="bg-violet-50/50 text-violet-700 font-bold uppercase tracking-wider backdrop-blur-sm">
                                                    <tr>
                                                        {Object.keys(previewData[0]).map(key => (
                                                            <th key={key} className="px-3 py-2 border-b border-violet-50">{key}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 bg-white">
                                                    {previewData.slice(0, 3).map((row, i) => (
                                                        <tr key={i} className="hover:bg-violet-50/10 transition-colors">
                                                            {Object.values(row).map((val: any, j) => (
                                                                <td key={j} className="px-3 py-2 text-gray-600 truncate max-w-[100px] font-medium">{val}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="bg-violet-50/30 px-3 py-1 text-[10px] text-center text-violet-400 font-medium border-t border-violet-50">
                                            Data Preview (First 3 rows)
                                        </div>
                                    </div>
                                )}

                                {/* Settings Grid */}
                                <div className="grid gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Default Tone</label>
                                        <select
                                            value={settings.tone}
                                            onChange={e => setSettings({ ...settings, tone: e.target.value })}
                                            className="w-full text-xs font-medium bg-white border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                                        >
                                            {tones.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Audience</label>
                                        <input
                                            type="text"
                                            value={settings.audience}
                                            onChange={e => setSettings({ ...settings, audience: e.target.value })}
                                            className="w-full text-xs font-medium bg-white border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                                            placeholder="e.g. General Audience"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">AI Model</label>
                                        <select
                                            value={settings.model}
                                            onChange={e => setSettings({ ...settings, model: e.target.value })}
                                            className="w-full text-xs font-medium bg-white border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                                        >
                                            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                    Start Processing
                                </button>
                                {uploadError && (
                                    <div className="p-3 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-3 h-3" /> {uploadError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Batches</h3>
                            <span className="text-[10px] font-medium bg-gray-50 px-2 py-0.5 rounded-full text-gray-400">{jobs.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {jobs.slice().reverse().map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 group relative ${selectedJob?.id === job.id
                                        ? 'bg-violet-50/50 border-violet-200 shadow-sm'
                                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${job.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-violet-100 text-violet-600'
                                                }`}>
                                                {job.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className={`font-bold text-xs truncate max-w-[120px] ${selectedJob?.id === job.id ? 'text-violet-900' : 'text-gray-700'}`}>{job.filename}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(job.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {job.status === 'completed' && (
                                                <button
                                                    onClick={(e) => handleDownload(e, job.id)}
                                                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                                    title="Download ZIP"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <span className={`text-[10px] font-bold ${job.status === 'completed' ? 'text-emerald-600' : 'text-violet-600'}`}>
                                                {Math.round((job.completed_items / job.total_items) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-violet-500'}`}
                                            style={{ width: `${(job.completed_items / job.total_items) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Inspector */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
                    {selectedJob ? (
                        <>
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white z-10">
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                        {selectedJob.filename}
                                    </h2>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Job ID: <span className="font-mono text-gray-400">{selectedJob.id.slice(0, 8)}</span>
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => handleDownload(e, selectedJob.id)}
                                    disabled={selectedJob.status !== 'completed'}
                                    className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all ${selectedJob.status === 'completed'
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:-translate-y-0.5'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    {selectedJob.status === 'completed' ? <Download className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                    {selectedJob.status === 'completed' ? 'Download Result (ZIP)' : 'Processing...'}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 custom-scrollbar">
                                {selectedJob.items.map((item: any, idx: number) => (
                                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center text-xs font-bold font-mono shrink-0 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="font-bold text-gray-800 text-sm truncate pr-4">{item.topic || "Untitled"}</h4>

                                                    <div className="flex items-center gap-2">
                                                        {(item.status === 'completed' && item.result) && (
                                                            <button
                                                                onClick={() => setViewingItem(item)}
                                                                className="p-1 px-2 text-[10px] font-bold bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 flex items-center gap-1 transition-colors"
                                                            >
                                                                <Maximize2 className="w-3 h-3" /> Full Preview
                                                            </button>
                                                        )}
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            item.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                                            }`}>
                                                            {item.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.status === 'completed' ? (
                                                    <div className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-3 pl-2 border-l-2 border-gray-100">
                                                        {item.result}
                                                    </div>
                                                ) : item.status === 'failed' ? (
                                                    <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 text-xs text-red-600 flex items-start gap-2">
                                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                        <span className="font-semibold">{item.error}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                                                        <Loader2 className="w-3 h-3 animate-spin" /> Generation in progress...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/30">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                                <Sparkles className="w-8 h-8 text-violet-200" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-700 mb-2">Ready to Create</h4>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                Select a batch job from the left to view results, or start a new batch upload to generate content at scale.
                            </p>
                        </div>
                    )}
                </div>

                {/* Full Content Modal */}
                {viewingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">{viewingItem.topic}</h3>
                                <button onClick={() => setViewingItem(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                                <article className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-p:leading-7">
                                    <div className="whitespace-pre-wrap">{viewingItem.result}</div>
                                </article>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => copyToClipboard(viewingItem.result)}
                                    className="px-4 py-2 bg-white border border-gray-200 hover:border-violet-300 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied!" : "Copy Text"}
                                </button>
                                <button
                                    onClick={() => setViewingItem(null)}
                                    className="px-4 py-2 bg-gray-800 text-white font-bold text-xs rounded-xl hover:bg-gray-900 transition-colors"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
