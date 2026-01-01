import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateSalaryMutation } from "../../store/api/salaryApi";

const AddSalaryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    employee: "",
    designation: "",
    department: "",
    date: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const [createSalary, { isLoading }] = useCreateSalaryMutation();

  if (!isOpen) return null;

  const calculateNetSalary = () => {
    const basic = Number(formData.basicSalary) || 0;
    const allowances = Number(formData.allowances) || 0;
    const deductions = Number(formData.deductions) || 0;
    return basic + allowances - deductions;
  };

  const handleAdd = async () => {
    const { employee, designation, department, date, basicSalary, allowances, deductions } = formData;

    // Basic validation
    if (!employee || !designation || !department || !date || !basicSalary) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        ...formData,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
      };
      const result = await createSalary(payload).unwrap();
      console.log("Salary created:", result);
      toast.success("Salary added successfully");
      // Reset form after success
      setFormData({
        employee: "",
        designation: "",
        department: "",
        date: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
      });
      onClose();
    } catch (err) {
      console.error("API Error:", err);
      toast.error("err?.data?.message" || "Error creating salary record");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add Salary Record</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
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
          onClick={handleAdd}
          disabled={isLoading}
          className="mt-4 bg-orange-500 text-white px-4 py-2 w-full rounded-sm hover:shadow-lg transition disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Add Salary"}
        </button>
      </div>
    </div>
  );
};

export default AddSalaryModal;
