import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  X,
  Pencil,
} from "lucide-react";
import toast from 'react-hot-toast';

import {
  useGetAllSalariesQuery,
  useCreateSalaryMutation,
  useDeleteSalaryMutation,
  useUpdateSalaryMutation,
} from "../../store/api/salaryApi";
import AddSalaryModal from "../../components/SalaryManagement/AddSalaryModal";
import DeleteSalaryModal from "../../components/SalaryManagement/DeleteSalaryModal";
import ViewSalaryModal from "../../components/SalaryManagement/ViewSalaryModal";
import EditSalaryModal from "../../components/SalaryManagement/EditSalaryModal";
import usePermission from "../../hooks/usePermission";

export default function SalaryManagement() {
  /* ================= STATES ================= */
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [ViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState(null);

  const { create, read, update, delete: remove } = usePermission("Payroll");

  const [formData, setFormData] = useState({
    employee: "",
    designation: "",
    department: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    date: "",
  });

  /* ================= API ================= */
  const { data, isLoading: salariesLoading } = useGetAllSalariesQuery({
    department: selectedDepartment === "all" ? "" : selectedDepartment,
  });

  const salaries = Array.isArray(data?.salaries) ? data.salaries : [];

  const stats = data || {}; // using same data to calculate stats

  const [createSalary, { isLoading: creating }] = useCreateSalaryMutation();
  const [deleteSalary] = useDeleteSalaryMutation();
  const [updateSalary, { isLoading: updating }] =
    useUpdateSalaryMutation();

  /* ================= CALCULATIONS ================= */
  const calculateNetSalary = () => {
    const basic = Number(formData.basicSalary) || 0;
    const allowances = Number(formData.allowances) || 0;
    const deductions = Number(formData.deductions) || 0;
    return basic + allowances - deductions;
  };

  const totalPayroll = salaries.reduce(
    (sum, s) => sum + (Number(s.net_salary) || 0),
    0
  );

  const totalPaid = salaries
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + (Number(s.net_salary) || 0), 0);

  const totalPending = salaries
    .filter((s) => s.status !== "paid")
    .reduce((sum, s) => sum + (Number(s.net_salary) || 0), 0);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
  };

  const salaryStats = [
    {
      label: "Total Payroll",
      value: `₹${totalPayroll.toLocaleString()}`,
      icon: DollarSign,
      borderColor: "border-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Paid This Month",
      value: `₹${totalPaid.toLocaleString()}`,
      icon: TrendingUp,
      borderColor: "border-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Pending Payment",
      value: `₹${totalPending.toLocaleString()}`,
      icon: Calendar,
      borderColor: "border-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Active Departments",
      value: stats?.active_departments || 0,
      icon: Users,
      borderColor: "border-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  /* ================= HANDLERS ================= */
  const handleSubmitSalary = async (payload) => {
    try {
      await createSalary(payload).unwrap();
      toast.success("Salary added successfully");
      setShowAddModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create salary");
    }
  };

  const handleUpdateSalary = async (id, data) => {
    return await updateSalary({ id, data }).unwrap();
  };

  const getStatusColor = (status) =>
    status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  /* ================= EXPORT FUNCTION ================= */
  const handleExport = () => {
    if (!salaries.length) return alert("No salaries to export");

    const csvRows = [
      ["Employee", "Designation", "Department", "Basic", "Allowances", "Deductions", "Net", "Status", "Payment Date"],
      ...salaries.map((s) => [
        s.employee_name || "",
        s.designation || "",
        s.department || "",
        s.basic_salary || 0,
        s.allowances || 0,
        s.deductions || 0,
        s.net_salary || 0,
        s.status || "",
        s.payment_date || "",
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "salaries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMarkAsPaid = async (salaryId) => {
    try {
      await updateSalary({
        id: salaryId,
        data: { status: "paid" },
      }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to mark salary as paid");
    }
  };

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <div className="ml-6 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-sm p-3 mb-4 border-b">
          <div className="flex justify-between items-center">
            {/* LEFT TITLE */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Salary Management
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <FiHome className="text-gray-700 text-sm" />
                <span className="text-gray-400">HRM /</span>
                <span className="text-[#FF7B1D] font-medium">All Salary</span>
              </p>
            </div>

            {/* RIGHT SIDE BUTTONS (Filter + Export + Add Salary) */}
            <div className="flex items-center gap-4">
              {/* Filter + Department Select */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />

                {/* <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select> */}

                {selectedDepartment !== "all" && (
                  <button
                    onClick={() => setSelectedDepartment("all")}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-sm flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              {/* Add Salary Button */}
              <button
                onClick={() => setShowAddModal(true)}
                disabled={!create}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm font-semibold transition ml-2 ${create
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <Plus size={18} />
                Add Salary
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {salaryStats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-sm shadow-sm hover:shadow-md transition p-6 border-t-4 ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold text-gray-800 mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Salary Cards Grid */}
        {salariesLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : salaries.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {salaries.map((salary) => (
              <div
                key={salary.id}
                className="bg-white rounded-sm shadow-sm hover:shadow-md transition border-t-4 border-orange-400"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {(salary.employee_name || "Name")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {salary.employee_name || "Name"}
                        </h3>
                        <p className="text-sm text-gray-600">{salary.designation}</p>
                        <p className="text-xs text-gray-500">{salary.department}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${getStatusColor(
                        salary.status
                      )}`}
                    >
                      {salary.status || "pending"}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-sm p-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Basic Salary</p>
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{salary.basic_salary?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Allowances</p>
                        <p className="text-sm font-semibold text-green-600">
                          +₹{salary.allowances?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Deductions</p>
                        <p className="text-sm font-semibold text-red-600">
                          -₹{salary.deductions?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-orange-200">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">Net Salary</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₹{salary.net_salary || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    {/* <span>Payment Date: {salary.pay_date || "N/A"}</span> */}
                    <span>Payment Date: {formatDate(salary.pay_date)}</span>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {salary.status === "pending" && update && (
                      <button
                        onClick={() => handleMarkAsPaid(salary.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-sm transition font-medium"
                      >
                        <DollarSign className="w-4 h-4" />
                        Mark as Paid
                      </button>
                    )}
                    {read && (
                      <button
                        onClick={() => {
                          setSelectedSalary(salary);
                          setViewModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-sm transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {update && (
                      <button
                        onClick={() => {
                          setSelectedSalary(salary); // full salary object
                          setEditModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-sm transition">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {remove && (
                      <button
                        onClick={() => {
                          setSelectedSalaryId(salary.id);
                          setOpenDelete(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-sm transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No salary records found
            </h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Add Salary Modal */}
        <AddSalaryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitSalary}
          loading={creating}
        />
        <ViewSalaryModal
          isOpen={ViewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedSalary(null);
          }}
          salary={selectedSalary}
        />
        <EditSalaryModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedSalary(null);
          }}
          salary={selectedSalary}
          onSubmit={handleUpdateSalary}
          loading={updating}
        />
        <DeleteSalaryModal
          isOpen={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setSelectedSalaryId(null);
          }}
          salaryId={selectedSalaryId}
        />

        {/* {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-lg flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Add Salary Record</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={formData.employee}
                  onChange={(e) =>
                    setFormData({ ...formData, employee: e.target.value })
                  }
                  className="border p-2"
                />
                <input
                  type="text"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="border p-2"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="border p-2"
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Basic Salary"
                  value={formData.basicSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, basicSalary: e.target.value })
                  }
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Allowances"
                  value={formData.allowances}
                  onChange={(e) =>
                    setFormData({ ...formData, allowances: e.target.value })
                  }
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Deductions"
                  value={formData.deductions}
                  onChange={(e) =>
                    setFormData({ ...formData, deductions: e.target.value })
                  }
                  className="border p-2"
                />
              </div>

              <p className="mt-4 font-bold">Net Salary: ₹{calculateNetSalary()}</p>

              <button
                onClick={handleSubmitSalary}
                disabled={creating}
                className="mt-4 bg-orange-500 text-white px-4 py-2 w-full"
              >
                {creating ? "Saving..." : "Add Salary"}
              </button>
            </div>
          </div>
        )} */}
      </div>
    </DashboardLayout>
  );
}
