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
            case "active": return "bg-green-100 text-green-700 border-green-200";
            case "scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
            case "paused": return "bg-amber-100 text-amber-700 border-amber-200";
            case "ended": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const footer = (
        <div className="flex justify-end w-full gap-3">
            <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-sm border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-all font-primary text-xs capitalize tracking-wide shadow-sm"
            >
                Close Window
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Campaign Details"
            subtitle={`Full overview for #${campaign.id}`}
            maxWidth="max-w-5xl"
            icon={<BarChart3 size={24} />}
            footer={footer}
        >
            <div className="space-y-6 py-2 font-primary text-left">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-sm shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-orange-500 rounded-sm text-white shadow-md">
                                <Target size={18} />
                            </div>
                            <span className="text-[11px] font-bold text-orange-700 capitalize">Campaign Reference</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">#{campaign.id}</p>
                        <p className="text-[13px] font-bold text-gray-800 capitalize italic">{campaign.source}</p>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-sm shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500 rounded-sm text-white shadow-md">
                                <Users size={18} />
                            </div>
                            <span className="text-[11px] font-bold text-blue-700 capitalize">Total Lead Hits</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{campaign.leads_generated.toLocaleString()}</p>
                        <p className="text-[11px] font-semibold text-gray-500 capitalize leading-relaxed">Generated across lifecycle</p>
                    </div>

                    <div className="bg-green-50/50 border border-green-100 p-5 rounded-sm shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500 rounded-sm text-white shadow-md">
                                <CheckCircle2 size={18} />
                            </div>
                            <span className="text-[11px] font-bold text-green-700 capitalize">Engine Status</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex px-3 py-1 rounded-sm text-[11px] font-bold capitalize border ${getStatusBadge(campaign.status)} shadow-sm`}>
                                {campaign.status}
                            </span>
                            <p className="text-[11px] font-semibold text-gray-500 capitalize italic">Till {new Date(campaign.end_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configuration Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <ShieldCheck size={18} className="text-orange-500" />
                            <h3 className="text-[15px] font-bold text-gray-900 capitalize">Campaign Configuration</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
                                <p className="text-[10px] font-bold text-gray-400 capitalize mb-1">Campaign Name</p>
                                <p className="text-[13px] font-bold text-gray-900">{campaign.name}</p>
                            </div>
                            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
                                <p className="text-[10px] font-bold text-gray-400 capitalize mb-1">Lead Source</p>
                                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                                    <Globe size={12} className="text-blue-500" />
                                    <span className="text-[13px]">{campaign.source}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
                                <p className="text-[10px] font-bold text-gray-400 capitalize mb-1">Audience type</p>
                                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                                    <Users size={12} className="text-orange-500" />
                                    <span className="text-[13px] capitalize">{campaign.audience_type} Model</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
                                <p className="text-[10px] font-bold text-gray-400 capitalize mb-1">Daily Cap</p>
                                <p className="text-[13px] font-bold text-orange-600">{campaign.daily_lead_limit || 'Unlimited'}</p>
                            </div>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-sm shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-orange-400" />
                                    <span className="text-[12px] font-bold capitalize">Timeline Points</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 rounded-sm capitalize">UTC Standard</span>
                            </div>
                            <div className="flex items-center justify-between gap-6 relative">
                                <div className="flex-1">
                                    <p className="text-[9px] font-bold text-gray-400 capitalize mb-1">Activation Point</p>
                                    <p className="text-[13px] font-bold">{new Date(campaign.start_date).toLocaleDateString('en-GB')}</p>
                                    <p className="text-[11px] text-orange-400 font-bold">{campaign.start_time || '00:00'}</p>
                                </div>
                                <div className="w-[1px] h-10 bg-white/10"></div>
                                <div className="flex-1 text-right">
                                    <p className="text-[9px] font-bold text-gray-400 capitalize mb-1">Termination Point</p>
                                    <p className="text-[13px] font-bold">{new Date(campaign.end_date).toLocaleDateString('en-GB')}</p>
                                    <p className="text-[11px] text-blue-400 font-bold">{campaign.end_time || '23:59'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Audience Detailed List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-orange-500" />
                                <h3 className="text-[15px] font-bold text-gray-900 capitalize">Active Participants</h3>
                            </div>
                            <span className="text-[11px] font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-sm capitalize">
                                {campaign.audience?.length || 0} Members
                            </span>
                        </div>

                        <div className="border border-gray-200 rounded-sm overflow-hidden bg-white max-h-[450px] flex flex-col">
                            {/* Participant Logic - Grouped for Teams, Flat for Individuals */}
                            <div className="overflow-y-auto custom-scrollbar flex-1 divide-y divide-gray-100">
                                {campaign.audience?.length > 0 ? (
                                    campaign.audience_type === "Team" ? (
                                        // Grouped by Team
                                        Object.entries(
                                            campaign.audience.reduce((acc, member) => {
                                                const tName = member.team_name || "Unassigned Teams";
                                                if (!acc[tName]) acc[tName] = [];
                                                acc[tName].push(member);
                                                return acc;
                                            }, {})
                                        ).map(([teamName, members]) => (
                                            <div key={teamName} className="mb-4 last:mb-0">
                                                <div className="sticky top-0 z-10 p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                        {teamName}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400">{members.length} Members</span>
                                                </div>
                                                <div className="divide-y divide-gray-50">
                                                    {members.map((member, mIdx) => (
                                                        <div key={mIdx} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-sm bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                                    {member.profile_picture_url ? (
                                                                        <img src={member.profile_picture_url} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        member.employee_name?.charAt(0)
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-gray-800 leading-tight">{member.employee_name}</span>
                                                                    <span className="text-[10px] text-gray-400 font-medium">ID: #{member.employee_id}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${member.is_investigation_officer ? "text-blue-600 bg-blue-50" : "text-gray-400 bg-gray-50"}`}>
                                                                    {member.is_investigation_officer ? "IO Expert" : "Officer"}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-orange-600">
                                                                    {member.is_unlimited ? "Unlimited" : (member.daily_limit_override || "Global")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Flat for Individual
                                        campaign.audience.map((member, idx) => (
                                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-sm bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                        {member.profile_picture_url ? (
                                                            <img src={member.profile_picture_url} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            member.employee_name?.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px] font-bold text-gray-800 leading-tight">{member.employee_name}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium">EMP-{member.employee_id}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm">Individual</span>
                                                    <span className="text-[10px] font-bold text-orange-600">
                                                        {member.is_unlimited ? "Unlimited" : (member.daily_limit_override || "Global")}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    <div className="p-10 text-center">
                                        <p className="text-[13px] font-bold text-gray-400 italic">No participants found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-sm">
                            <p className="text-[11px] font-bold text-gray-600 leading-relaxed capitalize">
                                <span className="text-orange-600">Note:</span> Distribution is handled via Round Robin strategy within selected {campaign.audience_type?.toLowerCase()} hierarchy levels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #fbd38d;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ed8936;
                }
            `}</style>
        </Modal>
    );
};

export default ViewCampaignModal;
