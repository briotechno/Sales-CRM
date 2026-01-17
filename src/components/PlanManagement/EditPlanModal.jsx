import React, { useState, useEffect } from "react";
import { Package, DollarSign, Users, Zap, HardDrive, Layout, Loader2, Save, Plus, X, Check } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useUpdatePlanMutation } from "../../store/api/planApi";

const EditPlanModal = ({ isOpen, onClose, plan }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        key_features: [],
        price: 0,
        default_users: 0,
        default_leads: 0,
        default_storage: 0
    });
    const [currentFeature, setCurrentFeature] = useState("");

    const [updatePlan, { isLoading }] = useUpdatePlanMutation();

    useEffect(() => {
        if (plan) {
            setForm({
                name: plan.name || "",
                description: plan.description || "",
                key_features: plan.key_features ? plan.key_features.split(',').map(f => f.trim()).filter(f => f) : [],
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

    const addFeature = () => {
        if (!currentFeature.trim()) return;
        if (form.key_features.includes(currentFeature.trim())) {
            toast.error("Feature already added");
            return;
        }
        setForm(prev => ({
            ...prev,
            key_features: [...prev.key_features, currentFeature.trim()]
        }));
        setCurrentFeature("");
    };

    const removeFeature = (index) => {
        setForm(prev => ({
            ...prev,
            key_features: prev.key_features.filter((_, i) => i !== index)
        }));
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

                {/* Key Features */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Plus size={16} className="text-[#FF7B1D]" /> Key Features
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={currentFeature}
                            onChange={(e) => setCurrentFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                            placeholder="Add a feature (e.g. 24/7 Support)"
                            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                        />
                        <button
                            type="button"
                            onClick={addFeature}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-2 mt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {form.key_features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group hover:border-orange-200 hover:bg-white transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                                        <Check className="w-3.5 h-3.5 text-orange-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{feature}</span>
                                </div>
                                <button
                                    onClick={() => removeFeature(index)}
                                    className="p-1 px-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove Feature"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        {form.key_features.length === 0 && (
                            <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No features added yet</p>
                            </div>
                        )}
                    </div>
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
