import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Award,
  Briefcase,
  Share2,
  UserCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Home,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import NumberCard from "../../components/NumberCard";

export default function CRMDashboard() {

  const recentLeads = [
    {
      name: "John Smith",
      company: "Tech Corp",
      status: "Hot",
      value: "₹10L",
      email: "john@tech.com",
      source: "Website",
      avatar: "JS",
    },
    {
      name: "Sarah Johnson",
      company: "Design Co",
      status: "Warm",
      value: "₹6.5L",
      email: "sarah@design.com",
      source: "Referral",
      avatar: "SJ",
    },
    {
      name: "Mike Brown",
      company: "Marketing Inc",
      status: "Cold",
      value: "₹4L",
      email: "mike@marketing.com",
      source: "LinkedIn",
      avatar: "MB",
    },
    {
      name: "Emily Davis",
      company: "Sales Ltd",
      status: "Hot",
      value: "₹12L",
      email: "emily@sales.com",
      source: "Direct",
      avatar: "ED",
    },
  ];

  const champions = [
    {
      name: "Alice Cooper",
      deals: 45,
      revenue: "₹1.95Cr",
      rating: 5,
      avatar: "AC",
      badge: "🏆",
    },
    {
      name: "Bob Martin",
      deals: 38,
      revenue: "₹1.58Cr",
      rating: 5,
      avatar: "BM",
      badge: "⭐",
    },
    {
      name: "Carol White",
      deals: 32,
      revenue: "₹1.30Cr",
      rating: 4,
      avatar: "CW",
      badge: "🎯",
    },
  ];

  const clients = [
    {
      name: "Acme Corporation",
      contact: "Jane Doe",
      value: "₹37L",
      status: "Active",
      lastContact: "2 days ago",
    },
    {
      name: "Global Tech Solutions",
      contact: "Tom Wilson",
      value: "₹56L",
      status: "Active",
      lastContact: "1 week ago",
    },
    {
      name: "Innovative Designs",
      contact: "Lisa Brown",
      value: "₹19L",
      status: "Pending",
      lastContact: "3 days ago",
    },
  ];

  const channels = [
    {
      name: "Email Marketing",
      leads: 847,
      conversion: "12.5%",
      color: "from-blue-400 to-blue-600",
      icon: "📧",
    },
    {
      name: "Social Media",
      leads: 623,
      conversion: "8.3%",
      color: "from-purple-400 to-purple-600",
      icon: "📱",
    },
    {
      name: "Direct Sales",
      leads: 445,
      conversion: "22.1%",
      color: "from-green-400 to-green-600",
      icon: "🎯",
    },
    {
      name: "Referrals",
      leads: 932,
      conversion: "18.9%",
      color: "from-orange-400 to-orange-600",
      icon: "🤝",
    },
  ];

  const activities = [
    {
      type: "call",
      contact: "John Smith",
      time: "10 mins ago",
      action: "Follow-up call scheduled",
    },
    {
      type: "email",
      contact: "Sarah Johnson",
      time: "1 hour ago",
      action: "Proposal sent",
    },
    {
      type: "meeting",
      contact: "Mike Brown",
      time: "2 hours ago",
      action: "Demo completed",
    },
    {
      type: "call",
      contact: "Emily Davis",
      time: "4 hours ago",
      action: "Contract negotiation",
    },
  ];

  const upcomingTasks = [
    {
      task: "Follow up with Tech Corp",
      priority: "High",
      dueTime: "Today, 2:00 PM",
    },
    {
      task: "Send proposal to Design Co",
      priority: "Medium",
      dueTime: "Today, 4:30 PM",
    },
    {
      task: "Schedule demo for Acme Corp",
      priority: "High",
      dueTime: "Tomorrow, 10:00 AM",
    },
    {
      task: "Review contract terms",
      priority: "Low",
      dueTime: "Tomorrow, 3:00 PM",
    },
  ];

  const pipelineData = [
    { name: "Sales", stages: 5, deals: 315, value: 450000 },
    { name: "Marketing", stages: 4, deals: 447, value: 315000 },
    { name: "Calls", stages: 6, deals: 654, value: 840000 },
    { name: "Email", stages: 3, deals: 545, value: 610000 },
    { name: "Chats", stages: 4, deals: 787, value: 470000 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 32 },
    { month: "Feb", revenue: 38 },
    { month: "Mar", revenue: 35 },
    { month: "Apr", revenue: 42 },
    { month: "May", revenue: 45 },
    { month: "Jun", revenue: 48 },
  ];

  const COLORS = ["#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412"];

  const formatCurrency = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        {/* Header */}
        <div className="bg-white border-b my-3">
          <div className="max-w-7xl mx-auto px-0 ml-10 py-4">
            <div className="flex items-center justify-between">
              {/* Left Title Section */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  CRM Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> CRM /{" "}
                  <span className="text-orange-500 font-medium">
                    All Dashboard
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-0 ml-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">

            <NumberCard
              title="Total Quotations"
              number={"2,847"}
              up={"+12.5%"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Conversions"
              number={"1,234"}
              up={"+8.2%"}
              icon={<Target className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Revenue"
              number={"₹45.2L"}
              up={"+15.3%"}
              icon={<DollarSign className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Champions"
              number={"156"}
              up={"+18.7%"}
              icon={<Award className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />

          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-0">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Activity className="w-6 h-14" />
                <span>Revenue Trend (Last 6 Months)</span>
              </h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #f97316",
                      borderRadius: "4px",
                      padding: "12px",
                    }}
                    formatter={(value) => [`₹${value}L`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 border-b border-orange-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    🎯 Leads Management
                  </h3>
                  <button className="text-orange-600 text-sm font-bold hover:text-orange-700 flex items-center space-x-1 bg-white px-4 py-2 rounded-sm shadow-sm">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentLeads.map((lead, index) => (
                    <div key={index} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-purple-50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-sm hover:shadow-lg transition-all border-2 border-gray-100 group-hover:border-orange-300">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm blur opacity-40"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {lead.avatar}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              {lead.name}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">
                              {lead.company} • {lead.source}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-4 py-2 rounded-sm text-xs font-bold shadow-sm ${lead.status === "Hot"
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                              : lead.status === "Warm"
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                              }`}
                          >
                            {lead.status}
                          </span>
                          <p className="font-bold text-gray-800 text-lg">
                            {lead.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 border-b border-purple-200">
                <h3 className="text-xl font-bold text-gray-800">
                  ⏰ Upcoming Tasks
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-sm hover:shadow-md transition-all border-2 border-gray-100 group-hover:border-purple-300">
                        <div
                          className={`p-3 rounded-sm ${task.priority === "High"
                            ? "bg-gradient-to-br from-red-400 to-red-600"
                            : task.priority === "Medium"
                              ? "bg-gradient-to-br from-orange-400 to-orange-600"
                              : "bg-gradient-to-br from-blue-400 to-blue-600"
                            } shadow-lg`}
                        >
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">
                            {task.task}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 font-medium">
                            {task.dueTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Champions Section */}
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 border-b border-yellow-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  🏆 Top Champions
                </h3>
                <button className="text-orange-600 text-sm font-bold hover:text-orange-700 flex items-center space-x-1 bg-white px-4 py-2 rounded-sm shadow-sm">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {champions.map((champion, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-sm blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative p-6 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-sm border-2 border-orange-200 hover:shadow-1xl transition-all transform ">
                      <div className="text-4xl mb-3 text-center">
                        {champion.badge}
                      </div>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-xl shadow-xl">
                          {champion.avatar}
                        </div>
                      </div>
                      <p className="font-bold text-gray-800 text-center text-lg mb-3">
                        {champion.name}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-sm shadow-sm text-center">
                          <p className="text-xs text-gray-600 font-semibold">
                            Deals Closed
                          </p>
                          <p className="text-2xl font-bold text-orange-600">
                            {champion.deals}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-sm shadow-sm text-center">
                          <p className="text-xs text-gray-600 font-semibold">
                            Revenue
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {champion.revenue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Bar Chart */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 border-b border-orange-200">
                <h3 className="text-xl font-bold text-gray-800">
                  📊 Pipeline Deals Analysis
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineData}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#fb923c"
                          stopOpacity={0.9}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      style={{ fontSize: "13px", fontWeight: "600" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "13px", fontWeight: "600" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #f97316",
                        borderRadius: "4px",
                        padding: "12px",
                      }}
                      formatter={(value) => [`${value} deals`, "Total Deals"]}
                    />
                    <Bar
                      dataKey="deals"
                      fill="url(#colorBar)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pipeline Pie Chart */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 border-b border-purple-200">
                <h3 className="text-xl font-bold text-gray-800">
                  🎯 Value Distribution
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pipelineData}
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
                      {pipelineData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #a855f7",
                        borderRadius: "4px",
                        padding: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pipeline Details Table */}
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 border-b border-blue-200">
              <h3 className="text-xl font-bold text-gray-800">
                📋 Pipeline Overview Details
              </h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 rounded-l-sm">
                      Pipeline Name
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                      Stages
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                      Total Deals
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">
                      Total Value
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700 rounded-r-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineData.map((pipeline, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 transition-all"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-sm shadow-lg"
                            style={{ backgroundColor: COLORS[index] }}
                          ></div>
                          <span className="font-bold text-gray-800 text-base">
                            {pipeline.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-5 px-6">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-sm text-sm font-bold">
                          {pipeline.stages}
                        </span>
                      </td>
                      <td className="text-center py-5 px-6 font-bold text-gray-800 text-base">
                        {pipeline.deals}
                      </td>
                      <td className="text-right py-5 px-6 font-bold text-orange-600 text-base">
                        {formatCurrency(pipeline.value)}
                      </td>
                      <td className="text-center py-5 px-6">
                        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-sm text-xs font-bold shadow-md">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Channel Integration */}
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 border-b border-green-200">
              <h3 className="text-xl font-bold text-gray-800">
                🔗 Channel Integration Performance
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {channels.map((channel, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-sm blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-sm hover:shadow-xl transition-all border-2 border-gray-100 group-hover:border-purple-300 transform ">
                      <div className="text-4xl mb-3">{channel.icon}</div>
                      <p className="font-bold text-gray-800 mb-4 text-lg">
                        {channel.name}
                      </p>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-sm shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">
                            Total Leads
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {channel.leads}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-sm shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">
                            Conversion
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {channel.conversion}
                          </p>
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
