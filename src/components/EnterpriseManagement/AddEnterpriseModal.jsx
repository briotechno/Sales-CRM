import React, { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Layers,
  ToggleLeft,
  Loader2,
  Phone,
  Briefcase,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useCreateEnterpriseMutation } from "../../store/api/enterpriseApi";

const AddEnterpriseModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    businessName: "",
    businessType: "",
    gst: "",
    address: "",
    plan: "Starter",
    status: "Active",
    onboardingDate: new Date().toISOString().split('T')[0],
  });

  const [createEnterprise, { isLoading }] = useCreateEnterpriseMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.firstName || !form.email || !form.mobileNumber || !form.businessName || !form.businessType || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createEnterprise(form).unwrap();
      toast.success("Enterprise added successfully");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        businessName: "",
        businessType: "",
        gst: "",
        address: "",
        plan: "Starter",
        status: "Active",
        onboardingDate: new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add enterprise");
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100 disabled:opacity-50 font-primary"
      >
        Cancel
      </button>
      <button
        onClick={handleAdd}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 font-primary"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {isLoading ? "Adding..." : "Add Enterprise"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Enterprise"
      subtitle="Create and onboard a new enterprise"
      icon={<Building2 size={24} />}
      footer={footer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1 p-2">

        {/* First Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User size={16} className="text-[#FF7B1D]" />
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="John"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User size={16} className="text-[#FF7B1D]" />
            Last Name
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Mail size={16} className="text-[#FF7B1D]" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@company.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Phone size={16} className="text-[#FF7B1D]" />
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="+1 234 567 890"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Building2 size={16} className="text-[#FF7B1D]" />
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            placeholder="TechVista Solutions"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Briefcase size={16} className="text-[#FF7B1D]" />
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm bg-white hover:border-gray-300 cursor-pointer"
          >
            <option value="">Select Type</option>
            <option value="person">Person</option>
            <option value="organisation">Organisation</option>
          </select>
        </div>

        {/* GST */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} className="text-[#FF7B1D]" />
            GST Number (Optional)
          </label>
          <input
            name="gst"
            value={form.gst}
            onChange={handleChange}
            placeholder="GSTIN12345"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin size={16} className="text-[#FF7B1D]" />
            Address <span className="text-red-500">*</span>
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300"
          />
        </div>

        {/* Plan & Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Layers size={16} className="text-[#FF7B1D]" />
            Plan <span className="text-red-500">*</span>
          </label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm bg-white hover:border-gray-300 cursor-pointer"
          >
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <ToggleLeft size={16} className="text-[#FF7B1D]" />
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm bg-white hover:border-gray-300 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Onboarding Date
          </label>
          <input
            name="onboardingDate"
            type="date"
            value={form.onboardingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm bg-gray-50 hover:bg-white hover:border-gray-300"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEnterpriseModal;
