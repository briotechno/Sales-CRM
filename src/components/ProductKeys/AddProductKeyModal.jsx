import React, { useState, useEffect } from "react";
import { KeyRound, Layers, Building2, Calendar, Users, Loader2 } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useCreateProductKeyMutation } from "../../store/api/productKeyApi";
import { useGetPlansQuery } from "../../store/api/planApi";
import { useGetEnterprisesQuery } from "../../store/api/enterpriseApi";

const AddProductKeyModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    enterprise: "",
    plan: "",
    validity: "1 Month",
    users: "",
  });

  const [createProductKey, { isLoading }] = useCreateProductKeyMutation();
  const { data: plansResponse, isLoading: isPlansLoading } = useGetPlansQuery();
  const plansList = plansResponse?.data || [];
  const { data: enterprisesResponse } = useGetEnterprisesQuery({ limit: 1000 });
  const enterprisesList = enterprisesResponse?.data || [];

  useEffect(() => {
    if (plansList.length > 0 && !form.plan) {
      setForm(prev => ({ ...prev, plan: plansList[0].name }));
    }
  }, [plansList]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    const { enterprise, plan, validity, users } = form;

    if (!enterprise || !plan || !validity || !users) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createProductKey(form).unwrap();
      toast.success("Product key generated successfully");
      setForm({
        enterprise: "",
        plan: plansList[0]?.name || "",
        validity: "1 Month",
        users: "",
      });
      onClose();
    } catch (error) {
      toast.error("Failed to generate key");
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
        onClick={handleGenerate}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {isLoading ? "Generating..." : "Generate Key"}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1 font-semibold">

        {/* Enterprise */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Building2 size={16} className="text-[#FF7B1D]" />
            Enterprise *
          </label>
          <select
            name="enterprise"
            value={form.enterprise}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer outline-none transition-all font-semibold"
          >
            <option value="">Select Enterprise</option>
            {enterprisesList.map(ent => (
              <option key={ent.id} value={ent.businessName}>{ent.businessName}</option>
            ))}
          </select>
        </div>

        {/* Plan */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Layers size={16} className="text-[#FF7B1D]" />
            Plan *
          </label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer outline-none transition-all font-semibold"
          >
            {isPlansLoading ? (
              <option>Loading plans...</option>
            ) : (
              plansList.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))
            )}
          </select>
        </div>

        {/* Validity */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Calendar size={16} className="text-[#FF7B1D]" />
            Validity *
          </label>
          <select
            name="validity"
            value={form.validity}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer outline-none transition-all font-semibold"
          >
            <option>1 Month</option>
            <option>3 Months</option>
            <option>1 Year</option>
          </select>
        </div>

        {/* Users */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
            <Users size={16} className="text-[#FF7B1D]" />
            Allowed Users *
          </label>
          <input
            name="users"
            type="number"
            value={form.users}
            onChange={handleChange}
            placeholder="50"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
          />
        </div>

      </div>
    </Modal>
  );
};

export default AddProductKeyModal;
