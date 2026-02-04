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
  Tags,
  Calendar,
  Layers,
  CheckCircle,
  Briefcase,
  Upload,
  AlignLeft,
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const today = new Date().toISOString().split('T')[0];
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const { data: allPoliciesDataForCheck } = useGetHRPoliciesQuery({
    category: "All",
    status: "All",
    search: "",
    department: "All",
  });
  const allPolicies = allPoliciesDataForCheck || [];

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
    author: "",
    documents: [],
  });

  const { user } = useSelector((state) => state.auth);

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
  } = useGetHRPoliciesQuery({
    category: filterCategory,
    status: filterStatus,
    search: searchTerm,
    department: filterDepartment,
    author: filterAuthor,
    startDate: startDate,
    endDate: endDate,
  });

  const [createPolicy] = useCreateHRPolicyMutation();
  const [updatePolicy] = useUpdateHRPolicyMutation();
  const [deletePolicy] = useDeleteHRPolicyMutation();

  const categories = [
    "Leave & Holidays",
    "Attendance & Work Hours",
    "Compensation & Payroll",
    "Benefits & Perks",
    "Performance Management",
    "Code of Conduct",
    "Workplace Ethics",
    "Disciplinary Action",
    "Grievance & Complaint Handling",
    "Health, Safety & Wellness",
    "Remote Work / Work From Home",
    "Overtime & Shift Policy",
    "Travel & Expense Reimbursement",
    "Employee Onboarding",
    "Training & Development",
    "Promotion & Career Growth",
    "Exit & Termination",
    "IT & Data Security",
    "Confidentiality & NDA",
    "Anti-Harassment & POSH",
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

  // Filter policies based on status
  const filteredPolicies = policiesData || [];

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
      author: user ? (user.firstName ? `${user.firstName} ${user.lastName}` : user.email) : "",
      documents: [],
    });
    setIsUpdatingExisting(false);
    setExistingId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
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
        effective_date: existing.effective_date ? new Date(existing.effective_date).toISOString().split('T')[0] : "",
        review_date: existing.review_date ? new Date(existing.review_date).toISOString().split('T')[0] : "",
        version: incrementVersion(existing.version),
        department: existing.department || "",
        applicable_to: existing.applicable_to || "all",
        status: existing.status || "Active",
        documents: [],
        existingDocuments: existing.documents || [],
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
        department: "",
        applicable_to: "all",
        status: "Active",
        documents: [],
      });
      setIsUpdatingExisting(false);
      setExistingId(null);
    }
  };

  const handleAddPolicy = async () => {
    if (!formData.title || !formData.effective_date || !formData.review_date || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.applicable_to === "specific" && !formData.department) {
      toast.error("Please select a department");
      return;
    }

    try {
      const fData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'documents' && key !== 'existingDocuments') {
          fData.append(key, formData[key]);
        }
      });

      formData.documents.forEach(file => {
        fData.append('documents', file);
      });

      if (isUpdatingExisting && existingId) {
        await updatePolicy({ id: existingId, formData: fData }).unwrap();
        toast.success("HR Policy updated with new version successfully");
      } else {
        await createPolicy(fData).unwrap();
        toast.success("HR Policy created successfully");
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to process HR policy");
    }
  };

  const handleEditClick = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      title: policy.title,
      category: policy.category,
      description: policy.description || "",
      effective_date: policy.effective_date ? new Date(policy.effective_date).toISOString().split('T')[0] : "",
      review_date: policy.review_date ? new Date(policy.review_date).toISOString().split('T')[0] : "",
      version: policy.version,
      department: policy.department || "",
      applicable_to: policy.applicable_to || "all",
      status: policy.status,
      documents: [],
      existingDocuments: policy.documents || [],
    });
    setShowEditModal(true);
  };

  const handleUpdatePolicy = async () => {
    if (!formData.title || !formData.effective_date || !formData.review_date || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.applicable_to === "specific" && !formData.department) {
      toast.error("Please select a department");
      return;
    }

    try {
      const fData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'documents') {
          fData.append(key, formData[key]);
        }
      });

      formData.documents.forEach(file => {
        fData.append('documents', file);
      });

      await updatePolicy({ id: selectedPolicy.id, formData: fData }).unwrap();
      toast.success("HR Policy updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedPolicy(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update HR policy");
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
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("HR Policies Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add date
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableColumn = ["Policy Title", "Category", "Effective Date", "Review Date", "Version", "Status", "Department"];
    const tableRows = [];

    filteredPolicies.forEach(p => {
      const policyData = [
        p.title,
        p.category,
        new Date(p.effective_date).toLocaleDateString(),
        new Date(p.review_date).toLocaleDateString(),
        p.version,
        p.status,
        p.department || "All Departments"
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

    doc.save("hr_policies.pdf");
  };

  const handleClearFilters = () => {
    setFilterCategory("All");
    setFilterStatus("All");
    setFilterDepartment("All");
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
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">HR Policy</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All HR Policy
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (filterCategory !== "All" || filterStatus !== "All" || filterDepartment !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== "") {
                        handleClearFilters();
                      } else {
                        setShowFilters(!showFilters);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${showFilters || filterCategory !== "All" || filterStatus !== "All" || filterDepartment !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== ""
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {filterCategory !== "All" || filterStatus !== "All" || filterDepartment !== "All" || filterAuthor !== "" || startDate !== "" || endDate !== "" ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-[450px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Filter Options</span>
                        <button
                          onClick={handleClearFilters}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset all
                        </button>
                      </div>

                      <div className="p-5 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6">
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

                          {/* Filters Top Right */}
                          <div className="space-y-4">
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Quick Filters</span>
                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Department</label>
                                <select
                                  value={filterDepartment}
                                  onChange={(e) => setFilterDepartment(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                                >
                                  <option value="All">All Departments</option>
                                  {departments.map((dept) => (
                                    <option key={dept.id} value={dept.department_name}>{dept.department_name}</option>
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
                        </div>

                        {/* Category Section */}
                        <div className="pt-2 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Policy Category</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white flex items-center justify-between"
                            >
                              <span>{filterCategory === "All" ? "All Categories" : filterCategory}</span>
                              <svg className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {showCategoryDropdown && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFilterCategory("All");
                                    setShowCategoryDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${filterCategory === "All" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                  All Categories
                                </button>
                                {categories.map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                      setFilterCategory(cat);
                                      setShowCategoryDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${filterCategory === cat ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date Range Section */}
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2">Effective Date Range</span>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-orange-500 bg-gray-50 hover:bg-white"
                              />
                              <span className="absolute -top-2 left-2 bg-white px-1 text-[9px] text-gray-400 font-bold uppercase">From</span>
                            </div>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-orange-500 bg-gray-50 hover:bg-white"
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
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-bold"
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

          {/* Table */}
          <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Policy Title</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[12%]">Category</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[12%]">Effective Date</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[12%]">Review Date</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[12%]">Department</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[8%]">Version</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[10%]">Status</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 w-[12%]">Actions</th>
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
                    <td colSpan="8" className="px-6 py-12 text-center text-red-500">
                      Error loading HR policies
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
                      <td className="py-3 px-4 text-gray-700 font-medium text-sm">{policy.department || "All Departments"}</td>
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
                        <div className="flex justify-end gap-2 text-right">
                          {read && (
                            <button
                              onClick={() => handleView(policy)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all font-medium"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => handleEditClick(policy)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all font-medium"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => handleDeleteClick(policy)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all font-medium"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No HR policies found matching the current filters
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
          {
            showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                          <Plus className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                          {isUpdatingExisting ? "Update HR Policy (New Version)" : "Add New HR Policy"}
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

                  <div className="p-6 font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-[#FF7B1D]" /> Policy Title <span className="text-red-500">*</span>
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
                          <Tags size={16} className="text-[#FF7B1D]" /> Category <span className="text-red-500">*</span>
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
                          <Calendar size={16} className="text-[#FF7B1D]" /> Effective Date <span className="text-red-500">*</span>
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
                          <Calendar size={16} className="text-[#FF7B1D]" /> Review Date <span className="text-red-500">*</span>
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
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <CheckCircle size={16} className="text-[#FF7B1D]" /> Applicable To
                        </label>
                        <select
                          value={formData.applicable_to}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              applicable_to: val,
                              department: val === 'all' ? '' : formData.department
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                        >
                          <option value="all">All Employees</option>
                          <option value="specific">Specific Department</option>
                        </select>
                      </div>

                      {formData.applicable_to === 'specific' && (
                        <div className="animate-fadeIn">
                          <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <Briefcase size={16} className="text-[#FF7B1D]" /> Select Department <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                          >
                            <option value="">Choose Department</option>
                            {departments.map((dep) => (
                              <option key={dep.id} value={dep.department_name}>
                                {dep.department_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="col-span-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Upload size={16} className="text-[#FF7B1D]" /> Upload Documents
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-sm p-4 hover:border-orange-500 transition-colors bg-gray-50">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            id="policy-docs"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                          />
                          <label htmlFor="policy-docs" className="flex flex-col items-center cursor-pointer">
                            <Plus className="text-gray-400 mb-2" size={24} />
                            <span className="text-sm text-gray-500 font-medium">Click to upload multiple documents</span>
                            <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, TXT (Max 10MB)</span>
                          </label>
                        </div>

                        {formData.documents.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {formData.documents.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-sm border border-orange-200 text-xs font-semibold">
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(idx)} className="hover:text-red-500">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <AlignLeft size={16} className="text-[#FF7B1D]" /> Description <span className="text-red-500">*</span>
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
                        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all font-sans"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddPolicy}
                        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all disabled:opacity-50 font-sans"
                      >
                        {isUpdatingExisting ? "Update Existing Policy" : "Add Policy"}
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
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
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

                  <div className="p-6 font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-[#FF7B1D]" /> Policy Title
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
                          <Tags size={16} className="text-[#FF7B1D]" /> Category
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
                          <Calendar size={16} className="text-[#FF7B1D]" /> Effective Date
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
                          <Calendar size={16} className="text-[#FF7B1D]" /> Review Date
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
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <CheckCircle size={16} className="text-[#FF7B1D]" /> Applicable To
                        </label>
                        <select
                          value={formData.applicable_to}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              applicable_to: val,
                              department: val === 'all' ? '' : formData.department
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                        >
                          <option value="all">All Employees</option>
                          <option value="specific">Specific Department</option>
                        </select>
                      </div>

                      {formData.applicable_to === 'specific' && (
                        <div className="animate-fadeIn">
                          <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <Briefcase size={16} className="text-[#FF7B1D]" /> Select Department <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
                          >
                            <option value="">Choose Department</option>
                            {departments.map((dep) => (
                              <option key={dep.id} value={dep.department_name}>
                                {dep.department_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="col-span-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-[#FF7B1D]" /> Existing Documents
                        </label>
                        {formData.existingDocuments && formData.existingDocuments.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.existingDocuments.map((doc, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-sm border border-blue-200 text-xs font-semibold">
                                <FileText size={14} />
                                <span className="max-w-[200px] truncate">Document {idx + 1}</span>
                                <a
                                  href={`${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${doc}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-900 ml-1"
                                >
                                  <Eye size={14} />
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic mb-4">No documents uploaded yet.</p>
                        )}

                        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Upload size={16} className="text-[#FF7B1D]" /> Upload New Documents
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-sm p-4 hover:border-orange-500 transition-colors bg-gray-50">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            id="edit-policy-docs"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                          />
                          <label htmlFor="edit-policy-docs" className="flex flex-col items-center cursor-pointer">
                            <Plus className="text-gray-400 mb-2" size={24} />
                            <span className="text-sm text-gray-500 font-medium">Click to upload more documents</span>
                            <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, TXT (Max 10MB)</span>
                          </label>
                        </div>

                        {formData.documents.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {formData.documents.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-sm border border-orange-200 text-xs font-semibold">
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(idx)} className="hover:text-red-500">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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
                        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all font-sans"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdatePolicy}
                        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all disabled:opacity-50 font-sans"
                      >
                        Update Policy
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

                  <div className="p-6 space-y-8 font-sans">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                          <Tags size={20} />
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
                          {selectedPolicy.status === "Active" ? <CheckCircle size={20} /> : <X size={20} />}
                        </div>
                        <span className={`text-lg font-bold ${selectedPolicy.status === "Active" ? "text-green-900" : "text-red-900"}`}>
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

                    {selectedPolicy.documents && selectedPolicy.documents.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-sm border border-blue-200">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                          <FileText size={16} className="text-blue-600" />
                          Attached Documents ({selectedPolicy.documents.length})
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedPolicy.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={`${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-white rounded-sm border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all group"
                            >
                              <div className="bg-blue-100 p-2 rounded-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Download size={16} />
                              </div>
                              <span className="text-sm text-gray-600 font-medium truncate">
                                Document {idx + 1}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                      <button
                        onClick={() => setShowViewModal(false)}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all shadow-sm font-sans"
                      >
                        Close Details
                      </button>
                    </div>
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

          <DeleteHrModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            isLoading={false} // Or set loading state if you have one
            policyTitle={policyToDelete?.title || ""} // safe
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
