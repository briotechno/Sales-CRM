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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filterRef = useRef(null);

    // FETCH DATA
    const { data: response, isLoading, isError, refetch } = useGetPlansQuery({
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

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b sticky top-0 z-30 mb-6">
                    <div className="px-6 py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Package className="text-[#FF7B1D]" /> Plan Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Home size={14} className="text-gray-400" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D] font-semibold">Subscription Plans</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search plans..."
                                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-sm text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition active:scale-95"
                            >
                                <Plus size={20} />
                                Create New Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Table */}
                <div className="mx-6 bg-white rounded-sm shadow-lg overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white sticky top-0">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Plan Details</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Price</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Users</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Leads</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Storage</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-sm font-medium text-gray-500">
                                        <div className="flex flex-col items-center gap-3 font-semibold">
                                            <Loader2 size={30} className="text-orange-500 animate-spin" />
                                            <p className="uppercase tracking-widest text-xs">Fetching plans...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <XCircle size={30} className="text-red-500" />
                                            <p className="text-gray-500 text-sm font-bold">Error loading resource</p>
                                            <button onClick={() => refetch()} className="text-orange-500 text-sm font-bold hover:underline">Try Again</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : plans.length > 0 ? (
                                plans.map((plan) => (
                                    <tr key={plan.id} className="border-b hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center rounded-sm font-bold shadow-inner">
                                                    {plan.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-base">{plan.name}</div>
                                                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">PLAN-{plan.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-sm font-bold text-sm border border-green-100">
                                                <IndianRupee size={14} /> {parseFloat(plan.price).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <Users size={16} className="text-blue-500 mb-1" />
                                                <span className="text-sm font-bold text-gray-700">{plan.default_users}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <Zap size={16} className="text-orange-500 mb-1" />
                                                <span className="text-sm font-bold text-gray-700">{plan.default_leads}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <HardDrive size={16} className="text-purple-500 mb-1" />
                                                <span className="text-sm font-bold text-gray-700">{plan.default_storage} GB</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedPlan(plan); setIsViewModalOpen(true); }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-all hover:shadow-sm" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedPlan(plan); setIsEditModalOpen(true); }}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-all hover:shadow-sm" title="Edit Plan">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedPlan(plan); setIsDeleteModalOpen(true); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all hover:shadow-sm" title="Delete Plan">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                                                <PackageSearch className="text-orange-500 opacity-50" size={40} />
                                            </div>
                                            <h3 className="font-bold text-gray-800 uppercase tracking-tighter text-xl">Empty Catalog</h3>
                                            <p className="text-sm text-gray-400 font-semibold tracking-wide">
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
                <div className="flex justify-between items-center mt-6 bg-white p-4 mx-6 rounded-sm border shadow-sm mb-12 font-semibold">
                    <p className="text-sm text-gray-500 font-bold">
                        Showing <span className="text-[#FF7B1D]">{indexOfFirstItem + 1}</span> to <span className="text-[#FF7B1D]">{indexOfLastItem}</span> of <span className="text-[#FF7B1D]">{pagination.total}</span> subscription plans
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-200 rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-100 transition shadow-sm active:scale-95"
                        >
                            Previous
                        </button>

                        {Array.from({ length: pagination.totalPages }, (_, i) => {
                            let pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-9 h-9 border rounded-sm text-sm font-bold transition-all shadow-sm ${currentPage === pageNum
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={handleNext}
                            disabled={currentPage === pagination.totalPages}
                            className="px-4 py-2 border border-gray-200 rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-100 transition shadow-sm active:scale-95"
                        >
                            Next
                        </button>
                    </div>
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
