import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  User,
  X,
  Upload,
  CheckCircle,
  Home,
  ChevronDown,
} from "lucide-react";

// Policy Detail View Modal
function PolicyDetailModal({ isOpen, onClose, policy, onEdit }) {
  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-0 ml-6 z-50">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] text-white px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{policy.policyTitle}</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  Policy Details & Information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {policy.category}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Version
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {policy.version}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Effective Date
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {policy.effectiveDate}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Review Date
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {policy.reviewDate}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Department
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {policy.department || "All Departments"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </label>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 rounded-md text-sm font-semibold ${
                    policy.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : policy.status === "Under Review"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {policy.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Description
            </label>
            <p className="text-gray-700 mt-2 leading-relaxed">
              {policy.description}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Applicable To
            </label>
            <p className="text-gray-700 mt-2">
              {policy.applicableTo === "all"
                ? "All Employees"
                : "Specific Department"}
            </p>
          </div>

          {policy.document && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FileText size={16} className="text-blue-600" />
                Attached Document
              </label>
              <p className="text-sm text-gray-600">{policy.document}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-lg transition-all"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(policy);
              onClose();
            }}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] hover:from-[#FF8C2D] hover:to-[#FFAA5D] rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Edit Policy
          </button>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Policy Modal
function PolicyModal({ isOpen, onClose, policy = null, onSave }) {
  const [formData, setFormData] = useState({
    policyTitle: policy?.policyTitle || "",
    category: policy?.category || "",
    description: policy?.description || "",
    effectiveDate: policy?.effectiveDate || "",
    reviewDate: policy?.reviewDate || "",
    version: policy?.version || "1.0",
    department: policy?.department || "",
    applicableTo: policy?.applicableTo || "all",
    status: policy?.status || "Active",
    document: policy?.document || null,
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.policyTitle.trim())
      newErrors.policyTitle = "Policy title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.effectiveDate)
      newErrors.effectiveDate = "Effective date is required";
    if (!formData.reviewDate) newErrors.reviewDate = "Review date is required";
    if (!formData.version.trim()) newErrors.version = "Version is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const policyData = {
      ...formData,
      id: policy?.id || Date.now(),
      initials: formData.policyTitle
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
      bgColor:
        policy?.bgColor ||
        [
          "bg-blue-100",
          "bg-purple-100",
          "bg-green-100",
          "bg-yellow-100",
          "bg-pink-100",
        ][Math.floor(Math.random() * 5)],
      textColor:
        policy?.textColor ||
        [
          "text-blue-600",
          "text-purple-600",
          "text-green-600",
          "text-yellow-600",
          "text-pink-600",
        ][Math.floor(Math.random() * 5)],
    };

    onSave(policyData);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file.name });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-0 ml-0 z-50">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] text-white px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {policy ? "Edit HR Policy" : "Add New HR Policy"}
                </h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  {policy
                    ? "Update policy details"
                    : "Create a new HR policy for your organization"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-[#FF7B1D]" />
              Policy Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter policy title"
              className={`w-full px-4 py-3 border-2 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all ${
                errors.policyTitle ? "border-red-500" : "border-gray-200"
              }`}
              value={formData.policyTitle}
              onChange={(e) =>
                setFormData({ ...formData, policyTitle: e.target.value })
              }
            />
            {errors.policyTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.policyTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Filter size={16} className="text-[#FF7B1D]" />
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 border-2 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all ${
                  errors.category ? "border-red-500" : "border-gray-200"
                }`}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <option value="Attendance">Attendance</option>
                <option value="Leave Policy">Leave Policy</option>
                <option value="Code of Conduct">Code of Conduct</option>
                <option value="Compensation & Benefits">
                  Compensation & Benefits
                </option>
                <option value="Health & Safety">Health & Safety</option>
                <option value="Performance Management">
                  Performance Management
                </option>
                <option value="Recruitment">Recruitment</option>
                <option value="Training & Development">
                  Training & Development
                </option>
                <option value="Employee Relations">Employee Relations</option>
                <option value="Data Privacy">Data Privacy</option>
                <option value="Remote Work">Remote Work</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={16} className="text-[#FF7B1D]" />
                Version <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 1.0"
                className={`w-full px-4 py-3 border-2 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all ${
                  errors.version ? "border-red-500" : "border-gray-200"
                }`}
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
              />
              {errors.version && (
                <p className="text-red-500 text-xs mt-1">{errors.version}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-[#FF7B1D]" />
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter policy description"
              rows="4"
              className={`w-full px-4 py-3 border-2 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none ${
                errors.description ? "border-red-500" : "border-gray-200"
              }`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="text-[#FF7B1D]" />
                Effective Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 border-2 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all ${
                  errors.effectiveDate ? "border-red-500" : "border-gray-200"
                }`}
                value={formData.effectiveDate}
                onChange={(e) =>
                  setFormData({ ...formData, effectiveDate: e.target.value })
                }
              />
              {errors.effectiveDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.effectiveDate}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="text-[#FF7B1D]" />
                Review Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 border-2 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all ${
                  errors.reviewDate ? "border-red-500" : "border-gray-200"
                }`}
                value={formData.reviewDate}
                onChange={(e) =>
                  setFormData({ ...formData, reviewDate: e.target.value })
                }
              />
              {errors.reviewDate && (
                <p className="text-red-500 text-xs mt-1">{errors.reviewDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={16} className="text-[#FF7B1D]" />
              Department
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              <option value="">All Departments</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Engineering">Engineering</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          <div className="bg-orange-50 p-4 rounded-sm border border-orange-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <User size={16} className="text-[#FF7B1D]" />
              Applicable To
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="all"
                  checked={formData.applicableTo === "all"}
                  onChange={(e) =>
                    setFormData({ ...formData, applicableTo: e.target.value })
                  }
                  className="w-4 h-4 text-[#FF7B1D] focus:ring-[#FF7B1D]"
                />
                <span className="ml-2 text-sm font-medium text-gray-800">
                  All Employees
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="specific"
                  checked={formData.applicableTo === "specific"}
                  onChange={(e) =>
                    setFormData({ ...formData, applicableTo: e.target.value })
                  }
                  className="w-4 h-4 text-[#FF7B1D] focus:ring-[#FF7B1D]"
                />
                <span className="ml-2 text-sm font-medium text-gray-800">
                  Specific Department
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CheckCircle size={16} className="text-[#FF7B1D]" />
              Status <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Upload size={16} className="text-[#FF7B1D]" />
              Upload Policy Document
            </label>
            <label className="border-2 border-dashed border-gray-300 rounded-sm p-6 text-center hover:border-[#FF7B1D] transition-all cursor-pointer block">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {formData.document
                  ? formData.document
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX (max 10MB)</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] hover:from-[#FF8C2D] hover:to-[#FFAA5D] rounded-sm shadow-md hover:shadow-lg transition-all"
          >
            {policy ? "Update Policy" : "Add Policy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main HR Policy Page
export default function HRPolicyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [policies, setPolicies] = useState([
    {
      id: 1,
      policyTitle: "Attendance Policy",
      category: "Attendance",
      description:
        "Policy regarding employee attendance and punctuality. This policy outlines expectations for on-time arrival, proper notification procedures for absences, and consequences for repeated tardiness.",
      effectiveDate: "2024-01-15",
      reviewDate: "2025-01-15",
      version: "2.0",
      status: "Active",
      department: "Human Resources",
      applicableTo: "all",
      initials: "AP",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      document: "Attendance_Policy_v2.0.pdf",
    },
    {
      id: 2,
      policyTitle: "Leave Management Policy",
      category: "Leave Policy",
      description:
        "Guidelines for various types of leaves and application process including annual leave, sick leave, parental leave, and emergency leave procedures.",
      effectiveDate: "2024-02-10",
      reviewDate: "2025-02-10",
      version: "1.5",
      status: "Active",
      department: "",
      applicableTo: "all",
      initials: "LM",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      document: "Leave_Management_Policy_v1.5.pdf",
    },
    {
      id: 3,
      policyTitle: "Employee Code of Conduct",
      category: "Code of Conduct",
      description:
        "Professional behavior and ethical guidelines for all employees including dress code, workplace conduct, conflict of interest policies, and anti-discrimination standards.",
      effectiveDate: "2024-03-01",
      reviewDate: "2025-03-01",
      version: "3.0",
      status: "Active",
      department: "",
      applicableTo: "all",
      initials: "EC",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      document: "Code_of_Conduct_v3.0.pdf",
    },
    {
      id: 4,
      policyTitle: "Performance Appraisal Policy",
      category: "Performance Management",
      description:
        "Employee performance evaluation and review procedures including quarterly reviews, annual appraisals, goal setting frameworks, and feedback mechanisms.",
      effectiveDate: "2024-04-20",
      reviewDate: "2025-04-20",
      version: "1.0",
      status: "Under Review",
      department: "Human Resources",
      applicableTo: "all",
      initials: "PA",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      document: "Performance_Appraisal_v1.0.pdf",
    },
    {
      id: 5,
      policyTitle: "Old Benefits Policy",
      category: "Compensation & Benefits",
      description:
        "Archived employee benefits and compensation policy that was in effect prior to the 2024 benefits restructure.",
      effectiveDate: "2023-01-01",
      reviewDate: "2024-01-01",
      version: "1.0",
      status: "Archived",
      department: "Finance",
      applicableTo: "all",
      initials: "BP",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      document: "Benefits_Policy_Archive_v1.0.pdf",
    },
    {
      id: 6,
      policyTitle: "Remote Work Policy",
      category: "Remote Work",
      description:
        "Guidelines for remote and hybrid work arrangements including eligibility, equipment provision, communication expectations, and performance monitoring.",
      effectiveDate: "2024-05-01",
      reviewDate: "2025-05-01",
      version: "2.1",
      status: "Active",
      department: "",
      applicableTo: "all",
      initials: "RW",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      document: "Remote_Work_Policy_v2.1.pdf",
    },
  ]);

  const handleSavePolicy = (policyData) => {
    if (selectedPolicy) {
      setPolicies(
        policies.map((p) => (p.id === selectedPolicy.id ? policyData : p))
      );
    } else {
      setPolicies([...policies, policyData]);
    }
    setSelectedPolicy(null);
  };

  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this policy? This action cannot be undone."
      )
    ) {
      setPolicies(policies.filter((p) => p.id !== id));
    }
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-700",
      "Under Review": "bg-yellow-100 text-yellow-700",
      Archived: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-md text-xs font-semibold ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "active"
        ? policy.status === "Active"
        : activeTab === "review"
        ? policy.status === "Under Review"
        : activeTab === "archived"
        ? policy.status === "Archived"
        : true;

    const matchesSearch =
      policy.policyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !filterCategory || policy.category === filterCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const stats = {
    total: policies.length,
    active: policies.filter((p) => p.status === "Active").length,
    review: policies.filter((p) => p.status === "Under Review").length,
    archived: policies.filter((p) => p.status === "Archived").length,
  };

  const categories = [...new Set(policies.map((p) => p.category))];

  const exportToCSV = () => {
    const headers = [
      "Policy Title",
      "Category",
      "Effective Date",
      "Review Date",
      "Version",
      "Status",
      "Department",
    ];
    const rows = filteredPolicies.map((p) => [
      p.policyTitle,
      p.category,
      p.effectiveDate,
      p.reviewDate,
      p.version,
      p.status,
      p.department || "All Departments",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hr-policies-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6 ">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-6 py-3">
            <div className="flex items-center gap-2 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                  HR Policy Management
                </h1>

                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All HR Policy
                  </span>
                </p>
              </div>
              <div className="flex justify-end items-center gap-3 w-full">
                <div className="flex gap-3">
                  {/* Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      <Filter size={20} />
                      Filter
                      <ChevronDown size={16} />
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-sm shadow-sm border border-gray-200 z-10">
                        <div className="p-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Filter by Category
                          </label>

                          <select
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none"
                            value={filterCategory}
                            onChange={(e) => {
                              setFilterCategory(e.target.value);
                              setShowFilterDropdown(false);
                            }}
                          >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>

                          {filterCategory && (
                            <button
                              onClick={() => {
                                setFilterCategory("");
                                setShowFilterDropdown(false);
                              }}
                              className="mt-2 w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-sm text-sm font-semibold hover:bg-gray-200 transition-all"
                            >
                              Clear Filter
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Export */}
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    <Download size={20} />
                    Export
                  </button>

                  {/* Add Policy */}
                  <button
                    onClick={() => {
                      setSelectedPolicy(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                  >
                    <Plus size={20} />
                    Add Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-0 py-0 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-sm shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Total Policies
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-blue-500 p-4 rounded-lg">
                  <FileText size={32} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Active
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-green-500 p-4 rounded-lg">
                  <CheckCircle size={32} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Under Review
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.review}
                  </p>
                </div>
                <div className="bg-yellow-500 p-4 rounded-sm">
                  <Calendar size={32} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Archived
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.archived}
                  </p>
                </div>
                <div className="bg-red-500 p-4 rounded-sm">
                  <Trash2 size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-0 pb-2">
          <div className="bg-white rounded-sm shadow-sm p-4">
            {/* Active Filters Display */}
            {(searchQuery || filterCategory) && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-gray-600">
                  Active Filters:
                </span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filterCategory && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    Category: {filterCategory}
                    <button
                      onClick={() => setFilterCategory("")}
                      className="hover:text-purple-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "all"
                    ? "text-[#FF7B1D] border-b-4 border-[#FF7B1D] -mb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({policies.length})
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "active"
                    ? "text-[#FF7B1D] border-b-4 border-[#FF7B1D] -mb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "review"
                    ? "text-[#FF7B1D] border-b-4 border-[#FF7B1D] -mb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Under Review ({stats.review})
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "archived"
                    ? "text-[#FF7B1D] border-b-4 border-[#FF7B1D] -mb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Archived ({stats.archived})
              </button>
            </div>
          </div>
        </div>

        {/* Policy Table */}
        <div className="px-0 pb-6">
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No policies found
                </h3>
                <p className="text-gray-500">
                  {searchQuery || filterCategory
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first HR policy"}
                </p>
                {!searchQuery && !filterCategory && (
                  <button
                    onClick={() => {
                      setSelectedPolicy(null);
                      setIsModalOpen(true);
                    }}
                    className="mt-4 px-6 py-2.5 bg-[#FF7B1D] text-white rounded-sm font-semibold hover:bg-[#FF8C2D] transition-all"
                  >
                    Add Your First Policy
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-sm shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Policy Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Effective Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Review Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Version
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredPolicies.map((policy, index) => (
                      <tr
                        key={policy.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-00"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`${policy.bgColor} ${policy.textColor} w-12 h-12 rounded-sm flex items-center justify-center font-bold text-sm flex-shrink-0`}
                            >
                              {policy.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {policy.policyTitle}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {policy.department || "All Departments"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1  text-gray-700 rounded text-sm font-medium">
                            {policy.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {policy.effectiveDate}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {policy.reviewDate}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1  text-blue-700 rounded text-sm font-semibold">
                            v{policy.version}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(policy.status)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(policy)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(policy)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                              title="Edit Policy"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(policy.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                              title="Delete Policy"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <PolicyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPolicy(null);
          }}
          policy={selectedPolicy}
          onSave={handleSavePolicy}
        />

        <PolicyDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedPolicy(null);
          }}
          policy={selectedPolicy}
          onEdit={handleEdit}
        />
      </div>
    </DashboardLayout>
  );
}
