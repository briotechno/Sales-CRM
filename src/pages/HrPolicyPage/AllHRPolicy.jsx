import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
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
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
  useGetHRPoliciesQuery,
  useCreateHRPolicyMutation,
  useUpdateHRPolicyMutation,
  useDeleteHRPolicyMutation,
} from "../../store/api/hrPolicyApi";
import toast from "react-hot-toast";
import usePermission from "../../hooks/usePermission";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import Modal from "../../components/common/Modal";

const DeleteHrModal = ({ isOpen, onClose, onConfirm, isLoading, policyTitle }) => {
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
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
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
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <AlertTriangle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete Hr policy{" "}
          <span className="font-bold text-gray-800">"{policyTitle}"</span>?
        </p>

        <p className="text-sm text-red-500 italic mb-6">
          This action cannot be undone. All associated data will be permanently removed.
        </p>

      </div>
    </Modal>
  );
};

export default function HRPolicy() {
  const [activeTab, setActiveTab] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: departmentData } = useGetDepartmentsQuery({ status: "Active" });
  const departments = departmentData?.departments || [];

  const { create, read, update, delete: remove } = usePermission("HR Policy");

  const [formData, setFormData] = useState({
    title: "",
    category: "Leave",
    description: "",
    effective_date: "",
    review_date: "",
    version: "1.0",
    department: "",
    applicable_to: "all",
    status: "Active",
    document_path: "",
  });

  // API Queries and Mutations
  const {
    data: policiesData,
    isLoading,
    isError,
  } = useGetHRPoliciesQuery({
    category: filterCategory,
    status: filterStatus === "All" ? activeTab : filterStatus,
    search: searchTerm,
    department: filterDepartment,
  });

  const [createPolicy] = useCreateHRPolicyMutation();
  const [updatePolicy] = useUpdateHRPolicyMutation();
  const [deletePolicy] = useDeleteHRPolicyMutation();

  const categories = [
    "Leave",
    "Attendance",
    "Compensation",
    "Benefits",
    "Performance",
    "Code of Conduct",
  ];

  const statuses = ["Active", "Under Review", "Archived"];

  // Calculate stats
  const getStats = () => {
    if (!policiesData) return { total: 0, active: 0, underReview: 0, archived: 0 };
    return {
      total: policiesData.length,
      active: policiesData.filter((p) => p.status === "Active").length,
      underReview: policiesData.filter((p) => p.status === "Under Review").length,
      archived: policiesData.filter((p) => p.status === "Archived").length,
    };
  };

  const stats = getStats();

  // Filter policies based on active tab
  const filteredPolicies = policiesData
    ? policiesData.filter((p) => activeTab === "All" || p.status === activeTab)
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPolicies = filteredPolicies.slice(indexOfFirstItem, indexOfLastItem);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Leave",
      description: "",
      effective_date: "",
      review_date: "",
      version: "1.0",
      department: "",
      applicable_to: "all",
      status: "Active",
      document_path: "",
    });
  };

  const handleAddPolicy = async () => {
    if (!formData.title || !formData.effective_date || !formData.review_date || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createPolicy(formData).unwrap();
      toast.success("HR Policy created successfully");
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to create HR policy");
    }
  };

  const handleEditClick = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      title: policy.title,
      category: policy.category,
      description: policy.description || "",
      effective_date: policy.effective_date,
      review_date: policy.review_date,
      version: policy.version,
      department: policy.department || "",
      applicable_to: policy.applicable_to || "all",
      status: policy.status,
      document_path: policy.document_path || "",
    });
    setShowEditModal(true);
  };

  const handleUpdatePolicy = async () => {
    if (!formData.title || !formData.effective_date || !formData.review_date || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updatePolicy({ id: selectedPolicy.id, ...formData }).unwrap();
      toast.success("HR Policy updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedPolicy(null);
    } catch (error) {
      toast.error("Failed to update HR policy");
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
        toast.success("HR Policy deleted successfully");
        setShowDeleteModal(false);
        setPolicyToDelete(null);
      } catch (error) {
        toast.error("Failed to delete HR policy");
      }
    }
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setShowViewModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      ["Policy Title", "Category", "Effective Date", "Review Date", "Version", "Status", "Department", "Applicable To"],
      ...filteredPolicies.map((p) => [
        p.title,
        p.category,
        p.effective_date,
        p.review_date,
        p.version,
        p.status,
        p.department || "",
        p.applicable_to || "all",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hr_policies.csv";
    a.click();
  };

  const handleClearFilters = () => {
    setFilterCategory("All");
    setFilterStatus("All");
    setFilterDepartment("All");
    setSearchTerm("");
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
      <div className="min-h-screen ml-6 p-0">
        {/* Header */}
        <div className="bg-white rounded-sm p-3 mb-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Policy</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <FiHome className="text-gray-700 text-sm" />
                <span className="text-gray-400">HRM /</span>
                <span className="text-[#FF7B1D] font-medium">All HR Policy</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all shadow-sm ${showFilters || filterCategory !== "All" || filterStatus !== "All" || filterDepartment !== "All" || searchTerm
                  ? "bg-orange-50 border-orange-200 text-orange-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Filter size={18} className={filterCategory !== "All" || filterStatus !== "All" || filterDepartment !== "All" || searchTerm ? "fill-orange-500" : ""} />
                <span className="font-semibold text-sm">Filters</span>
                {(filterCategory !== "All" || filterStatus !== "All" || filterDepartment !== "All" || searchTerm) && (
                  <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                )}
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-sm font-medium border border-gray-300 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                disabled={!create}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm font-semibold transition ml-2 ${create
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <Plus size={18} />
                Add Policy
              </button>
            </div>
          </div>
        </div>

        {/* FILTER DROPDOWN */}
        {showFilters && (
          <div className="absolute right-6 top-24 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl w-80 p-5 animate-fadeIn z-50 transition-all">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter size={18} className="text-orange-500" />
                Filter Options
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Search Policies
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              >
                <option value="All">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              >
                <option value="All">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.department_name}>
                    {dep.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all font-sans"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 font-sans"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <NumberCard
            title={"Total Policies"}
            number={stats.total}
            icon={<FileText className="text-blue-600" size={24} />}
            iconBgColor={"bg-blue-100"}
            lineBorderClass={"border-blue-500"}
          />
          <NumberCard
            title={"Active"}
            number={stats.active}
            icon={<Activity className="text-green-600" size={24} />}
            iconBgColor={"bg-green-100"}
            lineBorderClass={"border-green-500"}
          />
          <NumberCard
            title={"Under Review"}
            number={stats.underReview}
            icon={<View className="text-orange-600" size={24} />}
            iconBgColor={"bg-orange-100"}
            lineBorderClass={"border-orange-500"}
          />
          <NumberCard
            title={"Archived"}
            number={stats.archived}
            icon={<Archive className="text-purple-600" size={24} />}
            iconBgColor={"bg-purple-100"}
            lineBorderClass={"border-purple-500"}
          />
        </div >

        {/* Tabs */}
        < div className="flex gap-8 mb-6 border-b border-gray-200" >
          {
            ["All", "Active", "Under Review", "Archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`pb-3 font-medium transition-colors ${activeTab === tab
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab}
              </button>
            ))
          }
        </div >

        {/* Table */}
        < div className="bg-white rounded-sm shadow-sm overflow-hidden" >
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Policy Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Effective Date
                </th>
                <th className="py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Review Date
                </th>
                <th className="py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Department
                </th>
                <th className="py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Actions
                </th>
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
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
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
                    Error loading HR policies
                  </td>
                </tr>
              ) : currentPolicies.length > 0 ? (
                currentPolicies.map((policy, index) => (
                  <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full ${getColorClass(
                            index
                          )} flex items-center justify-center font-semibold text-sm`}
                        >
                          {getInitials(policy.title)}
                        </div>
                        <span className="font-medium text-gray-900">{policy.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{policy.category}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(policy.effective_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(policy.review_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{policy.department || "All Departments"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${policy.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : policy.status === "Under Review"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {read && (
                          <button
                            onClick={() => handleView(policy)}
                            className="p-2 hover:bg-blue-100 rounded-sm transition-all"
                            title="View"
                          >
                            <Eye size={18} className="text-blue-600" />
                          </button>
                        )}
                        {update && (
                          <button
                            onClick={() => handleEditClick(policy)}
                            className="p-2 hover:bg-orange-100 rounded-sm transition-all"
                            title="Edit"
                          >
                            <Edit size={18} className="text-orange-600" />
                          </button>
                        )}
                        {remove && (
                          <button
                            onClick={() => handleDeleteClick(policy)}
                            className="p-2 hover:bg-red-100 rounded-sm transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No HR policies found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div >

        {/* Pagination - Updated to match Designation.jsx */}
        < div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border-t border-gray-200" >
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-bold">{Math.min(indexOfLastItem, filteredPolicies.length)}</span> of{" "}
            <span className="font-bold">{filteredPolicies.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 border rounded-sm text-sm font-bold flex items-center justify-center transition-colors ${currentPage === p
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div >

        {/* Add Policy Modal */}
        {
          showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                        <Plus className="text-white" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Add New HR Policy</h2>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Policy Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter policy title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Effective Date *
                      </label>
                      <input
                        type="date"
                        value={formData.effective_date}
                        onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Review Date *
                      </label>
                      <input
                        type="date"
                        value={formData.review_date}
                        onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Version</label>
                      <input
                        type="text"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="1.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Leave blank for all departments"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Applicable To</label>
                      <select
                        value={formData.applicable_to}
                        onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="all">All Employees</option>
                        <option value="specific">Specific Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Document Path</label>
                      <input
                        type="text"
                        value={formData.document_path}
                        onChange={(e) => setFormData({ ...formData, document_path: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Optional document path"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows="3"
                        placeholder="Enter policy description"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleAddPolicy}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      Add Policy
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Edit Policy Modal */}
        {
          showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                        <Edit className="text-white" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Edit HR Policy</h2>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Policy Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter policy title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Effective Date *
                      </label>
                      <input
                        type="date"
                        value={formData.effective_date}
                        onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Review Date *
                      </label>
                      <input
                        type="date"
                        value={formData.review_date}
                        onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Version</label>
                      <input
                        type="text"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="1.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Leave blank for all departments"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Applicable To</label>
                      <select
                        value={formData.applicable_to}
                        onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="all">All Employees</option>
                        <option value="specific">Specific Department</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Document Path</label>
                      <input
                        type="text"
                        value={formData.document_path}
                        onChange={(e) => setFormData({ ...formData, document_path: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Optional document path"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows="3"
                        placeholder="Enter policy description"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleUpdatePolicy}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      Update Policy
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* View Policy Modal */}
        {
          showViewModal && selectedPolicy && (
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
                        <p className="text-sm text-white text-opacity-90 mt-1">HR Policy Details</p>
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

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Category
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedPolicy.category}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Version
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedPolicy.version}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Effective Date
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {new Date(selectedPolicy.effective_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Review Date
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {new Date(selectedPolicy.review_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Department
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedPolicy.department || "All Departments"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </label>
                      <div className="mt-1">
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-semibold ${selectedPolicy.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : selectedPolicy.status === "Under Review"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {selectedPolicy.status}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Applicable To
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {selectedPolicy.applicable_to === "all" ? "All Employees" : "Specific Department"}
                      </p>
                    </div>
                  </div>

                  {selectedPolicy.description && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Description
                      </label>
                      <p className="text-gray-700 mt-2 leading-relaxed">
                        {selectedPolicy.description}
                      </p>
                    </div>
                  )}

                  {selectedPolicy.document_path && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-blue-600" />
                        Attached Document
                      </label>
                      <p className="text-sm text-gray-600">{selectedPolicy.document_path}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X size={22} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

          )}

        {/* Filter Modal */}
        {/* {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <Filter className="text-white" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Filter HR Policies</h2>
                  </div>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="All">All Statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditClick(selectedPolicy);
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Edit Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
      <DeleteHrModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={false} // Or set loading state if you have one
        policyTitle={policyToDelete?.title || ""} // safe
      />
    </DashboardLayout>
  );
}
