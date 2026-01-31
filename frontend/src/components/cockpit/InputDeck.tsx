"use client";

import { useState, useEffect } from "react";
import { Sparkles, Settings2, ChevronDown, ChevronRight, Sliders, Type, Users, Mic, Hash, LayoutTemplate, Zap, FileCode } from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";
import { BatchUploader } from "./BatchUploader";
import { useAdvancedMode } from "@/context/AdvancedModeContext";
import { ModeToggle } from "../advanced/ModeToggle";

interface InputDeckProps {
    onGenerate: (data: any) => void;
    loading: boolean;
    defaults?: any;
    onViewChange: (view: 'canvas' | 'studio') => void;
    currentView: 'canvas' | 'studio';
}

export function InputDeck({ onGenerate, loading, defaults, onViewChange, currentView }: InputDeckProps) {
    const { isAdvancedMode } = useAdvancedMode();
    const [mode, setMode] = useState<'single' | 'batch'>('single');
    const [formData, setFormData] = useState({
        contentType: "Blog",
        topic: "",
        audience: "",
        tone: "Professional",
        contentLength: "Medium",
        keywords: "",
        formality: 3,
        includeEmojis: true,
        model: ""
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (defaults) {
            setFormData(prev => ({ ...prev, ...defaults }));
        }
    }, [defaults]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, formality: parseInt(e.target.value) }));
    };

    if (mode === 'batch') {
        return (
            <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow z-20">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <button onClick={() => setMode('single')} className="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1 transition-colors">
                        <ChevronDown className="w-4 h-4 rotate-90" /> Back to Single
                    </button>
                    <span className="text-xs font-bold uppercase text-primary tracking-wide">Batch Studio</span>
                </div>
                <BatchUploader />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">

            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Control Deck
                </h2>

                <button
                    onClick={() => setMode('batch')}
                    className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors tracking-wide border border-gray-200/50"
                >
                    SWITCH TO BATCH
                </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">

                {/* 1. Engine Selection */}
                <section className="space-y-3">
                    <ModelSelector
                        selectedModel={formData.model}
                        onSelect={(id) => setFormData(prev => ({ ...prev, model: id }))}
                    />
                </section>

                {/* 2. Core Context */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                        <LayoutTemplate className="w-3.5 h-3.5" /> Core Context
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">What are we creating?</label>
                            <select
                                name="contentType"
                                value={formData.contentType}
                                onChange={handleChange}
                                className="input-field py-2.5 font-semibold text-gray-700"
                            >
                                <option>Blog</option>
                                <option>LinkedIn Post</option>
                                <option>Twitter/Tweet</option>
                                <option>Email</option>
                                <option>Ad Copy</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Topic / Headline</label>
                            <textarea
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                placeholder="e.g. The impact of AI on creative writing..."
                                className="input-field resize-none h-24 font-medium text-gray-800 leading-relaxed"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Voice & Audience */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-2">
                        <Users className="w-3.5 h-3.5" /> Target & Voice
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Audience</label>
                            <input
                                name="audience"
                                value={formData.audience || ""}
                                onChange={handleChange}
                                placeholder="e.g. Tech Founders"
                                className="input-field py-2.5"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tone</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Professional', 'Casual', 'Witty'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setFormData(prev => ({ ...prev, tone: t }))}
                                        className={`px-2 py-2 text-xs font-bold rounded-lg border transition-all ${formData.tone === t
                                            ? 'bg-violet-50 border-violet-200 text-violet-700'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Fine Tuning */}
                <section>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 group-hover:text-gray-900">
                            <Settings2 className="w-4 h-4" />
                            <span>Fine Tuning</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showAdvanced ? "rotate-90" : ""}`} />
                    </button>

                    {showAdvanced && (
                        <div className="pt-4 space-y-4 animate-slide-up">
                            {/* Keywords */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Hash className="w-3 h-3" /> Keywords</label>
                                <input
                                    name="keywords"
                                    value={formData.keywords || ""}
                                    onChange={handleChange}
                                    placeholder="comma, separated, tags"
                                    className="input-field py-2 text-xs"
                                />
                            </div>

                            {/* Length & Formality */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Length</label>
                                    <select name="contentLength" value={formData.contentLength} onChange={handleChange} className="input-field py-2 text-xs">
                                        <option>Short</option>
                                        <option>Medium</option>
                                        <option>Long</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 flex justify-between">
                                        Formality
                                        <span className="text-gray-400">{formData.formality}/5</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1" max="5"
                                        value={formData.formality}
                                        onChange={handleRangeChange}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 5. Advanced Configuration (Milestone 3.3) */}
                <section className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <ModeToggle />

                    {isAdvancedMode && (
                        <button
                            onClick={() => onViewChange(currentView === 'studio' ? 'canvas' : 'studio')}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all flex items-center gap-2 ${currentView === 'studio'
                                    ? 'bg-violet-600 text-white border-violet-600'
                                    : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-50'
                                }`}
                        >
                            <FileCode className="w-3 h-3" />
                            {currentView === 'studio' ? 'Close Studio' : 'Prompt Studio'}
                        </button>
                    )}
                </section>

            </div>

            {/* Footer / Action */}
            <div className="p-5 border-t border-gray-100 bg-white/80 backdrop-blur top-auto bottom-0 sticky">
                <button
                    onClick={() => onGenerate(formData)}
                    disabled={loading || !formData.topic}
                    className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {loading ? "Igniting..." : "Generate Content"}
                </button>
                {!formData.topic && (
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">Please enter a topic to start</p>
                )}
            </div>

        </div>
    );
}
