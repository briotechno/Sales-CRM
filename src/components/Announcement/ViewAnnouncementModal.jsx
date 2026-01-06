import React from "react";
import { X, Megaphone, Calendar, Send } from "lucide-react";
import Modal from "../common/Modal";

const ViewAnnouncementModal = ({ isOpen, onClose, announcement }) => {
    if (!announcement) return null;

    const getCategoryColor = (category) => {
        const colors = {
            Achievement: "bg-green-100 text-green-700 border-green-300",
            "Product Update": "bg-blue-100 text-blue-700 border-blue-300",
            Policy: "bg-purple-100 text-purple-700 border-purple-300",
            Event: "bg-pink-100 text-pink-700 border-pink-300",
            Process: "bg-yellow-100 text-yellow-700 border-yellow-300",
            Recognition: "bg-orange-100 text-orange-700 border-orange-300",
            General: "bg-gray-100 text-gray-700 border-gray-300",
        };
        return colors[category] || colors.General;
    };

    const footer = (
        <div className="flex gap-3 justify-end w-full">
            <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-sm hover:bg-gray-50 font-bold text-gray-700 transition-all text-sm uppercase tracking-wide"
            >
                Close
            </button>
            <button
                onClick={() => window.alert("Share functionality coming soon")}
                className="px-6 py-2.5 bg-[#FF7B1D] text-white rounded-sm hover:bg-orange-700 font-bold shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wide flex items-center gap-2"
            >
                <Send size={16} />
                Share
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Announcement Details"
            subtitle={`Posted on ${new Date(announcement.date).toLocaleDateString()}`}
            icon={<Megaphone size={24} className="text-white" />}
            maxWidth="max-w-3xl"
            footer={footer}
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                                announcement.category
                            )}`}
                        >
                            {announcement.category}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {announcement.title}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-gray-500 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                {announcement.author ? announcement.author.charAt(0) : "A"}
                            </div>
                            <span className="font-medium text-gray-900">
                                {announcement.author || "System"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-orange max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                        {announcement.content}
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ViewAnnouncementModal;
