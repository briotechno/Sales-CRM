// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../components/DashboardLayout";
// import AddLeadModal from "../components/AddNewLeads/AddNewLead";
// import BulkUploadLeads from "../components/AddNewLeads/BulkUpload";
// import {
//   Users,
//   UserPlus,
//   Upload,
//   TrendingUp,
//   TrendingDown,
//   Target,
//   Phone,
//   Mail,
//   Calendar,
//   DollarSign,
//   FileText,
//   CheckCircle,
//   Clock,
//   XCircle,
//   ArrowUp,
//   ArrowDown,
//   Activity,
//   Briefcase,
//   UserCheck,
//   Filter,
//   Eye,
//   Edit,
// } from "lucide-react";

// const CRMDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [openLeadMenu, setOpenLeadMenu] = useState(false);

//   const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);

//   const handleBulkUpload = () => {
//     setShowBulkUploadPopup(true);
//   };

//   // function
//   const handleAddLead = () => {
//     console.log("Add Lead clicked, current state:", isPopupOpen);
//     setIsPopupOpen(true);
//   };

//   const handleCloseModal = () => {
//     console.log("Closing modal");
//     setIsPopupOpen(false);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   // Dashboard Stats Data
//   const stats = {
//     leads: {
//       total: 1247,
//       new: 89,
//       unread: 34,
//       dropped: 156,
//       trending: 45,
//       conversionRate: 23.5,
//       growth: 15.8,
//     },
//     pipeline: {
//       totalValue: 4567890,
//       activeDeals: 234,
//       wonDeals: 89,
//       lostDeals: 45,
//       avgDealSize: 45678,
//       growth: 12.3,
//     },
//     clients: {
//       total: 567,
//       active: 489,
//       inactive: 78,
//       newThisMonth: 34,
//       growth: 8.9,
//     },
//     employees: {
//       total: 45,
//       active: 42,
//       resigned: 3,
//       onLeave: 5,
//       present: 37,
//     },
//     channels: {
//       meta: 234,
//       justdial: 189,
//       indiamart: 145,
//       googleDocs: 98,
//       crmForm: 156,
//     },
//     activities: {
//       quotations: 89,
//       invoices: 156,
//       expenses: 234567,
//       todos: 23,
//       notes: 45,
//     },
//   };

//   const recentLeads = [
//     {
//       id: "LD-001",
//       name: "Rajesh Kumar",
//       company: "Tech Solutions Pvt Ltd",
//       source: "Meta",
//       status: "New",
//       value: 125000,
//       date: "2025-11-10",
//     },
//     {
//       id: "LD-002",
//       name: "Priya Sharma",
//       company: "Digital Marketing Co",
//       source: "Justdial",
//       status: "Trending",
//       value: 89000,
//       date: "2025-11-09",
//     },
//     {
//       id: "LD-003",
//       name: "Amit Patel",
//       company: "Manufacturing Inc",
//       source: "Indiamart",
//       status: "Unread",
//       value: 234000,
//       date: "2025-11-09",
//     },
//     {
//       id: "LD-004",
//       name: "Sneha Gupta",
//       company: "Retail Chain Ltd",
//       source: "CRM Form",
//       status: "New",
//       value: 156000,
//       date: "2025-11-08",
//     },
//   ];

//   const pipelineStages = [
//     { name: "Prospecting", count: 45, value: 567890 },
//     { name: "Qualification", count: 34, value: 456780 },
//     { name: "Proposal", count: 23, value: 789012 },
//     { name: "Negotiation", count: 12, value: 345678 },
//     { name: "Closed Won", count: 89, value: 2345678 },
//   ];

//   const topPerformers = [
//     { name: "Vikram Singh", leads: 45, deals: 23, revenue: 1234567 },
//     { name: "Anita Desai", leads: 38, deals: 19, revenue: 987654 },
//     { name: "Rahul Mehta", leads: 34, deals: 17, revenue: 876543 },
//     { name: "Kavita Joshi", leads: 29, deals: 15, revenue: 765432 },
//   ];

