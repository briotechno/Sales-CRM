import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Building2,
    Search,
    Eye,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Plus,
    Home,
    Users,
    Target,
    Handshake,
    Loader2,
    Clock,
    ShieldOff,
    RefreshCw,
    AlertCircle,
    Filter,
    X,
} from "lucide-react";
import NumberCard from "../../../components/NumberCard";
import AddEnterpriseModal from "../../../components/EnterpriseManagement/AddEnterpriseModal";
import EditEnterpriseModal from "../../../components/EnterpriseManagement/EditEnterpriseModal";
import DeleteEnterpriseModal from "../../../components/EnterpriseManagement/DeleteEnterpriseModal";
import { useGetEnterprisesQuery } from "../../../store/api/enterpriseApi";

// Filter chip definitions
const FILTER_CHIPS = [
    {
        key: "all",
        label: "All Enterprises",
        icon: <Building2 size={14} />,
        color: "orange",
    },
    {
        key: "inactive",
        label: "Signed Up / Inactive",
        icon: <Clock size={14} />,
        color: "yellow",
    },
    {
        key: "active",
        label: "Active Buyers",
        icon: <CheckCircle2 size={14} />,
        color: "green",
    },
    {
        key: "suspended",
        label: "Suspended",
        icon: <ShieldOff size={14} />,
        color: "red",
    },
];

const chipColorMap = {
    orange: {
        active: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200 border-transparent",
        inactive: "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600",
    },
    yellow: {
        active: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md shadow-yellow-200 border-transparent",
        inactive: "bg-white text-gray-600 border-gray-200 hover:border-yellow-400 hover:text-yellow-600",
    },
    green: {
        active: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200 border-transparent",
        inactive: "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600",
    },
    red: {
        active: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 border-transparent",
        inactive: "bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-600",
    },
};

