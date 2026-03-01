import { Settings, ShieldCheck, Zap, UserX, Plus, List, Filter, Home, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import AssignmentSettings from "../LeadsManagement/AssignmentSettings";
import LeadRulesConfig from "../LeadsManagement/LeadRulesConfig";
import DropLeadRules from "../LeadsManagement/DropLeadRules";
import CreateCampaignModal from "../../components/ChannelIntegration/CreateCampaignModal";
import CampaignList from "../../components/ChannelIntegration/CampaignList";

export default function ChannelSettings() {
    const [activeTab, setActiveTab] = useState("campaign-list");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [tempSearch, setTempSearch] = useState("");
    const [tempStatus, setTempStatus] = useState("All");

    const filterRef = useRef(null);

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
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-primary">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Campaign Integration</h1>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <Home className="text-gray-400" size={14} />
                                <span className="text-gray-400">CRM / </span>
                                <span className="text-[#FF7B1D] font-bold">Campaign Integration</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative" ref={filterRef}>
                        {activeTab === "campaign-list" && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center justify-center w-11 h-11 rounded-sm border transition shadow-sm ${isFilterOpen
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                    title="Toggle Filters"
                                >
                                    <Filter size={20} />
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-full md:w-[400px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-campaignFadeIn overflow-hidden text-left">
                                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center text-left">
                                            <span className="text-sm font-bold text-gray-800 tracking-tight">Filter Options</span>
                                            <button
                                                onClick={handleResetFilters}
                                                className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                            >
                                                Reset All
                                            </button>
                                        </div>

                                        <div className="p-5 space-y-6 text-left">
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
                        )}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        >
                            <Plus size={20} />
                            Create Campaign
                        </button>
                    </div>
                </div>

                {/* Tabs Bar */}
                <div className="px-6 py-2 border-t border-gray-100 bg-white overflow-x-auto flex justify-start">
                    <div className="flex items-center gap-2 p-1 rounded-sm w-fit">
                        <button
                            onClick={() => setActiveTab("assignment")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[15px] font-bold transition-all duration-300 ${activeTab === "assignment"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <Zap size={18} className={activeTab === "assignment" ? "text-orange-500" : ""} />
                            Assignment Rules
                        </button>
                        <button
                            onClick={() => setActiveTab("rules")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[15px] font-bold transition-all duration-300 ${activeTab === "rules"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <ShieldCheck size={18} className={activeTab === "rules" ? "text-orange-500" : ""} />
                            Connected Rules
                        </button>
                        <button
                            onClick={() => setActiveTab("drop")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[15px] font-bold transition-all duration-300 ${activeTab === "drop"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <UserX size={18} className={activeTab === "drop" ? "text-orange-500" : ""} />
                            Lead Drop & Deletion
                        </button>
                        <button
                            onClick={() => setActiveTab("campaign-list")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[15px] font-bold transition-all duration-300 ${activeTab === "campaign-list"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <List size={18} className={activeTab === "campaign-list" ? "text-orange-500" : ""} />
                            Campaign List
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-fadeIn">
                {activeTab === "assignment" && (
                    <div className="px-6 py-6 font-primary">
                        <AssignmentSettings />
                    </div>
                )}
                {activeTab === "rules" && (
                    <div className="px-6 py-6">
                        <LeadRulesConfig />
                    </div>
                )}
                {activeTab === "drop" && (
                    <div className="px-6 py-6">
                        <DropLeadRules />
                    </div>
                )}
                {activeTab === "campaign-list" && (
                    <div className="px-6 py-6">
                        <CampaignList
                            searchTerm={searchTerm}
                            statusFilter={statusFilter}
                            onClearFilters={() => {
                                setSearchTerm("");
                                setStatusFilter("All");
                                setTempSearch("");
                                setTempStatus("All");
                            }}
                        />
                    </div>
                )}
            </div>

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <style jsx>{`
                .animate-campaignFadeIn {
                    animation: campaignFadeIn 0.2s ease-out;
                }
                @keyframes campaignFadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
