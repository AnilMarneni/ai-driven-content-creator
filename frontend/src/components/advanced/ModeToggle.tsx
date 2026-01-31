"use client";

import { useAdvancedMode } from "@/context/AdvancedModeContext";
import { Info, Zap, ShieldAlert } from "lucide-react";

export function ModeToggle() {
    const { isAdvancedMode, toggleAdvancedMode } = useAdvancedMode();

    return (
        <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdvancedMode ? 'text-violet-600' : 'text-gray-400'}`}>
                {isAdvancedMode ? "Advanced Mode" : "Standard Mode"}
            </span>
            <button
                onClick={toggleAdvancedMode}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${isAdvancedMode ? 'bg-violet-600' : 'bg-gray-200'
                    }`}
                title={isAdvancedMode ? "Switch to Standard Mode" : "Enable Advanced Mode (Power Users)"}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${isAdvancedMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                >
                    {isAdvancedMode ? <Zap className="w-3 h-3 text-violet-600 fill-violet-600" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
            </button>
        </div>
    );
}
