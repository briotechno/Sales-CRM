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
  UserPlus,
  Briefcase,
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

  // Static Data Fallbacks
  const leaveRequests = dashboardData.leaveRequests?.length > 0 ? dashboardData.leaveRequests : [
    { name: "Rahul Sharma", department: "Operations", type: "Sick Leave", status: "Pending", date: "05 Mar", days: 2 },
    { name: "Priya Singh", department: "Inside Sales", type: "Annual Leave", status: "Approved", date: "08 Mar", days: 5 },
    { name: "Amit Patel", department: "IT Support", type: "Casual Leave", status: "Rejected", date: "04 Mar", days: 1 },
    { name: "Sneha Reddy", department: "HR", type: "Maternity Leave", status: "Pending", date: "15 Mar", days: 90 },
    { name: "Vikram Mehta", department: "Finance", type: "Sick Leave", status: "Approved", date: "02 Mar", days: 3 },
  ];

  const recentJoiners = dashboardData.recentJoiners?.length > 0 ? dashboardData.recentJoiners : [
    { name: "Kunal Ghosh", designation: "Software Engineer", department: "IT", joiningDate: "01 Mar", avatar: "https://i.pravatar.cc/150?u=40" },
    { name: "Ishani Vyas", designation: "HR Executive", department: "HR", joiningDate: "02 Mar", avatar: "https://i.pravatar.cc/150?u=41" },
    { name: "Rajesh Kumar", designation: "Fleet Manager", department: "Operations", joiningDate: "03 Mar", avatar: "https://i.pravatar.cc/150?u=42" },
    { name: "Sanya Malhotra", designation: "Sales Associate", department: "Sales", joiningDate: "04 Mar", avatar: "https://i.pravatar.cc/150?u=43" },
  ];

  const departmentDistribution = (dashboardData.departmentDistribution || dashboardData.departmentOverview)?.length > 0
    ? (dashboardData.departmentDistribution || dashboardData.departmentOverview)
    : [
      { name: "Operations", employees: 420, totalEmployees: 420, presentToday: 412, onLeave: 12, avgAttendance: "92%", color: "#f97316" },
      { name: "Sales", employees: 280, totalEmployees: 280, presentToday: 265, onLeave: 5, avgAttendance: "95%", color: "#3b82f6" },
      { name: "IT", employees: 120, totalEmployees: 120, presentToday: 115, onLeave: 2, avgAttendance: "96%", color: "#8b5cf6" },
      { name: "HR", employees: 45, totalEmployees: 45, presentToday: 42, onLeave: 1, avgAttendance: "94%", color: "#ec4899" },
      { name: "Finance", employees: 65, totalEmployees: 65, presentToday: 60, onLeave: 3, avgAttendance: "92%", color: "#10b981" },
    ];

  const summary = {
    totalEmployees: dashboardData.summary?.totalEmployees?.value || 930,
    presentToday: dashboardData.summary?.presentToday?.value || 894,
    onLeave: dashboardData.summary?.onLeave?.value || 23,
    newAlerts: dashboardData.summary?.unreadLeads?.value || 12,
    trends: {
      total: dashboardData.summary?.totalEmployees?.trend || "+12%",
      present: dashboardData.summary?.presentToday?.trend || "96%",
      leave: dashboardData.summary?.onLeave?.trend || "Low",
      alerts: dashboardData.summary?.unreadLeads?.trend || "Priority"
    }
  };

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
      <div className="min-h-screen bg-white font-primary">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-[100%] mx-auto px-6 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Title Section */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  HRM Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400">HRM / </span>
                  <span className="text-[#FF7B1D] font-medium">Dashboard</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={refetch}
                  className="p-3 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 text-gray-700 transition-all shadow-sm active:scale-95"
                  title="Refresh Dashboard"
                >
                  <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                </button>

                <button className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                  <Users size={20} />
                  Add New Employee
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-[100%] mx-auto px-6 py-6 space-y-6">
          {/* KPI Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Employees */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-blue-500 bg-blue-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <Users size={18} className="text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Total Employees</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                    {summary.totalEmployees}
                  </span>
                  <span className="text-[9px] font-bold text-green-600 mt-1">{summary.trends.total} growth</span>
                </div>
              </div>
            </div>

            {/* Present Today */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-green-500 bg-green-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <UserCheck size={18} className="text-green-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Present Today</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                    {summary.presentToday}
                  </span>
                  <span className="text-[9px] font-bold text-green-600 mt-1">{summary.trends.present} presence</span>
                </div>
              </div>
            </div>

            {/* On Leave */}
            <div className="rounded-sm shadow-sm border border-gray-100 p-4 border-t-4 border-t-orange-500 bg-orange-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <Clock size={18} className="text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">On Leave</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                    {summary.onLeave}
                  </span>
                  <span className="text-[9px] font-bold text-rose-600 mt-1">{summary.trends.leave} status</span>
                </div>
              </div>
            </div>

            {/* New Alerts */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-purple-500 bg-purple-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <Award size={18} className="text-purple-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">New Alerts</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                    {summary.newAlerts}
                  </span>
                  <span className="text-[9px] font-bold text-green-600 mt-1">{summary.trends.alerts}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Attendance & Department Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Attendance Chart */}
            <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6 flex flex-col">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight">Weekly Attendance</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Presence tracking</p>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="present" fill="#f97316" radius={[2, 2, 0, 0]} barSize={20} />
                    <Bar dataKey="absent" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="bg-white rounded-sm border border-blue-50 shadow-lg p-6 flex flex-col">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-md">
                  <Warehouse size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight">Department Layout</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Employee distribution</p>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-44 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="employees"
                      >
                        {departmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Requests */}
            <div className="lg:col-span-2 bg-white rounded-sm border border-gray-100 shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 mr-4 shadow-md">
                    <ClipboardList size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">Leave Requests</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Pending approvals</p>
                  </div>
                </div>
                <button className="text-indigo-600 text-[11px] font-bold hover:bg-indigo-50 px-4 py-2 border border-indigo-200 rounded-sm shadow-sm transition-all uppercase tracking-widest">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {leaveRequests.slice(0, 5).map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                        {request.name?.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{request.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{request.department} • {request.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-tighter shadow-sm ${request.status?.toLowerCase() === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        request.status?.toLowerCase() === "approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                        {request.status}
                      </span>
                      <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{request.date} • {request.days}D</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Monthly Performance */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Control Panel</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <UserCheck className="w-6 h-6" />, label: "Attendance", color: "orange" },
                  { icon: <ClipboardList className="w-6 h-6" />, label: "Leaves", color: "blue" },
                  { icon: <DollarSign className="w-6 h-6" />, label: "Salary", color: "green" },
                  { icon: <BookOpen className="w-6 h-6" />, label: "Policies", color: "purple" }
                ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all group">
                    <div className={`p-3 rounded-sm mb-3 group-hover:scale-110 transition-transform bg-${action.color}-50 text-${action.color}-600`}>
                      {action.icon}
                    </div>
                    <p className="font-bold text-gray-800 text-[10px] uppercase tracking-widest">{action.label}</p>
                  </button>
                ))}
              </div>

              {/* Monthly Performance Mini Card */}
              <div className="bg-slate-900 rounded-sm p-6 text-white shadow-2xl relative overflow-hidden border border-slate-800 mt-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Efficiency Index</p>
                  <TrendingUp size={18} className="text-orange-500" />
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-slate-400">Presence</span>
                      <span className="text-orange-500">94%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-orange-600 h-full rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-slate-400">Projects</span>
                      <span className="text-blue-500">78%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Recent Joiners & Detailed Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Joiners */}
            <div className="bg-white rounded-sm border border-gray-100 shadow-lg p-6 flex flex-col">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                  <UserPlus size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight">Recent Joiners</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Welcome aboard</p>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {recentJoiners.slice(0, 5).map((joiner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100 hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={joiner.avatar || "https://i.pravatar.cc/100"}
                          alt={joiner.name}
                          className="w-10 h-10 rounded-sm border border-gray-200 object-cover shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{joiner.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-wrap">{joiner.designation} • {joiner.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{joiner.joiningDate || joiner.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Overview Table */}
            <div className="lg:col-span-2 bg-white rounded-sm border border-gray-100 shadow-lg p-6 flex flex-col">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-md">
                  <Warehouse size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight">Department Pulse</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Headcount & Attendance</p>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                      <th className="pb-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staff</th>
                      <th className="pb-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present</th>
                      <th className="pb-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">On Leave</th>
                      <th className="pb-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Stats</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {departmentDistribution.map((dept, index) => (
                      <tr key={index} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2.5 h-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: dept.color || COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {dept.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center font-black text-gray-800 text-sm">
                          {dept.employees || dept.totalEmployees}
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-emerald-600 font-bold text-sm">
                            {dept.presentToday || '-'}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-rose-500 font-bold text-sm">
                            {dept.onLeave || '-'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-bold text-orange-600 text-[10px]">{dept.avgAttendance || '95%'}</span>
                            <div className="w-16 bg-gray-100 h-1 rounded-full overflow-hidden shadow-inner">
                              <div className="bg-orange-500 h-full" style={{ width: dept.avgAttendance || '95%' }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
