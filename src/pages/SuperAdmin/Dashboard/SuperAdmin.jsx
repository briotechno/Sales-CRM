import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Users, TrendingUp, DollarSign, Briefcase, Activity, Home, ShieldCheck,
    Globe, Database, Calendar, ChevronDown, Plus, Key, AlertTriangle,
    ArrowRight, Clock, CheckCircle2, Layers, CreditCard,
    Zap, RefreshCw, XCircle, Loader2
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Legend
} from "recharts";
import NumberCard from "../../../components/NumberCard";
import {
    useGetSuperAdminDashboardStatsQuery,
    useGetEnterpriseGrowthQuery,
    useGetRevenueAnalyticsQuery,
    useGetSubscriptionDistributionQuery,
    useGetUpgradeDowngradeTrendsQuery,
    useGetProductKeyStatsQuery,
    useGetChurnAlertsQuery,
    useGetRecentEnterprisesQuery,
    useGetUsageStatsQuery,
} from "../../../store/api/superAdminApi";

const COLORS = ["#FF7B1D", "#3B82F6", "#10B981", "#8B5CF6", "#F43F5E"];

// ── SKELETON LOADER ────────────────────────────────────────────
function SkeletonBox({ className = "" }) {
    return <div className={`animate-pulse bg-gray-100 rounded-sm ${className}`} />;
}

// ── EMPTY STATE ────────────────────────────────────────────────
function EmptyState({ icon: Icon = XCircle, message = "No data available" }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-300">
            <Icon size={40} className="mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">{message}</p>
        </div>
    );
}

// ── SECTION HEADER ─────────────────────────────────────────────
function SectionHeader({ title, isLoading, onRefetch }) {
    return (
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
            {onRefetch && (
                <button
                    onClick={onRefetch}
                    disabled={isLoading}
                    className="p-1.5 rounded-sm border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-300 transition"
                    title="Refresh"
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                </button>
            )}
        </div>
    );
}

