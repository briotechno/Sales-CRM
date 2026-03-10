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
import { useGetWalletStatsQuery, useGetWalletUpgradesQuery } from "../../../store/api/walletApi";
import { useGetPlansQuery } from "../../../store/api/planApi";

export default function Wallet() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearch, setTempSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [planFilter, setPlanFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const filterRef = React.useRef(null);

    const { data: statsResponse, isLoading: isLoadingStats } = useGetWalletStatsQuery();
    const walletStats = statsResponse?.data || {
        totalAmount: 0,
        usedAmount: 0,
        restAmount: 0,
        lastTransaction: "0 hours ago"
    };

    const { data: historyResponse, isLoading: isLoadingHistory, refetch: refetchHistory } = useGetWalletUpgradesQuery({
        plan: planFilter,
        searchTerm: searchTerm,
        page: currentPage,
        limit: itemsPerPage
    });

    const { data: plansResponse, isLoading: isPlansLoading } = useGetPlansQuery();
    const plansList = plansResponse?.data || [];

    const upgradeHistory = historyResponse?.data || [];
    const pagination = historyResponse?.pagination || { totalPages: 1, total: 0 };

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasActiveFilters = searchTerm !== "" || planFilter !== "all";

    const handleClearFilters = () => {
        setSearchTerm("");
        setTempSearch("");
        setPlanFilter("all");
    };

    const handleApplyFilters = () => {
        setSearchTerm(tempSearch);
        setIsFilterOpen(false);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);


    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                Wallet Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                                <Home size={14} className="text-gray-700" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D]">Wallet</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-6 pt-0 mt-2 pb-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Amount */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-orange-500 transition-all">
                            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-sm flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm border border-orange-100">
                                <DollarSign size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 capitalize tracking-tight mb-1 text-nowrap">Total Available</p>
                                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                                    {isLoadingStats ? "..." : `₹${walletStats.totalAmount.toLocaleString()}`}
                                </h3>
                            </div>
                        </div>

                        {/* Used Amount */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-red-500 transition-all">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-sm flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm border border-red-100">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-sm  font-bold text-gray-500 capitalize tracking-tight mb-1 text-nowrap">Total Spent</p>
                                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                                    {isLoadingStats ? "..." : `₹${walletStats.usedAmount.toLocaleString()}`}
                                </h3>
                            </div>
                        </div>

                        {/* Rest Amount */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-green-500 transition-all">
                            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-sm flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm border border-green-100">
                                <TrendingDown size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 capitalize tracking-tight mb-1 text-nowrap">Balance Remaining</p>
                                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                                    {isLoadingStats ? "..." : `₹${walletStats.restAmount.toLocaleString()}`}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                        <div className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-gray-800 capitalize tracking-tight">Plan Upgrade History</h2>
                            </div>

                            <div className="flex items-center gap-3">

                                <div className="relative" ref={filterRef}>
                                    <button
                                        onClick={() => {
                                            if (hasActiveFilters) {
                                                handleClearFilters();
                                            } else {
                                                setIsFilterOpen(!isFilterOpen);
                                            }
                                        }}
                                        className={`p-3 border rounded-sm shadow-sm transition-all active:scale-95 flex items-center justify-center ${(isFilterOpen || hasActiveFilters)
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500"
                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {hasActiveFilters ? <X size={20} /> : <Filter size={20} />}
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute right-0 mt-2 w-[350px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-800 tracking-tight capitalize">Filter Options</span>
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                                >
                                                    Reset All
                                                </button>
                                            </div>
                                            <div className="p-5 space-y-5">
                                                <div>
                                                    <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Filter by Plan Type</label>
                                                    <select
                                                        value={planFilter}
                                                        onChange={(e) => setPlanFilter(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-white outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
                                                    >
                                                        <option value="all">All Plans</option>
                                                        {plansList.map(plan => (
                                                            <option key={plan.id} value={plan.name}>{plan.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 border-t flex gap-3">
                                                <button
                                                    onClick={() => setIsFilterOpen(false)}
                                                    className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 bg-white border border-gray-200 rounded-sm hover:bg-gray-200 transition-all capitalize tracking-wider shadow-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleApplyFilters}
                                                    className="flex-1 py-2.5 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm shadow-md hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 capitalize tracking-wider"
                                                >
                                                    Apply Filter
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                    <tr>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Id</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Enterprise Name</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Upgrade Path</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Amount Paid</th>
                                        <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 text-nowrap">Timestamp</th>
                                        <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {isLoadingHistory ? (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                                    <p className="text-gray-500 font-bold capitalize tracking-widest text-xs">Loading upgrades...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : upgradeHistory.length > 0 ? (
                                        upgradeHistory.map((row) => (
                                            <tr key={row.id} className="border-t hover:bg-gray-50 transition-colors font-medium cursor-pointer">
                                                <td className="py-4 px-4 text-sm text-left text-orange-500 font-semibold tracking-tight capitalize">{row.id.toString().startsWith('UPG') ? row.id : `UPG-${row.id}`}</td>
                                                <td className="py-4 px-4 font-bold text-gray-800 text-base">{row.enterprise}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-[13px] font-bold capitalize tracking-tight">
                                                        <span className="bg-gray-100 text-gray-600 px-3 py-2 rounded-sm border border-gray-200 shadow-sm">{row.previousPlan}</span>
                                                        <ArrowUpRight size={16} className="text-orange-500" />
                                                        <span className="bg-orange-50 text-orange-600 px-3 py-2 rounded-sm border border-orange-100 shadow-sm">{row.newPlan}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-left">
                                                    <span className="text-base font-bold text-gray-800 tracking-tight">₹{row.amount.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4 px-4 text-left">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-800 tracking-tight">{row.date}</span>
                                                        <span className="text-[11px] text-gray-400 capitalize flex items-center justify-start gap-1 font-black tracking-widest leading-none mt-1.5">
                                                            <Clock size={12} /> {row.time}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-[11px] font-black capitalize border shadow-sm ${row.status === 'Active'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}>
                                                        {row.status === 'Active' && <CheckCircle2 size={14} />} {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                        <History className="text-gray-300" size={30} />
                                                    </div>
                                                    <p className="text-gray-500 font-bold capitalize tracking-widest text-xs">No transaction history found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!isLoadingHistory && upgradeHistory.length > 0 && (
                            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                                <p className="text-sm font-semibold text-gray-700">
                                    Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total}</span> Upgrades
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => {
                                            let pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === pageNum
                                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === pagination.totalPages}
                                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}


