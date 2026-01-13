import React, { useState } from "react";
import {
  CreditCard,
  Layers,
  Users,
  ToggleLeft,
  Calendar,
  RefreshCw,
  Zap,
  HardDrive,
  Plus,
  Trash2,
  Check,
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
    billingCycle: "Monthly",
    amount: "",
    expiryDate: "",
    leads: "",
    storage: "",
    features: [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [isAddingFeature, setIsAddingFeature] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) {
      toast.error("Feature description cannot be empty");
      return;
    }
    setForm({
      ...form,
      features: [...form.features, newFeature.trim()],
    });
    setNewFeature("");
    setIsAddingFeature(false);
    toast.success("Feature added");
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updatedFeatures });
    toast.success("Feature removed");
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
        className="px-6 py-2.5 border-2 border-gray-300 rounded-sm font-semibold hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>
      <button
        onClick={handleAdd}
        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-semibold shadow-md hover:shadow-lg transition-all"
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
        {/* Enterprise Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <CreditCard size={16} className="text-[#FF7B1D]" />
            Enterprise Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="TechVista Solutions"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Plan */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <Layers size={16} className="text-[#FF7B1D]" />
            Plan *
          </label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          >
            <option value="">-- Select Plan --</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        {/* Billing Cycle */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <RefreshCw size={16} className="text-[#FF7B1D]" />
            Billing Cycle *
          </label>
          <select
            name="billingCycle"
            value={form.billingCycle}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <CreditCard size={16} className="text-[#FF7B1D]" />
            Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="6499"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Users Limit */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <Users size={16} className="text-[#FF7B1D]" />
            User Limit
          </label>
          <input
            type="text"
            name="users"
            value={form.users}
            onChange={handleChange}
            placeholder="25"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Leads Limit */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <Zap size={16} className="text-[#FF7B1D]" />
            Leads Limit /mo
          </label>
          <input
            type="text"
            name="leads"
            value={form.leads}
            onChange={handleChange}
            placeholder="10000"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Storage Limit */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <HardDrive size={16} className="text-[#FF7B1D]" />
            Cloud Storage
          </label>
          <input
            type="text"
            name="storage"
            value={form.storage}
            onChange={handleChange}
            placeholder="50GB"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <ToggleLeft size={16} className="text-[#FF7B1D]" />
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Start Date *
          </label>
          <input
            type="date"
            name="onboardingDate"
            value={form.onboardingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Key Features Section */}
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Plus size={16} className="text-[#FF7B1D]" />
              Key Features
            </label>
            {!isAddingFeature && (
              <button
                onClick={() => setIsAddingFeature(true)}
                className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 hover:bg-orange-100 transition-all flex items-center gap-1"
              >
                <Plus size={14} /> Add Feature
              </button>
            )}
          </div>

          {isAddingFeature && (
            <div className="flex gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
              <input
                autoFocus
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. 24/7 Priority Support"
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white transition-all shadow-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
              />
              <button
                onClick={handleAddFeature}
                className="px-4 bg-orange-500 text-white rounded-lg shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center p-2"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setIsAddingFeature(false);
                  setNewFeature("");
                }}
                className="px-4 bg-white border text-gray-400 rounded-lg hover:bg-gray-100 transition-all p-2"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="space-y-2">
            {form.features.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {form.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm group hover:border-orange-200 transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      {feature}
                    </div>
                    <button
                      onClick={() => handleRemoveFeature(index)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingFeature && (
                <p className="text-xs text-center text-gray-400 font-medium py-4">
                  No features added yet. Click "Add Feature" to get started.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubscriptionModal;
