import React, { useEffect, useState } from "react";
import { DollarSign, Save } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const EditSalaryModal = ({ isOpen, onClose, salary, onSubmit, loading }: any) => {
  const [formData, setFormData] = useState({
    employee: "",
    designation: "",
    department: "",
    basic_salary: "",
    allowances: "",
    deductions: "",
    pay_date: "",
  });

  const { data: employeeData, isLoading: loadingEmployees } = useGetEmployeesQuery({
    limit: 100,
  });

  const { data: departmentData, isLoading: loadingDepartments } = useGetDepartmentsQuery({
    limit: 100,
  });

  const { data: designationData, isLoading: loadingDesignations } = useGetDesignationsQuery({
    limit: 100,
  });

  useEffect(() => {
    if (salary && isOpen) {
      setFormData({
        employee: salary.employee_name || "",
        designation: salary.designation || "",
        department: salary.department || "",
        basic_salary: salary.basic_salary?.toString() || "",
        allowances: salary.allowances?.toString() || "",
        deductions: salary.deductions?.toString() || "",
        pay_date: salary.pay_date
          ? salary.pay_date.split("T")[0]
          : "",
      });
    }
  }, [salary, isOpen]);

  const netSalary =
    Number(formData.basic_salary || 0) +
    Number(formData.allowances || 0) -
    Number(formData.deductions || 0);

  const handleSave = async () => {
    try {
      const payload = {
        employee_name: formData.employee,
        designation: formData.designation,
        department: formData.department,
        basic_salary: Number(formData.basic_salary),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
        pay_date: formData.pay_date,
      };

      await onSubmit(salary.id, payload);
      toast.success("Salary updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update salary");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Salary"
      subtitle={formData.employee}
      icon={
        <div className="bg-orange-500 p-2 rounded-xl text-white">
          <DollarSign size={22} />
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Update Salary"}
          </button>
        </div>
      }

    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm font-medium text-gray-600">Employee</label>
          <select
            value={formData.employee}
            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            className="border p-2"
            disabled={loadingEmployees}
          >
            <option value="">Select Employee</option>
            {employeeData?.employees?.map((emp: any) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Designation</label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="border p-2"
            disabled={loadingDesignations}
          >
            <option value="">Select Designation</option>
            {designationData?.designations?.map((des: any) => (
              <option key={des.designation_name} value={des.designation_name}>
                {des.designation_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="border p-2"
            disabled={loadingDepartments}
          >
            <option value="">Select Department</option>
            {departmentData?.departments?.map((dept: any) => (
              <option key={dept.id} value={dept.department_name}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Payment Date
          </label>
          <input
            type="date"
            value={formData.pay_date}
            onChange={(e) =>
              setFormData({ ...formData, pay_date: e.target.value })
            }
            className="border p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Basic Salary
          </label>
          <input
            type="number"
            value={formData.basic_salary}
            onChange={(e) =>
              setFormData({ ...formData, basic_salary: e.target.value })
            }
            className="border p-2"
            placeholder="Basic Salary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Allowances
          </label>
          <input
            type="number"
            value={formData.allowances}
            onChange={(e) =>
              setFormData({ ...formData, allowances: e.target.value })
            }
            className="border p-2"
            placeholder="Allowances"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Deductions
          </label>
          <input
            type="number"
            value={formData.deductions}
            onChange={(e) =>
              setFormData({ ...formData, deductions: e.target.value })
            }
            className="border p-2"
            placeholder="Deductions"
          />
        </div>
      </div>

      <p className="mt-4 font-bold text-right text-lg">
        Net Salary: <span className="text-orange-600">₹{netSalary}</span>
      </p>
    </Modal>
  );
};

export default EditSalaryModal;
