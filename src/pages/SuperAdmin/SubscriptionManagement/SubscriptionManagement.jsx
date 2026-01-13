import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Building2,
    Search,
    Filter,
    Eye,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Plus,
    Home,
    CreditCard,
    Handshake,
    Target,
    Users,
    Loader2,
} from "lucide-react";
import NumberCard from "../../../components/NumberCard";
import AddSubscriptionModal from "../../../components/SubscriptionManagement/AddSubscriptionModal";
import ViewSubscriptionModal from "../../../components/SubscriptionManagement/ViewSubscriptionModal";
import EditSubscriptionModal from "../../../components/SubscriptionManagement/EditSubscriptionModal";
import DeleteSubscriptionModal from "../../../components/SubscriptionManagement/DeleteSubscriptionModal";
import { useGetSubscriptionsQuery } from "../../../store/api/subscriptionApi";

export default function SubscriptionManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filterRef = useRef(null);

    // FETCH DATA
    const { data: response, isLoading, isError, refetch } = useGetSubscriptionsQuery({
        status: filterStatus,
        searchTerm: searchTerm,
        page: currentPage,
        limit: itemsPerPage
    });

    const subscriptions = response?.data || [];
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

    const totalSubscriptions = pagination.total;
    const activeSubscriptions = subscriptions.filter(s => s.status === "Active").length;
    const totalUsers = subscriptions.reduce((acc, s) => acc + (parseInt(s.users) || 0), 0);
    const totalPlans = new Set(subscriptions.map(s => s.plan)).size;

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

    return (
        <DashboardLayout>
            <div className="min-h-screen">

                {/* HEADER */}
                <div className="bg-white border-b sticky top-0 z-30 mb-3">
                    <div className="px-6 py-4 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <CreditCard className="text-[#FF7B1D]" />
                                Subscription Management
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Home size={14} />
                                Super Admin / <span className="text-[#FF7B1D]">Subscriptions</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">

                            {/* FILTER */}
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
                                            Filter by Status
                                        </div>
                                        {["all", "active", "inactive", "trial", "expired"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status);
                                                    setIsFilterOpen(false);
                                                    setCurrentPage(1);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${filterStatus === status
                                                    ? "bg-orange-50 text-orange-600 font-bold"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                {status.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SEARCH */}
                            <div className="relative">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search subscriptions..."
                                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-sm text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            {/* ADD */}
                            <button
                                onClick={() => setIsAddSubscriptionOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition"
                            >
                                <Plus size={20} />
                                Add Subscription
                            </button>

                        </div>
                    </div>
                </div>

                {/* Statement Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 mb-6">
                    <NumberCard
                        title="Total Subscription"
                        number={isLoading ? "..." : totalSubscriptions}
                        icon={<Users className="text-blue-600" size={24} />}
                        iconBgColor="bg-blue-100"
                        lineBorderClass="border-blue-500"
                    />
                    <NumberCard
                        title="Active Subscription"
                        number={isLoading ? "..." : activeSubscriptions}
                        icon={<CreditCard className="text-green-600" size={24} />}
                        iconBgColor="bg-green-100"
                        lineBorderClass="border-green-500"
                    />
                    <NumberCard
                        title="Total Plan"
                        number={isLoading ? "..." : totalPlans}
                        icon={<Handshake className="text-orange-600" size={24} />}
                        iconBgColor="bg-orange-100"
                        lineBorderClass="border-orange-500"
                    />
                    <NumberCard
                        title="Total Users"
                        number={isLoading ? "..." : totalUsers}
                        icon={<Target className="text-purple-600" size={24} />}
                        iconBgColor="bg-purple-100"
                        lineBorderClass="border-purple-500"
                    />
                </div>

                {/* TABLE */}
                <div className="mx-6 bg-white rounded-sm shadow-lg overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white sticky top-0">
                            <tr>
                                <th className="px-4 py-4 text-left text-sm font-semibold">ID</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Subscription</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-nowrap">Plan</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Users</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Onboarding</th>
                                <th className="px-4 py-4 text-right text-sm font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-sm font-medium text-gray-500">
                                        <div className="flex flex-col items-center gap-3 font-semibold">
                                            <Loader2 size={30} className="text-orange-500 animate-spin" />
                                            <p>Loading subscriptions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <XCircle size={30} className="text-red-500" />
                                            <p className="text-gray-500 text-sm font-semibold">Error loading data</p>
                                            <button onClick={() => refetch()} className="text-orange-500 text-sm font-bold hover:underline">Try Again</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : subscriptions.length > 0 ? (
                                subscriptions.map((sub) => (
                                    <tr key={sub.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-semibold text-sm">SUB-{sub.id}</td>

                                        <td className="px-4 py-4 font-semibold text-gray-800 text-sm">{sub.enterprise_name}</td>

                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-gray-700 text-sm">{sub.plan}</div>
                                            <div className="text-[11px] text-gray-400 capitalize font-medium">{sub.billingCycle}ly</div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-semibold ${sub.status === "Active" ? "bg-green-100 text-green-700" :
                                                    sub.status === "Trial" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {sub.status === "Active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {sub.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-sm font-semibold text-gray-600">{sub.users}</td>

                                        <td className="px-4 py-4 text-sm font-semibold text-gray-500">{sub.onboardingDate ? new Date(sub.onboardingDate).toLocaleDateString() : 'N/A'}</td>

                                        {/* ACTION */}
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubscription(sub);
                                                        setIsViewOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubscription(sub);
                                                        setIsEditOpen(true);
                                                    }}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubscription(sub);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors">
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
                                                <CreditCard className="text-orange-500" size={32} />
                                            </div>
                                            <h3 className="font-bold text-gray-800">No found subscriptions</h3>
                                            <p className="text-sm text-gray-500 font-semibold">
                                                {searchTerm ? `No results for "${searchTerm}"` : "Add your first subscription to get started"}
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
                        Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{indexOfLastItem}</span> of <span className="font-bold">{pagination.total}</span> subscriptions
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
            <AddSubscriptionModal
                isOpen={isAddSubscriptionOpen}
                onClose={() => setIsAddSubscriptionOpen(false)}
            />
            <ViewSubscriptionModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                subscription={selectedSubscription}
            />
            <EditSubscriptionModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                subscription={selectedSubscription}
            />
            <DeleteSubscriptionModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                subscription={selectedSubscription}
            />
        </DashboardLayout>
    );
}
