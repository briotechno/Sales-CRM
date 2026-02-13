import React, { useState, useEffect } from "react";
import {
    Settings,
    ShieldCheck,
    Clock,
    Save,
    RefreshCw,
    PhoneCall,
    UserX,
    MessageSquare,
    Zap,
    RotateCcw,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import {
    useGetAssignmentSettingsQuery,
    useUpdateAssignmentSettingsMutation
} from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function LeadRulesConfig() {
    const { data: settings, isLoading: settingsLoading } = useGetAssignmentSettingsQuery();
    const [updateSettings, { isLoading: updating }] = useUpdateAssignmentSettingsMutation();

    const [formData, setFormData] = useState({
        max_call_attempts: 5,
        call_time_gap_minutes: 60,
        auto_disqualification: false,
        reassignment_on_disqualified: false,
        // Sync with assignment settings
        mode: 'manual',
        leads_per_employee_per_day: 10,
        max_active_leads_balance: 5,
        revert_time_hours: 24,
        load_balancing_strategy: 'round_robin',
        priority_handling: true
    });

    useEffect(() => {
        if (settings) {
            setFormData(prev => ({ ...prev, ...settings }));
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            await updateSettings(formData).unwrap();
            toast.success("Lead rules updated successfully!");
        } catch (err) {
            toast.error("Failed to update lead rules");
        }
    };

    if (settingsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 pb-12">
                {/* Header Section */}
                <div className="bg-white border-b sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center text-orange-600 border border-orange-200 shadow-sm">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Lead Rules Configuration</h1>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">Define logic for call attempts, disqualification and reassignment</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={updating}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 text-sm tracking-wide"
                            >
                                {updating ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                Save configurations
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 outline-none">

                        {/* Call Attempt Rules */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                <PhoneCall className="text-orange-500" size={20} />
                                <h2 className="font-bold text-[15px] text-gray-700 uppercase tracking-wider">Call Attempt Rules</h2>
                            </div>
                            <div className="p-8 space-y-8 flex-1">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                        Maximum Call Attempts
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.max_call_attempts}
                                            onChange={(e) => setFormData({ ...formData, max_call_attempts: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-semibold bg-white"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Attempts</div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed">
                                        Once this limit is reached, the "Not Qualified" button will be enabled on the lead detail page.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                        Time Gap Between Calls
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.call_time_gap_minutes}
                                            onChange={(e) => setFormData({ ...formData, call_time_gap_minutes: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-semibold bg-white"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Minutes</div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed">
                                        Minimum time required between two consecutive call attempts for the same lead.
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm flex items-start gap-4">
                                    <Zap className="text-blue-500 mt-1 shrink-0" size={18} />
                                    <div className="text-[12px] text-blue-800 font-medium leading-relaxed">
                                        These rules dynamically control the behavior of the <span className="font-bold underline">Not Connected</span> status flow.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disqualification & Reassignment */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                <UserX className="text-orange-500" size={20} />
                                <h2 className="font-bold text-[15px] text-gray-700 uppercase tracking-wider">Disqualification & Reassignment</h2>
                            </div>
                            <div className="p-8 space-y-8 flex-1">
                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner">
                                    <div className="max-w-[70%]">
                                        <h4 className="text-[14px] font-bold text-gray-800">Auto-Disqualification Logic</h4>
                                        <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">
                                            Automatically mark lead as Not Qualified when max attempts are exceeded without connection.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, auto_disqualification: !formData.auto_disqualification })}
                                        className={`relative w-14 h-7 transition-all rounded-full flex items-center px-1 shadow-md ${formData.auto_disqualification ? 'bg-orange-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.auto_disqualification ? 'ml-7' : 'ml-0'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner opacity-50">
                                    <div className="max-w-[70%]">
                                        <h4 className="text-[14px] font-bold text-gray-800">Reassign Disqualified Leads</h4>
                                        <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">
                                            Allow admins to reassign disqualified leads to different agents for a fresh attempt.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, reassignment_on_disqualified: !formData.reassignment_on_disqualified })}
                                        className={`relative w-14 h-7 transition-all rounded-full flex items-center px-1 shadow-md ${formData.reassignment_on_disqualified ? 'bg-orange-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.reassignment_on_disqualified ? 'ml-7' : 'ml-0'}`} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[2px]">Workflow Summary</h4>
                                    <div className="space-y-4 relative pl-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                                        <div className="relative flex items-center gap-4 group">
                                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                                            <span className="text-[12px] font-bold text-gray-700">Initial State</span>
                                            <span className="text-[11px] text-gray-400 font-medium">All tabs disabled, status pending</span>
                                        </div>
                                        <div className="relative flex items-center gap-4 group">
                                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                                            <span className="text-[12px] font-bold text-gray-700">Attempt Phase</span>
                                            <span className="text-[11px] text-gray-400 font-medium">Call attempt tracking active</span>
                                        </div>
                                        <div className="relative flex items-center gap-4 group">
                                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                                            <span className="text-[12px] font-bold text-gray-700">Qualification</span>
                                            <span className="text-[11px] text-gray-400 font-medium">Unlock tabs or mark as disqualified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 bg-white p-8 rounded-sm border border-gray-200 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                            <Settings className="text-gray-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Dynamic UI Feedback</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-3xl">
                                Changes to these rules will immediately reflect in the <span className="font-bold text-orange-600 italic">Lead Detail Page</span> behavior.
                                Agents will be guided through the connection workflow based on the limits defined here.
                                Ensure you communicate any changes to your team to avoid confusion during the active calling cycle.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
