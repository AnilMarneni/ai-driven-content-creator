import { useState } from "react";
import { SplitSquareHorizontal, Play } from "lucide-react";

interface ABTestingPanelProps {
    onRunTest: (config: any) => void;
    baseConfig: any;
}

export function ABTestingPanel({ onRunTest, baseConfig }: ABTestingPanelProps) {
    const [variantA, setVariantA] = useState({ name: "Variant A", prompt: "" });
    const [variantB, setVariantB] = useState({ name: "Variant B", prompt: "" });

    const handleRun = () => {
        onRunTest({
            ...baseConfig,
            variantA,
            variantB
        });
    };

    return (
        <div className="space-y-4 p-4 bg-violet-50/50 rounded-xl border border-violet-100">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-sm uppercase tracking-wide">
                <SplitSquareHorizontal className="w-4 h-4" /> A/B Experiment
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500">Variant A (Control)</label>
                    <textarea
                        value={variantA.prompt}
                        onChange={e => setVariantA({ ...variantA, prompt: e.target.value })}
                        placeholder="Default system prompt..."
                        className="w-full h-32 text-xs p-2 rounded-lg border border-gray-200 resize-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500">Variant B (Test)</label>
                    <textarea
                        value={variantB.prompt}
                        onChange={e => setVariantB({ ...variantB, prompt: e.target.value })}
                        placeholder="Enter custom prompt..."
                        className="w-full h-32 text-xs p-2 rounded-lg border border-violet-200 bg-white resize-none shadow-sm"
                    />
                </div>
            </div>

            <button
                onClick={handleRun}
                className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
                <Play className="w-3 h-3" /> Run Comparison
            </button>
        </div>
    );
}
