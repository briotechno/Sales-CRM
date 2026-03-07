import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Building2,
    Home,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    ShieldOff,
    User,
    Mail,
    Phone,
    Briefcase,
    FileText,
    MapPin,
    Calendar,
    Package,
    Users,
    HardDrive,
    Zap,
    ExternalLink,
    Loader2,
    AlertCircle,
    Edit2,
    Trash2,
    CalendarRange,
    BarChart3,
    Shield,
} from "lucide-react";
import { useGetEnterpriseByIdQuery } from "../../../store/api/enterpriseApi";

export default function EnterpriseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: response, isLoading, isError, refetch } = useGetEnterpriseByIdQuery(id);
    const enterprise = response?.data || response || null;

    // ── Loading ──
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Enterprise Data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ── Error ──
    if (isError || !enterprise) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-sm border border-red-100 max-w-md text-center shadow-lg">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <h2 className="text-xl font-bold text-gray-800">Enterprise Not Found</h2>
                        <p className="text-red-600 font-medium text-sm">Could not load enterprise data. Please try again.</p>
                        <div className="flex gap-3">
                            <button onClick={refetch} className="px-5 py-2 bg-red-600 text-white rounded-sm font-bold text-xs uppercase hover:bg-red-700 transition">
                                Try Again
                            </button>
                            <button onClick={() => navigate("/superadmin/enterprises")} className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-sm font-bold text-xs uppercase hover:bg-gray-50 transition">
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const getStatusBadge = (status) => {
        if (status === "Active") return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                <CheckCircle2 size={14} /> Active
            </span>
        );
        if (status === "Trial") return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                <Clock size={14} /> Trial
            </span>
        );
        if (status === "Suspended") return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-bold bg-red-100 text-red-700 border border-red-200">
                <ShieldOff size={14} /> Suspended
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-bold bg-gray-100 text-gray-600 border border-gray-200">
                <XCircle size={14} /> {status || "Inactive"}
            </span>
        );
    };

    // Usage percentages (mock if not from API)
    const usersUsed = enterprise.usersUsed ?? 0;
    const usersTotal = enterprise.usersLimit ?? enterprise.users ?? 10;
    const usersPercent = usersTotal > 0 ? Math.min(Math.round((usersUsed / usersTotal) * 100), 100) : 0;

    const storageUsed = enterprise.storageUsed ?? 0;
    const storageTotal = enterprise.storageLimit ?? enterprise.storage ?? 10;
    const storagePercent = storageTotal > 0 ? Math.min(Math.round((storageUsed / storageTotal) * 100), 100) : 0;

    const leadsUsed = enterprise.leadsUsed ?? 0;
    const leadsTotal = enterprise.leadsLimit ?? enterprise.leads ?? 100;
    const leadsPercent = leadsTotal > 0 ? Math.min(Math.round((leadsUsed / leadsTotal) * 100), 100) : 0;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">

                {/* ── HEADER ── */}
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-6 py-4 border-b">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate("/superadmin/enterprises")}
                                        className="p-2 hover:bg-gray-100 rounded-sm transition text-gray-500 hover:text-gray-800"
                                        title="Back to Enterprises"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                            <Building2 className="text-[#FF7B1D]" size={24} />
                                            {enterprise.businessName}
                                        </h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Home className="text-gray-700" size={13} />
                                            Super Admin / Enterprises /{" "}
                                            <span className="text-[#FF7B1D] font-medium">ENT-{enterprise.id}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Go to Dashboard */}
                                <button
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition active:scale-95"
                                    title="Enter this enterprise's dashboard"
                                >
                                    <ExternalLink size={16} />
                                    Go to Dashboard
                                </button>
                                <button
                                    className="p-2.5 text-orange-600 hover:bg-orange-50 border border-orange-200 rounded-sm transition"
                                    title="Edit Enterprise"
                                >
                                    <Edit2 size={17} />
                                </button>
                                <button
                                    className="p-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-sm transition"
                                    title="Delete Enterprise"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CONTENT ── */}
                <div className="max-w-8xl mx-auto px-6 py-6 space-y-6">

                    {/* ── TOP IDENTITY CARD ── */}
                    <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-5">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-sm flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/30">
                                    {enterprise.businessName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-black text-white">{enterprise.businessName}</h2>
                                    <p className="text-orange-100 text-sm font-medium">{enterprise.businessType || "Enterprise"}</p>
                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        {getStatusBadge(enterprise.status)}
                                        <span className="text-orange-100 text-xs font-bold uppercase tracking-wider">ENT-{enterprise.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── MAIN GRID ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT: Contact & Plan Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Contact Information */}
                            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <User size={18} /> Contact Information
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow icon={<User size={16} className="text-orange-500" />} label="Contact Person" value={`${enterprise.firstName || ""} ${enterprise.lastName || ""}`.trim() || "N/A"} />
                                    <InfoRow icon={<Mail size={16} className="text-teal-500" />} label="Email Address" value={enterprise.email || "N/A"} />
                                    <InfoRow icon={<Phone size={16} className="text-blue-500" />} label="Mobile Number" value={enterprise.mobileNumber || "N/A"} />
                                    <InfoRow icon={<Briefcase size={16} className="text-indigo-500" />} label="Business Type" value={enterprise.businessType || "N/A"} />
                                    <InfoRow icon={<FileText size={16} className="text-pink-500" />} label="GST Number" value={enterprise.gst || "N/A"} />
                                    <InfoRow icon={<MapPin size={16} className="text-red-500" />} label="Address" value={enterprise.address || "N/A"} />
                                </div>
                            </div>

                            {/* Plan Information */}
                            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Package size={18} /> Plan Information
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow
                                        icon={<Package size={16} className="text-purple-500" />}
                                        label="Current Plan"
                                        value={enterprise.plan || "No Plan"}
                                        highlight
                                    />
                                    <InfoRow
                                        icon={<Shield size={16} className="text-green-500" />}
                                        label="Account Status"
                                        value={enterprise.status || "N/A"}
                                    />
                                    <InfoRow
                                        icon={<Calendar size={16} className="text-blue-500" />}
                                        label="Onboarding Date"
                                        value={enterprise.onboardingDate ? new Date(enterprise.onboardingDate).toLocaleDateString(undefined, { dateStyle: "long" }) : "N/A"}
                                    />
                                    <InfoRow
                                        icon={<CalendarRange size={16} className="text-orange-500" />}
                                        label="Plan Expiry"
                                        value={enterprise.planExpiry ? new Date(enterprise.planExpiry).toLocaleDateString(undefined, { dateStyle: "long" }) : "N/A"}
                                    />
                                    <InfoRow
                                        icon={<Users size={16} className="text-indigo-500" />}
                                        label="User Limit"
                                        value={`${usersTotal} Users`}
                                    />
                                    <InfoRow
                                        icon={<Zap size={16} className="text-yellow-500" />}
                                        label="Monthly Leads"
                                        value={`${leadsTotal} Leads`}
                                    />
                                    <InfoRow
                                        icon={<HardDrive size={16} className="text-gray-500" />}
                                        label="Storage Allocated"
                                        value={`${storageTotal} GB`}
                                    />
                                    <InfoRow
                                        icon={<BarChart3 size={16} className="text-teal-500" />}
                                        label="Billing Cycle"
                                        value={enterprise.billingCycle ? `${enterprise.billingCycle}ly` : "N/A"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Usage Stats */}
                        <div className="space-y-6">

                            {/* Users Usage */}
                            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Users size={18} /> Users Management
                                    </h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <UsageBar
                                        label="Users Added"
                                        used={usersUsed}
                                        total={usersTotal}
                                        percent={usersPercent}
                                        color="blue"
                                        unit="users"
                                    />
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <MiniStat label="Active Users" value={enterprise.activeUsers ?? usersUsed} color="green" />
                                        <MiniStat label="Inactive Users" value={enterprise.inactiveUsers ?? (usersTotal - usersUsed)} color="gray" />
                                    </div>
                                </div>
                            </div>

                            {/* Storage Usage */}
                            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <HardDrive size={18} /> Cloud Storage
                                    </h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <UsageBar
                                        label="Storage Used"
                                        used={storageUsed}
                                        total={storageTotal}
                                        percent={storagePercent}
                                        color="indigo"
                                        unit="GB"
                                    />
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <MiniStat label="Used" value={`${storageUsed} GB`} color="indigo" />
                                        <MiniStat label="Remaining" value={`${Math.max(storageTotal - storageUsed, 0)} GB`} color="green" />
                                    </div>
                                </div>
                            </div>

                            {/* Leads Usage */}
                            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Zap size={18} /> Leads Usage
                                    </h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <UsageBar
                                        label="Leads Consumed"
                                        used={leadsUsed}
                                        total={leadsTotal}
                                        percent={leadsPercent}
                                        color="green"
                                        unit="leads"
                                    />
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <MiniStat label="Used" value={leadsUsed} color="orange" />
                                        <MiniStat label="Remaining" value={Math.max(leadsTotal - leadsUsed, 0)} color="green" />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ── Sub-components ──

const InfoRow = ({ icon, label, value, highlight }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
        <div className="p-2 bg-white rounded-sm shadow-sm shrink-0 mt-0.5">
            {icon}
        </div>
        <div className="min-w-0">
            <div className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-0.5">{label}</div>
            <div className={`text-sm font-bold truncate ${highlight ? "text-orange-600" : "text-gray-800"}`}>{value}</div>
        </div>
    </div>
);

const UsageBar = ({ label, used, total, percent, color, unit }) => {
    const colorMap = {
        blue: "bg-blue-500",
        indigo: "bg-indigo-500",
        green: "bg-green-500",
        orange: "bg-orange-500",
    };
    const bgMap = {
        blue: "bg-blue-100",
        indigo: "bg-indigo-100",
        green: "bg-green-100",
        orange: "bg-orange-100",
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-600">{label}</span>
                <span className="text-xs font-black text-gray-800">{used} / {total} {unit}</span>
            </div>
            <div className={`w-full ${bgMap[color] || "bg-gray-100"} h-2.5 rounded-full overflow-hidden`}>
                <div
                    className={`${colorMap[color] || "bg-orange-500"} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400 font-bold">{percent}% used</span>
                <span className="text-[10px] text-gray-400 font-bold">{Math.max(total - used, 0)} {unit} free</span>
            </div>
        </div>
    );
};

const MiniStat = ({ label, value, color }) => {
    const colorMap = {
        green: "text-green-600 bg-green-50 border-green-100",
        gray: "text-gray-500 bg-gray-50 border-gray-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
    };
    return (
        <div className={`p-3 rounded-sm border text-center ${colorMap[color] || "bg-gray-50 border-gray-100"}`}>
            <div className="text-lg font-black">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
        </div>
    );
};
