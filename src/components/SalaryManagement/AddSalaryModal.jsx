import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, Save, Calendar, User, Briefcase, Building2, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import { useGetOfferLettersQuery } from "../../store/api/offerLetterApi";
import { useGetEmployeeAttendanceQuery } from "../../store/api/attendanceApi";
import { useGetLeaveRequestsQuery } from "../../store/api/leaveApi";
import { useGetAllSalariesQuery } from "../../store/api/salaryApi";

const AddSalaryModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    Employee: "",
    designation: "",
    department: "",
    basic_salary: "",
    allowances: "0",
    deductions: "0",
    pay_date: new Date().toISOString().split("T")[0],
    start_date: "",
    end_date: "",
    working_days: "30",
    present_days: "0",
    leave_days: "0",
  });

  const { data: employeeData, isLoading: loadingEmployees } = useGetEmployeesQuery({ limit: 1000 });
  const { data: departmentData } = useGetDepartmentsQuery({ limit: 100 });
  const { data: designationData } = useGetDesignationsQuery({ limit: 100 });
  const { data: salaryData } = useGetAllSalariesQuery({});

  // Fetch offer letter for the selected employee
  const { data: offerLetterData } = useGetOfferLettersQuery(
    { search: employeeData?.employees?.find(e => e.id == formData.Employee)?.employee_name || "", status: 'All' },
    { skip: !formData.Employee }
  );

  // Fetch attendance and leaves
  const { data: attendanceData } = useGetEmployeeAttendanceQuery(formData.Employee, { skip: !formData.Employee });
  const { data: leaveData } = useGetLeaveRequestsQuery({ search: employeeData?.employees?.find(e => e.id == formData.Employee)?.employee_name || "", status: 'Approved' }, { skip: !formData.Employee });

  // Auto-fill from Offer Letter
  useEffect(() => {
    if (offerLetterData?.offerLetters?.length > 0 && formData.Employee) {
      const offer = offerLetterData.offerLetters[0];
      setFormData(prev => ({
        ...prev,
        designation: offer.designation || prev.designation,
        department: offer.department || prev.department,
        basic_salary: offer.basic_salary?.toString() || prev.basic_salary,
        allowances: offer.net_salary ? (offer.net_salary - offer.basic_salary).toString() : prev.allowances,
      }));
    }
  }, [offerLetterData, formData.Employee]);

  // Calculate days based on date range
  useEffect(() => {
    if (formData.start_date && formData.end_date && formData.Employee) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      // Calculate total working days in range
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Calculate present days from attendance
      const presentCount = attendanceData?.data?.filter(a => {
        const adate = new Date(a.date);
        return adate >= start && adate <= end;
      }).length || 0;

      // Calculate leave days from leaves
      const leaveCount = leaveData?.leave_requests?.filter(l => {
        const lstart = new Date(l.from_date || l.start_date);
        const lend = new Date(l.to_date || l.end_date);
        return (lstart >= start && lstart <= end) || (lend >= start && lend <= end);
      }).reduce((acc, curr) => acc + (Number(curr.days) || 0), 0) || 0;

      setFormData(prev => ({
        ...prev,
        working_days: diffDays.toString(),
        present_days: presentCount.toString(),
        leave_days: leaveCount.toString(),
      }));

      // Pro-rata basic salary calculation
      if (formData.basic_salary && diffDays > 0) {
        // Calculation logic if needed here, otherwise it's handled in net salary preview and payload
      }
    }
  }, [formData.start_date, formData.end_date, attendanceData, leaveData, formData.Employee]);

  const handleAdd = async () => {
    if (!formData.Employee || !formData.basic_salary || !formData.pay_date) {
      toast.error("Please fill all required fields");
      return;
    }

    const basic = Number(formData.basic_salary);
    const allow = Number(formData.allowances || 0);
    const deduct = Number(formData.deductions || 0);

    // Pro-rata adjustment if present days < working days
    const working = Number(formData.working_days) || 30;
    const present = (formData.present_days === "" || formData.present_days === null) ? working : Number(formData.present_days);
    const adjustedBasic = (basic / working) * present;

    const net = adjustedBasic + allow - deduct;

    const selectedEmployee = employeeData?.employees?.find(emp => emp.id == formData.Employee);

    const payload = {
      employee_id: parseInt(formData.Employee),
      employee_name: selectedEmployee?.employee_name || "",
      designation: formData.designation,
      department: formData.department,
      basic_salary: basic,
      allowances: allow,
      deductions: deduct,
      net_salary: net,
      pay_date: formData.pay_date,
      start_date: formData.start_date,
      end_date: formData.end_date,
      working_days: working,
      present_days: present,
    };

    try {
      await onSubmit(payload);
      toast.success("Salary added successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to add salary");
    }
  };

  // Helper to color dates
  const getDateStatus = (dateStr) => {
    const isPaid = salaryData?.salaries?.some(s => s.pay_date?.split('T')[0] === dateStr);
    if (isPaid) return 'text-green-600 font-bold';
    return 'text-orange-500';
  };

  const workingDaysValue = Number(formData.working_days) || 30;
  // Use present_days directly, only fallback to workingDaysValue if it's an empty string or null (not 0)
  const presentDaysValue = (formData.present_days === "" || formData.present_days === null) ? workingDaysValue : Number(formData.present_days);
  const basicSalaryValue = Number(formData.basic_salary) || 0;
  const allowancesValue = Number(formData.allowances) || 0;
  const deductionsValue = Number(formData.deductions) || 0;

  const adjustedBasic = (basicSalaryValue / workingDaysValue) * presentDaysValue;
  const calculatedNetSalary = adjustedBasic + allowancesValue - deductionsValue;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Salary"
      maxWidth="max-w-2xl"
      icon={
        <div className="bg-white p-2 rounded-xl text-orange-500 shadow-sm">
          <DollarSign size={24} />
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-xl border-t">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-sm font-semibold hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Processing..." : "Add Salary"}
          </button>
        </div>
      }
    >
      <div className="space-y-6 p-2 font-sans">
        {/* Employee Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <User size={16} className="text-[#FF7B1D]" /> Select Employee
            </label>
            <div className="relative">
              <select
                value={formData.Employee}
                onChange={(e) => setFormData({ ...formData, Employee: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-orange-500 outline-none transition-all font-medium text-sm bg-white"
                disabled={loadingEmployees}
              >
                <option value="">Select Employee</option>
                {employeeData?.employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.employee_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-[#FF7B1D]" /> Payment Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.pay_date}
                onChange={(e) => setFormData({ ...formData, pay_date: e.target.value })}
                className={`w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-orange-500 outline-none transition-all font-medium text-sm ${getDateStatus(formData.pay_date)}`}
              />
            </div>
            {salaryData?.salaries?.some(s => s.pay_date?.split('T')[0] === formData.pay_date) && (
              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 size={10} /> Salary already paid for this date
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Details - Auto filled */}
        <div className="grid grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-orange-600 uppercase">Department</label>
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <Building2 size={16} className="text-orange-400" />
              {formData.department || "N/A"}
            </div>
          </div>
          <div className="flex flex-col gap-1 border-l border-orange-200 pl-4">
            <label className="text-[10px] font-black text-orange-600 uppercase">Designation</label>
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <Briefcase size={16} className="text-orange-400" />
              {formData.designation || "N/A"}
            </div>
          </div>
        </div>

        {/* Calculation Range */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Clock size={16} className="text-orange-500" />
            Salary Calculation Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                setFormData
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-gray-200 p-2 rounded-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border border-gray-200 p-2 rounded-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm text-sm"
              />
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Working</div>
                <div className="text-lg font-black text-gray-700">{formData.working_days}</div>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="text-[10px] font-bold text-green-500 uppercase tracking-wide">Present</div>
                <div className="text-lg font-black text-green-600">{formData.present_days}</div>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">Leaves</div>
                <div className="text-lg font-black text-rose-600">{formData.leave_days}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-[#FF7B1D]" /> Basic Salary
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.basic_salary}
                onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-orange-500 outline-none font-bold text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-[#FF7B1D]" /> Allowances
            </label>
            <input
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-orange-500 outline-none text-green-600 font-bold text-sm"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-[#FF7B1D]" /> Deductions
            </label>
            <input
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-rose-500 outline-none text-rose-600 font-bold text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Net Salary Preview */}
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col gap-4 shadow-2xl transform hover:scale-[1.01] transition-all">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Payable Salary</span>
              <span className="text-[10px] text-orange-400 mt-0.5">* Adjusted for {presentDaysValue} present days</span>
            </div>
            <div className="text-3xl font-black text-white">
              ₹{Math.max(0, calculatedNetSalary).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-[10px] uppercase font-bold tracking-wider">
            <div className="text-gray-500 flex items-center gap-1">
              <Clock size={10} /> Base Adjusted:
            </div>
            <div className="text-right text-gray-300">
              ({basicSalaryValue.toLocaleString()} / {workingDaysValue}) × {presentDaysValue} = ₹{Math.round(adjustedBasic).toLocaleString()}
            </div>

            <div className="text-gray-500 flex items-center gap-1">
              <DollarSign size={10} /> Final Mods:
            </div>
            <div className="text-right text-gray-300">
              + ₹{allowancesValue.toLocaleString()} - ₹{deductionsValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSalaryModal;
