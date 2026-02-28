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
    TrendingUp,
    Globe,
    X
} from "lucide-react";
import { useRef, useEffect } from "react";
import ViewCampaignModal from "./ViewCampaignModal";

const CampaignList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [tempSearch, setTempSearch] = useState("");
    const [tempStatus, setTempStatus] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const hasActiveFilters = searchTerm !== "" || statusFilter !== "All";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleApplyFilters = () => {
        setSearchTerm(tempSearch);
        setStatusFilter(tempStatus);
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        setTempSearch("");
        setTempStatus("All");
    };

    const handleClearAll = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setTempSearch("");
        setTempStatus("All");
    };

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
            <div className="flex justify-end bg-white p-4 rounded-sm shadow-sm border border-gray-100">
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => {
                            if (hasActiveFilters) {
                                handleClearAll();
                            } else {
                                setTempSearch(searchTerm);
                                setTempStatus(statusFilter);
                                setIsFilterOpen(!isFilterOpen);
                            }
                        }}
                        className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-800 tracking-tight">Filter Options</span>
                                <button
                                    onClick={handleResetFilters}
                                    className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                >
                                    Reset All
                                </button>
                            </div>

                            <div className="p-5 space-y-6">
                                {/* Search Input */}
                                <div className="group">
                                    <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Campaign</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tempSearch}
                                            onChange={(e) => setTempSearch(e.target.value)}
                                            placeholder="Search by name or ID..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Select Status</span>
                                    <div className="space-y-2">
                                        {["All", "Active", "Scheduled", "Paused", "Ended"].map((option) => (
                                            <label key={option} className="flex items-center group cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status_filter_campaign"
                                                        checked={tempStatus === option}
                                                        onChange={() => setTempStatus(option)}
                                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                                    />
                                                </div>
                                                <span className={`ml-3 text-sm font-medium transition-colors ${tempStatus === option ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                                    {option} Status
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className="p-4 bg-gray-50 border-t flex gap-3">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                <table className="w-full border-collapse text-left text-sm font-primary">
                    <thead>
                        <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <th className="py-3 px-4 font-semibold border-b border-orange-400">Campaign ID</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400">Campaign Name</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400">Source</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-center">Status</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400">Start Date</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400">Leads</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400">Audience</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-t hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="text-orange-600 font-bold cursor-pointer hover:underline" onClick={() => handleView(campaign)}>
                                            {campaign.id}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="font-bold text-gray-800 tracking-tight group-hover:text-orange-700 transition-colors">
                                            {campaign.name}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 italic tracking-tight">{campaign.source}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                            <Calendar size={12} className="text-orange-500" />
                                            <span>{campaign.startDate.split(' ')[0]}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-orange-600 leading-none">{campaign.leadsCount.toLocaleString()}</span>
                                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Total Hits</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                            <Users size={12} className="text-blue-500" />
                                            <span className="truncate max-w-[120px]">{campaign.audience}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-end gap-2 text-gray-400">
                                            <button
                                                onClick={() => handleView(campaign)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all" title="Edit Campaign">
                                                <Edit size={18} />
                                            </button>
                                            {campaign.status === "Paused" || campaign.status === "Scheduled" ? (
                                                <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-sm transition-all" title="Resume/Start">
                                                    <Play size={18} />
                                                </button>
                                            ) : (
                                                <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-sm transition-all" title="Pause">
                                                    <Pause size={18} />
                                                </button>
                                            )}
                                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-20 text-center font-primary flex-col">
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

            {/* Pagination Segment */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 font-primary">
                <p className="text-sm font-semibold text-gray-700">
                    Showing <span className="text-orange-600">1</span> to <span className="text-orange-600">{filteredCampaigns.length}</span> of <span className="text-orange-600">{filteredCampaigns.length}</span> Campaigns
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={true}
                        className="px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 bg-gray-200 text-gray-400 cursor-not-allowed text-xs"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            className="w-10 h-10 rounded-sm font-bold transition bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md text-sm"
                        >
                            1
                        </button>
                    </div>

                    <button
                        disabled={true}
                        className="px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 bg-gray-200 text-gray-400 cursor-not-allowed text-xs"
                    >
                        Next
                    </button>
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
