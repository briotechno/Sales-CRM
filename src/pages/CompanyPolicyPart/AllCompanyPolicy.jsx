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

const DeletePolicyModal = ({ isOpen, onClose, onConfirm, isLoading, policyTitle }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerVariant="simple"
      maxWidth="max-w-md"
      footer={
        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 shadow-sm transition-all"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={20} />
            )}
            {isLoading ? "Deleting..." : "Delete Now"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <AlertTriangle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete policy{" "}
          <span className="font-bold text-gray-800">"{policyTitle}"</span>?
        </p>

        <p className="text-sm text-red-500 italic">
          This action cannot be undone. All associated data will be permanently removed.
        </p>
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
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const { data: allPoliciesDataForCheck } = useGetCompanyPoliciesQuery({
    category: "All",
    status: "All",
    search: "",
  });
  const allPolicies = allPoliciesDataForCheck || [];

  const { user } = useSelector((state) => state.auth);
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
    category: "All",
    status: filterStatus,
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
      effective_date: policy.effective_date,
      review_date: policy.review_date,
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
    const csvContent = [
      ["Policy Title", "Category", "Effective Date", "Review Date", "Version", "Status", "Author"],
      ...filteredPolicies.map((p) => [
        p.title,
        p.category,
        p.effective_date,
        p.review_date,
        p.version,
        p.status,
        p.author || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "company_policies.csv";
    a.click();
  };

  const handleClearFilters = () => {
    setFilterStatus("All");
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
                      if (filterStatus !== "All") {
                        handleClearFilters();
                      } else {
                        setShowFilters(!showFilters);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${showFilters || filterStatus !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {filterStatus !== "All" ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                      {/* Status Section */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">status</span>
                      </div>
                      <div className="py-1">
                        {["All", "Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilterStatus(status);
                              setShowFilters(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status}
                          </button>
                        ))}
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
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No policies found matching the current filters
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
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Category</span>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-sm border border-purple-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                      <div className="bg-purple-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                        <Layers size={20} />
                      </div>
                      <span className="text-lg font-bold text-purple-900">{selectedPolicy.version}</span>
                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">Version</span>
                    </div>

                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                      <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                        {selectedPolicy.status === "Active" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <span className={`text-lg font-bold ${selectedPolicy.status === "Active" ? "text-green-900" : "text-yellow-900"}`}>
                        {selectedPolicy.status}
                      </span>
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Status</span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Effective Date</p>
                        <p className="text-sm font-semibold text-gray-700">{new Date(selectedPolicy.effective_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Review Date</p>
                        <p className="text-sm font-semibold text-gray-700">{new Date(selectedPolicy.review_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Author</p>
                        <p className="text-sm font-semibold text-gray-700">{selectedPolicy.author || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedPolicy.description && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlignLeft size={16} /> Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-sm border border-gray-200 break-words whitespace-pre-wrap text-sm">
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
