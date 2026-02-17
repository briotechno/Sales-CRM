import React, { useState, useEffect } from "react";
import {
    Settings,
    ShieldCheck,
    PhoneCall,
    Save,
    RefreshCw,
    Zap,
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
        // Keep these to prevent overwrite
        auto_disqualification: false,
        reassignment_on_disqualified: false,
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
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full font-primary">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <PhoneCall className="text-orange-500" size={20} />
                    <h2 className="font-bold text-[15px] text-gray-700 capitalize tracking-wide">Call Attempt Rules</h2>
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
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize">
                        Maximum Call Attempts
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.max_call_attempts}
                            onChange={(e) => setFormData({ ...formData, max_call_attempts: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-semibold bg-white placeholder-gray-400"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 capitalize">Attempts</div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed capitalize">
                        Once this limit is reached, the "Not Qualified" button will be enabled on the lead detail page.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize">
                        Time Gap Between Calls
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.call_time_gap_minutes}
                            onChange={(e) => setFormData({ ...formData, call_time_gap_minutes: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-semibold bg-white placeholder-gray-400"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 capitalize">Minutes</div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed capitalize">
                        Minimum time required between two consecutive call attempts for the same lead.
                    </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm flex items-start gap-4">
                    <Zap className="text-blue-500 mt-1 shrink-0" size={18} />
                    <div className="text-[12px] text-blue-800 font-medium leading-relaxed capitalize">
                        These rules dynamically control the behavior of the <span className="font-bold underline">Not Connected</span> status flow.
                    </div>
                </div>
            </div>
        </div>
    );
}
