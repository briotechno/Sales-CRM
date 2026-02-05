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
  AlertCircle,
  RefreshCw,
  Warehouse,
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
  const { data: dashboardResponse, isLoading, isFetching, isError, error, refetch } = useGetHRMDashboardDataQuery();

  // Handle loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard Data...</p>
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
          <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-sm border border-red-100 max-w-md text-center shadow-lg">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Oops! Something went wrong</h2>
            <p className="text-red-600 font-medium text-sm">
              {error?.data?.message || "Failed to fetch dashboard data. Please try again later."}
            </p>
            <button onClick={refetch} className="mt-2 px-6 py-2 bg-red-600 text-white rounded-sm font-bold text-xs uppercase transition hover:bg-red-700 shadow-md">
              Try Again
            </button>
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
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">HRM Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">Dashboard Analytics</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refetch}
                  className={`p-3 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 text-gray-600 transition shadow-sm active:scale-95 ${isFetching ? "ring-2 ring-orange-500/20" : ""}`}
                  title="Refresh Dashboard"
                >
                  <RefreshCw size={20} className={isFetching ? "animate-spin text-orange-500" : ""} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-8xl mx-auto px-6 py-6 space-y-6">
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
            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 border-b border-orange-400">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={20} /> Weekly Attendance
                </h3>
              </div>
              <div className="p-6 flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#94a3b8"
                      axisLine={false}
                      tickLine={false}
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      axisLine={false}
                      tickLine={false}
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        padding: "12px",
                      }}
                    />
                    <Bar
                      dataKey="present"
                      fill="#22c55e"
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
            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 border-b border-purple-400">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Warehouse size={20} /> Department Distribution
                </h3>
              </div>
              <div className="p-6 flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.departmentDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value) => [`${value} employees`, "Count"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Requests */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 border-b border-blue-400">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList size={20} /> Leave Requests
                  </h3>
                  <button className="text-blue-600 text-[10px] font-black hover:bg-gray-50 bg-white px-3 py-1 rounded-sm shadow-sm transition-all uppercase tracking-wider">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {(dashboardData.leaveRequests || []).slice(0, 5).map((request, index) => (
                    <div key={index} className="group">
                      <div className="p-4 bg-white rounded-sm hover:bg-gray-50 transition-all border border-gray-100 hover:border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs shadow-md">
                              {request.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">
                                {request.name}
                              </p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                {request.department} • {request.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-sm text-[10px] font-bold shadow-sm uppercase ${request.status?.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : request.status?.toLowerCase() === "approved"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                                }`}
                            >
                              {request.status}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-2 font-bold">
                              {request.date} • {request.days}D
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData.leaveRequests || dashboardData.leaveRequests.length === 0) && (
                    <div className="text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-sm border-2 border-dashed border-gray-200">
                      <ClipboardList size={40} className="mx-auto mb-2 text-gray-300" />
                      No recent leave requests found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-orange-500/50 transition-all group">
                  <div className="p-3 bg-orange-100 rounded-sm mb-2 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">Attendance</p>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group">
                  <div className="p-3 bg-blue-100 rounded-sm mb-2 group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">Leaves</p>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-green-500/50 transition-all group">
                  <div className="p-3 bg-green-100 rounded-sm mb-2 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">Salary</p>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all group">
                  <div className="p-3 bg-purple-100 rounded-sm mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">Policies</p>
                </button>
              </div>

              {/* Summary Stats Mini Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm p-4 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Monthly Performance</p>
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Attendance Rate</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[94%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Project Completion</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[78%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Joiners */}
          <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 border-b border-yellow-400">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award size={20} /> Recent Joiners
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(dashboardData.recentJoiners || []).map((employee, index) => (
                  <div key={index} className="relative group">
                    <div className="p-4 bg-white rounded-sm border border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-md flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                        {employee.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate text-sm">
                          {employee.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight truncate">
                          {employee.designation}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-sm border border-green-100 uppercase tracking-widest">
                            {employee.salary}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {employee.joinDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!dashboardData.recentJoiners || dashboardData.recentJoiners.length === 0) && (
                  <div className="md:col-span-3 text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-sm border-2 border-dashed border-gray-200">
                    <Users size={40} className="mx-auto mb-2 text-gray-300" />
                    No recent joiners found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Department Overview Table */}
          <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a222c] to-[#2d3a4b] p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Warehouse size={20} /> Department Overview
              </h3>
            </div>
            <div className="p-0 overflow-x-auto">
              {dashboardData.departmentOverview && dashboardData.departmentOverview.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b">
                        Department
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b">
                        Employees
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b">
                        Present
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b">
                        On Leave
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b">
                        Avg Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dashboardData.departmentOverview.map((dept, index) => (
                      <tr
                        key={index}
                        className="hover:bg-orange-50/30 transition-all font-medium"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: dept.color }}
                            ></div>
                            <span className="font-bold text-gray-800 text-sm">
                              {dept.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-6 font-bold text-gray-800 text-sm">
                          {dept.totalEmployees}
                        </td>
                        <td className="text-center py-4 px-6">
                          <span className="text-green-600 font-bold text-sm">
                            {dept.presentToday}
                          </span>
                        </td>
                        <td className="text-center py-4 px-6">
                          <span className="text-red-500 font-bold text-sm">
                            {dept.onLeave}
                          </span>
                        </td>
                        <td className="text-center py-4 px-6">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-orange-600 text-sm">{dept.avgAttendance}</span>
                            <div className="w-16 bg-gray-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-orange-500 h-full" style={{ width: dept.avgAttendance }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-400 font-medium  rounded-sm border-2 border-dashed border-gray-100 m-6">
                  <Users size={40} className="mx-auto mb-2 text-gray-300" />
                  No department data available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Sub-component Helper
const TrendingUp = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
