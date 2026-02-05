"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Settings, User as UserIcon, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Combined Form State
    const [formData, setFormData] = useState({
        // Auth/User Data
        full_name: "",
        email: "",
        bio: "",
        avatar_url: "",

        // Preferences
        default_tone: "Professional",
        default_audience: "General",
        default_length: "Medium",
        industry: "",
        writing_style: ""
    });

    useEffect(() => {
        // Sync user data when loaded
        if (user) {
            setFormData(prev => ({
                ...prev,
                full_name: user.full_name || "",
                email: user.email || "",
                bio: user.bio || "",
                avatar_url: user.avatar_url || ""
            }));
        }

        // Load preferences
        fetch("http://127.0.0.1:8000/preferences")
            .then(res => res.json())
            .then(data => setFormData(prev => ({ ...prev, ...data })))
            .catch(err => console.error("Failed to load settings", err));
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        try {
            // 1. Update Profile (Auth)
            const profileRes = await fetch("http://127.0.0.1:8000/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url
                })
            });

            if (!profileRes.ok) throw new Error("Failed to update profile");
            const updatedUser = await profileRes.json();
            updateProfile(updatedUser);

            // 2. Update Preferences
            const prefRes = await fetch("http://127.0.0.1:8000/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    default_tone: formData.default_tone,
                    default_audience: formData.default_audience,
                    default_length: formData.default_length,
                    industry: formData.industry,
                    writing_style: formData.writing_style
                })
            });

            if (prefRes.ok) {
                setMessage("✅ Profile & Preferences saved!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("⚠️ Preferences failed to save.");
            }

        } catch (err) {
            console.error(err);
            setMessage("❌ Error saving profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 flex justify-center bg-[#F8FAFC]">

            <div className="max-w-5xl w-full grid md:grid-cols-12 gap-8">

                {/* Header Section */}
                <div className="md:col-span-12 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your public profile and content defaults.</p>
                </div>

                {/* Left Col: Profile Card */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer mb-4">
                            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden ring-4 ring-white shadow-lg">
                                <img
                                    src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.full_name}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">{formData.full_name || "New Creator"}</h2>
                        <p className="text-sm text-gray-500">{formData.email}</p>

                        <div className="w-full mt-6 space-y-4">
                            <div className="space-y-1 text-left">
                                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 border-none text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-xs font-bold text-gray-400 uppercase">Bio / Title</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-gray-50 border-none text-sm focus:ring-2 focus:ring-indigo-100 resize-none h-24"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Preferences & Settings */}
                <div className="md:col-span-8 space-y-6">

                    {/* Preferences Panel */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Content DNA</h3>
                                <p className="text-xs text-gray-500">Set your default generation parameters</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Industry / Niche</label>
                                <input
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition"
                                    placeholder="e.g. SaaS, Fintech"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Writing Style</label>
                                <input
                                    name="writing_style"
                                    value={formData.writing_style}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition"
                                    placeholder="e.g. Witty, Academic"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Default Tone</label>
                                <select
                                    name="default_tone"
                                    value={formData.default_tone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 bg-white"
                                >
                                    <option>Professional</option>
                                    <option>Casual</option>
                                    <option>Persuasive</option>
                                    <option>Friendly</option>
                                    <option>Witty</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Default Length</label>
                                <select
                                    name="default_length"
                                    value={formData.default_length}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 bg-white"
                                >
                                    <option>Short</option>
                                    <option>Medium</option>
                                    <option>Long</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        {message && (
                            <span className={`text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"} animate-in fade-in`}>
                                {message}
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
