import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { AdvancedModeProvider } from "@/context/AdvancedModeContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

// Premium Fonts
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LuminaAI - Intelligent Content",
  description: "Next-generation AI content creation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={`${outfit.variable} ${inter.variable} font-sans bg-[#F8FAFC] dark:bg-slate-950 text-gray-900 dark:text-gray-100 antialiased selection:bg-indigo-100 selection:text-indigo-700`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdvancedModeProvider>
            <AuthProvider>
              <AppShell>
                {children}
              </AppShell>
            </AuthProvider>
          </AdvancedModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
