import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Activity,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  TrendingDown,
} from "lucide-react";
import { FiHome } from "react-icons/fi";

const PipelineAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Pipeline performance data
  const pipelineData = [
    { name: "Sales", deals: 315, value: 450000, stages: 5 },
    { name: "Marketing", deals: 447, value: 315000, stages: 4 },
    { name: "Calls", deals: 654, value: 840000, stages: 6 },
    { name: "Email", deals: 545, value: 610000, stages: 3 },
    { name: "Chats", deals: 787, value: 470000, stages: 4 },
    { name: "Operational", deals: 787, value: 550000, stages: 5 },
    { name: "Differentiate", deals: 478, value: 450000, stages: 6 },
  ];

  // Monthly trend data
  const trendData = [
    { month: "Jan", deals: 245, value: 320000 },
    { month: "Feb", deals: 312, value: 425000 },
    { month: "Mar", deals: 398, value: 510000 },
    { month: "Apr", deals: 445, value: 580000 },
    { month: "May", deals: 521, value: 670000 },
    { month: "Jun", deals: 489, value: 635000 },
    { month: "Jul", deals: 556, value: 720000 },
    { month: "Aug", deals: 612, value: 795000 },
    { month: "Sep", deals: 587, value: 765000 },
  ];

  // Deal distribution by status
  const statusData = [
    { name: "Active", value: 3328, color: "#ff8c42" },
    { name: "Won", value: 1245, color: "#10b981" },
    { name: "Lost", value: 456, color: "#ef4444" },
    { name: "Pending", value: 234, color: "#fbbf24" },
  ];

  // Conversion rate data
  const conversionData = [
    { stage: "Lead", rate: 100, count: 5000 },
    { stage: "Qualified", rate: 65, count: 3250 },
    { stage: "Proposal", rate: 45, count: 2250 },
    { stage: "Negotiation", rate: 30, count: 1500 },
    { stage: "Closed Won", rate: 22, count: 1100 },
  ];

  // Top performers data
  const topPerformers = [
    { name: "Sarah Johnson", deals: 89, value: 1250000, winRate: 78 },
    { name: "Michael Chen", deals: 76, value: 1180000, winRate: 72 },
    { name: "Emily Davis", deals: 68, value: 980000, winRate: 69 },
    { name: "James Wilson", deals: 62, value: 890000, winRate: 65 },
    { name: "Lisa Anderson", deals: 58, value: 850000, winRate: 63 },
  ];

  // Revenue forecast data
  const forecastData = [
    { month: "Oct", actual: 720000, forecast: 680000 },
    { month: "Nov", actual: 795000, forecast: 750000 },
    { month: "Dec", actual: 765000, forecast: 820000 },
    { month: "Jan", actual: null, forecast: 890000 },
    { month: "Feb", actual: null, forecast: 920000 },
    { month: "Mar", actual: null, forecast: 980000 },
  ];

  // Deal velocity data
  const velocityData = [
    { name: "Sales", avgDays: 28, deals: 315 },
    { name: "Marketing", avgDays: 35, deals: 447 },
    { name: "Calls", avgDays: 22, deals: 654 },
    { name: "Email", avgDays: 31, deals: 545 },
    { name: "Chats", avgDays: 19, deals: 787 },
  ];

  const totalDeals = pipelineData.reduce((sum, p) => sum + p.deals, 0);
  const totalValue = pipelineData.reduce((sum, p) => sum + p.value, 0);
  const avgDealValue = Math.round(totalValue / totalDeals);
  const activePipelines = 7;
  const conversionRate = 22;
  const avgDealCycle = 27;
  const wonDeals = 1245;
  const winRate = 68;

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, iconColorClass, iconBgColor, lineBorderClass }) => (
    <div
      className={`bg-white rounded-sm p-6 shadow-lg border-t-4 ${lineBorderClass} hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="">
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-semibold ${trend > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
            {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
          <div className={`${iconBgColor} w-12 h-12 flex items-center justify-center rounded-lg my-3`}>
            <Icon className={`w-6 h-6 ${iconColorClass}`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-0 min-h-screen">
        <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> CRM /{" "}
              <span className="text-[#FF7B1D] font-medium">All Analytics</span>
            </p>
          </div>
        </div>
        <div className="">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Target}
              title="Total Deals"
              value={totalDeals.toLocaleString()}
              subtitle="Across all pipelines"
              trend={12.5}
              iconBgColor="bg-blue-100"
              iconColorClass="text-blue-600"
              lineBorderClass="border-blue-500"
            />
            <StatCard
              icon={DollarSign}
              title="Total Value"
              value={`₹${(totalValue / 1000).toFixed(0)}K`}
              subtitle="Combined deal value"
              trend={8.3}
              iconBgColor="bg-green-100"
              iconColorClass="text-green-600"
              lineBorderClass="border-green-500"
            />
            <StatCard
              icon={Users}
              title="Avg Deal Value"
              value={`₹${(avgDealValue / 1000).toFixed(0)}K`}
              subtitle="Per deal average"
              trend={-2.1}
              iconBgColor="bg-orange-100"
              iconColorClass="text-orange-600"
              lineBorderClass="border-orange-500"
            />
            <StatCard
              icon={Activity}
              title="Active Pipelines"
              value={activePipelines}
              subtitle="Currently running"
              trend={5.2}
              iconBgColor="bg-purple-100"
              iconColorClass="text-purple-600"
              lineBorderClass="border-purple-500"
            />
            <StatCard
              icon={CheckCircle}
              title="Won Deals"
              value={wonDeals.toLocaleString()}
              subtitle="Successfully closed"
              trend={15.7}
              iconBgColor="bg-blue-100"
              iconColorClass="text-blue-600"
              lineBorderClass="border-blue-500"
            />
            <StatCard
              icon={Award}
              title="Win Rate"
              value={`${winRate}%`}
              subtitle="Conversion success"
              trend={3.2}
              iconBgColor="bg-green-100"
              iconColorClass="text-green-600"
              lineBorderClass="border-green-500"
            />
            <StatCard
              icon={Clock}
              title="Avg Deal Cycle"
              value={`${avgDealCycle} days`}
              subtitle="Time to close"
              trend={-4.5}
              iconBgColor="bg-orange-100"
              iconColorClass="text-orange-600"
              lineBorderClass="border-orange-500"
            />
            <StatCard
              icon={TrendingUp}
              title="Conversion Rate"
              value={`${conversionRate}%`}
              subtitle="Lead to close"
              trend={6.8}
              iconBgColor="bg-purple-100"
              iconColorClass="text-purple-600"
              lineBorderClass="border-purple-500"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pipeline Performance Bar Chart */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-orange-500" />
                Pipeline Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #ff8c42",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="deals"
                    fill="#ff8c42"
                    radius={[4, 4, 0, 0]}
                    name="Number of Deals"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Deal Distribution Pie Chart */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-orange-500" />
                Deal Distribution by Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Trend Line Chart */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Monthly Deal Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #ff8c42",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="deals"
                    stroke="#ff8c42"
                    strokeWidth={3}
                    dot={{ fill: "#ff8c42", r: 5 }}
                    name="Deals"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Deal Value Bar Chart */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                Deal Value by Pipeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fill: "#666", fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#666", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #ff8c42",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar
                    dataKey="value"
                    fill="#fb923c"
                    radius={[0, 4, 4, 0]}
                    name="Total Value"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 3 - New Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Conversion Funnel */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-500" />
                Conversion Funnel
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fill: "#666", fontSize: 12 }} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tick={{ fill: "#666", fontSize: 12 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #ff8c42",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value, name) => [
                      name === "rate" ? `${value}%` : value,
                      name === "rate" ? "Conversion Rate" : "Count",
                    ]}
                  />
                  <Bar
                    dataKey="rate"
                    fill="#ff8c42"
                    radius={[0, 4, 4, 0]}
                    name="Conversion Rate %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Forecast */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Revenue Forecast
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #ff8c42",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) =>
                      value ? `₹${(value / 1000).toFixed(0)}K` : "N/A"
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#ff8c42"
                    fill="#ff8c42"
                    fillOpacity={0.6}
                    name="Actual Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="#fb923c"
                    fill="#fb923c"
                    fillOpacity={0.3}
                    strokeDasharray="5 5"
                    name="Forecasted Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers & Deal Velocity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Performers */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-sm hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {performer.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {performer.deals} deals • ₹
                          {(performer.value / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">
                        {performer.winRate}%
                      </p>
                      <p className="text-xs text-gray-500">Win Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Velocity */}
            <div className="bg-white rounded-sm p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Deal Velocity (Avg Days to Close)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #ff8c42",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value, name) => [
                      name === "avgDays" ? `${value} days` : value,
                      name === "avgDays" ? "Avg Days" : "Deals",
                    ]}
                  />
                  <Bar
                    dataKey="avgDays"
                    fill="#fb923c"
                    radius={[4, 4, 0, 0]}
                    name="Avg Days to Close"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Summary Table */}
          <div className="bg-white rounded-sm shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Pipeline Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Pipeline Name
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      Stages
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      Deals
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                      Total Value
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                      Avg Deal Value
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineData.map((pipeline, index) => {
                    const avgValue = Math.round(
                      pipeline.value / pipeline.deals
                    );
                    const performance = Math.round(
                      (pipeline.value / totalValue) * 100
                    );
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-orange-600">
                            {pipeline.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-sm text-sm font-semibold">
                            {pipeline.stages}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-700">
                          {pipeline.deals}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          ₹{pipeline.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-700">
                          ₹{avgValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-sm h-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-sm"
                                style={{ width: `${performance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-orange-600">
                              {performance}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PipelineAnalytics;
