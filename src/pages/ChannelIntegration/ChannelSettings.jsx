import React, { useState } from "react";
import { Settings, ShieldCheck, Zap, UserX, Plus, List, Filter, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssignmentSettings from "../LeadsManagement/AssignmentSettings";
import LeadRulesConfig from "../LeadsManagement/LeadRulesConfig";
import DropLeadRules from "../LeadsManagement/DropLeadRules";
import CreateCampaignModal from "../../components/ChannelIntegration/CreateCampaignModal";
import CampaignList from "../../components/ChannelIntegration/CampaignList";

export default function ChannelSettings() {
    const [activeTab, setActiveTab] = useState("campaign-list");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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

                    <div className="flex items-center gap-3">
                        {activeTab === "campaign-list" && (
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 ${activeTab === "assignment"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <Zap size={16} className={activeTab === "assignment" ? "text-orange-500" : ""} />
                            Assignment Settings
                        </button>
                        <button
                            onClick={() => setActiveTab("rules")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 ${activeTab === "rules"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <ShieldCheck size={16} className={activeTab === "rules" ? "text-orange-500" : ""} />
                            Lead Rules
                        </button>
                        <button
                            onClick={() => setActiveTab("drop")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 ${activeTab === "drop"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <UserX size={16} className={activeTab === "drop" ? "text-orange-500" : ""} />
                            Drop Lead Rule
                        </button>
                        <button
                            onClick={() => setActiveTab("campaign-list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 ${activeTab === "campaign-list"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <List size={16} className={activeTab === "campaign-list" ? "text-orange-500" : ""} />
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
                            externalFilterOpen={isFilterOpen}
                            setExternalFilterOpen={setIsFilterOpen}
                        />
                    </div>
                )}
            </div>

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
