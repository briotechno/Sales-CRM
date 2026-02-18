import React, { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Wallet as WalletIcon,
    History,
    TrendingUp,
    TrendingDown,
    Home,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle2
} from "lucide-react";

export default function Wallet() {
    const [searchTerm, setSearchTerm] = useState("");

    const walletStats = {
        totalAmount: 1250000,
        usedAmount: 450000,
        restAmount: 800000,
        lastTransaction: "2 hours ago"
    };

    const upgradeHistory = [
        {
            id: "UPG-8271",
            enterprise: "TechSol India",
            previousPlan: "Starter",
            newPlan: "Professional",
            amount: 15000,
            date: "2024-02-18",
            time: "14:30",
            status: "Success"
        },
        {
            id: "UPG-8272",
            enterprise: "Global Connect",
            previousPlan: "Professional",
            newPlan: "Enterprise",
            amount: 45000,
            date: "2024-02-18",
            time: "11:15",
            status: "Success"
        },
        {
            id: "UPG-8273",
            enterprise: "Swift Logistics",
            previousPlan: "Starter",
            newPlan: "Professional",
            amount: 15000,
            date: "2024-02-17",
            time: "16:45",
            status: "Success"
        },
        {
            id: "UPG-8274",
            enterprise: "Apex Media",
            previousPlan: "Free Trial",
            newPlan: "Starter",
            amount: 5000,
            date: "2024-02-17",
            time: "09:30",
            status: "Success"
        },
        {
            id: "UPG-8275",
            enterprise: "Future Systems",
            previousPlan: "Professional",
            newPlan: "Enterprise",
            amount: 45000,
            date: "2024-02-16",
            time: "15:20",
            status: "Success"
        }
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/30">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                <WalletIcon className="text-[#FF7B1D]" size={26} /> Wallet Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                                <Home size={14} className="text-gray-700" /> Super Admin / Payment Gateways /{" "}
                                <span className="text-[#FF7B1D]">Wallet</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Amount */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-[#FF7B1D] transition-all">
                            <div className="w-14 h-14 bg-orange-50 text-[#FF7B1D] rounded-sm flex items-center justify-center group-hover:bg-[#FF7B1D] group-hover:text-white transition-all transform group-hover:scale-110">
                                <DollarSign size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                                    ₹{walletStats.totalAmount.toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {/* Used Amount */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-red-500 transition-all">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-sm flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Used Amount</p>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                                    ₹{walletStats.usedAmount.toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {/* Rest Amount */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-green-500 transition-all">
                            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-sm flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                <TrendingDown size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Rest Amount</p>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                                    ₹{walletStats.restAmount.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                        <div className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <History className="text-gray-500" size={20} />
                                <h2 className="text-lg font-bold text-gray-800">Plan Upgrade History</h2>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search Enterprise..."
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:border-[#FF7B1D] outline-none w-64 bg-white font-semibold"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="p-2 border border-gray-200 rounded-sm hover:bg-white text-gray-600">
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#FF7B1D] text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest border-b border-orange-400">Upgrade ID</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest border-b border-orange-400">Enterprise</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest border-b border-orange-400">Transition</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest border-b border-orange-400 text-center">Amount Paid</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest border-b border-orange-400 text-center">Date & Time</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest border-b border-orange-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-semibold">
                                    {upgradeHistory.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{row.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{row.enterprise}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-sm">{row.previousPlan}</span>
                                                    <ArrowUpRight size={14} className="text-[#FF7B1D]" />
                                                    <span className="bg-[#FF7B1D]/10 text-[#FF7B1D] px-2 py-1 rounded-sm">{row.newPlan}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-bold text-gray-800">₹{row.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-800">{row.date}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1 font-black">
                                                        <Clock size={10} /> {row.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase bg-green-100 text-green-700 border border-green-200 shadow-sm">
                                                    <CheckCircle2 size={10} /> {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Showing 5 of 24 upgrades</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                                <button className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-sm bg-[#FF7B1D] text-white hover:bg-[#E66A0D] active:scale-95 transition-all">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
