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

import { useGetEmployeePerformanceQuery } from "../../store/api/leadApi";
import { AlertCircle, Loader2 } from "lucide-react";

const iconMap = {
    Users,
    Target,
    Award,
    Clock,
    Activity,
    TrendingUp,
    Phone,
    CheckCircle2,
    Mail,
    Zap,
    Briefcase
};

export default function EmployeePerformanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetEmployeePerformanceQuery(id);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Employee not found</h2>
                <p className="text-gray-500 mb-6">We couldn't find the performance details for this team member.</p>
                <button
                    onClick={() => navigate("/crm/leads/analysis")}
                    className="px-6 py-2 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 transition-colors"
                >
                    Back to Analysis
                </button>
            </div>
        );
    }

    const { employee, stats, activities, goalProgress, leadStatusPipeline, conversionTrend, achievements } = data;

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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                    {/* Sidebar - Profile Info */}
                    <div className="lg:col-span-1 space-y-4">
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
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Target size={18} className="text-orange-500" />
                                {goalProgress.title}
                            </h3>
                            <div className="flex flex-col items-center">
                                <div className="relative w-36 h-36 flex items-center justify-center mb-6">
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
                                            strokeDashoffset={402 * (1 - goalProgress.percentage / 100)}
                                            strokeLinecap="round"
                                            className="text-orange-500 transition-all duration-1000 shadow-sm"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-gray-800 leading-none">{goalProgress.percentage}%</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Achieved</p>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div className="text-center border-r border-gray-100">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Current</p>
                                        <p className="text-sm font-black text-gray-800">₹{(goalProgress.current / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Goal</p>
                                        <p className="text-sm font-black text-[#FF7B1D]">₹{(goalProgress.target / 100000).toFixed(1)}L</p>
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
                                {achievements.map((ach, idx) => {
                                    const Icon = iconMap[ach.icon] || Award;
                                    const colors = {
                                        amber: "bg-amber-50/50 border-amber-100 text-amber-600 font-bold text-amber-900 leading-none text-amber-600 mt-1.5 font-bold",
                                        blue: "bg-blue-50/50 border-blue-100 text-blue-600 font-bold text-blue-900 leading-none text-blue-600 mt-1.5 font-bold",
                                        orange: "bg-orange-50/50 border-orange-100 text-orange-600 font-bold text-orange-900 leading-none text-orange-600 mt-1.5 font-bold",
                                        green: "bg-green-50/50 border-green-100 text-green-600 font-bold text-green-900 leading-none text-green-600 mt-1.5 font-bold"
                                    };

                                    // Map manual colors to the classes
                                    let bgClass = "bg-gray-50/50 border-gray-100";
                                    let iconColor = "text-gray-600";
                                    let titleColor = "text-gray-900";
                                    let subColor = "text-gray-600";

                                    if (ach.color === 'amber') { bgClass = "bg-amber-50/50 border-amber-100"; iconColor = "text-amber-600"; titleColor = "text-amber-900"; subColor = "text-amber-600"; }
                                    if (ach.color === 'blue') { bgClass = "bg-blue-50/50 border-blue-100"; iconColor = "text-blue-600"; titleColor = "text-blue-900"; subColor = "text-blue-600"; }
                                    if (ach.color === 'orange') { bgClass = "bg-orange-50/50 border-orange-100"; iconColor = "text-orange-600"; titleColor = "text-orange-900"; subColor = "text-orange-600"; }
                                    if (ach.color === 'green') { bgClass = "bg-green-50/50 border-green-100"; iconColor = "text-green-600"; titleColor = "text-green-900"; subColor = "text-green-600"; }

                                    return (
                                        <div key={idx} className={`flex items-center gap-4 p-4 rounded-sm border ${bgClass}`}>
                                            <Icon size={22} className={iconColor} />
                                            <div>
                                                <p className={`text-sm font-bold ${titleColor} leading-none`}>{ach.title}</p>
                                                <p className={`text-xs ${subColor} mt-1.5 font-bold`}>{ach.sub}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-4">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm group hover:border-orange-500 transition-all cursor-default">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-sm ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                            {React.createElement(iconMap[stat.icon] || Users, { size: 20 })}
                                        </div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-800 leading-none">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Conversion Trend */}
                            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-orange-50 rounded-sm">
                                            <TrendingUp className="text-orange-600" size={22} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Conversion Trend</h3>
                                    </div>
                                    <div className="flex gap-1 bg-gray-100 p-1 rounded-sm border border-gray-200 overflow-hidden">
                                        <button className="px-3 py-1 text-xs font-bold bg-white text-orange-600 shadow-sm rounded-sm">14D</button>
                                    </div>
                                </div>

                                <div className="h-56 flex items-end gap-1.5 px-2">
                                    {conversionTrend.length > 0 ? conversionTrend.map((h, i) => (
                                        <div key={i} className="flex-1 group relative flex flex-col items-center">
                                            <div className="absolute -top-10 bg-gray-900 text-xs px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-all z-10 whitespace-nowrap font-bold shadow-xl text-white">
                                                {h}%
                                            </div>
                                            <div
                                                className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-[1px] transition-all origin-bottom hover:brightness-110 active:scale-x-110"
                                                style={{ height: `${h * 1.8}px` }}
                                            ></div>
                                        </div>
                                    )) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic font-bold">
                                            No trend data available
                                        </div>
                                    )}
                                </div>
                                <div className="w-full h-px bg-gray-100 mt-4"></div>
                                <div className="flex justify-between mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <span>Analysis Start</span>
                                    <span>Current Period</span>
                                </div>
                            </div>

                            {/* Lead Status Pipeline Section */}
                            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-orange-50 rounded-sm">
                                        <Activity className="text-orange-600" size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Lead Status Pipeline</h3>
                                </div>
                                <div className="space-y-6">
                                    {leadStatusPipeline.length > 0 ? leadStatusPipeline.map((item, i) => {
                                        const maxCount = Math.max(...leadStatusPipeline.map(p => p.count), 1);
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                                                    <span>{item.name}</span>
                                                    <span className="text-gray-400">{item.count} Active</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200/50">
                                                    <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic font-bold">
                                            No leads assigned yet
                                        </div>
                                    )}
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
                            <div className="divide-y divide-gray-100 text-base max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-orange-200 transition-all">
                                {activities.length > 0 ? activities.map((activity, i) => (
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
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400">
                                        <Activity size={40} className="mb-4 opacity-20" />
                                        <p className="font-bold italic">No recent performance logs found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
