import React, { useState, useMemo, useEffect } from "react";
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
    CheckCircle2,
    Plus,
    Tag,
    Layers,
    Workflow,
    Activity,
    X,
    Zap,
    TrendingUp,
    FileText
} from "lucide-react";
import Modal from "../common/Modal";
import { useGetLeadsQuery, useCreateCampaignMutation, useUpdateCampaignMutation } from "../../store/api/leadApi";
import { useGetTeamsQuery, useGetTeamByIdQuery } from "../../store/api/teamApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";

const inputStyles =
    "w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

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
                        <p className="text-[13px] font-bold text-gray-800 leading-tight capitalize tracking-tight">{member.employee_name}</p>
                        <p className="text-[10px] font-semibold text-gray-400 capitalize tracking-normal">{member.designation_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm border border-green-100 leading-none capitalize">
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
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 capitalize ml-1">
                        <Activity size={10} className="text-[#FF7B1D]" />
                        Max Balance
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 10"
                        className={inputStyles.replace("py-3", "py-2")}
                        value={settings?.maxBalance || ""}
                        onChange={(e) => onUpdate(member.id, 'maxBalance', e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 capitalize ml-1">
                            <TrendingUp size={10} className="text-[#FF7B1D]" />
                            Daily Limit
                        </label>
                        <input
                            type="number"
                            disabled={settings?.dailyLimitUnlimited}
                            placeholder={settings?.dailyLimitUnlimited ? "∞" : "e.g. 50"}
                            className={`${inputStyles.replace("py-3", "py-2")} ${settings?.dailyLimitUnlimited ? "opacity-50 cursor-not-allowed" : ""}`}
                            value={settings?.dailyLimit || ""}
                            onChange={(e) => onUpdate(member.id, 'dailyLimit', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-1 group cursor-pointer mt-5" onClick={() => onUpdate(member.id, 'dailyLimitUnlimited', !settings?.dailyLimitUnlimited)}>
                        <span className="text-[8px] font-bold text-gray-400 capitalize mb-1">Unlimited</span>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${settings?.dailyLimitUnlimited ? "bg-orange-500" : "bg-gray-200"}`}>
                            <div className={`w-3 h-3 bg-white rounded-full transition-all ${settings?.dailyLimitUnlimited ? "translate-x-4" : "translate-x-0"}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamHierarchyConfig = ({ teamId, hierarchySettings, setHierarchySettings }) => {
    const { data: team, isLoading } = useGetTeamByIdQuery(teamId);

    // Back-end returns team details directly, including .members
    const hierarchy = team?.members || [];

    const updateMemberSetting = (memberId, field, value) => {
        setHierarchySettings(prev => ({
            ...prev,
            [teamId]: {
                ...(prev[teamId] || {}),
                [memberId]: {
                    ...(prev[teamId]?.[memberId] || { maxBalance: 10, dailyLimit: 15, dailyLimitUnlimited: false, isInvestigationOfficer: false }),
                    [field]: value
                }
            }
        }));
    };

    const applyToLevel = (level, field, value) => {
        const levelMembers = hierarchy.filter(h => String(h.level) === String(level));
        setHierarchySettings(prev => {
            const teamSettings = { ...(prev[teamId] || {}) };
            levelMembers.forEach(m => {
                teamSettings[m.id] = {
                    ...(teamSettings[m.id] || { maxBalance: 10, dailyLimit: 15, dailyLimitUnlimited: false, isInvestigationOfficer: false }),
                    [field]: value
                };
            });
            return { ...prev, [teamId]: teamSettings };
        });
    };

    if (isLoading) return <div className="p-10 text-center text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Building Team Flow Matrix...</div>;
    if (!hierarchy || hierarchy.length === 0) return null;

    // Group hierarchy by levels
    const levelsGrouped = hierarchy.reduce((acc, curr) => {
        if (!acc[curr.level]) acc[curr.level] = [];
        acc[curr.level].push(curr);
        return acc;
    }, {});

    return (
        <div className="bg-gray-50/50 border border-gray-100 rounded-sm p-5 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-1.5 rounded-sm shadow-md">
                        <Users size={16} className="text-white" />
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-gray-900 capitalize leading-tight">{team?.team_name} Matrix</h4>
                        <p className="text-[11px] font-semibold text-gray-500 capitalize">Define flow-based lead distribution</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 capitalize italic opacity-90 leading-none">Strategy</span>
                        <span className="text-[11px] font-bold text-gray-800 capitalize">Round Robin</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8 relative">
                {Object.entries(levelsGrouped).sort().map(([level, members], idx, arr) => (
                    <div key={level} className="space-y-4 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#222] text-white px-3 py-1 rounded-sm flex items-center justify-center text-[10px] font-bold shadow-lg shadow-gray-200 uppercase tracking-widest">
                                    L{level}
                                </div>
                                <div className="h-[1px] w-12 bg-gradient-to-r from-gray-200 to-transparent"></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-gray-500 capitalize">Bulk:</span>
                                <button
                                    onClick={() => applyToLevel(level, 'dailyLimitUnlimited', true)}
                                    className="text-[11px] font-bold text-orange-600 hover:bg-orange-50 px-3.5 py-1.5 rounded-sm transition-all border border-orange-200 capitalize bg-white shadow-sm"
                                >
                                    Unlimited All
                                </button>
                                <button
                                    onClick={() => applyToLevel(level, 'isInvestigationOfficer', true)}
                                    className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-3.5 py-1.5 rounded-sm transition-all border border-blue-200 capitalize bg-white shadow-sm"
                                >
                                    Investigation Officer All
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-10">
                                <ChevronRight className="rotate-90 text-gray-800" size={24} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreateCampaignModal = ({ isOpen, onClose, initialData = null }) => {
    const isEditMode = !!initialData;

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

    const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
    const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

    const isLoading = isCreating || isUpdating;

    const { data: teamsData, isLoading: isLoadingTeams } = useGetTeamsQuery({ limit: 1000 });
    const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });

    // Pre-fill data for Edit Mode
    useEffect(() => {
        if (isEditMode && initialData && isOpen) {
            // Basic Info
            setFormData({
                campaignName: initialData.name || "",
                source: initialData.source || "All",
                startDate: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "",
                startTime: initialData.start_time || "",
                endDate: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : "",
                endTime: initialData.end_time || "",
                timingType: initialData.timing_type || "Every Working Day & Working Time",
                leadLimitType: initialData.lead_limit_type || "Unlimited",
                leadsPerDay: initialData.leads_per_day || "",
                audienceType: initialData.audience_type || "Team",
                selectedAudiences: typeof initialData.selected_audiences === 'string'
                    ? JSON.parse(initialData.selected_audiences)
                    : (initialData.selected_audiences || [])
            });

            // Reconstruct Hierarchy Settings
            const savedSettings = typeof initialData.hierarchy_settings === 'string'
                ? JSON.parse(initialData.hierarchy_settings)
                : (initialData.hierarchy_settings || {});
            setHierarchySettings(savedSettings);
        } else if (!isEditMode && isOpen) {
            // Reset for Create Mode
            setFormData({
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
                selectedAudiences: [],
            });
            setHierarchySettings({});
        }
    }, [isEditMode, initialData, isOpen]);

    const teams = useMemo(() => {
        const raw = teamsData?.teams || [];
        return Array.from(new Map(raw.map(t => [t.id, t])).values());
    }, [teamsData]);

    const employees = useMemo(() => {
        const raw = employeesData?.employees || [];
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

    const handleSubmit = async () => {
        if (!formData.campaignName || !formData.startDate || !formData.endDate) {
            toast.error("Please fill all required fields");
            return;
        }

        if (formData.selectedAudiences.length === 0) {
            toast.error("Please select at least one audience");
            return;
        }

        try {
            const payload = {
                ...formData,
                hierarchySettings
            };

            let result;
            if (isEditMode) {
                result = await updateCampaign({
                    id: initialData.id,
                    data: payload
                }).unwrap();
            } else {
                result = await createCampaign(payload).unwrap();
            }

            if (result.success) {
                toast.success(`Campaign ${isEditMode ? 'updated' : 'created'} successfully`);
                onClose();
            }
        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} campaign:`, error);
            toast.error(error.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} campaign`);
        }
    };

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-all font-primary text-xs capitalize disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-md transition-all font-primary text-xs capitalize flex items-center gap-2 shadow-lg disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? <RefreshCw size={18} className="animate-spin" /> : (isEditMode ? <Settings size={18} /> : <Plus size={18} />)}
                {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Campaign" : "Create Campaign")}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Update Campaign" : "Create New Campaign"}
            subtitle={isEditMode ? `Modifying configuration for #${initialData.id}` : "Setup campaign details, timing, and assign audience"}
            icon={<Settings size={24} />}
            maxWidth="max-w-5xl"
            footer={footer}
        >
            <div className="space-y-6 py-2 font-primary">
                {/* Campaign Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                            <Settings size={14} className="text-[#FF7B1D]" />
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Summer Sales 2024"
                            className={inputStyles}
                            value={formData.campaignName}
                            onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                            <Globe size={14} className="text-[#FF7B1D]" />
                            Source <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={inputStyles}
                            value={formData.source}
                            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                        >
                            <option value="All">All Sources</option>
                            <option value="Indiamart">Indiamart</option>
                            <option value="Direct">Direct</option>
                            <option value="Meta">Meta</option>
                            <option value="Justdial">Justdial</option>
                            <option value="Website">Website</option>
                        </select>
                    </div>
                </div>

                {/* Dates & Timing */}
                <div className="space-y-5 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-orange-500" size={18} />
                        <h3 className="text-lg font-bold text-gray-800 capitalize">Schedule & Timing</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                                <Calendar size={14} className="text-[#FF7B1D]" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                className={inputStyles}
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                                <Clock size={14} className="text-[#FF7B1D]" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                className={inputStyles}
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                                <Calendar size={14} className="text-[#FF7B1D]" />
                                End Date
                            </label>
                            <input
                                type="date"
                                className={inputStyles}
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                                <Clock size={14} className="text-[#FF7B1D]" />
                                End Time
                            </label>
                            <input
                                type="time"
                                className={inputStyles}
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="bg-orange-50/50 p-4 rounded-sm border border-orange-100 flex-1">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 capitalize">
                                <Zap size={14} className="text-[#FF7B1D]" />
                                Timing Mode
                            </label>
                            <div className="flex flex-col gap-3">
                                {["Every Working Day & Working Time", "Sunday To Saturday & 24 Hours"].map(type => (
                                    <label key={type} className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            checked={formData.timingType === type}
                                            onChange={() => setFormData(prev => ({ ...prev, timingType: type }))}
                                            className="w-4 h-4 text-[#FF7B1D] accent-[#FF7B1D]"
                                        />
                                        <span className="ml-3 text-[13px] font-semibold text-gray-800 group-hover:text-[#FF7B1D] transition-colors leading-tight">
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="bg-blue-50/30 p-4 rounded-sm border border-blue-100 flex-1">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 capitalize">
                                <Activity size={14} className="text-blue-500" />
                                Lead Limit Type
                            </label>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-6">
                                    {["Unlimited", "Fixed Limit"].map(type => (
                                        <label key={type} className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                checked={formData.leadLimitType === type}
                                                onChange={() => setFormData(prev => ({ ...prev, leadLimitType: type }))}
                                                className="w-4 h-4 text-blue-500 accent-blue-500"
                                            />
                                            <span className="ml-3 text-[13px] font-semibold text-gray-800 group-hover:text-blue-500 transition-colors">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {formData.leadLimitType === "Fixed Limit" && (
                                    <div className="animate-fadeIn">
                                        <input
                                            type="number"
                                            placeholder="Enter max leads per day"
                                            className={inputStyles.replace("py-3", "py-2")}
                                            value={formData.leadsPerDay}
                                            onChange={(e) => setFormData(prev => ({ ...prev, leadsPerDay: e.target.value }))}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audience Selection */}
                <div className="space-y-5 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="text-orange-500" size={18} />
                            <h3 className="text-lg font-bold text-gray-800 capitalize">Select Audience</h3>
                        </div>
                        <div className="flex p-1 bg-gray-100 border border-gray-200 rounded-lg">
                            {["Team", "Individual"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFormData(prev => ({ ...prev, audienceType: type, selectedAudiences: [] }))}
                                    className={`px-6 py-2 rounded-md text-[11px] font-bold capitalize transition-all ${formData.audienceType === type
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col max-h-[450px]">
                        <div className="p-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-orange-500" size={16} />
                                <input
                                    type="text"
                                    placeholder={`Search ${formData.audienceType === "Team" ? "Teams" : "Employees"}...`}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm font-semibold outline-none focus:bg-white focus:border-[#FF7B1D] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSelectAllAudiences}
                                className="px-4 py-2.5 rounded-sm bg-gray-800 text-white text-[11px] font-bold capitalize hover:bg-black transition-all shadow-md active:scale-95"
                            >
                                {formData.selectedAudiences?.length === (formData.audienceType === "Team" ? filteredTeams.length : filteredEmployees.length) ? "Deselect All" : "Select All"}
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-white">
                            {formData.audienceType === "Team" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {isLoadingTeams ? (
                                        <div className="col-span-full py-20 text-center text-xs font-bold text-gray-400 capitalize animate-pulse">
                                            Syncing Teams Database...
                                        </div>
                                    ) : filteredTeams.length > 0 ? (
                                        filteredTeams.map((team) => (
                                            <div
                                                key={team.id}
                                                onClick={() => handleAudienceToggle(team.id)}
                                                className={`flex items-center justify-between p-5 border-2 rounded-sm transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${formData.selectedAudiences.includes(team.id)
                                                    ? "bg-orange-50 border-orange-500 shadow-orange-100"
                                                    : "bg-white border-gray-100 hover:border-orange-200 shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all shadow-inner ${formData.selectedAudiences.includes(team.id)
                                                        ? "bg-orange-500 text-white shadow-orange-300"
                                                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                                        }`}>
                                                        <Users size={24} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-[13px] font-bold capitalize leading-none mb-1.5 ${formData.selectedAudiences.includes(team.id) ? "text-orange-900" : "text-gray-800"}`}>
                                                            {team.team_name}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-semibold text-gray-500 capitalize">{team.total_members || 0} Members</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span className="text-[11px] font-bold text-orange-500 capitalize">Hierarchy 1-4</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${formData.selectedAudiences.includes(team.id)
                                                    ? "bg-[#22C55E] border-[#22C55E] scale-110"
                                                    : "border-gray-200"
                                                    }`}>
                                                    {formData.selectedAudiences.includes(team.id) && <Check size={14} className="text-white" />}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
                                                <Search className="text-gray-300" size={32} />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">No teams matching your search</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {isLoadingEmployees ? (
                                        <div className="col-span-full py-20 text-center text-xs font-bold text-gray-400 capitalize animate-pulse">
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
                                                        <p className={`text-xs font-bold capitalize ${formData.selectedAudiences.includes(emp.id) ? "text-orange-900" : "text-gray-700"}`}>
                                                            {emp.employee_name}
                                                        </p>
                                                        <p className="text-[9px] text-gray-400 font-semibold capitalize truncate max-w-[100px]">{emp.designation_name || "Employee"}</p>
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

                        {formData.selectedAudiences?.length > 0 && (
                            <div className="p-3 bg-orange-500 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-white" />
                                <span className="text-[11px] font-bold text-white capitalize tracking-wide">{formData.selectedAudiences.length} Audiences Selected</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Hierarchy Config Section */}
                {formData.audienceType === "Team" && formData.selectedAudiences?.length > 0 && (
                    <div className="space-y-5 animate-fadeIn pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 transition-transform">
                            <Workflow className="text-orange-500" size={20} />
                            <h3 className="text-lg font-bold text-gray-900 capitalize">Team Flow Matrix Configuration</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {formData.selectedAudiences?.map(teamId => (
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
