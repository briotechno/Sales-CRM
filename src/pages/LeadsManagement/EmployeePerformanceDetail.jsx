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
    Briefcase,
    DollarSign,
    Filter,
} from "lucide-react";
import { FiHome } from "react-icons/fi";

import { useGetEmployeePerformanceQuery } from "../../store/api/leadApi";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
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
            {/* Header Section */}
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
                                    {employee?.name && (
                                        <>
                                            <span className="text-gray-400"> / </span>
                                            <span className="text-gray-700 font-semibold capitalize">{employee.name}</span>
                                        </>
                                    )}
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
                        <div className="bg-white rounded-sm border-t-4 border-t-orange-500 shadow-lg overflow-hidden text-center p-8 border-x border-b border-orange-100">
                            <div className="relative inline-block mb-6">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                                    {employee.avatar}
                                </div>
                                <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 tracking-tight capitalize">{employee.name}</h2>
                            <p className="text-orange-600 font-semibold text-sm mb-6 flex items-center justify-center gap-2 capitalize tracking-wide">
                                <Briefcase size={14} />
                                {employee.role}
                            </p>

                            <div className="space-y-3 pt-6 border-t border-orange-100">
                                <div className="flex items-center gap-4 text-left p-3 rounded-sm bg-orange-50/30 border border-orange-100 hover:border-orange-200 transition-colors group">
                                    <Mail size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] capitalize font-semibold text-orange-400 tracking-wide leading-none mb-1.5">Email address</p>
                                        <p className="text-sm font-semibold text-gray-800 truncate">{employee.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-left p-3 rounded-sm bg-orange-50/30 border border-orange-100 hover:border-orange-200 transition-colors group">
                                    <Calendar size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-[10px] capitalize font-semibold text-orange-400 tracking-wide leading-none mb-1.5">Joining date</p>
                                        <p className="text-sm font-semibold text-gray-800">{employee.joined}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quarterly Progress Section */}
                        <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6">
                            <h3 className="text-xs font-semibold text-orange-600 capitalize tracking-wide mb-6 flex items-center gap-2 border-b border-orange-50 pb-2">
                                <Target size={16} className="text-orange-500" />
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
                                            className="text-orange-50"
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
                                            className="text-orange-600 transition-all duration-1000 shadow-sm"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-semibold text-gray-800 leading-none">{goalProgress.percentage}%</span>
                                        <p className="text-[10px] font-semibold text-orange-400 capitalize tracking-wide mt-1">Achieved</p>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-orange-50">
                                    <div className="text-center border-r border-orange-50">
                                        <p className="text-[10px] capitalize font-semibold text-orange-400 mb-1 leading-none">Current</p>
                                        <p className="text-sm font-semibold text-gray-800">₹{(goalProgress.current / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] capitalize font-semibold text-orange-400 mb-1 leading-none">Goal</p>
                                        <p className="text-sm font-semibold text-[#FF7B1D]">₹{(goalProgress.target / 100000).toFixed(1)}L</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6">
                            <h3 className="text-xs font-semibold text-orange-600 capitalize tracking-wide mb-6 flex items-center gap-2 border-b border-orange-50 pb-2">
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

                        {/* Stats Cards - Updated to Analysis Grid Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, i) => {
                                const IconComp = iconMap[stat.icon] || Users;
                                const colorMap = {
                                    'text-blue-600': 'border-t-blue-500 bg-blue-50/50 text-blue-500',
                                    'text-purple-600': 'border-t-purple-500 bg-purple-50/50 text-purple-500',
                                    'text-amber-600': 'border-t-amber-500 bg-amber-50/50 text-amber-500',
                                    'text-orange-600': 'border-t-orange-500 bg-orange-50/50 text-orange-500',
                                    'text-green-600': 'border-t-green-500 bg-green-50/50 text-green-500'
                                };
                                const style = colorMap[stat.color] || 'border-t-orange-500 bg-orange-50/50 text-orange-500';

                                return (
                                    <div key={i} className={`rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 ${style} transition-all duration-300 hover:shadow-md cursor-default`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                                                    <IconComp size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-[10px] font-semibold text-gray-400 capitalize tracking-wide font-primary">
                                                        {stat.title}
                                                    </h3>
                                                    <p className="text-xl font-semibold text-gray-800 leading-none mt-1">
                                                        {stat.value}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Conversion Trend */}
                            <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-lg">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">Lead Performance Trend</h2>
                                            <p className="text-orange-500 text-[10px] font-semibold capitalize tracking-wide font-primary">Last 14 days analysis</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-sm border border-orange-100">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            <span className="text-[10px] font-bold text-orange-700 capitalize">Performance %</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-b from-orange-50/50 to-white rounded-xl p-4 border border-orange-50">
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={conversionTrend.map((val, idx) => ({ day: `Day ${idx + 1}`, value: val }))}
                                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
                                                <XAxis
                                                    dataKey="day"
                                                    hide
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#9a3412' }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    domain={[0, 100]}
                                                    tickFormatter={(value) => `${value}%`}
                                                />
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-gray-900 border border-gray-800 p-2 shadow-xl rounded-sm">
                                                                    <p className="text-[10px] text-orange-400 font-bold mb-1 uppercase tracking-tighter">{payload[0].payload.day}</p>
                                                                    <p className="text-sm text-white font-black leading-none">
                                                                        {payload[0].value}% <span className="text-[10px] font-normal text-gray-400">Yield</span>
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#f97316"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorValue)"
                                                    animationDuration={1500}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-full h-px bg-orange-100 mt-2 shadow-sm"></div>
                                    <div className="flex justify-between mt-4 text-[10px] font-semibold text-orange-400 capitalize tracking-wide">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 rounded-sm bg-orange-100">
                                                <TrendingUp size={10} />
                                            </div>
                                            <span>Start cycle</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>Current state</span>
                                            <div className="p-1 rounded-sm bg-orange-500 text-white">
                                                <Zap size={10} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Status Pipeline Section */}
                            <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6 flex flex-col">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Current Lead Stages</h3>
                                        <p className="text-blue-500 text-[10px] font-semibold capitalize tracking-wide">Pipeline health audit</p>
                                    </div>
                                </div>
                                <div className="space-y-6 flex-1 flex flex-col justify-center">
                                    {leadStatusPipeline.length > 0 ? leadStatusPipeline.map((item, i) => {
                                        const maxCount = Math.max(...leadStatusPipeline.map(p => p.count), 1);
                                        const colorMap = {
                                            'bg-orange-500': 'bg-gradient-to-r from-orange-600 to-orange-400',
                                            'bg-blue-500': 'bg-gradient-to-r from-blue-600 to-blue-400',
                                            'bg-green-500': 'bg-gradient-to-r from-green-600 to-green-400',
                                            'bg-red-500': 'bg-gradient-to-r from-red-600 to-red-400',
                                            'bg-purple-500': 'bg-gradient-to-r from-purple-600 to-purple-400'
                                        };
                                        const gradient = colorMap[item.color] || 'bg-gradient-to-r from-orange-600 to-orange-400';

                                        return (
                                            <div key={i} className="group cursor-default">
                                                <div className="flex justify-between text-[11px] font-semibold text-gray-800 mb-2 capitalize tracking-wide">
                                                    <span className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                        {item.name}
                                                    </span>
                                                    <span className="text-orange-600 font-semibold">{item.count} leads</span>
                                                </div>
                                                <div className="w-full bg-orange-50 h-3 rounded-full overflow-hidden border border-orange-100 shadow-inner p-0.5">
                                                    <div className={`${gradient} h-full rounded-full transition-all duration-1000 shadow-sm group-hover:brightness-110`} style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="h-40 flex flex-col items-center justify-center text-orange-400 gap-3">
                                            <Activity className="opacity-20 w-10 h-10" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No Active Pipeline Data</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm border border-orange-100 shadow-lg overflow-hidden mt-2">
                            <div className="p-6 border-b border-orange-50 bg-gradient-to-r from-white to-orange-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 capitalize tracking-wide">Recent activity log</h2>
                                        <p className="text-orange-500 text-[10px] font-semibold capitalize tracking-wide">Real-time performance footprint</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 hover:scrollbar-thumb-orange-400 transition-all">
                                {activities.length > 0 ? activities.map((activity, i) => (
                                    <div key={i} className="p-4 rounded-sm bg-orange-50/30 border border-orange-100 hover:border-orange-200 transition-colors group flex items-center justify-between shadow-sm cursor-default">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${activity.type === 'Won' ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' :
                                                activity.type === 'Call' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                                                    'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                                                }`}>
                                                {activity.type === 'Won' ? <CheckCircle2 size={20} /> :
                                                    activity.type === 'Call' ? <Phone size={20} /> :
                                                        <Activity size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-base group-hover:text-orange-600 transition-colors leading-tight capitalize">{activity.title}</p>
                                                <div className="flex items-center gap-3 mt-1.5 font-semibold text-[11px]">
                                                    <span className="text-orange-500 flex items-center gap-1.5 bg-white/50 px-2 py-0.5 rounded-sm border border-orange-50">
                                                        <Clock size={10} />
                                                        {activity.time}
                                                    </span>
                                                    <span className="text-gray-400 capitalize bg-gray-50/50 px-2 py-0.5 rounded-sm">Historical log</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold capitalize tracking-wider shadow-sm border ${activity.status === 'Success' ? 'bg-green-100 text-green-700 border-green-200' :
                                            'bg-orange-100 text-orange-700 border-orange-200'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center py-24 text-orange-400 gap-4">
                                        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center border-2 border-dashed border-orange-200 animate-pulse">
                                            <Activity size={32} className="opacity-40" />
                                        </div>
                                        <p className="font-black italic uppercase tracking-widest text-[11px]">No Performance Activity Detected</p>
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
