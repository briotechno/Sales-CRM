import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { X, FileText } from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";
import {
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Receipt,
  TrendingUp,
  Download,
  Filter,
  Edit2,
  Upload,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Client Lunch Meeting",
      amount: 1250,
      category: "Meals",
      date: "2025-11-15",
      status: "approved",
      receipt: true,
    },
    {
      id: 2,
      title: "Travel - Airport Taxi",
      amount: 450,
      category: "Travel",
      date: "2025-11-14",
      status: "pending",
      receipt: true,
    },
    {
      id: 3,
      title: "Office Supplies",
      amount: 780,
      category: "Supplies",
      date: "2025-11-13",
      status: "approved",
      receipt: false,
    },
    {
      id: 4,
      title: "Conference Registration",
      amount: 3500,
      category: "Training",
      date: "2025-11-10",
      status: "rejected",
      receipt: true,
    },
    {
      id: 5,
      title: "Software Subscription",
      amount: 999,
      category: "Software",
      date: "2025-11-08",
      status: "approved",
      receipt: true,
    },
    {
      id: 6,
      title: "Software Subscription",
      amount: 999,
      category: "Software",
      date: "2025-11-08",
      status: "approved",
      receipt: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("Today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const itemsPerPage = 5;
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Meals",
    date: new Date().toISOString().split("T")[0],
  });

  const addExpense = () => {
    if (newExpense.title && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          status: "pending",
          receipt: false,
        },
      ]);
      setNewExpense({
        title: "",
        amount: "",
        category: "Meals",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesStatus =
      filterStatus === "all" || expense.status === filterStatus;
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Meals: "🍽️",
      Travel: "✈️",
      Supplies: "📦",
      Training: "📚",
      Software: "💻",
      Other: "📋",
    };
    return icons[category] || "📋";
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedTotal = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingTotal = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-0 bg-gradient-to-br from-orange-0 via-white to-orange-100">
        {/* Header */}
        <div className="bg-white border-b ml-4">
          <div className="max-w-7xl mx-auto px-0 ml-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  My Expenses
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Expenses
                  </span>
                </p>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4 ml-auto">
                {/* Date Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-5 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="Custom">Custom</option>
                  </select>

                  {/* Show Custom Date Range Only When Selected */}
                  {filterType === "Custom" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-gray-600">to</span>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </div>

                {/* Add Expense Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto ml-6 mt-4 p-0">
          {/* Stats Cards (Receipt Based - Icon Right Side) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            {/* Total Expenses */}
            <NumberCard
              title={"Total Expenses"}
              number={`₹${totalExpenses}`}
              icon={<DollarSign className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"With Receipt"}
              number={expenses.filter((e) => e.receipt).length}
              icon={<Receipt className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"Without Receipt"}
              number={expenses.filter((e) => !e.receipt).length}
              icon={<Receipt className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
            <NumberCard
              title={"Total Entries"}
              number={expenses.length}
              icon={<Calendar className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"}
            />
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-sm shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Receipt
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentExpenses.map((expense, index) => (
                    <tr
                      key={expense.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-0"
                        }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={14} className="text-orange-500" />
                          {expense.date}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-sm">
                        {expense.title}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-800 text-sm">
                        ₹{expense.amount}
                      </td>
                      <td className="px-4 py-3">
                        {expense.receipt ? (
                          <span className="text-green-600 font-semibold flex items-center gap-1 text-xs">
                            <Receipt size={14} />
                            Yes
                          </span>
                        ) : (
                          <button className="text-orange-500 hover:text-orange-700 font-semibold flex items-center gap-1 text-xs">
                            <Upload size={14} />
                            Upload
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-[#FF7B1D] hover:opacity-80">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredExpenses.length === 0 && (
              <div className="text-center py-10">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt size={32} className="text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  No expenses found
                </h3>
                <p className="text-gray-500 text-sm">
                  Add your first expense to start tracking
                </p>
              </div>
            )}
          </div>

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
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl mx-4 relative transform transition-all animate-slideUp">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <Plus size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Add New Expense</h2>
                      <p className="text-sm text-white text-opacity-90 mt-1">
                        Record a new expense transaction
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
                  >
                    <X size={22} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Description Input */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={16} className="text-[#FF7B1D]" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newExpense.title}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, title: e.target.value })
                    }
                    placeholder="e.g., Office Supplies, Client Lunch..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  />
                </div>

                {/* Amount Input */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign size={16} className="text-[#FF7B1D]" />
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  />
                </div>

                {/* Date Input */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-[#FF7B1D]" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addExpense}
                  className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all"
                >
                  Add Expense
                </button>
              </div>
            </div>

            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes slideUp {
                from {
                  transform: translateY(20px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out;
              }

              .animate-slideUp {
                animation: slideUp 0.3s ease-out;
              }
            `}</style>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
