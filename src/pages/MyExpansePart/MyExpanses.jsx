import React, { useState, useRef, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { Search, Eye, Filter } from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";
import {
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Receipt,
  Edit2,
  X
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import { useGetExpensesQuery } from "../../store/api/expenseApi";
import AddExpenseModal from "../../components/Expense/AddExpenseModal";
import EditExpenseModal from "../../components/Expense/EditExpenseModal";
import ViewExpenseModal from "../../components/Expense/ViewExpenseModal";
import DeleteExpenseModal from "../../components/Expense/DeleteExpenseModal";

export default function ExpensePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const dateDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const itemsPerPage = 7;

  // Date Filter Logic
  const getDateRange = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    let dateFrom = "";
    let dateTo = "";

    if (dateFilter === "Today") {
      dateFrom = formatDate(today);
      dateTo = formatDate(today);
    } else if (dateFilter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateFrom = formatDate(yesterday);
      dateTo = formatDate(yesterday);
    } else if (dateFilter === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 7);
      dateFrom = formatDate(last7);
      dateTo = formatDate(today);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFrom = formatDate(firstDay);
      dateTo = formatDate(today);
    } else if (dateFilter === "Custom") {
      dateFrom = customStart;
      dateTo = customEnd;
    }
    return { dateFrom, dateTo };
  };

  const { dateFrom, dateTo } = getDateRange();

  const { data, isLoading } = useGetExpensesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    category: categoryFilter !== "All" ? categoryFilter : undefined,
    dateFrom,
    dateTo
  });

  const expenses = data?.expenses || [];
  const summary = data?.summary || {};
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateFilterOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setSearchTerm("");
    setDateFilter("All");
    setCategoryFilter("All");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || dateFilter !== "All" || categoryFilter !== "All";

  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleDelete = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-100">
        {/* Header */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Side */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  My Expenses
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Expenses
                  </span>
                </p>
              </div>

              {/* Right Side */}
              <div className="flex flex-wrap items-center gap-3">

                {/* Category Filter Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isCategoryFilterOpen || categoryFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isCategoryFilterOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Meals", "Travel", "Supplies", "Training", "Software", "Other"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setCategoryFilter(option);
                              setIsCategoryFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${categoryFilter === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Date Filter Dropdown */}
                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isDateFilterOpen || dateFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                  </button>

                  {isDateFilterOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setDateFilter(option);
                              setIsDateFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Show Custom Date Range Only When Selected */}
                {dateFilter === "Custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                    <span className="text-gray-400 text-xs font-bold">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                  </div>
                )}


                {/* Add Expense Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">
          {/* Stats Cards (Dynamic) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <NumberCard
              title={"Total Expenses"}
              number={`₹${(summary.totalAmount || 0).toLocaleString("en-IN")}`}
              icon={<DollarSign className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"With Receipt"}
              number={(summary.receiptCount || 0).toLocaleString()}
              icon={<Receipt className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"Without Receipt"}
              number={(summary.noReceiptCount || 0).toLocaleString()}
              icon={<Receipt className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
            <NumberCard
              title={"Total Entries"}
              number={(summary.totalCount || 0).toLocaleString()}
              icon={<Calendar className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"}
            />
          </div>

          {/* Clear Filters Banner */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between bg-orange-50 border border-orange-200 rounded-sm p-3 gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-orange-600" size={16} />
                <span className="text-sm font-bold text-orange-800 uppercase">
                  ACTIVE FILTERS:
                </span>
                {searchTerm && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Search: "{searchTerm}"</span>}
                {dateFilter !== "All" && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Date: {dateFilter}</span>}
                {categoryFilter !== "All" && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Category: {categoryFilter}</span>}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-300 text-orange-600 rounded-sm hover:bg-orange-100 transition shadow-sm text-xs font-bold active:scale-95 uppercase"
              >
                <X size={14} />
                Clear All
              </button>
            </div>
          )}

          {/* Expenses Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                    <th className="py-3 px-4 font-semibold text-left">Date</th>
                    <th className="py-3 px-4 font-semibold text-left">Description</th>
                    <th className="py-3 px-4 font-semibold text-left">Category</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-4 font-semibold text-center">Receipt</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-500">
                        Loading expenses...
                      </td>
                    </tr>
                  ) : expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                      <tr
                        key={expense.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={14} className="text-orange-500" />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800 text-sm">
                          {expense.title}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {expense.category}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-800 text-sm text-right">
                          ₹{expense.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {expense.receipt_url ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1 text-xs justify-center">
                              <Receipt size={14} />
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold flex items-center gap-1 text-xs justify-center">
                              <X size={14} />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => handleView(expense)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                              title="View Expense"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(expense)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-sm transition-all"
                              title="Edit Expense"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all shadow-sm"
                              title="Delete Expense"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Receipt size={32} className="text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          No expenses found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {hasActiveFilters ? "No expenses match your filters" : "Add your first expense to start tracking"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Expenses
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage < pagination.totalPages ? currentPage + 1 : currentPage)}
                disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <EditExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          expense={selectedExpense}
        />

        <ViewExpenseModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          expense={selectedExpense}
        />

        <DeleteExpenseModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          expenseId={selectedExpense?.id}
        />
      </div>
    </DashboardLayout>
  );
}
