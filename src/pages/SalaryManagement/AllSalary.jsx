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
  Search,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";

export default function SalaryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [salaryData, setSalaryData] = useState([
    {
      id: 1,
      employee: "John Doe",
      designation: "Senior Developer",
      department: "Engineering",
      basicSalary: 50000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 53000,
      status: "paid",
      date: "2025-11-01",
    },
    {
      id: 2,
      employee: "Sarah Smith",
      designation: "HR Manager",
      department: "Human Resources",
      basicSalary: 45000,
      allowances: 4000,
      deductions: 1500,
      netSalary: 47500,
      status: "paid",
      date: "2025-11-01",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      designation: "Marketing Lead",
      department: "Marketing",
      basicSalary: 48000,
      allowances: 4500,
      deductions: 1800,
      netSalary: 50700,
      status: "pending",
      date: "2025-11-15",
    },
    {
      id: 4,
      employee: "Emily Brown",
      designation: "Designer",
      department: "Design",
      basicSalary: 42000,
      allowances: 3500,
      deductions: 1600,
      netSalary: 43900,
      status: "paid",
      date: "2025-11-01",
    },
    {
      id: 5,
      employee: "David Wilson",
      designation: "Sales Executive",
      department: "Sales",
      basicSalary: 40000,
      allowances: 6000,
      deductions: 1700,
      netSalary: 44300,
      status: "pending",
      date: "2025-11-15",
    },
  ]);
  const [formData, setFormData] = useState({
    employee: "",
    designation: "",
    department: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    date: "",
  });

  const departments = [
    "Engineering",
    "Human Resources",
    "Marketing",
    "Design",
    "Sales",
    "Finance",
  ];

  const filteredSalaries = salaryData.filter((sal) => {
    const matchesSearch =
      sal.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sal.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sal.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDepartment === "all" || sal.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const totalPaid = salaryData
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.netSalary, 0);
  const totalPending = salaryData
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.netSalary, 0);
  const averageSalary = Math.round(
    salaryData.reduce((sum, s) => sum + s.netSalary, 0) / salaryData.length
  );
  const activeDepartments = [...new Set(salaryData.map((s) => s.department))]
    .length;

  const salaryStats = [
    {
      label: "Total Payroll",
      value: `₹${(totalPaid + totalPending).toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500",
    },
    {
      label: "Paid This Month",
      value: `₹${totalPaid.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-green-500",
    },
    {
      label: "Pending Payment",
      value: `₹${totalPending.toLocaleString()}`,
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-500",
    },
    {
      label: "Active Departments",
      value: activeDepartments,
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-500",
    },
  ];

  const getStatusColor = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  const handleMarkAsPaid = (id) => {
    setSalaryData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "paid" } : item))
    );
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this salary record?")) {
      setSalaryData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const designations = [
    "Manager",
    "Team Lead",
    "Executive",
    "Associate",
    "Intern",
  ];

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return basic + allowances - deductions;
  };

  const handleSubmitSalary = () => {
    const netSalary = calculateNetSalary();
    const newSalary = {
      id: salaryData.length + 1,
      employee: formData.employee,
      designation: formData.designation,
      department: formData.department,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      deductions: parseFloat(formData.deductions),
      netSalary: netSalary,
      status: "pending",
      date: formData.date,
    };
    setSalaryData([newSalary, ...salaryData]);
    setShowAddModal(false);
    setFormData({
      employee: "",
      designation: "",
      department: "",
      basicSalary: "",
      allowances: "",
      deductions: "",
      date: "",
    });
  };

  const handleExport = () => {
    const csv = [
      [
        "Employee",
        "Designation",
        "Department",
        "Basic Salary",
        "Allowances",
        "Deductions",
        "Net Salary",
        "Status",
        "Date",
      ],
      ...filteredSalaries.map((s) => [
        s.employee,
        s.designation,
        s.department,
        s.basicSalary,
        s.allowances,
        s.deductions,
        s.netSalary,
        s.status,
        s.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salary-records.csv";
    a.click();
  };

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

                <select
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
                </select>

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
                className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-sm flex items-center gap-2 transition shadow-md hover:shadow-sm"
              >
                <Plus className="w-5 h-5" />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSalaries.map((salary) => (
            <div
              key={salary.id}
              className="bg-white rounded-sm shadow-sm hover:shadow-md transition border-t-4 border-orange-400"
            >
              <div className="p-6">
                {/* Employee Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {salary.employee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {salary.employee}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {salary.designation}
                      </p>
                      <p className="text-xs text-gray-500">
                        {salary.department}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${getStatusColor(
                      salary.status
                    )}`}
                  >
                    {salary.status}
                  </span>
                </div>

                {/* Salary Breakdown */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-sm p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Basic Salary</p>
                      <p className="text-sm font-semibold text-gray-800">
                        ₹{salary.basicSalary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Allowances</p>
                      <p className="text-sm font-semibold text-green-600">
                        +₹{salary.allowances.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Deductions</p>
                      <p className="text-sm font-semibold text-red-600">
                        -₹{salary.deductions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-orange-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        Net Salary
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{salary.netSalary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date Info */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>Payment Date: {salary.date}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {salary.status === "pending" && (
                    <button
                      onClick={() => handleMarkAsPaid(salary.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-sm transition font-medium"
                    >
                      <DollarSign className="w-4 h-4" />
                      Mark as Paid
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-sm transition">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-sm transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(salary.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-sm transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSalaries.length === 0 && (
          <div className="bg-white rounded-sm shadow-sm p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No salary records found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Add Salary Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Add Salary Record
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee Name*
                    </label>
                    <input
                      type="text"
                      value={formData.employee}
                      onChange={(e) =>
                        setFormData({ ...formData, employee: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation*
                    </label>

                    <select
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Designation</option>
                      {designations.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department*
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Date*
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basic Salary (₹)*
                    </label>
                    <input
                      type="number"
                      value={formData.basicSalary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basicSalary: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowances (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.allowances}
                      onChange={(e) =>
                        setFormData({ ...formData, allowances: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deductions (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.deductions}
                      onChange={(e) =>
                        setFormData({ ...formData, deductions: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-sm p-4">
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Net Salary
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        ₹{calculateNetSalary().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmitSalary}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-sm transition shadow-md hover:shadow-lg font-medium"
                  >
                    Add Salary Record
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({
                        employee: "",
                        designation: "",
                        department: "",
                        basicSalary: "",
                        allowances: "",
                        deductions: "",
                        date: "",
                      });
                    }}
                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50 py-3 rounded-sm transition font-medium"
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
