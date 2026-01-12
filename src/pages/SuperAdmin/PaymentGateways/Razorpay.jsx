import React, { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Wallet,
    Settings,
    XCircle,
    RefreshCw,
    Eye,
    EyeOff,
    Home,
    ShieldCheck,
    CreditCard,
    Zap
} from "lucide-react";

export default function Razorpay() {
    const [showKey, setShowKey] = useState(false);

    const gateway = {
        id: "GW003",
        name: "Razorpay",
        icon: "⚡",
        status: "Disconnected",
        mode: "Test",
        keyId: "rzp_test_55127",
        keySecret: "rzp_sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        lastSync: "2 days ago"
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                <div className="bg-white border-b my-3">
                    <div className="max-w-7xl mx-auto px-0 ml-10 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Wallet className="text-[#FF7B1D]" />
                                    Razorpay Configuration
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400"></span> Super Admin / Payment Gateways /{" "}
                                    <span className="text-[#FF7B1D] font-medium">Razorpay</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-0 ml-6 space-y-8">
                    <div className="bg-white rounded-sm shadow-sm border border-orange-200 overflow-hidden">
                        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{gateway.icon}</span>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{gateway.name}</h3>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-sm uppercase ${gateway.mode === 'Production' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {gateway.mode}
                                    </span>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-sm text-sm font-bold uppercase flex items-center gap-2 ${gateway.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <XCircle size={16} />
                                {gateway.status}
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Key ID</label>
                                        <div className="bg-gray-50 p-3 border border-gray-100 rounded-sm font-mono text-sm font-bold text-gray-800">
                                            {gateway.keyId}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Key Secret</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-50 p-3 border border-gray-100 rounded-sm font-mono text-sm font-bold text-gray-800">
                                                {showKey ? gateway.keySecret : 'rzp_sk_test_••••••••••••••••'}
                                            </div>
                                            <button
                                                onClick={() => setShowKey(!showKey)}
                                                className="p-3 text-gray-400 hover:text-[#FF7B1D] border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors"
                                            >
                                                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-sm space-y-4">
                                    <h4 className="font-bold text-gray-800 border-b pb-2">System Alerts</h4>
                                    <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-sm border border-red-100">
                                        Test integration only. Credentials will not process real payments.
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Last Sync:</span>
                                        <span className="font-bold text-gray-700 flex items-center gap-1">
                                            <RefreshCw size={14} /> {gateway.lastSync}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t">
                                <button className="flex-1 bg-[#FF7B1D] hover:bg-[#E66A0D] text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
                                    <Settings size={20} /> Update Configuration
                                </button>
                                <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition-all">
                                    <Zap size={20} /> Test Connection
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-sm flex items-start gap-4">
                        <div className="p-3 bg-orange-50 rounded-sm text-[#FF7B1D]">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-1">Razorpay X Integration</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Enable Razorpay X for automated vendor payouts and subscription management.
                                Requires separate API key activation from the Razorpay dashboard.
                            </p>
                            <button className="mt-3 text-sm font-bold text-[#FF7B1D] flex items-center gap-1 hover:underline">
                                <CreditCard size={16} /> Developer Guidelines
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
