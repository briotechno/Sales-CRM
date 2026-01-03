import React, { useState } from "react";
import { DollarSign, Save } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const AddSalaryModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    Employee: "",
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

  const handleAdd = async () => {
    try {
      if (!formData.Employee) {
        toast.error("Employee is required");
        return;
      }

      if (!formData.basic_salary || !formData.pay_date) {
        toast.error("Basic salary and Pay date are required");
        return;
      }

      const basic = Number(formData.basic_salary);
      const allow = Number(formData.allowances || 0);
      const deduct = Number(formData.deductions || 0);
      const net = basic + allow - deduct;

      // Find employee name
      const selectedEmployee = employeeData?.employees?.find(emp => emp.id == formData.Employee);
      const employeeName = selectedEmployee ? selectedEmployee.employee_name : "";

      const payload = {
        employee_id: parseInt(formData.Employee),
        employee_name: employeeName,
        designation: formData.designation,
        department: formData.department,
        basic_salary: basic,
        allowances: allow,
        deductions: deduct,
        net_salary: net,
        pay_date: formData.pay_date,
      };

      await onSubmit(payload);
      toast.success("Salary added successfully");
      setFormData("")
      onClose();
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to add salary");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Salary"
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
            onClick={handleAdd}
            disabled={loading}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Add Salary"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Employee Select */}
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm font-medium text-gray-600">Employee</label>
          <select
            value={formData.Employee}
            onChange={(e) => setFormData({ ...formData, Employee: e.target.value })}
            className="border p-2"
            disabled={loadingEmployees}
          >
            <option value="">Select Employee</option>
            {employeeData?.employees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="border p-2"
            disabled={loadingDepartments}
          >
            <option value="">Select Department</option>
            {departmentData?.departments?.map((dept) => (
              <option key={dept.id} value={dept.department_name}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Designation</label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="border p-2"
            disabled={loadingDesignations}
          >
            <option value="">Select Designation</option>
            {designationData?.designations?.map((des) => (
              <option key={des.designation_name} value={des.designation_name}>
                {des.designation_name}
              </option>
            ))}
          </select>
        </div>

        {/* Pay Date */}
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFormData({ ...formData, pay_date: e.target.value })}
        />

        <input
          type="number"
          placeholder="Basic Salary"
          className="border p-2"
          onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
        />
        <input
          type="number"
          placeholder="Allowances"
          className="border p-2"
          onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
        />
        <input
          type="number"
          placeholder="Deductions"
          className="border p-2"
          onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
        />
      </div>
    </Modal>
  );
};

export default AddSalaryModal;
