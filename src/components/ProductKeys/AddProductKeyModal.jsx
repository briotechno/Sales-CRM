import React from "react";
import { KeyRound, Layers, Building2, Calendar, Users } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";

const AddProductKeyModal = ({
  isOpen,
  onClose,
  newKeyData,
  setNewKeyData,
  refetchDashboard,
}) => {
  const handleChange = (e) => {
    setNewKeyData({ ...newKeyData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    const { enterprise, plan, validity, users } = newKeyData;

    if (!enterprise || !plan || !validity || !users) {
      toast.error("Please fill all required fields");
      return;
    }

    // 🔥 API call future ma
    console.log("Product Key Data:", newKeyData);

    toast.success("Product key generated successfully");
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
        onClick={handleGenerate}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md"
      >
        Generate Key
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Product Key"
      subtitle="Create a new license key for enterprise"
      icon={<KeyRound size={24} />}
      footer={footer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Enterprise */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Building2 size={16} className="text-[#FF7B1D]" />
            Enterprise *
          </label>
          <select
            name="enterprise"
            value={newKeyData.enterprise}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:border-orange-500"
          >
            <option value="">-- Select Enterprise --</option>
            <option>TechVista Solutions</option>
            <option>Global Marketing Inc</option>
            <option>New Enterprise</option>
          </select>
        </div>

        {/* Plan */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Layers size={16} className="text-[#FF7B1D]" />
            Plan *
          </label>
          <select
            name="plan"
            value={newKeyData.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:border-orange-500"
          >
            <option value="">-- Select Plan --</option>
            <option>Basic</option>
            <option>Professional</option>
            <option>Enterprise</option>
          </select>
        </div>

        {/* Validity */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Validity *
          </label>
          <select
            name="validity"
            value={newKeyData.validity}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:border-orange-500"
          >
            <option value="">-- Select Validity --</option>
            <option>1 Month</option>
            <option>3 Months</option>
            <option>1 Year</option>
          </select>
        </div>

        {/* Users */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Users size={16} className="text-[#FF7B1D]" />
            Allowed Users *
          </label>
          <input
            name="users"
            type="number"
            value={newKeyData.users}
            onChange={handleChange}
            placeholder="50"
            className="w-full px-4 py-3 border rounded-lg focus:border-orange-500"
          />
        </div>

      </div>
    </Modal>
  );
};

export default AddProductKeyModal;
