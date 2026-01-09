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
  const [filterType, setFilterType] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const dateDropdownRef = useRef(null);

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

    if (filterType === "Today") {
      dateFrom = formatDate(today);
      dateTo = formatDate(today);
    } else if (filterType === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateFrom = formatDate(yesterday);
      dateTo = formatDate(yesterday);
    } else if (filterType === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 7);
      dateFrom = formatDate(last7);
      dateTo = formatDate(today);
    } else if (filterType === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFrom = formatDate(firstDay);
      dateTo = formatDate(today);
    } else if (filterType === "Custom") {
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="min-h-screen ml-0 bg-gradient-to-br from-orange-0 via-white to-orange-100">
        {/* Header */}
        <div className="bg-white border-b ml-4">
          <div className="max-w-8xl mx-auto px-0 ml-6 py-4">
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
              <div className="flex flex-wrap items-center gap-2 ml-auto">

                {/* Custom Date Filter Dropdown */}
                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className={`flex items-center gap-2 p-3 rounded-sm border transition-all shadow-sm ${isDateFilterOpen || filterType !== "Today"
                      ? "bg-white text-gray-700 border-gray-300 hover:bg-orange-500 hover:text-white hover:border-[#FF7B1D]"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      }`}
                  >
                    <Filter size={20} />
                  </button>

                  {isDateFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Expanses</p>
                      </div>
                      <div className="py-1">
                        {["Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setFilterType(option);
                              setIsDateFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${filterType === option
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
                {filterType === "Custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="px-2 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                    <span className="text-gray-600 text-xs">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-2 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-48 lg:w-64"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>

                {/* Add Expense Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-md"
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto ml-6 mt-4 p-0">
          {/* Stats Cards (Dynamic) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <NumberCard
              title={"Total Expenses"}
              number={`₹${summary.totalAmount || 0}`}
              icon={<DollarSign className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"With Receipt"}
              number={summary.receiptCount || 0}
              icon={<Receipt className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"Without Receipt"}
              number={summary.noReceiptCount || 0}
              icon={<Receipt className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
            <NumberCard
              title={"Total Entries"}
              number={summary.totalCount || 0}
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
                      Category
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
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-0"
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
                        <td className="px-4 py-3 font-bold text-gray-800 text-sm">
                          ₹{expense.amount}
                        </td>
                        <td className="px-4 py-3">
                          {expense.receipt_url ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1 text-xs">
                              <Receipt size={14} />
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold flex items-center gap-1 text-xs">
                              <X size={14} />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => handleView(expense)}
                              className="text-blue-500 hover:opacity-80"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-[#FF7B1D] hover:opacity-80"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
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
                          Add your first expense to start tracking
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{indexOfLastItem}</span> of <span className="font-bold">{pagination.total}</span> expenses
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white shadow-sm"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 border rounded-sm text-sm font-bold transition-all ${currentPage === i + 1
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage < pagination.totalPages ? currentPage + 1 : currentPage)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white shadow-sm"
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
