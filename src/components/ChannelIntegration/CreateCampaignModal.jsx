import React, { useState } from "react";
import {
    Clock,
    Calendar,
    Users,
    User,
    Globe,
    Settings,
    Check,
    ChevronRight,
    Search,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import Modal from "../common/Modal";
import { useGetTeamsQuery, useGetTeamByIdQuery } from "../../store/api/teamApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";

const TeamStructureCard = ({ member, level, onUpdate, settings }) => {
    return (
        <div className={`p-4 bg-white border-2 rounded-2xl transition-all shadow-sm flex flex-col gap-4 ${settings?.isInvestigationOfficer ? "border-orange-500 bg-orange-50/30" : "border-gray-100"}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-lg font-black text-gray-400">
                        {member.profile_picture ? (
                            <img src={member.profile_picture_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                            member.employee_name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-800 leading-tight">{member.employee_name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{member.designation_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded leading-none">
                                {member.conversion_rate || "0"}% Conv.
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onUpdate(member.id, 'isInvestigationOfficer', !settings?.isInvestigationOfficer)}
                    className={`p-2 rounded-xl transition-all ${settings?.isInvestigationOfficer ? "bg-orange-500 text-white shadow-lg" : "bg-gray-50 text-gray-300 hover:bg-gray-100"}`}
                    title="Mark as Investigation Officer"
                >
                    <Check size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-100">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">Max Lead Balance</label>
                    <input
                        type="number"
                        placeholder="Max 10"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-orange-500 outline-none transition-all"
                        value={settings?.maxBalance || ""}
                        onChange={(e) => onUpdate(member.id, 'maxBalance', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">Daily Leads Limit</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Units"
                            disabled={settings?.dailyLimitUnlimited}
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-orange-500 outline-none transition-all disabled:opacity-50"
                            value={settings?.dailyLimit || ""}
                            onChange={(e) => onUpdate(member.id, 'dailyLimit', e.target.value)}
                        />
                        <button
                            onClick={() => onUpdate(member.id, 'dailyLimitUnlimited', !settings?.dailyLimitUnlimited)}
                            className={`whitespace-nowrap px-3 py-2 rounded-xl border-2 text-[10px] font-black transition-all ${settings?.dailyLimitUnlimited ? "bg-orange-500 border-orange-500 text-white" : "border-gray-100 text-gray-400 bg-gray-50 hover:bg-white"}`}
                        >
                            UNLIMITED
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamHierarchyConfig = ({ teamId, hierarchySettings, setHierarchySettings }) => {
    const { data: team, isLoading } = useGetTeamByIdQuery(teamId);

    if (isLoading) return <div className="h-40 flex items-center justify-center gap-3 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold"><RefreshCw className="animate-spin" size={20} /> Loading Team Structure...</div>;
    if (!team) return null;

    const groupedMembers = (team.members || []).reduce((acc, m) => {
        const lv = m.level || 1;
        if (!acc[lv]) acc[lv] = [];
        acc[lv].push(m);
        return acc;
    }, {});

    const updateMemberSetting = (memberId, field, value) => {
        setHierarchySettings(prev => ({
            ...prev,
            [teamId]: {
                ...(prev[teamId] || {}),
                [memberId]: {
                    ...(prev[teamId]?.[memberId] || {}),
                    [field]: value
                }
            }
        }));
    };

    const applyToLevel = (levelId, field, value) => {
        const membersAtLevel = groupedMembers[levelId] || [];
        const updates = {};
        membersAtLevel.forEach(m => {
            updates[m.id] = {
                ...(hierarchySettings[teamId]?.[m.id] || {}),
                [field]: value
            };
        });
        setHierarchySettings(prev => ({
            ...prev,
            [teamId]: {
                ...(prev[teamId] || {}),
                ...updates
            }
        }));
    };

    return (
        <div className="animate-fadeIn bg-white border border-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
                        {team.team_name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-gray-800 tracking-tight">{team.team_name}</h4>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{team.members?.length || 0} Members Structure</p>
                    </div>
                </div>
            </div>

            <div className="space-y-12 relative">
                {Object.entries(groupedMembers).sort(([a], [b]) => a - b).map(([level, members], idx, arr) => (
                    <div key={level} className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <span className="bg-gray-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Level {level}</span>
                                <div className="h-[2px] w-20 bg-gradient-to-r from-gray-200 to-transparent"></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-gray-300 uppercase italic">Bulk Action:</span>
                                <button
                                    onClick={() => applyToLevel(level, 'dailyLimitUnlimited', true)}
                                    className="text-[10px] font-black text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-all border border-orange-100"
                                >
                                    SET ALL TO UNLIMITED
                                </button>
                                <button
                                    onClick={() => applyToLevel(level, 'isInvestigationOfficer', true)}
                                    className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all border border-blue-100"
                                >
                                    MARK ALL INVESTIGATION
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {members.map(member => (
                                <TeamStructureCard
                                    key={member.id}
                                    member={member}
                                    level={level}
                                    settings={hierarchySettings[teamId]?.[member.id]}
                                    onUpdate={updateMemberSetting}
                                />
                            ))}
                        </div>

                        {idx < arr.length - 1 && (
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20">
                                <ChevronRight className="rotate-90 text-gray-400" size={24} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreateCampaignModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        campaignName: "",
        source: "All Direct",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        timingType: "Every Working Day & Working Time",
        leadLimitType: "Unlimited",
        leadsPerDay: "",
        audienceType: "Team",
        selectedAudiences: [], // IDs of teams or individuals
    });

    const [hierarchySettings, setHierarchySettings] = useState({});

    const { data: teamsData, isLoading: isLoadingTeams } = useGetTeamsQuery({ limit: 1000 });
    const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });

    const teams = teamsData?.teams || [];
    const employees = employeesData?.employees || [];

    const handleAudienceToggle = (id) => {
        setFormData(prev => {
            const isSelected = prev.selectedAudiences.includes(id);
            if (isSelected) {
                return { ...prev, selectedAudiences: prev.selectedAudiences.filter(item => item !== id) };
            } else {
                return { ...prev, selectedAudiences: [...prev.selectedAudiences, id] };
            }
        });
    };

    const handleSelectAllAudiences = () => {
        const allIds = formData.audienceType === "Team"
            ? teams.map(t => t.id)
            : employees.map(e => e.id);

        if (formData.selectedAudiences.length === allIds.length) {
            setFormData(prev => ({ ...prev, selectedAudiences: [] }));
        } else {
            setFormData(prev => ({ ...prev, selectedAudiences: allIds }));
        }
    };

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <button
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
                Cancel
            </button>
            <button
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => {
                    console.log("Saving Campaign with Config:", { ...formData, hierarchySettings });
                    onClose();
                }}
            >
                <Check size={20} />
                Create Campaign
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Campaign"
            subtitle="Setup campaign details, timing, and assign audience"
            icon={<Settings size={22} className="text-white" />}
            maxWidth="max-w-5xl"
            footer={footer}
        >
            <div className="space-y-8 py-2">
                {/* Campaign Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Campaign Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Summer Sales 2024"
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                            value={formData.campaignName}
                            onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Select Source *</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all appearance-none font-medium text-gray-700"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                            >
                                <option>All Direct</option>
                                <option>Website Meta</option>
                                <option>Just Dial</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <Globe size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timing Section */}
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Schedule & Timing</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Start group */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Start Date & Time</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-700"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                                <input
                                    type="time"
                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-700"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                        </div>
                        {/* End group */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase">End Date & Time</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-700"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                                <input
                                    type="time"
                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-700"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Every Working Day & Working Time",
                            "All Time"
                        ].map((type) => (
                            <label
                                key={type}
                                className={`flex items-center gap-3 p-4  border-2 transition-all cursor-pointer ${formData.timingType === type
                                    ? "border-orange-500 bg-orange-50/50"
                                    : "border-gray-200 bg-white hover:border-orange-200"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="timingType"
                                    className="hidden"
                                    checked={formData.timingType === type}
                                    onChange={() => setFormData({ ...formData, timingType: type })}
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.timingType === type ? "border-orange-500" : "border-gray-300"
                                    }`}>
                                    {formData.timingType === type && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                </div>
                                <span className={`text-sm font-bold ${formData.timingType === type ? "text-orange-700" : "text-gray-600"}`}>
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Lead Limit Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Leads Configuration</h3>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {[
                            { id: "Unlimited", label: "Unlimited Leads" },
                            { id: "Limited", label: "Fixed Limit Per Day" }
                        ].map((option) => (
                            <label
                                key={option.id}
                                className={`flex-1 min-w-[200px] flex items-center gap-3 p-4   border-2 transition-all cursor-pointer ${formData.leadLimitType === option.id
                                    ? "border-orange-500 bg-orange-50/50"
                                    : "border-gray-200 bg-white hover:border-orange-200"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="leadLimit"
                                    className="hidden"
                                    checked={formData.leadLimitType === option.id}
                                    onChange={() => setFormData({ ...formData, leadLimitType: option.id })}
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.leadLimitType === option.id ? "border-orange-500" : "border-gray-300"
                                    }`}>
                                    {formData.leadLimitType === option.id && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                </div>
                                <span className={`text-sm font-bold ${formData.leadLimitType === option.id ? "text-orange-700" : "text-gray-600"}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {formData.leadLimitType === "Limited" && (
                        <div className="animate-fadeIn space-y-2 mt-4 max-w-xs">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase">New Leads Per Day</label>
                            <input
                                type="number"
                                placeholder="Enter limit"
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                                value={formData.leadsPerDay}
                                onChange={(e) => setFormData({ ...formData, leadsPerDay: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Audience Selection Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-orange-500" />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Select Audience</h3>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "Team", selectedAudiences: [] })}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.audienceType === "Team" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Users size={14} />
                                Team
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "Individual", selectedAudiences: [] })}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.audienceType === "Individual" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <User size={14} />
                                Individual
                            </button>
                        </div>
                    </div>

                    {/* Selection List */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Search ${formData.audienceType === "Team" ? "teams" : "employees"}...`}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                                />
                            </div>
                            <button
                                onClick={handleSelectAllAudiences}
                                className="text-xs font-bold text-orange-600 hover:text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-50 transition-all uppercase tracking-wider"
                            >
                                {formData.selectedAudiences.length > 0 && formData.selectedAudiences.length === (formData.audienceType === "Team" ? teams.length : employees.length)
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                            {formData.audienceType === "Team" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {isLoadingTeams ? (
                                        <div className="col-span-2 py-8 text-center text-gray-400 font-medium">Loading teams...</div>
                                    ) : teams.length > 0 ? (
                                        teams.map((team) => (
                                            <div
                                                key={team.id}
                                                onClick={() => handleAudienceToggle(team.id)}
                                                className={`flex items-center justify-between p-3   border-2 transition-all cursor-pointer group ${formData.selectedAudiences.includes(team.id)
                                                    ? "bg-orange-50 border-orange-500 shadow-md"
                                                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${formData.selectedAudiences.includes(team.id)
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                                        }`}>
                                                        {team.team_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold ${formData.selectedAudiences.includes(team.id) ? "text-orange-900" : "text-gray-700"}`}>
                                                            {team.team_name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-medium">{team.total_members || 0} Members</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.selectedAudiences.includes(team.id)
                                                    ? "bg-orange-500 border-orange-500"
                                                    : "border-gray-200"
                                                    }`}>
                                                    {formData.selectedAudiences.includes(team.id) && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 py-8 text-center text-gray-400 font-medium">No teams found</div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {isLoadingEmployees ? (
                                        <div className="col-span-2 py-8 text-center text-gray-400 font-medium">Loading employees...</div>
                                    ) : employees.length > 0 ? (
                                        employees.map((emp) => (
                                            <div
                                                key={emp.id}
                                                onClick={() => handleAudienceToggle(emp.id)}
                                                className={`flex items-center justify-between p-3  border-2 transition-all cursor-pointer group ${formData.selectedAudiences.includes(emp.id)
                                                    ? "bg-orange-50 border-orange-500 shadow-md"
                                                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden ${formData.selectedAudiences.includes(emp.id)
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                                        }`}>
                                                        {emp.profile_picture ? (
                                                            <img src={emp.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            emp.employee_name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold ${formData.selectedAudiences.includes(emp.id) ? "text-orange-900" : "text-gray-700"}`}>
                                                            {emp.employee_name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-medium">{emp.designation_name || "Employee"}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.selectedAudiences.includes(emp.id)
                                                    ? "bg-orange-500 border-orange-500"
                                                    : "border-gray-200"
                                                    }`}>
                                                    {formData.selectedAudiences.includes(emp.id) && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 py-8 text-center text-gray-400 font-medium">No employees found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {formData.selectedAudiences.length > 0 && (
                            <div className="p-3 bg-orange-50 border-t border-orange-100 flex items-center gap-2">
                                <Check size={14} className="text-orange-600" />
                                <span className="text-xs font-bold text-orange-700">{formData.selectedAudiences.length} Selected Audiences</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Hierarchy Config Section */}
                {formData.audienceType === "Team" && formData.selectedAudiences.length > 0 && (
                    <div className="space-y-6 animate-fadeIn pt-4 border-t-2 border-dashed border-gray-100">
                        <div className="flex items-center gap-2">
                            <ChevronRight className="text-orange-500 rotate-90" size={20} />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Team Flow Configuration</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                            {formData.selectedAudiences.map(teamId => (
                                <TeamHierarchyConfig
                                    key={teamId}
                                    teamId={teamId}
                                    hierarchySettings={hierarchySettings}
                                    setHierarchySettings={setHierarchySettings}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Modal>
    );
};

export default CreateCampaignModal;
