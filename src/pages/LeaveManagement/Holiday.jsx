import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  X,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Package
} from "lucide-react";
import {
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation
} from "../../store/api/leaveApi";
import toast from 'react-hot-toast';
import Modal from "../../components/common/Modal";

// AddHolidayModal Component
const AddHolidayModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  editingId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 relative transform transition-all animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Holiday" : "Add Holiday"}
                </h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  {editingId
                    ? "Update holiday information"
                    : "Create new holiday for your organization"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Holiday Name Input */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} className="text-[#FF7B1D]" />
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., New Year, Republic Day..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Start Date */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="text-[#FF7B1D]" />
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent outline-none transition-all text-sm"
                required
              />
            </div>

            {/* End Date */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="text-[#FF7B1D]" />
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                min={formData.start_date}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent outline-none transition-all text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 rounded-lg bg-[#FF7B1D] text-white font-medium hover:bg-[#e06915] transition-all shadow-sm"
          >
            {editingId ? "Update Holiday" : "Add Holiday"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteHolidayModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  holidayName,
}) => {
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
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <AlertCircle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete holiday{" "}
          <span className="font-bold text-gray-800">"{holidayName}"</span>?
        </p>

        <p className="text-sm text-red-500 italic">
          This action cannot be undone. All associated data will be permanently removed.
        </p>

      </div>
    </Modal>
  );
};

// Main HolidaysManagement Component
export default function HolidaysManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  // Handle outside click for filter dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setStatusFilter("All");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== "All" || dateFilter !== "All";


  // Queries
  const {
    data: holidaysData,
    isLoading,
    isError,
    refetch
  } = useGetHolidaysQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm
  }, { refetchOnMountOrArgChange: true });

  const [createHoliday] = useCreateHolidayMutation();
  const [updateHoliday] = useUpdateHolidayMutation();
  const [deleteHoliday, { isLoading: isDeleting }] =
    useDeleteHolidayMutation();

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getHolidayStatus = (holiday) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(holiday.start_date);
    const endDate = new Date(holiday.end_date);

    if (endDate < today) {
      return "passed";
    } else if (startDate <= today && endDate >= today) {
      return "active";
    } else {
      return "upcoming";
    }
  };

  const handleSubmit = async () => {
    if (formData.name && formData.start_date && formData.end_date) {
      const days = calculateDays(formData.start_date, formData.end_date);
      try {
        if (editingId) {
          await updateHoliday({ id: editingId, ...formData, days }).unwrap();
          toast.success('Holiday updated successfully');
        } else {
          await createHoliday({ ...formData, days }).unwrap();
          toast.success('Holiday added successfully');
        }
        setFormData({ name: "", start_date: "", end_date: "" });
        setEditingId(null);
        setIsModalOpen(false);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to save holiday');
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleEdit = (holiday) => {
    setEditingId(holiday.id);
    setFormData({
      name: holiday.name,
      start_date: holiday.start_date ? new Date(holiday.start_date).toISOString().split('T')[0] : '', // Format for date input
      end_date: holiday.end_date ? new Date(holiday.end_date).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        await deleteHoliday(id).unwrap();
        toast.success('Holiday deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete holiday');
      }
    }
  };
  const handleDeleteClick = (holiday) => {
    setSelectedHoliday(holiday);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteHoliday(selectedHoliday.id).unwrap();
      toast.success("Holiday deleted successfully");
      setShowDeleteModal(false);
      setSelectedHoliday(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete holiday");
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", start_date: "", end_date: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        bg: "bg-[#E6F9F1]",
        text: "text-[#00B050]",
        label: "Active Now",
        icon: <Clock className="w-3.5 h-3.5" />,
      },
      upcoming: {
        bg: "bg-[#E6F4FE]",
        text: "text-[#0070FF]",
        label: "Upcoming",
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      },
      passed: {
        bg: "bg-[#F1F3F5]",
        text: "text-[#495057]",
        label: "Passed",
        icon: <CheckCircle className="w-3.5 h-3.5" />,
      },
    };

    const badge = badges[status] || badges.upcoming;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold border-0 ${badge.bg} ${badge.text}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = holidaysData?.pagination?.totalPages || 1;
  const totalHolidays = holidaysData?.pagination?.total || 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Holidays Management</h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 font-medium">
                  <FiHome className="text-gray-400" size={14} />
                  <span>HRM</span> /{" "}
                  <span className="text-[#FF7B1D]">
                    All Holidays
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setIsFilterOpen(!isFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">status</span>
                      </div>
                      <div className="py-1">
                        {["All", "Upcoming", "Active", "Passed"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">dateCreated</span>
                      </div>
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <div key={option}>
                            <button
                              onClick={() => {
                                setDateFilter(option);
                                if (option !== "Custom") {
                                  setIsFilterOpen(false);
                                  setCurrentPage(1);
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option}
                            </button>
                            {option === "Custom" && dateFilter === "Custom" && (
                              <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                <input
                                  type="date"
                                  value={customStart}
                                  onChange={(e) => setCustomStart(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <input
                                  type="date"
                                  value={customEnd}
                                  onChange={(e) => setCustomEnd(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <button
                                  onClick={() => {
                                    setIsFilterOpen(false);
                                    setCurrentPage(1);
                                  }}
                                  className="w-full bg-orange-500 text-white text-[10px] font-bold py-2 rounded-sm uppercase tracking-wider"
                                >
                                  Apply
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", start_date: "", end_date: "" });
                    setIsModalOpen(true);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700`}
                >
                  <Plus size={20} />
                  Add Holiday
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-2 mt-0">
          {/* Holidays Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">
                    Holiday Name
                  </th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">
                    Start Date
                  </th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">
                    End Date
                  </th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">
                    Days
                  </th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-16 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-20 mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-2"><div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div></div></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr><td colSpan="6" className="text-center py-8 text-red-500">Error loading data</td></tr>
                ) : holidaysData?.holidays?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-medium">No holidays found</p>
                      <p className="text-sm mt-1">
                        {searchTerm
                          ? "Try adjusting your search"
                          : 'Click "Add Holiday" to create one'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  holidaysData?.holidays.map((holiday) => (
                    <tr
                      key={holiday.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-50 rounded-sm flex items-center justify-center border border-orange-100 shadow-sm transition-transform hover:scale-105">
                            <Calendar className="w-4 h-4 text-[#FF7B1D]" strokeWidth={2.5} />
                          </div>
                          <span className="font-bold text-gray-800">
                            {holiday.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-center text-gray-500 text-sm">
                        {formatDate(holiday.start_date)}
                      </td>

                      <td className="px-3 py-4 text-center text-gray-500 text-sm">
                        {formatDate(holiday.end_date)}
                      </td>

                      <td className="px-3 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-sm text-[11px] font-bold bg-[#E6F4FE] text-[#0070FF]">
                          {holiday.days} {holiday.days === 1 ? "Day" : "Days"}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-center">
                        {getStatusBadge(getHolidayStatus(holiday))}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-3 px-2">
                          <button
                            onClick={() => handleEdit(holiday)}
                            className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(holiday)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🔹 Pagination Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-orange-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, totalHolidays)}</span> of <span className="text-orange-600">{totalHolidays}</span> results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Holiday Modal */}
      <AddHolidayModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingId={editingId}
      />
      <DeleteHolidayModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedHoliday(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        holidayName={selectedHoliday?.name}
      />
    </DashboardLayout>
  );
}
