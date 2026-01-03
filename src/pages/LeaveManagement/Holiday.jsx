import React, { useState, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import {
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation
} from "../../store/api/leaveApi";
import toast from 'react-hot-toast';

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

// Main HolidaysManagement Component
export default function HolidaysManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

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
  const [deleteHoliday] = useDeleteHolidayMutation();

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
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Active Now",
        icon: <Clock className="w-3 h-3" />,
      },
      upcoming: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Upcoming",
        icon: <TrendingUp className="w-3 h-3" />,
      },
      passed: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Passed",
        icon: <CheckCircle className="w-3 h-3" />,
      },
    };

    const badge = badges[status] || badges.upcoming;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
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
      <div className="min-h-screen bg-gray-50 ml-6 p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Holidays Management
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-400" />
              <span>HRM /</span>
              <span className="text-[#FF7B1D] font-medium">
                All Holidays
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search holidays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] w-64"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#FF7B1D] hover:bg-[#e06915] text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </button>
          </div>
        </div>



        {/* Holidays Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold tracking-wider">
                    Holiday Name
                  </th>
                  <th className="px-6 py-4 text-center font-semibold tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-center font-semibold tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-center font-semibold tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-4 text-center font-semibold tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold tracking-wider">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-[#FF7B1D]" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {holiday.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center text-gray-500 text-sm">
                        {formatDate(holiday.start_date)}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-500 text-sm">
                        {formatDate(holiday.end_date)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {holiday.days} {holiday.days === 1 ? "Day" : "Days"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(getHolidayStatus(holiday))}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(holiday)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(holiday.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalHolidays)}</span> of <span className="font-bold">{totalHolidays}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors"
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

    </DashboardLayout >
  );
}
