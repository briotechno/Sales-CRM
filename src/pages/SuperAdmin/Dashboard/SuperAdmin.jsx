import React from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
    Users,
    TrendingUp,
    DollarSign,
    Briefcase,
    Activity,
    Home,
    ShieldCheck,
    Globe,
    Database,
    Server
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    PieChart,
    Pie,
    Cell
} from "recharts";
import NumberCard from "../../../components/NumberCard";

export default function SuperAdmin() {
    const systemMetrics = [
        { name: "Server CPU", value: "24%", status: "Healthy" },
        { name: "Memory Usage", value: "4.2GB / 8GB", status: "Healthy" },
        { name: "Database Connections", value: "156", status: "Healthy" },
        { name: "API Latency", value: "45ms", status: "Healthy" },
    ];

    const enterpriseData = [
        { month: "Jan", enterprises: 120 },
        { month: "Feb", enterprises: 145 },
        { month: "Mar", enterprises: 180 },
        { month: "Apr", enterprises: 210 },
        { month: "May", enterprises: 260 },
        { month: "Jun", enterprises: 310 },
    ];

    const subscriptionDistribution = [
        { name: "Basic", value: 400 },
        { name: "Professional", value: 300 },
        { name: "Enterprise", value: 200 },
    ];

    const COLORS = ["#FF7B1D", "#3B82F6", "#10B981"];

    const recentEnterprises = [
        { name: "TechVista Solutions", owner: "Harsh Patel", date: "2024-01-10", plan: "Enterprise", status: "Active" },
        { name: "Global Marketing Inc", owner: "Sneha Reddy", date: "2024-01-08", plan: "Professional", status: "Active" },
        { name: "Creative Minds Studio", owner: "Rajesh Kumar", date: "2024-01-05", plan: "Basic", status: "Active" },
        { name: "Innovate AI", owner: "Priya Sharma", date: "2024-01-02", plan: "Enterprise", status: "Trial" },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header */}
                <div className="bg-white border-b my-3">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <ShieldCheck className="text-[#FF7B1D]" />
                                    Super Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400"></span> CRM /{" "}
                                    <span className="text-[#FF7B1D] font-medium">
                                        Super Admin
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay Text */}
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
                    <h1 className="text-white text-4xl font-bold uppercase tracking-wider">
                        Admin page under construction
                    </h1>
                </div>
                {/* Stats Grid */}
                <div className="filter blur-sm pointer-events-none">

                    <div className="p-0 px-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <NumberCard
                                title="Total Enterprises"
                                number={"1,482"}
                                up={"+12%"}
                                icon={<Briefcase className="text-blue-600" size={24} />}
                                iconBgColor="bg-blue-100"
                                lineBorderClass="border-blue-500"
                            />
                            <NumberCard
                                title="Active Subscriptions"
                                number={"956"}
                                up={"+8.5%"}
                                icon={<ShieldCheck className="text-green-600" size={24} />}
                                iconBgColor="bg-green-100"
                                lineBorderClass="border-green-500"
                            />
                            <NumberCard
                                title="Total Users"
                                number={"12,450"}
                                up={"+15%"}
                                icon={<Users className="text-[#FF7B1D]" size={24} />}
                                iconBgColor="bg-orange-100"
                                lineBorderClass="border-[#FF7B1D]"
                            />
                            <NumberCard
                                title="Monthly Revenue"
                                number={"₹1.2Cr"}
                                up={"+22%"}
                                icon={<DollarSign className="text-purple-600" size={24} />}
                                iconBgColor="bg-purple-100"
                                lineBorderClass="border-purple-500"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Enterprise Growth */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <TrendingUp size={20} className="text-[#FF7B1D]" />
                                        Enterprise Growth (6 Months)
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={enterpriseData}>
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
                                </div>
                            </div>

                            {/* Subscription Distribution */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Globe size={20} className="text-blue-500" />
                                        Subscription Distribution
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={subscriptionDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {subscriptionDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-6 mt-4">
                                        {subscriptionDistribution.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                <span className="text-xs font-medium text-gray-600">{entry.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Health and Recent Enterprises */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Enterprises */}
                            <div className="lg:col-span-2 bg-white rounded-sm shadow-sm border border-gray-100">
                                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                    <h3 className="text-lg font-bold text-gray-800">Recent Enterprise Onboarding</h3>
                                    <button className="text-[#FF7B1D] text-sm font-bold hover:underline">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Enterprise</th>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</th>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {recentEnterprises.map((enterprise, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-gray-800">{enterprise.name}</span>
                                                        <p className="text-xs text-gray-400">{enterprise.date}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{enterprise.owner}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${enterprise.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                                                            enterprise.plan === 'Professional' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {enterprise.plan}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${enterprise.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {enterprise.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* System Health */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Activity size={20} className="text-[#FF7B1D]" />
                                        System Health
                                    </h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    {systemMetrics.map((metric, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-500 uppercase">{metric.name}</span>
                                                <span className="text-xs font-bold text-green-600">{metric.status}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
                                                <div className="flex items-center gap-3">
                                                    {idx === 0 && <Server size={16} className="text-orange-500" />}
                                                    {idx === 1 && <Database size={16} className="text-blue-500" />}
                                                    {idx === 2 && <Globe size={16} className="text-green-500" />}
                                                    {idx === 3 && <Activity size={16} className="text-purple-500" />}
                                                    <span className="text-sm font-bold text-gray-800">{metric.value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
