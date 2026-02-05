"use client";

import { useState, useEffect } from "react";
import { Mic, Plus, Trash2, X, Volume2 } from "lucide-react";

interface BrandVoice {
    id: number;
    name: string;
    description: string;
    voice_content: string;
}

interface BrandVoiceManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (voice: BrandVoice) => void;
}

export function BrandVoiceManager({ isOpen, onClose, onSelect }: BrandVoiceManagerProps) {
    const [voices, setVoices] = useState<BrandVoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // New Voice Form
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchVoices();
        }
    }, [isOpen]);

    const fetchVoices = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/knowledge/voices");
            if (res.ok) {
                const data = await res.json();
                setVoices(data);
            }
        } catch (e) {
            console.error("Failed to fetch voices", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newName || !newContent) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/knowledge/voices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newName,
                    description: newDesc,
                    voice_content: newContent
                })
            });

            if (res.ok) {
                setIsCreating(false);
                setNewName("");
                setNewDesc("");
                setNewContent("");
                fetchVoices();
            }
        } catch (e) {
            console.error("Failed to create voice", e);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm("Delete this voice?")) return;

        try {
            await fetch(`http://127.0.0.1:8000/knowledge/voices/${id}`, { method: "DELETE" });
            fetchVoices();
        } catch (e) {
            console.error("Failed to delete voice", e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-violet-600" />
                        Brand Voices
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">

                    {isCreating ? (
                        <div className="space-y-4 bg-violet-50/50 p-4 rounded-xl border border-violet-100">
                            <h4 className="text-xs font-bold text-violet-700 uppercase">New Voice Profile</h4>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Voice Name</label>
                                <input
                                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-violet-500 outline-none"
                                    placeholder="e.g. Friendly Expert"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Description (Optional)</label>
                                <input
                                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                                    placeholder="Short note about usage..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Voice Instructions / Samples</label>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-violet-500 outline-none"
                                    placeholder="Paste examples of text or describe the style rules (e.g., 'Use short sentences. Be punchy. Avoid jargon.')"
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleCreate}
                                    disabled={!newName || !newContent}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
                                >
                                    Save Voice
                                </button>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-2 rounded-lg text-xs transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all font-bold text-sm group"
                            >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Create New Voice
                            </button>

                            {loading ? (
                                <p className="text-center text-xs text-gray-400 py-4">Loading voices...</p>
                            ) : voices.length === 0 ? (
                                <p className="text-center text-xs text-gray-400 py-4">No voices found.</p>
                            ) : (
                                <div className="space-y-2 mt-2">
                                    {voices.map(voice => (
                                        <div
                                            key={voice.id}
                                            onClick={() => {
                                                onSelect(voice);
                                                onClose();
                                            }}
                                            className="group relative p-3 bg-white border border-gray-100 rounded-xl hover:border-violet-200 hover:shadow-md cursor-pointer transition-all"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{voice.name}</h4>
                                                    {voice.description && <p className="text-[10px] text-gray-500">{voice.description}</p>}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => handleDelete(e, voice.id)}
                                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 italic border-l-2 border-gray-100 pl-2">
                                                {voice.voice_content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
