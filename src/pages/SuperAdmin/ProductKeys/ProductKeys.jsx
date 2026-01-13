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
    Check
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
        users: 0
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filterRef = useRef(null);

    // FETCH DATA
    const { data: response, isLoading, isError, refetch } = useGetProductKeysQuery({
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

    // Set default plan when plans load
    useEffect(() => {
        if (plansList.length > 0 && !quickData.plan) {
            setQuickData(prev => ({ ...prev, plan: plansList[0].name }));
        }
    }, [plansList]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleQuickGenerate = async () => {
        if (!quickData.enterprise || !quickData.users || !quickData.plan) {
            toast.error("Please fill enterprise, plan and user fields");
            return;
        }

        try {
            await createProductKey(quickData).unwrap();
            toast.success("Product key generated successfully");
            setQuickData({ enterprise: "", plan: plansList[0]?.name || "", validity: "1 Month", users: 0 });
        } catch (error) {
            toast.error("Failed to generate key");
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
            <div className="min-h-screen">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-30 mb-3">
                    <div className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        {/* Title & Breadcrumb */}
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <KeyRound className="text-[#FF7B1D]" /> Product Keys
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Home size={14} className="text-gray-400" /> Super Admin /{" "}
                                <span className="text-[#FF7B1D] font-semibold">Product Keys</span>
                            </p>
                        </div>

                        {/* Search, Filter, Add */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            {/* Filter */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`p-3 border rounded-sm shadow-sm transition-all ${isFilterOpen || filterStatus !== "all"
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                        : "bg-white text-gray-700"
                                        }`}
                                >
                                    <Filter size={20} />
                                </button>
                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-sm shadow-lg z-50">
                                        <div className="p-3 border-b bg-gray-50 text-xs font-bold text-gray-500">
                                            Filter Status
                                        </div>
                                        {["all", "active", "inactive", "pending"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status);
                                                    setIsFilterOpen(false);
                                                    setCurrentPage(1);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${filterStatus === status ? "bg-orange-50 text-orange-600 font-bold" : "hover:bg-gray-100"}`}
                                            >
                                                {status.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search keys..."
                                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-sm text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            {/* Add */}
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition"
                            >
                                <Plus size={20} />
                                Generate New Key
                            </button>

                        </div>
                    </div>
                </div>

                {/* Quick Generate Card */}
                <div className="mx-6 mb-6 bg-white rounded-sm shadow-lg border border-gray-100 px-6 py-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-tight">
                        <RefreshCw size={18} className="text-orange-500" />
                        Quick Generate
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Enterprise</label>
                            <select
                                value={quickData.enterprise}
                                onChange={(e) => setQuickData({ ...quickData, enterprise: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold transition"
                            >
                                <option value="">Select Enterprise</option>
                                {enterprisesList.map(ent => (
                                    <option key={ent.id} value={ent.businessName}>{ent.businessName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Plan Type</label>
                            <select
                                value={quickData.plan}
                                onChange={(e) => setQuickData({ ...quickData, plan: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold cursor-pointer transition"
                            >
                                {isPlansLoading ? (
                                    <option>Loading plans...</option>
                                ) : (
                                    plansList.map(p => (
                                        <option key={p.id} value={p.name}>{p.name} Plan</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Validity</label>
                            <select
                                value={quickData.validity}
                                onChange={(e) => setQuickData({ ...quickData, validity: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold cursor-pointer transition"
                            >
                                <option>1 Month</option>
                                <option>3 Months</option>
                                <option>1 Year</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Users Limit</label>
                            <input
                                type="number"
                                placeholder="50"
                                value={quickData.users}
                                onChange={(e) => setQuickData({ ...quickData, users: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold transition"
                            />
                        </div>

                        {/* Generate Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleQuickGenerate}
                                disabled={isGenerating}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                {isGenerating ? "Generating..." : "Generate Key"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Keys Table */}
                <div className="mx-6 bg-white rounded-sm shadow-lg overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white sticky top-0">
                            <tr>
                                <th className="px-4 py-4 text-left text-sm font-semibold">ID</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Assigned To</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Plan</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Users</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Generated On</th>
                                <th className="px-4 py-4 text-right text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-sm font-medium text-gray-500">
                                        <div className="flex flex-col items-center gap-3 font-semibold">
                                            <Loader2 size={30} className="text-orange-500 animate-spin" />
                                            <p>Loading license keys...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <XCircle size={30} className="text-red-500" />
                                            <p className="text-gray-500 text-sm font-semibold">Error loading keys</p>
                                            <button onClick={() => refetch()} className="text-orange-500 text-sm font-bold hover:underline">Try Again</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : productKeys.length > 0 ? (
                                productKeys.map((pk) => (
                                    <tr key={pk.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-semibold text-sm">KEY-{pk.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-gray-800 text-sm">{pk.enterprise}</div>
                                            <div className="flex items-center gap-2 group/copy">
                                                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{pk.product_key}</div>
                                                <button
                                                    onClick={() => handleCopy(pk.product_key)}
                                                    className="p-1 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-sm transition-all opacity-0 group-hover/copy:opacity-100"
                                                    title="Copy Key"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-700">{pk.plan}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-semibold ${pk.status === "Active"
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
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-600">{pk.users}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-500">{new Date(pk.generatedOn).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleCopy(pk.product_key)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
                                                    title="Copy Key"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedKey(pk); setIsViewOpen(true); }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedKey(pk); setIsEditOpen(true); }}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                                                    title="Edit Key"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedKey(pk); setIsDeleteOpen(true); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                                                    title="Delete Key"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                                                <KeyRound className="text-orange-500" size={32} />
                                            </div>
                                            <h3 className="font-bold text-gray-800 uppercase tracking-tight">No keys found</h3>
                                            <p className="text-sm text-gray-500 font-semibold tracking-wide">
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
                <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 mx-6 rounded-sm border shadow-sm mb-10 font-semibold">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{indexOfLastItem}</span> of <span className="font-bold">{pagination.total}</span> license keys
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Previous
                        </button>

                        {Array.from({ length: pagination.totalPages }, (_, i) => {
                            let pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-9 h-9 border rounded-sm text-sm font-bold transition-all ${currentPage === pageNum
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={handleNext}
                            disabled={currentPage === pagination.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Next
                        </button>
                    </div>
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
