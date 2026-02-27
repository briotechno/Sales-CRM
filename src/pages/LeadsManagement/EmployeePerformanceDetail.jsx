import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Users,
    Target,
    Award,
    TrendingUp,
    Activity,
    Clock,
    ChevronLeft,
    Star,
    Mail,
    Phone,
    CheckCircle2,
    Calendar,
    Zap,
    Briefcase
} from "lucide-react";
import { FiHome } from "react-icons/fi";

const teamPerformance = [
    { id: 1, name: "Sarah Johnson", leads: 156, converted: 67, rate: 43, avatar: "SJ", email: "sarah.j@company.com", role: "Sr. Sales Executive", joined: "Jan 2024" },
    { id: 2, name: "Michael Chen", leads: 142, converted: 58, rate: 41, avatar: "MC", email: "michael.c@company.com", role: "Sales Manager", joined: "Mar 2023" },
    { id: 3, name: "Emily Rodriguez", leads: 134, converted: 52, rate: 39, avatar: "ER", email: "emily.r@company.com", role: "Business Developer", joined: "June 2023" },
    { id: 4, name: "David Kim", leads: 128, converted: 48, rate: 38, avatar: "DK", email: "david.k@company.com", role: "Sales Associate", joined: "Oct 2023" },
    { id: 5, name: "Lisa Anderson", leads: 119, converted: 45, rate: 38, avatar: "LA", email: "lisa.a@company.com", role: "Client Relationship Manager", joined: "Feb 2024" },
];

