import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Mic, MessageSquare, List, Plus, Trash2, Save, RefreshCw, Layers, PhoneIncoming, Zap, X, User } from "lucide-react";
import { toast } from "react-hot-toast";

const IVRSettings = () => {
    const [config, setConfig] = useState({
        ivrName: "Welcome Campaign - Sales",
        ivrNumber: "+91-88888-99999",
        welcomeMsg: "Welcome to our CRM. For sales press 1, for support press 2.",
        language: "en-in",
        status: "active"
    });

    const [ivrRoutes, setIvrRoutes] = useState([
        { id: 1, key: "1", action: "route_to_agent", value: "Sales Team", icon: <Layers size={14} className="text-orange-500" /> },
        { id: 2, key: "2", action: "route_to_agent", value: "Support Desk", icon: <Layers size={14} className="text-blue-500" /> },
        { id: 3, key: "0", action: "voicemail", value: "General Inbox", icon: <MessageSquare size={14} className="text-purple-500" /> },
    ]);

    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRouteData, setNewRouteData] = useState({
        key: "",
        action: "route_to_agent",
        value: ""
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("IVR configuration saved successfully!");
        }, 1500);
    };

    const removeRoute = (id) => {
        setIvrRoutes(ivrRoutes.filter(route => route.id !== id));
        toast.error("IVR Route removed");
    };

    const addNewRoute = () => {
        const suggestedKey = ivrRoutes.length > 0
            ? Math.max(...ivrRoutes.map(r => parseInt(r.key) || 0)) + 1
            : 1;
        setNewRouteData({
            key: suggestedKey.toString(),
            action: "route_to_agent",
            value: ""
        });
        setIsModalOpen(true);
    };

    const confirmAddRoute = () => {
        if (!newRouteData.key || !newRouteData.value) {
            toast.error("Please fill all fields");
            return;
        }

        if (ivrRoutes.find(r => r.key === newRouteData.key)) {
            toast.error("This key is already assigned");
            return;
        }

        const newRoute = {
            id: Date.now(),
            key: newRouteData.key,
            action: newRouteData.action,
            value: newRouteData.value,
            icon: newRouteData.action === "voicemail"
                ? <MessageSquare size={14} className="text-purple-500" />
                : <Layers size={14} className="text-orange-500" />
        };

        setIvrRoutes([...ivrRoutes, newRoute]);
        setIsModalOpen(false);
        toast.success(`Key ${newRouteData.key} added to IVR menu`);
    };

    return (
        <>
            <div className="w-full">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-sm">
                                <Mic size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold capitalize tracking-wide">IVR Configuration</h3>
                                <p className="text-sm font-medium opacity-90 capitalize mt-0.5">Automated incoming call menu setup</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Basic Info */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                    <Zap size={14} className="text-orange-500" /> IVR name
                                </label>
                                <input
                                    type="text"
                                    value={config.ivrName}
                                    onChange={(e) => setConfig({ ...config, ivrName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                    <PhoneIncoming size={14} className="text-orange-500" /> Master IVR number
                                </label>
                                <div className="flex items-center group">
                                    <span className="bg-gray-100 px-3 py-3 border-y border-l border-gray-200 rounded-l-sm text-gray-400 group-focus-within:border-orange-500 group-focus-within:bg-orange-50 transition-all">
                                        <PhoneIncoming size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        value={config.ivrNumber}
                                        onChange={(e) => setConfig({ ...config, ivrNumber: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-r-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                    <Mic size={14} className="text-orange-500" /> Language (TTS)
                                </label>
                                <select
                                    value={config.language}
                                    onChange={(e) => setConfig({ ...config, language: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-semibold capitalize appearance-none"
                                >
                                    <option value="en-in">English (India)</option>
                                    <option value="hi-in">Hindi (India)</option>
                                    <option value="mr-in">Marathi</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                <MessageSquare size={14} className="text-orange-500" /> Welcome announcement message
                            </label>
                            <textarea
                                value={config.welcomeMsg}
                                onChange={(e) => setConfig({ ...config, welcomeMsg: e.target.value })}
                                className="w-full h-32 px-5 py-4 bg-orange-50/20 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-800 font-primary resize-none leading-relaxed italic placeholder:text-gray-300 shadow-inner"
                                placeholder="Type your welcome message here for Text-to-Speech conversion..."
                            />
                        </div>

                        {/* IVR Decision Tree / Routes */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 capitalize">
                                    <List size={14} className="text-orange-500" /> IVR menu routes (decision tree)
                                </label>
                                <button
                                    onClick={addNewRoute}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 capitalize text-sm tracking-wide"
                                >
                                    <Plus size={16} /> Add new key
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ivrRoutes.map((route) => (
                                    <div key={route.id} className="p-5 border-2 border-gray-100 rounded-sm bg-gray-50 group hover:border-orange-200 transition-all hover:shadow-lg hover:shadow-orange-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="w-10 h-10 bg-white border border-gray-200 text-orange-600 font-black rounded-sm flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                {route.key}
                                            </span>
                                            <button onClick={() => removeRoute(route.id)} className="p-1 px-2 text-red-400 hover:text-red-700 hover:bg-red-50 transition-all rounded-sm uppercase text-[9px] font-black tracking-widest border border-transparent hover:border-red-100">
                                                <Trash2 size={12} className="inline mr-1" /> Remove
                                            </button>
                                        </div>
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-1 text-left">
                                                <span className="text-[10px] font-bold capitalize tracking-wide text-gray-400">Action type</span>
                                                <div className="font-bold text-gray-700 text-sm flex items-center gap-2 capitalize">
                                                    {route.icon} {route.action.split('_').join(' ')}
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <span className="text-[10px] font-bold capitalize tracking-wide text-gray-400">Target dept/value</span>
                                                <div className="font-bold text-gray-800 text-sm tracking-tight capitalize group-hover:text-orange-600 transition-colors">
                                                    {route.value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="pt-4 flex justify-end gap-3 font-primary">
                            <button
                                className="px-6 py-3 border border-gray-200 text-gray-500 font-bold rounded-sm hover:bg-gray-50 transition-all text-sm capitalize tracking-wide shadow-sm"
                                onClick={() => window.location.reload()}
                            >
                                Reset Configuration
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg transition-all text-sm capitalize tracking-wide flex items-center gap-2 active:scale-95 disabled:opacity-70"
                            >
                                {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? "Saving Config..." : "Deploy IVR Menus"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Real-time Monitor Banner */}
                <div className={`p-4 rounded-sm border flex items-center justify-between transition-all duration-500 ${config.status === "active" ? "bg-green-50 border-green-100 shadow-sm" : "bg-gray-100 border-gray-200 opacity-60"}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${config.status === "active" ? "bg-green-500 text-white animate-bounce" : "bg-gray-400 text-white"}`}>
                            <Layers size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800 capitalize tracking-tight">Active call handling monitor</p>
                            <p className="text-[11px] text-green-700 font-bold capitalize tracking-wide">Active sessions: 0 | Live call: None | Status: Ready</p>
                        </div>
                    </div>
                    <button
                        disabled={config.status === "disabled"}
                        className="px-4 py-2 bg-white border border-green-200 text-green-600 font-bold rounded-sm hover:bg-green-600 hover:text-white transition-all text-[11px] capitalize tracking-wide shadow-sm disabled:cursor-not-allowed"
                    >
                        View Live Traffic
                    </button>
                </div>

                {/* Add Route Modal */}
                {isModalOpen && createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-[4px] animate-fadeIn"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden animate-slideUp z-[100000]">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-white">
                                    <Plus size={20} />
                                    <h3 className="text-lg font-bold capitalize">Configure IVR key</h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4 font-primary text-left">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize">
                                        <Zap size={14} className="text-orange-500" /> Key digit (0-9)
                                    </label>
                                    <input
                                        type="number"
                                        maxLength="1"
                                        value={newRouteData.key}
                                        onChange={(e) => setNewRouteData({ ...newRouteData, key: e.target.value.slice(0, 1) })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-bold bg-gray-50/50"
                                        placeholder="e.g. 4"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize">
                                        <Layers size={14} className="text-orange-500" /> Action type
                                    </label>
                                    <select
                                        value={newRouteData.action}
                                        onChange={(e) => setNewRouteData({ ...newRouteData, action: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-bold bg-white capitalize appearance-none"
                                    >
                                        <option value="route_to_agent">Route to agent</option>
                                        <option value="department">Transfer to dept</option>
                                        <option value="voicemail">Go to voicemail</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize">
                                        <User size={14} className="text-orange-500" /> Target value / Dept
                                    </label>
                                    <input
                                        type="text"
                                        value={newRouteData.value}
                                        onChange={(e) => setNewRouteData({ ...newRouteData, value: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm font-bold bg-gray-50/50"
                                        placeholder="e.g. Finance Team"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 border border-gray-200 text-gray-500 font-bold rounded-sm hover:bg-white transition-all text-sm capitalize"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAddRoute}
                                    className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm capitalize"
                                >
                                    Add IVR Key
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </>
    );
};

export default IVRSettings;
