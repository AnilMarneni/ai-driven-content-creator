
import { MoreHorizontal, MessageCircle, Repeat2, Heart, BarChart2, Share } from "lucide-react";

interface TwitterPreviewProps {
    content: string;
}

export function TwitterPreview({ content }: TwitterPreviewProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm max-w-[550px] font-sans p-4 hover:bg-gray-50/30 transition">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[15px]">
                            <span className="font-bold text-gray-900 truncate">Your Name</span>
                            <span className="text-gray-500 truncate">@handle</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500">1m</span>
                        </div>
                        <button className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full p-1 transition">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mt-1 text-[15px] text-gray-900 whitespace-pre-wrap leading-normal">
                        {content || "What's happening?"}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 max-w-[425px text-gray-500 text-sm">
                        <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-xs">2</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-green-500 transition">
                            <div className="p-2 rounded-full group-hover:bg-green-50 transition">
                                <Repeat2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs">4</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-pink-500 transition">
                            <div className="p-2 rounded-full group-hover:bg-pink-50 transition">
                                <Heart className="w-4 h-4" />
                            </div>
                            <span className="text-xs">12</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition">
                                <BarChart2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs">1.2k</span>
                        </button>

                        <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition">
                                <Share className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
