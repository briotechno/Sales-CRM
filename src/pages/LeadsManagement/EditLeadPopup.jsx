import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditLeadModal({ open, onClose, leadData, onSave }) {
  const [formData, setFormData] = useState({
    leadId: "",
    leadName: "",
    fullName: "",
    gender: "",
    email: "",
    mobileNumber: "",
    altMobileNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateCreated: "",
    value: "",
    dueDate: "",
    followUp: "",
    source: "",
    status: "Active",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Load incoming lead data
  useEffect(() => {
    if (leadData && open) {
      setFormData({
        leadId: leadData.id || "",
        leadName: leadData.leadName || "",
        fullName: leadData.fullName || "",
        gender: leadData.gender || "",
        email: leadData.email || "",
        mobileNumber: leadData.mobileNumber || "",
        altMobileNumber: leadData.altMobileNumber || "",
        address: leadData.address || "",
        city: leadData.city || "",
        state: leadData.state || "",
        pincode: leadData.pincode || "",
        dateCreated: leadData.dateCreated || "",
        value: leadData.value || "",
        dueDate: leadData.dueDate || "",
        followUp: leadData.followUp || "",
        source: leadData.source || "",
        status: leadData.status || "Active",
      });
      setImagePreview(leadData.profileImage || null);
      setProfileImage(null);
      setErrors({});
    }
  }, [leadData, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be below 4 MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload a valid image file",
        }));
        return;
      }

      setProfileImage(file);
      setErrors((prev) => ({ ...prev, image: "" }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("profile-image-input").click();
  };

  const handleCancelImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: "" }));
    const input = document.getElementById("profile-image-input");
    if (input) input.value = "";
  };

  // VALIDATION REMOVED — ALWAYS ALLOWS FORM SUBMISSION
  const validateForm = () => {
    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const dataToSave = {
      ...formData,
      profileImage,
    };

    onSave(dataToSave);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      leadId: "",
      leadName: "",
      fullName: "",
      gender: "",
      email: "",
      mobileNumber: "",
      altMobileNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      dateCreated: "",
      value: "",
      dueDate: "",
      followUp: "",
      source: "",
      status: "Active",
    });
    setProfileImage(null);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Edit Lead</h2>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600 transition text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Profile Image */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">
                  Upload Profile Image
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Image should be below 4 mb
                </p>
                {errors.image && (
                  <p className="text-xs text-red-500 mb-2">{errors.image}</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="file"
                    id="profile-image-input"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded hover:bg-orange-600 transition"
                  >
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelImage}
                    className="px-4 py-1.5 bg-white text-gray-700 text-sm font-semibold rounded border border-gray-300 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead ID */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Lead ID
              </label>
              <input
                type="text"
                value={formData.leadId}
                onChange={(e) => handleChange("leadId", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-gray-100"
                disabled
              />
            </div>

            {/* Lead Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Lead Name
              </label>
              <input
                type="text"
                value={formData.leadName}
                onChange={(e) => handleChange("leadName", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="Enter lead name"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="Enter full name"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="example@email.com"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="(193) 7839 748"
              />
            </div>

            {/* Alt Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Alt. Mobile Number
              </label>
              <input
                type="tel"
                value={formData.altMobileNumber}
                onChange={(e) =>
                  handleChange("altMobileNumber", e.target.value)
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="Alternative number"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="Austin, United States"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="Manchester"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="New Jersey"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="08759"
              />
            </div>

            {/* Date Created */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Date Created
              </label>
              <input
                type="datetime-local"
                value={formData.dateCreated}
                onChange={(e) => handleChange("dateCreated", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Value
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
                placeholder="₹35,00,000"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Follow Up */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Follow Up
              </label>
              <input
                type="date"
                value={formData.followUp}
                onChange={(e) => handleChange("followUp", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleChange("source", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-white"
              >
                <option value="">Select Source</option>
                <option value="Google">Google</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-gray-700 font-semibold rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
