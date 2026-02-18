import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    KeyRound,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Home,
    Plus,
    ArrowRight,
    Eye,
    Edit2,
    Trash2,
    Loader2,
    Copy,
    Check,
    X,
} from "lucide-react";
import AddProductKeyModal from "../../../components/ProductKeys/AddProductKeyModal";
import ViewProductKeyModal from "../../../components/ProductKeys/ViewProductKeyModal";
import EditProductKeyModal from "../../../components/ProductKeys/EditProductKeyModal";
import DeleteProductKeyModal from "../../../components/ProductKeys/DeleteProductKeyModal";
import { useGetProductKeysQuery, useCreateProductKeyMutation } from "../../../store/api/productKeyApi";
import { useGetPlansQuery } from "../../../store/api/planApi";
import { useGetEnterprisesQuery } from "../../../store/api/enterpriseApi";
import { toast } from "react-hot-toast";

export default function ProductKeys() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedKey, setSelectedKey] = useState(null);

    // Quick Generate State
    const [quickData, setQuickData] = useState({
        enterprise: "",
        plan: "",
        validity: "1 Month",
        users: 0,
        leads: 0,
        storage: 0
    });

    const [tempSearch, setTempSearch] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filterRef = useRef(null);

    // FETCH DATA
    const { data: response, isLoading, isError, refetch, isFetching } = useGetProductKeysQuery({
        status: filterStatus,
        searchTerm: searchTerm,
        page: currentPage,
        limit: itemsPerPage
    });

    // FETCH DYNAMIC PLANS
    const { data: plansResponse, isLoading: isPlansLoading } = useGetPlansQuery();
    const plansList = plansResponse?.data || [];

    // FETCH DYNAMIC ENTERPRISES
    const { data: enterprisesResponse } = useGetEnterprisesQuery({ limit: 1000 });
    const enterprisesList = enterprisesResponse?.data || [];

    const [createProductKey, { isLoading: isGenerating }] = useCreateProductKeyMutation();

    const productKeys = response?.data || [];
    const pagination = response?.pagination || { totalPages: 1, total: 0 };

    // Set defaults when plans load or plan selection changes
    useEffect(() => {
        if (plansList.length > 0) {
            const currentPlanName = quickData.plan || plansList[0].name;
            const selectedPlan = plansList.find(p => p.name === currentPlanName);

            if (selectedPlan) {
                setQuickData(prev => {
                    if (prev.plan === currentPlanName && prev.users === selectedPlan.default_users) return prev;
                    return {
                        ...prev,
                        plan: currentPlanName,
                        users: selectedPlan.default_users || 0,
                        leads: selectedPlan.monthly_leads || 0,
                        storage: selectedPlan.default_storage || 0
                    };
                });
            }
        }
    }, [quickData.plan, plansList]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasActiveFilters = filterStatus !== "all" || searchTerm !== "";

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

    const handleQuickGenerate = async () => {
        if (!quickData.enterprise || !quickData.plan) {
            toast.error("Please select Enterprise and Plan");
            return;
        }

        try {
            await createProductKey(quickData).unwrap();
            toast.success("Product key generated successfully");
            // Reset form
            const defaultPlan = plansList.find(p => p.name === quickData.plan) || plansList[0];
            setQuickData({
                enterprise: "",
                plan: defaultPlan?.name || "",
                validity: "1 Month",
                users: defaultPlan?.default_users || 0,
                leads: defaultPlan?.monthly_leads || 0,
                storage: defaultPlan?.default_storage || 0
            });
        } catch (error) {
            toast.error(error?.data?.message || "Failed to generate key");
        }
    };

    const handleCopy = (key) => {
        navigator.clipboard.writeText(key);
        toast.success("Product key copied to clipboard!");
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
                        {/* Title & Breadcrumb */}
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                <KeyRound className="text-[#FF7B1D]" size={26} /> Product Keys
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                                <Home size={14} className="text-gray-700" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D]">Product Keys</span>
                            </p>
                        </div>

                        {/* Search, Filter, Add */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">

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
                                                    setFilterStatus("all");
                                                }}
                                                className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                            >
                                                Reset All
                                            </button>
                                        </div>

                                        <div className="p-5 space-y-6">
                                            {/* Search Input */}
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Keys</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={tempSearch}
                                                        onChange={(e) => setTempSearch(e.target.value)}
                                                        placeholder="Search enterprise or key..."
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Radio Group */}
                                            <div>
                                                <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-3 border-b pb-1">Filter by Status</span>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {["all", "active", "inactive", "pending"].map((status) => (
                                                        <label key={status} className="flex items-center group cursor-pointer p-2 rounded-sm hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100">
                                                            <input
                                                                type="radio"
                                                                name="pk_status"
                                                                checked={filterStatus === status}
                                                                onChange={() => setFilterStatus(status)}
                                                                className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px]"
                                                            />
                                                            <span className={`ml-3 text-xs font-bold transition-colors uppercase ${filterStatus === status ? "text-[#FF7B1D]" : "text-gray-600"}`}>
                                                                {status}
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
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition active:scale-95 text-sm"
                            >
                                <Plus size={20} />
                                Generate Key
                            </button>

                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="max-w-8xl mx-auto px-6 py-6 space-y-6">
                    {/* Quick Generate Card */}
                    <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
                            <h3 className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                                <RefreshCw size={18} className="text-orange-500" />
                                Quick License Generation
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Enterprise</label>
                                    <select
                                        value={quickData.enterprise}
                                        onChange={(e) => setQuickData({ ...quickData, enterprise: e.target.value })}
                                        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs focus:ring-1 focus:ring-orange-500/30 outline-none font-bold text-gray-700 bg-gray-50 hover:bg-white transition"
                                    >
                                        <option value="">Select Enterprise</option>
                                        {enterprisesList.map(ent => (
                                            <option key={ent.id} value={ent.businessName}>{ent.businessName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Type</label>
                                    <select
                                        value={quickData.plan}
                                        onChange={(e) => setQuickData({ ...quickData, plan: e.target.value })}
                                        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs focus:ring-1 focus:ring-orange-500/30 outline-none font-bold text-gray-700 bg-gray-50 hover:bg-white transition"
                                    >
                                        {isPlansLoading ? (
                                            <option>Loading...</option>
                                        ) : (
                                            plansList.map(p => (
                                                <option key={p.id} value={p.name}>{p.name} Plan</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Validity</label>
                                    <select
                                        value={quickData.validity}
                                        onChange={(e) => setQuickData({ ...quickData, validity: e.target.value })}
                                        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs focus:ring-1 focus:ring-orange-500/30 outline-none font-bold text-gray-700 bg-gray-50 hover:bg-white transition"
                                    >
                                        <option>1 Month</option>
                                        <option>3 Months</option>
                                        <option>1 Year</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Users</label>
                                    <input
                                        type="number"
                                        value={quickData.users}
                                        onChange={(e) => setQuickData({ ...quickData, users: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs focus:ring-1 focus:ring-orange-500/30 outline-none font-bold text-gray-700 bg-gray-50 hover:bg-white transition"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Leads</label>
                                    <input
                                        type="number"
                                        value={quickData.leads}
                                        onChange={(e) => setQuickData({ ...quickData, leads: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs focus:ring-1 focus:ring-orange-500/30 outline-none font-bold text-gray-700 bg-gray-50 hover:bg-white transition"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleQuickGenerate}
                                        disabled={isGenerating}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                <tr>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">ID</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">Assigned To</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">Plan</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">Status</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">Users</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400 text-nowrap">Generated On</th>
                                    <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading license keys...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-sm border border-red-100 max-w-sm mx-auto shadow-sm">
                                                <XCircle size={36} className="text-red-500" />
                                                <p className="text-gray-700 font-bold text-sm">Error loading data</p>
                                                <button onClick={() => refetch()} className="px-5 py-2 bg-red-600 text-white rounded-sm font-bold text-xs uppercase hover:bg-red-700 transition active:scale-95 shadow-md">Try Again</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : productKeys.length > 0 ? (
                                    productKeys.map((pk) => (
                                        <tr key={pk.id} className="border-t hover:bg-gray-50 transition-colors font-medium cursor-pointer">
                                            <td className="py-3 px-4 text-xs font-black text-gray-400 uppercase tracking-tight">KEY-{pk.id}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-gray-800 text-sm">{pk.enterprise}</div>
                                                <div className="flex items-center gap-2 group/copy">
                                                    <div className="text-[10px] text-gray-400 font-black tracking-widest">{pk.product_key}</div>
                                                    <button
                                                        onClick={() => handleCopy(pk.product_key)}
                                                        className="p-1 hover:bg-orange-100 text-gray-400 hover:text-orange-600 rounded-sm transition-all opacity-0 group-hover/copy:opacity-100"
                                                        title="Copy Key"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-bold text-gray-700">{pk.plan}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-wider border shadow-sm ${pk.status === "Active"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : pk.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                    }`}>
                                                    {pk.status === "Active" ? <CheckCircle2 size={12} /> :
                                                        pk.status === "Inactive" ? <XCircle size={12} /> :
                                                            <RefreshCw size={12} />}
                                                    {pk.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-bold text-gray-600">{pk.users}</td>
                                            <td className="py-3 px-4 text-sm font-bold text-gray-500">{new Date(pk.generatedOn).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleCopy(pk.product_key)}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-gray-500 hover:text-orange-600 transition-all font-bold"
                                                        title="Copy Key"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedKey(pk); setIsViewOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedKey(pk); setIsEditOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all font-bold"
                                                        title="Edit Key"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedKey(pk); setIsDeleteOpen(true); }}
                                                        className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all"
                                                        title="Delete Key"
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
                                                    <KeyRound className="text-orange-400 opacity-60" size={36} />
                                                </div>
                                                <h3 className="font-bold text-gray-700 text-base">No Found License Keys</h3>
                                                <p className="text-sm text-gray-400 font-medium tracking-wide">
                                                    {searchTerm ? `No results for "${searchTerm}"` : "Add your first license key to get started"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && productKeys.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">
                                Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total}</span> License Keys
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

            <AddProductKeyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
            <ViewProductKeyModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                productKey={selectedKey}
            />
            <EditProductKeyModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                productKey={selectedKey}
            />
            <DeleteProductKeyModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                productKey={selectedKey}
            />
        </DashboardLayout>
    );
}
