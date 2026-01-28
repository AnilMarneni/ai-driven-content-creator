"use client";

import Link from "next/link";
import { Home, Sparkles, LayoutTemplate, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-md p-6 hidden md:block h-screen sticky top-0">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Content AI
        </h2>
      </div>

      <ul className="space-y-2">
        <li>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/generate"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Sparkles className="w-5 h-5" />
            Generate
          </Link>
        </li>
        <li>
          <Link
            href="/templates"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <LayoutTemplate className="w-5 h-5" />
            Templates
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
        </li>
      </ul>
    </aside>
  );
}
