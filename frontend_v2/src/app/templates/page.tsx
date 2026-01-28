"use client";

import Link from "next/link";
import { Sparkles, Mail, Linkedin, Twitter, FileText, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: "viral-tweet",
      title: "Viral Tweet",
      icon: Twitter,
      color: "bg-blue-500",
      desc: "Short, punchy tweets designed to get engagement and retweets.",
      params: "contentType=Twitter/Tweet&tone=Witty&contentLength=Short&includeEmojis=true"
    },
    {
      id: "linkedin-leadership",
      title: "Thought Leadership",
      icon: Linkedin,
      color: "bg-blue-700",
      desc: "Professional LinkedIn posts to establish authority in your industry.",
      params: "contentType=LinkedIn Post&tone=Professional&contentLength=Medium&formality=4"
    },
    {
      id: "cold-email",
      title: "Cold Outreach Email",
      icon: Mail,
      color: "bg-purple-600",
      desc: "High-converting emails to pitch services or start conversations.",
      params: "contentType=Email&tone=Persuasive&contentLength=Medium&formality=3"
    },
    {
      id: "seo-blog",
      title: "SEO Blog Post",
      icon: FileText,
      color: "bg-orange-500",
      desc: "Long-form articles optimized for search engines and readership.",
      params: "contentType=Blog&tone=Professional&contentLength=Long&formality=3"
    },
    {
      id: "product-launch",
      title: "Product Launch",
      icon: Sparkles,
      color: "bg-pink-500",
      desc: "Exciting announcements to create buzz for new features.",
      params: "contentType=Ad Copy&tone=Excited&contentLength=Short&includeEmojis=true"
    },
    {
      id: "witty-reply",
      title: "Witty Social Reply",
      icon: Twitter,
      color: "bg-green-500",
      desc: "Clever responses to comments or questions on social media.",
      params: "contentType=Twitter/Tweet&tone=Witty&contentLength=Short&includeEmojis=true"
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Choose a Template
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't start from scratch. Pick a battle-tested template and get results faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/generate?${template.params}`}
              className="group relative p-6 glass-card rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/50 bg-white/40 backdrop-blur-md"
            >
              <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                <template.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                {template.title}
              </h3>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {template.desc}
              </p>

              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Use Template <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
