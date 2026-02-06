import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiHome } from "react-icons/fi";
const incrementVersion = (version) => {
  if (!version) return "1.0";
  const strVersion = version.toString();
  const parts = strVersion.split('.');
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    if (!isNaN(parseInt(lastPart))) {
      const incremented = parseInt(lastPart) + 1;
      parts[parts.length - 1] = incremented.toString();
      return parts.join('.');
    }
  } else {
    if (!isNaN(parseInt(strVersion))) {
      return strVersion + ".1";
    }
  }
  return strVersion + ".1";
};
import DashboardLayout from "../../components/DashboardLayout";
import {
  FileText,
  Plus,
  Filter,
  Download,
  Eye,
  X,
  Edit,
  Trash2,
  Activity,
  View,
  Archive,
  AlertTriangle,
  User,
  Calendar,
  Briefcase,
  AlignLeft,
  Layers,
  CheckCircle,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
  useGetCompanyPoliciesQuery,
  useCreateCompanyPolicyMutation,
  useUpdateCompanyPolicyMutation,
  useDeleteCompanyPolicyMutation,
} from "../../store/api/companyPolicyApi";
import toast from "react-hot-toast";
import usePermission from "../../hooks/usePermission";
import Modal from "../../components/common/Modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DeletePolicyModal = ({ isOpen, onClose, onConfirm, isLoading, policyTitle }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerVariant="simple"
      maxWidth="max-w-md"
      cleanLayout={true}
      footer={
        <div className="flex gap-4 w-full px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 font-primary text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 size={18} />}
            Delete Now
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center text-black font-primary p-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={48} className="text-[#d00000] drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Are you sure you want to delete the policy <span className="font-bold text-gray-900">"{policyTitle}"</span>?
        </p>
        <div className="bg-red-50 px-4 py-2 rounded-lg inline-block">
          <p className="text-xs text-red-600 font-bold tracking-wide italic uppercase">Irreversible Action</p>
        </div>
      </div>
    </Modal>
  );
};

