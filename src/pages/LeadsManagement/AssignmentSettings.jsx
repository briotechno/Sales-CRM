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
import { toast } from "react-hot-toast";

export default function AssignmentSettings() {
    const { data: settings, isLoading: settingsLoading } = useGetAssignmentSettingsQuery();
    const [updateSettings, { isLoading: updating }] = useUpdateAssignmentSettingsMutation();
    const { data: logsData, isLoading: logsLoading, refetch: refetchLogs } = useGetAssignmentLogsQuery({ page: 1, limit: 20 });

    const [formData, setFormData] = useState({
        mode: 'manual',
        leads_per_employee_per_day: 10,
        max_active_leads_balance: 5,
        revert_time_hours: 24,
        load_balancing_strategy: 'round_robin',
        priority_handling: true,
        max_call_attempts: 5,
        call_time_gap_minutes: 60,
        auto_disqualification: false,
        reassignment_on_disqualified: false
    });

    useEffect(() => {
        if (settings) {
            setFormData(settings);
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
                                <h2 className="font-bold text-[15px] text-gray-700 capitalize">Assignment Mode</h2>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => setFormData({ ...formData, mode: 'manual' })}
                                        className={`flex-1 group relative p-6 rounded-sm border-2 transition-all ${formData.mode === 'manual' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-sm transition-all ${formData.mode === 'manual' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                                <Users size={32} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className={`text-lg font-bold capitalize tracking-tight ${formData.mode === 'manual' ? 'text-orange-600' : 'text-gray-800'}`}>Manual</h3>
                                                <p className="text-xs font-semibold text-gray-500 capitalize leading-relaxed">Full control over distribution</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            {formData.mode === 'manual' ? <ToggleRight className="text-orange-500" size={28} /> : <ToggleLeft className="text-gray-300" size={28} />}
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setFormData({ ...formData, mode: 'auto' })}
                                        className={`flex-1 group relative p-6 rounded-sm border-2 transition-all ${formData.mode === 'auto' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-sm transition-all ${formData.mode === 'auto' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                                <RefreshCw size={32} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className={`text-lg font-bold capitalize tracking-tight ${formData.mode === 'auto' ? 'text-orange-600' : 'text-gray-800'}`}>Auto</h3>
                                                <p className="text-xs font-semibold text-gray-500 capitalize leading-relaxed">Rule-based automation</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            {formData.mode === 'auto' ? <ToggleRight className="text-orange-500" size={28} /> : <ToggleLeft className="text-gray-300" size={28} />}
                                        </div>
                                    </button>
                                </div>

                                {formData.mode === 'auto' && (
                                    <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-sm flex items-start gap-4">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <AlertCircle className="text-orange-600" size={20} />
                                        </div>
                                        <p className="text-[13px] text-orange-800 font-semibold leading-relaxed capitalize">
                                            System will distribute leads automatically based on active balance and daily limits.
                                            Manual assignment remains available for administrative overrides.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Auto-Assignment Rules */}
                        <div className={`bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden transition-all ${formData.mode !== 'auto' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                <RefreshCw className="text-orange-500" size={20} />
                                <h2 className="font-bold text-[15px] text-gray-700 capitalize">Distribution Rules</h2>
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
                                <h2 className="font-bold text-[15px] text-gray-700 capitalize">Call & Reassignment Rules</h2>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner">
                                        <div>
                                            <h4 className="text-[15px] font-bold text-gray-800 capitalize">Auto Disqualification</h4>
                                            <p className="text-xs text-gray-500 font-medium capitalize mt-1">Mark lead as lost if attempts limit is reached</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, auto_disqualification: !formData.auto_disqualification })}
                                            className={`relative w-14 h-7 transition-all rounded-full flex items-center px-1 shadow-md ${formData.auto_disqualification ? 'bg-orange-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.auto_disqualification ? 'ml-7' : 'ml-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner">
                                        <div>
                                            <h4 className="text-[15px] font-bold text-gray-800 capitalize">Reassign to New Employee</h4>
                                            <p className="text-xs text-gray-500 font-medium capitalize mt-1">Reassign as fresh lead on failure (current preference)</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, reassignment_on_disqualified: !formData.reassignment_on_disqualified })}
                                            className={`relative w-14 h-7 transition-all rounded-full flex items-center px-1 shadow-md ${formData.reassignment_on_disqualified ? 'bg-orange-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.reassignment_on_disqualified ? 'ml-7' : 'ml-0'}`} />
                                        </button>
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
