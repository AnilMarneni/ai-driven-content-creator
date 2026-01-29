"use client";

import { useState, useEffect } from "react";
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2, Download, RefreshCw, FileText } from "lucide-react";

export function BatchUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    // Poll for jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("http://localhost:8000/batch/"); // List jobs endpoint I added
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                    // If we have an active job in local state, update it
                    if (activeJobId) {
                        const active = data.find((j: any) => j.id === activeJobId);
                        if (active && active.status === "completed") {
                            // Job done
                        }
                    }
                }
            } catch (err) {
                console.error("Poll failed", err);
            }
        };

        fetchJobs();
        const interval = setInterval(fetchJobs, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, [activeJobId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        // Pass generic settings for now, can be expanded
        formData.append("settings", JSON.stringify({ tone: "Professional", model: "models/gemini-1.5-flash" }));

        try {
            const res = await fetch("http://localhost:8000/batch/upload", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setActiveJobId(data.job_id);
                setFile(null); // Clear file
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="h-full bg-white p-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-primary" /> Batch Processor
            </h2>

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                />

                {!file ? (
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-bold text-gray-700">Click to upload CSV</p>
                        <p className="text-xs text-gray-400 mt-1">Columns: topic, tone (optional), audience (optional)</p>
                    </label>
                ) : (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Ready to process {(file.size / 1024).toFixed(1)} KB</p>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 flex items-center gap-2"
                            >
                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                Start Batch
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Jobs List */}
            <div className="mt-8 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Jobs</h3>

                {jobs.slice().reverse().map((job) => (
                    <div key={job.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-sm font-bold text-gray-800">{job.filename}</p>
                                <p className="text-[10px] text-gray-400">{new Date(job.created_at).toLocaleString()}</p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${job.status === 'completed' ? 'bg-green-100 text-green-600' :
                                    job.status === 'processing' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {job.status}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div
                                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${(job.completed_items / job.total_items) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{job.completed_items} / {job.total_items} items</span>
                            <span>{Math.round((job.completed_items / job.total_items) * 100)}%</span>
                        </div>

                        {/* Actions (Mock Export) */}
                        {job.status === 'completed' && (
                            <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition">
                                <Download className="w-3.5 h-3.5" /> Download ZIP
                            </button>
                        )}
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs">No active batch jobs</div>
                )}
            </div>

        </div>
    );
}