//   const SkeletonLoader = () => (
//     <div className="animate-pulse flex flex-col gap-4 w-full">
//       <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-200 rounded p-4">
//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <div className="w-12 h-12 rounded-full bg-gray-300"></div>
//           <div className="flex flex-col gap-2 w-full">
//             <div className="h-5 w-[150px] bg-gray-300 rounded"></div>
//             <div className="h-4 w-[250px] bg-gray-300 rounded"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gray-0">
//         <div className="max-w-[100%] mx-auto p-0 ml-6 md:p-0">
//           {loading ? (
//             <SkeletonLoader />
//           ) : (
//             <>
//               {/* Welcome Section */}
//               <div className="bg-gradient-to-r from-[#3B7080] to-[#2f5a67] rounded-sm shadow-sm p-6 mb-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <img
//                       src="https://i.pravatar.cc/60"
//                       alt="Profile"
//                       className="w-14 h-14 rounded-full border-4 border-white"
//                     />
//                     <div>
//                       <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//                         Welcome Back, NK Yadav
//                         <Edit
//                           size={18}
//                           className="text-white/80 cursor-pointer hover:text-white"
//                         />
//                       </h2>
//                       <p className="text-white/90 text-sm mt-1">
//                         You have{" "}
//                         <span className="font-bold text-[#F26422]">
//                           {stats.leads.new} new leads
//                         </span>{" "}
//                         and{" "}
//                         <span className="font-bold text-[#F26422]">
//                           {stats.leads.unread} unread
//                         </span>{" "}
//                         leads to follow up
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-3 relative">
//                     {/* Add Lead Button */}
//                     <button
//                       onClick={() => setOpenLeadMenu(!openLeadMenu)}
//                       className="bg-[#F26422] text-white px-6 py-2.5 rounded-sm flex items-center justify-center gap-2 font-semibold hover:bg-[#d95a1f] transition-all shadow-sm hover:shadow-lg"
//                     >
//                       <UserPlus size={20} /> Add Lead
//                     </button>

//                     {/* Dropdown Menu */}
//                     {openLeadMenu && (
//                       <div className="absolute top-full left-0 mt-2 w-40 bg-white border shadow-md rounded-sm z-50">
//                         <button
//                           onClick={() => {
//                             setOpenLeadMenu(false);
//                             handleAddLead(); // <-- open Single Lead form
//                           }}
//                           className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
//                         >
//                           <UserPlus size={16} />
//                           Single Lead
//                         </button>