export default function CompanyPolicy() {
  const today = new Date().toISOString().split('T')[0];
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const { data: allPoliciesDataForCheck } = useGetCompanyPoliciesQuery({
    category: filterCategory,
    status: filterStatus,
    author: filterAuthor,
    startDate: startDate,
    endDate: endDate,
    search: searchTerm,
  });
  const allPolicies = allPoliciesDataForCheck || [];

  const { user } = useSelector((state) => state.auth);

  const hasActiveFilters = filterCategory !== "All" || filterStatus !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== "" || searchTerm !== "";

  const clearAllFilters = () => {
    setFilterCategory("All");
    setFilterStatus("All");
    setFilterAuthor("");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };
  const { create, read, update, delete: remove } = usePermission("Company Policy");


  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    effective_date: "",
    review_date: "",
    version: "1.0",
    description: "",
    author: "",
    status: "Active",
  });

  useEffect(() => {
    if (user && !formData.author) {
      setFormData((prev) => ({
        ...prev,
        author: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      }));
    }
  }, [user]);

  // API Queries and Mutations
  const {
    data: policiesData,
    isLoading,
    isError,
  } = useGetCompanyPoliciesQuery({
    category: filterCategory,
    status: filterStatus,
    author: filterAuthor,
    startDate: startDate,
    endDate: endDate,
    search: searchTerm,
  });

  const [createPolicy] = useCreateCompanyPolicyMutation();
  const [updatePolicy] = useUpdateCompanyPolicyMutation();
  const [deletePolicy] = useDeleteCompanyPolicyMutation();

  const categories = [
    "General",
    "Corporate Governance",
    "Work Arrangements",
    "Remote / Hybrid Work",
    "Office Rules & Facilities",
    "Security",
    "IT & Data Security",
    "Information Security",
    "Finance",
    "Financial Controls",
    "Expense & Reimbursement",
    "Procurement Policy",
    "HR",
    "Employee Conduct",
    "Ethics & Compliance",
    "Legal & Regulatory",
    "Risk Management",
    "Business Continuity",
    "Confidentiality & NDA",
    "Health, Safety & Environment (HSE)",
    "Equal Opportunity & Diversity"
  ];

  const statuses = ["Active", "Inactive"];

  // Calculate stats
  const getStats = () => {
    if (!policiesData) return { total: 0, active: 0, inactive: 0 };
    return {
      total: policiesData.length,
      active: policiesData.filter((p) => p.status === "Active").length,
      inactive: policiesData.filter((p) => p.status === "Inactive").length,
    };
  };

  const stats = getStats();

  // Filter policies based on active tab
  const filteredPolicies = policiesData || [];

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPolicies = filteredPolicies.slice(indexOfFirstItem, indexOfLastItem);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "General",
      effective_date: "",
      review_date: "",
      version: "1.0",
      description: "",
      author: user ? (user.firstName ? `${user.firstName} ${user.lastName}` : user.email) : "",
      status: "Active",
    });
    setIsUpdatingExisting(false);
    setExistingId(null);
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    if (!showAddModal) {
      setFormData({ ...formData, category: selectedCat });
      return;
    }

    const existing = allPolicies.find((p) => p.category === selectedCat);

    if (existing) {
      setFormData({
        ...formData,
        title: existing.title,
        category: selectedCat,
        description: existing.description || "",
        effective_date: existing.effective_date ? new Date(existing.effective_date).toISOString().split('T')[0] : (existing.effective_date || ""),
        review_date: existing.review_date ? new Date(existing.review_date).toISOString().split('T')[0] : (existing.review_date || ""),
        version: incrementVersion(existing.version),
        author: existing.author || (user ? (user.firstName ? `${user.firstName} ${user.lastName}` : user.email) : ""),
        status: existing.status || "Active",
      });
      setIsUpdatingExisting(true);
      setExistingId(existing.id);
      toast.success(`Previous version found for ${selectedCat}. Data auto-filled and version updated.`);
    } else {
      setFormData({
        ...formData,
        title: "",
        category: selectedCat,
        description: "",
        effective_date: "",
        review_date: "",
        version: "1.0",
        author: user ? (user.firstName ? `${user.firstName} ${user.lastName}` : user.email) : "",
        status: "Active",
      });
      setIsUpdatingExisting(false);
      setExistingId(null);
    }
  };

  const handleAddPolicy = async () => {
    if (!formData.title || !formData.effective_date || !formData.review_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isUpdatingExisting && existingId) {
        await updatePolicy({ id: existingId, ...formData }).unwrap();
        toast.success("Policy updated with new version successfully");
      } else {
        await createPolicy(formData).unwrap();
        toast.success("Policy created successfully");
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to process policy");
    }
  };

  const handleEditClick = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      title: policy.title,
      category: policy.category,
      effective_date: policy.effective_date ? new Date(policy.effective_date).toISOString().split('T')[0] : "",
      review_date: policy.review_date ? new Date(policy.review_date).toISOString().split('T')[0] : "",
      version: policy.version,
      description: policy.description || "",
      author: policy.author || "",
      status: policy.status,
    });
    setShowEditModal(true);
  };

  const handleUpdatePolicy = async () => {
    if (!formData.title || !formData.effective_date || !formData.review_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updatePolicy({ id: selectedPolicy.id, ...formData }).unwrap();
      toast.success("Policy updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedPolicy(null);
    } catch (error) {
      toast.error("Failed to update policy");
    }
  };

  const handleDeleteClick = (policy) => {
    setPolicyToDelete(policy);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (policyToDelete) {
      try {
        await deletePolicy(policyToDelete.id).unwrap();
        toast.success("Policy deleted successfully");
        setShowDeleteModal(false);
        setPolicyToDelete(null);
      } catch (error) {
        toast.error("Failed to delete policy");
      }
    }
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setShowViewModal(true);
  };

  const handleExport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Company Policies Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add date
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableColumn = ["Policy Title", "Category", "Effective Date", "Review Date", "Version", "Status", "Author"];
    const tableRows = [];

    filteredPolicies.forEach(p => {
      const policyData = [
        p.title,
        p.category,
        new Date(p.effective_date).toLocaleDateString(),
        new Date(p.review_date).toLocaleDateString(),
        p.version,
        p.status,
        p.author || "N/A"
      ];
      tableRows.push(policyData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [255, 123, 29], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { top: 35 }
    });

    doc.save("company_policies.pdf");
  };

  const handleClearFilters = () => {
    setFilterCategory("All");
    setFilterStatus("All");
    setFilterAuthor("");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getInitials = (title) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorClass = (index) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-green-100 text-green-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ];
    return colors[index % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Company Policy</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Company Policy
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (filterStatus !== "All" || filterCategory !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== "") {
                        handleClearFilters();
                      } else {
                        setShowFilters(!showFilters);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${showFilters || filterStatus !== "All" || filterCategory !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== ""
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {filterStatus !== "All" || filterCategory !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== "" ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-[450px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Filter Options</span>
                        <button
                          onClick={handleClearFilters}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset all
                        </button>
                      </div>

                      <div className="p-5 grid grid-cols-2 gap-6">
                        {/* Status Section */}
                        <div className="space-y-4 border-r border-gray-100 pr-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Select Status</span>
                          <div className="space-y-2">
                            {["All", ...statuses].map((status) => (
                              <label key={status} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="status_filter"
                                    checked={filterStatus === status}
                                    onChange={() => setFilterStatus(status)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-3 text-sm font-medium transition-colors ${filterStatus === status ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {status}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Filters Right Section */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Filters</span>

                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Category</label>
                              <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Categories</option>
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Author</label>
                              <input
                                type="text"
                                value={filterAuthor}
                                onChange={(e) => setFilterAuthor(e.target.value)}
                                placeholder="Search author..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-xs font-semibold focus:outline-none focus:border-orange-500 bg-gray-50 hover:bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Date Range Section */}
                        <div className="col-span-2 space-y-4 pt-2 border-t border-gray-100">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2">Effective Date Range</span>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-orange-500 bg-gray-50"
                              />
                              <span className="absolute -top-2 left-2 bg-white px-1 text-[9px] text-gray-400 font-bold uppercase">From</span>
                            </div>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-orange-500 bg-gray-50"
                              />
                              <span className="absolute -top-2 left-2 bg-white px-1 text-[9px] text-gray-400 font-bold uppercase">To</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowFilters(false);
                            setCurrentPage(1);
                          }}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                        >
                          Apply filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExport}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-sm flex items-center gap-2 transition text-sm font-semibold shadow-sm active:scale-95"
                >
                  <Download className="w-5 h-5" /> EXPORT
                </button>

                <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                  disabled={!create}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={20} /> Add Policy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <NumberCard
              title={"Total Policies"}
              number={stats.total || "0"}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"Active"}
              number={stats.active || "0"}
              icon={<Activity className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"Inactive"}
              number={stats.inactive || "0"}
              icon={<Archive className="text-red-600" size={24} />}
              iconBgColor={"bg-red-100"}
              lineBorderClass={"border-red-500"}
            />
          </div>



          {/* Tabs */}


          {/* Table */}
          <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[20%]">Policy Title</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Category</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Effective Date</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Review Date</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[10%]">Version</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[10%]">Status</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 w-[15%]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="bg-white animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-red-500">
                      Error loading policies
                    </td>
                  </tr>
                ) : currentPolicies.length > 0 ? (
                  currentPolicies.map((policy, index) => (
                    <tr key={policy.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-sm ${getColorClass(
                              index
                            )} flex items-center justify-center font-bold text-sm shadow-sm border border-orange-100 transition-transform hover:scale-105`}
                          >
                            {getInitials(policy.title)}
                          </div>
                          <span className="font-semibold text-gray-800 transition-all duration-300 hover:text-orange-600 cursor-pointer">{policy.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{policy.category}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(policy.effective_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(policy.review_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium text-sm">{policy.version}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wider ${policy.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}
                        >
                          {policy.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleView(policy)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditClick(policy)}
                              disabled={!update}
                              className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${update ? "text-green-500 hover:text-green-700" : "text-gray-300 cursor-not-allowed"}`}
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(policy)}
                              disabled={!remove}
                              className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${remove ? "text-red-500 hover:text-red-700" : "text-gray-300 cursor-not-allowed"}`}
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 max-w-[600px] mx-auto animate-fadeIn">
                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4 relative">
                          <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-20"></div>
                          <FileText size={48} className="text-orange-500 relative z-10" />
                        </div>
                        <div className="space-y-3 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {hasActiveFilters ? "No Policies Found" : "Create Your First Policy"}
                          </h3>
                          <p className="text-gray-500 font-medium leading-relaxed px-4">
                            {hasActiveFilters
                              ? "We couldn't find any policies matching your criteria. Start by creating a new policy or clear your current filters."
                              : "You haven't created any company policies yet. Set guidelines and standards to keep your organization aligned."}
                          </p>
                        </div>

                        {hasActiveFilters ? (
                          <button
                            onClick={clearAllFilters}
                            className="mt-6 px-10 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-widest shadow-sm active:scale-95"
                          >
                            Reset All Filters
                          </button>
                        ) : (
                          create && (
                            <button
                              onClick={() => {
                                setFormData({
                                  title: "",
                                  category: "IT & Data Security",
                                  description: "",
                                  effective_date: "",
                                  review_date: "",
                                  version: "1.0",
                                  status: "Active",
                                  author: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
                                });
                                setShowAddModal(true);
                              }}
                              className="mt-6 px-12 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-[0_10px_25px_rgba(255,123,29,0.3)] inline-flex items-center gap-3 group text-sm active:scale-95"
                            >
                              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                              Create First Policy
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Updated to match Team.jsx */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{Math.min(indexOfLastItem, filteredPolicies.length)}</span> of <span className="text-orange-600">{filteredPolicies.length}</span> Results
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}



          {/* Add Policy Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                        <Plus className="text-white" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {isUpdatingExisting ? "Update Policy (New Version)" : "Add New Policy"}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 font-sans">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <FileText size={16} className="text-[#FF7B1D]" /> Policy Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
                        placeholder="Enter policy title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#FF7B1D]" /> Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF7B1D]" /> Effective Date *
                      </label>
                      <input
                        type="date"
                        value={formData.effective_date}
                        min={today}
                        onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF7B1D]" /> Review Date *
                      </label>
                      <input
                        type="date"
                        value={formData.review_date}
                        min={today}
                        onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Layers size={16} className="text-[#FF7B1D]" /> Version
                      </label>
                      <input
                        type="text"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
                        placeholder="1.0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <User size={16} className="text-[#FF7B1D]" /> Author
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-gray-100 cursor-not-allowed shadow-sm font-medium"
                        placeholder="Department or author name"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <AlignLeft size={16} className="text-[#FF7B1D]" /> Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
                        rows="3"
                        placeholder="Enter policy description"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddPolicy}
                      className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all disabled:opacity-50"
                    >
                      {isUpdatingExisting ? "Update Existing Policy" : "Add Policy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Policy Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                        <Edit className="text-white" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Edit Policy</h2>
                    </div>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 font-sans">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <FileText size={16} className="text-[#FF7B1D]" /> Policy Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
                        placeholder="Enter policy title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#FF7B1D]" /> Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF7B1D]" /> Effective Date *
                      </label>
                      <input
                        type="date"
                        value={formData.effective_date}
                        min={today}
                        onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF7B1D]" /> Review Date *
                      </label>
                      <input
                        type="date"
                        value={formData.review_date}
                        min={today}
                        onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Layers size={16} className="text-[#FF7B1D]" /> Version
                      </label>
                      <input
                        type="text"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
                        placeholder="1.0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <CheckCircle size={16} className="text-[#FF7B1D]" /> Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <User size={16} className="text-[#FF7B1D]" /> Author
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-gray-100 cursor-not-allowed shadow-sm font-medium"
                        placeholder="Department or author name"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <AlignLeft size={16} className="text-[#FF7B1D]" /> Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
                        rows="3"
                        placeholder="Enter policy description"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePolicy}
                      className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all disabled:opacity-50"
                    >
                      Update Policy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Policy Modal */}
          {showViewModal && selectedPolicy && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <FileText size={24} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPolicy.title}</h2>
                        <p className="text-sm text-white text-opacity-90 mt-1">Policy Details</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                    >
                      <X size={22} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-8 font-sans">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                      <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                        <Briefcase size={20} />
                      </div>
                      <span className="text-lg font-bold text-blue-900 line-clamp-1">{selectedPolicy.category}</span>
                      <span className="text-sm font-bold text-blue-600 capitalize tracking-wide mt-1">Category</span>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-sm border border-purple-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                      <div className="bg-purple-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                        <Layers size={20} />
                      </div>
                      <span className="text-lg font-bold text-purple-900">{selectedPolicy.version}</span>
                      <span className="text-sm font-bold text-purple-600 capitalize tracking-wide mt-1">Version</span>
                    </div>

                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                      <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                        {selectedPolicy.status === "Active" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <span className={`text-lg font-bold ${selectedPolicy.status === "Active" ? "text-green-900" : "text-yellow-900"}`}>
                        {selectedPolicy.status}
                      </span>
                      <span className="text-sm font-bold text-green-600 capitalize tracking-wide mt-1">Status</span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600 capitalize tracking-wide">Effective Date</p>
                        <p className="text-sm font-semibold text-gray-700">{new Date(selectedPolicy.effective_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600 capitalize tracking-wide">Review Date</p>
                        <p className="text-sm font-semibold text-gray-700">{new Date(selectedPolicy.review_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600 capitalize tracking-wide">Author</p>
                        <p className="text-sm font-semibold text-gray-700">{selectedPolicy.author || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedPolicy.description && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-600 capitalize tracking-wide mb-3 flex items-center gap-2">
                        <AlignLeft size={16} /> Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-sm border border-gray-200 break-words whitespace-pre-wrap text-sm max-h-48 overflow-y-auto">
                        {selectedPolicy.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all shadow-sm font-sans"
                  >
                    Close Details
                  </button>
                  {/* <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditClick(selectedPolicy);
                  }}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Edit Policy
                </button> */}
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-sm shadow-2xl max-w-md w-full p-6 text-center">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Policy</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this policy? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all font-semibold shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DeletePolicyModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          isLoading={false} // you can manage loading state if needed
          policyTitle={policyToDelete?.title}
        />
      </div>
    </DashboardLayout>
  );
}
