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
    Users,
    Plane,
    Projector,
    Target,
    Handshake,
} from "lucide-react";
import NumberCard from "../../../components/NumberCard";
import AddEnterpriseModal from "../../../components/EnterpriseManagement/AddEnterpriseModal";
import ViewEnterpriseModal from "../../../components/EnterpriseManagement/ViewEnterpriseModal";
import EditEnterpriseModal from "../../../components/EnterpriseManagement/EditEnterpriseModal";
import DeleteEnterpriseModal from "../../../components/EnterpriseManagement/DeleteEnterpriseModal";

export default function EnterpriseManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState("all");
    const [isAddEnterpriseOpen, setIsAddEnterpriseOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);

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

    const fetchEnterprises = async () => {
        // API call here
    };
    const refetchDashboard = async () => {
        await fetchEnterprises(); // or whatever API call you use
    };

    const enterprises = [
        {
            id: "ENT001",
            name: "TechVista Solutions",
            owner: "Harsh Patel",
            email: "harsh@techvista.com",
            plan: "Enterprise",
            status: "Active",
            onboardingDate: "2023-11-15",
            users: 156,
        },
        {
            id: "ENT002",
            name: "Global Marketing Inc",
            owner: "Sneha Reddy",
            email: "sneha@globalmkt.com",
            plan: "Professional",
            status: "Active",
            onboardingDate: "2023-12-01",
            users: 45,
        },
        {
            id: "ENT003",
            name: "Creative Minds Studio",
            owner: "Rajesh Kumar",
            email: "rajesh@creativeminds.in",
            plan: "Basic",
            status: "Active",
            onboardingDate: "2023-12-10",
            users: 12,
        },
        {
            id: "ENT004",
            name: "Innovate AI",
            owner: "Priya Sharma",
            email: "priya@innovateai.com",
            plan: "Enterprise",
            status: "Trial",
            onboardingDate: "2024-01-02",
            users: 80,
        },
        {
            id: "ENT005",
            name: "Nexus Healthcare",
            owner: "Dr. Anjali Singh",
            email: "anjali@nexushealth.org",
            plan: "Professional",
            status: "Inactive",
            onboardingDate: "2023-10-20",
            users: 65,
        },
    ];

    const totalEnterprises = enterprises.length;
    const activeEnterprises = enterprises.filter(e => e.status === "Active").length;
    const totalUsers = enterprises.reduce((acc, e) => acc + e.users, 0);
    const totalPlans = new Set(enterprises.map(e => e.plan)).size;

    const filteredEnterprises = enterprises.filter((ent) => {
        const matchesSearch =
            [ent.name, ent.owner, ent.id]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterPriority === "all" ||
            ent.status.toLowerCase() === filterPriority;

        return matchesSearch && matchesStatus;
    });


    return (
        <DashboardLayout>
            <div className="min-h-screen">

                {/* HEADER */}
                <div className="bg-white border-b sticky top-0 z-30 mb-3">
                    <div className="pl-6 py-4 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Building2 className="text-[#FF7B1D]" />
                                Enterprise Management
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Home size={14} />
                                Super Admin / <span className="text-[#FF7B1D]">Enterprise</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            {/* FILTER */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`p-3 border rounded-sm shadow-sm ${isFilterOpen
                                        ? "bg-orange-500 text-white"
                                        : "bg-white text-gray-700"
                                        }`}
                                >
                                    <Filter size={20} />
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-sm shadow-lg z-50">
                                        <div className="p-3 border-b bg-gray-50 text-xs font-bold text-gray-500">
                                            Enterprise Management
                                        </div>
                                        {["all", "active", "inactive", "trial"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterPriority(status);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs ${filterPriority === status
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
                                    placeholder="Search enterprises..."
                                    className="pl-10 pr-4 py-3 border rounded-sm text-sm w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* ADD */}
                            <button
                                onClick={() => setIsAddEnterpriseOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md"
                            >
                                <Plus size={20} />
                                Add Enterprise
                            </button>

                        </div>
                    </div>
                </div>

                {/* Statement Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <NumberCard
                        title="Total Id"
                        number={totalEnterprises}
                        icon={<Users className="text-blue-600" size={24} />}
                        iconBgColor="bg-blue-100"
                        lineBorderClass="border-blue-500"
                    />
                    <NumberCard
                        title="Total Enterprise"
                        number={activeEnterprises}
                        icon={<Building2 className="text-green-600" size={24} />}
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
                <div className="pl-6 py-4 bg-white rounded-sm shadow-lg">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm">ID</th>
                                <th className="px-4 py-3 text-left text-sm">Enterprise</th>
                                <th className="px-4 py-3 text-left text-sm">Plan</th>
                                <th className="px-4 py-3 text-left text-sm">Status</th>
                                <th className="px-4 py-3 text-left text-sm">Users</th>
                                <th className="px-4 py-3 text-left text-sm">Onboarding</th>
                                <th className="px-4 py-3 text-right text-sm">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEnterprises.length > 0 ? (
                                filteredEnterprises.map((ent) => (
                                    <tr key={ent.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-sm">{ent.id}</td>

                                        <td className="px-4 py-3">
                                            <div className="font-semibold">{ent.name}</div>
                                            <div className="text-xs text-gray-400">
                                                {ent.owner} • {ent.email}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm">{ent.plan}</td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-bold ${ent.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {ent.status === "Active" ? (
                                                    <CheckCircle2 size={12} />
                                                ) : (
                                                    <XCircle size={12} />
                                                )}
                                                {ent.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm">{ent.users}</td>
                                        <td className="px-4 py-3 text-sm">{ent.onboardingDate}</td>

                                        {/* ACTION */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedEnterprise(ent);
                                                        setIsViewOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedEnterprise(ent);
                                                        setIsEditOpen(true);
                                                    }}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedEnterprise(ent);
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
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Building2 className="text-orange-500" size={32} />
                                        </div>
                                        <h3 className="font-bold text-gray-800">
                                            No enterprises found
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Add your first enterprise to get started
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddEnterpriseModal
                isOpen={isAddEnterpriseOpen}
                onClose={() => setIsAddEnterpriseOpen(false)}
                refetchDashboard={() => { }}
            />
            <ViewEnterpriseModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                enterprise={selectedEnterprise}
            />
            <EditEnterpriseModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                enterprise={selectedEnterprise}
                refetchDashboard={refetchDashboard}
            />
            <DeleteEnterpriseModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                enterprise={selectedEnterprise}
                refetchDashboard={refetchDashboard}
            />

        </DashboardLayout>
    );
}
