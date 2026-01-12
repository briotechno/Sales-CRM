import React, { useState, useRef } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    KeyRound,
    Search,
    Filter,
    Copy,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Home,
    Plus,
    ArrowRight,
    Eye,
    Edit2,
    Trash2
} from "lucide-react";

export default function ProductKeys() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState("all");
    const filterRef = useRef(null);

    const productKeys = [
        { id: "KEY-001", key: "XXXX-XXXX-XXXX-XXXX-8291", enterprise: "TechVista Solutions", plan: "Enterprise", status: "Active", generatedOn: "2023-11-15", expiresOn: "2024-11-15", users: 15 },
        { id: "KEY-002", key: "XXXX-XXXX-XXXX-XXXX-4432", enterprise: "Global Marketing Inc", plan: "Professional", status: "Active", generatedOn: "2023-12-01", expiresOn: "2024-03-01", users: 7 },
        { id: "KEY-003", key: "XXXX-XXXX-XXXX-XXXX-1120", enterprise: "Creative Minds Studio", plan: "Basic", status: "Active", generatedOn: "2023-12-10", expiresOn: "2024-01-10", users: 3 },
        { id: "KEY-004", key: "XXXX-XXXX-XXXX-XXXX-9908", enterprise: "Nexus Healthcare", plan: "Professional", status: "Inactive", generatedOn: "2023-10-20", expiresOn: "2024-01-20", users: 12 },
        { id: "KEY-005", key: "XXXX-XXXX-XXXX-XXXX-5561", enterprise: "In-Progress", plan: "Enterprise", status: "Pending", generatedOn: "2024-01-08", expiresOn: "2025-01-08", users: 0 },
    ];

    const filteredKeys = productKeys.filter((pk) => {
        const matchesSearch =
            pk.enterprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pk.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterPriority === "all" ||
            (filterPriority === "active" && pk.status === "Active") ||
            (filterPriority === "inactive" && pk.status === "Inactive") ||
            (filterPriority === "pending" && pk.status === "Pending");

        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="pl-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        {/* Title & Breadcrumb */}
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <KeyRound className="text-[#FF7B1D]" /> Product Keys
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Home size={14} className="text-gray-400" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D] font-medium">Product Keys</span>
                            </p>
                        </div>

                        {/* Search, Filter, Add */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            {/* Filter */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`p-3 border rounded-sm shadow-sm ${isFilterOpen ? "bg-orange-500 text-white" : "bg-white text-gray-700"}`}
                                >
                                    <Filter size={20} />
                                </button>
                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-sm shadow-lg z-50">
                                        <div className="p-3 border-b bg-gray-50 text-xs font-bold text-gray-500">
                                            Filter Status
                                        </div>
                                        {["all", "active", "inactive", "pending"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterPriority(status);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs ${filterPriority === status ? "bg-orange-100 text-orange-600 font-bold" : "hover:bg-gray-100"}`}
                                            >
                                                {status.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search keys or enterprises..."
                                    className="w-full pl-10 pr-4 py-3 border rounded-sm text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Add */}
                            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md">
                                <Plus size={20} />
                                Generate New Key
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Generate Card */}
                <div className="rounded-lg shadow-lg border border-gray-100 pl-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Generate</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {["Enterprise", "Plan Type", "Validity"].map((label, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase">{label}</label>
                                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] hover:border-[#FF7B1D] transition">
                                    {label === "Enterprise" && (
                                        <>
                                            <option>Select Enterprise</option>
                                            <option>New Enterprise</option>
                                        </>
                                    )}
                                    {label === "Plan Type" && (
                                        <>
                                            <option>Basic Plan</option>
                                            <option>Professional Plan</option>
                                            <option>Enterprise Plan</option>
                                        </>
                                    )}
                                    {label === "Validity" && (
                                        <>
                                            <option>1 Month</option>
                                            <option>3 Months</option>
                                            <option>1 Year</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        ))}

                        {/* Generate Button */}
                        <div className="flex items-end">
                            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 shadow-md transition-all">
                                Generate <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Keys Table */}
                <div className="bg-white pl-6 py-4 rounded-lg shadow-md border border-gray-100 overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm">ID</th>
                                <th className="px-4 py-3 text-left text-sm">Assigned To</th>
                                <th className="px-4 py-3 text-left text-sm">Plan</th>
                                <th className="px-4 py-3 text-left text-sm">Status</th>
                                <th className="px-4 py-3 text-left text-sm">Users</th>
                                <th className="px-4 py-3 text-left text-sm">Generated On</th>
                                <th className="px-4 py-3 text-right text-sm">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredKeys.length > 0 ? (
                                filteredKeys.map((pk) => (
                                    <tr key={pk.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-sm">{pk.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold">{pk.enterprise}</div>
                                            <div className="text-xs text-gray-400">{pk.key}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{pk.plan}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-bold ${pk.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : pk.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {pk.status === "Active" ? <CheckCircle2 size={12} /> :
                                                    pk.status === "Inactive" ? <XCircle size={12} /> :
                                                        <RefreshCw size={12} />}
                                                {pk.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{pk.users}</td>
                                        <td className="px-4 py-3 text-sm">{pk.generatedOn}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-3">
                                                <button className="text-blue-500 hover:opacity-80"><Eye size={18} /></button>
                                                <button className="text-orange-500 hover:opacity-80"><Edit2 size={18} /></button>
                                                <button className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <KeyRound className="text-orange-500" size={32} />
                                        </div>
                                        <h3 className="font-bold text-gray-800">No keys found</h3>
                                        <p className="text-sm text-gray-500">Add your first product key to get started</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
