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
  BarChart3,
} from "lucide-react";
import { FiHome } from "react-icons/fi";
import NumberCard from "../../components/NumberCard";

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


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pipeline Analytics</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400">CRM / </span>
                  <span className="text-[#FF7B1D] font-medium">Analytics</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-9xl mx-auto px-4 mt-2">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <NumberCard
              variant="matrix"
              title="Total Deals"
              number={totalDeals.toLocaleString()}
              icon={<Target className="text-blue-600" size={24} />}
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              variant="matrix"
              title="Total Value"
              number={`₹${(totalValue / 1000).toFixed(0)}K`}
              icon={<DollarSign className="text-green-600" size={24} />}
              lineBorderClass="border-green-500"
            />
            <NumberCard
              variant="matrix"
              title="Avg Deal Value"
              number={`₹${(avgDealValue / 1000).toFixed(0)}K`}
              icon={<Users className="text-orange-600" size={24} />}
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              variant="matrix"
              title="Active Pipelines"
              number={activePipelines}
              icon={<Activity className="text-purple-600" size={24} />}
              lineBorderClass="border-purple-500"
            />
            <NumberCard
              variant="matrix"
              title="Won Deals"
              number={wonDeals.toLocaleString()}
              icon={<CheckCircle className="text-blue-600" size={24} />}
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              variant="matrix"
              title="Win Rate"
              number={`${winRate}%`}
              icon={<Award className="text-green-600" size={24} />}
              lineBorderClass="border-green-500"
            />
            <NumberCard
              variant="matrix"
              title="Avg Deal Cycle"
              number={`${avgDealCycle} days`}
              icon={<Clock className="text-orange-600" size={24} />}
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              variant="matrix"
              title="Conversion Rate"
              number={`${conversionRate}%`}
              icon={<TrendingUp className="text-purple-600" size={24} />}
              lineBorderClass="border-purple-500"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Pipeline Performance Bar Chart */}
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Pipeline Performance
                  </h2>
                  <p className="text-gray-500 text-sm">Task and deal distribution</p>
                </div>
              </div>
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
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Deal Distribution
                  </h2>
                  <p className="text-gray-500 text-sm">By current status</p>
                </div>
              </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Monthly Trend Line Chart */}
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Monthly Deal Trend
                  </h2>
                  <p className="text-gray-500 text-sm">Deals over time</p>
                </div>
              </div>
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
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Projected Value
                  </h2>
                  <p className="text-gray-500 text-sm">Value by pipeline</p>
                </div>
              </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Conversion Funnel */}
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Conversion Funnel
                  </h2>
                  <p className="text-gray-500 text-sm">Win rate across stages</p>
                </div>
              </div>
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
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Revenue Forecast
                  </h2>
                  <p className="text-gray-500 text-sm">Future projections</p>
                </div>
              </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Top Performers */}
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Top Performers
                  </h2>
                  <p className="text-gray-500 text-sm">Best performing agents</p>
                </div>
              </div>
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
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Deal Velocity
                  </h2>
                  <p className="text-gray-500 text-sm">Avg days to close</p>
                </div>
              </div>
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
          <div className="bg-white rounded-sm shadow-lg overflow-hidden border border-orange-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Pipeline Summary
                  </h2>
                  <p className="text-gray-500 text-sm">Detailed performance metrics</p>
                </div>
              </div>
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
