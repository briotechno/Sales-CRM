import React, { useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Download,
  Search,
  Target,
  Handshake,
  DollarSign,
  Users,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      employee: "John Doe",
      type: "Sick Leave",
      from: "2025-11-20",
      to: "2025-11-22",
      days: 3,
      status: "pending",
      reason: "Medical appointment",
    },
    {
      id: 2,
      employee: "Sarah Smith",
      type: "Casual Leave",
      from: "2025-11-25",
      to: "2025-11-26",
      days: 2,
      status: "approved",
      reason: "Personal work",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      type: "Annual Leave",
      from: "2025-12-01",
      to: "2025-12-05",
      days: 5,
      status: "pending",
      reason: "Family vacation",
    },
    {
      id: 4,
      employee: "Emily Brown",
      type: "Sick Leave",
      from: "2025-11-18",
      to: "2025-11-18",
      days: 1,
      status: "rejected",
      reason: "Fever",
    },
    {
      id: 5,
      employee: "David Wilson",
      type: "Casual Leave",
      from: "2025-11-28",
      to: "2025-11-29",
      days: 2,
      status: "approved",
      reason: "Family event",
    },
    {
      id: 6,
      employee: "David Wilson",
      type: "Casual Leave",
      from: "2025-11-28",
      to: "2025-11-29",
      days: 2,
      status: "approved",
      reason: "Family event",
    },
    {
      id: 7,
      employee: "David Wilson",
      type: "Casual Leave",
      from: "2025-11-28",
      to: "2025-11-29",
      days: 2,
      status: "approved",
      reason: "Family event",
    },
    {
      id: 8,
      employee: "David Wilson",
      type: "Casual Leave",
      from: "2025-11-28",
      to: "2025-11-29",
      days: 2,
      status: "rejected",
      reason: "Family event",
    },
    {
      id: 9,
      employee: "David Wilson",
      type: "Casual Leave",
      from: "2025-11-28",
      to: "2025-11-29",
      days: 2,
      status: "approved",
      reason: "Family event",
    },
    {
      id: 10,
      employee: "David Wilson",
      type: "Casual Leave",
      from: "2025-11-28",
      to: "2025-11-29",
      days: 2,
      status: "approved",
      reason: "Family event",
    },
  ]);

  const [formData, setFormData] = useState({
    employee: "",
    type: "Sick Leave",
    from: "",
    to: "",
    reason: "",
  });

  const leaveRequests = leaveData;

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || req.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

  const handleApprove = (id) => {
    setLeaveData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item
      )
    );
  };

  const handleReject = (id) => {
    setLeaveData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" } : item
      )
    );
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    const days = calculateDays(formData.from, formData.to);
    const newLeave = {
      id: leaveData.length + 1,
      employee: formData.employee,
      type: formData.type,
      from: formData.from,
      to: formData.to,
      days: days,
      status: "pending",
      reason: formData.reason,
    };
    setLeaveData([newLeave, ...leaveData]);
    setShowApplyModal(false);
    setFormData({
      employee: "",
      type: "Sick Leave",
      from: "",
      to: "",
      reason: "",
    });
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleExport = () => {
    const csv = [
      ["Employee", "Type", "From", "To", "Days", "Status", "Reason"],
      ...filteredRequests.map((r) => [
        r.employee,
        r.type,
        r.from,
        r.to,
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 ml-6 p-0">
        {/* Header + Actions in Single Row */}
        <div className="mb-6 boder-b flex items-center justify-between bg-white border-b py-3">
          {/* LEFT SIDE — Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Leave Management
            </h1>

            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400">HRM /</span>
              <span className="text-[#FF7B1D] font-medium">
                Leave Management
              </span>
            </p>
          </div>

          {/* RIGHT SIDE — Buttons */}
          <div className="flex gap-2">
            <button className="border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-sm flex items-center gap-2 transition">
              <Filter className="w-4 h-4" />
              Filter
            </button>

            <button
              onClick={handleExport}
              className="border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:from-orange-600 hover:to-orange-700 hover:opacity-90 transition ml-2"
            >
              <Plus size={18} />
              Apply Leave
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <NumberCard
            title="Total Requests"
            number={leaveData.length}
            icon={<Calendar className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Pending"
            number={leaveData.filter((r) => r.status === "pending").length}
            icon={<Clock className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Approved"
            number={leaveData.filter((r) => r.status === "approved").length}
            icon={<CheckCircle className="text-orange-600" size={24} />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
          <NumberCard
            title="Rejected"
            number={leaveData.filter((r) => r.status === "rejected").length}
            icon={<XCircle className="text-purple-600" size={24} />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-sm shadow">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition ${activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                          {request.employee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-orange-600 hover:text-blue-800 font-medium">
                            {request.employee}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.from}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-800 font-medium transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-800 font-medium transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Apply for Leave
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={formData.employee}
                    onChange={(e) =>
                      setFormData({ ...formData, employee: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter employee name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Annual Leave</option>
                    <option>Maternity Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={formData.from}
                    onChange={(e) =>
                      setFormData({ ...formData, from: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={formData.to}
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                {formData.from && formData.to && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700">
                      Total Days:{" "}
                      <span className="font-semibold">
                        {calculateDays(formData.from, formData.to)}
                      </span>
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
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded- focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter reason for leave..."
                    required
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSubmitLeave}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-sm transition shadow-md hover:shadow-lg"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => {
                      setShowApplyModal(false);
                      setFormData({
                        employee: "",
                        type: "Sick Leave",
                        from: "",
                        to: "",
                        reason: "",
                      });
                    }}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-sm transition"
                  >
                    Cancel
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
