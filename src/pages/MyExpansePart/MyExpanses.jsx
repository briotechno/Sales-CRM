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
  Edit,
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
  const [tempCategory, setTempCategory] = useState("All");
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

                {/* Unified Filter Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setTempCategory(categoryFilter);
                        setIsCategoryFilterOpen(!isCategoryFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isCategoryFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isCategoryFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[350px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Filter Options</span>
                        <button
                          onClick={() => {
                            setTempCategory("All");
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset all
                        </button>
                      </div>

                      <div className="p-5">
                        {/* Column: Category */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Category</span>
                          <div className="relative">
                            <select
                              value={tempCategory}
                              onChange={(e) => setTempCategory(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                            >
                              <option value="All">All Categories</option>
                              {["Meals", "Travel", "Supplies", "Training", "Software", "Other"].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsCategoryFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setCategoryFilter(tempCategory);
                            setCurrentPage(1);
                            setIsCategoryFilterOpen(false);
                          }}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-sm"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>


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

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
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


          {/* Expenses Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                    <th className="py-3 px-4 font-semibold text-left">Description</th>
                    <th className="py-3 px-4 font-semibold text-left">Category</th>
                    <th className="py-3 px-4 font-semibold text-left">Amount</th>
                    <th className="py-3 px-4 font-semibold text-left">Receipt</th>
                    <th className="py-3 px-4 font-semibold text-left">Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <div className="flex justify-center flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                          <p className="text-gray-500 font-semibold animate-pulse">Loading expenses...</p>
                        </div>
                      </td>
                    </tr>
                  ) : expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                      <tr
                        key={expense.id}
                        className={`hover:bg-orange-50/50 transition-colors group ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                      >
                        <td className="px-4 py-3 text-left">
                          <div className="text-base font-normal text-gray-900 truncate max-w-xs capitalize">{expense.title}</div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="text-sm text-gray-600 font-medium whitespace-nowrap capitalize">
                            {expense.category}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                            ₹{expense.amount.toLocaleString("en-IN")}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          {expense.receipt_url ? (
                            <span className="text-green-600 font-medium flex items-center gap-1 text-sm whitespace-nowrap capitalize">
                              <Receipt size={14} />
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-500 font-medium flex items-center gap-1 text-sm whitespace-nowrap capitalize">
                              <X size={14} />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium whitespace-nowrap">
                            <Calendar size={14} className="text-orange-500" />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleView(expense)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(expense)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all shadow-sm"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Receipt size={48} className="text-gray-200" />
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {hasActiveFilters ? "No expenses found" : "No expenses recorded"}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4">
                            {hasActiveFilters
                              ? "No expenses match your filters. Try clearing them to see all data."
                              : "Start tracking your spending by adding your first expense."}
                          </p>
                          {hasActiveFilters ? (
                            <button
                              onClick={clearAllFilters}
                              className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                            >
                              Clear Filter
                            </button>
                          ) : (
                            <button
                              onClick={() => setIsAddModalOpen(true)}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 font-semibold"
                            >
                              <Plus size={20} />
                              Create First Expense
                            </button>
                          )}
                        </div>
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
