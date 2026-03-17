import React, { useState } from "react";
import {
    Target,
    Plus,
    TrendingUp,
    Award,
    Calendar,
    Phone,
    DollarSign,
    Users,
    CheckCircle2,
    Clock,
    Trash2,
    ArrowRight,
    ChevronRight,
    Flame,
    Zap,
    Star,
    ArrowUpRight,
    Home,
    X,
    PlusIcon,
    Save,
    RefreshCw,
    Edit2,
    Edit,
    List,
    LayoutGrid,
    AlertTriangle,
    Activity,
    BarChart2,
    Eye,
    ChevronRight as ChevronRightIcon,
} from "lucide-react";
import {
    useGetGoalsQuery,
    useCreateGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
} from "../../store/api/goalApi";
import ActionGuard from "../../components/common/ActionGuard";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetTeamsQuery } from "../../store/api/teamApi";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import NumberCard from "../../components/NumberCard";

const EMPTY_FORM = {
    goal_title: "",
    employee_ids: [],
    team_ids: [],
    goal_type: "calls",
    target_value: "",
    period: "monthly",
    reward: "",
    description: "",
    priority: "medium",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
};

const getMetricIcon = (type) => {
    switch (type) {
        case "calls": return <Phone className="text-blue-500" size={16} />;
        case "revenue": return <DollarSign className="text-green-500" size={16} />;
        case "meetings": return <Users className="text-purple-500" size={16} />;
        case "leads": return <Plus className="text-orange-500" size={16} />;
        case "deals_won": return <Award className="text-yellow-600" size={16} />;
        case "followups": return <RefreshCw className="text-indigo-500" size={16} />;
        case "proposals": return <ArrowUpRight className="text-cyan-500" size={16} />;
        case "demos": return <Zap className="text-pink-500" size={16} />;
        default: return <Target className="text-orange-500" size={16} />;
    }
};

const getStatusInfo = (pct) => {
    if (pct >= 100) return { label: "Completed", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: <CheckCircle2 size={12} /> };
    if (pct >= 40) return { label: "On Track", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: <Flame size={12} /> };
    return { label: "Behind", color: "text-red-500", bg: "bg-red-50 border-red-200", icon: <Clock size={12} /> };
};

const getPriorityStyle = (p) => {
    if (p === 'high') return 'bg-red-50 text-red-600';
    if (p === 'medium') return 'bg-blue-50 text-blue-600';
    return 'bg-gray-50 text-gray-400';
};

