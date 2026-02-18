import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Package,
    Search,
    Filter,
    Plus,
    Home,
    Eye,
    Edit2,
    Trash2,
    Loader2,
    X,
    RefreshCw,
    XCircle,
    PackageSearch,
    IndianRupee,
    Users,
    Zap,
    HardDrive
} from "lucide-react";
import { useGetPlansQuery } from "../../../store/api/planApi";
import AddPlanModal from "../../../components/PlanManagement/AddPlanModal";
import EditPlanModal from "../../../components/PlanManagement/EditPlanModal";
import ViewPlanModal from "../../../components/PlanManagement/ViewPlanModal";
import DeletePlanModal from "../../../components/PlanManagement/DeletePlanModal";

export default function PlanManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearch, setTempSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filterRef = useRef(null);

    // FETCH DATA
    const { data: response, isLoading, isError, refetch, isFetching } = useGetPlansQuery({
        searchTerm: searchTerm,
        page: currentPage,
        limit: itemsPerPage
    });

    const plans = response?.data || [];
    const pagination = response?.pagination || { totalPages: 1, total: 0 };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasActiveFilters = searchTerm !== "";

    const handleClearFilters = () => {
        setSearchTerm("");
        setTempSearch("");
        setCurrentPage(1);
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
                {/* Header Section */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                <Package className="text-[#FF7B1D]" size={26} /> Plan Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                                <Home size={14} className="text-gray-700" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D]">Subscription Plans</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">

                            {/* UNIFIED FILTER */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => {
                                        if (hasActiveFilters) {
                                            handleClearFilters();
                                        } else {
                                            setTempSearch(searchTerm);
                                            setIsFilterOpen(!isFilterOpen);
                                        }
                                    }}
                                    className={`p-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                    title={hasActiveFilters ? "Clear Filters" : "Filter Options"}
                                >
                                    {hasActiveFilters ? <X size={20} /> : <Filter size={20} />}
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                                        {/* Header */}
                                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-800 tracking-tight uppercase">Filter Options</span>
                                            <button
                                                onClick={() => {
                                                    setTempSearch("");
                                                }}
                                                className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                            >
                                                Reset Search
                                            </button>
                                        </div>

                                        <div className="p-5 space-y-6">
                                            {/* Search Input */}
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Plans</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={tempSearch}
                                                        onChange={(e) => setTempSearch(e.target.value)}
                                                        placeholder="Search plan name..."
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Filter Actions */}
                                        <div className="p-4 bg-gray-50 border-t flex gap-3">
                                            <button
                                                onClick={() => setIsFilterOpen(false)}
                                                className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleApplyFilters}
                                                className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                                            >
                                                Apply Search
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* REFRESH */}
                            <button
                                onClick={refetch}
                                className={`p-3 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 text-gray-600 transition shadow-sm active:scale-95 ${isFetching ? "ring-2 ring-orange-500/20" : ""}`}
                                title="Refresh"
                            >
                                <RefreshCw size={20} className={isFetching ? "animate-spin text-orange-500" : ""} />
                            </button>

                            {/* Add */}
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition active:scale-95 text-sm"
                            >
                                <Plus size={20} />
                                Create New Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Table */}
                <div className="max-w-8xl mx-auto px-6 py-6">
                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                <tr>
                                    <th className="py-3 px-6 font-semibold border-b border-orange-400">Plan Details</th>
                                    <th className="py-3 px-6 font-semibold border-b border-orange-400 text-center">Price</th>
                                    <th className="py-3 px-6 font-semibold border-b border-orange-400 text-center">Users</th>
                                    <th className="py-3 px-6 font-semibold border-b border-orange-400 text-center">Monthly Leads</th>
                                    <th className="py-3 px-6 font-semibold border-b border-orange-400 text-center">Storage</th>
                                    <th className="py-3 px-6 font-semibold text-right border-b border-orange-400">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching plans...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-sm border border-red-100 max-w-sm mx-auto shadow-sm">
                                                <XCircle size={36} className="text-red-500" />
                                                <p className="text-gray-700 font-bold text-sm">Error loading plans</p>
                                                <button onClick={() => refetch()} className="px-5 py-2 bg-red-600 text-white rounded-sm font-bold text-xs uppercase hover:bg-red-700 transition active:scale-95 shadow-md">Try Again</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : plans.length > 0 ? (
                                    plans.map((plan) => (
                                        <tr key={plan.id} className="border-t hover:bg-gray-50 transition-colors font-medium cursor-pointer">
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center rounded-sm font-black shadow-inner">
                                                        {plan.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 text-sm">{plan.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-nowrap">PLAN-ID: {plan.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-sm font-bold text-xs border border-green-200 shadow-sm">
                                                    <IndianRupee size={12} /> {parseFloat(plan.price).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Users size={16} className="text-blue-500 mb-1" />
                                                    <span className="text-sm font-bold text-gray-700">{plan.default_users}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Zap size={16} className="text-[#00C853] mb-1" />
                                                    <span className="text-sm font-bold text-gray-700">{plan.monthly_leads}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <HardDrive size={16} className="text-purple-500 mb-1" />
                                                    <span className="text-sm font-bold text-gray-700">{plan.default_storage} GB</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { setSelectedPlan(plan); setIsViewModalOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all" title="View Details">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPlan(plan); setIsEditModalOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all font-bold" title="Edit Plan">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPlan(plan); setIsDeleteModalOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all" title="Delete Plan">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                                                    <PackageSearch className="text-orange-400 opacity-60" size={36} />
                                                </div>
                                                <h3 className="font-bold text-gray-700 text-base">Empty Catalog</h3>
                                                <p className="text-sm text-gray-400 font-medium tracking-wide">
                                                    {searchTerm ? `No plans found matching "${searchTerm}"` : "You haven't defined any subscription plans yet."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {!isLoading && plans.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">
                                Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total}</span> subscription plans
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
                                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
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

            {/* Modals */}
            <AddPlanModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditPlanModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} plan={selectedPlan} />
            <ViewPlanModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} plan={selectedPlan} />
            <DeletePlanModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} plan={selectedPlan} />
        </DashboardLayout>
    );
}
