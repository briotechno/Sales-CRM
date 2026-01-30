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
  const handleExport = async () => {
    if (!salaries.length) return alert("No salaries to export");

    try {
      // Dynamic import of jsPDF and autoTable
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for better table fit

      // Add company header with orange accent
      doc.setFillColor(255, 123, 29);
      doc.rect(0, 0, 297, 15, 'F');

      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text("SALARY MANAGEMENT REPORT", 148.5, 10, { align: 'center' });

      // Report details
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont(undefined, 'normal');

      const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.text(`Generated on: ${reportDate}`, 14, 27);
      doc.text(`Total Records: ${salaries.length}`, 14, 32);

      // Calculate summary
      const totalPayroll = salaries.reduce((sum, s) => sum + (Number(s.net_salary) || 0), 0);
      const totalPaid = salaries.filter(s => s.status === "paid").reduce((sum, s) => sum + (Number(s.net_salary) || 0), 0);
      const totalPending = salaries.filter(s => s.status !== "paid").reduce((sum, s) => sum + (Number(s.net_salary) || 0), 0);

      doc.text(`Total Payroll: Rs.${totalPayroll.toLocaleString('en-IN')}`, 90, 27);
      doc.text(`Paid: Rs.${totalPaid.toLocaleString('en-IN')}`, 90, 32);

      doc.text(`Pending: Rs.${totalPending.toLocaleString('en-IN')}`, 160, 27);
      doc.text(`Filter: ${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}`, 160, 32);

      // Prepare table data - clean formatting without rupee symbols in cells
      const tableData = salaries.map((s, index) => {
        const basicSalary = Number(s.basic_salary) || 0;
        const allowances = Number(s.allowances) || 0;
        const deductions = Number(s.deductions) || 0;
        const netSalary = Number(s.net_salary) || 0;

        return [
          (index + 1).toString(),
          s.employee_name || "-",
          s.designation || "-",
          s.department || "-",
          basicSalary.toLocaleString('en-IN'),
          allowances.toLocaleString('en-IN'),
          deductions.toLocaleString('en-IN'),
          netSalary.toLocaleString('en-IN'),
          (s.status || "pending").toUpperCase(),
          s.pay_date ? new Date(s.pay_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "-",
        ];
      });

      // Generate table using autoTable
      autoTable(doc, {
        head: [["#", "Employee Name", "Designation", "Department", "Basic Salary", "Allowances", "Deductions", "Net Salary", "Status", "Pay Date"]],
        body: tableData,
        startY: 38,
        theme: 'grid',
        headStyles: {
          fillColor: [255, 123, 29],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          cellPadding: 4,
        },
        styles: {
          fontSize: 8,
          cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
          1: { halign: 'left', cellWidth: 38 },
          2: { halign: 'left', cellWidth: 32 },
          3: { halign: 'left', cellWidth: 30 },
          4: { halign: 'right', cellWidth: 28 },
          5: { halign: 'right', cellWidth: 25 },
          6: { halign: 'right', cellWidth: 25 },
          7: { halign: 'right', cellWidth: 30, fontStyle: 'bold', textColor: [255, 123, 29] },
          8: { halign: 'center', cellWidth: 22 },
          9: { halign: 'center', cellWidth: 26 },
        },
        alternateRowStyles: {
          fillColor: [252, 252, 252],
        },
        didParseCell: function (data) {
          // Color code status column
          if (data.column.index === 8 && data.section === 'body') {
            const status = data.cell.raw;
            if (status === 'PAID') {
              data.cell.styles.textColor = [34, 197, 94];
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 253, 244];
            } else {
              data.cell.styles.textColor = [255, 123, 29];
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [255, 247, 237];
            }
          }
        },
      });

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 148.5, 205, { align: 'center' });
        doc.text('© Sales CRM - Salary Management System', 148.5, 209, { align: 'center' });
      }

      // Save PDF
      const fileName = `Salary_Report_${selectedDepartment === 'all' ? 'All' : selectedDepartment}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
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

        {/* Salary Table */}
        {salariesLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : salaries.length ? (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FF7B1D] text-white">
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">S.N</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Designation</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Basic</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Allowances</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Deductions</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Net Salary</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Pay Date</th>
                    <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salaries.map((salary, index) => (
                    <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#1a222c] flex items-center justify-center text-white font-bold text-sm">
                            {(salary.employee_name || "N")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{salary.employee_name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{salary.designation || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{salary.department || "-"}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{(salary.basic_salary || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">+₹{(salary.allowances || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">-₹{(salary.deductions || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-bold text-[#FF7B1D]">₹{(salary.net_salary || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${salary.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                            }`}
                        >
                          {salary.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(salary.pay_date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {salary.status === "pending" && update && (
                            <button
                              onClick={() => handleMarkAsPaid(salary.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Mark as Paid"
                            >
                              <DollarSign size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedSalary(salary);
                              setGenerateModalOpen(true);
                            }}
                            className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                            title="Pay Slip"
                          >
                            <Calculator size={16} />
                          </button>
                          {read && (
                            <button
                              onClick={() => {
                                setSelectedSalary(salary);
                                setViewModalOpen(true);
                              }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => {
                                setSelectedSalary(salary);
                                setEditModalOpen(true);
                              }}
                              className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => {
                                setSelectedSalaryId(salary.id);
                                setOpenDelete(true);
                              }}
                              className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