/* ─── Progress Timeline Modal ─── */
const ProgressTimelineModal = ({ goal, assignee, onClose }) => {
    const status = getStatusInfo(goal.progress_percentage);
    const startDate = new Date(goal.start_date);
    const endDate = new Date(goal.end_date);
    const today = new Date();
    const totalDays = Math.max(1, Math.round((endDate - startDate) / 86400000));
    const elapsedDays = Math.min(totalDays, Math.max(0, Math.round((today - startDate) / 86400000)));
    const timeProgress = Math.round((elapsedDays / totalDays) * 100);

    // Build synthetic timeline checkpoints
    const checkpoints = [
        {
            label: "Goal Created",
            date: startDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            done: true,
            color: "bg-green-500",
            icon: <Target size={12} className="text-white" />,
        },
        {
            label: "25% Milestone",
            date: `Target: ${Math.round(goal.target_value * 0.25)} ${goal.goal_type}`,
            done: goal.progress_percentage >= 25,
            color: goal.progress_percentage >= 25 ? "bg-green-500" : "bg-gray-200",
            icon: <BarChart2 size={12} className="text-white" />,
        },
        {
            label: "50% Milestone",
            date: `Target: ${Math.round(goal.target_value * 0.5)} ${goal.goal_type}`,
            done: goal.progress_percentage >= 50,
            color: goal.progress_percentage >= 50 ? "bg-orange-500" : "bg-gray-200",
            icon: <Activity size={12} className="text-white" />,
        },
        {
            label: "75% Milestone",
            date: `Target: ${Math.round(goal.target_value * 0.75)} ${goal.goal_type}`,
            done: goal.progress_percentage >= 75,
            color: goal.progress_percentage >= 75 ? "bg-orange-500" : "bg-gray-200",
            icon: <TrendingUp size={12} className="text-white" />,
        },
        {
            label: "Goal Deadline",
            date: endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            done: goal.progress_percentage >= 100,
            color: goal.progress_percentage >= 100 ? "bg-green-500" : today > endDate ? "bg-red-500" : "bg-gray-200",
            icon: <CheckCircle2 size={12} className="text-white" />,
        },
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden font-primary text-left" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-sm">
                            <Activity size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Progress Timeline</h2>
                            <p className="text-[13px] text-orange-100 font-semibold">{goal.goal_title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Status Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-sm border border-slate-200 p-3 text-center">
                            <span className="text-[13px] font-semibold text-orange-400 block mb-1">Current</span>
                            <span className="text-xl font-bold text-gray-800 font-primary">{Math.round(goal.current_value)}</span>
                            <span className="text-[12px] text-gray-400 block font-semibold capitalize">{goal.goal_type}</span>
                        </div>
                        <div className="bg-slate-50 rounded-sm border border-slate-200 p-3 text-center">
                            <span className="text-[13px] font-semibold text-orange-400 block mb-1">Target</span>
                            <span className="text-xl font-bold text-gray-800 font-primary">{goal.target_value}</span>
                            <span className="text-[12px] text-gray-400 block font-semibold capitalize">{goal.goal_type}</span>
                        </div>
                        <div className="bg-slate-50 rounded-sm border border-slate-200 p-3 text-center">
                            <span className="text-[13px] font-semibold text-orange-400 block mb-1">Achieved</span>
                            <span className={`text-xl font-bold font-primary ${goal.progress_percentage >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{goal.progress_percentage}%</span>
                            <span className={`text-[12px] block font-semibold ${status.color}`}>{status.label}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <span className="text-[13px] font-semibold text-orange-400 capitalize">Goal Progress</span>
                            <span className="text-[13px] font-semibold text-gray-500">{goal.progress_percentage}% of target</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${goal.progress_percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : goal.progress_percentage >= 50 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                                style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Time Progress */}
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <span className="text-[13px] font-semibold text-orange-400 capitalize">Time Elapsed</span>
                            <span className="text-[13px] font-semibold text-gray-500">{elapsedDays} / {totalDays} days</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000"
                                style={{ width: `${Math.min(timeProgress, 100)}%` }}
                            />
                        </div>
                        {goal.progress_percentage < timeProgress && (
                            <p className="text-[12px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                                <AlertTriangle size={12} /> Progress is behind schedule by {timeProgress - goal.progress_percentage}%
                            </p>
                        )}
                    </div>

                    {/* Timeline */}
                    <div>
                        <span className="text-[13px] font-semibold text-orange-400 capitalize block mb-3">Milestone Timeline</span>
                        <div className="relative">
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
                            <div className="space-y-4">
                                {checkpoints.map((cp, i) => (
                                    <div key={i} className="flex items-start gap-3 relative">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${cp.color} shadow-sm`}>
                                            {cp.icon}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <span className={`text-sm font-semibold font-primary ${cp.done ? 'text-gray-800' : 'text-gray-400'}`}>{cp.label}</span>
                                            <p className={`text-[13px] font-semibold mt-0.5 ${cp.done ? 'text-orange-400' : 'text-gray-300'}`}>{cp.date}</p>
                                        </div>
                                        {cp.done && <CheckCircle2 size={15} className="text-green-500 mt-1 flex-shrink-0" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Assignee */}
                    {assignee && (
                        <div className="flex items-center gap-3 bg-slate-50 rounded-sm border border-slate-200 px-4 py-3">
                            <div className="w-9 h-9 rounded-full border-2 border-orange-100 bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0">
                                {assignee.profile_picture_url ? (
                                    <img src={assignee.profile_picture_url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    (assignee.employee_name || assignee.team_name)?.charAt(0)
                                )}
                            </div>
                            <div>
                                <span className="text-[13px] font-semibold text-orange-400 block">Assigned To</span>
                                <span className="text-sm font-semibold text-gray-800 font-primary capitalize">
                                    {assignee.employee_name || assignee.team_name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Delete Confirmation Modal ─── */
const DeleteConfirmModal = ({ goal, onConfirm, onCancel, isDeleting }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onCancel}>
        <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm overflow-hidden font-primary" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Goal</h3>
                <p className="text-sm font-semibold text-gray-500 mb-1">Are you sure you want to delete</p>
                <p className="text-sm font-bold text-gray-800 mb-5">"{goal?.goal_title}"?</p>
                <p className="text-[11px] text-red-400 font-semibold mb-6 flex items-center justify-center gap-1.5 bg-red-50 border border-red-100 rounded-sm px-3 py-2">
                    <AlertTriangle size={12} /> This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-sm font-semibold text-sm hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-sm font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);

/* ─── Goal Form Modal (Create / Edit) ─── */
const GoalFormModal = ({ initialData, onClose, onSubmit, isSubmitting, employees, teams, title }) => {
    const [assignTab, setAssignTab] = useState(
        initialData?.team_id ? "team" : initialData?.employee_id ? "individual" : "personal"
    );
    const [formData, setFormData] = useState({
        ...EMPTY_FORM,
        ...initialData,
        employee_ids: initialData?.employee_id ? [initialData.employee_id] : [],
        team_ids: initialData?.team_id ? [initialData.team_id] : [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.goal_title || !formData.target_value) { toast.error("Please fill all required fields"); return; }
        if (assignTab === 'team' && formData.team_ids.length === 0) { toast.error("Please select at least one team"); return; }
        if (assignTab === 'individual' && formData.employee_ids.length === 0) { toast.error("Please select at least one employee"); return; }
        onSubmit({ ...formData, assignTab });
    };

    const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-semibold bg-white appearance-none cursor-pointer";
    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-semibold bg-white placeholder-gray-400";
    const labelClass = "flex items-center gap-2 text-sm font-bold text-gray-700 capitalize";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl overflow-hidden font-primary text-left">
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-50 rounded-t-sm shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2.5 rounded-sm">
                            <Target size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <p className="text-xs text-orange-100 font-semibold opacity-90">Define targets to track and improve performance</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 transition-all rounded-full"><X size={22} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Goal Title <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="e.g. Monthly Call Target" className={inputClass}
                            value={formData.goal_title} onChange={(e) => setFormData({ ...formData, goal_title: e.target.value })} />
                    </div>

                    {/* Assign To Tabs */}
                    <div className="space-y-3">
                        <label className={labelClass}>Assign Target To</label>
                        <div className="flex p-1 bg-gray-100 rounded-sm">
                            {["personal", "team", "individual"].map(tab => (
                                <button key={tab} type="button"
                                    onClick={() => { setAssignTab(tab); setFormData({ ...formData, employee_id: "", team_id: "" }); }}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${assignTab === tab ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {tab === "individual" ? "Employee" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {assignTab === 'personal' && (
                            <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-sm font-bold text-xs border border-blue-100 flex items-center gap-2">
                                <Zap size={14} /> This goal will be assigned to you.
                            </div>
                        )}

                        {assignTab === 'team' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Choose Teams</span>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="hidden"
                                            onChange={(e) => setFormData({ ...formData, team_ids: e.target.checked ? teams.map(t => t.id) : [] })}
                                            checked={formData.team_ids.length === teams.length && teams.length > 0} />
                                        <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all ${formData.team_ids.length === teams.length ? 'bg-orange-500 border-orange-500' : 'border-gray-200 group-hover:border-orange-200'}`}>
                                            {formData.team_ids.length === teams.length && <CheckCircle2 className="text-white" size={12} />}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">Select All</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar p-1">
                                    {teams.map(team => (
                                        <div key={team.id} onClick={() => {
                                            const exists = formData.team_ids.includes(team.id);
                                            setFormData({ ...formData, team_ids: exists ? formData.team_ids.filter(id => id !== team.id) : [...formData.team_ids, team.id] });
                                        }} className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center gap-3 ${formData.team_ids.includes(team.id) ? 'bg-orange-50 border-orange-500 shadow-sm' : 'bg-white border-gray-200 hover:border-orange-300'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${formData.team_ids.includes(team.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}><Users size={12} /></div>
                                            <span className="text-xs font-bold text-gray-700 truncate">{team.team_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {assignTab === 'individual' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Choose Employees</span>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="hidden"
                                            onChange={(e) => setFormData({ ...formData, employee_ids: e.target.checked ? employees.map(emp => emp.id) : [] })}
                                            checked={formData.employee_ids.length === employees.length && employees.length > 0} />
                                        <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all ${formData.employee_ids.length === employees.length ? 'bg-orange-500 border-orange-500' : 'border-gray-200 group-hover:border-orange-200'}`}>
                                            {formData.employee_ids.length === employees.length && <CheckCircle2 className="text-white" size={12} />}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">Select All</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                                    {employees.map(emp => (
                                        <div key={emp.id} onClick={() => {
                                            const exists = formData.employee_ids.includes(emp.id);
                                            setFormData({ ...formData, employee_ids: exists ? formData.employee_ids.filter(id => id !== emp.id) : [...formData.employee_ids, emp.id] });
                                        }} className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center gap-3 ${formData.employee_ids.includes(emp.id) ? 'bg-orange-50 border-orange-500 shadow-sm' : 'bg-white border-gray-200 hover:border-orange-300'}`}>
                                            <div className={`w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center font-bold text-[10px] uppercase transition-colors ${formData.employee_ids.includes(emp.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                {emp.profile_picture_url ? <img src={emp.profile_picture_url} alt="" className="w-full h-full object-cover" /> : emp.employee_name?.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 truncate">{emp.employee_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Goal Type */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Goal Type</label>
                        <div className="relative">
                            <select className={selectClass} value={formData.goal_type} onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}>
                                <option value="calls">Connected Calls</option>
                                <option value="revenue">Revenue Goal</option>
                                <option value="deals_won">Deals Closed/Won</option>
                                <option value="meetings">Meetings Booked</option>
                                <option value="leads">New Leads Added</option>
                                <option value="followups">Follow-up Goals</option>
                                <option value="proposals">Proposals Sent</option>
                                <option value="demos">Demos Conducted</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRight className="rotate-90 text-gray-400" size={16} /></div>
                        </div>
                    </div>

                    {/* Target Value */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Target Value <span className="text-red-500">*</span></label>
                        <input required type="number" placeholder="e.g. 100" className={inputClass}
                            value={formData.target_value} onChange={(e) => setFormData({ ...formData, target_value: e.target.value })} />
                    </div>

                    {/* Periodicity + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Periodicity</label>
                            <div className="relative">
                                <select className={selectClass} value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })}>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRight className="rotate-90 text-gray-400" size={16} /></div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Priority</label>
                            <div className="relative">
                                <select className={selectClass} value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRight className="rotate-90 text-gray-400" size={16} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Start Date</label>
                            <input required type="date" className={inputClass} value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>End Date</label>
                            <input required type="date" className={inputClass} value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                        </div>
                    </div>

                    {/* Reward */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Reward / Incentive</label>
                        <input type="text" placeholder="e.g. ₹500 Bonus + Early Friday" className={inputClass}
                            value={formData.reward} onChange={(e) => setFormData({ ...formData, reward: e.target.value })} />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Description / Notes</label>
                        <textarea rows="2" placeholder="Add any specific context or instructions..." className={`${inputClass} resize-none`}
                            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 rounded-sm font-bold text-xs tracking-widest uppercase hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold text-xs tracking-widest uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                            {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                            {isSubmitting ? "Saving..." : "Save Goal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── Goal Detail Modal ─── */
const GoalDetailModal = ({ goal, assignee, onClose, onEdit, onTimeline }) => {
    const status = getStatusInfo(goal.progress_percentage);
    const assigneeLabel = goal.employee_id
        ? (assignee?.employee_name || 'Employee')
        : goal.team_id
            ? (assignee?.team_name || 'Team')
            : 'Self Assigned';
    const assigneeType = goal.employee_id ? 'Employee' : goal.team_id ? 'Team' : 'Personal';

    const rows = [
        { label: 'Goal Title', value: goal.goal_title },
        { label: 'Goal Type', value: goal.goal_type?.replace(/_/g, ' ') },
        { label: 'Assigned To', value: `${assigneeType}: ${assigneeLabel}` },
        { label: 'Period', value: goal.period },
        { label: 'Priority', value: goal.priority },
        { label: 'Target', value: `${goal.target_value} ${goal.goal_type}` },
        { label: 'Current', value: `${Math.round(goal.current_value)} ${goal.goal_type}` },
        { label: 'Start Date', value: new Date(goal.start_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) },
        { label: 'End Date', value: new Date(goal.end_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) },
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden font-primary text-left" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-sm">
                            <Target size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Goal Details</h2>
                            <p className="text-[13px] text-orange-100 font-semibold capitalize">{goal.goal_title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-all"><X size={20} /></button>
                </div>

                <div className="p-5">
                    {/* Progress Visual */}
                    <div className="mb-4 bg-slate-50 rounded-sm border border-slate-200 px-4 py-3">
                        <div className="flex items-end justify-between mb-2">
                            <div>
                                <span className="text-[13px] font-semibold text-orange-400 block mb-0.5">Progress</span>
                                <span className="text-2xl font-bold text-gray-800 font-primary tabular-nums">{Math.round(goal.current_value)}</span>
                                <span className="text-gray-400 font-semibold text-sm ml-1">/ {goal.target_value} <span className="capitalize">{goal.goal_type}</span></span>
                            </div>
                            <div className="text-right">
                                <div className={`text-2xl font-bold font-primary ${goal.progress_percentage >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{goal.progress_percentage}%</div>
                                <button onClick={onTimeline} className={`inline-flex items-center gap-1 text-[12px] font-semibold capitalize px-2.5 py-1 rounded-sm border mt-1 cursor-pointer transition-all hover:shadow-sm ${status.bg} ${status.color}`}>
                                    {status.icon} {status.label}
                                </button>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <div className={`h-full rounded-full transition-all ${goal.progress_percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : goal.progress_percentage >= 50 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                                style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }} />
                        </div>
                    </div>

                    {/* Details Table */}
                    <div className="rounded-sm border border-gray-200 overflow-hidden">
                        {rows.map((row, i) => (
                            <div key={i} className={`flex items-center px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                                <span className="text-[13px] font-semibold text-orange-400 capitalize w-28 flex-shrink-0">{row.label}</span>
                                <span className="text-sm font-semibold text-gray-800 font-primary capitalize">{row.value || '—'}</span>
                            </div>
                        ))}
                    </div>

                    {/* Reward */}
                    {goal.reward && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-3 bg-yellow-50 border border-yellow-100 rounded-sm">
                            <div className="p-1 bg-yellow-100 text-yellow-700 rounded-sm flex-shrink-0"><Award size={15} /></div>
                            <div>
                                <span className="text-[13px] font-semibold text-orange-400 block">Target Incentive</span>
                                <p className="text-sm font-semibold text-gray-800 font-primary">{goal.reward}</p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {goal.description && (
                        <div className="mt-3 px-3 py-3 bg-slate-50 border border-slate-200 rounded-sm">
                            <span className="text-[13px] font-semibold text-orange-400 block mb-1">Description</span>
                            <p className="text-sm font-semibold text-gray-600 italic">{goal.description}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                        <button onClick={onTimeline} className="flex-1 py-3 flex items-center justify-center gap-1.5 border border-orange-200 bg-orange-50 text-orange-600 rounded-sm text-[13px] font-semibold hover:bg-orange-100 transition-all">
                            <Activity size={15} /> View Timeline
                        </button>
                        <ActionGuard permission="goal_edit" module="Goal Management" type="update">
                            <button onClick={onEdit} className="flex-1 py-3 flex items-center justify-center gap-1.5 border border-blue-200 bg-blue-50 text-blue-600 rounded-sm text-[13px] font-semibold hover:bg-blue-100 transition-all">
                                <Edit2 size={15} /> Edit Goal
                            </button>
                        </ActionGuard>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Component ─── */
const GoalSetting = () => {
    const [view, setView] = useState("grid"); // grid | list
    const [showAddModal, setShowAddModal] = useState(false);
    const [editGoal, setEditGoal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [timelineGoal, setTimelineGoal] = useState(null);
    const [viewGoal, setViewGoal] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: goals, isLoading } = useGetGoalsQuery();
    const { data: employeesRes } = useGetEmployeesQuery({ limit: 1000 });
    const employees = employeesRes?.employees || [];
    const { data: teamsRes } = useGetTeamsQuery({ limit: 1000 });
    const teams = teamsRes?.teams || [];
    const [createGoal, { isLoading: creating }] = useCreateGoalMutation();
    const [updateGoal, { isLoading: updating }] = useUpdateGoalMutation();
    const [deleteGoal] = useDeleteGoalMutation();

    const getAssignee = (goal) => goal.employee_id
        ? employees.find(e => e.id === goal.employee_id)
        : teams.find(t => t.id === goal.team_id);

    const handleCreate = async (formData) => {
        try {
            await createGoal(formData).unwrap();
            toast.success("Goal created successfully");
            setShowAddModal(false);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create goal");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateGoal({ id: editGoal.id, ...formData }).unwrap();
            toast.success("Goal updated successfully");
            setEditGoal(null);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update goal");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteGoal(deleteTarget.id).unwrap();
            toast.success("Goal deleted successfully");
            setDeleteTarget(null);
        } catch (err) {
            toast.error("Failed to delete goal");
        } finally {
            setIsDeleting(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('data:') || path.startsWith('http')) return path;
        const base = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace('/api/', '');
        return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    /* ─── Single Goal Card (Grid View) ─── */
    const GoalCard = ({ goal }) => {
        const assignee = getAssignee(goal);
        const status = getStatusInfo(goal.progress_percentage);

        return (
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden relative group hover:border-orange-300 transition-all duration-300 flex flex-col">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                            {goal.employee_id ? (
                                <div className="w-11 h-11 rounded-full border-2 border-orange-100 flex items-center justify-center text-sm font-bold bg-gray-50 text-orange-600 overflow-hidden shadow-sm flex-shrink-0">
                                    {assignee?.profile_picture_url ? (
                                        <img src={getImageUrl(assignee.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        assignee?.employee_name?.charAt(0) || <Users size={18} />
                                    )}
                                </div>
                            ) : goal.team_id ? (
                                <div className="w-11 h-11 rounded-full border-2 border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Users size={20} />
                                </div>
                            ) : (
                                <div className="w-11 h-11 rounded-full border-2 border-orange-100 bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Star size={20} />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-semibold text-gray-800 line-clamp-1 font-primary">{goal.goal_title}</h3>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <span className="text-[12px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-sm capitalize">{goal.period}</span>
                                    {goal.priority && (
                                        <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-sm capitalize ${getPriorityStyle(goal.priority)}`}>{goal.priority}</span>
                                    )}
                                </div>
                                <p className="text-[12px] font-semibold text-orange-400 mt-0.5 capitalize">
                                    {goal.employee_id ? `Employee: ${assignee?.employee_name}` : goal.team_id ? `Team: ${assignee?.team_name}` : 'Self Assigned'}
                                </p>
                            </div>
                        </div>
                        {/* Action Buttons - AllDepartment style */}
                        <div className="flex items-center gap-3 flex-shrink-0 pr-1 opacity-0 group-hover:opacity-100 transition-all">
                            <ActionGuard permission="goal_read" module="Goal Management" type="read">
                                <button onClick={() => setViewGoal(goal)} className="text-blue-500 hover:scale-110 transition-transform active:scale-90" title="View Details">
                                    <Eye size={18} strokeWidth={2} />
                                </button>
                            </ActionGuard>
                            <ActionGuard permission="goal_edit" module="Goal Management" type="update">
                                <button onClick={() => setEditGoal(goal)} className="text-[#22C55E] hover:scale-110 transition-transform active:scale-90" title="Edit Goal">
                                    <Edit size={18} strokeWidth={2} />
                                </button>
                            </ActionGuard>
                            <ActionGuard permission="goal_delete" module="Goal Management" type="delete">
                                <button onClick={() => setDeleteTarget(goal)} className="text-red-500 hover:scale-110 transition-transform active:scale-90" title="Delete Goal">
                                    <Trash2 size={18} strokeWidth={2} />
                                </button>
                            </ActionGuard>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <span className="text-[12px] font-semibold text-orange-400 capitalize block mb-0.5">Progress Status</span>
                            <span className="text-2xl font-bold text-gray-800 tabular-nums font-primary">{Math.round(goal.current_value)}</span>
                            <span className="text-gray-400 font-semibold text-sm ml-1">/ {goal.target_value} <span className="capitalize">{goal.goal_type}</span></span>
                        </div>
                        <div className="text-right">
                            <div className={`text-xl font-bold font-primary ${goal.progress_percentage >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{goal.progress_percentage}%</div>
                            <span className="text-[12px] font-semibold text-orange-400 capitalize">Achieved</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${goal.progress_percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : goal.progress_percentage >= 50 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                            style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                        />
                    </div>

                    {/* Reward */}
                    {goal.reward && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-yellow-50/50 border border-yellow-100 rounded-sm">
                            <div className="p-1 bg-yellow-100 text-yellow-700 rounded-sm"><Award size={14} /></div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[12px] font-semibold text-orange-400 capitalize block">Target Incentive</span>
                                <p className="text-[13px] font-semibold text-gray-700 line-clamp-1 font-primary">{goal.reward}</p>
                            </div>
                        </div>
                    )}

                    {goal.description && (
                        <p className="mt-3 text-[12px] font-semibold text-gray-400 italic line-clamp-2">{goal.description}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50/90 px-5 py-3 border-t border-gray-200 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 capitalize">
                        <Clock size={13} /> Ends {new Date(goal.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <button
                        onClick={() => setTimelineGoal(goal)}
                        className={`flex items-center gap-1 text-[12px] font-semibold capitalize px-2.5 py-1 rounded-sm border transition-all hover:shadow-sm ${status.bg} ${status.color}`}
                    >
                        {status.icon} {status.label}
                    </button>
                </div>
            </div>
        );
    };

    /* ─── Table Row (List View) ─── */
    const GoalTableRow = ({ goal }) => {
        const assignee = getAssignee(goal);
        const status = getStatusInfo(goal.progress_percentage);
        const assigneeLabel = goal.employee_id
            ? (assignee?.employee_name || 'Employee')
            : goal.team_id
                ? (assignee?.team_name || 'Team')
                : 'Self Assigned';

        return (
            <tr className="border-t hover:bg-gray-50 transition-colors group">
                {/* Assign To */}
                <td className="py-3.5 px-4 text-left">
                    <div className="flex items-center gap-3">
                        {goal.employee_id ? (
                            <div className="w-9 h-9 rounded-full border border-orange-100 flex items-center justify-center text-sm font-bold bg-gray-50 text-orange-600 overflow-hidden flex-shrink-0">
                                {assignee?.profile_picture_url ? <img src={getImageUrl(assignee.profile_picture_url)} className="w-full h-full object-cover" alt="" /> : assignee?.employee_name?.charAt(0) || <Users size={15} />}
                            </div>
                        ) : goal.team_id ? (
                            <div className="w-9 h-9 rounded-full border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><Users size={15} /></div>
                        ) : (
                            <div className="w-9 h-9 rounded-full border border-orange-100 bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0"><Star size={15} /></div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 font-primary capitalize truncate">{goal.goal_title}</p>
                            <p className="text-[13px] font-semibold text-orange-400 capitalize">{assigneeLabel}</p>
                        </div>
                    </div>
                </td>
                {/* Type */}
                <td className="py-3.5 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                        {getMetricIcon(goal.goal_type)}
                        <span className="text-[13px] font-semibold text-gray-700 capitalize">{goal.goal_type?.replace(/_/g, ' ')}</span>
                    </div>
                </td>
                {/* Period + Priority — inline badges */}
                <td className="py-3.5 px-4 text-left">
                    <div className="flex items-center gap-1.5 flex-nowrap">
                        <span className="text-[12px] font-semibold px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-sm capitalize whitespace-nowrap">{goal.period}</span>
                        {goal.priority && <span className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-sm capitalize ${getPriorityStyle(goal.priority)}`}>{goal.priority}</span>}
                    </div>
                </td>
                {/* Progress */}
                <td className="py-3.5 px-4 text-left">
                    <div className="min-w-[140px]">
                        <div className="flex justify-between mb-1">
                            <span className="text-[13px] font-semibold text-gray-700 font-primary">{Math.round(goal.current_value)} / {goal.target_value}</span>
                            <span className={`text-[13px] font-bold ${goal.progress_percentage >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{goal.progress_percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${goal.progress_percentage >= 100 ? 'bg-green-500' : goal.progress_percentage >= 50 ? 'bg-orange-500' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }} />
                        </div>
                    </div>
                </td>
                {/* End Date */}
                <td className="py-3.5 px-4 text-left whitespace-nowrap">
                    <span className="text-[13px] font-semibold text-gray-600 font-primary">{new Date(goal.end_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </td>
                {/* History — clickable badge with arrow */}
                <td className="py-3.5 px-4 text-left">
                    <button
                        onClick={() => setTimelineGoal(goal)}
                        title="View Progress Timeline"
                        className={`inline-flex items-center gap-1 text-[12px] font-semibold capitalize px-3 py-1 rounded-sm border cursor-pointer transition-all hover:shadow-md active:scale-95 ${status.bg} ${status.color}`}
                    >
                        {status.icon} {status.label} <ChevronRightIcon size={11} className="ml-0.5" />
                    </button>
                </td>
                {/* Actions - AllDepartment style */}
                <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-3 pr-2">
                        <ActionGuard permission="goal_read" module="Goal Management" type="read">
                            <button onClick={() => setViewGoal(goal)} className="text-blue-500 hover:scale-110 transition-transform active:scale-90" title="View Details">
                                <Eye size={18} strokeWidth={2} />
                            </button>
                        </ActionGuard>
                        <ActionGuard permission="goal_edit" module="Goal Management" type="update">
                            <button onClick={() => setEditGoal(goal)} className="text-[#22C55E] hover:scale-110 transition-transform active:scale-90" title="Edit Goal">
                                <Edit size={18} strokeWidth={2} />
                            </button>
                        </ActionGuard>
                        <ActionGuard permission="goal_delete" module="Goal Management" type="delete">
                            <button onClick={() => setDeleteTarget(goal)} className="text-red-500 hover:scale-110 transition-transform active:scale-90" title="Delete Goal">
                                <Trash2 size={18} strokeWidth={2} />
                            </button>
                        </ActionGuard>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="min-h-screen bg-white font-primary text-left">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30">
                <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Goal Setting</h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <Home className="text-gray-700" size={14} />
                                <span className="text-gray-400">CRM / </span>
                                <span className="text-[#FF7B1D] font-semibold">Goals</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* View Toggle */}
                            <div className="flex p-1 bg-gray-100 rounded-sm border border-gray-200">
                                <button onClick={() => setView("grid")} className={`p-2 rounded-sm transition-all ${view === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`} title="Grid View">
                                    <LayoutGrid size={16} />
                                </button>
                                <button onClick={() => setView("list")} className={`p-2 rounded-sm transition-all ${view === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`} title="List View">
                                    <List size={16} />
                                </button>
                            </div>
                            <ActionGuard permission="goal_create" module="Goal Management" type="create">
                                <button onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 active:scale-95 text-sm">
                                    <PlusIcon size={18} /> Add New Goal
                                </button>
                            </ActionGuard>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto p-4 pt-0 mt-4">
                {/* Quick Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <NumberCard
                        variant="matrix"
                        title="Active Goals"
                        number={goals?.length || 0}
                        icon={<Zap size={24} />}
                        lineBorderClass="border-blue-500"
                    />
                    <NumberCard
                        variant="matrix"
                        title="Completion Average"
                        number={`${goals?.length ? Math.round(goals.reduce((a, b) => a + b.progress_percentage, 0) / goals.length) : 0}%`}
                        icon={<TrendingUp size={24} />}
                        lineBorderClass="border-green-500"
                    />
                    <NumberCard
                        variant="matrix"
                        title="Achieved This Week"
                        number={"2"}
                        icon={<Award size={24} />}
                        lineBorderClass="border-orange-500"
                    />
                    <NumberCard
                        variant="matrix"
                        title="Call Velocity"
                        number={"42/50"}
                        icon={<Phone size={24} />}
                        lineBorderClass="border-purple-500"
                    />
                </div>

                {/* Goals Section */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">Current Performance Goals</h2>
                        </div>
                        {goals?.length > 0 && (
                            <span className="text-sm font-semibold text-gray-400">{goals.length} goal{goals.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <RefreshCw className="animate-spin text-orange-500" size={40} />
                        </div>
                    ) : goals?.length === 0 ? (
                        <div className="bg-white rounded-sm border border-gray-200 py-20 px-6 text-center shadow-sm">
                            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Target className="text-orange-500" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Goals Initialized</h3>
                            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto font-semibold">High performance teams track their metrics. Start by defining your first performance goal.</p>
                            <ActionGuard permission="goal_create" module="Goal Management" type="create">
                                <button onClick={() => setShowAddModal(true)} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                                    Define Your First Goal
                                </button>
                            </ActionGuard>
                        </div>
                    ) : view === "grid" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                        </div>
                    ) : (
                        /* ── TABLE VIEW ── */
                        <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 whitespace-nowrap">Assing to</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 whitespace-nowrap">Type</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 whitespace-nowrap">Period / Priority</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 whitespace-nowrap">Progress</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 whitespace-nowrap">End Date</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 whitespace-nowrap">History</th>
                                        <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goals.map(goal => <GoalTableRow key={goal.id} goal={goal} />)}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showAddModal && (
                <GoalFormModal
                    title="Add Performance Goal"
                    initialData={EMPTY_FORM}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleCreate}
                    isSubmitting={creating}
                    employees={employees}
                    teams={teams}
                />
            )}

            {/* Edit Modal */}
            {editGoal && (
                <GoalFormModal
                    title="Edit Performance Goal"
                    initialData={editGoal}
                    onClose={() => setEditGoal(null)}
                    onSubmit={handleUpdate}
                    isSubmitting={updating}
                    employees={employees}
                    teams={teams}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <DeleteConfirmModal
                    goal={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={isDeleting}
                />
            )}

            {/* Progress Timeline Modal */}
            {timelineGoal && (
                <ProgressTimelineModal
                    goal={timelineGoal}
                    assignee={getAssignee(timelineGoal)}
                    onClose={() => setTimelineGoal(null)}
                />
            )}

            {/* Goal Detail Modal */}
            {viewGoal && (
                <GoalDetailModal
                    goal={viewGoal}
                    assignee={getAssignee(viewGoal)}
                    onClose={() => setViewGoal(null)}
                    onEdit={() => { setEditGoal(viewGoal); setViewGoal(null); }}
                    onTimeline={() => { setTimelineGoal(viewGoal); setViewGoal(null); }}
                />
            )}
        </div>
    );
};

export default GoalSetting;
