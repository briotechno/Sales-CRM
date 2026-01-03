import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Calendar,
  ClipboardList,
  DollarSign,
  BookOpen,
  UserCheck,
  Clock,
  Award,
  Home,
  Loader2,
  AlertCircle
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
} from "recharts";
import NumberCard from "../../components/NumberCard";
import { useGetHRMDashboardDataQuery } from "../../store/api/hrmDashboardApi";

export default function HRMDashboard() {
  const { data: dashboardResponse, isLoading, isError, error } = useGetHRMDashboardDataQuery();

  // Handle loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-lg border border-red-100 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">Oops! Something went wrong</h2>
            <p className="text-red-600 font-medium">
              {error?.data?.message || "Failed to fetch dashboard data. Please try again later."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardData = dashboardResponse?.data || {};

  const attendanceData = [
    { day: "Mon", present: 1180, absent: 67 },
    { day: "Tue", present: 1165, absent: 82 },
    { day: "Wed", present: 1190, absent: 57 },
    { day: "Thu", present: 1156, absent: 91 },
    { day: "Fri", present: 1200, absent: 47 },
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
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-0 ml-10 py-4 bg-white border-b my-3">
            <div className="flex items-center justify-between">
              {/* Left Title Section */}
              <div className="">
                <h1 className="text-2xl font-bold text-gray-800">
                  HRM Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NumberCard
              title="Total Employees"
              number={dashboardData.summary?.totalEmployees?.value || 0}
              up={dashboardData.summary?.totalEmployees?.trend}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Present Today"
              number={dashboardData.summary?.presentToday?.value || 0}
              up={dashboardData.summary?.presentToday?.trend}
              icon={<UserCheck className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="On Leave"
              number={dashboardData.summary?.onLeave?.value || 0}
              down={dashboardData.summary?.onLeave?.trend}
              icon={<Clock className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Unread Leads"
              number={dashboardData.summary?.unreadLeads?.value || 0}
              up={dashboardData.summary?.unreadLeads?.trend}
              icon={<Award className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
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
                      data={dashboardData.departmentDistribution || []}
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
                      {(dashboardData.departmentDistribution || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
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
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
                  {(dashboardData.leaveRequests || []).map((request, index) => (
                    <div key={index} className="group">
                      <div className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-sm hover:shadow-lg transition-all border-2 border-gray-100 group-hover:border-orange-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {request.name
                                ?.split(" ")
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
                              className={`px-4 py-2 rounded-sm text-xs font-bold shadow-sm ${request.status === "Pending" || request.status === "pending"
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                                : request.status === "Approved" || request.status === "approved"
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                }`}
                            >
                              {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                              {request.date} • {request.days} {request.days === 1 ? 'day' : 'days'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData.leaveRequests || dashboardData.leaveRequests.length === 0) && (
                    <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      No recent leave requests found.
                    </div>
                  )}
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
                {(dashboardData.recentJoiners || []).map((employee, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-sm blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative p-6 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-sm border-2 border-orange-200 hover:shadow-1xl transition-all transform ">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                          {employee.name
                            ?.split(" ")
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
                {(!dashboardData.recentJoiners || dashboardData.recentJoiners.length === 0) && (
                  <div className="md:col-span-3 text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    No recent joiners found.
                  </div>
                )}
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
              {dashboardData.departmentOverview && dashboardData.departmentOverview.length > 0 ? (
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
                    {dashboardData.departmentOverview.map((dept, index) => (
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
                          {dept.totalEmployees}
                        </td>
                        <td className="text-center py-5 px-6">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-sm text-sm font-bold">
                            {dept.presentToday}
                          </span>
                        </td>
                        <td className="text-center py-5 px-6">
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-sm text-sm font-bold">
                            {dept.onLeave}
                          </span>
                        </td>
                        <td className="text-center py-5 px-6 font-bold text-orange-600 text-base">
                          {dept.avgAttendance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  No department data available.
                </div>
              )}
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
