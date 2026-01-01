import React, { useEffect, useState } from "react";
import { FileText, Building, Briefcase, AlignLeft, Save } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";

const EditTermModal = ({ isOpen, onClose, term, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    title: "",
    description: "",
  });

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
        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <Save size={18} />
        {loading ? "Saving..." : "Update Term"}
      </button>
    </div>
  );

  const icon = (
    <div className="bg-orange-500 text-white p-2 rounded-xl">
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
          <label className="text-sm font-bold text-gray-500 flex items-center gap-2 mb-2">
            <Building size={16} /> Department
          </label>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="text-sm font-bold text-gray-500 flex items-center gap-2 mb-2">
            <Briefcase size={16} /> Designation
          </label>
          <select
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">Select Designation</option>
            <option value="Manager">Manager</option>
            <option value="Engineer">Engineer</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-bold text-gray-500 flex items-center gap-2 mb-2">
            <FileText size={16} /> Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter term title"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-bold text-gray-500 flex items-center gap-2 mb-2">
            <AlignLeft size={16} /> Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter detailed description"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditTermModal;
