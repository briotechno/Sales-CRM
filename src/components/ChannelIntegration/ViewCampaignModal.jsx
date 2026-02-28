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

    const footer = (
        <div className="flex justify-end w-full">
            <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all font-primary text-xs uppercase tracking-widest"
            >
                Close
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Campaign Details"
            subtitle={`Full overview for ${campaign.id}`}
            maxWidth="max-w-4xl"
            icon={<BarChart3 size={24} />}
            footer={footer}
        >
            <div className="space-y-8 py-2 font-primary">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-sm shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500 rounded-sm text-white shadow-md">
                                <Target size={20} />
                            </div>
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Campaign ID</span>
                        </div>
                        <p className="text-xl font-black text-gray-800 tracking-tight">{campaign.id}</p>
                        <p className="text-xs font-bold text-orange-400 mt-1 uppercase mb-0 italic tracking-tighter">{campaign.source}</p>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-sm shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500 rounded-sm text-white shadow-md">
                                <Users size={20} />
                            </div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Leads</span>
                        </div>
                        <p className="text-xl font-black text-gray-800 tracking-tight">{campaign.leadsCount.toLocaleString()}</p>
                        <p className="text-xs font-bold text-blue-400 mt-1 uppercase mb-0 tracking-tighter">Generated So Far</p>
                    </div>

                    <div className="bg-green-50/50 border border-green-100 p-5 rounded-sm shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500 rounded-sm text-white shadow-md">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Current Status</span>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(campaign.status)} shadow-sm`}>
                            {campaign.status}
                        </span>
                        <p className="text-xs font-bold text-green-400 mt-2 uppercase mb-0 tracking-tighter italic">Starting {campaign.startDate.split(' ')[0]}</p>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <ShieldCheck size={18} className="text-[#FF7B1D]" />
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Configuration Matrix</h3>
                        </div>

                        <div className="space-y-5">
                            <div className="flex justify-between items-start border-l-2 border-orange-100 pl-3">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Campaign Name</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lead Source</p>
                                    <p className="text-xs font-bold text-gray-700 italic">{campaign.source}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-start border-l-2 border-blue-100 pl-3">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Audience Type</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Limit</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.limit}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm shadow-inner shadow-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
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
                            <Clock size={18} className="text-[#FF7B1D]" />
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Engine Timing & Schedule</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="relative pl-6 border-l-2 border-orange-100 space-y-8 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm bg-orange-500 border-4 border-white shadow-md ring-2 ring-orange-100"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Activation Point</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.startDate}</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm bg-gray-800 border-4 border-white shadow-md ring-2 ring-gray-100"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Termination Point</p>
                                    <p className="text-sm font-bold text-gray-800">{campaign.endDate}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-50/50 rounded-sm border border-orange-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-orange-500 shadow-sm">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Execution Logic</p>
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
