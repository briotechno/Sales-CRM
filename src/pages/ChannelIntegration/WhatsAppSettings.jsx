import React, { useState } from "react";
import { MessageSquare, Shield, Zap, Save, RefreshCw, Key, Link as LinkIcon, Smartphone } from "lucide-react";
import { toast } from "react-hot-toast";

const WhatsAppSettings = () => {
    const [config, setConfig] = useState({
        provider: "meta",
        phoneNumberId: "109283746554321",
        businessAccountId: "882736455109283",
        accessToken: "EAAG...",
        webhookUrl: "https://api.crm.com/webhooks/whatsapp",
        webhookVerifyToken: "CRM_WP_VERIFY_2024",
        status: "active"
    });

    const [testPhone, setTestPhone] = useState("");
    const [isTesting, setIsTesting] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("WhatsApp configuration saved successfully!");
        }, 1500);
    };

    return (
        <div className="w-full animate-fadeIn">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-sm">
                            <MessageSquare size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-800 capitalize tracking-tight font-primary">WhatsApp Business API Configuration</h3>
                            <p className="text-[11px] font-semibold text-gray-400 capitalize mt-0.5">Integrate WhatsApp for automated notifications and chats</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Provider Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Zap size={14} className="text-orange-500" /> WhatsApp Provider
                            </label>
                            <select
                                value={config.provider}
                                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold capitalize appearance-none"
                            >
                                <option value="meta">Meta Cloud API (Official)</option>
                                <option value="twilio">Twilio for WhatsApp</option>
                                <option value="360dialog">360dialog</option>
                                <option value="gupshup">Gupshup</option>
                            </select>
                            <p className="text-[11px] text-gray-400 font-medium capitalize">Select your API gateway provider.</p>
                        </div>

                        {/* Status Toggle */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Shield size={14} className="text-orange-500" /> Integration Status
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
                        {/* Phone Number ID */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Smartphone size={14} className="text-orange-500" /> Phone Number ID
                            </label>
                            <input
                                type="text"
                                value={config.phoneNumberId}
                                onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                                placeholder="Enter Phone Number ID"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                            />
                        </div>

                        {/* Business Account ID */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Key size={14} className="text-orange-500" /> Business Account ID
                            </label>
                            <input
                                type="text"
                                value={config.businessAccountId}
                                onChange={(e) => setConfig({ ...config, businessAccountId: e.target.value })}
                                placeholder="Enter Business Account ID"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                            />
                        </div>

                        {/* Access Token */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Shield size={14} className="text-orange-500" /> Permanent Access Token
                            </label>
                            <textarea
                                value={config.accessToken}
                                onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                                placeholder="Enter System User Access Token"
                                className="w-full h-24 px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold resize-none"
                            />
                        </div>

                        {/* Webhook URL */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <LinkIcon size={14} className="text-orange-500" /> Webhook Callback URL
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    readOnly
                                    value={config.webhookUrl}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-l-sm bg-gray-50 text-sm text-gray-500 font-semibold outline-none"
                                />
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(config.webhookUrl);
                                        toast.success("URL Copied!");
                                    }}
                                    className="px-4 bg-gray-100 border border-l-0 border-gray-200 rounded-r-sm hover:bg-gray-200 transition-all text-[11px] font-bold text-gray-600 uppercase tracking-widest"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium capitalize">Configure this in Meta App Dashboard &gt; WhatsApp &gt; Configuration</p>
                        </div>

                        {/* Webhook Verify Token */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <Shield size={14} className="text-orange-500" /> Webhook Verify Token
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={config.webhookVerifyToken}
                                    onChange={(e) => setConfig({ ...config, webhookVerifyToken: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-l-sm bg-white text-sm text-gray-800 font-semibold outline-none focus:border-orange-500"
                                />
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(config.webhookVerifyToken);
                                        toast.success("Token Copied!");
                                    }}
                                    className="px-4 bg-gray-100 border border-l-0 border-gray-200 rounded-r-sm hover:bg-gray-200 transition-all text-[11px] font-bold text-gray-600 uppercase tracking-widest"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium capitalize">Use this token to verify your webhook in Meta Dashboard</p>
                        </div>
                    </div>

                    {/* Meta Setup Guide */}
                    <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-sm flex gap-4">
                        <div className="bg-white p-2 h-fit rounded-sm shadow-sm border border-blue-100">
                            <Zap size={18} className="text-blue-500" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-sm font-bold text-blue-800">Meta Cloud API Quick Guide</h4>
                            <p className="text-[11px] text-blue-600 font-medium mt-1 leading-relaxed">
                                1. Go to <a href="https://developers.facebook.com" target="_blank" className="font-bold underline">Meta Developers Portal</a> &amp; create a WhatsApp app.<br/>
                                2. Copy <strong>Phone Number ID</strong> and <strong>WA Business Account ID</strong> from the 'Getting Started' tab.<br/>
                                3. Generate a <strong>System User Token</strong> in Business Settings for permanent access.
                            </p>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="pt-4 flex justify-end gap-3 font-primary">
                        <button
                            className="px-6 py-3 border border-gray-200 text-gray-500 font-bold rounded-sm hover:bg-gray-50 transition-all text-base capitalize tracking-wide shadow-sm"
                            onClick={() => window.location.reload()}
                        >
                            Reset Defaults
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg transition-all text-base capitalize tracking-wide flex items-center gap-2 active:scale-95 disabled:opacity-70"
                        >
                            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? "Saving Config..." : "Save Configuration"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Test Connection Banner */}
            <div className={`p-6 bg-white border border-gray-200 rounded-sm shadow-sm mb-6 ${config.status !== 'active' ? 'opacity-60 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-sm">
                        <Zap size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 capitalize tracking-tight font-primary">Test API Connectivity</h3>
                        <p className="text-[11px] font-semibold text-gray-400 capitalize mt-0.5">Send a test WhatsApp message to verify your settings</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-[13px] font-bold text-gray-600 capitalize">Recipient Phone Number</label>
                        <input
                            type="text"
                            value={testPhone}
                            onChange={(e) => setTestPhone(e.target.value)}
                            placeholder="+91 XXXX XXX XXX"
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none text-sm font-semibold"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                if (!testPhone) return toast.error("Please enter a phone number");
                                setIsTesting(true);
                                setTimeout(() => {
                                    setIsTesting(false);
                                    toast.success("Test message sent! Check your WhatsApp.");
                                }, 2000);
                            }}
                            disabled={isTesting}
                            className="w-full md:w-auto px-10 py-3.5 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-sm hover:bg-orange-500 hover:text-white transition-all text-base capitalize tracking-wide shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                        >
                            {isTesting ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                            {isTesting ? "Sending..." : "Send Test Message"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Banner */}
            <div className={`p-4 rounded-sm border flex items-center justify-between transition-all duration-500 ${config.status === "active" ? "bg-green-50 border-green-100" : "bg-gray-100 border-gray-200 opacity-60"}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.status === "active" ? "bg-green-500 text-white animate-pulse" : "bg-gray-400 text-white"}`}>
                        <Zap size={14} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 capitalize tracking-tight">Cloud API Service Check</p>
                        <p className="text-[11px] text-gray-500 font-medium capitalize mt-1">Status: {config.status === "active" ? "Connected" : "Disconnected"} | API v18.0</p>
                    </div>
                </div>
                <button
                    disabled={config.status === "disabled"}
                    className="px-4 py-2 bg-white border border-green-200 text-green-600 font-bold rounded-sm hover:bg-green-600 hover:text-white transition-all text-[11px] capitalize tracking-wide shadow-sm disabled:cursor-not-allowed"
                >
                    Test API Call
                </button>
            </div>
        </div>
    );
};

export default WhatsAppSettings;
