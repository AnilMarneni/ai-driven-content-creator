"use client";

import { useState, useEffect } from "react";
import { useAdvancedMode } from "@/context/AdvancedModeContext";
import { Lock, Unlock, Play, RefreshCcw, Save, Code, AlertTriangle, FileText, ChevronRight, Check } from "lucide-react";

interface PromptBlock {
    id: string;
    type: string;
    content: string;
    is_locked: boolean;
    description: string;
}

interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    blocks: PromptBlock[];
    variables: any[];
}

interface PromptStudioProps {
    onUseOverride: (templateId: string, overrides: Record<string, string>) => void;
    initialOverrides?: Record<string, string>;
    initialTemplateId?: string;
}

export function PromptStudio({ onUseOverride, initialOverrides, initialTemplateId }: PromptStudioProps) {
    const { isAdvancedMode } = useAdvancedMode();
    const [templates, setTemplates] = useState<PromptTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
    const [overrides, setOverrides] = useState<Record<string, string>>({});
    const [previewText, setPreviewText] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);

    // Fetch Templates
    useEffect(() => {
        if (!isAdvancedMode) return;
        fetch("http://127.0.0.1:8000/prompts/templates")
            .then(res => res.json())
            .then(data => {
                setTemplates(data);
                // Restore state if available
                if (initialTemplateId) {
                    const t = data.find((t: any) => t.id === initialTemplateId);
                    if (t) {
                        setSelectedTemplate(t);
                        // If we have specific overrides, use them. Else pre-fill from template
                        if (initialOverrides) {
                            setOverrides(initialOverrides);
                        } else {
                            const defaults: Record<string, string> = {};
                            t.blocks.forEach((b: any) => {
                                if (!b.is_locked) defaults[b.id] = b.content;
                            });
                            setOverrides(defaults);
                        }
                    }
                }
            })
            .catch(err => console.error("Failed to load templates", err));
    }, [isAdvancedMode, initialTemplateId]);

    if (!isAdvancedMode) return null;

    const handleSelectTemplate = (t: PromptTemplate) => {
        setSelectedTemplate(t);
        setOverrides({});
        setPreviewText("");
        // Pre-fill overrides with current content for editing
        const initialOverrides: Record<string, string> = {};
        t.blocks.forEach(b => {
            if (!b.is_locked) initialOverrides[b.id] = b.content;
        });
        setOverrides(initialOverrides);
    };

    const handleGeneratePreview = async () => {
        if (!selectedTemplate) return;
        setPreviewLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/prompts/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    template_id: selectedTemplate.id,
                    variables: { topic: "Example Topic", audience: "General", tone: "Professional" }, // Dummy vars for preview
                    overrides: overrides
                })
            });
            const data = await res.json();
            setPreviewText(data.prompt_text);
        } catch (e) {
            console.error(e);
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="h-full flex bg-gray-50 border-t border-gray-200">
            {/* Sidebar: Templates */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">System Templates</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleSelectTemplate(t)}
                            className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors ${selectedTemplate?.id === t.id
                                ? 'bg-violet-50 text-violet-700 border border-violet-100'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main: Editor */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedTemplate ? (
                    <div className="flex-1 flex flex-col">
                        {/* Toolbar */}
                        <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-800">{selectedTemplate.name}</h2>
                                <p className="text-xs text-gray-500">{selectedTemplate.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleGeneratePreview}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Play className="w-3 h-3" /> Test Preview
                                </button>
                                <button
                                    onClick={() => onUseOverride(selectedTemplate.id, overrides)}
                                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Check className="w-3 h-3" /> Use in Generator
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors">
                                    <Save className="w-3 h-3" /> Save Copy
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 flex gap-8">
                            {/* Visual Editor */}
                            <div className="flex-1 space-y-6 max-w-2xl">
                                {selectedTemplate.blocks.map(block => (
                                    <div key={block.id} className={`relative group transition-all duration-300 ${block.is_locked ? 'opacity-80' : ''}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${block.type === 'system' ? 'bg-red-50 text-red-600' :
                                                block.type === 'instruction' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {block.type} BLOCK
                                            </span>
                                            {block.is_locked ? (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <Lock className="w-3 h-3" /> Locked
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-green-600">
                                                    <Unlock className="w-3 h-3" /> Editable
                                                </div>
                                            )}
                                        </div>

                                        <div className={`relative rounded-xl border overflow-hidden ${block.is_locked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 ring-2 ring-transparent focus-within:ring-violet-500/20 focus-within:border-violet-500'
                                            }`}>
                                            <textarea
                                                readOnly={block.is_locked}
                                                value={overrides[block.id] ?? block.content}
                                                onChange={e => !block.is_locked && setOverrides({ ...overrides, [block.id]: e.target.value })}
                                                className={`w-full p-4 text-sm font-mono leading-relaxed outline-none resize-none bg-transparent min-h-[120px] ${block.is_locked ? 'text-gray-500 cursor-not-allowed select-none' : 'text-gray-800'
                                                    }`}
                                            />
                                            {/* Variable Highlighting (Simplified visual overlap or just text logic for now) */}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">{block.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Panel */}
                            <div className="w-[400px] shrink-0 flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <Code className="w-4 h-4" /> Compiled Prompt Preview
                                </div>
                                <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 font-mono text-xs text-gray-600 whitespace-pre-wrap">
                                    {previewLoading ? (
                                        <div className="flex items-center gap-2 text-violet-600">
                                            <RefreshCcw className="w-4 h-4 animate-spin" /> Compiling...
                                        </div>
                                    ) : previewText ? (
                                        previewText
                                    ) : (
                                        <span className="text-gray-400 italic">Hit 'Test Preview' to see the final assembled prompt.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">Select a template to start engineering</p>
                    </div>
                )}
            </div>
        </div>
    );
}
