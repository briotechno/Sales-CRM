// import React, { useState } from "react";
// import { FiHome } from "react-icons/fi";
// import DashboardLayout from "../../components/DashboardLayout";
// import {
//   Plus,
//   Search,
//   Filter,
//   Download,
//   Mail,
//   Printer,
//   Eye,
//   Edit2,
//   Trash2,
//   FileText,
//   X,
// } from "lucide-react";

// export default function QuotationPage() {
//   const [quotations, setQuotations] = useState([
//     {
//       id: "QT-2024-001",
//       client: "Acme Corporation",
//       date: "2024-11-15",
//       amount: 150000,
//       status: "Pending",
//       validUntil: "2024-12-15",
//       description: "Website development and design services",
//     },
//     {
//       id: "QT-2024-002",
//       client: "Tech Solutions Ltd",
//       date: "2024-11-10",
//       amount: 250000,
//       status: "Approved",
//       validUntil: "2024-12-10",
//       description: "Mobile app development",
//     },
//     {
//       id: "QT-2024-003",
//       client: "Global Industries",
//       date: "2024-11-05",
//       amount: 185000,
//       status: "Rejected",
//       validUntil: "2024-12-05",
//       description: "CRM system implementation",
//     },
//     {
//       id: "QT-2024-004",
//       client: "Innovation Inc",
//       date: "2024-11-18",
//       amount: 320000,
//       status: "Draft",
//       validUntil: "2024-12-18",
//       description: "E-commerce platform setup",
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedQuote, setSelectedQuote] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [formData, setFormData] = useState({
//     client: "",
//     date: "",
//     validUntil: "",
//     amount: "",
//     description: "",
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "bg-green-100 text-green-700";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Rejected":
//         return "bg-red-100 text-red-700";
//       case "Draft":
//         return "bg-gray-100 text-gray-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCreateQuotation = () => {
//     if (formData.client && formData.date && formData.amount) {
//       const newQuotation = {
//         id: `QT-2024-${String(quotations.length + 1).padStart(3, "0")}`,
//         client: formData.client,
//         date: formData.date,
//         amount: parseFloat(formData.amount),
//         status: "Draft",
//         validUntil: formData.validUntil,
//         description: formData.description,
//       };
//       setQuotations([newQuotation, ...quotations]);
//       setFormData({
//         client: "",
//         date: "",
//         validUntil: "",
//         amount: "",
//         description: "",
//       });
//       setShowModal(false);
//     }
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this quotation?")) {
//       setQuotations(quotations.filter((q) => q.id !== id));
//     }
//   };

//   const handleView = (quote) => {
//     setSelectedQuote(quote);
//     setShowViewModal(true);
//   };

//   const handleStatusChange = (id, newStatus) => {
//     setQuotations(
//       quotations.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
//     );
//   };

//   const handleExport = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "ID,Client,Date,Amount,Valid Until,Status\n" +
//       filteredQuotations
//         .map(
//           (q) =>
//             `${q.id},${q.client},${q.date},${q.amount},${q.validUntil},${q.status}`
//         )
//         .join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "quotations.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredQuotations = quotations.filter((q) => {
//     const matchesSearch =
//       q.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       q.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === "All" || q.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const stats = {
//     total: quotations.length,
//     approved: quotations.filter((q) => q.status === "Approved").length,
//     pending: quotations.filter((q) => q.status === "Pending").length,
//     totalValue: quotations.reduce((sum, q) => sum + q.amount, 0),
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gray-0 ml-6 p-0">
//         {/* Header */}
//         <div className="bg-white border-b border-orange-100 shadow-sm">
//           <div className="max-w-7xl mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   All Quotations
//                 </h1>
//                 <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
//                   <FiHome className="text-gray-700 text-sm" />
//                   <span className="text-gray-400"></span> Additional /{" "}
//                   <span className="text-[#FF7B1D] font-medium">
//                     All Quotations
//                   </span>
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
//               >
//                 <Plus size={20} />
//                 New Quotation
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="max-w-7xl mx-auto px-0 py-0 mt-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     Total Quotations
//                   </p>
//                   <h3 className="text-3xl font-bold text-gray-800 mt-2">
//                     {stats.total}
//                   </h3>
//                 </div>
//                 <div className="bg-orange-100 p-3 rounded-sm">
//                   <FileText className="text-orange-500" size={24} />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">Approved</p>
//                   <h3 className="text-3xl font-bold text-green-600 mt-2">
//                     {stats.approved}
//                   </h3>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-sm">
//                   <FileText className="text-green-500" size={24} />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">Pending</p>
//                   <h3 className="text-3xl font-bold text-yellow-600 mt-2">
//                     {stats.pending}
//                   </h3>
//                 </div>
//                 <div className="bg-yellow-100 p-3 rounded-sm">
//                   <FileText className="text-yellow-500" size={24} />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     Total Value
//                   </p>
//                   <h3 className="text-3xl font-bold text-blue-600 mt-2">
//                     ₹{(stats.totalValue / 100000).toFixed(1)}L
//                   </h3>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-sm">
//                   <FileText className="text-blue-500" size={24} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search and Filter Bar */}
//           <div className="bg-white rounded-sm shadow-md p-4 mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-4 py-2 border border-gray-200 rounded-sm hover:bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//               <button
//                 onClick={handleExport}
//                 className="px-4 py-2 bg-orange-50 text-orange-600 rounded-sm hover:bg-orange-100 flex items-center gap-2 font-medium"
//               >
//                 <Download size={20} />
//                 Export CSV
//               </button>
//             </div>
//           </div>

//           {/* Quotations Table */}
//           <div className="bg-white rounded-sm shadow-md overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">
//                       Quotation ID
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">
//                       Client
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">
//                       Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">
//                       Amount
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">
//                       Valid Until
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-center text-sm font-semibold">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredQuotations.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="7"
//                         className="px-6 py-12 text-center text-gray-500"
//                       >
//                         No quotations found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredQuotations.map((quote) => (
//                       <tr
//                         key={quote.id}
//                         className="hover:bg-orange-50 transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           <span className="font-semibold text-orange-600">
//                             {quote.id}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="font-medium text-gray-800">
//                             {quote.client}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">
//                           {quote.date}
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="font-bold text-gray-800">
//                             ${quote.amount.toLocaleString()}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">
//                           {quote.validUntil}
//                         </td>
//                         <td className="px-6 py-4">
//                           <select
//                             value={quote.status}
//                             onChange={(e) =>
//                               handleStatusChange(quote.id, e.target.value)
//                             }
//                             className={`px-3 py-1 rounded-sm text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${getStatusColor(
//                               quote.status
//                             )}`}
//                           >
//                             <option value="Draft">Draft</option>
//                             <option value="Pending">Pending</option>
//                             <option value="Approved">Approved</option>
//                             <option value="Rejected">Rejected</option>
//                           </select>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-center gap-2">
//                             <button
//                               onClick={() => handleView(quote)}
//                               className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
//                               title="View"
//                             >
//                               <Eye size={18} />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 window.alert("Print functionality")
//                               }
//                               className="p-2 text-purple-600 hover:bg-purple-50 rounded-sm transition-colors"
//                               title="Print"
//                             >
//                               <Printer size={18} />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(quote.id)}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
//                               title="Delete"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Create Quotation Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center">
//                 <h2 className="text-2xl font-bold">Create New Quotation</h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Client Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="client"
//                       value={formData.client}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       placeholder="Enter client name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Quotation Date *
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Valid Until
//                     </label>
//                     <input
//                       type="date"
//                       name="validUntil"
//                       value={formData.validUntil}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Amount *
//                     </label>
//                     <input
//                       type="number"
//                       name="amount"
//                       value={formData.amount}
//                       onChange={handleInputChange}
//                       placeholder="Enter amount"
//                       className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     rows="4"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Enter quotation description"
//                     className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   ></textarea>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCreateQuotation}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg"
//                   >
//                     Create Quotation
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* View Quotation Modal */}
//         {showViewModal && selectedQuote && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center">
//                 <h2 className="text-2xl font-bold">Quotation Details</h2>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-500 mb-1">
//                       Quotation ID
//                     </p>
//                     <p className="text-lg font-bold text-orange-600">
//                       {selectedQuote.id}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-500 mb-1">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-block px-3 py-1 rounded-sm text-sm font-semibold ${getStatusColor(
//                         selectedQuote.status
//                       )}`}
//                     >
//                       {selectedQuote.status}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-500 mb-1">
//                       Client Name
//                     </p>
//                     <p className="text-lg font-semibold text-gray-800">
//                       {selectedQuote.client}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-500 mb-1">
//                       Amount
//                     </p>
//                     <p className="text-lg font-bold text-gray-800">
//                       ${selectedQuote.amount.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-500 mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg text-gray-800">
//                       {selectedQuote.date}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-500 mb-1">
//                       Valid Until
//                     </p>
//                     <p className="text-lg text-gray-800">
//                       {selectedQuote.validUntil}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-gray-500 mb-1">
//                     Description
//                   </p>
//                   <p className="text-gray-800 bg-gray-50 p-4 rounded-sm">
//                     {selectedQuote.description || "No description provided"}
//                   </p>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700"
//                   >
//                     Close
//                   </button>
//                   <button
//                     onClick={() => window.alert("Print functionality")}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg flex items-center justify-center gap-2"
//                   >
//                     <Printer size={20} />
//                     Print
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Download,
  Eye,
  Printer,
  Trash2,
  FileText,
  Home,
  FileTextIcon,
} from "lucide-react";