//                         <button
//                           onClick={() => {
//                             setOpenLeadMenu(false);
//                             handleBulkUpload();
//                           }}
//                           className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
//                         >
//                           <Upload size={16} />
//                           Bulk Upload
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Main Stats Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 {/* Total Leads */}
//                 <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-[#F26422] hover:shadow-lg transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="bg-orange-100 p-3 rounded-lg">
//                       <Users className="text-[#F26422]" size={24} />
//                     </div>
//                     <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
//                       <ArrowUp size={16} />
//                       {stats.leads.growth}%
//                     </div>
//                   </div>
//                   <h3 className="text-gray-600 text-sm font-medium mb-1">
//                     Total Leads
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mb-2">
//                     {stats.leads.total.toLocaleString()}
//                   </p>
//                   <div className="flex gap-3 text-xs">
//                     <span className="text-blue-600 font-medium">
//                       New: {stats.leads.new}
//                     </span>
//                     <span className="text-orange-600 font-medium">
//                       Unread: {stats.leads.unread}
//                     </span>
//                     <span className="text-purple-600 font-medium">
//                       Trending: {stats.leads.trending}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Pipeline Value */}
//                 <div className="bg-white rounded-sm shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="bg-green-100 p-3 rounded-lg">
//                       <Target className="text-green-600" size={24} />
//                     </div>
//                     <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
//                       <ArrowUp size={16} />
//                       {stats.pipeline.growth}%
//                     </div>
//                   </div>
//                   <h3 className="text-gray-600 text-sm font-medium mb-1">
//                     Pipeline Value
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mb-2">
//                     ₹{(stats.pipeline.totalValue / 100000).toFixed(1)}L
//                   </p>
//                   <div className="flex gap-3 text-xs">
//                     <span className="text-blue-600 font-medium">
//                       Active: {stats.pipeline.activeDeals}
//                     </span>
//                     <span className="text-green-600 font-medium">
//                       Won: {stats.pipeline.wonDeals}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Total Clients */}
//                 <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="bg-blue-100 p-3 rounded-lg">
//                       <Briefcase className="text-blue-600" size={24} />
//                     </div>
//                     <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
//                       <ArrowUp size={16} />
//                       {stats.clients.growth}%
//                     </div>
//                   </div>
//                   <h3 className="text-gray-600 text-sm font-medium mb-1">
//                     Total Clients
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mb-2">
//                     {stats.clients.total}
//                   </p>
//                   <div className="flex gap-3 text-xs">
//                     <span className="text-green-600 font-medium">
//                       Active: {stats.clients.active}
//                     </span>
//                     <span className="text-gray-500 font-medium">
//                       New: {stats.clients.newThisMonth}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Conversion Rate */}
//                 <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="bg-purple-100 p-3 rounded-lg">
//                       <TrendingUp className="text-purple-600" size={24} />
//                     </div>
//                     <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
//                       <ArrowUp size={16} />
//                       3.2%
//                     </div>
//                   </div>
//                   <h3 className="text-gray-600 text-sm font-medium mb-1">
//                     Conversion Rate
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mb-2">
//                     {stats.leads.conversionRate}%
//                   </p>
//                   <div className="flex gap-3 text-xs">
//                     <span className="text-green-600 font-medium">
//                       Avg Deal: ₹
//                       {(stats.pipeline.avgDealSize / 1000).toFixed(0)}K
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Secondary Stats - Channel Integration & Activities */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//                 {/* Channel Integration */}
//                 <div className="bg-white rounded-lg shadow-md p-5">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-indigo-100 p-2 rounded-lg">
//                       <Activity className="text-indigo-600" size={20} />
//                     </div>
//                     <h3 className="text-gray-800 font-bold text-lg">
//                       Channel Performance
//                     </h3>
//                   </div>
//                   <div className="space-y-3">
//                     {Object.entries(stats.channels).map(([channel, count]) => (
//                       <div
//                         key={channel}
//                         className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
//                       >
//                         <span className="text-sm font-medium text-gray-700 capitalize">
//                           {channel === "meta"
//                             ? "Meta"
//                             : channel === "justdial"
//                             ? "Justdial"
//                             : channel === "indiamart"
//                             ? "Indiamart"
//                             : channel === "googleDocs"
//                             ? "Google Docs"
//                             : "CRM Form"}
//                         </span>
//                         <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
//                           {count}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Employee Stats */}
//                 <div className="bg-white rounded-sm shadow-sm p-5">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-emerald-100 p-2 rounded-lg">
//                       <UserCheck className="text-emerald-600" size={20} />
//                     </div>
//                     <h3 className="text-gray-800 font-bold text-lg">
//                       Team Overview
//                     </h3>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span className="text-sm text-gray-600">
//                         Total Employees
//                       </span>
//                       <span className="font-bold text-gray-800">
//                         {stats.employees.total}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 bg-green-50 rounded">
//                       <span className="text-sm text-gray-600">
//                         Present Today
//                       </span>
//                       <span className="font-bold text-green-600">
//                         {stats.employees.present}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
//                       <span className="text-sm text-gray-600">On Leave</span>
//                       <span className="font-bold text-orange-600">
//                         {stats.employees.onLeave}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
//                       <span className="text-sm text-gray-600">Active</span>
//                       <span className="font-bold text-blue-600">
//                         {stats.employees.active}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Activities Summary */}
//                 <div className="bg-white rounded-sm shadow-sm p-5">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-pink-100 p-2 rounded-lg">
//                       <FileText className="text-pink-600" size={20} />
//                     </div>
//                     <h3 className="text-gray-800 font-bold text-lg">
//                       Recent Activities
//                     </h3>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span className="text-sm text-gray-600">Quotations</span>
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
//                         {stats.activities.quotations}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span className="text-sm text-gray-600">Invoices</span>
//                       <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
//                         {stats.activities.invoices}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span className="text-sm text-gray-600">
//                         Pending To-Do
//                       </span>
//                       <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-sm">
//                         {stats.activities.todos}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span className="text-sm text-gray-600">
//                         Total Expenses
//                       </span>
//                       <span className="font-bold text-gray-800">
//                         ₹{(stats.activities.expenses / 1000).toFixed(0)}K
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Pipeline Stages */}
//               <div className="bg-white rounded-sm shadow-sm p-5 mb-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-xl font-bold text-gray-800">
//                     Pipeline Stages
//                   </h3>
//                   <button className="text-[#F26422] text-sm font-semibold hover:underline">
//                     Manage Pipeline
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                   {pipelineStages.map((stage, index) => (
//                     <div
//                       key={stage.name}
//                       className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm p-4 border-2 border-gray-200 hover:border-[#F26422] transition-all"
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-bold text-gray-700 text-sm">
//                           {stage.name}
//                         </h4>
//                         <span className="bg-[#F26422] text-white text-xs font-bold px-2 py-1 rounded-full">
//                           {stage.count}
//                         </span>
//                       </div>
//                       <p className="text-xl font-bold text-gray-800">
//                         ₹{(stage.value / 100000).toFixed(1)}L
//                       </p>
//                       <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-[#F26422] h-2 rounded-full"
//                           style={{
//                             width: `${
//                               (stage.count / stats.leads.total) * 100
//                             }%`,
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Recent Leads & Top Performers */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 {/* Recent Leads */}
//                 <div className="bg-white rounded-sm shadow-sm p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-bold text-gray-800">
//                       Recent Leads
//                     </h3>
//                     <button className="text-[#F26422] text-sm font-semibold hover:underline flex items-center gap-1">
//                       View All <Filter size={14} />
//                     </button>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
//                             Lead ID
//                           </th>
//                           <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
//                             Name
//                           </th>
//                           <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
//                             Source
//                           </th>
//                           <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
//                             Value
//                           </th>
//                           <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
//                             Status
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {recentLeads.map((lead) => (
//                           <tr key={lead.id} className="hover:bg-gray-50">
//                             <td className="px-3 py-3 text-sm font-medium text-[#F26422]">
//                               {lead.id}
//                             </td>
//                             <td className="px-3 py-3">
//                               <div className="text-sm font-semibold text-gray-800">
//                                 {lead.name}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {lead.company}
//                               </div>
//                             </td>
//                             <td className="px-3 py-3">
//                               <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
//                                 {lead.source}
//                               </span>
//                             </td>
//                             <td className="px-3 py-3 text-sm font-bold text-gray-800">
//                               ₹{(lead.value / 1000).toFixed(0)}K
//                             </td>
//                             <td className="px-3 py-3">
//                               <span
//                                 className={`px-2 py-1 text-xs font-bold rounded-full ${
//                                   lead.status === "New"
//                                     ? "bg-green-100 text-green-700"
//                                     : lead.status === "Trending"
//                                     ? "bg-purple-100 text-purple-700"
//                                     : "bg-orange-100 text-orange-700"
//                                 }`}
//                               >
//                                 {lead.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Top Performers */}
//                 <div className="bg-white rounded-sm shadow-sm p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-bold text-gray-800">
//                       Top Performers
//                     </h3>
//                     <button className="text-[#F26422] text-sm font-semibold hover:underline">
//                       View All
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     {topPerformers.map((performer, index) => (
//                       <div
//                         key={performer.name}
//                         className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-sm border border-gray-200 hover:border-[#F26422] transition-all"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="bg-gradient-to-br from-[#F26422] to-[#d95a1f] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
//                             {index + 1}
//                           </div>
//                           <div>
//                             <p className="font-bold text-gray-800">
//                               {performer.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {performer.leads} leads • {performer.deals} deals
//                               closed
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-gray-800">
//                             ₹{(performer.revenue / 100000).toFixed(1)}L
//                           </p>
//                           <div className="flex items-center gap-1 justify-end mt-1">
//                             <TrendingUp size={14} className="text-green-600" />
//                             <span className="text-xs font-semibold text-green-600">
//                               +12%
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modal Component - Fixed */}
//       {isPopupOpen && (
//         <AddLeadModal isOpen={isPopupOpen} onClose={handleCloseModal} />
//       )}

//       {showBulkUploadPopup && (
//         <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />
//       )}
//     </DashboardLayout>
//   );
// };

// export default CRMDashboard;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddLeadModal from "../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../components/AddNewLeads/BulkUpload";
import {
  Users,
  UserPlus,
  Upload,
  TrendingUp,
  TrendingDown,
  Target,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  Briefcase,
  UserCheck,
  Filter,
  Eye,
  Edit,
} from "lucide-react";
import NumberCard from "../components/NumberCard";

const CRMDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openLeadMenu, setOpenLeadMenu] = useState(false);
  const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);

  // Attendance states
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingHours, setWorkingHours] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleBulkUpload = () => {
    setShowBulkUploadPopup(true);
  };

  const handlePunchIn = () => {
    const now = new Date();
    setPunchInTime(now);
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    setPunchInTime(null);
    setWorkingHours({ hours: 0, minutes: 0, seconds: 0 });
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate working hours
  useEffect(() => {
    if (isPunchedIn && punchInTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - punchInTime) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setWorkingHours({ hours, minutes, seconds });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPunchedIn, punchInTime]);

  // function
  const handleAddLead = () => {
    console.log("Add Lead clicked, current state:", isPopupOpen);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Dashboard Stats Data
  const stats = {
    leads: {
      total: 1247,
      new: 89,
      unread: 34,
      dropped: 156,
      trending: 45,
      conversionRate: 23.5,
      growth: 15.8,
    },
    pipeline: {
      totalValue: 4567890,
      activeDeals: 234,
      wonDeals: 89,
      lostDeals: 45,
      avgDealSize: 45678,
      growth: 12.3,
    },
    clients: {
      total: 567,
      active: 489,
      inactive: 78,
      newThisMonth: 34,
      growth: 8.9,
    },
    employees: {
      total: 45,
      active: 42,
      resigned: 3,
      onLeave: 5,
      present: 37,
    },
    channels: {
      meta: 234,
      justdial: 189,
      indiamart: 145,
      googleDocs: 98,
      crmForm: 156,
    },
    activities: {
      quotations: 89,
      invoices: 156,
      expenses: 234567,
      todos: 23,
      notes: 45,
    },
  };

  const recentLeads = [
    {
      id: "LD-001",
      name: "Rajesh Kumar",
      company: "Tech Solutions Pvt Ltd",
      source: "Meta",
      status: "New",
      value: 125000,
      date: "2025-11-10",
    },
    {
      id: "LD-002",
      name: "Priya Sharma",
      company: "Digital Marketing Co",
      source: "Justdial",
      status: "Trending",
      value: 89000,
      date: "2025-11-09",
    },
    {
      id: "LD-003",
      name: "Amit Patel",
      company: "Manufacturing Inc",
      source: "Indiamart",
      status: "Unread",
      value: 234000,
      date: "2025-11-09",
    },
    {
      id: "LD-004",
      name: "Sneha Gupta",
      company: "Retail Chain Ltd",
      source: "CRM Form",
      status: "New",
      value: 156000,
      date: "2025-11-08",
    },
  ];

  const pipelineStages = [
    { name: "Prospecting", count: 45, value: 567890 },
    { name: "Qualification", count: 34, value: 456780 },
    { name: "Proposal", count: 23, value: 789012 },
    { name: "Negotiation", count: 12, value: 345678 },
    { name: "Closed Won", count: 89, value: 2345678 },
  ];

  const topPerformers = [
    { name: "Vikram Singh", leads: 45, deals: 23, revenue: 1234567 },
    { name: "Anita Desai", leads: 38, deals: 19, revenue: 987654 },
    { name: "Rahul Mehta", leads: 34, deals: 17, revenue: 876543 },
    { name: "Kavita Joshi", leads: 29, deals: 15, revenue: 765432 },
  ];

  const upcomingBirthdays = [
    {
      name: "Priya Sharma",
      date: "15 Dec",
      department: "Sales",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Amit Kumar",
      date: "18 Dec",
      department: "Marketing",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Sneha Patel",
      date: "22 Dec",
      department: "Development",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Rahul Verma",
      date: "28 Dec",
      department: "HR",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const SkeletonLoader = () => (
    <div className="animate-pulse flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-200 rounded p-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-5 w-[150px] bg-gray-300 rounded"></div>
            <div className="h-4 w-[250px] bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0">
        <div className="max-w-[100%] mx-auto p-0 ml-6 md:p-0">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-[#3B7080] to-[#2f5a67] rounded-sm shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://i.pravatar.cc/60"
                      alt="Profile"
                      className="w-14 h-14 rounded-full border-4 border-white"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Welcome Back, NK Yadav
                        <Edit
                          size={18}
                          className="text-white/80 cursor-pointer hover:text-white"
                        />
                      </h2>
                      <p className="text-white/90 text-sm mt-1">
                        You have{" "}
                        <span className="font-bold text-[#F26422]">
                          {stats.leads.new} new leads
                        </span>{" "}
                        and{" "}
                        <span className="font-bold text-[#F26422]">
                          {stats.leads.unread} unread
                        </span>{" "}
                        leads to follow up
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 relative">
                    {/* Add Lead Button */}
                    <button
                      onClick={() => setOpenLeadMenu(!openLeadMenu)}
                      className="bg-[#F26422] text-white px-6 py-2.5 rounded-sm flex items-center justify-center gap-2 font-semibold hover:bg-[#d95a1f] transition-all shadow-sm hover:shadow-lg"
                    >
                      <UserPlus size={20} /> Add Lead
                    </button>

                    {/* Dropdown Menu */}
                    {openLeadMenu && (
                      <div className="absolute top-full left-0 mt-2 w-40 bg-white border shadow-md rounded-sm z-50">
                        <button
                          onClick={() => {
                            setOpenLeadMenu(false);
                            handleAddLead();
                          }}
                          className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <UserPlus size={16} />
                          Single Lead
                        </button>

                        <button
                          onClick={() => {
                            setOpenLeadMenu(false);
                            handleBulkUpload();
                          }}
                          className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <Upload size={16} />
                          Bulk Upload
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <NumberCard
                  title="Total Leads"
                  number={stats.leads.total.toLocaleString()}
                  up={`${stats.leads.growth}%`}
                  icon={<Users className="text-blue-600" size={24} />}
                  iconBgColor="bg-blue-100"
                  lineBorderClass="border-blue-500"
                >
                  <span className="text-blue-600 font-medium">
                    New: {stats.leads.new}
                  </span>
                  <span className="text-orange-600 font-medium">
                    Unread: {stats.leads.unread}
                  </span>
                  <span className="text-purple-600 font-medium">
                    Trending: {stats.leads.trending}
                  </span>
                </NumberCard>

                <NumberCard
                  title="Pipeline Value"
                  number={`₹${(stats.pipeline.totalValue / 100000).toFixed(1)}L`}
                  up={`${stats.pipeline.growth}%`}
                  icon={<Target className="text-green-600" size={24} />}
                  iconBgColor="bg-green-100"
                  lineBorderClass="border-green-500"
                >
                  <span className="text-blue-600 font-medium">
                    Active: {stats.pipeline.activeDeals}
                  </span>
                  <span className="text-green-600 font-medium">
                    Won: {stats.pipeline.wonDeals}
                  </span>
                </NumberCard>

                <NumberCard
                  title="Total Clients"
                  number={stats.clients.total}
                  up={`${stats.clients.growth}%`}
                  icon={<Briefcase className="text-orange-600" size={24} />}
                  iconBgColor="bg-orange-100"
                  lineBorderClass="border-orange-500"
                >
                  <span className="text-green-600 font-medium">
                    Active: {stats.clients.active}
                  </span>
                  <span className="text-gray-500 font-medium">
                    New: {stats.clients.newThisMonth}
                  </span>
                </NumberCard>

                <NumberCard
                  title="Conversion Rate"
                  number={`${stats.leads.conversionRate}%`}
                  up={`${stats.clients.growth}%`}
                  icon={<TrendingUp className="text-purple-600" size={24} />}
                  iconBgColor="bg-purple-100"
                  lineBorderClass="border-purple-500"
                >
                  <span className="text-green-600 font-medium">
                    Avg Deal: ₹
                    {(stats.pipeline.avgDealSize / 1000).toFixed(0)}K
                  </span>
                </NumberCard>
              </div>

              {/* Secondary Stats - Channel Integration & Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {/* Attendance Punch In/Out Card */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg shadow-md p-5 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <h3 className="text-gray-600 text-sm font-semibold mb-1">
                      Attendance
                    </h3>
                    <p className="text-lg font-bold text-gray-800">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentTime.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Total Hours Circle */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center justify-center shadow-inner border-4 border-white">
                        <p className="text-xs text-gray-500 mb-1">
                          Total Hours
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {String(workingHours.hours).padStart(2, "0")}:
                          {String(workingHours.minutes).padStart(2, "0")}:
                          {String(workingHours.seconds).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Production Time Badge */}
                  {isPunchedIn && (
                    <div className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full text-center mb-3 shadow-sm">
                      Production: {workingHours.hours}.
                      {String(
                        Math.floor((workingHours.minutes * 100) / 60)
                      ).padStart(2, "0")}{" "}
                      hrs
                    </div>
                  )}

                  {/* Punch In Time */}
                  {isPunchedIn && punchInTime && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock size={16} className="text-[#F26422]" />
                      <span className="font-medium">
                        Punch In at{" "}
                        {punchInTime.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Punch Button */}
                  {!isPunchedIn ? (
                    <button
                      onClick={handlePunchIn}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Clock size={18} />
                      Punch In
                    </button>
                  ) : (
                    <button
                      onClick={handlePunchOut}
                      className="w-full bg-gradient-to-r from-[#F26422] to-[#d95a1f] text-white py-3 rounded-lg font-bold text-sm hover:from-[#d95a1f] hover:to-[#c04e1a] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Clock size={18} />
                      Punch Out
                    </button>
                  )}
                </div>

                {/* Channel Integration */}
                <div className="bg-white rounded-lg shadow-md p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Activity className="text-indigo-600" size={20} />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg">
                      Channel Performance
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(stats.channels).map(([channel, count]) => (
                      <div
                        key={channel}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {channel === "meta"
                            ? "Meta"
                            : channel === "justdial"
                              ? "Justdial"
                              : channel === "indiamart"
                                ? "Indiamart"
                                : channel === "googleDocs"
                                  ? "Google Docs"
                                  : "CRM Form"}
                        </span>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employee Stats */}
                <div className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <UserCheck className="text-emerald-600" size={20} />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg">
                      Team Overview
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        Total Employees
                      </span>
                      <span className="font-bold text-gray-800">
                        {stats.employees.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-600">
                        Present Today
                      </span>
                      <span className="font-bold text-green-600">
                        {stats.employees.present}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm text-gray-600">On Leave</span>
                      <span className="font-bold text-orange-600">
                        {stats.employees.onLeave}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm text-gray-600">Active</span>
                      <span className="font-bold text-blue-600">
                        {stats.employees.active}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activities Summary */}
                <div className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <FileText className="text-pink-600" size={20} />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg">
                      Recent Activities
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Quotations</span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                        {stats.activities.quotations}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Invoices</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                        {stats.activities.invoices}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        Pending To-Do
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-sm">
                        {stats.activities.todos}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        Total Expenses
                      </span>
                      <span className="font-bold text-gray-800">
                        ₹{(stats.activities.expenses / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="bg-white rounded-sm shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Pipeline Stages
                  </h3>
                  <button className="text-[#F26422] text-sm font-semibold hover:underline">
                    Manage Pipeline
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {pipelineStages.map((stage, index) => (
                    <div
                      key={stage.name}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm p-4 border-2 border-gray-200 hover:border-[#F26422] transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-700 text-sm">
                          {stage.name}
                        </h4>
                        <span className="bg-[#F26422] text-white text-xs font-bold px-2 py-1 rounded-full">
                          {stage.count}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{(stage.value / 100000).toFixed(1)}L
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#F26422] h-2 rounded-full"
                          style={{
                            width: `${(stage.count / stats.leads.total) * 100
                              }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Leads & Top Performers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Recent Leads */}
                <div className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Recent Leads
                    </h3>
                    <button className="text-[#F26422] text-sm font-semibold hover:underline flex items-center gap-1">
                      View All <Filter size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Lead ID
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Source
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Value
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3 text-sm font-medium text-[#F26422]">
                              {lead.id}
                            </td>
                            <td className="px-3 py-3">
                              <div className="text-sm font-semibold text-gray-800">
                                {lead.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {lead.company}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                {lead.source}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm font-bold text-gray-800">
                              ₹{(lead.value / 1000).toFixed(0)}K
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-bold rounded-full ${lead.status === "New"
                                  ? "bg-green-100 text-green-700"
                                  : lead.status === "Trending"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-orange-100 text-orange-700"
                                  }`}
                              >
                                {lead.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Top Performers
                    </h3>
                    <button className="text-[#F26422] text-sm font-semibold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {topPerformers.map((performer, index) => (
                      <div
                        key={performer.name}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-sm border border-gray-200 hover:border-[#F26422] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-[#F26422] to-[#d95a1f] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {performer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {performer.leads} leads • {performer.deals} deals
                              closed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ₹{(performer.revenue / 100000).toFixed(1)}L
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <TrendingUp size={14} className="text-green-600" />
                            <span className="text-xs font-semibold text-green-600">
                              +12%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employee Birthday Card */}
                <div className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Calendar className="text-pink-600" size={20} />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg">
                      Upcoming Birthdays
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {upcomingBirthdays.map((employee, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-white rounded-sm border border-pink-100 hover:border-pink-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full border-2 border-pink-200"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {employee.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {employee.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold text-xs">
                            🎂 {employee.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Component - Fixed */}
      {isPopupOpen && (
        <AddLeadModal isOpen={isPopupOpen} onClose={handleCloseModal} />
      )}

      {showBulkUploadPopup && (
        <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />
      )}
    </DashboardLayout>
  );
};

export default CRMDashboard;
