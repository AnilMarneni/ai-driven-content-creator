"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutTemplate, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Dashboard", icon: <LayoutTemplate className="w-4 h-4" /> },
    { href: "/generate", label: "Studio", icon: <Sparkles className="w-4 h-4" /> },
    { href: "/history", label: "History", null: true },
    { href: "/templates", label: "Templates", icon: <LayoutTemplate className="w-4 h-4" /> },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled
        ? "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm py-3"
        : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
            Lumina<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50 backdrop-blur-md">
          {navLinks.filter(l => !l.null).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition">
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                      alt="User"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-gray-700 group-hover:text-indigo-600 transition">
                    {user.full_name || "Creator"}
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full inset-x-0 bg-white border-b border-gray-100 shadow-xl p-6 md:hidden animate-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            {navLinks.filter(l => !l.null).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-medium text-gray-600"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-gray-600">
              <User className="w-5 h-5" /> Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
