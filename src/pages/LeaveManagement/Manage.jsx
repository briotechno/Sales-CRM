import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import {
  LeaveFormModal,
  FilterModal,
} from "../../pages/LeaveManagement/LeaveModals";

export default function ManageLeave() {
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      leaveType: "Casual Leave",
      description: "For personal matters and emergencies",
      renewalType: "Monthly",
      leaveAllocation: 1,
      maxConsecutiveDays: 3,
      eligibilityDays: 90,
      paid: "Yes",
      unpaid: "No",
      status: "Active",
    },
    {
      id: 2,
      leaveType: "Sick Leave",
      description: "For medical reasons and health issues",
      renewalType: "Monthly",
      leaveAllocation: 1,
      maxConsecutiveDays: 7,
      eligibilityDays: 60,
      paid: "Yes",
      unpaid: "No",
      status: "Active",
    },
    {
      id: 3,
      leaveType: "Annual Leave",
      description: "Yearly vacation leave",
      renewalType: "Yearly",
      leaveAllocation: 20,
      maxConsecutiveDays: 15,
      eligibilityDays: 180,
      paid: "Yes",
      unpaid: "No",
      status: "Active",
    },
    {
      id: 4,
      leaveType: "Maternity Leave",
      description: "For expecting mothers",
      renewalType: "Yearly",
      leaveAllocation: 90,
      maxConsecutiveDays: 90,
      eligibilityDays: 365,
      paid: "Yes",
      unpaid: "No",
      status: "Active",
    },
    {
      id: 5,
      leaveType: "Unpaid Leave",
      description: "Leave without pay",
      renewalType: "Yearly",
      leaveAllocation: 0,
      maxConsecutiveDays: 30,
      eligibilityDays: 0,
      paid: "No",
      unpaid: "Yes",
      status: "Inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    description: "",
    monthlyLeave: 0,
    yearlyLeave: 0,
    noLeaves: 0,
    paid: "Yes",
    unpaid: "No",
    status: "Active",
  });
  const [filters, setFilters] = useState({
    status: "All",
    paid: "All",
    unpaid: "All",
  });

  const filteredData = leaveData.filter((leave) => {
    const matchesSearch =
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "All" || leave.status === filters.status;
    const matchesPaid = filters.paid === "All" || leave.paid === filters.paid;
    const matchesUnpaid =
      filters.unpaid === "All" || leave.unpaid === filters.unpaid;

    return matchesSearch && matchesStatus && matchesPaid && matchesUnpaid;
  });

  const handleAddNew = () => {
    setEditingLeave(null);
    setFormData({
      leaveType: "",
      description: "",
      monthlyLeave: 0,
      yearlyLeave: 0,
      noLeaves: 0,
      paid: "Yes",
      unpaid: "No",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setFormData(leave);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      setLeaveData(leaveData.filter((leave) => leave.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLeave) {
      setLeaveData(
        leaveData.map((leave) =>
          leave.id === editingLeave.id ? { ...formData, id: leave.id } : leave
        )
      );
    } else {
      setLeaveData([...leaveData, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Leave") || name === "noLeaves" ? Number(value) : value,
    }));
  };

  const totalLeaves = leaveData.reduce(
    (sum, leave) => sum + leave.yearlyLeave,
    0
  );
  const activeCount = leaveData.filter((l) => l.status === "Active").length;
  const paidCount = leaveData.filter((l) => l.paid === "Yes").length;

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Manage Leave
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    Manage all Leave
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="bg-white border border-gray-200 text-black px-6 py-3 rounded-sm hover:bg-gray-100 transition-all shadow-sm hover:shadow-sm flex items-center gap-2 font-semibold"
                >
                  <Filter size={20} />
                  Filter
                </button>
                <button
                  onClick={handleAddNew}
                  className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Leave Type
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    Total Leave Types
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {leaveData.length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-sm">
                  <FileText className="text-orange-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    Active Types
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {activeCount}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-sm">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    Paid Leave Types
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {paidCount}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-sm">
                  <CheckCircle className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    Total Yearly Leaves
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalLeaves}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-sm">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-sm shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Description
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      Monthly Leave
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      Yearly Leave
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      No. Leaves
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      Paid
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      Unpaid
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((leave, index) => (
                    <tr
                      key={leave.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-0"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {leave.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-900">
                          {leave.monthlyLeave}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-900">
                          {leave.yearlyLeave}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-orange-100 text-orange-700 font-medium text-sm">
                          {leave.noLeaves}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                            leave.paid === "Yes"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {leave.paid}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                            leave.unpaid === "Yes"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {leave.unpaid}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                            leave.status === "Active"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(leave)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-all duration-150 transform "
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(leave.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all duration-150 transform "
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No leave types found</p>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <LeaveFormModal
          showModal={showModal}
          setShowModal={setShowModal}
          editingLeave={editingLeave}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />

        <FilterModal
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </DashboardLayout>
  );
}
