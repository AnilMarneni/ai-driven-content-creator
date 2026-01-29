"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid, History, Settings, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: LayoutGrid },
    { name: "Content Studio", href: "/generate", icon: Sparkles },
    { name: "History", href: "/history", icon: History }, // Note: Need to implement /history page if not exists, logic handles it
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 transition-all duration-300">

      {/* Logo & Brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 fill-white/20" />
        </div>
        <span className="font-bold text-lg tracking-tight text-gray-900 group-hover:text-primary transition-colors">
          Lumina<span className="text-primary">AI</span>
        </span>
      </Link>

      {/* Center Navigation */}
      <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "fill-primary/20" : ""}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Credits Pill (Mock) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-600">Pro Plan</span>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden ring-2 ring-white shadow-sm group-hover:ring-primary/20 transition-all">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-700 leading-none">{user?.full_name || "Guest User"}</p>
            </div>
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="p-3 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-800">{user?.full_name || "Guest"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "guest@lumina.ai"}</p>
                </div>
                <div className="p-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
