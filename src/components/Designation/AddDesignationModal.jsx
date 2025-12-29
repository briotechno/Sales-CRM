import React, { useState } from "react";
import { X, Briefcase, User, Image, FileText } from "lucide-react";

export default function AddDesignationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    department: "",
    name: "",
    image: null,
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department || !formData.name || !formData.image) {
      alert("Please fill all required fields!");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl mx-4 relative transform transition-all animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add Designation</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  Create a new role for your organization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Select Department */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Briefcase size={16} className="text-[#FF7B1D]" />
              Select Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 appearance-none cursor-pointer"
                required
              >
                <option value="">-- Choose Department --</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="IT Support">IT Support</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Designation Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={16} className="text-[#FF7B1D]" />
              Designation Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Software Engineer, Manager, Executive..."
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
              required
            />
          </div>

          {/* Upload Image */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Image size={16} className="text-[#FF7B1D]" />
              Upload Image <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all bg-white hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 512px × 512px or smaller
                </p>
              </div>
              {formData.image && (
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Preview
                  </p>
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
              name="description"
              placeholder="Describe the role's responsibilities and requirements..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 resize-none"
              rows="5"
            ></textarea>
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Optional: Add details about this designation</span>
              <span>{formData.description.length} characters</span>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all"
          >
            Add Designation
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Demo wrapper to show the modal
function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = (formData) => {
    console.log("New Designation:", formData);
    alert(`Designation "${formData.name}" added successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Open Add Designation Modal
        </button>
      </div>

      <AddDesignationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
