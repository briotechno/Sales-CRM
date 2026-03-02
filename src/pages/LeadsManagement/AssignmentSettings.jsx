import React, { useState, useEffect } from "react";

import {
    Settings,
    Users,
    RefreshCw,
    ShieldCheck,
    Clock,
    AlertCircle,
    Save,
    History,
    ToggleLeft,
    ToggleRight,
    TrendingUp,
    Target,
    Phone
} from "lucide-react";
import {
    useGetAssignmentSettingsQuery,
    useUpdateAssignmentSettingsMutation,
    useGetAssignmentLogsQuery
} from "../../store/api/leadApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";

export default function AssignmentSettings() {
    const { data: settings, isLoading: settingsLoading } = useGetAssignmentSettingsQuery();
    const [updateSettings, { isLoading: updating }] = useUpdateAssignmentSettingsMutation();
    const { data: logsData, isLoading: logsLoading, refetch: refetchLogs } = useGetAssignmentLogsQuery({ page: 1, limit: 20 });

    const [formData, setFormData] = useState({
        mode: 'auto', // Default to auto
        leads_per_employee_per_day: 10,
        max_active_leads_balance: 5,
        revert_time_hours: 24,
        load_balancing_strategy: 'round_robin',
        priority_handling: true,
        max_call_attempts: 5,
        call_time_gap_minutes: 60,
        reassignment_on_disqualified: false,
        auto_pool_employees: []
    });

    const { data: employeesData } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });
    const employees = employeesData?.employees || [];

    useEffect(() => {
        if (settings) {
            setFormData({
                ...settings,
                auto_pool_employees: settings.auto_pool_employees
                    ? (typeof settings.auto_pool_employees === 'string' ? JSON.parse(settings.auto_pool_employees) : settings.auto_pool_employees)
                    : []
            });
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            await updateSettings(formData).unwrap();
            toast.success("Assignment rules updated successfully!");
        } catch (err) {
            toast.error("Failed to update settings");
        }
    };

    const logs = logsData?.logs || [];

    return (
        <>
            <div className="p-6 max-w-7xl mx-auto space-y-8 font-primary pb-20 text-left">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
                            <Settings size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 capitalize tracking-wide">Assignment Settings</h1>
                            <p className="text-sm text-gray-500 font-medium capitalize">Configure how leads are distributed to your team</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={updating}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 capitalize text-sm tracking-wide"
                    >
                        {updating ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Configurations
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    {/* Main Controls */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mode Selection */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                <ShieldCheck className="text-orange-500" size={20} />
                                <h2 className="font-bold text-[15px] text-gray-700 capitalize">Auto-Assignment Employee Pool</h2>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Assignment Pool Selection */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-gray-700 capitalize flex items-center gap-2">
                                                <Users size={16} className="text-orange-500" />
                                                Select Active Pool Employees
                                            </label>
                                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase">
                                                {formData.auto_pool_employees?.length || 0} Selected
                                            </span>
                                        </div>

                                        <div className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-inner max-h-[350px] overflow-y-auto custom-scrollbar">
                                            {employees.length === 0 ? (
                                                <div className="p-8 text-center text-gray-400 font-medium italic text-sm">
                                                    No active employees found
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-gray-50">
                                                    {employees.map(emp => (
                                                        <label key={emp.id} className="flex items-center gap-3 p-3 hover:bg-orange-50/30 transition-all cursor-pointer group text-left">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded-sm border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                                                checked={formData.auto_pool_employees?.includes(emp.id)}
                                                                onChange={(e) => {
                                                                    const current = Array.isArray(formData.auto_pool_employees) ? [...formData.auto_pool_employees] : [];
                                                                    if (e.target.checked) {
                                                                        setFormData({ ...formData, auto_pool_employees: [...current, emp.id] });
                                                                    } else {
                                                                        setFormData({ ...formData, auto_pool_employees: current.filter(id => id !== emp.id) });
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase border border-gray-200 group-hover:border-orange-200 group-hover:bg-white transition-all overflow-hidden">
                                                                    {emp.profile_picture ? (
                                                                        <img src={emp.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                                                    ) : emp.employee_name?.charAt(0)}
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors capitalize">{emp.employee_name}</p>
                                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{emp.designation_name || emp.role || 'Agent'}</p>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => setFormData({ ...formData, auto_pool_employees: employees.map(e => e.id) })}
                                                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 transition-all uppercase tracking-widest border-b border-orange-200 pb-0.5"
                                            >
                                                Select All
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={() => setFormData({ ...formData, auto_pool_employees: [] })}
                                                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest border-b border-gray-200 pb-0.5"
                                            >
                                                Clear Selection
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selection Info / Preview */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700 capitalize flex items-center gap-2">
                                            <RefreshCw size={16} className="text-orange-500" />
                                            Active Pool Preview
                                        </label>
                                        <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-sm min-h-[100px] max-h-[250px] overflow-x-auto custom-scrollbar flex flex-col">
                                            {formData.auto_pool_employees?.length === 0 ? (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                                        <AlertCircle className="text-orange-300" size={32} />
                                                    </div>
                                                    <p className="text-xs text-orange-400 font-semibold italic capitalize leading-relaxed">
                                                        No employees selected.<br />System will fallback to global pool.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-nowrap gap-3 text-left pb-2">
                                                    {formData.auto_pool_employees.map(id => {
                                                        const emp = employees.find(e => e.id === id);
                                                        if (!emp) return null;
                                                        return (
                                                            <div key={id} className="flex-shrink-0 flex items-center gap-3 bg-white px-4 py-2 rounded-sm border border-orange-200 shadow-sm animate-fadeIn min-w-[150px]">
                                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-200 shadow-inner overflow-hidden">
                                                                    {emp.profile_picture ? <img src={emp.profile_picture_url} className="w-full h-full object-cover" /> : emp.employee_name?.charAt(0)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[12px] font-bold text-gray-800 capitalize leading-none">{emp.employee_name}</span>
                                                                    <span className="text-[9px] text-orange-500 font-extrabold uppercase mt-1 tracking-tighter">{emp.designation_name || 'Agent'}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm text-left">
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                                                <strong className="text-orange-600 font-bold block mb-1 uppercase tracking-tighter not-italic">Distribution Policy:</strong>
                                                Leads will be cyclically distributed among these selected individuals only.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auto-Assignment Rules */}
                        <div className={`bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden transition-all ${formData.mode !== 'auto' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                <RefreshCw className="text-orange-500" size={20} />
                                <h2 className="font-bold text-[15px] text-gray-700 capitalize">Lead Distribution Rules</h2>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                        <TrendingUp size={14} className="text-orange-500" /> Daily lead limit
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.leads_per_employee_per_day}
                                        onChange={(e) => setFormData({ ...formData, leads_per_employee_per_day: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                    />
                                    <p className="text-[11px] text-gray-400 font-medium capitalize">Max leads an employee can receive per 24h</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                        <Target size={14} className="text-orange-500" /> Active balance limit
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_active_leads_balance}
                                        onChange={(e) => setFormData({ ...formData, max_active_leads_balance: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                    />
                                    <p className="text-[11px] text-gray-400 font-medium capitalize">Max simultaneous active leads (not closed/lost)</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                        <Clock size={14} className="text-orange-500" /> Revert time (hours)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.revert_time_hours}
                                        onChange={(e) => setFormData({ ...formData, revert_time_hours: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                    />
                                    <p className="text-[11px] text-gray-400 font-medium capitalize">Uncontacted leads will re-distribute after this time</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                        <RefreshCw size={14} className="text-orange-500" /> Balancing strategy
                                    </label>
                                    <select
                                        value={formData.load_balancing_strategy}
                                        onChange={(e) => setFormData({ ...formData, load_balancing_strategy: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold capitalize appearance-none"
                                    >
                                        <option value="round_robin">Round robin (sequential)</option>
                                        <option value="performance_based" disabled>Performance based (coming soon)</option>
                                    </select>
                                    <p className="text-[11px] text-gray-400 font-medium capitalize">Algorithm used for auto-distribution</p>
                                </div>

                                <div className="md:col-span-2 flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner">
                                    <div>
                                        <h4 className="text-[15px] font-bold text-gray-800 capitalize">Priority handling</h4>
                                        <p className="text-xs text-gray-500 font-medium capitalize mt-1">Trending leads will be assigned with higher priority</p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, priority_handling: !formData.priority_handling })}
                                        className={`relative w-14 h-7 transition-all rounded-full flex items-center px-1 shadow-md ${formData.priority_handling ? 'bg-orange-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.priority_handling ? 'ml-7' : 'ml-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Call & Reassignment Rules */}
                        <div className={`bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden transition-all ${formData.mode !== 'auto' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                <Phone className="text-orange-500" size={20} />
                                <h2 className="font-bold text-[15px] text-gray-700 capitalize">Call Attempt & Rotation Rules</h2>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                            <AlertCircle size={14} className="text-orange-500" /> Max call attempts
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_call_attempts}
                                            onChange={(e) => setFormData({ ...formData, max_call_attempts: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                        />
                                        <p className="text-[11px] text-gray-400 font-medium capitalize">Lead will be reassigned after these many failed attempts</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                            <Clock size={14} className="text-orange-500" /> Call time gap (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.call_time_gap_minutes}
                                            onChange={(e) => setFormData({ ...formData, call_time_gap_minutes: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                        />
                                        <p className="text-[11px] text-gray-400 font-medium capitalize">Minimum time between two call attempts</p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Activity Logs Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col h-full min-h-[500px] max-h-[850px]">
                            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <History className="text-orange-500" size={20} />
                                    <h2 className="font-bold text-[15px] text-gray-700 capitalize">Assignment Logs</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        refetchLogs();
                                        toast.success("Logs refreshed successfully!");
                                    }}
                                    disabled={logsLoading}
                                    className="p-2 hover:bg-orange-100 rounded-sm text-orange-600 transition-all disabled:opacity-50 active:scale-90"
                                    title="Refresh logs"
                                >
                                    <RefreshCw size={18} className={logsLoading ? "animate-spin" : ""} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                {logsLoading ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-gray-300 gap-4">
                                        <RefreshCw className="animate-spin text-orange-200" size={40} />
                                        <span className="text-sm font-bold text-gray-400 capitalize">Loading history...</span>
                                    </div>
                                ) : logs.length === 0 ? (
                                    <div className="py-24 text-center flex flex-col items-center gap-5">
                                        <div className="bg-gray-50 p-4 rounded-full">
                                            <History size={48} className="text-gray-200" />
                                        </div>
                                        <p className="text-sm text-gray-400 font-bold capitalize tracking-wide">No recent activity detected</p>
                                    </div>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log.id} className="p-5 border border-gray-100 rounded-sm hover:border-orange-200 hover:bg-orange-50/20 transition-all group shadow-sm bg-white">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className={`px-3 py-1 rounded-sm text-[10px] font-bold capitalize tracking-wide shadow-sm ${log.assignment_type === 'auto' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                    {log.assignment_type} mode
                                                </span>
                                                <span className="text-[11px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-sm border border-gray-100">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <h4 className="text-[13px] font-bold text-gray-800 leading-snug">
                                                Lead <span className="text-orange-600 font-extrabold">{log.lead_name || 'Unidentified'}</span> assigned to <span className="text-gray-900">{log.employee_name || 'System Worker'}</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <p className="text-[10px] text-gray-400 font-bold capitalize bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">
                                                    By {log.assigned_by}
                                                </p>
                                                {log.reason && (
                                                    <p className="text-[10px] text-orange-400 font-bold capitalize bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-50">
                                                        {log.reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
