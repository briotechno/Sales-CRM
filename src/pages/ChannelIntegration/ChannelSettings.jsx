import React, { useState } from "react";
import { Settings, ShieldCheck, Zap, UserX } from "lucide-react";
import AssignmentSettings from "../LeadsManagement/AssignmentSettings";
import LeadRulesConfig from "../LeadsManagement/LeadRulesConfig";
import DropLeadRules from "../LeadsManagement/DropLeadRules";

export default function ChannelSettings() {
    const [activeTab, setActiveTab] = useState("assignment");

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-primary">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <Settings size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Lead Settings</h1>
                            <p className="text-sm text-gray-500 font-medium">Configure lead assignment logic and automated rules</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
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
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-fadeIn">
                {activeTab === "assignment" && (
                    <AssignmentSettings />
                )}
                {activeTab === "rules" && (
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <LeadRulesConfig />
                    </div>
                )}
                {activeTab === "drop" && (
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <DropLeadRules />
                    </div>
                )}
            </div>
        </div>
    );
}
