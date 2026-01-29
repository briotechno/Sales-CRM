import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, Share2 } from "lucide-react";

const ShareModal = ({ isOpen, onClose, companyName, businessId }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const profileLink = `${window.location.origin}/business/${businessId}/${(companyName || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(profileLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 transition-all animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-md transform transition-all animate-scaleIn">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-sm">
                    <div className="flex items-center gap-3 text-[#FF7B1D]">
                        <Share2 size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Share Profile</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-sm transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-gray-600 mb-6 font-medium">
                        Share <span className="text-gray-900 font-bold">{companyName}</span>'s public profile with clients and partners.
                    </p>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Profile Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={profileLink}
                                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-sm text-sm text-gray-600 focus:outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className={`px-4 py-3 rounded-sm flex items-center gap-2 transition-all font-bold ${copied
                                    ? "bg-green-500 text-white shadow-lg shadow-green-100"
                                    : "bg-[#FF7B1D] text-white hover:bg-orange-600 shadow-lg shadow-orange-100"
                                    }`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
                        <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest">Preview Landing Page</p>
                        <a
                            href={profileLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-sm hover:bg-gray-900 hover:text-white transition-all group"
                        >
                            View Landing Page
                            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