export default function EnterpriseManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearch, setTempSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const [isAddEnterpriseOpen, setIsAddEnterpriseOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // FETCH DATA
    const { data: response, isLoading, isError, refetch, isFetching } = useGetEnterprisesQuery({
        status: filterStatus,
        searchTerm: searchTerm,
        page: currentPage,
        limit: itemsPerPage
    });

    const enterprises = response?.data || [];
    const pagination = response?.pagination || { totalPages: 1, total: 0 };

    const totalEnterprises = pagination.total;
    const activeEnterprises = enterprises.filter(e => e.status === "Active").length;
    const totalPlans = new Set(enterprises.map(e => e.plan)).size;
    const trialCount = enterprises.filter(e => e.status === "Trial").length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasActiveFilters = searchTerm !== "" || filterStatus !== "all";

    const handleClearFilters = () => {
        setFilterStatus("all");
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

    const getStatusBadge = (status) => {
        if (status === "Active") return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                <CheckCircle2 size={11} /> Active
            </span>
        );
        if (status === "Trial") return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                <Clock size={11} /> Trial
            </span>
        );
        if (status === "Suspended") return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                <ShieldOff size={11} /> Suspended
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                <XCircle size={11} /> {status || "Inactive"}
            </span>
        );
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">

                {/* ── HEADER ── */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                <Building2 className="text-[#FF7B1D]" size={26} /> Enterprise Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                                <Home size={14} className="text-gray-700" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D]">Enterprises</span>
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
                                                onClick={handleClearFilters}
                                                className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                            >
                                                Reset All
                                            </button>
                                        </div>

                                        <div className="p-5 space-y-6">
                                            {/* Search Input */}
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Enterprises</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={tempSearch}
                                                        onChange={(e) => setTempSearch(e.target.value)}
                                                        placeholder="Search name, email, or city..."
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Filter */}
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-3 border-b pb-1">Filter by Status</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {FILTER_CHIPS.map((chip) => (
                                                        <label
                                                            key={chip.key}
                                                            className={`flex items-center gap-2 p-2.5 border rounded-sm cursor-pointer transition-all ${filterStatus === chip.key
                                                                ? "bg-orange-50 border-orange-200 ring-1 ring-orange-200"
                                                                : "hover:bg-gray-50 border-gray-100"
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="status"
                                                                value={chip.key}
                                                                checked={filterStatus === chip.key}
                                                                onChange={() => setFilterStatus(chip.key)}
                                                                className="w-3 h-3 text-orange-600 focus:ring-orange-500 border-gray-300"
                                                            />
                                                            <span className={`text-[11px] font-bold ${filterStatus === chip.key ? "text-orange-700" : "text-gray-600"}`}>
                                                                {chip.label}
                                                            </span>
                                                        </label>
                                                    ))}
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
                                                Apply Filters
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
                                onClick={() => setIsAddEnterpriseOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition active:scale-95 text-sm"
                            >
                                <Plus size={20} />
                                Add Enterprise
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── DASHBOARD CONTENT ── */}
                <div className="max-w-8xl mx-auto px-6 pt-2 pb-6 space-y-6">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <NumberCard
                            title="Total Enterprises"
                            number={isLoading ? "..." : totalEnterprises}
                            icon={<Users className="text-blue-600" size={24} />}
                            iconBgColor="bg-blue-100"
                            lineBorderClass="border-blue-500"
                        />
                        <NumberCard
                            title="Active Enterprises"
                            number={isLoading ? "..." : activeEnterprises}
                            icon={<Building2 className="text-green-600" size={24} />}
                            iconBgColor="bg-green-100"
                            lineBorderClass="border-green-500"
                        />
                        <NumberCard
                            title="Total Plans"
                            number={isLoading ? "..." : totalPlans}
                            icon={<Handshake className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                        <NumberCard
                            title="Active Trials"
                            number={isLoading ? "..." : trialCount}
                            icon={<Target className="text-purple-600" size={24} />}
                            iconBgColor="bg-purple-100"
                            lineBorderClass="border-purple-500"
                        />
                    </div>

                    {/* ── TABLE ── */}
                    <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                <tr>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">ID</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Enterprise</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Contact</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Plan</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Status</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Onboarding</th>
                                    <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading enterprises...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 p-8 bg-red-50 rounded-sm border border-red-100 max-w-sm mx-auto">
                                                <AlertCircle className="w-10 h-10 text-red-500" />
                                                <p className="text-gray-700 font-bold text-sm">Failed to load enterprises</p>
                                                <button onClick={refetch} className="px-5 py-2 bg-red-600 text-white rounded-sm font-bold text-xs uppercase hover:bg-red-700 transition">
                                                    Try Again
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : enterprises.length > 0 ? (
                                    enterprises.map((ent) => (
                                        <tr
                                            key={ent.id}
                                            className="border-t hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                            onClick={() => navigate(`/superadmin/enterprises/${ent.id}`)}
                                        >
                                            <td className="py-3 px-4">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">ENT-{ent.id}</span>
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-200 shrink-0">
                                                        {ent.businessName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 text-sm">{ent.businessName}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{ent.businessType || "Enterprise"}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="font-bold text-gray-800 text-sm">{ent.firstName} {ent.lastName}</div>
                                                <div className="text-[11px] text-gray-400 font-medium">{ent.email}</div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-sm border border-orange-100">
                                                    {ent.plan || "—"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4">
                                                {getStatusBadge(ent.status)}
                                            </td>

                                            <td className="py-3 px-4">
                                                <span className="text-sm font-bold text-gray-600">
                                                    {ent.onboardingDate ? new Date(ent.onboardingDate).toLocaleDateString() : "N/A"}
                                                </span>
                                            </td>

                                            {/* ACTION */}
                                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/superadmin/enterprises/${ent.id}`)}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedEnterprise(ent); setIsEditOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all"
                                                        title="Edit Enterprise"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedEnterprise(ent); setIsDeleteOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all"
                                                        title="Delete Enterprise"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                                                    <Building2 className="text-orange-400 opacity-60" size={36} />
                                                </div>
                                                <h3 className="font-bold text-gray-700 text-base">No enterprises found</h3>
                                                <p className="text-sm text-gray-400 font-medium">
                                                    {searchTerm ? `No results for "${searchTerm}"` : "Add your first enterprise to get started"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── PAGINATION ── */}
                    {!isLoading && enterprises.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">
                                Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total}</span> Enterprises
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
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === pageNum
                                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
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
            <AddEnterpriseModal
                isOpen={isAddEnterpriseOpen}
                onClose={() => setIsAddEnterpriseOpen(false)}
            />
            <EditEnterpriseModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                enterprise={selectedEnterprise}
            />
            <DeleteEnterpriseModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                enterprise={selectedEnterprise}
            />
        </DashboardLayout>
    );
}
