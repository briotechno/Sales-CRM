import React, { useState } from "react";
import { Briefcase, User, Image, FileText } from "lucide-react";
import { useCreateDesignationMutation } from "../../store/api/designationApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddDesignationModal = ({ isOpen, onClose }) => {
  const [designationName, setDesignationName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [description, setDescription] = useState("");
  const [designationImage, setDesignationImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: departmentsData } = useGetDepartmentsQuery({ limit: 100 });
  const [createDesignation, { isLoading }] = useCreateDesignationMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesignationImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!designationName.trim() || !departmentId) {
      toast.error("Designation Name and Department are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("designation_name", designationName);
      formData.append("department_id", departmentId);
      formData.append("description", description);
      formData.append("status", "Active");
      if (designationImage) {
        formData.append("image", designationImage);
      }

      await createDesignation(formData).unwrap();

      toast.success("Designation added successfully");
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add designation");
    }
  };

  const resetForm = () => {
    setDesignationName("");
    setDepartmentId("");
    setDescription("");
    setDesignationImage(null);
    setImagePreview(null);
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
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Designation"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Designation"
      subtitle="Create a new role for your organization"
      icon={<User size={24} />}
      footer={footer}
    >
      <div className="space-y-5">
        {/* Select Department */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Briefcase size={16} className="text-[#FF7B1D]" />
            Select Department <span className="text-red-500">*</span>
          </label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 cursor-pointer"
          >
            <option value="">-- Choose Department --</option>
            {departmentsData?.departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Name */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User size={16} className="text-[#FF7B1D]" />
            Designation Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
            placeholder="e.g., Software Engineer, Manager, Executive..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
          />
        </div>

        {/* Designation Image */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Image size={16} className="text-[#FF7B1D]" />
            Upload Image
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all bg-white hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
            {imagePreview && (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} className="text-[#FF7B1D]" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role's responsibilities and requirements..."
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddDesignationModal;
