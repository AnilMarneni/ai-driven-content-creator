
import { MoreHorizontal, ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";

interface LinkedInPreviewProps {
    content: string;
}

export function LinkedInPreview({ content }: LinkedInPreviewProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-[550px] font-sans">
            {/* Header */}
            <div className="p-4 flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div>
                    <div className="font-semibold text-sm text-gray-900">Your Name</div>
                    <div className="text-xs text-gray-500">AI Content Creator • 1st</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        Now • <span className="text-[10px]">🌐</span>
                    </div>
                </div>
                <button className="ml-auto text-gray-500">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-2 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {content || "Your post content will appear here..."}
            </div>

            {/* Engagement Stats */}
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center p-[2px]">
                            <ThumbsUp className="w-2 h-2 text-white fill-current" />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                    </div>
                    <span>124</span>
                </div>
                <div>
                    10 comments • 2 reposts
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-between">
                <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition flex-1 justify-center">
                    <ThumbsUp className="w-5 h-5" /> Like
                </button>
                <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition flex-1 justify-center">
                    <MessageSquare className="w-5 h-5" /> Comment
                </button>
                <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition flex-1 justify-center">
                    <Share2 className="w-5 h-5" /> Repost
                </button>
                <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition flex-1 justify-center">
                    <Send className="w-5 h-5" /> Send
                </button>
            </div>
        </div>
    );
}
