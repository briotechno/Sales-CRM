import React, { useState } from "react";
import {
  CreditCard,
  Layers,
  Users,
  ToggleLeft,
  Calendar,
} from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";

const AddSubscriptionModal = ({ isOpen, onClose, refetchDashboard }) => {
  const [form, setForm] = useState({
    name: "",
    plan: "",
    status: "Active",
    users: "",
    onboardingDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name || !form.plan || !form.onboardingDate) {
      toast.error("Please fill all required fields");
      return;
    }

    console.log("Subscription Data:", form);

    toast.success("Subscription added successfully");
    refetchDashboard?.();
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-2.5 border-2 border-gray-300 rounded-sm font-semibold hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        onClick={handleAdd}
        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-semibold shadow-md"
      >
        Add Subscription
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Subscription"
      subtitle="Create a new subscription plan"
      icon={<CreditCard size={24} />}
      footer={footer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Subscription Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <CreditCard size={16} className="text-[#FF7B1D]" />
            Subscription Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="TechVista Monthly"
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

        {/* Users */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Users size={16} className="text-[#FF7B1D]" />
            Total Users
          </label>
          <input
            type="number"
            name="users"
            value={form.users}
            onChange={handleChange}
            placeholder="100"
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
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

        {/* Onboarding Date */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Onboarding Date *
          </label>
          <input
            type="date"
            name="onboardingDate"
            value={form.onboardingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
        </div>

      </div>
    </Modal>
  );
};

export default AddSubscriptionModal;
