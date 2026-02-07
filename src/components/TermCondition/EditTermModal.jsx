import React, { useEffect, useState } from "react";
import { FileText, Briefcase, User, AlignLeft, Save } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const EditTermModal = ({ isOpen, onClose, term, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    title: "",
    description: "",
  });

  /* API Data */
  const { data: deptData } = useGetDepartmentsQuery({ limit: 100 });
  const { data: desigData } = useGetDesignationsQuery({ limit: 100 });

  const departments = deptData?.departments || [];
  const designations = desigData?.designations || [];

  /* Prefill data */
  useEffect(() => {
    if (term) {
      setFormData({
        department: term.department || "",
        designation: term.designation || "",
        title: term.title || "",
        description: term.description || "",
      });
    }
  }, [term]);

  if (!term) return null;

  const handleSave = async () => {
    try {
      await onSubmit(term.id, formData); // call parent update function
      toast.success("Term updated successfully"); // ✅ success toast
      onClose(); // close modal
    } catch (err) {
      toast.error(err?.message || "Failed to update term"); // ✅ error toast
    }
  };

  const footer = (
    <div className="flex gap-3 justify-end">
      <button
        onClick={onClose}
        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <Save size={18} />
        {loading ? "Saving..." : "Update Term"}
      </button>
    </div>
  );

  const icon = (
    <div className="bg-orange-500 text-white p-2 rounded-lg">
      <FileText size={22} />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Term & Condition"
      subtitle={term.title}
      icon={icon}
      footer={footer}
    >
      <div className="space-y-6 text-black">
        {/* Department */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Briefcase size={16} className="text-[#FF7B1D]" />
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.department_name}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User size={16} className="text-[#FF7B1D]" />
            Designation
          </label>
          <select
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm font-medium"
          >
            <option value="">Select Designation</option>
            {designations.map((dsg) => (
              <option key={dsg.id} value={dsg.designation_name}>
                {dsg.designation_name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} className="text-[#FF7B1D]" />
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            maxLength={100}
            placeholder="Enter term title"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
          />
          <p className={`text-[10px] mt-1 text-right font-bold tracking-tight ${formData.title.length >= 100 ? 'text-red-500' : 'text-gray-400'}`}>
            {formData.title.length} / 100 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <AlignLeft size={16} className="text-[#FF7B1D]" />
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter detailed description"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditTermModal;
