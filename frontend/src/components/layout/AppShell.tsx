"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
            {/* Top Navigation - Fixed Height */}
            <Navbar />

            {/* Main Content Area */}
            {/* Added pt-16 to account for fixed navbar height */}
            <main className="flex-1 flex pt-16 h-screen overflow-hidden">
                {/* We use h-screen and overflow-hidden here because the Children (Cockpit/Canvas) 
            will handle their own internal scrolling for a "Desktop App" feel. 
            Standard pages will just overflow naturally if they override this. */}
                <div className="w-full h-full relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