// Import modal components (these would be in separate files)
import CreateQuotationModal from "../../pages/QuotationPart/CreateQuotationModal";
import ViewQuotationModal from "../../pages/QuotationPart/ViewQuotationModal";
import NumberCard from "../../components/NumberCard";

export default function QuotationPage() {
  const [quotations, setQuotations] = useState([
    {
      id: "QT-2024-001",
      client: "Acme Corporation",
      date: "2024-11-15",
      amount: 150000,
      status: "Pending",
      validUntil: "2024-12-15",
      description: "Website development and design services",
    },
    {
      id: "QT-2024-002",
      client: "Tech Solutions Ltd",
      date: "2024-11-10",
      amount: 250000,
      status: "Approved",
      validUntil: "2024-12-10",
      description: "Mobile app development",
    },
    {
      id: "QT-2024-003",
      client: "Global Industries",
      date: "2024-11-05",
      amount: 185000,
      status: "Rejected",
      validUntil: "2024-12-05",
      description: "CRM system implementation",
    },
    {
      id: "QT-2024-004",
      client: "Innovation Inc",
      date: "2024-11-18",
      amount: 320000,
      status: "Draft",
      validUntil: "2024-12-18",
      description: "E-commerce platform setup",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [formData, setFormData] = useState({
    client: "",
    date: "",
    validUntil: "",
    amount: "",
    description: "",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateQuotation = () => {
    if (formData.client && formData.date && formData.amount) {
      const newQuotation = {
        id: `QT-2024-${String(quotations.length + 1).padStart(3, "0")}`,
        client: formData.client,
        date: formData.date,
        amount: parseFloat(formData.amount),
        status: "Draft",
        validUntil: formData.validUntil,
        description: formData.description,
      };
      setQuotations([newQuotation, ...quotations]);
      setFormData({
        client: "",
        date: "",
        validUntil: "",
        amount: "",
        description: "",
      });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      setQuotations(quotations.filter((q) => q.id !== id));
    }
  };

  const handleView = (quote) => {
    setSelectedQuote(quote);
    setShowViewModal(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setQuotations(
      quotations.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Client,Date,Amount,Valid Until,Status\n" +
      filteredQuotations
        .map(
          (q) =>
            `${q.id},${q.client},${q.date},${q.amount},${q.validUntil},${q.status}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quotations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || q.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: quotations.length,
    approved: quotations.filter((q) => q.status === "Approved").length,
    pending: quotations.filter((q) => q.status === "Pending").length,
    totalValue: quotations.reduce((sum, q) => sum + q.amount, 0),
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // FIX

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-0 ml-10 py-4">
            <div className="flex items-center justify-between">
              {/* Left Title Section */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  All Quotations
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-orange-500 font-medium">
                    All Quotations
                  </span>
                </p>
              </div>

              {/* Middle Filter + Export */}
              <div className="flex flex-col lg:flex-row gap-4 mr-4 ml-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-5 py-3 border border-gray-200 rounded-sm hover:bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="All">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={handleExport}
                  className="px-5 py-3 bg-orange-50 text-orange-600 rounded-sm hover:bg-orange-100 flex items-center gap-2 font-medium"
                >
                  <Download size={20} />
                  Export CSV
                </button>
              </div>

              {/* Right New Quotation Button */}
              <button
                onClick={() => setShowModal(true)}
                className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
              >
                <Plus size={20} />
                New Quotation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-0 ml-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <NumberCard
              title={"Total Quotations"}
              number={stats.total}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"} />

            <NumberCard
              title={"Approved"}
              number={stats.approved}
              icon={<FileText className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"} />

            <NumberCard
              title={"Pending"}
              number={stats.pending}
              icon={<FileText className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"} />

            <NumberCard
              title={"Total Value"}
              number={`₹${(stats.totalValue / 100000).toFixed(1)}L`}
              icon={<FileText className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"} />
          </div>

          {/* Quotations Table */}
          <div className="bg-white rounded-sm shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Quotation ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Valid Until
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuotations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No quotations found
                      </td>
                    </tr>
                  ) : (
                    filteredQuotations.map((quote) => (
                      <tr
                        key={quote.id}
                        className="hover:bg-orange-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-orange-600">
                            {quote.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">
                            {quote.client}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {quote.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-800">
                            ${quote.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {quote.validUntil}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={quote.status}
                            onChange={(e) =>
                              handleStatusChange(quote.id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-sm text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${getStatusColor(
                              quote.status
                            )}`}
                          >
                            <option value="Draft">Draft</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(quote)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() =>
                                window.alert("Print functionality")
                              }
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-sm transition-colors"
                              title="Print"
                            >
                              <Printer size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(quote.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div className="flex justify-end items-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-sm  font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:opacity-90 transition"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
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
              className="px-4 py-2 rounded-sm text-white font-semibold bg-[#22C55E] hover:opacity-90 transition"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modals */}
        <CreateQuotationModal
          showModal={showModal}
          setShowModal={setShowModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleCreateQuotation={handleCreateQuotation}
        />

        <ViewQuotationModal
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          selectedQuote={selectedQuote}
          getStatusColor={getStatusColor}
        />
      </div>
    </DashboardLayout>
  );
}
