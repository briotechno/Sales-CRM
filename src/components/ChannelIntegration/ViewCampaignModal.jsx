import React from "react";
import {
    X,
    Calendar,
    Users,
    Target,
    Clock,
    Globe,
    ShieldCheck,
    CheckCircle2,
    Play,
    Pause,
    BarChart3
} from "lucide-react";
import Modal from "../common/Modal";

const ViewCampaignModal = ({ isOpen, onClose, campaign }) => {
    if (!campaign) return null;

    const getStatusBadge = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-700 border-green-200";
            case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Paused": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Ended": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Campaign Details"
            subtitle={`Full overview for ${campaign.id}`}
            maxWidth="max-w-4xl"
            icon={<BarChart3 size={22} className="text-white" />}
        >
            <div className="space-y-8 py-2">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 border border-orange-100 p-5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                                <Target size={20} />
                            </div>
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Campaign ID</span>
                        </div>
                        <p className="text-xl font-black text-gray-800 tracking-tight">{campaign.id}</p>
                        <p className="text-xs font-bold text-orange-400 mt-1 uppercase mb-0">{campaign.source}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                                <Users size={20} />
                            </div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Leads</span>
                        </div>
                        <p className="text-xl font-black text-gray-800 tracking-tight">{campaign.leadsCount.toLocaleString()}</p>
                        <p className="text-xs font-bold text-blue-400 mt-1 uppercase mb-0">Generated So Far</p>
                    </div>

                    <div className="bg-green-50 border border-green-100 p-5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Current Status</span>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(campaign.status)}`}>
                            {campaign.status}
                        </span>
                        <p className="text-xs font-bold text-green-400 mt-2 uppercase mb-0">Since {campaign.startDate.split(' ')[0]}</p>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <ShieldCheck size={18} className="text-orange-500" />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Configuration</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-1">Campaign Name</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-1">Lead Source</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.source}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-1">Audience Type</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-1">Daily Limit</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.limit}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-2 flex items-center gap-2">
                                    <Users size={12} className="text-orange-500" />
                                    Assigned Audience
                                </p>
                                <p className="text-sm font-bold text-gray-800 tracking-tight">{campaign.audience}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Clock size={18} className="text-orange-500" />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Schedule & Timeline</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="relative pl-6 border-l-2 border-orange-100 space-y-8 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm ring-2 ring-orange-100"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-0.5">Start Date & Time</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.startDate}</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 border-4 border-white shadow-sm ring-2 ring-gray-50"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-0.5">Expected End Date</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.endDate}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-500">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight leading-none mb-1">Timing Logic</p>
                                        <p className="text-xs font-bold text-gray-700">Every Working Day & Timing</p>
                                    </div>
                                </div>
                                <CheckCircle2 size={16} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewCampaignModal;
