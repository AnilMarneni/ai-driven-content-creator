"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Login failed");

            login(data.token, data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to continue creating</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2">
                        <span className="text-lg">⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm font-medium"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs font-medium text-gray-500">
                    Don't have an account?
                    <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 ml-1 hover:underline">
                        Create one
                    </Link>
                </div>

            </div>
        </div>
    );
}
