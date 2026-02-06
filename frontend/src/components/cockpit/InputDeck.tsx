"use client";

import { useState, useEffect } from "react";
import { Sparkles, Settings2, ChevronDown, ChevronRight, Sliders, Type, Users, Mic, Hash, LayoutTemplate, Zap, FileCode, SplitSquareHorizontal, Globe, Image as ImageIcon } from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";

import { useAdvancedMode } from "@/context/AdvancedModeContext";
import { ModeToggle } from "../advanced/ModeToggle";
import { BrandVoiceManager } from "./BrandVoiceManager"; // Import Manager

interface InputDeckProps {
    onGenerate: (data: any) => void;
    loading: boolean;
    defaults?: any;
    onViewChange: (view: 'canvas' | 'studio') => void;
    currentView: 'canvas' | 'studio';
    onSwitchMode: (mode: 'single' | 'batch') => void;
}

export function InputDeck({ onGenerate, loading, defaults, onViewChange, currentView, onSwitchMode }: InputDeckProps) {
    const { isAdvancedMode } = useAdvancedMode();
    // const [mode, setMode] = useState<'single' | 'batch'>('single'); // Lifted up
    const [formData, setFormData] = useState({
        contentType: "Blog",
        topic: "",
        audience: "",
        tone: "Professional",
        contentLength: "Medium",
        keywords: "",
        formality: 3,
        includeEmojis: true,
        model: "",
        brandVoiceId: null as number | null,
        language: "English",
        generateImage: false,
        imageStyle: "realistic"
    });

    const [isABMode, setIsABMode] = useState(false);
    const [formDataB, setFormDataB] = useState({ ...formData }); // Init with same defaults

    const [showVoiceManager, setShowVoiceManager] = useState(false);
    const [selectedVoiceName, setSelectedVoiceName] = useState(""); // Init with same defaults

    // Sync B with A changes unless explicitly modified (simple sync for now, or just init)
    // Actually simpler to just let B diverge.


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



    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">

            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Control Deck
                </h2>

                <button
                    onClick={() => onSwitchMode('batch')}
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

                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Language</label>
                            <div className="relative">
                                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="input-field pl-9 py-2.5 font-medium text-gray-700"
                                >
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Italian</option>
                                    <option>Portuguese</option>
                                    <option>Dutch</option>
                                    <option>Chinese (Simplified)</option>
                                    <option>Japanese</option>
                                    <option>Korean</option>
                                    <option>Hindi</option>
                                    <option>Arabic</option>
                                    <option>Russian</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Voice & Audience */}
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
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, tone: t, brandVoiceId: null })); // Clear voice if tone manually set
                                            setSelectedVoiceName("");
                                        }}
                                        className={`px-2 py-2 text-xs font-bold rounded-lg border transition-all ${formData.tone === t && !formData.brandVoiceId
                                            ? 'bg-violet-50 border-violet-200 text-violet-700'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* Brand Voice Selector */}
                            <div className="mt-2">
                                <button
                                    onClick={() => setShowVoiceManager(true)}
                                    className={`w-full py-2 px-3 rounded-lg border-2 border-dashed flex items-center justify-between text-xs font-bold transition-all ${formData.brandVoiceId
                                        ? 'bg-violet-50 border-violet-200 text-violet-700'
                                        : 'border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Mic className="w-3.5 h-3.5" />
                                        {selectedVoiceName ? `Voice: ${selectedVoiceName}` : "Use Custom Brand Voice"}
                                    </span>
                                    {formData.brandVoiceId ? (
                                        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-violet-100 text-violet-500">CHANGE</span>
                                    ) : (
                                        <span className="text-xl leading-none">+</span>
                                    )}
                                </button>
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

                {/* 5. Visuals (Image Generation) */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-pink-500" />
                            Generate Visual
                        </label>
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, generateImage: !prev.generateImage }))}
                            className={`w-9 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData.generateImage ? 'bg-pink-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${formData.generateImage ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {formData.generateImage && (
                        <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 animate-slide-up">
                            <label className="text-[10px] font-bold text-gray-500 mb-1.5 block">Image Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Realistic', 'Cartoon', 'Minimalist', 'Painting'].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setFormData(prev => ({ ...prev, imageStyle: style.toLowerCase() }))}
                                        className={`py-2 px-2 text-[10px] font-bold rounded-lg border transition-all ${formData.imageStyle === style.toLowerCase()
                                            ? 'bg-pink-100 border-pink-300 text-pink-700'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-pink-200'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* 6. Advanced Configuration (Milestone 3.3) */}
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

                {/* 6. A/B Testing Toggle */}
                <section className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
                            <SplitSquareHorizontal className="w-4 h-4 text-violet-600" />
                            A/B Testing Mode
                        </label>
                        <div
                            onClick={() => {
                                const newMode = !isABMode;
                                setIsABMode(newMode);
                                if (!newMode) {
                                    setFormDataB(formData); // Reset B to match A when turning off
                                }
                            }}
                            className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isABMode ? 'bg-violet-600' : 'bg-gray-300'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${isABMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {isABMode && (
                        <div className="bg-violet-50/50 p-3 rounded-xl border border-violet-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <p className="text-[10px] text-violet-600 font-medium">Configure Variant B (Variant A uses settings above)</p>

                            {/* Simplified Variant B Controls - limiting to Model & Tone for V1 */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Variant B Model</label>
                                <ModelSelector
                                    selectedModel={formDataB.model || formData.model}
                                    onSelect={(id) => setFormDataB(prev => ({ ...prev, model: id }))}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Variant B Tone</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Professional', 'Casual', 'Witty', 'Persuasive'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setFormDataB(prev => ({ ...prev, tone: t }))}
                                            className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${formDataB.tone === t
                                                ? 'bg-violet-100 border-violet-300 text-violet-800'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

            </div>

            {/* Footer / Action */}
            <div className="p-5 border-t border-gray-100 bg-white/80 backdrop-blur top-auto bottom-0 sticky">
                <button
                    onClick={() => onGenerate(isABMode ? { ...formData, variantB: formDataB, isAB: true } : formData)}
                    disabled={loading || !formData.topic}
                    className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {loading ? "Igniting..." : (isABMode ? "Generate Comparison" : "Generate Content")}
                </button>
                {!formData.topic && (
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">Please enter a topic to start</p>
                )}
            </div>

            {/* Voice Manager Modal */}
            <BrandVoiceManager
                isOpen={showVoiceManager}
                onClose={() => setShowVoiceManager(false)}
                onSelect={(voice) => {
                    setFormData(prev => ({ ...prev, brandVoiceId: voice.id }));
                    setSelectedVoiceName(voice.name);
                }}
            />

        </div>
    );
}
