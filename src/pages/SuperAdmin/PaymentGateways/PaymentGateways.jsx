import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Wallet,
    Settings,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Eye,
    EyeOff,
    Home,
    ShieldCheck,
    CreditCard,
    Zap
} from "lucide-react";

export default function PaymentGateways() {
    const [searchParams] = useSearchParams();
    const activeGatewayParam = searchParams.get("gateway");
    const [showKeys, setShowKeys] = useState({});

    const toggleKey = (id) => {
        setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const gateways = [
        {
            id: "GW001",
            name: "Cashfree",
            slug: "cashfree",
            icon: "💳",
            status: "Connected",
            mode: "Production",
            appId: "CF_APP_82716253",
            secretKey: "cf_sk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            lastSync: "10 mins ago"
        },
        {
            id: "GW002",
            name: "PhonePe",
            slug: "phonepe",
            icon: "📱",
            status: "Connected",
            mode: "Production",
            merchantId: "PG_MERCH_99812",
            saltKey: "pp_salt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            lastSync: "1 hour ago"
        },
        {
            id: "GW003",
            name: "Razorpay",
            slug: "razorpay",
            icon: "⚡",
            status: "Disconnected",
            mode: "Test",
            keyId: "rzp_test_55127",
            keySecret: "rzp_sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            lastSync: "2 days ago"
        },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header */}
                <div className="bg-white border-b my-3">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Wallet className="text-[#FF7B1D]" />
                                    Payment Gateways
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400"></span> Super Admin /{" "}
                                    <span className="text-[#FF7B1D] font-medium">
                                        Payment Gateways
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gateways Grid */}
                <div className="p-0 px-6 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {gateways.map((gw) => (
                            <div
                                key={gw.id}
                                className={`bg-white rounded-sm shadow-sm border overflow-hidden flex flex-col transition-all duration-300 ${activeGatewayParam === gw.slug
                                    ? 'border-[#FF7B1D] ring-2 ring-[#FF7B1D] ring-opacity-20 translate-y-[-4px]'
                                    : 'border-gray-100'
                                    }`}
                            >
                                <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{gw.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{gw.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${gw.mode === 'Production' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {gw.mode}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-sm text-xs font-bold uppercase flex items-center gap-1.5 ${gw.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {gw.status === 'Connected' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                        {gw.status}
                                    </div>
                                </div>

                                <div className="p-6 space-y-4 flex-1">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Configuration</label>
                                        <div className="bg-gray-50 p-3 rounded-sm space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Public ID:</span>
                                                <span className="text-xs font-mono font-bold text-gray-800">{gw.appId || gw.merchantId || gw.keyId}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Secret Key:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-gray-800">
                                                        {showKeys[gw.id] ? (gw.secretKey || gw.saltKey || gw.keySecret) : '••••••••••••••••'}
                                                    </span>
                                                    <button onClick={() => toggleKey(gw.id)} className="text-gray-400 hover:text-gray-600">
                                                        {showKeys[gw.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium italic">
                                        <RefreshCw size={12} />
                                        Last synced: {gw.lastSync}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-t flex gap-2">
                                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-sm text-xs font-bold flex items-center justify-center gap-2 hover:bg-white transition-all">
                                        <Settings size={14} /> Configure
                                    </button>
                                    <button className="flex-1 bg-gray-800 text-white py-2 rounded-sm text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all">
                                        <Zap size={14} /> Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security Banner */}
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-sm flex items-start gap-4">
                        <div className="p-3 bg-white rounded-sm shadow-sm text-[#FF7B1D]">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-1">Encrypted Payment Gateway Configuration</h4>
                            <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
                                All payment gateway credentials are encrypted using AES-256 before being stored in our database.
                                For security reasons, full keys are never displayed unless explicitly requested by an authorized Super Admin.
                                Monitor transaction logs regularly to ensure smooth payment processing for all enterprises.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <button className="text-sm font-bold text-[#FF7B1D] flex items-center gap-1 hover:underline">
                                    <CreditCard size={16} /> View Transaction Logs
                                </button>
                                <button className="text-sm font-bold text-[#FF7B1D] flex items-center gap-1 hover:underline">
                                    <ShieldCheck size={16} /> Security Audit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
