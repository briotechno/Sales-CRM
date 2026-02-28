import React, { useState, useMemo } from "react";
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
    RefreshCw,
    CheckCircle2
} from "lucide-react";
import Modal from "../common/Modal";
import { useGetTeamsQuery, useGetTeamByIdQuery } from "../../store/api/teamApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";

const TeamStructureCard = ({ member, level, onUpdate, settings }) => {
    return (
        <div className={`p-4 bg-white border-2 rounded-sm transition-all shadow-sm flex flex-col gap-4 font-primary ${settings?.isInvestigationOfficer ? "border-orange-500 bg-orange-50/30" : "border-gray-100 shadow-inner shadow-gray-50"}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-lg font-black text-gray-400">
                        {member.profile_picture ? (
                            <img src={member.profile_picture_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                            member.employee_name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <p className="text-[13px] font-black text-gray-800 leading-tight uppercase tracking-tight">{member.employee_name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.designation_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm border border-green-100 leading-none uppercase">
                                {member.conversion_rate || "0"}% Conversion
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onUpdate(member.id, 'isInvestigationOfficer', !settings?.isInvestigationOfficer)}
                    className={`p-2 rounded-sm transition-all ${settings?.isInvestigationOfficer ? "bg-orange-500 text-white shadow-md" : "bg-gray-50 text-gray-300 hover:bg-gray-100 border border-gray-100"}`}
                    title="Mark as Investigation Officer"
                >
                    <CheckCircle2 size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-3 border-t border-gray-100">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Balance</label>
                    <input
                        type="number"
                        placeholder="e.g. 10"
                        className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-sm text-xs font-bold focus:border-orange-500 outline-none transition-all"
                        value={settings?.maxBalance || ""}
                        onChange={(e) => onUpdate(member.id, 'maxBalance', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daily Limit</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Units"
                            disabled={settings?.dailyLimitUnlimited}
                            className="flex-1 px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-sm text-xs font-bold focus:border-orange-500 outline-none transition-all disabled:opacity-50"
                            value={settings?.dailyLimit || ""}
                            onChange={(e) => onUpdate(member.id, 'dailyLimit', e.target.value)}
                        />
                        <button
                            onClick={() => onUpdate(member.id, 'dailyLimitUnlimited', !settings?.dailyLimitUnlimited)}
                            className={`whitespace-nowrap px-4 py-2 rounded-sm border text-[10px] font-black transition-all uppercase tracking-widest ${settings?.dailyLimitUnlimited ? "bg-orange-500 border-orange-600 text-white shadow-sm" : "border-gray-200 text-gray-400 bg-gray-50/50 hover:bg-white"}`}
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

    if (isLoading) return <div className="h-40 flex items-center justify-center gap-3 bg-gray-50 rounded-sm border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-widest font-primary"><RefreshCw className="animate-spin" size={20} /> Loading Matrix...</div>;
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
        <div className="animate-fadeIn bg-white border border-gray-200 rounded-sm p-6 shadow-sm overflow-hidden space-y-8 font-primary">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-sm flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
                        {team.team_name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-800 tracking-tight uppercase">{team.team_name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{team.members?.length || 0} Level Hierarchy Matrix</p>
                    </div>
                </div>
            </div>

            <div className="space-y-12 relative">
                {Object.entries(groupedMembers).sort(([a], [b]) => a - b).map(([level, members], idx, arr) => (
                    <div key={level} className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <span className="bg-gray-800 text-white text-[10px] font-black px-4 py-1.5 rounded-sm uppercase tracking-widest">Level {level}</span>
                                <div className="h-[2px] w-20 bg-gradient-to-r from-gray-200 to-transparent"></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Bulk Matrix:</span>
                                <button
                                    onClick={() => applyToLevel(level, 'dailyLimitUnlimited', true)}
                                    className="text-[10px] font-black text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-sm transition-all border border-orange-200 uppercase tracking-widest bg-white"
                                >
                                    UNLIMITED ALL
                                </button>
                                <button
                                    onClick={() => applyToLevel(level, 'isInvestigationOfficer', true)}
                                    className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-sm transition-all border border-blue-200 uppercase tracking-widest bg-white"
                                >
                                    OFFICER ALL
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
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-10">
                                <ChevronRight className="rotate-90 text-gray-800" size={32} />
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
        source: "All",
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

    const [searchTerm, setSearchTerm] = useState("");

    const [hierarchySettings, setHierarchySettings] = useState({});

    const { data: teamsData, isLoading: isLoadingTeams } = useGetTeamsQuery({ limit: 1000 });
    const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });

    const teams = useMemo(() => {
        const raw = teamsData?.teams || [];
        // Unique by ID
        return Array.from(new Map(raw.map(t => [t.id, t])).values());
    }, [teamsData]);

    const employees = useMemo(() => {
        const raw = employeesData?.employees || [];
        // Unique by ID
        return Array.from(new Map(raw.map(e => [e.id, e])).values());
    }, [employeesData]);

    const filteredTeams = teams.filter(t =>
        t.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredEmployees = employees.filter(e =>
        e.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        const currentList = formData.audienceType === "Team" ? filteredTeams : filteredEmployees;
        const allIds = currentList.map(item => item.id);

        if (formData.selectedAudiences.length === allIds.length && allIds.length > 0) {
            setFormData(prev => ({ ...prev, selectedAudiences: [] }));
        } else {
            setFormData(prev => ({ ...prev, selectedAudiences: allIds }));
        }
    };

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all font-primary text-xs uppercase tracking-widest"
            >
                Cancel
            </button>
            <button
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-md transition-all font-primary text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg"
                onClick={() => {
                    console.log("Saving Campaign with Config:", { ...formData, hierarchySettings });
                    onClose();
                }}
            >
                <Check size={18} />
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
            icon={<Settings size={24} />}
            maxWidth="max-w-5xl"
            footer={footer}
        >
            <div className="space-y-8 py-2 font-primary">
                {/* Campaign Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize tracking-normal">
                            <Settings size={16} className="text-[#FF7B1D]" />
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Summer Sales 2024"
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold"
                            value={formData.campaignName}
                            onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize tracking-normal">
                            <Globe size={16} className="text-[#FF7B1D]" />
                            Select Source <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold text-gray-700 bg-white cursor-pointer hover:border-gray-300 appearance-none"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                            >
                                <option>All</option>
                                <option>Direct</option>
                                <option>Website</option>
                                <option>Meta</option>
                                <option>Just dial</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" size={16} />
                        </div>
                    </div>
                </div>

                {/* Timing Section */}
                <div className="bg-orange-50/30 p-6 rounded-sm border border-orange-100 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
                        <Calendar size={16} className="text-orange-500" />
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Schedule & Timing</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Start group */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date & Time</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                                <input
                                    type="time"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                        </div>
                        {/* End group */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date & Time</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                                <input
                                    type="time"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
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
                                className={`flex items-center gap-3 p-4 border transition-all cursor-pointer rounded-sm ${formData.timingType === type
                                    ? "border-orange-500 bg-white shadow-sm"
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
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.timingType === type ? "border-orange-500 border-[6px]" : "border-gray-300"
                                    }`}>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-tight ${formData.timingType === type ? "text-orange-700" : "text-gray-500"}`}>
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Lead Limit Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Clock size={16} className="text-orange-500" />
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Leads Configuration</h3>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {[
                            { id: "Unlimited", label: "Unlimited Leads" },
                            { id: "Limited", label: "Fixed Limit Per Day" }
                        ].map((option) => (
                            <label
                                key={option.id}
                                className={`flex-1 min-w-[240px] flex items-center gap-3 p-4 border transition-all cursor-pointer rounded-sm ${formData.leadLimitType === option.id
                                    ? "border-orange-500 bg-orange-50/20 shadow-sm"
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
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.leadLimitType === option.id ? "border-orange-500 border-[6px]" : "border-gray-300"
                                    }`}>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-tight ${formData.leadLimitType === option.id ? "text-orange-700" : "text-gray-500"}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {formData.leadLimitType === "Limited" && (
                        <div className="animate-fadeIn space-y-1.5 mt-4 max-w-xs">
                            <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">New Leads Per Day</label>
                            <input
                                type="number"
                                placeholder="Enter limit (e.g. 100)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-sm font-semibold"
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
                            <Users size={16} className="text-orange-500" />
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Select Audience</h3>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-sm border border-gray-200">
                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "Team", selectedAudiences: [] })}
                                className={`flex items-center gap-2 px-6 py-1.5 rounded-sm text-xs font-black uppercase tracking-tight transition-all ${formData.audienceType === "Team" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <Users size={14} />
                                Team
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, audienceType: "Individual", selectedAudiences: [] })}
                                className={`flex items-center gap-2 px-6 py-1.5 rounded-sm text-xs font-black uppercase tracking-tight transition-all ${formData.audienceType === "Individual" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <User size={14} />
                                Individual
                            </button>
                        </div>
                    </div>

                    {/* Selection List */}
                    <div className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-inner shadow-gray-50">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Search ${formData.audienceType === "Team" ? "teams" : "employees"}...`}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-xs font-semibold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSelectAllAudiences}
                                className="text-[10px] font-black text-orange-600 hover:text-orange-700 px-4 py-2 rounded-sm bg-white border border-orange-100 hover:border-orange-200 transition-all uppercase tracking-widest shadow-sm"
                            >
                                {formData.selectedAudiences.length > 0 && formData.selectedAudiences.length === (formData.audienceType === "Team" ? filteredTeams.length : filteredEmployees.length)
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-3">
                            {formData.audienceType === "Team" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {isLoadingTeams ? (
                                        <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            Loading teams...
                                        </div>
                                    ) : filteredTeams.length > 0 ? (
                                        filteredTeams.map((team) => (
                                            <div
                                                key={team.id}
                                                onClick={() => handleAudienceToggle(team.id)}
                                                className={`flex items-center justify-between p-4 border rounded-sm transition-all cursor-pointer group ${formData.selectedAudiences.includes(team.id)
                                                    ? "bg-orange-50 border-orange-500 shadow-sm"
                                                    : "bg-white border-gray-100 hover:border-orange-200 hover:bg-gray-50/50 shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm font-black shadow-sm ${formData.selectedAudiences.includes(team.id)
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                                        }`}>
                                                        {team.team_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-black uppercase tracking-tight ${formData.selectedAudiences.includes(team.id) ? "text-orange-900" : "text-gray-700"}`}>
                                                            {team.team_name}
                                                        </p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{team.total_members || 0} Members</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.selectedAudiences.includes(team.id)
                                                    ? "bg-[#22C55E] border-[#22C55E]"
                                                    : "border-gray-200"
                                                    }`}>
                                                    {formData.selectedAudiences.includes(team.id) && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No teams found</div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {isLoadingEmployees ? (
                                        <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            Loading employees...
                                        </div>
                                    ) : filteredEmployees.length > 0 ? (
                                        filteredEmployees.map((emp) => (
                                            <div
                                                key={emp.id}
                                                onClick={() => handleAudienceToggle(emp.id)}
                                                className={`flex items-center justify-between p-4 border rounded-sm transition-all cursor-pointer group ${formData.selectedAudiences.includes(emp.id)
                                                    ? "bg-orange-50 border-orange-500 shadow-sm"
                                                    : "bg-white border-gray-100 hover:border-orange-200 hover:bg-gray-50/50 shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xs font-black overflow-hidden shadow-sm ${formData.selectedAudiences.includes(emp.id)
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {emp.profile_picture ? (
                                                            <img src={emp.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            emp.employee_name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-black uppercase tracking-tight ${formData.selectedAudiences.includes(emp.id) ? "text-orange-900" : "text-gray-700"}`}>
                                                            {emp.employee_name}
                                                        </p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[100px]">{emp.designation_name || "Employee"}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.selectedAudiences.includes(emp.id)
                                                    ? "bg-[#22C55E] border-[#22C55E]"
                                                    : "border-gray-200"
                                                    }`}>
                                                    {formData.selectedAudiences.includes(emp.id) && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No employees found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {formData.selectedAudiences.length > 0 && (
                            <div className="p-3 bg-orange-500 border-t border-orange-600 flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-white" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{formData.selectedAudiences.length} Selected Audiences</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Hierarchy Config Section */}
                {formData.audienceType === "Team" && formData.selectedAudiences.length > 0 && (
                    <div className="space-y-6 animate-fadeIn pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <ChevronRight className="text-orange-500 rotate-90" size={18} />
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Team Flow Matrix Configuration</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-10">
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
