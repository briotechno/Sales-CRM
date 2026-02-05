import React from "react";
import { Megaphone, Calendar, ThumbsUp, ThumbsDown, Eye, User, Clock, Tag } from "lucide-react";
import Modal from "../common/Modal";

const ViewAnnouncementModal = ({ isOpen, onClose, announcement, stats }) => {
    if (!announcement) return null;

    // Combined stats from backend and mock state
    const currentStats = {
        likes: (announcement.likes || 0) + (stats?.likes || 0),
        dislikes: (announcement.dislikes || 0) + (stats?.dislikes || 0),
        views: (announcement.views || 0) + (stats?.views || 0),
    };

    // Mock people for the "Who" lists as requested
    const mockPeople = [
        "Mahipat Vaghela", "John Doe", "Jane Smith", "Alex Johnson", "Sarah Williams"
    ];

    const getCategoryColor = (category) => {
        const colors = {
            Achievement: "bg-green-50 text-green-700 border-green-200",
            "Product Update": "bg-blue-50 text-blue-700 border-blue-200",
            Policy: "bg-purple-50 text-purple-700 border-purple-200",
            Event: "bg-pink-50 text-pink-700 border-pink-200",
            Process: "bg-yellow-50 text-yellow-700 border-yellow-200",
            Recognition: "bg-orange-50 text-orange-700 border-orange-200",
            Internal: "bg-indigo-50 text-indigo-700 border-indigo-200",
            Urgent: "bg-red-50 text-red-700 border-red-200",
            General: "bg-gray-50 text-slate-700 border-gray-200",
        };

        if (colors[category]) return colors[category];

        const fallbacks = [
            "bg-blue-50 text-blue-700 border-blue-200",
            "bg-purple-50 text-purple-700 border-purple-200",
            "bg-indigo-50 text-indigo-700 border-indigo-200",
            "bg-teal-50 text-teal-700 border-teal-200",
            "bg-cyan-50 text-cyan-700 border-cyan-200",
            "bg-rose-50 text-rose-700 border-rose-200",
            "bg-amber-50 text-amber-700 border-amber-200",
        ];

        let hash = 0;
        const str = String(category || "General");
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % fallbacks.length;
        return fallbacks[index];
    };

    const footer = (
        <div className="flex justify-end w-full">
            <button
                onClick={onClose}
                className="px-8 py-2.5 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 font-bold transition-all text-xs uppercase tracking-widest border border-gray-200"
            >
                Close
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Announcement Details"
            subtitle="Complete insights and content"
            icon={<Megaphone size={24} className="text-white" />}
            maxWidth="max-w-4xl"
            footer={footer}
        >
            <div className="space-y-6 text-black">
                {/* Header Section */}
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-sm text-[10px] font-bold capitalize border ${getCategoryColor(announcement.category)}`}>
                                    {announcement.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <Calendar size={14} className="text-orange-500" />
                                    {new Date(announcement.date).toLocaleDateString("en-IN", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </div>
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight capitalize">
                                {announcement.title}
                            </h1>
                            <div className="flex items-center gap-3 pt-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-md bg-gray-50">
                                    {announcement.author_profile_picture_url ? (
                                        <img
                                            src={announcement.author_profile_picture_url}
                                            alt={announcement.author}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                            {announcement.author ? announcement.author.charAt(0) : "A"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Published by</p>
                                    <p className="text-sm font-black text-gray-800 capitalize tracking-tight">{announcement.author || "System Administrative"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-sm border border-gray-200 shadow-sm text-center min-w-[90px]">
                                <ThumbsUp size={16} className="text-green-500 mx-auto mb-1" />
                                <p className="text-lg font-black text-gray-900 leading-none">{currentStats.likes}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Likes</p>
                            </div>
                            <div className="bg-white p-3 rounded-sm border border-gray-200 shadow-sm text-center min-w-[90px]">
                                <ThumbsDown size={16} className="text-red-500 mx-auto mb-1" />
                                <p className="text-lg font-black text-gray-900 leading-none">{currentStats.dislikes}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Dislikes</p>
                            </div>
                            <div className="bg-white p-3 rounded-sm border border-gray-200 shadow-sm text-center min-w-[90px]">
                                <Eye size={16} className="text-blue-500 mx-auto mb-1" />
                                <p className="text-lg font-black text-gray-900 leading-none">{currentStats.views}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Views</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section with Scroll */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Tag size={16} className="text-orange-500" />
                        Announcement Content
                    </label>
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-sm p-6 overflow-y-auto max-h-[300px] custom-scrollbar shadow-inner">
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line capitalize">
                            {announcement.content}
                        </p>
                    </div>
                </div>

                {/* Engagement Details (Who Liked, etc.) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    {/* Who Liked */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ThumbsUp size={14} className="text-green-500" /> Who Liked
                        </h3>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                            {currentStats.likes > 0 ? (
                                mockPeople.slice(0, currentStats.likes).map((person, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm border border-gray-100 transition-hover hover:border-green-200">
                                        <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[9px] font-bold">
                                            {person.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{person}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-gray-400 italic">No likes recorded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Who Disliked */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ThumbsDown size={14} className="text-red-500" /> Who Disliked
                        </h3>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                            {currentStats.dislikes > 0 ? (
                                mockPeople.slice(1, currentStats.dislikes + 1).map((person, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm border border-gray-100 transition-hover hover:border-red-200">
                                        <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[9px] font-bold">
                                            {person.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{person}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-gray-400 italic">No dislikes recorded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Who Viewed */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Eye size={14} className="text-blue-500" /> Who Viewed
                        </h3>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                            {currentStats.views > 0 ? (
                                // Use a larger pool for views
                                [...mockPeople, "Robert Brown", "Emily Davis", "Michael Miller"].slice(0, currentStats.views).map((person, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm border border-gray-100 transition-hover hover:border-blue-200">
                                        <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[9px] font-bold">
                                            {person.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{person}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-gray-400 italic">No views recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewAnnouncementModal;
