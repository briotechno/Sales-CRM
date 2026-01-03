import React, { useState } from "react";
import { FileText, Briefcase, User, AlignLeft } from "lucide-react";
import { useCreateTermMutation } from "../../store/api/termApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const AddTermModal = ({ isOpen, onClose }) => {
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({
    designation: "",
    department: "",
  });

  const [createTerm, { isLoading }] = useCreateTermMutation();

  const { data: departmentData, isLoading: loadingDepartments } = useGetDepartmentsQuery({
    limit: 100,
  });

  const { data: designationData, isLoading: loadingDesignations } = useGetDesignationsQuery({
    limit: 100,
  });

  const resetForm = () => {
    setDepartment("");
    setDesignation("");
    setTitle("");
    setDescription("");
  };

  const handleAdd = async () => {
    if (!department || !designation || !title.trim() || !description.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createTerm({
        department,
        designation,
        title,
        description,
      }).unwrap();

      toast.success("Terms & Conditions added successfully");
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add terms");
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>
      <button
        onClick={handleAdd}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Terms & Conditions"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Terms & Conditions"
      subtitle="Create a new policy for your organization"
      icon={<FileText size={24} />}
      footer={footer}
    >
      <div className="space-y-5">
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

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} className="text-[#FF7B1D]" />
            Policy Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <AlignLeft size={16} className="text-[#FF7B1D]" />
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddTermModal;
