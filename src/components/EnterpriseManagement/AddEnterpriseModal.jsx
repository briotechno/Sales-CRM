import React, { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Users,
  Layers,
  ToggleLeft,
} from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";

const AddEnterpriseModal = ({ isOpen, onClose, refetchDashboard }) => {
  const [form, setForm] = useState({
    name: "",
    owner: "",
    email: "",
    plan: "",
    status: "Active",
    users: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name || !form.owner || !form.email || !form.plan) {
      toast.error("Please fill all required fields");
      return;
    }

    // 🔥 API call future ma
    console.log("Enterprise Data:", form);

    toast.success("Enterprise added successfully");
    refetchDashboard?.();
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        onClick={handleAdd}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md"
      >
        Add Enterprise
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Enterprise Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Building2 size={16} className="text-[#FF7B1D]" />
            Enterprise Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="TechVista Solutions"
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
        </div>

        {/* Owner */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <User size={16} className="text-[#FF7B1D]" />
            Owner Name *
          </label>
          <input
            name="owner"
            value={form.owner}
            onChange={handleChange}
            placeholder="Harsh Patel"
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Mail size={16} className="text-[#FF7B1D]" />
            Email *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@company.com"
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
        </div>

        {/* Users */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Users size={16} className="text-[#FF7B1D]" />
            Total Users
          </label>
          <input
            name="users"
            type="number"
            value={form.users}
            onChange={handleChange}
            placeholder="50"
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
        </div>

        {/* Plan */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Layers size={16} className="text-[#FF7B1D]" />
            Plan *
          </label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:border-orange-500"
          >
            <option value="">-- Select Plan --</option>
            <option value="Basic">Basic</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <ToggleLeft size={16} className="text-[#FF7B1D]" />
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:border-orange-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default AddEnterpriseModal;
