import React, { useState, useEffect } from "react";
import { Package, DollarSign, Users, Zap, HardDrive, Layout, Loader2, Save } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useUpdatePlanMutation } from "../../store/api/planApi";

const EditPlanModal = ({ isOpen, onClose, plan }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: 0,
        default_users: 0,
        default_leads: 0,
        default_storage: 0
    });

    const [updatePlan, { isLoading }] = useUpdatePlanMutation();

    useEffect(() => {
        if (plan) {
            setForm({
                name: plan.name || "",
                description: plan.description || "",
                price: plan.price || 0,
                default_users: plan.default_users || 0,
                default_leads: plan.default_leads || 0,
                default_storage: plan.default_storage || 0
            });
        }
    }, [plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.name || !form.price) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            await updatePlan({ id: plan.id, ...form }).unwrap();
            toast.success("Plan updated successfully!");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update plan");
        }
    };

    if (!plan) return null;

    const footer = (
        <>
            <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
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
            title={`Edit Plan: ${plan.name}`}
            subtitle={"ID: PLAN-" + plan.id}
            icon={<Package size={24} />}
            footer={footer}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1 font-semibold">
                {/* Name */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Package size={16} className="text-[#FF7B1D]" /> Plan Name *
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Layout size={16} className="text-[#FF7B1D]" /> Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold resize-none"
                    ></textarea>
                </div>

                {/* Price */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <DollarSign size={16} className="text-[#FF7B1D]" /> Monthly Price (₹) *
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Users */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Users size={16} className="text-[#FF7B1D]" /> Default Users
                    </label>
                    <input
                        type="number"
                        name="default_users"
                        value={form.default_users}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Leads */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Zap size={16} className="text-[#FF7B1D]" /> Monthly Leads Limit
                    </label>
                    <input
                        type="number"
                        name="default_leads"
                        value={form.default_leads}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Storage */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <HardDrive size={16} className="text-[#FF7B1D]" /> Default Storage (GB)
                    </label>
                    <input
                        type="number"
                        name="default_storage"
                        value={form.default_storage}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditPlanModal;