export default function SuperAdmin() {
    const navigate = useNavigate();
    const [dateFilter, setDateFilter] = useState("Last 6 Months");

    // ── API QUERIES ──────────────────────────────────────────────
    const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetSuperAdminDashboardStatsQuery(dateFilter);
    const { data: growthData, isLoading: growthLoading, refetch: refetchGrowth } = useGetEnterpriseGrowthQuery(dateFilter);
    const { data: revenueData, isLoading: revenueLoading, refetch: refetchRevenue } = useGetRevenueAnalyticsQuery(dateFilter);
    const { data: subDistData, isLoading: subDistLoading, refetch: refetchSubDist } = useGetSubscriptionDistributionQuery(dateFilter);
    const { data: upgradeData, isLoading: upgradeLoading, refetch: refetchUpgrade } = useGetUpgradeDowngradeTrendsQuery(dateFilter);
    const { data: keyStatsData, isLoading: keyStatsLoading, refetch: refetchKeyStats } = useGetProductKeyStatsQuery(dateFilter);
    const { data: churnData, isLoading: churnLoading, refetch: refetchChurn } = useGetChurnAlertsQuery();
    const { data: recentEntData, isLoading: recentLoading, refetch: refetchRecent } = useGetRecentEnterprisesQuery();
    const { data: usageData, isLoading: usageLoading, refetch: refetchUsage } = useGetUsageStatsQuery(dateFilter);

    // ── PROCESSED DATA ───────────────────────────────────────────
    const stats = statsData?.data || {};
    const enterpriseGrowth = growthData?.data || [];
    const revenueAnalytics = revenueData?.data || [];
    const subscriptionDist = subDistData?.data || [];
    const upgradeTrends = upgradeData?.data || [];
    const keyStats = keyStatsData?.data || {};
    const churnAlerts = churnData?.data || [];
    const recentEnterprises = recentEntData?.data || [];
    const usageStats = usageData?.data || {};

    const productKeyStatsList = [
        { label: "Generated Today", value: keyStats.generatedToday ?? "-", icon: <Key size={16} className="text-blue-500" />, bgColor: "bg-blue-50" },
        { label: "Redeemed Today", value: keyStats.redeemedToday ?? "-", icon: <CheckCircle2 size={16} className="text-green-500" />, bgColor: "bg-green-50" },
        { label: "Expired/Unused", value: keyStats.expiredUnused ?? "-", icon: <AlertTriangle size={16} className="text-orange-500" />, bgColor: "bg-orange-50" },
        { label: "Total Active Keys", value: keyStats.totalActive ?? "-", icon: <Database size={16} className="text-purple-500" />, bgColor: "bg-purple-50" },
    ];

    const formatCurrency = (value) => {
        if (!value && value !== 0) return "-";
        const num = Number(value);
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
        return `₹${num.toLocaleString()}`;
    };

    const refetchAll = () => {
        refetchStats(); refetchGrowth(); refetchRevenue(); refetchSubDist();
        refetchUpgrade(); refetchKeyStats(); refetchChurn(); refetchRecent(); refetchUsage();
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* ── HEADER ── */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <ShieldCheck className="text-[#FF7B1D]" />
                                Super Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                                <Home className="text-gray-700" size={14} />
                                <span className="text-gray-400">CRM /</span>
                                <span className="text-[#FF7B1D]">Super Admin</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative group">
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition shadow-sm">
                                    <Calendar size={18} className="text-gray-500" />
                                    <span className="text-sm font-bold text-gray-700">{dateFilter}</span>
                                    <ChevronDown size={14} className="text-gray-500" />
                                </div>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                >
                                    <option value="Today">Today</option>
                                    <option value="Last 7 Days">Last 7 Days</option>
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="Last 6 Months">Last 6 Months</option>
                                    <option value="Last 1 Year">Last 1 Year</option>
                                    <option value="All Time">All Time</option>
                                </select>
                            </div>

                            <button
                                onClick={() => navigate("/superadmin/enterprises")}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition active:scale-95 text-sm"
                            >
                                <Plus size={20} /> New Enterprise
                            </button>

                            <button
                                onClick={() => navigate("/superadmin/productkeys")}
                                className="px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-sm flex items-center gap-2 font-bold shadow-md hover:from-gray-900 hover:to-black transition active:scale-95 text-sm"
                            >
                                <Key size={20} /> Generate Key
                            </button>

                            <button
                                onClick={refetchAll}
                                className="p-2.5 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 text-gray-600 transition shadow-sm active:scale-95"
                                title="Refresh All"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT ── */}
                <div className="px-6 py-6 space-y-8 pb-12">

                    {/* ── TOP STATS CARDS ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statsLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-sm shadow-sm p-5">
                                    <SkeletonBox className="h-4 w-24 mb-3" />
                                    <SkeletonBox className="h-8 w-20 mb-2" />
                                    <SkeletonBox className="h-3 w-12" />
                                </div>
                            ))
                        ) : (
                            <>
                                <NumberCard
                                    title="Total Enterprises"
                                    number={stats.totalEnterprises ?? "0"}
                                    icon={<Briefcase className="text-blue-600" size={24} />}
                                    iconBgColor="bg-blue-100"
                                    lineBorderClass="border-blue-500"
                                />
                                <NumberCard
                                    title="Active Subscriptions"
                                    number={stats.activeSubscriptions ?? "0"}
                                    icon={<ShieldCheck className="text-green-600" size={24} />}
                                    iconBgColor="bg-green-100"
                                    lineBorderClass="border-green-500"
                                />
                                <NumberCard
                                    title="Total Users"
                                    number={stats.totalUsers ?? "0"}
                                    icon={<Users className="text-[#FF7B1D]" size={24} />}
                                    iconBgColor="bg-orange-100"
                                    lineBorderClass="border-[#FF7B1D]"
                                />
                                <NumberCard
                                    title="Total Revenue"
                                    number={formatCurrency(stats.monthlyRevenue)}
                                    icon={<DollarSign className="text-purple-600" size={24} />}
                                    iconBgColor="bg-purple-100"
                                    lineBorderClass="border-purple-500"
                                />
                            </>
                        )}
                    </div>

                    {/* ── USER & PRODUCT USAGE ── */}
                    <div>
                        <SectionHeader title="User & Product Usage" isLoading={usageLoading} onRefetch={refetchUsage} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Left: Engagement Stats */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex flex-col justify-center space-y-8">
                                {usageLoading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <SkeletonBox className="h-3 w-32 mb-2" />
                                                <SkeletonBox className="h-8 w-20" />
                                            </div>
                                            <SkeletonBox className="h-14 w-14 rounded-sm" />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Active Users</p>
                                                <h4 className="text-3xl font-black text-gray-800 mt-1">{Number(usageStats.dailyActiveUsers || 0).toLocaleString()}</h4>
                                            </div>
                                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-sm"><Activity className="text-blue-600" size={28} /></div>
                                        </div>
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Weekly Active Users</p>
                                                <h4 className="text-3xl font-black text-gray-800 mt-1">{Number(usageStats.weeklyActiveUsers || 0).toLocaleString()}</h4>
                                            </div>
                                            <div className="p-3 bg-purple-50 border border-purple-100 rounded-sm"><Users className="text-purple-600" size={28} /></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avg. Session Duration</p>
                                                <h4 className="text-3xl font-black text-gray-800 mt-1">{usageStats.avgSessionDuration || "-"}</h4>
                                            </div>
                                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-sm"><Clock className="text-[#FF7B1D]" size={28} /></div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Right: Feature Usage */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Layers size={20} className="text-blue-500" /> Feature Usage
                                    </h3>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-sm">Last 30 Days</span>
                                </div>
                                <div className="p-6 flex-grow flex justify-center flex-col space-y-5">
                                    {usageLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <div key={i}>
                                                <SkeletonBox className="h-3 w-32 mb-2" />
                                                <SkeletonBox className="h-2.5 w-full rounded-full" />
                                            </div>
                                        ))
                                    ) : usageStats.featureUsage?.length > 0 ? (
                                        usageStats.featureUsage.map((feature, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="font-bold text-gray-700 text-sm">{feature.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        {feature.activeUsers !== undefined && (
                                                            <span className="text-[11px] text-gray-400 font-medium">
                                                                {feature.activeUsers} user{feature.activeUsers !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                        <span className="font-black text-gray-800 text-sm">{feature.usage}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-700 ${feature.usage === 0
                                                            ? 'bg-gray-200 w-0'
                                                            : feature.usage > 75 ? 'bg-green-500'
                                                                : feature.usage > 50 ? 'bg-blue-500'
                                                                    : feature.usage > 25 ? 'bg-orange-500'
                                                                        : 'bg-rose-400'
                                                            }`}
                                                        style={{ width: `${Math.max(feature.usage, feature.usage > 0 ? 2 : 0)}%` }}
                                                    />
                                                </div>
                                                {feature.usage === 0 && (
                                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">No activity in last 30 days</p>
                                                )}
                                            </div>
                                        ))
                                    ) : <EmptyState icon={Layers} message="No feature usage data" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SUBSCRIPTION ANALYTICS ── */}
                    <div>
                        <SectionHeader title="Subscription Analytics" isLoading={subDistLoading || upgradeLoading} onRefetch={() => { refetchSubDist(); refetchUpgrade(); }} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Plan Distribution */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="bg-gray-50 p-4 border-b">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Globe size={20} className="text-blue-500" /> Plan Distribution
                                    </h3>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-center">
                                    {subDistLoading ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <SkeletonBox className="h-48 w-48 rounded-full" />
                                            <div className="flex gap-4"><SkeletonBox className="h-4 w-16" /><SkeletonBox className="h-4 w-16" /></div>
                                        </div>
                                    ) : subscriptionDist.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={subscriptionDist}
                                                        cx="50%" cy="50%"
                                                        innerRadius={60} outerRadius={80}
                                                        paddingAngle={5} dataKey="value"
                                                    >
                                                        {subscriptionDist.map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="flex justify-center gap-6 mt-4">
                                                {subscriptionDist.map((entry, index) => (
                                                    <div key={entry.name} className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                                        <span className="text-xs font-medium text-gray-600">{entry.name} ({entry.value})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : <EmptyState icon={Globe} message="No subscription data" />}
                                </div>
                            </div>

                            {/* Upgrade / Downgrade Trends */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Zap size={20} className="text-[#FF7B1D]" /> Upgrade / Downgrade Trends
                                    </h3>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-center">
                                    {upgradeLoading ? (
                                        <SkeletonBox className="h-60 w-full" />
                                    ) : upgradeTrends.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={upgradeTrends} barSize={20}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                                <Bar dataKey="upgrades" name="Upgrades" fill="#10B981" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="downgrades" name="Downgrades" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : <EmptyState icon={Zap} message="No trend data" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── QUICK ADMIN ACTIONS ── */}
                    <div>
                        <SectionHeader title="Quick Admin Actions" />
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { label: "Enterprise Management", icon: Briefcase, color: "orange", path: "/superadmin/enterprises" },
                                { label: "Product Keys", icon: Key, color: "purple", path: "/superadmin/productkeys" },
                                { label: "Plan Management", icon: CreditCard, color: "blue", path: "/superadmin/plans" },
                                { label: "Subscriptions", icon: ShieldCheck, color: "green", path: "/superadmin/subscriptions" },
                                { label: "Payment Gateways", icon: DollarSign, color: "rose", path: "/superadmin/paymentgateways" },
                            ].map((action) => {
                                const colorMap = {
                                    orange: { border: "hover:border-[#FF7B1D]", icon: "bg-orange-50 text-[#FF7B1D] border-orange-100 group-hover:bg-[#FF7B1D] group-hover:text-white" },
                                    purple: { border: "hover:border-purple-500", icon: "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white" },
                                    blue: { border: "hover:border-blue-500", icon: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white" },
                                    green: { border: "hover:border-green-500", icon: "bg-green-50 text-green-600 border-green-100 group-hover:bg-green-600 group-hover:text-white" },
                                    rose: { border: "hover:border-rose-500", icon: "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white" },
                                };
                                const c = colorMap[action.color];
                                return (
                                    <button
                                        key={action.label}
                                        onClick={() => navigate(action.path)}
                                        className={`flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-sm shadow-sm ${c.border} hover:shadow-md transition-all group active:scale-95`}
                                    >
                                        <div className={`p-3 rounded-full mb-3 border transition-colors ${c.icon}`}>
                                            <action.icon size={24} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 text-center leading-tight">{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── REVENUE & ENTERPRISE ANALYTICS ── */}
                    <div>
                        <SectionHeader title="Revenue & Enterprise Analytics" isLoading={growthLoading || revenueLoading} onRefetch={() => { refetchGrowth(); refetchRevenue(); }} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Enterprise Growth */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <TrendingUp size={20} className="text-[#FF7B1D]" /> Enterprise Growth (6 Months)
                                    </h3>
                                </div>
                                <div className="p-6">
                                    {growthLoading ? <SkeletonBox className="h-60 w-full" /> :
                                        enterpriseGrowth.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <AreaChart data={enterpriseGrowth}>
                                                    <defs>
                                                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#FF7B1D" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#FF7B1D" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                    <Tooltip />
                                                    <Area type="monotone" dataKey="enterprises" stroke="#FF7B1D" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : <EmptyState icon={TrendingUp} message="No growth data yet" />}
                                </div>
                            </div>

                            {/* Revenue Analytics */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <DollarSign size={20} className="text-purple-600" /> Revenue Analytics
                                    </h3>
                                </div>
                                <div className="p-6">
                                    {revenueLoading ? <SkeletonBox className="h-60 w-full" /> :
                                        revenueAnalytics.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={revenueAnalytics} barSize={30}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb' }} formatter={(v) => [formatCurrency(v), "Revenue"]} />
                                                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : <EmptyState icon={DollarSign} message="No revenue data yet" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── PRODUCT KEY ACTIVITY + CHURN ALERTS + RECENT ENTERPRISES ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Churn Alerts */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                            <div className="p-4 border-b bg-rose-50/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-rose-500" /> Churn Alerts
                                </h3>
                                {churnAlerts.length > 0 && (
                                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-sm">
                                        {churnAlerts.length} Alert{churnAlerts.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="divide-y divide-gray-100">
                                {churnLoading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="p-4">
                                            <SkeletonBox className="h-4 w-32 mb-2" />
                                            <SkeletonBox className="h-3 w-24 mb-2" />
                                            <SkeletonBox className="h-3 w-16" />
                                        </div>
                                    ))
                                ) : churnAlerts.length > 0 ? (
                                    churnAlerts.slice(0, 4).map((alert, idx) => (
                                        <div key={idx} className="p-4 hover:bg-gray-50 transition-colors relative group">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-800 text-sm tracking-tight">{alert.enterprise}</h4>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${alert.alertStatus === 'Critical' ? 'bg-rose-100 text-rose-700' : alert.alertStatus === 'Warning' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {alert.alertStatus}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium">{alert.plan} Plan &bull; {alert.reason}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-sm flex items-center gap-1">
                                                    <Clock size={11} /> Expires in {alert.daysLeft} days
                                                </span>
                                                <button
                                                    onClick={() => navigate("/superadmin/subscriptions")}
                                                    className="text-xs font-bold text-[#FF7B1D] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Review <ArrowRight size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState icon={CheckCircle2} message="No upcoming churn" />
                                )}
                            </div>
                            {churnAlerts.length > 0 && (
                                <div className="p-3 border-t bg-gray-50 text-center">
                                    <button
                                        onClick={() => navigate("/superadmin/subscriptions")}
                                        className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-widest"
                                    >
                                        View All Alerts
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Product Key Activity */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 flex flex-col">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Key size={20} className="text-purple-600" /> Product Key Activity
                                </h3>
                                <button
                                    onClick={() => navigate("/superadmin/productkeys")}
                                    className="text-purple-600 text-sm font-bold hover:underline"
                                >Manage</button>
                            </div>
                            <div className="p-4 space-y-3 flex-grow flex flex-col justify-center">
                                {keyStatsLoading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="flex justify-between p-3 border border-gray-100 rounded-sm">
                                            <SkeletonBox className="h-4 w-32" />
                                            <SkeletonBox className="h-4 w-8" />
                                        </div>
                                    ))
                                ) : (
                                    productKeyStatsList.map((stat, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-purple-200 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-sm ${stat.bgColor}`}>{stat.icon}</div>
                                                <span className="text-sm font-bold text-gray-700">{stat.label}</span>
                                            </div>
                                            <span className="text-lg font-black text-gray-800">{stat.value}</span>
                                        </div>
                                    ))
                                )}
                                <div className="mt-2 pt-3 border-t border-gray-100 flex justify-center">
                                    <button
                                        onClick={() => navigate("/superadmin/productkeys")}
                                        className="flex items-center gap-1.5 text-xs font-bold bg-purple-50 text-purple-700 px-4 py-2 rounded-sm hover:bg-purple-100 transition-colors w-full justify-center border border-purple-100 shadow-sm"
                                    >
                                        <Plus size={14} /> Generate Bulk Keys
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Enterprise Onboarding */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Recent Onboarding</h3>
                                <button
                                    onClick={() => navigate("/superadmin/enterprises")}
                                    className="text-[#FF7B1D] text-sm font-bold hover:underline"
                                >View All</button>
                            </div>
                            <div className="flex-grow overflow-y-auto divide-y divide-gray-100">
                                {recentLoading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="p-4 flex justify-between">
                                            <div>
                                                <SkeletonBox className="h-4 w-28 mb-1" />
                                                <SkeletonBox className="h-3 w-20" />
                                            </div>
                                            <SkeletonBox className="h-6 w-16 rounded-sm" />
                                        </div>
                                    ))
                                ) : recentEnterprises.length > 0 ? (
                                    recentEnterprises.map((ent, idx) => (
                                        <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-sm font-bold text-gray-800 block">{ent.name}</span>
                                                    <span className="text-xs text-gray-400">{ent.owner} &bull; {ent.date}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase block mb-1 ${ent.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : ent.plan === 'Professional' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {ent.plan || "—"}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${ent.status === 'Active' ? 'bg-green-100 text-green-700' : ent.status === 'Trial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {ent.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : <EmptyState icon={Briefcase} message="No enterprises yet" />}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
