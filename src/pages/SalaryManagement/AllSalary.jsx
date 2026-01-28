import React, { useState, useRef, useEffect } from "react";
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
  Calculator,
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
import GenerateSalaryModal from "../../components/SalaryManagement/GenerateSalaryModal";
import usePermission from "../../hooks/usePermission";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";

export default function SalaryManagement() {
  /* ================= STATES ================= */
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [ViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const { data: deptData } = useGetDepartmentsQuery({ limit: 100 });
  const departments = deptData?.departments || [];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              {/* Filter Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-2 rounded-sm border transition shadow-sm ${isFilterOpen || selectedDepartment !== "all"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  title={selectedDepartment === "all" ? "Filter" : `Filter: ${selectedDepartment}`}
                >
                  <Filter size={20} />
                </button>

                {isFilterOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedDepartment("all");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedDepartment === "all"
                          ? "bg-orange-50 text-orange-600 font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        All Departments
                      </button>
                      {departments.map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() => {
                            setSelectedDepartment(dept.department_name);
                            setIsFilterOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedDepartment === dept.department_name
                            ? "bg-orange-50 text-orange-600 font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {dept.department_name}
                        </button>
                      ))}
                    </div>
                  </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {salaries.map((salary) => (
              <div
                key={salary.id}
                className="group relative bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${salary.status === "paid"
                      ? "bg-[#22c55e] text-white"
                      : "bg-orange-500 text-white animate-pulse"
                      }`}
                  >
                    {salary.status || "pending"}
                  </span>
                </div>

                {/* Top Border */}
                <div className="h-1.5 w-full bg-[#FF7B1D] rounded-t-lg"></div>

                <div className="p-6">
                  {/* Header: Profile & Identity */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-[#1a222c] flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-105">
                        {(salary.employee_name || "Name")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <DollarSign size={12} className="text-orange-500" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-[#1a222c] truncate uppercase tracking-tight">
                        {salary.employee_name || "Name"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                          {salary.designation}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                          {salary.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Salary Detail HUD */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-200 pb-4 mb-4">
                      <div className="border-r border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Basic</p>
                        <p className="text-sm font-bold text-slate-700">
                          ₹{(salary.basic_salary || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="border-r border-slate-200">
                        <p className="text-[10px] font-bold text-[#22c55e] uppercase tracking-widest mb-1">Allowances</p>
                        <p className="text-sm font-bold text-[#22c55e]">
                          +₹{(salary.allowances || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Deductions</p>
                        <p className="text-sm font-bold text-rose-500">
                          -₹{(salary.deductions || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                          <Calculator size={16} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Net Payable</p>
                          {salary.present_days !== undefined && (
                            <p className="text-[9px] text-orange-400 font-bold italic leading-none mt-1">
                              * Adjusted for {salary.present_days} present days
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#1a222c] tracking-tighter">
                          ₹{(salary.net_salary || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-col gap-1 mb-6 px-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Pay Date: <span className="text-slate-800">{formatDate(salary.pay_date)}</span>
                      </span>
                    </div>
                    {salary.start_date && salary.end_date && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-6">
                        Period: {formatDate(salary.start_date)} - {formatDate(salary.end_date)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {salary.status === "pending" && update && (
                      <button
                        onClick={() => handleMarkAsPaid(salary.id)}
                        className="flex-1 h-11 flex items-center justify-center gap-2 bg-[#22c55e] text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-[#16a34a] transition-all"
                      >
                        <DollarSign size={14} />
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedSalary(salary);
                        setGenerateModalOpen(true);
                      }}
                      className={`h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:from-orange-600 hover:to-orange-700 transform transition-all shadow-lg shadow-orange-100 ${salary.status === "paid" ? "flex-1" : "px-6"}`}
                    >
                      <Calculator size={14} className="text-white" />
                      Pay Slip
                    </button>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {read && (
                        <button
                          onClick={() => {
                            setSelectedSalary(salary);
                            setViewModalOpen(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {update && (
                        <button
                          onClick={() => {
                            setSelectedSalary(salary);
                            setEditModalOpen(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {remove && (
                        <button
                          onClick={() => {
                            setSelectedSalaryId(salary.id);
                            setOpenDelete(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
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

        {/* Modals */}
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
        <GenerateSalaryModal
          isOpen={generateModalOpen}
          onClose={() => {
            setGenerateModalOpen(false);
            setSelectedSalary(null);
          }}
          salary={selectedSalary}
        />
      </div>
    </DashboardLayout>
  );
}
