import React, { useState, useEffect } from "react";
import {
  Building2,
  Save,
  Mail,
  Loader2,
  User,
  Phone,
  Briefcase,
  FileText,
  MapPin,
  Calendar,
  ToggleLeft,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useUpdateEnterpriseMutation } from "../../store/api/enterpriseApi";

const EditEnterpriseModal = ({ isOpen, onClose, enterprise }) => {
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
    onboardingDate: "",
  });

  const [updateEnterprise, { isLoading }] = useUpdateEnterpriseMutation();

  useEffect(() => {
    if (enterprise) {
      setForm({
        firstName: enterprise.firstName || "",
        lastName: enterprise.lastName || "",
        email: enterprise.email || "",
        mobileNumber: enterprise.mobileNumber || "",
        businessName: enterprise.businessName || "",
        businessType: enterprise.businessType || "",
        gst: enterprise.gst || "",
        address: enterprise.address || "",
        plan: enterprise.plan || "Starter",
        status: enterprise.status || "Active",
        onboardingDate: enterprise.onboardingDate ? new Date(enterprise.onboardingDate).toISOString().split('T')[0] : "",
      });
    }
  }, [enterprise]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.businessName.trim() || !form.firstName.trim() || !form.email.trim()) {
      toast.error("Business name, First name, and Email are required");
      return;
    }

    try {
      await updateEnterprise({ id: enterprise.id, ...form }).unwrap();
      toast.success("Enterprise updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update enterprise");
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-orange-500/20"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Enterprise"
      subtitle={`Enterprise ID: ENT-${enterprise?.id}`}
      icon={<Building2 size={24} />}
      footer={footer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1">

        {/* First Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <User size={16} className="text-[#FF7B1D]" />
            First Name *
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="John"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <User size={16} className="text-[#FF7B1D]" />
            Last Name
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Mail size={16} className="text-[#FF7B1D]" />
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@company.com"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Phone size={16} className="text-[#FF7B1D]" />
            Mobile Number
          </label>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="+1 234 567 890"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Building2 size={16} className="text-[#FF7B1D]" />
            Business Name *
          </label>
          <input
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            placeholder="TechVista Solutions"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Briefcase size={16} className="text-[#FF7B1D]" />
            Business Type
          </label>
          <select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all cursor-pointer"
          >
            <option value="">Select Type</option>
            <option value="person">Person</option>
            <option value="organisation">Organisation</option>
          </select>
        </div>

        {/* GST */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <FileText size={16} className="text-[#FF7B1D]" />
            GST Number
          </label>
          <input
            name="gst"
            value={form.gst}
            onChange={handleChange}
            placeholder="GSTIN12345"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <MapPin size={16} className="text-[#FF7B1D]" />
            Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123 Main St"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Plan & Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Layers size={16} className="text-[#FF7B1D]" />
            Plan
          </label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all cursor-pointer"
          >
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <ToggleLeft size={16} className="text-[#FF7B1D]" />
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Onboarding Date
          </label>
          <input
            name="onboardingDate"
            type="date"
            value={form.onboardingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditEnterpriseModal;
