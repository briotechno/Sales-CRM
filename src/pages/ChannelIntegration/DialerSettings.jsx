import React, { useState } from "react";
import { Phone, Shield, Zap, Save, RefreshCw, Key, Link as LinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const DialerSettings = () => {
    const [config, setConfig] = useState({
        provider: "exotel",
        apiKey: "EX3a9b2c8d1e4f5g6h7i8j9k0l",
        apiToken: "TOKEN_****************************",
        virtualNumber: "+91 80000 12345",
        region: "india-1",
        status: "active"
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Dialer configuration saved successfully!");
        }, 1500);
    };

    return (
        <div className="w-full animate-fadeIn">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-sm">
                            <Phone size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-800 capitalize tracking-tight font-primary">1. Dialer Configuration</h3>
                            <p className="text-[11px] font-semibold text-gray-400 capitalize mt-0.5">Primary communication gateway settings</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Provider Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Zap size={14} className="text-orange-500" /> Communication provider
                            </label>
                            <select
                                value={config.provider}
                                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold capitalize appearance-none"
                            >
                                <option value="exotel">Exotel (Recommended for India)</option>
                                <option value="myoperator">MyOperator</option>
                                <option value="twilio">Twilio (Global)</option>
                                <option value="vonage">Vonage / Nexmo</option>
                            </select>
                            <p className="text-[11px] text-gray-400 font-medium capitalize">Select the third-party gateway to route your calls.</p>
                        </div>

                        {/* Status Toggle */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Shield size={14} className="text-orange-500" /> Integration status
                            </label>
                            <div className="flex bg-gray-100 p-1.5 rounded-sm border border-gray-200 shadow-inner w-full">
                                <button
                                    onClick={() => setConfig({ ...config, status: "active" })}
                                    className={`flex-1 py-2.5 rounded-sm text-sm font-bold transition-all flex items-center justify-center gap-2 ${config.status === "active"
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                        : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setConfig({ ...config, status: "disabled" })}
                                    className={`flex-1 py-2.5 rounded-sm text-sm font-bold transition-all flex items-center justify-center gap-2 ${config.status === "disabled"
                                        ? 'bg-white text-orange-600 shadow-md border border-gray-200'
                                        : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Disabled
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* API Key */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Key size={14} className="text-orange-500" /> API / Account SID
                            </label>
                            <input
                                type="text"
                                value={config.apiKey}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                placeholder="Enter API Key"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                            />
                        </div>

                        {/* API Token */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Shield size={14} className="text-orange-500" /> Auth token / Secret
                            </label>
                            <input
                                type="password"
                                value={config.apiToken}
                                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                                placeholder="Enter Secret Token"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                            />
                        </div>

                        {/* Virtual Number */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <LinkIcon size={14} className="text-orange-500" /> Virtual / Master number
                            </label>
                            <input
                                type="text"
                                value={config.virtualNumber}
                                onChange={(e) => setConfig({ ...config, virtualNumber: e.target.value })}
                                placeholder="+91 XXXX XXXXX"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                            />
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Zap size={14} className="text-orange-500" /> Service region
                            </label>
                            <select
                                value={config.region}
                                onChange={(e) => setConfig({ ...config, region: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold capitalize appearance-none"
                            >
                                <option value="india-1">Asia (Mumbai)</option>
                                <option value="us-1">North America</option>
                                <option value="eu-1">Europe</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="flex justify-end gap-3 font-primary">
                        <button
                            className="px-6 py-3 border border-gray-200 text-gray-400 font-bold rounded-sm hover:bg-gray-50 transition-all text-base capitalize tracking-wide shadow-sm"
                            onClick={() => window.location.reload()}
                        >
                            Reset Defaults
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg transition-all text-base capitalize tracking-wide flex items-center gap-2 active:scale-95"
                        >
                            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? "Saving..." : "Save Configuration"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Test Connection Banner */}
            <div className={`p-4 rounded-sm border flex items-center justify-between transition-all duration-500 ${config.status === "active" ? "bg-blue-50 border-blue-100" : "bg-gray-100 border-gray-200 opacity-60"}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.status === "active" ? "bg-blue-500 text-white animate-pulse" : "bg-gray-400 text-white"}`}>
                        <Zap size={14} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 capitalize tracking-tight">Real-time connection test</p>
                        <p className="text-[11px] text-gray-500 font-medium capitalize mt-1">Latency: 45ms | Server: {config.region.toUpperCase()}</p>
                    </div>
                </div>
                <button
                    disabled={config.status === "disabled"}
                    className="px-4 py-2 bg-white border border-blue-200 text-blue-600 font-bold rounded-sm hover:bg-blue-600 hover:text-white transition-all text-[11px] capitalize tracking-wide shadow-sm disabled:cursor-not-allowed"
                >
                    Test API Connectivity
                </button>
            </div>
        </div>
    );
};

export default DialerSettings;