export default function EmployeePerformanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    // Find employee by ID or default to Sarah
    const employee = teamPerformance.find(p => p.id === parseInt(id)) || teamPerformance[0];

    const stats = [
        { title: "Total Leads", value: employee.leads, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Deals Won", value: employee.converted, icon: Target, color: "text-green-600", bg: "bg-green-50" },
        { title: "Success Rate", value: `${employee.rate}%`, icon: Award, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Avg. Response", value: "1.8h", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const activities = [
        { type: "Call", title: "Outbound call to Acme Corp", time: "2 hours ago", status: "Completed" },
        { type: "Lead", title: "New lead 'Global Tech' assigned", time: "5 hours ago", status: "New" },
        { type: "Won", title: "Closed deal with 'Vertex Solutions'", time: "Yesterday", status: "Success" },
        { type: "Meeting", title: "Follow up with Michael Smith", time: "Yesterday", status: "Booked" },
        { type: "Email", title: "Sent quotation to Zenith Inc", time: "2 days ago", status: "Sent" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-8xl mx-auto px-4 py-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/crm/leads/analysis")}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 shadow-sm"
                            >
                                <ChevronLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Performance Profile</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FiHome className="text-gray-700" size={14} />
                                    <span className="text-gray-400">Analysis / </span>
                                    <span className="text-[#FF7B1D] font-medium">Team Performance</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto px-4 py-4 md:px-8 font-primary">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Sidebar - Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden text-center p-8">
                            <div className="relative inline-block mb-6">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                                    {employee.avatar}
                                </div>
                                <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
                            <p className="text-orange-600 font-bold text-sm mb-6 flex items-center justify-center gap-2">
                                <Briefcase size={14} />
                                {employee.role}
                            </p>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-left p-3 rounded-sm bg-gray-50/50 border border-gray-100 hover:border-orange-200 transition-colors">
                                    <Mail size={16} className="text-gray-400" />
                                    <div className="overflow-hidden">
                                        <p className="text-xs uppercase font-bold text-gray-400 tracking-wider leading-none mb-1.5">Email Address</p>
                                        <p className="text-sm font-bold text-gray-700 truncate">{employee.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-left p-3 rounded-sm bg-gray-50/50 border border-gray-100 hover:border-orange-200 transition-colors">
                                    <Calendar size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-400 tracking-wider leading-none mb-1.5">Joining Date</p>
                                        <p className="text-sm font-bold text-gray-700">{employee.joined}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quarterly Progress Section */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Target size={18} className="text-orange-500" />
                                Q1 Goal Progress
                            </h3>
                            <div className="flex flex-col items-center">
                                <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="72"
                                            cy="72"
                                            r="64"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            fill="transparent"
                                            className="text-gray-100"
                                        />
                                        <circle
                                            cx="72"
                                            cy="72"
                                            r="64"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            fill="transparent"
                                            strokeDasharray={402}
                                            strokeDashoffset={402 * (1 - 0.78)}
                                            strokeLinecap="round"
                                            className="text-orange-500 transition-all duration-1000 shadow-sm"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-gray-800 leading-none">78%</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Achieved</p>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div className="text-center border-r border-gray-100">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Current</p>
                                        <p className="text-sm font-black text-gray-800">₹1.2M</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Goal</p>
                                        <p className="text-sm font-black text-[#FF7B1D]">₹1.5M</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Star size={16} className="text-amber-500" />
                                Top Achievements
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-sm bg-amber-50/50 border border-amber-100">
                                    <Award size={22} className="text-amber-600" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-900 leading-none">Deal Closer Pro</p>
                                        <p className="text-xs text-amber-600 mt-1.5 font-bold">Highest Conversions</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-sm bg-blue-50/50 border border-blue-100">
                                    <Activity size={22} className="text-blue-600" />
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 leading-none">Engagement Star</p>
                                        <p className="text-xs text-blue-600 mt-1.5 font-bold">150+ Direct Leads</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm group hover:border-orange-500 transition-all cursor-default">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-sm ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-800 leading-none">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Conversion Trend */}
                            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-orange-50 rounded-sm">
                                            <TrendingUp className="text-orange-600" size={22} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Conversion Trend</h3>
                                    </div>
                                    <div className="flex gap-1 bg-gray-100 p-1 rounded-sm border border-gray-200 overflow-hidden">
                                        <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:bg-white rounded-sm transition-colors">7D</button>
                                        <button className="px-3 py-1 text-xs font-bold bg-white text-orange-600 shadow-sm rounded-sm">30D</button>
                                    </div>
                                </div>

                                <div className="h-56 flex items-end gap-1.5 px-2">
                                    {[45, 60, 40, 80, 55, 90, 75, 45, 65, 85, 30, 95, 40, 60].map((h, i) => (
                                        <div key={i} className="flex-1 group relative flex flex-col items-center">
                                            <div className="absolute -top-10 bg-gray-900 text-xs px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-all z-10 whitespace-nowrap font-bold shadow-xl">
                                                {h}%
                                            </div>
                                            <div
                                                className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-[1px] transition-all origin-bottom hover:brightness-110 active:scale-x-110"
                                                style={{ height: `${h * 1.8}px` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full h-px bg-gray-100 mt-4"></div>
                                <div className="flex justify-between mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <span>Analysis Start</span>
                                    <span>Current Period</span>
                                </div>
                            </div>

                            {/* Lead Status Pipeline Section */}
                            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 bg-orange-50 rounded-sm">
                                        <Activity className="text-orange-600" size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Lead Status Pipeline</h3>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { name: "New Lead", count: 42, color: "bg-blue-500", total: 100 },
                                        { name: "Contacted", count: 28, color: "bg-orange-500", total: 100 },
                                        { name: "Negotiation", count: 18, color: "bg-purple-500", total: 100 },
                                        { name: "Closed Won", count: 12, color: "bg-green-500", total: 100 }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                                                <span>{item.name}</span>
                                                <span className="text-gray-400">{item.count} Active</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200/50">
                                                <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${(item.count / 60) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities Section */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden mt-2">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3 uppercase tracking-wider">
                                    <Clock className="text-orange-500" size={20} />
                                    Performance Activity Logs
                                </h2>
                                <button className="text-orange-600 font-bold text-xs hover:underline uppercase tracking-tight">Full Timeline</button>
                            </div>
                            <div className="divide-y divide-gray-100 text-base">
                                {activities.slice(0, 4).map((activity, i) => (
                                    <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${activity.type === 'Won' ? 'bg-green-100 text-green-600' :
                                                activity.type === 'Call' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {activity.type === 'Won' ? <CheckCircle2 size={18} /> :
                                                    activity.type === 'Call' ? <Phone size={18} /> :
                                                        <Activity size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-base group-hover:text-orange-600 transition-colors">{activity.title}</p>
                                                <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest border ${activity.status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' :
                                            'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
