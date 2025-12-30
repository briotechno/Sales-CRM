// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Add this import
// import DashboardLayout from "../../components/DashboardLayout";
// import {
//   LayoutList,
//   Grid3X3,
//   Download,
//   Plus,
//   Edit,
//   Trash2,
//   X,
//   Phone,
//   MessageSquare,
//   Lock,
//   DollarSign,
//   Mail,
//   MapPin,
// } from "lucide-react";

// // Add Lead Popup Component (Unchanged)
// const AddLeadPopup = ({ isOpen, onClose, onAdd }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     type: "Person",
//     status: "Active",
//     visibility: "Public",
//     tag: "Contacted",
//     value: 25000,
//     location: "United States",
//   });

//   const handleSubmit = () => {
//     if (formData.name && formData.email && formData.phone) {
//       onAdd(formData);
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         type: "Person",
//         status: "Active",
//         visibility: "Public",
//         tag: "Contacted",
//         value: 25000,
//         location: "United States",
//       });
//       onClose();
//     } else {
//       alert("Please fill all required fields");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-sm shadow-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-800">Add New Lead</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Lead Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
//                 placeholder="Enter lead name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
//                 placeholder="email@example.com"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Phone <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
//                 placeholder="(123) 456 7890"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Type <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={formData.type}
//                 onChange={(e) =>
//                   setFormData({ ...formData, type: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
//               >
//                 <option value="Person">Person</option>
//                 <option value="Organization">Organization</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Status <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({ ...formData, status: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Tag <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={formData.tag}
//                 onChange={(e) =>
//                   setFormData({ ...formData, tag: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
//               >
//                 <option value="Contacted">Contacted</option>
//                 <option value="Not Contacted">Not Contacted</option>
//                 <option value="Closed">Closed</option>
//                 <option value="Lost">Lost</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
//             <button
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-sm hover:bg-gray-100 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded-sm hover:opacity-90 transition"
//             >
//               Add Lead
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function LeadsList() {
//   const navigate = useNavigate(); // Add navigation hook
//   const [view, setView] = useState("list");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [filterTag, setFilterTag] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const itemsPerPage = 7;

//   const [leadsData, setLeadsData] = useState([
//     {
//       id: "L001",
//       name: "Linda White",
//       email: "linda@gmail.com",
//       phone: "(193) 7839 748",
//       type: "Person",
//       createdAt: "2025-11-10 10:35 AM",
//       status: "Active",
//       visibility: "Public",
//       tag: "Contacted",
//       value: 3500000,
//       location: "Austin, United States",
//     },
//     {
//       id: "L002",
//       name: "Emily Johnson",
//       email: "emily@gmail.com",
//       phone: "(179) 7382 829",
//       type: "Person",
//       createdAt: "2025-11-11 12:15 PM",
//       status: "Active",
//       visibility: "Private",
//       tag: "Not Contacted",
//       value: 3500000,
//       location: "Newyork, United States",
//     },
//     {
//       id: "L003",
//       name: "John Smith",
//       email: "john@gmail.com",
//       phone: "(123) 4567 890",
//       type: "Person",
//       createdAt: "2025-11-12 09:42 AM",
//       status: "Active",
//       visibility: "Public",
//       tag: "Closed",
//       value: 3200000,
//       location: "Chester, United Kingdom",
//     },
//     {
//       id: "L004",
//       name: "Michael Brown",
//       email: "micael@gmail.com",
//       phone: "(184) 2719 738",
//       type: "Person",
//       createdAt: "2025-11-12 11:20 AM",
//       status: "Active",
//       visibility: "Public",
//       tag: "Lost",
//       value: 4100000,
//       location: "London, United Kingdom",
//     },
//     {
//       id: "L005",
//       name: "Chris Johnson",
//       email: "chris@gmail.com",
//       phone: "(162) 8920 713",
//       type: "Person",
//       createdAt: "2025-11-13 02:15 PM",
//       status: "Active",
//       visibility: "Private",
//       tag: "Contacted",
//       value: 3500000,
//       location: "Atlanta, United States",
//     },
//     {
//       id: "L006",
//       name: "Maria Garcia",
//       email: "maria@gmail.com",
//       phone: "(120) 3728 039",
//       type: "Person",
//       createdAt: "2025-11-13 03:45 PM",
//       status: "Active",
//       visibility: "Public",
//       tag: "Not Contacted",
//       value: 4100000,
//       location: "Denver, United States",
//     },
//     {
//       id: "L007",
//       name: "David Lee",
//       email: "david@gmail.com",
//       phone: "(183) 9302 890",
//       type: "Person",
//       createdAt: "2025-11-14 09:30 AM",
//       status: "Active",
//       visibility: "Public",
//       tag: "Closed",
//       value: 3100000,
//       location: "Charlotte, United States",
//     },
//     {
//       id: "L008",
//       name: "Karen Davis",
//       email: "darleeo@gmail.com",
//       phone: "(163) 2459 315",
//       type: "Person",
//       createdAt: "2025-11-14 11:00 AM",
//       status: "Inactive",
//       visibility: "Private",
//       tag: "Lost",
//       value: 4000000,
//       location: "Detroit, United States",
//     },
//   ]);

//   // Add navigation function with lead data
//   const handleLeadClick = (lead) => {
//     navigate(`/crm/leads/profile/:id${lead.id}`, { state: { lead } });
//   };

//   const handleAddLead = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleAddNewLead = (newLead) => {
//     const newId = `L${String(leadsData.length + 1).padStart(3, "0")}`;
//     const now = new Date();
//     const formattedDate = `${now.getFullYear()}-${String(
//       now.getMonth() + 1
//     ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
//       now.getHours() % 12 || 12
//     ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${
//       now.getHours() >= 12 ? "PM" : "AM"
//     }`;

//     setLeadsData([
//       ...leadsData,
//       {
//         id: newId,
//         ...newLead,
//         createdAt: formattedDate,
//       },
//     ]);
//   };

//   const handleDeleteLead = (id) => {
//     if (window.confirm("Are you sure you want to delete this lead?")) {
//       setLeadsData(leadsData.filter((lead) => lead.id !== id));
//     }
//   };

//   const handleEditLead = (lead) => {
//     console.log("Navigate to Edit Lead page", lead);
//   };

//   const handleExport = () => {
//     const headers = [
//       "ID",
//       "Name",
//       "Email",
//       "Phone",
//       "Type",
//       "Created",
//       "Status",
//       "Tag",
//       "Value",
//     ];
//     const csvContent = [
//       headers.join(","),
//       ...filteredLeads.map((lead) =>
//         [
//           lead.id,
//           `"${lead.name}"`,
//           lead.email,
//           lead.phone,
//           lead.type,
//           `"${lead.createdAt}"`,
//           lead.status,
//           lead.tag,
//           lead.value,
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const filteredLeads = leadsData.filter((lead) => {
//     const matchesSearch =
//       lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       lead.phone.includes(searchQuery);
//     const matchesStatus =
//       filterStatus === "All" || lead.status === filterStatus;
//     const matchesTag = filterTag === "All" || lead.tag === filterTag;
//     return matchesSearch && matchesStatus && matchesTag;
//   });

//   const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (page) => setCurrentPage(page);
//   const handlePrev = () =>
//     setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
//   const handleNext = () =>
//     setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

//   const getTagColor = (tag) => {
//     switch (tag) {
//       case "Contacted":
//         return {
//           bg: "bg-yellow-500",
//           border: "border-yellow-500",
//           dot: "bg-yellow-500",
//           line: "bg-yellow-500",
//         };
//       case "Not Contacted":
//         return {
//           bg: "bg-purple-500",
//           border: "border-purple-500",
//           dot: "bg-purple-500",
//           line: "bg-purple-500",
//         };
//       case "Closed":
//         return {
//           bg: "bg-teal-500",
//           border: "border-teal-500",
//           dot: "bg-teal-500",
//           line: "bg-teal-500",
//         };
//       case "Lost":
//         return {
//           bg: "bg-red-500",
//           border: "border-red-500",
//           dot: "bg-red-500",
//           line: "bg-red-500",
//         };
//       default:
//         return {
//           bg: "bg-gray-500",
//           border: "border-gray-500",
//           dot: "bg-gray-500",
//           line: "bg-gray-500",
//         };
//     }
//   };

//   const formatCurrency = (value) => {
//     const [intPart, decPart] = value.toFixed(0).split(".");
//     const lastThree = intPart.substring(intPart.length - 3);
//     const otherNumbers = intPart.substring(0, intPart.length - 3);
//     const formatted =
//       otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
//       (otherNumbers ? "," : "") +
//       lastThree;

//     let finalValue = "$" + formatted;
//     if (finalValue.length < 8) {
//       finalValue = "$0" + formatted;
//     }
//     return finalValue;
//   };

//   const getAvatarBg = (tag) => {
//     switch (tag) {
//       case "Contacted":
//         return "bg-amber-500";
//       case "Not Contacted":
//         return "bg-purple-500";
//       case "Closed":
//         return "bg-emerald-500";
//       case "Lost":
//         return "bg-red-500";
//       default:
//         return "bg-blue-500";
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-6 bg-gray-0 min-h-screen">
//         <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Leads Management
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               <span className="text-gray-400"></span> CRM /{" "}
//               <span className="text-[#FF7B1D] font-medium">Leads List</span>
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             {["All", "Active", "Inactive"].map((status) => (
//               <button
//                 key={status}
//                 onClick={() => {
//                   setFilterStatus(status);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${
//                   filterStatus === status
//                     ? "bg-[#FF7B1D] text-white border-[#FF7B1D]"
//                     : "bg-white text-black border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {status}
//               </button>
//             ))}

//             {["Contacted", "Not Contacted", "Closed", "Lost"].map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => {
//                   setFilterTag(tag);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${
//                   filterTag === tag
//                     ? "bg-[#FF7B1D] text-white border-[#FF7B1D]"
//                     : "bg-white text-black border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {tag}
//               </button>
//             ))}

//             <div className="flex border border-gray-300 rounded-sm overflow-hidden ml-2">
//               <button
//                 onClick={() => setView("list")}
//                 className={`p-2 transition ${
//                   view === "list"
//                     ? "bg-[#FF7B1D] text-white"
//                     : "bg-white text-black hover:bg-gray-100"
//                 }`}
//               >
//                 <LayoutList size={18} />
//               </button>
//               <button
//                 onClick={() => setView("grid")}
//                 className={`p-2 transition border-l border-gray-300 ${
//                   view === "grid"
//                     ? "bg-[#FF7B1D] text-white"
//                     : "bg-white text-black hover:bg-gray-100"
//                 }`}
//               >
//                 <Grid3X3 size={18} />
//               </button>
//             </div>

//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
//             >
//               <Download size={18} />
//               Export
//             </button>

//             <button className="flex items-center gap-2 bg-[#FF7B1D] text-white px-4 py-2 rounded-sm font-semibold hover:opacity-90 transition">
//               <Plus size={18} />
//               Add Lead
//             </button>
//           </div>
//         </div>

//         {view === "list" ? (
//           <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
//             <table className="w-full border-collapse text-center">
//               <thead>
//                 <tr className="bg-[#FF7B1D] text-white text-sm">
//                   <th className="py-3 px-4 font-semibold">S.N</th>
//                   <th className="py-3 px-4 font-semibold">Lead ID</th>
//                   <th className="py-3 px-4 font-semibold">Lead Name</th>
//                   <th className="py-3 px-4 font-semibold">Email</th>
//                   <th className="py-3 px-4 font-semibold">Phone</th>
//                   <th className="py-3 px-4 font-semibold">Type</th>
//                   <th className="py-3 px-4 font-semibold">Created</th>
//                   <th className="py-3 px-4 font-semibold">Status</th>
//                   <th className="py-3 px-4 font-semibold">Tag</th>
//                   <th className="py-3 px-4 font-semibold">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentLeads.length > 0 ? (
//                   currentLeads.map((lead, index) => (
//                     <tr
//                       key={lead.id}
//                       className="border-t hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="py-3 px-4">
//                         {(currentPage - 1) * itemsPerPage + index + 1}
//                       </td>
//                       <td className="py-3 px-4 font-medium">{lead.id}</td>
//                       <td
//                         className="py-3 px-4 text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
//                         onClick={() => handleLeadClick(lead)}
//                       >
//                         {lead.name}
//                       </td>
//                       <td className="py-3 px-4">{lead.email}</td>
//                       <td className="py-3 px-4">{lead.phone}</td>
//                       <td className="py-3 px-4">
//                         <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
//                           {lead.type}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 text-xs">{lead.createdAt}</td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                             lead.status === "Active"
//                               ? "bg-green-100 text-green-600"
//                               : "bg-red-100 text-red-600"
//                           }`}
//                         >
//                           {lead.status}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                             lead.tag === "Contacted"
//                               ? "bg-yellow-100 text-yellow-600"
//                               : lead.tag === "Not Contacted"
//                               ? "bg-purple-100 text-purple-600"
//                               : lead.tag === "Closed"
//                               ? "bg-teal-100 text-teal-600"
//                               : "bg-red-100 text-red-600"
//                           }`}
//                         >
//                           {lead.tag}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex justify-center gap-3">
//                           <button
//                             onClick={() => handleEditLead(lead)}
//                             className="text-[#FF7B1D] hover:opacity-80"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteLead(lead.id)}
//                             className="text-red-500 hover:opacity-80"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="10"
//                       className="py-6 text-gray-500 font-medium text-sm"
//                     >
//                       No leads found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {["Contacted", "Not Contacted", "Closed", "Lost"].map((tag) => {
//               const tagLeads = leadsData.filter(
//                 (lead) =>
//                   lead.tag === tag &&
//                   (filterStatus === "All" || lead.status === filterStatus)
//               );
//               const totalValue = tagLeads.reduce(
//                 (sum, lead) => sum + lead.value,
//                 0
//               );
//               const tagColor = getTagColor(tag);

//               return (
//                 <div key={tag} className="flex flex-col">
//                   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`w-2 h-2 rounded-full ${tagColor.dot}`}
//                         ></div>
//                         <h3 className="text-lg font-bold text-gray-800">
//                           {tag}
//                         </h3>
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <Plus size={16} />
//                         </button>
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <Edit size={16} />
//                         </button>
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-600 font-medium">
//                       {String(tagLeads.length).padStart(2, "0")} Leads -{" "}
//                       {formatCurrency(totalValue)}
//                     </p>
//                   </div>
//                   <div className="space-y-4 flex-1">
//                     {tagLeads.length > 0 ? (
//                       tagLeads.map((lead) => {
//                         const initials = lead.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")
//                           .toUpperCase()
//                           .slice(0, 2);

//                         return (
//                           <div
//                             key={lead.id}
//                             className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
//                           >
//                             <div
//                               className={`h-1 ${tagColor.line} rounded-t-lg`}
//                             ></div>

//                             <div className="p-4 space-y-3">
//                               <div className="flex items-center gap-3">
//                                 <div
//                                   className={`w-10 h-10 ${getAvatarBg(
//                                     lead.tag
//                                   )} rounded-sm flex items-center justify-center text-white font-semibold text-sm`}
//                                 >
//                                   {initials}
//                                 </div>
//                                 <h4
//                                   className="font-semibold text-gray-800 text-lg hover:text-blue-600 cursor-pointer"
//                                   onClick={() => handleLeadClick(lead)}
//                                 >
//                                   {lead.name}
//                                 </h4>
//                               </div>

//                               <div className="space-y-1 text-sm text-gray-700">
//                                 <div className="flex items-center gap-3">
//                                   <DollarSign
//                                     size={16}
//                                     className="text-gray-500"
//                                   />
//                                   <span className="font-semibold">
//                                     {formatCurrency(lead.value)}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <Mail size={16} className="text-gray-500" />
//                                   <span className="truncate">{lead.email}</span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <Phone size={16} className="text-gray-500" />
//                                   <span>{lead.phone}</span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <MapPin size={16} className="text-gray-500" />
//                                   <span className="truncate">
//                                     {lead.location}
//                                   </span>
//                                 </div>
//                               </div>

//                               <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                                 <div className="flex gap-2">
//                                   <div
//                                     className={`w-6 h-6 rounded-full ${
//                                       lead.tag === "Contacted"
//                                         ? "bg-blue-600"
//                                         : lead.tag === "Not Contacted"
//                                         ? "bg-purple-600"
//                                         : "bg-teal-600"
//                                     } flex items-center justify-center`}
//                                   >
//                                     <span className="text-white text-xs font-bold"></span>
//                                   </div>
//                                 </div>
//                                 <div className="flex gap-3 text-gray-500">
//                                   <button
//                                     onClick={() => console.log("Call", lead.id)}
//                                     className="hover:text-blue-500"
//                                   >
//                                     <Phone size={18} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       console.log("Message", lead.id)
//                                     }
//                                     className="hover:text-blue-500"
//                                   >
//                                     <MessageSquare size={18} />
//                                   </button>
//                                   <button
//                                     onClick={() => console.log("Edit", lead.id)}
//                                     className="hover:text-blue-500"
//                                   >
//                                     <Edit size={18} />
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-lg border border-gray-200">
//                         No leads in this category
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <div className="flex justify-end items-center gap-3 mt-6">
//           <button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 rounded-sm text-white font-semibold transition ${
//               currentPage === 1
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-[#FF7B1D] hover:opacity-90"
//             }`}
//           >
//             Back
//           </button>

//           <div className="flex items-center gap-2">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${
//                   currentPage === i + 1
//                     ? "bg-gray-200 border-gray-400"
//                     : "bg-white border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 rounded-sm text-white font-semibold transition ${
//               currentPage === totalPages
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-[#22C55E] hover:opacity-90"
//             }`}
//           >
//             Next
//           </button>
//         </div>

//         {isModalOpen && (
//           <AddLeadPopup
//             isOpen={isModalOpen}
//             onClose={handleCloseModal}
//             onAdd={handleAddNewLead}
//           />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  LayoutList,
  Grid3X3,
  Download,
  Plus,
  Upload,
  Edit,
  Trash2,
  X,
  Phone,
  Eye,
  MessageSquare,
  DollarSign,
  Mail,
  MapPin,
  Filter,
  UserPlus,
  Users,
  Type,
  Server,
} from "lucide-react";
import AddLeadPopup from "../../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../../components/AddNewLeads/BulkUpload";
import FilterPopup from "../../pages/LeadsManagement/FilterPopup";
import NumberCard from "../../components/NumberCard";

export default function LeadsList() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterServices, setFilterServices] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterSubtype, setFilterSubtype] = useState("All");
  const [assignView, setAssignView] = useState("teams");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [teamFilter, setTeamFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState({
    department: "All",
    designation: "All",
    performance: "All",
  });
  const itemsPerPage = 7;
  const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);
  const [openLeadMenu, setOpenLeadMenu] = useState(false);

  const handleBulkUpload = () => {
    setShowBulkUploadPopup(true);
  };

  const [leadsData, setLeadsData] = useState([
    {
      id: "L001",
      name: "Linda White",
      email: "linda@gmail.com",
      phone: "(193) 7839 748",
      type: "Person",
      createdAt: "2025-11-10 10:35 AM",
      status: "Active",
      visibility: "Public",
      tag: "Contacted",
      value: 3500000,
      location: "Austin, United States",
      priority: "High",
      services: "Consulting",
      pipeline: "Sales",
      calls: 5,
      date: "2025-11-10",
    },
    {
      id: "L002",
      name: "Emily Johnson",
      email: "emily@gmail.com",
      phone: "(179) 7382 829",
      type: "Person",
      createdAt: "2025-11-11 12:15 PM",
      status: "Active",
      visibility: "Private",
      tag: "Not Contacted",
      value: 3500000,
      location: "Newyork, United States",
      priority: "Medium",
      services: "Development",
      pipeline: "Marketing",
      calls: 2,
      date: "2025-11-11",
    },
    {
      id: "L003",
      name: "John Smith",
      email: "john@gmail.com",
      phone: "(123) 4567 890",
      type: "Person",
      createdAt: "2025-11-12 09:42 AM",
      status: "Active",
      visibility: "Public",
      tag: "Closed",
      value: 3200000,
      location: "Chester, United Kingdom",
      priority: "Low",
      services: "Support",
      pipeline: "Sales",
      calls: 8,
      date: "2025-11-12",
    },
    {
      id: "L004",
      name: "Michael Brown",
      email: "micael@gmail.com",
      phone: "(184) 2719 738",
      type: "Organization",
      createdAt: "2025-11-12 11:20 AM",
      status: "Active",
      visibility: "Public",
      tag: "Lost",
      value: 4100000,
      location: "London, United Kingdom",
      priority: "High",
      services: "Consulting",
      pipeline: "Support",
      calls: 3,
      date: "2025-11-12",
    },
    {
      id: "L005",
      name: "Chris Johnson",
      email: "chris@gmail.com",
      phone: "(162) 8920 713",
      type: "Person",
      createdAt: "2025-11-13 02:15 PM",
      status: "Active",
      visibility: "Private",
      tag: "Contacted",
      value: 3500000,
      location: "Atlanta, United States",
      priority: "Medium",
      services: "Development",
      pipeline: "Sales",
      calls: 6,
      date: "2025-11-13",
    },
    {
      id: "L006",
      name: "Maria Garcia",
      email: "maria@gmail.com",
      phone: "(120) 3728 039",
      type: "Person",
      createdAt: "2025-11-13 03:45 PM",
      status: "Active",
      visibility: "Public",
      tag: "Not Contacted",
      value: 4100000,
      location: "Denver, United States",
      priority: "High",
      services: "Consulting",
      pipeline: "Marketing",
      calls: 1,
      date: "2025-11-13",
    },
    {
      id: "L007",
      name: "David Lee",
      email: "david@gmail.com",
      phone: "(183) 9302 890",
      type: "Person",
      createdAt: "2025-11-14 09:30 AM",
      status: "Active",
      visibility: "Public",
      tag: "Closed",
      value: 3100000,
      location: "Charlotte, United States",
      priority: "Low",
      services: "Support",
      pipeline: "Sales",
      calls: 4,
      date: "2025-11-14",
    },
    {
      id: "L008",
      name: "Karen Davis",
      email: "darleeo@gmail.com",
      phone: "(163) 2459 315",
      type: "Organization",
      createdAt: "2025-11-14 11:00 AM",
      status: "Inactive",
      visibility: "Private",
      tag: "Lost",
      value: 4000000,
      location: "Detroit, United States",
      priority: "Medium",
      services: "Development",
      pipeline: "Support",
      calls: 7,
      date: "2025-11-14",
    },
  ]);

  const teamsData = [
    {
      id: "T001",
      name: "Sales Team Alpha",
      department: "Sales",
      members: 8,
      activeLeads: 45,
      closedDeals: 23,
      performance: "Excellent",
    },
    {
      id: "T002",
      name: "Marketing Champions",
      department: "Marketing",
      members: 6,
      activeLeads: 32,
      closedDeals: 18,
      performance: "Good",
    },
    {
      id: "T003",
      name: "Support Squad",
      department: "Support",
      members: 10,
      activeLeads: 28,
      closedDeals: 15,
      performance: "Good",
    },
    {
      id: "T004",
      name: "Sales Team Beta",
      department: "Sales",
      members: 5,
      activeLeads: 20,
      closedDeals: 12,
      performance: "Average",
    },
    {
      id: "T005",
      name: "Development Team",
      department: "Development",
      members: 7,
      activeLeads: 15,
      closedDeals: 8,
      performance: "Average",
    },
  ];

  const employeesData = [
    {
      id: "E001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Sales",
      designation: "Senior Sales Executive",
      activeLeads: 12,
      closedDeals: 8,
      performance: "Best Performer",
      team: "Sales Team Alpha",
    },
    {
      id: "E002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      designation: "Marketing Manager",
      activeLeads: 10,
      closedDeals: 6,
      performance: "Good Performer",
      team: "Marketing Champions",
    },
    {
      id: "E003",
      name: "Mike Johnson",
      email: "mike.j@company.com",
      department: "Support",
      designation: "Support Lead",
      activeLeads: 8,
      closedDeals: 5,
      performance: "Good Performer",
      team: "Support Squad",
    },
    {
      id: "E004",
      name: "Sarah Williams",
      email: "sarah.w@company.com",
      department: "Sales",
      designation: "Sales Executive",
      activeLeads: 15,
      closedDeals: 10,
      performance: "Best Performer",
      team: "Sales Team Alpha",
    },
    {
      id: "E005",
      name: "Robert Brown",
      email: "robert.b@company.com",
      department: "Sales",
      designation: "Junior Sales Executive",
      activeLeads: 6,
      closedDeals: 3,
      performance: "Average Performer",
      team: "Sales Team Beta",
    },
    {
      id: "E006",
      name: "Emily Davis",
      email: "emily.d@company.com",
      department: "Marketing",
      designation: "Content Strategist",
      activeLeads: 7,
      closedDeals: 4,
      performance: "Good Performer",
      team: "Marketing Champions",
    },
    {
      id: "E007",
      name: "David Wilson",
      email: "david.w@company.com",
      department: "Development",
      designation: "Tech Lead",
      activeLeads: 5,
      closedDeals: 2,
      performance: "Average Performer",
      team: "Development Team",
    },
    {
      id: "E008",
      name: "Lisa Anderson",
      email: "lisa.a@company.com",
      department: "Support",
      designation: "Customer Success Manager",
      activeLeads: 9,
      closedDeals: 7,
      performance: "Best Performer",
      team: "Support Squad",
    },
  ];

  const handleLeadClick = (lead) => {
    navigate(`/crm/leads/profile/:id${lead.id}`, { state: { lead } });
  };

  const handleAddLead = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNewLead = (newLead) => {
    const newId = `L${String(leadsData.length + 1).padStart(3, "0")}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours() % 12 || 12
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"
      }`;

    setLeadsData([
      ...leadsData,
      {
        id: newId,
        ...newLead,
        createdAt: formattedDate,
        calls: 0,
      },
    ]);
  };

  const handleDeleteLead = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeadsData(leadsData.filter((lead) => lead.id !== id));
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedLeads.length === 0) {
      alert("Please select leads to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedLeads.length} lead(s)?`
      )
    ) {
      setLeadsData(
        leadsData.filter((lead) => !selectedLeads.includes(lead.id))
      );
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(currentLeads.map((lead) => lead.id));
    }
  };

  const handleAssignLeads = () => {
    if (selectedLeads.length === 0) {
      alert("Please select leads to assign");
      return;
    }
    setSelectedTeams([]);
    setSelectedEmployees([]);
    setAssignView("teams");
    setIsAssignModalOpen(true);
  };

  const handleToggleTeam = (teamId) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleToggleEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredTeams = teamsData.filter((team) => {
    if (teamFilter === "All") return true;
    return team.department === teamFilter;
  });

  const filteredEmployees = employeesData.filter((employee) => {
    const matchesDepartment =
      employeeFilter.department === "All" ||
      employee.department === employeeFilter.department;
    const matchesDesignation =
      employeeFilter.designation === "All" ||
      employee.designation === employeeFilter.designation;
    const matchesPerformance =
      employeeFilter.performance === "All" ||
      employee.performance === employeeFilter.performance;
    return matchesDepartment && matchesDesignation && matchesPerformance;
  });

  const handleEditLead = (lead) => {
    console.log("Navigate to Edit Lead page", lead);
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Type",
      "Created",
      "Status",
      "Tag",
      "Value",
      "Priority",
      "Services",
      "Pipeline",
      "Calls",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.id,
          `"${lead.name}"`,
          lead.email,
          lead.phone,
          lead.type,
          `"${lead.createdAt}"`,
          lead.status,
          lead.tag,
          lead.value,
          lead.priority,
          lead.services,
          lead.pipeline,
          lead.calls,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesStatus =
      filterStatus === "All" || lead.status === filterStatus;
    const matchesTag = filterTag === "All" || lead.tag === filterTag;
    const matchesType = filterType === "All" || lead.type === filterType;
    const matchesPriority =
      filterPriority === "All" || lead.priority === filterPriority;
    const matchesServices =
      filterServices === "All" || lead.services === filterServices;
    return (
      matchesSearch &&
      matchesStatus &&
      matchesTag &&
      matchesType &&
      matchesPriority &&
      matchesServices
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const getTagColor = (tag) => {
    switch (tag) {
      case "Contacted":
        return {
          bg: "bg-yellow-500",
          border: "border-yellow-500",
          dot: "bg-yellow-500",
          line: "bg-yellow-500",
        };
      case "Not Contacted":
        return {
          bg: "bg-purple-500",
          border: "border-purple-500",
          dot: "bg-purple-500",
          line: "bg-purple-500",
        };
      case "Closed":
        return {
          bg: "bg-teal-500",
          border: "border-teal-500",
          dot: "bg-teal-500",
          line: "bg-teal-500",
        };
      case "Lost":
        return {
          bg: "bg-red-500",
          border: "border-red-500",
          dot: "bg-red-500",
          line: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-500",
          border: "border-gray-500",
          dot: "bg-gray-500",
          line: "bg-gray-500",
        };
    }
  };

  const formatCurrency = (value) => {
    const [intPart] = value.toFixed(0).split(".");
    const lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    const formatted =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree;

    let finalValue = "$" + formatted;
    if (finalValue.length < 8) {
      finalValue = "$0" + formatted;
    }
    return finalValue;
  };

  const getAvatarBg = (tag) => {
    switch (tag) {
      case "Contacted":
        return "bg-amber-500";
      case "Not Contacted":
        return "bg-purple-500";
      case "Closed":
        return "bg-emerald-500";
      case "Lost":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-0 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Leads Management
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> CRM /{" "}
              <span className="text-[#FF7B1D] font-medium">New Leads</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${filterStatus === status
                    ? "bg-[#FF7B1D] text-white border-[#FF7B1D]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {status}
              </button>
            ))}

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Filter size={18} />
              More Filters
            </button>

            <div className="flex border border-gray-300 rounded-sm overflow-hidden ml-2">
              <button
                onClick={() => setView("list")}
                className={`p-2 transition ${view === "list"
                    ? "bg-[#FF7B1D] text-white"
                    : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                <LayoutList size={18} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 transition border-l border-gray-300 ${view === "grid"
                    ? "bg-[#FF7B1D] text-white"
                    : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                <Grid3X3 size={18} />
              </button>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Download size={18} />
              Export
            </button>

            <div className="flex flex-col sm:flex-row gap-3 relative">
              <button
                onClick={() => setOpenLeadMenu(!openLeadMenu)}
                className="bg-[#F26422] text-white px-6 py-2.5 rounded-sm flex items-center justify-center gap-2 font-semibold hover:bg-[#d95a1f] transition-all shadow-sm hover:shadow-lg"
              >
                <UserPlus size={20} /> Add Lead
              </button>

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

        {/* Filter Popup Component */}
        <FilterPopup
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filterType={filterType}
          setFilterType={setFilterType}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterServices={filterServices}
          setFilterServices={setFilterServices}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          filterSubtype={filterSubtype}
          setFilterSubtype={setFilterSubtype}
        />

        {/* Statement Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NumberCard
            title="Total Clients"
            number={"248"}
            icon={<Users className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Total Service"
            number={"186"}
            icon={<Server className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Total Type"
            number={"18"}
            icon={<Type className="text-orange-600" size={24} />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
          <NumberCard
            title="Total Calls"
            number={"24"}
            icon={<Phone className="text-purple-600" size={24} />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
        </div>

        {/* Action Bar with Selection */}
        {selectedLeads.length > 0 && (
          <div className="bg-orange-500 text-white p-4 rounded-sm mb-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                {selectedLeads.length} Lead(s) Selected
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAssignLeads}
                className="flex items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
              >
                <UserPlus size={18} />
                Assign Leads
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition"
              >
                <Trash2 size={18} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" ? (
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-[#FF7B1D] text-white text-sm">
                  <th className="py-3 px-4 font-semibold">
                    <input
                      type="checkbox"
                      checked={
                        selectedLeads.length === currentLeads.length &&
                        currentLeads.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">S.N</th>
                  <th className="py-3 px-4 font-semibold">Lead ID</th>
                  <th className="py-3 px-4 font-semibold">Full Name</th>
                  <th className="py-3 px-4 font-semibold">Mobile Number</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Services</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Calls</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentLeads.length > 0 ? (
                  currentLeads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 text-orange-600 hover:text-blue-800 font-medium">{lead.id}</td>
                      <td
                        className="py-3 px-4 text-orange-600 hover:text-blue-800 cursor-pointer font-medium"
                        onClick={() => handleLeadClick(lead)}
                      >
                        {lead.name}
                      </td>
                      <td className="py-3 px-4">{lead.phone}</td>
                      <td className="py-3 px-4">{lead.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-600">
                          {lead.services}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                          {lead.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">{lead.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${lead.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                            }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{lead.calls}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3">
                          <button className="text-[#FF7B1D] hover:text-[#e06614] hover:opacity-90">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="py-6 text-gray-500 font-medium text-sm"
                    >
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {["Contacted", "Not Contacted", "Closed", "Lost"].map((tag) => {
              const tagLeads = leadsData.filter(
                (lead) =>
                  lead.tag === tag &&
                  (filterStatus === "All" || lead.status === filterStatus)
              );
              const totalValue = tagLeads.reduce(
                (sum, lead) => sum + lead.value,
                0
              );
              const tagColor = getTagColor(tag);

              return (
                <div key={tag} className="flex flex-col">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${tagColor.dot}`}
                        ></div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {tag}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {String(tagLeads.length).padStart(2, "0")} Leads -{" "}
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                  <div className="space-y-4 flex-1">
                    {tagLeads.length > 0 ? (
                      tagLeads.map((lead) => {
                        const initials = lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        return (
                          <div
                            key={lead.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                          >
                            <div
                              className={`h-1 ${tagColor.line} rounded-t-lg`}
                            ></div>

                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 ${getAvatarBg(
                                    lead.tag
                                  )} rounded-sm flex items-center justify-center text-white font-semibold text-sm`}
                                >
                                  {initials}
                                </div>
                                <h4
                                  className="font-semibold text-gray-800 text-lg hover:text-blue-600 cursor-pointer"
                                  onClick={() => handleLeadClick(lead)}
                                >
                                  {lead.name}
                                </h4>
                              </div>

                              <div className="space-y-1 text-sm text-gray-700">
                                <div className="flex items-center gap-3">
                                  <Mail size={16} className="text-gray-500" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Phone size={16} className="text-gray-500" />
                                  <span>{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <MapPin size={16} className="text-gray-500" />
                                  <span className="truncate">
                                    {lead.location}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex gap-2">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                      lead.priority
                                    )}`}
                                  >
                                    {lead.priority}
                                  </span>
                                </div>
                                <div className="flex gap-3 text-gray-500">
                                  <button
                                    onClick={() => console.log("Call", lead.id)}
                                    className="hover:text-blue-500"
                                  >
                                    <Phone size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      console.log("Message", lead.id)
                                    }
                                    className="hover:text-blue-500"
                                  >
                                    <MessageSquare size={18} />
                                  </button>
                                  <button
                                    onClick={() => console.log("Edit", lead.id)}
                                    className="hover:text-blue-500"
                                  >
                                    <Edit size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-lg border border-gray-200">
                        No leads in this category
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#FF7B1D] hover:opacity-90"
              }`}
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${currentPage === i + 1
                    ? "bg-gray-200 border-gray-400"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#22C55E] hover:opacity-90"
              }`}
          >
            Next
          </button>
        </div>

        {/* Assign Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Assign Leads
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Assigning <strong>{selectedLeads.length}</strong> lead(s)
                  </p>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex border-b border-gray-200 flex-shrink-0 bg-white">
                <button
                  onClick={() => setAssignView("teams")}
                  className={`flex-1 py-3 px-4 font-semibold transition ${assignView === "teams"
                      ? "bg-[#FF7B1D] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Users className="inline mr-2" size={18} />
                  Teams ({selectedTeams.length} selected)
                </button>

                <button
                  onClick={() => setAssignView("employees")}
                  className={`flex-1 py-3 px-4 font-semibold transition ${assignView === "employees"
                      ? "bg-[#FF7B1D] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <UserPlus className="inline mr-2" size={18} />
                  Employees ({selectedEmployees.length} selected)
                </button>
              </div>

              {/* CONTENT AREA — scrollable */}
              <div className="flex-1 overflow-y-auto">
                {assignView === "teams" ? (
                  <div>
                    {/* Team Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <div className="flex gap-3 items-center">
                        <label className="text-sm font-semibold text-gray-700">
                          Department:
                        </label>
                        <select
                          value={teamFilter}
                          onChange={(e) => setTeamFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                        >
                          <option value="All">All Departments</option>
                          <option value="Sales">Sales</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Support">Support</option>
                          <option value="Development">Development</option>
                        </select>
                      </div>
                    </div>

                    {/* Teams List */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTeams.map((team) => {
                        const isSelected = selectedTeams.includes(team.id);

                        return (
                          <div
                            key={team.id}
                            onClick={() => handleToggleTeam(team.id)}
                            className={`border rounded-lg p-4 cursor-pointer transition ${isSelected
                                ? "border-[#FF7B1D] bg-orange-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleTeam(team.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <h3 className="font-bold text-gray-800 text-lg">
                                    {team.name}
                                  </h3>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600 ml-6">
                                  <p>
                                    <strong>Department:</strong>{" "}
                                    {team.department}
                                  </p>
                                  <p>
                                    <strong>Members:</strong> {team.members}
                                  </p>
                                  <p>
                                    <strong>Active Leads:</strong>{" "}
                                    {team.activeLeads}
                                  </p>
                                  <p>
                                    <strong>Closed Deals:</strong>{" "}
                                    {team.closedDeals}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded ${team.performance === "Excellent"
                                    ? "bg-green-100 text-green-600"
                                    : team.performance === "Good"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-yellow-100 text-yellow-600"
                                  }`}
                              >
                                {team.performance}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Employee Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Department
                          </label>
                          <select
                            value={employeeFilter.department}
                            onChange={(e) =>
                              setEmployeeFilter({
                                ...employeeFilter,
                                department: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                          >
                            <option value="All">All</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Support">Support</option>
                            <option value="Development">Development</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Designation
                          </label>
                          <select
                            value={employeeFilter.designation}
                            onChange={(e) =>
                              setEmployeeFilter({
                                ...employeeFilter,
                                designation: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                          >
                            <option value="All">All Designations</option>
                            <option value="Senior Sales Executive">
                              Senior Sales Executive
                            </option>
                            <option value="Sales Executive">
                              Sales Executive
                            </option>
                            <option value="Junior Sales Executive">
                              Junior Sales Executive
                            </option>
                            <option value="Marketing Manager">
                              Marketing Manager
                            </option>
                            <option value="Support Lead">Support Lead</option>
                            <option value="Tech Lead">Tech Lead</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Performance
                          </label>
                          <select
                            value={employeeFilter.performance}
                            onChange={(e) =>
                              setEmployeeFilter({
                                ...employeeFilter,
                                performance: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                          >
                            <option value="All">All</option>
                            <option value="Best Performer">
                              Best Performer
                            </option>
                            <option value="Good Performer">
                              Good Performer
                            </option>
                            <option value="Average Performer">
                              Average Performer
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Employees List */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredEmployees.map((employee) => {
                        const isSelected = selectedEmployees.includes(
                          employee.id
                        );
                        const initials = employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();

                        return (
                          <div
                            key={employee.id}
                            onClick={() => handleToggleEmployee(employee.id)}
                            className={`border rounded-lg p-4 cursor-pointer transition ${isSelected
                                ? "border-[#FF7B1D] bg-orange-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleToggleEmployee(employee.id)
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 mt-1 cursor-pointer"
                              />

                              <div className="w-10 h-10 bg-[#FF7B1D] text-white rounded-full flex items-center justify-center font-semibold">
                                {initials}
                              </div>

                              <div className="flex-1">
                                <h3 className="font-bold text-gray-800">
                                  {employee.name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                  {employee.email}
                                </p>

                                <div className="mt-2 space-y-1 text-xs text-gray-600">
                                  <p>
                                    <strong>Department:</strong>{" "}
                                    {employee.department}
                                  </p>
                                  <p>
                                    <strong>Designation:</strong>{" "}
                                    {employee.designation}
                                  </p>
                                  <p>
                                    <strong>Team:</strong> {employee.team}
                                  </p>
                                  <p>
                                    <strong>Active Leads:</strong>{" "}
                                    {employee.activeLeads} |{" "}
                                    <strong>Closed:</strong>{" "}
                                    {employee.closedDeals}
                                  </p>
                                </div>

                                <span
                                  className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${employee.performance === "Best Performer"
                                      ? "bg-green-100 text-green-600"
                                      : employee.performance ===
                                        "Good Performer"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-yellow-100 text-yellow-600"
                                    }`}
                                >
                                  {employee.performance}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <strong>
                      {selectedTeams.length + selectedEmployees.length}
                    </strong>{" "}
                    recipient(s) selected
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsAssignModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-sm hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        const totalRecipients =
                          selectedTeams.length + selectedEmployees.length;

                        if (totalRecipients === 0) {
                          alert("Please select at least one team or employee");
                          return;
                        }

                        alert(
                          `${selectedLeads.length} leads assigned to ${totalRecipients} recipient(s) successfully!`
                        );

                        setIsAssignModalOpen(false);
                        setSelectedLeads([]);
                        setSelectedTeams([]);
                        setSelectedEmployees([]);
                      }}
                      className="px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded-sm hover:opacity-90 transition"
                    >
                      Assign Leads
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Lead Modal */}
        {isModalOpen && (
          <AddLeadPopup
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAdd={handleAddNewLead}
          />
        )}
        {showBulkUploadPopup && (
          <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />
        )}
      </div>
    </DashboardLayout>
  );
}
