import { useState, useEffect } from "react";
import { Code, RotateCcw, Save, AlertTriangle } from "lucide-react";

interface PromptEditorProps {
    template: string;
    variables: string[];
    onChange: (newTemplate: string) => void;
    onReset: () => void;
}

export function PromptEditor({ template, variables, onChange, onReset }: PromptEditorProps) {
    const [localTemplate, setLocalTemplate] = useState(template);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setLocalTemplate(template);
    }, [template]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalTemplate(e.target.value);
        onChange(e.target.value);
        setTouched(true);
    };

    // Simple validation status
    const missingVars = variables.filter(v => !localTemplate.includes(`{{${v}}}`));
    const isValid = missingVars.length === 0;

    // Model Logic (Simplified for UI)
    const recommendedModels = ["gemini-1.5-pro", "gpt-4"];
    const avoidModels = ["gemini-1.0-pro"];

    return (
        <div className="space-y-2 animate-fade-in">

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold flex items-center gap-1">
                    <Code className="w-3 h-3" /> Prompt Template
                </span>
                <button
                    onClick={() => { onReset(); setTouched(false); }}
                    className="text-primary hover:underline flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3" /> Reset
                </button>
            </div>

            {/* Model Compatibility Badge */}
            <div className="flex gap-2 mb-2">
                <div className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded border border-blue-100 font-medium">
                    Recommended: Reasoning Models (e.g. Gemini Pro, GPT-4)
                </div>
            </div>

            <div className="relative group">
                <textarea
                    value={localTemplate}
                    onChange={handleChange}
                    className={`w-full h-48 bg-gray-900 text-gray-100 font-mono text-xs p-3 rounded-lg resize-none outline-none border transition-colors
                        ${!isValid ? 'border-red-500' : 'border-transparent group-hover:border-gray-700'}
                    `}
                    spellCheck={false}
                />
                {!isValid && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-900/50 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        Missing: {missingVars.join(", ")}
                    </div>
                )}
            </div>

            <div className="text-[10px] text-gray-400">
                Variables: {variables.map(v => <span key={v} className="bg-gray-100/10 px-1 rounded mx-0.5 text-gray-300">{`{{${v}}}`}</span>)}
            </div>
        </div>
    );
}
