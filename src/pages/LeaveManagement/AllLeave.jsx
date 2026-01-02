import React, { useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
  useGetLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveStatusMutation,
  useGetLeaveTypesQuery
} from "../../store/api/leaveApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import toast from 'react-hot-toast';
import usePermission from "../../hooks/usePermission";

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { create, read, update, delete: remove } = usePermission("Leave Management");

  // Queries
  const {
    data: leaveData,
    isLoading,
    isError,
    refetch
  } = useGetLeaveRequestsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: activeTab === 'all' ? 'All' : activeTab
  }, { refetchOnMountOrArgChange: true });

  const { data: employeesData } = useGetEmployeesQuery({ page: 1, limit: 100 }, { refetchOnMountOrArgChange: true });
  const { data: leaveTypesData } = useGetLeaveTypesQuery({ page: 1, limit: 100 }, { refetchOnMountOrArgChange: true }); // Fetch all types for dropdown

  const [createLeaveRequest] = useCreateLeaveRequestMutation();
  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();

  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: "",
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.leave_type_id || !formData.from_date || !formData.to_date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const days = calculateDays(formData.from_date, formData.to_date);
      await createLeaveRequest({
        ...formData,
        days
      }).unwrap();
      toast.success('Leave request submitted successfully');
      setShowApplyModal(false);
      setFormData({
        employee_id: "",
        leave_type_id: "",
        from_date: "",
        to_date: "",
        reason: "",
      });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveStatus({ id, status }).unwrap();
      toast.success(`Leave request ${status} successfully`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  }

  // Handle Export (Mock for now, or client-side)
  const handleExport = () => {
    if (!leaveData?.leave_requests) return;

    const csv = [
      ["Employee", "Type", "From", "To", "Days", "Status", "Reason"],
      ...leaveData.leave_requests.map((r) => [
        r.employee_name,
        r.leave_type,
        new Date(r.from_date).toLocaleDateString(),
        new Date(r.to_date).toLocaleDateString(),
        r.days,
        r.status,
        r.reason,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leave-requests.csv";
    a.click();
  };

  // Pagination Logic
  const totalPages = leaveData?.pagination?.totalPages || 1;

  const renderPaginationButton = (pageNum) => (
    <button
      key={pageNum}
      onClick={() => handlePageChange(pageNum)}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
        ? 'bg-[#FF7B1D] text-white'
        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
    >
      {pageNum}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-400" />
              <span>HRM /</span>
              <span className="text-[#FF7B1D] font-medium">
                Leave Management
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] w-64"
              />
            </div>

            <button
              onClick={handleExport}
              className="border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              disabled={!create}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${create
                ? "bg-[#FF7B1D] text-white hover:bg-[#e06915]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <Plus className="w-4 h-4" />
              Apply Leave
            </button>
          </div>
        </div>

        {/* Stats Cards (Static or need separate queries - using placeholders or lightweight logic if needed) 
           For now we will show generic stats or removing them if they are misleading. 
           Let's show "Total Requests" from current pagination total. 
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <NumberCard
            title="Total Requests"
            number={leaveData?.pagination?.total || 0}
            icon={<Calendar className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          {/* We can't easily get counts for others without extra queries. Leaving them as placeholders or 0 for now to avoid errors, or removing. User asked for specific functionality. I'll keep them but maybe hardcode 0 or implement extra queries later. */}
          <NumberCard
            title="Pending"
            number={"-"}
            icon={<Clock className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Approved"
            number={"-"}
            icon={<CheckCircle className="text-orange-600" size={24} />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
          <NumberCard
            title="Rejected"
            number={"-"}
            icon={<XCircle className="text-purple-600" size={24} />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors relative ${activeTab === tab
                  ? "text-[#FF7B1D]"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF7B1D]" />
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold">Employee</th>
                  <th className="py-3 px-4 font-semibold">Leave Type</th>
                  <th className="py-3 px-4 font-semibold">From</th>
                  <th className="py-3 px-4 font-semibold">To</th>
                  <th className="py-3 px-4 font-semibold">Days</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 px-4"><div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-10 mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-6 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr><td colSpan="7" className="text-center py-10 text-red-500">Error loading data</td></tr>
                ) : leaveData?.leave_requests?.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 text-gray-500">No leave requests found</td></tr>
                ) : (
                  leaveData?.leave_requests.map((request) => (
                    <tr key={request.id} className="border-t hover:bg-gray-50 transition-colors text-center">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#FF7B1D] font-bold text-xs">
                            {request.employee_name?.charAt(0) || 'U'}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{request.employee_name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                        {request.leave_type || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.from_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.to_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                        {request.days}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap justify-center flex">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {request.status === "pending" || request.status === "Pending" ? (
                          <div className="flex justify-center gap-3">
                            {update && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(request.id, 'approved')}
                                  className="text-green-600 hover:text-green-800 font-semibold text-xs transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                  className="text-red-600 hover:text-red-800 font-semibold text-xs transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            {read && (
                              <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs transition-colors">
                                View
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, leaveData?.pagination?.total || 0)}</span> of <span className="font-bold">{leaveData?.pagination?.total || 0}</span> results
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
                if (totalPages > 5 && currentPage > 3) {
                  p = currentPage - 2 + i;
                }
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 border rounded-sm text-sm font-bold flex items-center justify-center transition-colors ${currentPage === p
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 hover:bg-gray-50"
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

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
                Apply for Leave
              </h2>
              <form onSubmit={handleSubmitLeave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent text-sm"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employeesData?.employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.employee_name} ({emp.employee_id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.leave_type_id}
                    onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent text-sm"
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypesData?.leave_types?.map(lt => (
                      <option key={lt.id} value={lt.id}>{lt.leave_type}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.from_date}
                      onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.to_date}
                      onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] text-sm"
                      required
                    />
                  </div>
                </div>

                {formData.from_date && formData.to_date && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-orange-700">
                      Total Days: <span className="font-bold">{calculateDays(formData.from_date, formData.to_date)}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    rows="3"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] text-sm"
                    placeholder="Enter reason..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF7B1D] hover:bg-[#e06915] text-white py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
