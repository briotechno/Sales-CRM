import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Target,
  Users,
  Clock,
  Award,
  Zap,
  DollarSign, // Added DollarSign
  UserPlus,
  Server,
  Loader2,
  Phone,
  Trash2,
  Filter,
  Download
} from "lucide-react";
import { FiHome } from "react-icons/fi";

import { useGetLeadAnalysisQuery } from "../../store/api/leadApi";
import { AlertCircle } from "lucide-react";

const leadCategories = [
  { name: "All Leads", path: "/crm/leads/all", icon: <Users size={16} /> },
  { name: "New Leads", path: "/crm/leads/new", icon: <UserPlus size={16} /> },
  { name: "Not Connected", path: "/crm/leads/not-connected", icon: <Server size={16} /> },
  { name: "Follow Up", path: "/crm/leads/follow-up", icon: <Loader2 size={16} /> },
  { name: "Missed", path: "/crm/leads/missed", icon: <Phone size={16} /> },
  { name: "Assigned", path: "/crm/leads/assigned", icon: <UserPlus size={16} /> },
  { name: "Dropped", path: "/crm/leads/dropped", icon: <Trash2 size={16} /> },
  { name: "Duplicates", path: "/crm/leads/duplicates", icon: <Trash2 size={16} /> },
  { name: "Trending", path: "/crm/leads/trending", icon: <Users size={16} /> },
  { name: "Won", path: "/crm/leads/won", icon: <UserPlus size={16} /> },
  { name: "Analysis", path: "/crm/leads/analysis", icon: <Server size={16} /> },
];

