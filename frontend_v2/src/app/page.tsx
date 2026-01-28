"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, BarChart3, FileText, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [stats, setStats] = useState({
    total: 0,
    words: 0,
    topType: "N/A"
  });

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const total = data.length;
          const words = data.reduce((acc, item) => acc + (item.content?.split(' ').length || 0), 0);

          const typeCounts: Record<string, number> = {};
          data.forEach(item => {
            typeCounts[item.content_type] = (typeCounts[item.content_type] || 0) + 1;
          });
          const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];

          setStats({ total, words, topType });
        }
      })
      .catch(err => console.error("Failed to load stats", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden bg-gray-50/50">

      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-10">

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/50 text-sm font-medium text-blue-600 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini 1.5 Flash</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-blue-800 to-purple-900">
            AI Content Studio
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Create professional blogs, tweets, and emails in seconds.
            <br className="hidden md:block" /> Stop staring at a blank screen and start creating.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-200">
            <Link
              href="/generate"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/templates"
              className="px-8 py-4 bg-white/40 text-gray-700 font-semibold rounded-full border border-white/40 hover:bg-white/60 transition-all text-lg backdrop-blur-sm"
            >
              Templates
            </Link>
            <Link
              href="/settings"
              className="px-8 py-4 bg-white/40 text-gray-700 font-semibold rounded-full border border-white/40 hover:bg-white/60 transition-all text-lg backdrop-blur-sm"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
          <div className="glass-card p-6 rounded-2xl border border-white/50 bg-white/40 flex flex-col items-center">
            <div className="p-3 bg-blue-100 rounded-full mb-3 text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Pieces Generated</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/50 bg-white/40 flex flex-col items-center">
            <div className="p-3 bg-purple-100 rounded-full mb-3 text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.words.toLocaleString()}</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Words</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/50 bg-white/40 flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-full mb-3 text-green-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-800 line-clamp-1">{stats.topType}</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Top Format</div>
          </div>
        </div>

      </div>
    </div>
  );
}
