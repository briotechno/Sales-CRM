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
  Calendar,
  User,
  Building,
} from "lucide-react";

export default function CompanyPolicy() {
  const [activeTab, setActiveTab] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [policies, setPolicies] = useState([
    {
      id: 1,
      title: "Code of Conduct",
      category: "General",
      effectiveDate: "2024-01-15",
      reviewDate: "2025-01-15",
      version: "2.0",
      status: "Active",
      initials: "CC",
      color: "bg-blue-100 text-blue-700",
      description:
        "Guidelines for professional behavior and ethical conduct in the workplace.",
      author: "HR Department",
    },
    {
      id: 2,
      title: "Work from Home Policy",
      category: "Work Arrangements",
      effectiveDate: "2024-03-01",
      reviewDate: "2025-03-01",
      version: "1.5",
      status: "Active",
      initials: "WH",
      color: "bg-purple-100 text-purple-700",
      description:
        "Policy outlining remote work arrangements and expectations.",
      author: "Operations Team",
    },
    {
      id: 3,
      title: "Data Protection & Privacy",
      category: "Security",
      effectiveDate: "2024-02-10",
      reviewDate: "2025-02-10",
      version: "3.0",
      status: "Under Review",
      initials: "DP",
      color: "bg-green-100 text-green-700",
      description: "Comprehensive data protection and privacy guidelines.",
      author: "IT Security",
    },
    {
      id: 4,
      title: "Expense Reimbursement",
      category: "Finance",
      effectiveDate: "2023-12-01",
      reviewDate: "2024-12-01",
      version: "1.0",
      status: "Active",
      initials: "ER",
      color: "bg-orange-100 text-orange-700",
      description:
        "Guidelines for submitting and approving expense reimbursements.",
      author: "Finance Department",
    },
    {
      id: 5,
      title: "Equal Employment Opportunity",
      category: "HR",
      effectiveDate: "2024-01-01",
      reviewDate: "2025-01-01",
      version: "2.1",
      status: "Archived",
      initials: "EE",
      color: "bg-pink-100 text-pink-700",
      description: "Policy ensuring equal opportunity for all employees.",
      author: "HR Department",
    },
  ]);

  const [newPolicy, setNewPolicy] = useState({
    title: "",
    category: "General",
    effectiveDate: "",
    reviewDate: "",
    version: "1.0",
    description: "",
    author: "",
  });

  const categories = [
    "General",
    "Work Arrangements",
    "Security",
    "Finance",
    "HR",
  ];
  const statuses = ["Active", "Under Review", "Archived"];

  const getStats = () => {
    return {
      total: policies.length,
      active: policies.filter((p) => p.status === "Active").length,
      underReview: policies.filter((p) => p.status === "Under Review").length,
      archived: policies.filter((p) => p.status === "Archived").length,
    };
  };

  const stats = getStats();

  const handleAddPolicy = () => {
    if (!newPolicy.title || !newPolicy.effectiveDate || !newPolicy.reviewDate) {
      alert("Please fill in all required fields");
      return;
    }

    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-green-100 text-green-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ];

    const initials = newPolicy.title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const policy = {
      ...newPolicy,
      id: policies.length + 1,
      initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      status: "Under Review",
    };

    setPolicies([...policies, policy]);
    setNewPolicy({
      title: "",
      category: "General",
      effectiveDate: "",
      reviewDate: "",
      version: "1.0",
      description: "",
      author: "",
    });
    setShowAddModal(false);
  };

  const handleApprove = (id) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, status: "Active" } : p))
    );
  };

  const handleReject = (id) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, status: "Archived" } : p))
    );
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setShowViewModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Policy Title",
        "Category",
        "Effective Date",
        "Review Date",
        "Version",
        "Status",
        "Author",
      ],
      ...filteredPolicies.map((p) => [
        p.title,
        p.category,
        p.effectiveDate,
        p.reviewDate,
        p.version,
        p.status,
        p.author,
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

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilterCategory("All");
    setFilterStatus("All");
  };

  const filteredPolicies = policies
    .filter((p) => activeTab === "All" || p.status === activeTab)
    .filter((p) => filterCategory === "All" || p.category === filterCategory)
    .filter((p) => filterStatus === "All" || p.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="min-h-screen  ml-6 p-0">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Left side: Title & Breadcrumb */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Company Policy
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <FiHome className="text-gray-700 text-sm" />
                <span className="text-gray-400">HRM /</span>
                <span className="text-[#FF7B1D] font-medium">
                  All Company Policy
                </span>
              </p>
            </div>

            {/* Right side: Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-sm font-medium border border-gray-300 transition-colors"
              >
                <Filter size={18} />
                Filter
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-sm font-medium border border-gray-300 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="mr-6 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700  text-white px-5 py-2.5 rounded-sm font-medium transition-colors"
              >
                <Plus size={18} />
                Add Policy
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 mt-4 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-sm shadow-sm border-l-4 border-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Policies
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-500 p-4 rounded-lg">
                <FileText className="text-white" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm border-l-4 border-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Active</p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
              <div className="bg-yellow-500 p-4 rounded-sm">
                <FileText className="text-white" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm border-l-4 border-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Under Review
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.underReview}
                </p>
              </div>
              <div className="bg-green-500 p-4 rounded-lg">
                <FileText className="text-white" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm border-l-4 border-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Archived
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.archived}
                </p>
              </div>
              <div className="bg-red-500 p-4 rounded-lg">
                <FileText className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-200">
          {["All", "Active", "Under Review", "Archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium transition-colors ${
                activeTab === tab
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
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
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Review Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Version
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full ${policy.color} flex items-center justify-center font-semibold text-sm`}
                        >
                          {policy.initials}
                        </div>
                        <span className="font-medium text-gray-900">
                          {policy.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {policy.category}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {policy.effectiveDate}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {policy.reviewDate}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {policy.version}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                          policy.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : policy.status === "Under Review"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {policy.status === "Under Review" ? (
                          <>
                            <button
                              onClick={() => handleApprove(policy.id)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(policy.id)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleView(policy)}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No policies found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Policy Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl">
              {/* Modal Header with gradient */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                      <Plus className="text-white" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Add New Policy
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

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Policy Title *
                    </label>
                    <input
                      type="text"
                      value={newPolicy.title}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter policy title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newPolicy.category}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, category: e.target.value })
                      }
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
                      value={newPolicy.effectiveDate}
                      onChange={(e) =>
                        setNewPolicy({
                          ...newPolicy,
                          effectiveDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Review Date *
                    </label>
                    <input
                      type="date"
                      value={newPolicy.reviewDate}
                      onChange={(e) =>
                        setNewPolicy({
                          ...newPolicy,
                          reviewDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Version
                    </label>
                    <input
                      type="text"
                      value={newPolicy.version}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, version: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={newPolicy.author}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, author: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Department or author name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newPolicy.description}
                      onChange={(e) =>
                        setNewPolicy({
                          ...newPolicy,
                          description: e.target.value,
                        })
                      }
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
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <Filter className="text-white" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Filter Policies
                    </h2>
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
                    onClick={resetFilters}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-sm font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Policy Modal */}
        {showViewModal && selectedPolicy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-full ${selectedPolicy.color} flex items-center justify-center font-bold text-lg border-4 border-white`}
                    >
                      {selectedPolicy.initials}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedPolicy.title}
                      </h2>
                      <p className="text-orange-100">
                        Version {selectedPolicy.version}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-sm border border-blue-200">
                    <p className="text-sm text-blue-600 font-semibold mb-1">
                      Category
                    </p>
                    <p className="font-bold text-gray-900">
                      {selectedPolicy.category}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-sm border border-purple-200">
                    <p className="text-sm text-purple-600 font-semibold mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedPolicy.status === "Active"
                          ? "bg-green-500 text-white"
                          : selectedPolicy.status === "Under Review"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {selectedPolicy.status}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-sm border border-green-200">
                    <p className="text-sm text-green-600 font-semibold mb-1">
                      Effective Date
                    </p>
                    <p className="font-bold text-gray-900">
                      {selectedPolicy.effectiveDate}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-sm border border-orange-200">
                    <p className="text-sm text-orange-600 font-semibold mb-1">
                      Review Date
                    </p>
                    <p className="font-bold text-gray-900">
                      {selectedPolicy.reviewDate}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-sm border border-pink-200 mb-4">
                  <p className="text-sm text-pink-600 font-semibold mb-1">
                    Author
                  </p>
                  <p className="font-bold text-gray-900">
                    {selectedPolicy.author}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-sm border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Description
                  </p>
                  <p className="text-gray-900 leading-relaxed">
                    {selectedPolicy.description}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
