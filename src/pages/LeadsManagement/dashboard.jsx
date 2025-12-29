import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  UserPlus,
  UserCheck,
  Mail,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Clock,
  ArrowUp,
  ArrowDown,
  Menu,
} from "lucide-react";

export default function LeadDashboard() {
  const stats = [
    {
      title: "All Leads",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      gradient: "from-orange-400 to-orange-500",
    },
    {
      title: "New Leads",
      value: "342",
      change: "+23.1%",
      trend: "up",
      icon: UserPlus,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Assigned",
      value: "1,524",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Unread Leads",
      value: "89",
      change: "-5.3%",
      trend: "down",
      icon: Mail,
      gradient: "from-orange-600 to-red-500",
    },
  ];

  const recentLeads = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      company: "Tech Corp",
      status: "New",
      priority: "High",
      time: "5 min ago",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      email: "mchen@example.com",
      company: "Digital Solutions",
      status: "Assigned",
      priority: "Medium",
      time: "23 min ago",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      company: "Innovation Labs",
      status: "New",
      priority: "High",
      time: "1 hour ago",
      avatar: "ER",
    },
    {
      name: "David Kim",
      email: "dkim@example.com",
      company: "Smart Systems",
      status: "Unread",
      priority: "Low",
      time: "2 hours ago",
      avatar: "DK",
    },
    {
      name: "Lisa Anderson",
      email: "l.anderson@example.com",
      company: "Future Tech",
      status: "Assigned",
      priority: "Medium",
      time: "3 hours ago",
      avatar: "LA",
    },
    {
      name: "James Wilson",
      email: "jwilson@example.com",
      company: "CloudNet",
      status: "New",
      priority: "High",
      time: "4 hours ago",
      avatar: "JW",
    },
  ];

  const trendingData = [
    { category: "Technology", count: 245, percentage: 98, trend: "up" },
    { category: "Healthcare", count: 189, percentage: 76, trend: "up" },
    { category: "Finance", count: 156, percentage: 62, trend: "down" },
    { category: "Retail", count: 134, percentage: 54, trend: "up" },
    { category: "Manufacturing", count: 98, percentage: 39, trend: "down" },
  ];

  const weeklyData = [
    { day: "Mon", value: 65, leads: 185 },
    { day: "Tue", value: 85, leads: 242 },
    { day: "Wed", value: 45, leads: 128 },
    { day: "Thu", value: 90, leads: 256 },
    { day: "Fri", value: 70, leads: 199 },
    { day: "Sat", value: 55, leads: 156 },
    { day: "Sun", value: 80, leads: 228 },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        <div className="p-0 ml-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-sm shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-orange-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-4 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-md`}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                        stat.trend === "up"
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-orange-600 text-sm font-semibold mb-2 uppercase tracking-wide">
                    {stat.title}
                  </h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-1.5 bg-gradient-to-r ${stat.gradient}`}
                ></div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Leads - 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Recent Leads
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Latest incoming opportunities
                  </p>
                </div>
                <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentLeads.map((lead, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg hover:shadow-md transition-shadow duration-200 border border-orange-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {lead.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-base">
                          {lead.name}
                        </h4>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-xs text-orange-600 mt-0.5 font-medium">
                          {lead.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          lead.priority === "High"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : lead.priority === "Medium"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {lead.priority}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        {lead.status}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {lead.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Categories - 1 column */}
            <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Trending
                  </h2>
                  <p className="text-gray-500 text-sm">Top categories</p>
                </div>
              </div>
              <div className="space-y-4">
                {trendingData.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-800 text-base">
                        {item.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-orange-600">
                          {item.count}
                        </span>
                        {item.trend === "up" ? (
                          <div className="p-1.5 bg-green-50 rounded-lg border border-green-200">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-red-50 rounded-lg border border-red-200">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex-1 bg-orange-100 rounded-full h-3 border border-orange-200">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Weekly Analytics
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lead performance overview
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                  <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-500 to-orange-600"></div>
                  <span className="text-sm font-semibold text-orange-700">
                    Leads Generated
                  </span>
                </div>
              </div>
            </div>

            {/* Chart - Simple Bar Graph */}
            <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-lg p-8 border border-orange-200">
              <div className="space-y-6">
                {weeklyData.map((data, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800 w-16">
                        {data.day}
                      </span>
                      <span className="text-xs font-semibold text-orange-600">
                        {data.leads} leads
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-orange-100 rounded-lg h-10 border border-orange-200">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-10 rounded-lg transition-all duration-500 flex items-center px-4 hover:from-orange-600 hover:to-orange-700"
                          style={{ width: `${(data.leads / 300) * 100}%` }}
                        >
                          <span className="text-white font-bold text-sm">
                            {data.leads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
