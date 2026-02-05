"use client";

import { useState, useEffect } from "react";
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2, Download, FileText, X, Play, Sparkles, Maximize2, Copy, Check, ChevronRight, Plus } from "lucide-react";
import Papa from "papaparse";
import styles from "./BatchUploader.module.css";
import { ArrowLeft } from "lucide-react";

interface BatchUploaderProps {
    onBack?: () => void;
}

export function BatchUploader({ onBack }: BatchUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // View State
    const [viewMode, setViewMode] = useState<'upload' | 'job'>('upload');
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [viewingItem, setViewingItem] = useState<any | null>(null); // For Modal (Optional now with Q&A layout) (Keeping for full view if needed)

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
                const res = await fetch("http://127.0.0.1:8000/batch/");
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
            const res = await fetch("http://127.0.0.1:8000/batch/upload", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setFile(null);
                setPreviewData([]);
                // Wait for poll or user action
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
        window.open(`http://127.0.0.1:8000/batch/${jobId}/download`, '_blank');
    };

    const selectJob = (job: any) => {
        setSelectedJob(job);
        setViewMode('job');
    };

    const startNewBatch = () => {
        setSelectedJob(null);
        setViewMode('upload');
        setFile(null);
        setPreviewData([]);
    };

    return (
        <div className={styles.container}>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <div className="p-5 border-b border-slate-100">
                    <button
                        onClick={startNewBatch}
                        className={styles.newBatchBtn + " " + (viewMode === 'upload' ? styles.btnPrimary : styles.btnSecondary)}
                    >
                        <Plus className="w-4 h-4" /> New Batch Job
                    </button>
                </div>

                <div className={styles.historyList}>
                    <h3 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">History</h3>
                    {jobs.slice().reverse().map(job => (
                        <div
                            key={job.id}
                            onClick={() => selectJob(job)}
                            className={styles.historyItem + " " + (selectedJob?.id === job.id ? styles.historyItemActive : "")}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${job.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-violet-100 text-violet-600'
                                        }`}>
                                        {job.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm truncate max-w-[140px] text-slate-700">
                                            {job.filename}
                                        </p>
                                        <span className="text-[10px] text-slate-400 block mt-0.5">
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-violet-500'
                                            }`}
                                        style={{ width: `${(job.completed_items / job.total_items) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 min-w-[24px] text-right">
                                    {Math.round((job.completed_items / job.total_items) * 100)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className={styles.mainArea}>

                {viewMode === 'upload' ? (
                    // UPLOAD VIEW
                    <div className={styles.uploadContainer}>
                        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Batch Content Generation</h1>
                        <p className="text-slate-500 text-lg mb-8">Upload a CSV to generate multiple pieces of content.</p>

                        <div className={styles.uploadCard}>
                            {!file ? (
                                <div className={styles.dropzone}>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-700 mb-1">Click to Upload CSV</h3>
                                        <p className="text-sm text-slate-400">Drag & drop or browse</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-violet-600" />
                                            <div>
                                                <p className="font-bold text-slate-800">{file.name}</p>
                                                <p className="text-xs text-slate-500">{previewData.length} items</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setFile(null); setPreviewData([]); }} className="text-slate-400 hover:text-red-500">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tone</label>
                                            <select
                                                value={settings.tone}
                                                onChange={e => setSettings({ ...settings, tone: e.target.value })}
                                                className="w-full text-sm font-medium bg-slate-50 border-none rounded-xl px-4 py-3"
                                            >
                                                {tones.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Model</label>
                                            <select
                                                value={settings.model}
                                                onChange={e => setSettings({ ...settings, model: e.target.value })}
                                                className="w-full text-sm font-medium bg-slate-50 border-none rounded-xl px-4 py-3"
                                            >
                                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className={styles.newBatchBtn + " " + styles.btnPrimary}
                                    >
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                        Start Processing
                                    </button>

                                    {uploadError && (
                                        <div className="text-red-600 text-sm">{uploadError}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // JOB VIEW
                    selectedJob ? (
                        <div className="flex-1 flex flex-col h-full bg-slate-50">
                            {/* HEADER */}
                            <div className={styles.jobHeader}>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                                        {selectedJob.filename}
                                        <span className={styles.statusTag + " " + (selectedJob.status === 'completed' ? styles.statusCompleted : styles.statusProcessing)}>
                                            {selectedJob.status}
                                        </span>
                                    </h2>
                                    <p className="text-xs text-slate-500 font-mono mt-1">Job ID: {selectedJob.id}</p>
                                </div>

                                <button
                                    onClick={(e) => handleDownload(e, selectedJob.id)}
                                    disabled={selectedJob.completed_items === 0}
                                    className={styles.downloadBtn + " " + (selectedJob.completed_items > 0 ? styles.downloadBtnActive : styles.downloadBtnDisabled)}
                                >
                                    {selectedJob.completed_items > 0 ? <Download className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                                    <span>{selectedJob.status === 'completed' ? 'Download Result (ZIP)' : 'Download Partial Results'}</span>
                                </button>
                            </div>

                            {/* Q&A LIST */}
                            <div className={styles.qaContainer}>
                                <div className={styles.qaList}>
                                    {selectedJob.items.map((item: any, idx: number) => (
                                        <div key={item.id} className={styles.qaItem}>
                                            {/* Question Part (Topic) */}
                                            <div className={styles.questionPart}>
                                                <span className={styles.qLabel}>Q{idx + 1}</span>
                                                <h3 className={styles.questionText}>{item.topic || "Untitled Topic"}</h3>
                                                {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                                {item.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                                {item.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
                                            </div>

                                            {/* Answer Part (Result) */}
                                            <div className={styles.answerPart}>
                                                {item.status === 'completed' ? (
                                                    item.result
                                                ) : item.status === 'failed' ? (
                                                    <span className="text-red-500 font-medium">Error: {item.error}</span>
                                                ) : (
                                                    <span className="text-slate-400 italic">Generating answer...</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-300">
                            <p>Select a job from history</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
