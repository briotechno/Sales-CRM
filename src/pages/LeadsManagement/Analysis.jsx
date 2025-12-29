import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
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
} from "lucide-react";

export default function AnalysisPage() {
  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: "34.5%",
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "from-orange-400 to-orange-500",
    },
    {
      title: "Avg Response Time",
      value: "2.4h",
      change: "-12%",
      trend: "up",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Success Score",
      value: "8.7/10",
      change: "+0.8",
      trend: "up",
      icon: Award,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Active Rate",
      value: "67.3%",
      change: "+3.1%",
      trend: "up",
      icon: Zap,
      color: "from-orange-600 to-red-500",
    },
  ];

  const sourceAnalysis = [
    {
      source: "Website",
      leads: 842,
      conversion: 38,
      revenue: "$124,500",
      color: "bg-orange-500",
    },
    {
      source: "Social Media",
      leads: 654,
      conversion: 31,
      revenue: "$98,200",
      color: "bg-orange-400",
    },
    {
      source: "Email Campaign",
      leads: 523,
      conversion: 42,
      revenue: "$156,300",
      color: "bg-orange-600",
    },
    {
      source: "Referrals",
      leads: 387,
      conversion: 45,
      revenue: "$178,900",
      color: "bg-orange-700",
    },
    {
      source: "Direct",
      leads: 441,
      conversion: 29,
      revenue: "$87,600",
      color: "bg-amber-500",
    },
  ];

  const monthlyTrends = [
    { month: "Jan", leads: 245, converted: 89, revenue: 45000 },
    { month: "Feb", leads: 312, converted: 121, revenue: 58000 },
    { month: "Mar", leads: 289, converted: 98, revenue: 52000 },
    { month: "Apr", leads: 356, converted: 145, revenue: 72000 },
    { month: "May", leads: 398, converted: 167, revenue: 84000 },
    { month: "Jun", leads: 423, converted: 189, revenue: 96000 },
  ];

  const teamPerformance = [
    {
      name: "Sarah Johnson",
      leads: 156,
      converted: 67,
      rate: 43,
      avatar: "SJ",
    },
    { name: "Michael Chen", leads: 142, converted: 58, rate: 41, avatar: "MC" },
    {
      name: "Emily Rodriguez",
      leads: 134,
      converted: 52,
      rate: 39,
      avatar: "ER",
    },
    { name: "David Kim", leads: 128, converted: 48, rate: 38, avatar: "DK" },
    {
      name: "Lisa Anderson",
      leads: 119,
      converted: 45,
      rate: 38,
      avatar: "LA",
    },
  ];

  const industryBreakdown = [
    { industry: "Technology", percentage: 32, count: 912 },
    { industry: "Healthcare", percentage: 24, count: 684 },
    { industry: "Finance", percentage: 18, count: 513 },
    { industry: "Retail", percentage: 15, count: 427 },
    { industry: "Manufacturing", percentage: 11, count: 313 },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        <div className="p-0 ml-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}
                    >
                      <metric.icon className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                        metric.trend === "up"
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-orange-600 text-sm font-semibold mb-2 uppercase tracking-wide">
                    {metric.title}
                  </h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    {metric.value}
                  </p>
                </div>
                <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              </div>
            ))}
          </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-600">
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

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100 mb-8">
            <div className="flex items-center justify-between mb-6">
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
                {monthlyTrends.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="w-full flex flex-col items-center gap-2 mb-4">
                      <div className="relative w-full">
                        <div
                          className="w-full bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400 rounded-t-xl hover:from-orange-700 hover:via-orange-600 hover:to-orange-500 transition-colors shadow-lg border-2 border-orange-600"
                          style={{ height: `${(data.leads / 500) * 250}px` }}
                        >
                          <div className="flex items-center justify-center h-full">
                            <span className="text-black font-bold text-xs opacity-80">
                              {data.leads}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-3/4">
                        <div
                          className="w-full bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-t-xl hover:from-green-700 hover:via-green-600 hover:to-green-500 transition-colors shadow-lg border-2 border-green-600"
                          style={{
                            height: `${(data.converted / 500) * 250}px`,
                          }}
                        >
                          <div className="flex items-center justify-center h-full">
                            <span className="text-black font-bold text-xs opacity-80">
                              {data.converted}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-100 px-4 py-2 rounded-lg border border-orange-200">
                      <span className="text-sm text-orange-700 font-bold">
                        {data.month}
                      </span>
                    </div>
                  </div>
                ))}
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
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Leads:</span>
                        <span className="font-bold text-orange-600">
                          {member.leads}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
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
    </DashboardLayout>
  );
}
