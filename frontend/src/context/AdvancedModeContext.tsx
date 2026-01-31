"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdvancedModeContextType {
    isAdvancedMode: boolean;
    toggleAdvancedMode: () => void;
}

const AdvancedModeContext = createContext<AdvancedModeContextType | undefined>(undefined);

export function AdvancedModeProvider({ children }: { children: ReactNode }) {
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);

    // Persist to local storage
    useEffect(() => {
        const stored = localStorage.getItem("lumina_advanced_mode");
        if (stored === "true") setIsAdvancedMode(true);
    }, []);

    const toggleAdvancedMode = () => {
        const newValue = !isAdvancedMode;
        setIsAdvancedMode(newValue);
        localStorage.setItem("lumina_advanced_mode", String(newValue));
    };

    return (
        <AdvancedModeContext.Provider value={{ isAdvancedMode, toggleAdvancedMode }}>
            {children}
        </AdvancedModeContext.Provider>
    );
}

export function useAdvancedMode() {
    const context = useContext(AdvancedModeContext);
    if (context === undefined) {
        throw new Error("useAdvancedMode must be used within an AdvancedModeProvider");
    }
    return context;
}