const iconMap = {
  Target,
  Clock,
  Award,
  Zap,
  Users,
  PieChart,
  BarChart3,
  Activity,
  DollarSign, // Added DollarSign to iconMap
};

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: analysisData, isLoading, isError } = useGetLeadAnalysisQuery();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performanceMetrics = analysisData?.performanceMetrics || [
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      trend: "up",
      icon: "Target",
      color: "from-orange-400 to-orange-500",
      colorClass: "border-t-4 border-orange-500", // Added for new design
      iconColor: "text-orange-500", // Added for new design
    },
    {
      title: "Avg Response Time",
      value: "0h",
      change: "-0%",
      trend: "up",
      icon: "Clock",
      color: "from-orange-500 to-orange-600",
      colorClass: "border-t-4 border-orange-600", // Added for new design
      iconColor: "text-orange-600", // Added for new design
    },
    {
      title: "Success Score",
      value: "0/10",
      change: "+0",
      trend: "up",
      icon: "Award",
      color: "from-amber-500 to-orange-500",
      colorClass: "border-t-4 border-amber-500", // Added for new design
      iconColor: "text-amber-500", // Added for new design
    },
    {
      title: "Active Rate",
      value: "0%",
      change: "+0%",
      trend: "up",
      icon: "Zap",
      color: "from-orange-600 to-red-500",
      colorClass: "border-t-4 border-red-500", // Added for new design
      iconColor: "text-red-500", // Added for new design
    },
  ];

  const sourceAnalysis = analysisData?.sourceAnalysis || [];
  const weeklyTrends = analysisData?.weeklyTrends || [];
  const teamPerformance = analysisData?.teamPerformance || [];
  const industryBreakdown = analysisData?.industryBreakdown || [];

  const monthlyTrends = analysisData?.monthlyTrends || [];

  const ICON_MAP = {
    Target: Target,
    Clock: Clock,
    Award: Award,
    Zap: Zap,
    DollarSign: DollarSign,
    TrendingUp: TrendingUp,
    Activity: Activity, // Added Activity to ICON_MAP
    BarChart3: BarChart3, // Added BarChart3 to ICON_MAP
    PieChart: PieChart, // Added PieChart to ICON_MAP
    Users: Users, // Added Users to ICON_MAP
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load analysis</h2>
        <p className="text-gray-500 mb-6">There was an error fetching the analytical data. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleExport = () => {
    // Mock export for analysis data
    const csvContent = "Analysis Data Export\nGenerated: " + new Date().toLocaleString();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_analysis_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <>

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Analysis</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400">CRM / </span>
                  <span className="text-[#FF7B1D] font-medium">
                    Analysis
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter - Icon Only */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${
                      isFilterOpen
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    title="Filters"
                  >
                    <Filter size={18} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center text-black">
                        <span className="text-sm font-bold capitalize">Lead Navigation</span>
                      </div>

                      {/* Content - Scrollable */}
                      <div className="max-h-[70vh] overflow-y-auto p-4">
                        <div className="space-y-4">
                          {/* Navigation Section */}
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                              Lead Categories
                            </span>
                            <div className="space-y-1">
                              {leadCategories.map((cat) => (
                                <button
                                  key={cat.path}
                                  onClick={() => navigate(cat.path)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all text-left ${
                                    window.location.pathname === cat.path
                                      ? "bg-orange-50 text-orange-600 font-bold"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  }`}
                                >
                                  <span
                                    className={
                                      window.location.pathname === cat.path
                                        ? "text-orange-500"
                                        : "text-gray-400"
                                    }
                                  >
                                    {cat.icon}
                                  </span>
                                  {cat.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExport}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-sm flex items-center gap-2 transition font-semibold shadow-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Download size={18} className="text-gray-700 transition-transform group-hover:scale-110" />
                  Export Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-9xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {performanceMetrics.map((metric, index) => {
            const IconComponent = ICON_MAP[metric.icon] || Activity;
            return (
              <div
                key={index}
                className={`rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 ${metric.colorClass} transition-all duration-300 hover:shadow-md cursor-default font-primary`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                      <IconComponent size={18} className={metric.iconColor} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight">
                      {metric.title}
                    </h3>
                  </div>
                  <span className="bg-white text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
                    {metric.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Source Analysis */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-lg p-6 border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Lead Source Analysis
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Performance by acquisition channel
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {sourceAnalysis.map((source, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${source.color}`}
                        ></div>
                        <span className="font-bold text-gray-800 text-lg">
                          {source.source}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-orange-600">
                            {source.leads} leads
                          </div>
                          <div className="text-xs text-gray-500">
                            {source.conversion}% conversion
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">
                          {source.revenue}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-orange-100 rounded-full h-3 border border-orange-200">
                        <div
                          className={`${source.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${source.conversion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Breakdown */}
            <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Industries
                  </h2>
                  <p className="text-gray-500 text-sm">By sector</p>
                </div>
              </div>
              <div className="space-y-4">
                {industryBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">
                        {item.industry}
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-600 font-bold uppercase tracking-wider">
                      <span>
                        {item.count} leads
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-orange-100 rounded-full h-2.5 border border-orange-200">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6-Month Trend Analysis Chart */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    6-Month Trend Analysis
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lead generation and conversion trends
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-semibold text-orange-700">
                    Total Leads
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm font-semibold text-green-700">
                    Converted
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-200">
              <div className="h-80 flex items-end justify-around gap-4">
                {(() => {
                  const maxLeads = Math.max(...monthlyTrends.map(m => m.leads), 10);
                  const scaleFactor = 250 / maxLeads;

                  return monthlyTrends.map((data, index) => {
                    const leadsHeight = data.leads * scaleFactor;
                    const convertedHeight = data.converted * scaleFactor;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group"
                      >
                        <div className="w-full flex flex-col items-center gap-2 mb-4">
                          <div className="relative w-full">
                            <div
                              className={`w-full bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400 rounded-t-xl hover:from-orange-700 hover:via-orange-600 hover:to-orange-500 transition-all duration-300 ${data.leads > 0 ? 'shadow-lg border-2 border-orange-600' : 'border-0'}`}
                              style={{
                                height: `${leadsHeight}px`,
                                minHeight: data.leads > 0 ? '12px' : '2px'
                              }}
                            >
                              {data.leads > 0 && leadsHeight > 20 && (
                                <div className="flex items-center justify-center h-full">
                                  <span className="text-black font-bold text-xs opacity-80">
                                    {data.leads}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="relative w-3/4">
                            <div
                              className={`w-full bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-t-xl hover:from-green-700 hover:via-green-600 hover:to-green-500 transition-all duration-300 shadow-lg ${data.converted > 0 ? 'border-2 border-green-600' : 'border-0'}`}
                              style={{
                                height: `${convertedHeight}px`,
                                minHeight: data.converted > 0 ? '12px' : '2px'
                              }}
                            >
                              {data.converted > 0 && convertedHeight > 20 && (
                                <div className="flex items-center justify-center h-full">
                                  <span className="text-black font-bold text-xs opacity-80">
                                    {data.converted}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-orange-100 px-4 py-2 rounded-lg border border-orange-200">
                          <span className="text-sm text-orange-700 font-bold">
                            {data.month}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Weekly Trend Analysis Chart */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Weekly Trend Analysis
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lead progression and conversion across stages
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: "New Lead", color: "bg-orange-400" },
                  { label: "Not Connected", color: "bg-gray-400" },
                  { label: "Follow Up", color: "bg-amber-500" },
                  { label: "Trending", color: "bg-orange-600" },
                  { label: "Won", color: "bg-green-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-orange-50 px-2 py-1.5 rounded-lg border border-orange-200">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span className="text-[9px] font-bold text-orange-700 uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-200 relative">
              <div className="h-96 flex items-end justify-around gap-4">
                {(() => {
                  const maxOverall = weeklyTrends.length > 0
                    ? Math.max(...weeklyTrends.map(w => Math.max(w.new, w.notConnected, w.followUp, w.trending, w.won, 10)))
                    : 100;
                  const maxVal = maxOverall * 1.1;

                  return weeklyTrends.map((data, index) => {
                    const categories = [
                      { key: 'new', color: 'from-orange-500 via-orange-400 to-orange-300', border: 'border-orange-500', label: 'New Lead' },
                      { key: 'notConnected', color: 'from-gray-500 via-gray-400 to-gray-300', border: 'border-gray-500', label: 'Not Connected' },
                      { key: 'followUp', color: 'from-amber-600 via-amber-500 to-amber-400', border: 'border-amber-600', label: 'Follow Up' },
                      { key: 'trending', color: 'from-orange-700 via-orange-600 to-orange-500', border: 'border-orange-700', label: 'Trending' },
                      { key: 'won', color: 'from-green-600 via-green-500 to-green-400', border: 'border-green-600', label: 'Won' }
                    ];

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group relative h-full justify-end"
                      >
                        <div className="w-full flex justify-center items-end gap-1.5 mb-6">
                          {categories.map((cat) => {
                            const height = (data[cat.key] / maxVal) * 320;
                            return (
                              <div key={cat.key} className="relative group/bar flex flex-col items-center flex-1 min-w-[18px] max-w-[36px]">
                                <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-sm mb-1 font-bold z-20 whitespace-nowrap shadow-xl border border-white/10 pointer-events-none">
                                  <div className="flex flex-col items-center">
                                    <span className="text-orange-400">{data[cat.key]}</span>
                                    <span>{cat.label}</span>
                                  </div>
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                                <div
                                  className={`w-full bg-gradient-to-t ${cat.color} rounded-t-lg transition-all duration-500 shadow-lg border-2 ${cat.border} group-hover:brightness-110 group-hover:scale-x-105 origin-bottom`}
                                  style={{ height: `${height}px` }}
                                >
                                  {height > 30 && (
                                    <div className="flex items-center justify-center h-full">
                                      <span className="text-black font-bold text-[10px] opacity-70 rotate-[-90deg] md:rotate-0">
                                        {data[cat.key]}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-orange-100 px-3 py-1 rounded-lg border border-orange-200">
                          <span className="text-[10px] font-bold text-orange-700">
                            {data.week}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Team Performance
                </h2>
                <p className="text-gray-500 text-sm">
                  Individual conversion metrics
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {teamPerformance.map((member, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/crm/leads/team-performance/${member.id}`)}
                  className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg mb-3">
                      {member.avatar}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-2">
                      {member.name}
                    </h4>
                    <div className="w-full space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-gray-600">Leads:</span>
                        <span className="font-bold text-orange-600">
                          {member.leads}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-gray-600">Converted:</span>
                        <span className="font-bold text-green-600">
                          {member.converted}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                          {member.rate}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>

  );
}
