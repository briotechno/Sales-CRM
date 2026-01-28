import React, { useEffect, useState } from "react";
import { DollarSign, Save, Calendar, User, Briefcase, Building2, Clock, CheckCircle2 } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import { useGetAllSalariesQuery } from "../../store/api/salaryApi";
import { useGetEmployeeAttendanceQuery } from "../../store/api/attendanceApi";
import { useGetLeaveRequestsQuery } from "../../store/api/leaveApi";

const EditSalaryModal = ({ isOpen, onClose, salary, onSubmit, loading }: any) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    designation: "",
    department: "",
    basic_salary: "",
    allowances: "",
    deductions: "",
    pay_date: "",
    start_date: "",
    end_date: "",
    working_days: "30",
    present_days: "0",
  });

  const { data: employeeData, isLoading: loadingEmployees } = useGetEmployeesQuery({ limit: 1000 });
  const { data: departmentData } = useGetDepartmentsQuery({ limit: 100 });
  const { data: designationData } = useGetDesignationsQuery({ limit: 100 });
  const { data: salaryData } = useGetAllSalariesQuery({});

  // Fetch attendance and leaves for the current employee in the record
  const { data: attendanceData } = useGetEmployeeAttendanceQuery(formData.employee_id, { skip: !formData.employee_id });
  const { data: leaveData } = useGetLeaveRequestsQuery({ search: formData.employee_name || "", status: 'Approved' }, { skip: !formData.employee_name });

  useEffect(() => {
    if (salary && isOpen) {
      setFormData({
        employee_id: salary.employee_id || "",
        employee_name: salary.employee_name || "",
        designation: salary.designation || "",
        department: salary.department || "",
        basic_salary: salary.basic_salary?.toString() || "",
        allowances: salary.allowances?.toString() || "",
        deductions: salary.deductions?.toString() || "",
        pay_date: salary.pay_date ? salary.pay_date.split("T")[0] : "",
        start_date: salary.start_date ? salary.start_date.split("T")[0] : "",
        end_date: salary.end_date ? salary.end_date.split("T")[0] : "",
        working_days: salary.working_days?.toString() || "30",
        present_days: salary.present_days?.toString() || "0",
      });
    }
  }, [salary, isOpen]);

  // Recalculate if dates change
  useEffect(() => {
    if (formData.start_date && formData.end_date && formData.employee_id) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const presentCount = attendanceData?.data?.filter((a: any) => {
        const adate = new Date(a.date);
        return adate >= start && adate <= end;
      }).length || 0;

      setFormData(prev => ({
        ...prev,
        working_days: diffDays.toString(),
        present_days: presentCount.toString(),
      }));
    }
  }, [formData.start_date, formData.end_date, attendanceData]);

  const calculateNetSalary = () => {
    const basic = Number(formData.basic_salary || 0);
    const allow = Number(formData.allowances || 0);
    const deduct = Number(formData.deductions || 0);
    const working = Number(formData.working_days) || 30;
    // Fix: correct check for zero/empty
    const present = (formData.present_days === "" || formData.present_days === null) ? working : Number(formData.present_days);

    return ((basic / working) * present) + allow - deduct;
  };

  const workingDaysValue = Number(formData.working_days) || 30;
  const presentDaysValue = (formData.present_days === "" || formData.present_days === null) ? workingDaysValue : Number(formData.present_days);
  const basicSalaryValue = Number(formData.basic_salary) || 0;
  const allowancesValue = Number(formData.allowances) || 0;
  const deductionsValue = Number(formData.deductions) || 0;
  const adjustedBasic = (basicSalaryValue / workingDaysValue) * presentDaysValue;
  const netSalaryResult = calculateNetSalary();

  const handleSave = async () => {
    try {
      const working = Number(formData.working_days) || 30;
      const present = (formData.present_days === "" || formData.present_days === null) ? working : Number(formData.present_days);
      const basicValue = Number(formData.basic_salary);
      const adjustedBasic = (basicValue / working) * present;

      const payload = {
        employee_id: parseInt(formData.employee_id),
        employee_name: formData.employee_name,
        designation: formData.designation,
        department: formData.department,
        basic_salary: basicValue,
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
        net_salary: adjustedBasic + Number(formData.allowances) - Number(formData.deductions),
        pay_date: formData.pay_date,
        start_date: formData.start_date,
        end_date: formData.end_date,
        working_days: working,
        present_days: present,
      };

      await onSubmit(salary.id, payload);
      toast.success("Salary updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update salary");
    }
  };

  const getDateStatus = (dateStr: string) => {
    if (dateStr === salary?.pay_date?.split('T')[0]) return 'text-orange-600 font-bold'; // Current record
    const isPaid = salaryData?.salaries?.some((s: any) => s.pay_date?.split('T')[0] === dateStr);
    if (isPaid) return 'text-green-600 font-bold';
    return 'text-amber-500';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Salary"
      maxWidth="max-w-2xl"
      icon={
        <div className="bg-white p-2 rounded-xl text-orange-500 shadow-sm">
          <DollarSign size={24} />
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-xl border-t">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] transition-all"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Update Salary"}
          </button>
        </div>
      }
    >
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={formData.employee_id}
                onChange={(e) => {
                  const emp = employeeData?.employees?.find((ex: any) => ex.id == e.target.value);
                  setFormData({ ...formData, employee_id: e.target.value, employee_name: emp?.employee_name || "" });
                }}
                className="w-full border-2 border-gray-100 pl-10 pr-3 py-2.5 rounded-lg focus:border-orange-500 outline-none transition-all font-medium"
                disabled={loadingEmployees}
              >
                <option value="">Select Employee</option>
                {employeeData?.employees?.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>{emp.employee_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={formData.pay_date}
                onChange={(e) => setFormData({ ...formData, pay_date: e.target.value })}
                className={`w-full border-2 border-gray-100 pl-10 pr-3 py-2.5 rounded-lg focus:border-orange-500 outline-none transition-all font-medium ${getDateStatus(formData.pay_date)}`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
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
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Working Days</div>
                <div className="text-lg font-black text-gray-700">{formData.working_days}</div>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="text-[10px] font-bold text-green-500 uppercase tracking-wide">Present Days</div>
                <div className="text-lg font-black text-green-600">{formData.present_days}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Salary</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={formData.basic_salary}
                onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                className="w-full border-2 border-gray-100 pl-8 pr-3 py-2.5 rounded-lg focus:border-orange-500 outline-none font-bold"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Allowances</label>
            <input
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
              className="w-full border-2 border-gray-100 px-3 py-2.5 rounded-lg focus:border-orange-500 outline-none text-green-600 font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deductions</label>
            <input
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
              className="w-full border-2 border-gray-100 px-3 py-2.5 rounded-lg focus:border-rose-500 outline-none text-rose-600 font-bold"
            />
          </div>
        </div>

        {/* Net Salary Preview */}
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calculated Net Salary</span>
              <span className="text-[10px] text-orange-400 mt-0.5">* Adjusted for {presentDaysValue} present days</span>
            </div>
            <div className="text-2xl font-black text-white">
              ₹{Math.max(0, netSalaryResult).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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

export default EditSalaryModal;
