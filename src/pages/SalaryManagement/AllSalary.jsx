import React, { useState, useRef, useEffect, useMemo } from "react";
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
import NumberCard from "../../components/NumberCard";

export default function SalaryManagement() {
  /* ================= STATES ================= */
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [dateRange, setDateRange] = useState({ state: "All", start: "", end: "" });
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

  /* ================= API ================= */
  const { data, isLoading: salariesLoading } = useGetAllSalariesQuery({
    department: selectedDepartment === "all" ? "" : selectedDepartment,
  });

  const { data: deptData } = useGetDepartmentsQuery({ limit: 100 });
  const departments = deptData?.departments || [];

  const salaries = Array.isArray(data?.salaries) ? data.salaries : [];

  const [createSalary, { isLoading: creating }] = useCreateSalaryMutation();
  const [deleteSalary] = useDeleteSalaryMutation();
  const [updateSalary, { isLoading: updating }] =
    useUpdateSalaryMutation();

  /* ================= CALCULATIONS ================= */
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

  const getStatusClass = (status) =>
    status === "paid"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-orange-50 text-orange-700 border-orange-200";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setSelectedDepartment("all");
    setDateRange({ state: "All", start: "", end: "" });
    setIsFilterOpen(false);
  };

  const hasActiveFilters = selectedDepartment !== "all" || dateRange.state !== "All";

  /* ================= EXPORT FUNCTION ================= */
  const handleExport = async () => {
    if (!salaries.length) return toast.error("No salaries to export");

    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF('l', 'mm', 'a4');

      doc.setFillColor(255, 123, 29);
      doc.rect(0, 0, 297, 15, 'F');

      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text("SALARY MANAGEMENT REPORT", 148.5, 10, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont(undefined, 'normal');

      const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.text(`Generated on: ${reportDate}`, 14, 27);
      doc.text(`Total Records: ${salaries.length}`, 14, 32);

      doc.text(`Total Payroll: Rs.${totalPayroll.toLocaleString('en-IN')}`, 90, 27);
      doc.text(`Paid: Rs.${totalPaid.toLocaleString('en-IN')}`, 90, 32);

      doc.text(`Pending: Rs.${totalPending.toLocaleString('en-IN')}`, 160, 27);
      doc.text(`Filter: ${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}`, 160, 32);

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

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 148.5, 205, { align: 'center' });
        doc.text('© Sales CRM - Salary Management System', 148.5, 209, { align: 'center' });
      }

      const fileName = `Salary_Report_${selectedDepartment === 'all' ? 'All' : selectedDepartment}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleMarkAsPaid = async (salaryId) => {
    try {
      await updateSalary({
        id: salaryId,
        data: { status: "paid" },
      }).unwrap();
      toast.success("Marked as paid");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark salary as paid");
    }
  };

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Salary Management</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Salary
                  </span>
                </p>
              </div>

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
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Department Filter</span>
                      </div>
                      <div className="py-1 max-h-48 overflow-y-auto custom-scrollbar">
                        <button
                          onClick={() => { setSelectedDepartment("all"); setIsFilterOpen(false); }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${selectedDepartment === "all"
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
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${selectedDepartment === dept.department_name
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {dept.department_name}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Pay Date Range</span>
                      </div>
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "Custom"].map((option) => (
                          <div key={option}>
                            <button
                              onClick={() => {
                                setDateRange({ ...dateRange, state: option });
                                if (option !== "Custom") {
                                  setIsFilterOpen(false);
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateRange.state === option
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option}
                            </button>
                            {option === "Custom" && dateRange.state === "Custom" && (
                              <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                <input
                                  type="date"
                                  value={dateRange.start}
                                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <input
                                  type="date"
                                  value={dateRange.end}
                                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <button
                                  onClick={() => setIsFilterOpen(false)}
                                  className="w-full bg-orange-500 text-white text-[10px] font-bold py-2 rounded-sm"
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
                  onClick={handleExport}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-sm flex items-center gap-2 transition text-sm font-semibold shadow-sm active:scale-95"
                >
                  <Download className="w-5 h-5" /> EXPORT
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={!create}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={20} />
                  Add Salary
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <NumberCard
              title="Total Payroll"
              number={`₹${totalPayroll.toLocaleString()}`}
              icon={<DollarSign className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Paid This Month"
              number={`₹${totalPaid.toLocaleString()}`}
              icon={<TrendingUp className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Pending Payment"
              number={`₹${totalPending.toLocaleString()}`}
              icon={<Calendar className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
          </div>

          {/* Salary Table */}
          {salariesLoading ? (
            <div className="flex justify-center flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-semibold">Loading salary records...</p>
            </div>
          ) : salaries.length ? (
            <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm mt-4">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">S.N</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Employee</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Designation</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Department</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Basic</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Allowances</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Deductions</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Net Salary</th>
                    <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Status</th>
                    <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Pay Date</th>
                    <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {salaries.map((salary, index) => (
                    <tr key={salary.employee_id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700 font-medium">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px] border border-orange-200">
                            {(salary.employee_name || "N")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="font-bold text-gray-800">{salary.employee_name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{salary.designation || "-"}</td>
                      <td className="py-3 px-4 text-gray-700">{salary.department || "-"}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">₹{(salary.basic_salary || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-green-600">₹{(salary.allowances || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-red-600">₹{(salary.deductions || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-orange-600">₹{(salary.net_salary || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getStatusClass(salary.status)}`}
                        >
                          {salary.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700 font-medium">{formatDate(salary.pay_date)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          {salary.id ? (
                            <>
                              {salary.status === "pending" && update && (
                                <button
                                  onClick={() => handleMarkAsPaid(salary.id)}
                                  className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all font-medium"
                                  title="Mark as Paid"
                                >
                                  <DollarSign size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedSalary(salary);
                                  setGenerateModalOpen(true);
                                }}
                                className="p-1 hover:bg-orange-100 rounded-sm text-orange-500 hover:text-orange-700 transition-all font-medium"
                                title="Pay Slip"
                              >
                                <Calculator size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSalary(salary);
                                  setViewModalOpen(true);
                                }}
                                className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all font-medium"
                                title="View"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSalary(salary);
                                  setEditModalOpen(true);
                                }}
                                disabled={!update}
                                className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${update ? "text-green-500 hover:text-green-700" : "text-gray-300 cursor-not-allowed"}`}
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSalaryId(salary.id);
                                  setOpenDelete(true);
                                }}
                                disabled={!remove}
                                className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${remove ? "text-red-500 hover:text-red-700" : "text-gray-300 cursor-not-allowed"}`}
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            create && (
                              <button
                                onClick={() => {
                                  // Passing selected employee to AddSalaryModal
                                  // We might need to adjust AddSalaryModal to accept a pre-selected employee
                                  setSelectedSalary({ ...salary, Employee: salary.employee_id });
                                  setShowAddModal(true);
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-sm hover:bg-orange-600 transition-all"
                              >
                                <Plus size={12} /> ADD SALARY
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-sm shadow-sm p-20 text-center flex flex-col items-center gap-4 mt-6">
              <DollarSign size={64} className="text-gray-200" />
              <h3 className="text-xl font-bold text-gray-700">No salary records found</h3>
              <p className="text-gray-500">Try adjusting your filters or add a new record.</p>
            </div>
          )}

          {/* Modals */}
          <AddSalaryModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setSelectedSalary(null);
            }}
            onSubmit={handleSubmitSalary}
            loading={creating}
            initialSalary={selectedSalary}
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
      </div>
    </DashboardLayout>
  );
}
