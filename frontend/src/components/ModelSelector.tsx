"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Cpu, Zap, Activity } from "lucide-react";

interface Model {
    id: string;
    name: string;
    provider: string;
    description: string;
    cost_tier: string;
    capabilities: string[];
}

interface ModelSelectorProps {
    selectedModel: string;
    onSelect: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchModels() {
            try {
                const res = await fetch("http://localhost:8000/models");
                if (res.ok) {
                    const data = await res.json();
                    setModels(data);
                    // If selectedModel is empty, select first one
                    if (!selectedModel && data.length > 0) {
                        onSelect(data[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch models", err);
            } finally {
                setLoading(false);
            }
        }
        fetchModels();
    }, []);

    const currentModel = models.find(m => m.id === selectedModel) || models[0];

    return (
        <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">AI Model</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all text-left"
            >
                {loading ? (
                    <span className="text-sm text-gray-400">Loading models...</span>
                ) : currentModel ? (
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentModel.provider === 'google' ? 'bg-blue-50 text-blue-600' :
                                currentModel.provider === 'openai' ? 'bg-green-50 text-green-600' :
                                    'bg-purple-50 text-purple-600'
                            }`}>
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-800">{currentModel.name}</div>
                            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{currentModel.provider}</div>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400">Select Model</span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                            {models.map(model => (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        onSelect(model.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-start gap-3 p-2 rounded-lg transition-colors text-left ${selectedModel === model.id ? "bg-blue-50/50" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`mt-1 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${model.provider === 'google' ? 'bg-blue-100 text-blue-600' :
                                            model.provider === 'openai' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                        }`}>
                                        {model.provider === 'google' && <Zap className="w-3.5 h-3.5" />}
                                        {model.provider === 'openai' && <Activity className="w-3.5 h-3.5" />}
                                        {model.provider === 'anthropic' && <Cpu className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-bold ${selectedModel === model.id ? "text-blue-700" : "text-gray-700"}`}>{model.name}</span>
                                            {selectedModel === model.id && <Check className="w-3 h-3 text-blue-600" />}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{model.description}</p>
                                        <div className="flex gap-2 mt-1.5">
                                            {model.cost_tier && (
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">{model.cost_tier} cost</span>
                                            )}
                                            {model.capabilities.slice(0, 2).map(cap => (
                                                <span key={cap} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">{cap}</span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
