import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Calendar,
  ClipboardList,
  Briefcase,
  Building2,
  FileText,
  Shield,
  DollarSign,
  BookOpen,
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle,
  Award,
  ArrowUpRight,
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export default function HRMDashboard() {
  const stats = [
    {
      icon: Users,
      label: "Total Employees",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      color: "from-orange-400 to-orange-600",
      bgGlow: "bg-orange-100",
    },
    {
      icon: UserCheck,
      label: "Present Today",
      value: "1,156",
      change: "+2.5%",
      trend: "up",
      color: "from-green-400 to-green-600",
      bgGlow: "bg-green-100",
    },
    {
      icon: Clock,
      label: "On Leave",
      value: "91",
      change: "-5.3%",
      trend: "down",
      color: "from-blue-400 to-blue-600",
      bgGlow: "bg-blue-100",
    },
    {
      icon: Award,
      label: "New Joiners",
      value: "45",
      change: "+12.8%",
      trend: "up",
      color: "from-purple-400 to-purple-600",
      bgGlow: "bg-purple-100",
    },
  ];

  const attendanceData = [
    { day: "Mon", present: 1180, absent: 67 },
    { day: "Tue", present: 1165, absent: 82 },
    { day: "Wed", present: 1190, absent: 57 },
    { day: "Thu", present: 1156, absent: 91 },
    { day: "Fri", present: 1200, absent: 47 },
  ];

  const departmentData = [
    { name: "Engineering", employees: 425, color: "#f97316" },
    { name: "Sales", employees: 287, color: "#fb923c" },
    { name: "Marketing", employees: 156, color: "#fdba74" },
    { name: "HR", employees: 89, color: "#fed7aa" },
    { name: "Finance", employees: 134, color: "#ffedd5" },
    { name: "Operations", employees: 156, color: "#ea580c" },
  ];

  const leaveRequests = [
    {
      name: "Rajesh Kumar",
      department: "Engineering",
      type: "Casual Leave",
      days: "3 days",
      status: "Pending",
      date: "Nov 25-27",
    },
    {
      name: "Priya Sharma",
      department: "Marketing",
      type: "Sick Leave",
      days: "2 days",
      status: "Approved",
      date: "Nov 24-25",
    },
    {
      name: "Amit Patel",
      department: "Sales",
      type: "Annual Leave",
      days: "5 days",
      status: "Pending",
      date: "Dec 1-5",
    },
    {
      name: "Sneha Reddy",
      department: "HR",
      type: "Casual Leave",
      days: "1 day",
      status: "Rejected",
      date: "Nov 26",
    },
  ];

  const recentJoiners = [
    {
      name: "Vikram Singh",
      designation: "Senior Developer",
      department: "Engineering",
      joinDate: "Nov 15, 2024",
      salary: "₹8.5L",
    },
    {
      name: "Anita Desai",
      designation: "Marketing Manager",
      department: "Marketing",
      joinDate: "Nov 18, 2024",
      salary: "₹12L",
    },
    {
      name: "Karthik Iyer",
      designation: "Sales Executive",
      department: "Sales",
      joinDate: "Nov 20, 2024",
      salary: "₹6L",
    },
  ];

  const upcomingTasks = [
    {
      task: "Performance Reviews - Q4",
      priority: "High",
      dueDate: "Nov 30, 2024",
      assignedTo: "HR Team",
    },
    {
      task: "Salary Processing - November",
      priority: "High",
      dueDate: "Nov 28, 2024",
      assignedTo: "Finance",
    },
    {
      task: "Policy Update Training",
      priority: "Medium",
      dueDate: "Dec 5, 2024",
      assignedTo: "HR Team",
    },
    {
      task: "Team Building Event",
      priority: "Low",
      dueDate: "Dec 10, 2024",
      assignedTo: "Admin",
    },
  ];

  const COLORS = [
    "#f97316",
    "#fb923c",
    "#fdba74",
    "#fed7aa",
    "#ffedd5",
    "#ea580c",
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto p-0 ml-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div
                  className={`absolute inset-0 ${stat.bgGlow} rounded-sm blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}
                ></div>
                <div className="relative bg-white rounded-sm shadow-lg p-6 hover:shadow-2xl transition-all transform  border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`bg-gradient-to-br ${stat.color} p-4 rounded-sm shadow-lg`}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      } font-bold`}
                    >
                      <ArrowUpRight
                        className={`w-4 h-4 ${
                          stat.trend === "down" ? "rotate-90" : ""
                        }`}
                      />
                      <span className="text-sm">{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance & Department Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Chart */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 border-b border-orange-200">
                <h3 className="text-xl font-bold text-gray-800">
                  📅 Weekly Attendance
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"
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
                    />
                    <Bar
                      dataKey="present"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="absent"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 border-b border-purple-200">
                <h3 className="text-xl font-bold text-gray-800">
                  🏢 Department Distribution
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="employees"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #a855f7",
                        borderRadius: "4px",
                        padding: "12px",
                      }}
                      formatter={(value) => [`${value} employees`, "Count"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Leave Requests & Recent Joiners */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Requests */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    📋 Leave Requests
                  </h3>
                  <button className="text-orange-600 text-sm font-bold hover:text-orange-700 bg-white px-4 py-2 rounded-sm shadow-sm">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {leaveRequests.map((request, index) => (
                    <div key={index} className="group">
                      <div className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-sm hover:shadow-lg transition-all border-2 border-gray-100 group-hover:border-orange-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {request.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-base">
                                {request.name}
                              </p>
                              <p className="text-sm text-gray-500 font-medium">
                                {request.department} • {request.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-4 py-2 rounded-sm text-xs font-bold shadow-sm ${
                                request.status === "Pending"
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                                  : request.status === "Approved"
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                              }`}
                            >
                              {request.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                              {request.date} • {request.days}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 border-b border-green-200">
                <h3 className="text-xl font-bold text-gray-800">
                  ⏰ Upcoming Tasks
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="group">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-sm hover:shadow-md transition-all border-2 border-gray-100 group-hover:border-green-300">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-3 rounded-sm shadow-lg ${
                              task.priority === "High"
                                ? "bg-gradient-to-br from-red-400 to-red-600"
                                : task.priority === "Medium"
                                ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                : "bg-gradient-to-br from-blue-400 to-blue-600"
                            }`}
                          >
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">
                              {task.task}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                              {task.dueDate}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {task.assignedTo}
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

          {/* Recent Joiners */}
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 border-b border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800">
                🎉 Recent Joiners
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentJoiners.map((employee, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-sm blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative p-6 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-sm border-2 border-orange-200 hover:shadow-1xl transition-all transform ">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <p className="font-bold text-gray-800 text-center text-lg mb-1">
                        {employee.name}
                      </p>
                      <p className="text-sm text-gray-600 text-center font-semibold mb-1">
                        {employee.designation}
                      </p>
                      <p className="text-xs text-gray-500 text-center mb-3">
                        {employee.department}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-sm shadow-sm text-center">
                          <p className="text-xs text-gray-600 font-semibold">
                            Join Date
                          </p>
                          <p className="text-xs font-bold text-orange-600 mt-1">
                            {employee.joinDate}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-sm shadow-sm text-center">
                          <p className="text-xs text-gray-600 font-semibold">
                            Salary
                          </p>
                          <p className="text-xs font-bold text-green-600 mt-1">
                            {employee.salary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Overview Table */}
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 border-b border-purple-200">
              <h3 className="text-xl font-bold text-gray-800">
                🏢 Department Overview
              </h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 rounded-l-sm">
                      Department
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                      Total Employees
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                      Present Today
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                      On Leave
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-700 rounded-r-sm">
                      Avg Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 transition-all"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-sm shadow-lg"
                            style={{ backgroundColor: dept.color }}
                          ></div>
                          <span className="font-bold text-gray-800 text-base">
                            {dept.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-5 px-6 font-bold text-gray-800 text-base">
                        {dept.employees}
                      </td>
                      <td className="text-center py-5 px-6">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-sm text-sm font-bold">
                          {Math.floor(dept.employees * 0.93)}
                        </span>
                      </td>
                      <td className="text-center py-5 px-6">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-sm text-sm font-bold">
                          {Math.floor(dept.employees * 0.07)}
                        </span>
                      </td>
                      <td className="text-center py-5 px-6 font-bold text-orange-600 text-base">
                        93%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-sm border-2 border-orange-200 hover:shadow-lg transition-all transform ">
              <Calendar className="w-8 h-8 text-orange-600 mb-3 mx-auto" />
              <p className="font-bold text-gray-800 text-center">Attendance</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-sm border-2 border-blue-200 hover:shadow-lg transition-all transform ">
              <ClipboardList className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
              <p className="font-bold text-gray-800 text-center">
                Leave Management
              </p>
            </button>
            <button className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-sm border-2 border-green-200 hover:shadow-lg transition-all transform ">
              <DollarSign className="w-8 h-8 text-green-600 mb-3 mx-auto" />
              <p className="font-bold text-gray-800 text-center">Salary</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-sm border-2 border-purple-200 hover:shadow-lg transition-all transform ">
              <BookOpen className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
              <p className="font-bold text-gray-800 text-center">Policies</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
