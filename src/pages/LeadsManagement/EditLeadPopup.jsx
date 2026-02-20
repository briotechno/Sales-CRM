import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar,
  DollarSign,
  Zap,
  Camera,
  Trash2,
  ChevronDown,
  Globe,
  Activity
} from "lucide-react";

export default function EditLeadModal({ open, onClose, leadData, onSave }) {
  const { data: employeesData } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });
  const employees = employeesData?.employees || [];

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    fullName: "",
    gender: "Male",
    email: "",
    phone: "",
    altMobileNumber: "",
    address: "",
    city: "Manchester",
    state: "New Jersey",
    pincode: "08759",
    dateCreated: "",
    value: "",
    dueDate: "",
    followUp: "",
    source: "Google",
    status: "Active",
    visibility: "Private",
    company: "",
    tag: "Contacted",
    tags: "",
    services: "",
    priority: "High",
    ownerName: "",
    leadOwner: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Load incoming lead data
  useEffect(() => {
    if (leadData && open) {
      setFormData({
        id: leadData.id || "",
        name: leadData.name || "",
        fullName: leadData.fullName || leadData.name || "",
        gender: leadData.gender || "Male",
        email: leadData.email || "",
        phone: leadData.phone || "",
        altMobileNumber: leadData.altMobileNumber || "-",
        address: leadData.address || "",
        city: leadData.city || "Manchester",
        state: leadData.state || "New Jersey",
        pincode: leadData.pincode || "08759",
        dateCreated: leadData.dateCreated || "",
        value: leadData.value || "",
        dueDate: leadData.dueDate || "",
        followUp: leadData.followUp || "",
        source: leadData.source || "Google",
        status: leadData.status || "Active",
        visibility: leadData.visibility || "Private",
        company: leadData.company || "",
        tag: leadData.tag || "Contacted",
        tags: Array.isArray(leadData.tags) ? leadData.tags.join(', ') : (leadData.tags || ""),
        services: Array.isArray(leadData.services) ? leadData.services.join(', ') : (leadData.services || ""),
        priority: leadData.priority || "High",
        ownerName: leadData.assigned_to || "",
        leadOwner: leadData.lead_owner || (leadData.owner && leadData.owner.name) || ""
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const selectedOwner = employees.find(e => e.id == formData.ownerName);
      const ownerNameText = String(selectedOwner?.employee_name || formData.ownerName || "");

      const dataToSave = {
        ...formData,
        ownerNameText,
        lead_owner: formData.leadOwner,
        profileImage,
      };

      await onSave(dataToSave);
      toast.success("Lead details updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update lead details. Please try again.");
      console.error("Update error:", error);
    }
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
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-50 rounded-t-sm shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-2.5 rounded-sm">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white capitalize tracking-wide leading-tight">
                Edit Lead Details
              </h2>
              <p className="text-xs text-orange-50 font-medium opacity-90">
                Update lead information and profile details
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Profile Image */}
          <div className="mb-8">
            <div className="bg-white border border-gray-200 p-5 rounded shadow-sm hover:border-orange-200 transition-all">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-100 shadow-md">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-gray-300" />
                    )}
                  </div>
                  <button
                    onClick={handleUploadClick}
                    className="absolute bottom-0 right-0 p-2 bg-[#FF7B1D] text-white rounded-full shadow-lg hover:bg-orange-600 transition-all active:scale-90"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-gray-700 mb-1 capitalize tracking-wide">
                    Lead Profile Image
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 font-medium">
                    Recommended size: 400x400px (Max 4MB)
                  </p>
                  {errors.image && (
                    <p className="text-xs text-red-500 mb-3 flex items-center gap-1 font-bold">
                      <Trash2 size={12} /> {errors.image}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <input
                      type="file"
                      id="profile-image-input"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleCancelImage}
                        className="px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-sm border border-red-100 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 capitalize tracking-wide shadow-sm"
                      >
                        <Trash2 size={14} /> Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lead ID */}
            <div className="md:col-span-2 bg-gray-50/50 p-4 rounded-sm border border-dashed border-gray-200">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 capitalize tracking-wide">
                <Hash size={14} /> System Lead ID (Read-Only)
              </label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-sm bg-gray-100 text-gray-500 cursor-not-allowed outline-none shadow-sm"
                disabled
              />
            </div>

            {/* Lead Name */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Zap size={14} className="text-[#FF7B1D]" /> Lead Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
                placeholder="Ex: John Cooper"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <User size={14} className="text-[#FF7B1D]" /> Full Contact Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
                placeholder="Legal full name"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Activity size={14} className="text-[#FF7B1D]" /> Gender
              </label>
              <div className="relative group">
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#FF7B1D] transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Mail size={14} className="text-[#FF7B1D]" /> Primary Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
                placeholder="example@sales.com"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Phone size={14} className="text-[#FF7B1D]" /> Mobile Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Zap size={14} className="text-[#FF7B1D]" /> Lead Status
              </label>
              <div className="relative group">
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#FF7B1D] transition-colors" />
              </div>
            </div>

            {/* Company & Visibility Section */}
            <div className="md:col-span-2 grid grid-cols-2 gap-6 bg-orange-50/30 p-4 border border-orange-100/50 rounded-sm shadow-sm">
              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold text-orange-600 mb-2 capitalize">
                  <Globe size={14} /> Visibility
                </label>
                <div className="relative group">
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleChange("visibility", e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold border border-orange-200 rounded-sm bg-white text-orange-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                    <option value="Team Only">Team Only</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none group-hover:text-orange-600" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold text-orange-600 mb-2 capitalize">
                  <Activity size={14} /> Estimated Value
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-orange-200 rounded-sm bg-white text-orange-700 outline-none shadow-sm"
                  placeholder="₹0.00"
                />
              </div>
            </div>

            {/* Address Details */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <MapPin size={14} className="text-[#FF7B1D]" /> Street Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm resize-none"
                rows={3}
                placeholder="Full office or home address..."
              />
            </div>

            {/* Location Grid */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize tracking-wide">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm outline-none focus:border-[#FF7B1D] bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize tracking-wide">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm outline-none focus:border-[#FF7B1D] bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize tracking-wide">Zip Code</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm outline-none focus:border-[#FF7B1D] bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Timeline Details */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Calendar size={14} className="text-[#FF7B1D]" /> Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Phone size={14} className="text-[#FF7B1D]" /> Follow Up Date
              </label>
              <input
                type="date"
                value={formData.followUp}
                onChange={(e) => handleChange("followUp", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm"
              />
            </div>

            {/* Priority & Pipeline Tag */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Activity size={14} className="text-[#FF7B1D]" /> Priority
              </label>
              <div className="relative group">
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#FF7B1D] transition-colors" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Activity size={14} className="text-[#FF7B1D]" /> Pipeline Tag
              </label>
              <div className="relative group">
                <select
                  value={formData.tag}
                  onChange={(e) => handleChange("tag", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Not Contacted">Not Contacted</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#FF7B1D] transition-colors" />
              </div>
            </div>

            {/* Tags & Services */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Activity size={14} className="text-[#FF7B1D]" /> Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
                placeholder="Ex: Collab, Rated, VIP"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Activity size={14} className="text-[#FF7B1D]" /> Services (Comma separated)
              </label>
              <input
                type="text"
                value={formData.services}
                onChange={(e) => handleChange("services", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
                placeholder="Ex: Product Demo, Pricing Info"
              />
            </div>

            {/* Owner & Assign to */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <User size={14} className="text-[#FF7B1D]" /> Owner
              </label>
              <div className="relative group">
                <input
                  type="text"
                  disabled
                  value={formData.leadOwner || ""}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm bg-gray-50 text-sm text-gray-500 cursor-not-allowed outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <User size={14} className="text-[#FF7B1D]" /> Assign to
              </label>
              <div className="relative group">
                <select
                  value={formData.ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">Select Option</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#FF7B1D] transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 -mx-0 -mb-0 rounded-b-sm">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 text-sm"
          >
            <Zap size={18} className="fill-white" /> Save Updates
          </button>
        </div>
      </div>
    </div>
  );
}
