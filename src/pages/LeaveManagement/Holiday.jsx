import React, { useState, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  X,
  Filter,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

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
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl mx-4 relative transform transition-all animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
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
              placeholder="e.g., New Year, Republic Day, Diwali..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
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
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
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
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={formData.startDate}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-orange-50 border border-orange-200 rounded-sm p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-orange-600">Note:</span> The
              number of days will be calculated automatically based on the start
              and end dates.
            </p>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-sm border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all"
          >
            {editingId ? "Update Holiday" : "Add Holiday"}
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
  );
};

// Main HolidaysManagement Component
export default function HolidaysManagement() {
  const [holidays, setHolidays] = useState([
    {
      id: 1,
      name: "New Year",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      days: 1,
    },
    {
      id: 2,
      name: "Republic Day",
      startDate: "2025-01-26",
      endDate: "2025-01-29",
      days: 4,
    },
    {
      id: 3,
      name: "Holi",
      startDate: "2025-03-14",
      endDate: "2025-03-14",
      days: 1,
    },
    {
      id: 4,
      name: "Independence Day",
      startDate: "2025-08-15",
      endDate: "2025-08-15",
      days: 1,
    },
    {
      id: 5,
      name: "Diwali",
      startDate: "2025-10-20",
      endDate: "2025-10-22",
      days: 3,
    },
    {
      id: 6,
      name: "Christmas",
      startDate: "2025-12-25",
      endDate: "2025-12-25",
      days: 1,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get holiday status
  const getHolidayStatus = (holiday) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(holiday.startDate);
    const endDate = new Date(holiday.endDate);

    if (endDate < today) {
      return "passed";
    } else if (startDate <= today && endDate >= today) {
      return "active";
    } else {
      return "upcoming";
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = holidays.length;
    const active = holidays.filter(
      (h) => getHolidayStatus(h) === "active"
    ).length;
    const upcoming = holidays.filter(
      (h) => getHolidayStatus(h) === "upcoming"
    ).length;
    const passed = holidays.filter(
      (h) => getHolidayStatus(h) === "passed"
    ).length;
    const totalDays = holidays.reduce((sum, h) => sum + h.days, 0);

    return { total, active, upcoming, passed, totalDays };
  }, [holidays]);

  // Filter and search holidays
  const filteredHolidays = useMemo(() => {
    return holidays.filter((holiday) => {
      const status = getHolidayStatus(holiday);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesSearch = holiday.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [holidays, statusFilter, searchQuery]);

  const handleSubmit = () => {
    if (formData.name && formData.startDate && formData.endDate) {
      const days = calculateDays(formData.startDate, formData.endDate);

      if (editingId) {
        setHolidays(
          holidays.map((h) =>
            h.id === editingId
              ? {
                  ...h,
                  name: formData.name,
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  days,
                }
              : h
          )
        );
        setEditingId(null);
      } else {
        const newHoliday = {
          id: Date.now(),
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days,
        };
        setHolidays([...holidays, newHoliday]);
      }

      setFormData({ name: "", startDate: "", endDate: "" });
      setIsModalOpen(false);
    }
  };

  const handleEdit = (holiday) => {
    setEditingId(holiday.id);
    setFormData({
      name: holiday.name,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", startDate: "", endDate: "" });
  };

  const formatDate = (dateString) => {
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

    const badge = badges[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-sm border-b p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Holidays Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <FiHome className="text-gray-700 text-sm" />
                    <span className="text-gray-400"></span> HRM /{" "}
                    <span className="text-[#FF7B1D] font-medium">
                      All Holidays
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-5 py-3 rounded-sm text-sm font-medium transition-all ${
                      statusFilter === "all"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`px-5 py-3 rounded-sm text-sm font-medium transition-all ${
                      statusFilter === "active"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Active ({stats.active})
                  </button>
                  <button
                    onClick={() => setStatusFilter("upcoming")}
                    className={`px-5 py-3 rounded-sm text-sm font-medium transition-all ${
                      statusFilter === "upcoming"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Upcoming ({stats.upcoming})
                  </button>
                  <button
                    onClick={() => setStatusFilter("passed")}
                    className={`px-5 py-3 rounded-sm text-sm font-medium transition-all ${
                      statusFilter === "passed"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Passed ({stats.passed})
                  </button>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mr-6 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-sm transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Add Holiday
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Holidays
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-sm">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Active Now
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-sm">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {stats.upcoming}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-sm">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Passed</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">
                    {stats.passed}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-sm">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Days Off
                  </p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.totalDays}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-sm">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Holidays Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Holidays List ({filteredHolidays.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-sm text-gray-700">
                      Holiday Name
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-sm text-gray-700">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-sm text-gray-700">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-sm text-gray-700">
                      Days
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-sm text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-sm text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredHolidays.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="font-medium">No holidays found</p>
                        <p className="text-sm mt-1">
                          {searchQuery
                            ? "Try adjusting your search or filters"
                            : 'Click "Add Holiday" to create one'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredHolidays.map((holiday) => (
                      <tr
                        key={holiday.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-sm flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="font-medium text-gray-800">
                              {holiday.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center text-gray-600">
                          {formatDate(holiday.startDate)}
                        </td>

                        <td className="px-6 py-4 text-center text-gray-600">
                          {formatDate(holiday.endDate)}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {holiday.days} {holiday.days === 1 ? "Day" : "Days"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(getHolidayStatus(holiday))}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(holiday)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(holiday.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
      </div>
    </DashboardLayout>
  );
}
