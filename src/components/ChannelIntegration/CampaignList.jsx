import React, { useState } from "react";
import {
    Search,
    Filter,
    Calendar,
    Users,
    Target,
    Clock,
    Eye,
    Edit,
    Trash2,
    Play,
    Pause,
    MoreVertical,
    TrendingUp,
    Globe
} from "lucide-react";
import ViewCampaignModal from "./ViewCampaignModal";

const CampaignList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Mock data for campaigns
    const [campaigns] = useState([
        {
            id: "CMP-001",
            name: "Summer Sales Drive",
            source: "Website Meta",
            status: "Active",
            startDate: "2024-06-01 09:00",
            endDate: "2024-08-31 18:00",
            leadsCount: 1250,
            limit: "Unlimited",
            audience: "Sales Team Alpha",
            type: "Team"
        },
        {
            id: "CMP-002",
            name: "Festive Season Offers",
            source: "All Direct",
            status: "Scheduled",
            startDate: "2024-10-15 10:00",
            endDate: "2024-11-15 22:00",
            leadsCount: 0,
            limit: "500/Day",
            audience: "Marketing Group",
            type: "Team"
        },
        {
            id: "CMP-003",
            name: "Retargeting Campaign",
            source: "Just Dial",
            status: "Paused",
            startDate: "2024-01-10 08:30",
            endDate: "2024-12-31 23:59",
            leadsCount: 4500,
            limit: "Unlimited",
            audience: "Amit Sharma",
            type: "Individual"
        }
    ]);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-700 border-green-200";
            case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Paused": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Ended": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const handleView = (campaign) => {
        setSelectedCampaign(campaign);
        setIsViewModalOpen(true);
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {/* Filters Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-sm shadow-sm border border-gray-100">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-500 transition-all font-semibold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-sm px-4 py-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            className="bg-transparent text-xs font-black text-gray-600 outline-none uppercase tracking-wider"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Paused">Paused</option>
                            <option value="Ended">Ended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Campaign Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-black uppercase tracking-[0.1em]">
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap">ID & Campaign Name</th>
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap">Source</th>
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap text-center">Status</th>
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap">Schedule</th>
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap">Audience</th>
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap text-center">Leads Generated</th>
                            <th className="py-4 px-6 border-b border-orange-400 whitespace-nowrap text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-t hover:bg-orange-50/20 transition-all group">
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-orange-600 font-black text-xs tracking-tighter cursor-pointer hover:underline" onClick={() => handleView(campaign)}>
                                                {campaign.id}
                                            </span>
                                            <span className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-orange-700 transition-colors">
                                                {campaign.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 italic tracking-tight">{campaign.source}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap font-primary">
                                        <span className={`px-2 py-1 rounded-[2px] text-[10px] font-black border uppercase tracking-widest ${getStatusBadge(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap font-primary">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                                <Calendar size={12} className="text-orange-500" />
                                                <span>{campaign.startDate}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold ml-4">to {campaign.endDate}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap font-primary">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                                <Users size={12} className="text-blue-500" />
                                                <span className="truncate max-w-[150px]">{campaign.audience}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold ml-4 uppercase tracking-[0.1em]">{campaign.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap font-primary">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black text-orange-600 leading-none">{campaign.leadsCount.toLocaleString()}</span>
                                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Hits</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity font-primary">
                                            <button
                                                onClick={() => handleView(campaign)}
                                                className="p-2 bg-orange-50 hover:bg-orange-500 rounded-sm text-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-500 shadow-sm"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-blue-50 rounded-sm text-blue-500 hover:text-blue-700 transition-all border border-transparent hover:border-blue-100" title="Edit Campaign">
                                                <Edit size={16} />
                                            </button>
                                            {campaign.status === "Paused" || campaign.status === "Scheduled" ? (
                                                <button className="p-2 hover:bg-green-50 rounded-sm text-green-500 hover:text-green-700 transition-all border border-transparent hover:border-green-100" title="Resume/Start">
                                                    <Play size={16} />
                                                </button>
                                            ) : (
                                                <button className="p-2 hover:bg-yellow-50 rounded-sm text-yellow-500 hover:text-yellow-700 transition-all border border-transparent hover:border-yellow-100" title="Pause">
                                                    <Pause size={16} />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-red-50 rounded-sm text-red-500 hover:text-red-700 transition-all border border-transparent hover:border-red-100" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-20 text-center font-primary flex-col">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                                            <Target size={30} className="text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">No Campaigns Found</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Try adjusting your filters or search term</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder (to match other tables) */}
            <div className="flex items-center justify-between px-2 font-primary">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredCampaigns.length} total campaigns</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-sm text-[10px] font-bold text-gray-400 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1 bg-orange-500 border border-orange-500 rounded-sm text-[10px] font-bold text-white shadow-sm ring-2 ring-orange-200">1</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 rounded-sm text-[10px] font-bold text-gray-600 hover:border-orange-500 transition-all">Next</button>
                </div>
            </div>

            {/* View Modal */}
            <ViewCampaignModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                campaign={selectedCampaign}
            />
        </div>
    );
};

export default CampaignList;
