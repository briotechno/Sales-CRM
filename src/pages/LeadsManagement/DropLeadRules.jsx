import React, { useState, useEffect } from "react";
import {
    UserX,
    RefreshCw,
    Save,
    Settings,
    AlertCircle
} from "lucide-react";
import {
    useGetAssignmentSettingsQuery,
    useUpdateAssignmentSettingsMutation
} from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function DropLeadRules() {
    const { data: settings, isLoading: settingsLoading } = useGetAssignmentSettingsQuery();
    const [updateSettings, { isLoading: updating }] = useUpdateAssignmentSettingsMutation();

    const [formData, setFormData] = useState({
        auto_disqualification: false,
        reassignment_on_disqualified: false,
        // Keep other fields to avoid overwriting with undefined if API expects full object
        max_call_attempts: 5,
        call_time_gap_minutes: 60,
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
            toast.success("Drop rules updated successfully!");
        } catch (err) {
            toast.error("Failed to update drop rules");
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
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full font-primary">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <UserX className="text-orange-500" size={20} />
                    <h2 className="font-bold text-[15px] text-gray-700 capitalize tracking-wide">Disqualification & Reassignment</h2>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updating}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 text-xs tracking-wide capitalize"
                >
                    {updating ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Changes
                </button>
            </div>
            <div className="p-8 space-y-8 flex-1 text-left">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner">
                    <div className="max-w-[70%]">
                        <h4 className="text-[14px] font-bold text-gray-800 capitalize">Auto-Disqualification Logic</h4>
                        <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed capitalize">
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

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-sm border border-gray-100 shadow-inner opacity-80 hover:opacity-100 transition-opacity">
                    <div className="max-w-[70%]">
                        <h4 className="text-[14px] font-bold text-gray-800 capitalize">Reassign Disqualified Leads</h4>
                        <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed capitalize">
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
                    <h4 className="text-xs font-bold text-gray-400 capitalize tracking-wide border-b border-gray-100 pb-2">Workflow Summary</h4>
                    <div className="space-y-4 relative pl-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                        <div className="relative flex items-center gap-4 group">
                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                            <span className="text-[12px] font-bold text-gray-700 capitalize">Initial State</span>
                            <span className="text-[11px] text-gray-400 font-medium capitalize">All tabs disabled, status pending</span>
                        </div>
                        <div className="relative flex items-center gap-4 group">
                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                            <span className="text-[12px] font-bold text-gray-700 capitalize">Attempt Phase</span>
                            <span className="text-[11px] text-gray-400 font-medium capitalize">Call attempt tracking active</span>
                        </div>
                        <div className="relative flex items-center gap-4 group">
                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                            <span className="text-[12px] font-bold text-gray-700 capitalize">Qualification</span>
                            <span className="text-[11px] text-gray-400 font-medium capitalize">mark as disqualified if rules met</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-sm flex items-start gap-4">
                    <AlertCircle className="text-orange-600 mt-0.5 shrink-0" size={18} />
                    <div className="text-[12px] text-orange-800 font-medium leading-relaxed capitalize">
                        These settings control when a lead is automatically dropped from the active pipeline.
                    </div>
                </div>
            </div>
        </div>
    );
}
