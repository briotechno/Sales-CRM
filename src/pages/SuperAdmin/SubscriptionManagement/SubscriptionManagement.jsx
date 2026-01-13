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
} from "lucide-react";
import NumberCard from "../../../components/NumberCard";
import AddSubscriptionModal from "../../../components/SubscriptionManagement/AddSubscriptionModal";
import ViewSubscriptionModal from "../../../components/SubscriptionManagement/ViewSubscriptionModal";
import EditSubscriptionModal from "../../../components/SubscriptionManagement/EditSubscriptionModal";
import DeleteSubscriptionModal from "../../../components/SubscriptionManagement/DeleteSubscriptionModal";

export default function SubscriptionManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const subscriptions = [
        {
            id: "SUB001",
            name: "TechVista Solutions",
            plan: "Enterprise",
            status: "Active",
            users: 156,
            amount: 16499,
            billingCycle: "Monthly",
            onboardingDate: "2023-11-15",
            expiryDate: "2024-11-15",
            leads: "Unlimited",
            storage: "500GB",
        },
        {
            id: "SUB002",
            name: "Global Marketing Inc",
            plan: "Professional",
            status: "Active",
            users: 45,
            amount: 64990,
            billingCycle: "Yearly",
            onboardingDate: "2023-12-01",
            expiryDate: "2024-12-01",
            leads: "10000",
            storage: "50GB",
        },
        {
            id: "SUB003",
            name: "Creative Minds Studio",
            plan: "Starter",
            status: "Inactive",
            users: 12,
            amount: 2499,
            billingCycle: "Monthly",
            onboardingDate: "2023-12-10",
            expiryDate: "2024-01-10",
            leads: "1000",
            storage: "5GB",
        },
        {
            id: "SUB004",
            name: "Innovate AI",
            plan: "Enterprise",
            status: "Trial",
            users: 80,
            amount: 0,
            billingCycle: "Monthly",
            onboardingDate: "2024-01-02",
            expiryDate: "2024-01-16",
            leads: "Unlimited",
            storage: "500GB",
        },
        {
            id: "SUB005",
            name: "Nexus Healthcare",
            plan: "Professional",
            status: "Inactive",
            users: 65,
            amount: 6499,
            billingCycle: "Monthly",
            onboardingDate: "2023-10-20",
            expiryDate: "2023-11-20",
            leads: "10000",
            storage: "50GB",
        },
    ];

    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === "Active").length;
    const totalUsers = subscriptions.reduce((acc, s) => acc + s.users, 0);
    const totalPlans = new Set(subscriptions.map(s => s.plan)).size;

    // 🔥 FILTER + SEARCH LOGIC
    const filteredSubscriptions = subscriptions.filter((sub) => {
        const matchesSearch = [sub.name, sub.id].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || sub.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                                    className={`p-3 border rounded-sm shadow-sm ${isFilterOpen ? "bg-orange-500 text-white" : "bg-white text-gray-700"
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
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs ${filterStatus === status
                                                    ? "bg-orange-100 text-orange-600 font-bold"
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
                                    className="pl-10 pr-4 py-3 border rounded-sm text-sm w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* ADD */}
                            <button
                                onClick={() => setIsAddSubscriptionOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md"
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
                        number={totalSubscriptions}
                        icon={<Users className="text-blue-600" size={24} />}
                        iconBgColor="bg-blue-100"
                        lineBorderClass="border-blue-500"
                    />
                    <NumberCard
                        title="Active Subscription"
                        number={activeSubscriptions}
                        icon={<CreditCard className="text-green-600" size={24} />}
                        iconBgColor="bg-green-100"
                        lineBorderClass="border-green-500"
                    />
                    <NumberCard
                        title="Total Plan"
                        number={totalPlans}
                        icon={<Handshake className="text-orange-600" size={24} />}
                        iconBgColor="bg-orange-100"
                        lineBorderClass="border-orange-500"
                    />
                    <NumberCard
                        title="Total Users"
                        number={totalUsers}
                        icon={<Target className="text-purple-600" size={24} />}
                        iconBgColor="bg-purple-100"
                        lineBorderClass="border-purple-500"
                    />
                </div>

                {/* TABLE */}
                <div className="px-6 py-4 bg-white rounded-sm shadow-lg overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm">ID</th>
                                <th className="px-4 py-3 text-left text-sm">Subscription</th>
                                <th className="px-4 py-3 text-left text-sm">Plan</th>
                                <th className="px-4 py-3 text-left text-sm">Status</th>
                                <th className="px-4 py-3 text-left text-sm">Users</th>
                                <th className="px-4 py-3 text-left text-sm">Onboarding</th>
                                <th className="px-4 py-3 text-right text-sm">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredSubscriptions.length > 0 ? (
                                filteredSubscriptions.map((sub) => (
                                    <tr key={sub.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-sm">{sub.id}</td>

                                        <td className="px-4 py-3 font-semibold text-gray-800">{sub.name}</td>

                                        <td className="px-4 py-3 text-sm">
                                            <span className="font-semibold text-gray-700">{sub.plan}</span>
                                            <div className="text-[10px] text-gray-400 capitalize">{sub.billingCycle}ly</div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-bold ${sub.status === "Active" ? "bg-green-100 text-green-700" :
                                                        sub.status === "Trial" ? "bg-yellow-100 text-yellow-700" :
                                                            "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {sub.status === "Active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {sub.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm font-medium text-gray-600">{sub.users}</td>

                                        <td className="px-4 py-3 text-sm text-gray-500">{sub.onboardingDate}</td>

                                        {/* ACTION */}
                                        <td className="px-4 py-3">
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
                                    <td colSpan="7" className="py-12 text-center text-gray-500">
                                        No found subscriptions
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
            <AddSubscriptionModal
                isOpen={isAddSubscriptionOpen}
                onClose={() => setIsAddSubscriptionOpen(false)}
                refetchDashboard={() => { }}
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
