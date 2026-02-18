import React, { useState } from "react";
import { Package, DollarSign, Users, Zap, HardDrive, Layout, Loader2, Save, Plus, X, Check } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useCreatePlanMutation } from "../../store/api/planApi";

const AddPlanModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        key_features: [],
        price: 0,
        default_users: 0,
        monthly_leads: 0,
        default_storage: 0,
        upgradable_users: false,
        upgradable_storage: false,
        upgradable_leads: false,
        discount_12_months: 0,
        discount_6_months: 0,
        discount_3_months: 0,
    });
    const [currentFeature, setCurrentFeature] = useState("");

    const [createPlan, { isLoading }] = useCreatePlanMutation();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
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

    const handleAdd = async () => {
        if (!form.name || !form.price) {
            toast.error("Please fill required fields (Name and Price)");
            return;
        }

        try {
            await createPlan(form).unwrap();
            toast.success("Plan created successfully!");
            setForm({
                name: "",
                description: "",
                key_features: [],
                price: 0,
                default_users: 0,
                monthly_leads: 0,
                default_storage: 0,
                upgradable_users: false,
                upgradable_storage: false,
                upgradable_leads: false,
                discount_12_months: 0,
                discount_6_months: 0,
                discount_3_months: 0,
            });
            setCurrentFeature("");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create plan");
        }
    };

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
                onClick={handleAdd}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isLoading ? "Saving..." : "Create Plan"}
            </button>
        </>
    );

    const isStrictPlan = !form.upgradable_users && !form.upgradable_storage && !form.upgradable_leads;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Subscription Plan"
            subtitle="Define a new pricing level and its limits"
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
                        placeholder="e.g. Professional"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold text-sm"
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
                        placeholder="Brief overview of features..."
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold resize-none text-sm"
                    ></textarea>
                </div>

                {/* ── RESOURCE LIMITS & UPGRADES ── */}
                <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Resource Limits & Upgrades</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Users */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-bold mb-2 text-gray-700">
                                <Users size={14} className="text-[#FF7B1D]" /> Default Users
                            </label>
                            <input
                                type="number"
                                name="default_users"
                                value={form.default_users}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md mb-3 text-sm focus:border-orange-500 outline-none font-bold"
                            />
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="upgradable_users"
                                        checked={form.upgradable_users}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-[11px] font-bold text-gray-600">Upgradation Allowed</span>
                                </label>
                                {form.upgradable_users && (
                                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-100">
                                        <span className="text-[10px] font-bold text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="price_per_user"
                                            value={form.price_per_user}
                                            onChange={handleChange}
                                            placeholder="Price/User"
                                            className="w-full text-[11px] font-bold outline-none text-orange-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Storage */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-bold mb-2 text-gray-700">
                                <HardDrive size={14} className="text-[#FF7B1D]" /> Default Storage (GB)
                            </label>
                            <input
                                type="number"
                                name="default_storage"
                                value={form.default_storage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md mb-3 text-sm focus:border-orange-500 outline-none font-bold"
                            />
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="upgradable_storage"
                                        checked={form.upgradable_storage}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-[11px] font-bold text-gray-600">Upgradation Allowed</span>
                                </label>
                                {form.upgradable_storage && (
                                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-100">
                                        <span className="text-[10px] font-bold text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="price_per_gb"
                                            value={form.price_per_gb}
                                            onChange={handleChange}
                                            placeholder="Price/GB"
                                            className="w-full text-[11px] font-bold outline-none text-orange-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Leads */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-bold mb-2 text-gray-700">
                                <Zap size={14} className="text-[#00C853]" /> Monthly Leads
                            </label>
                            <input
                                type="number"
                                name="monthly_leads"
                                value={form.monthly_leads}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md mb-3 text-sm focus:border-green-500 outline-none font-bold"
                            />
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="upgradable_leads"
                                        checked={form.upgradable_leads}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-[11px] font-bold text-gray-600">Upgradation Allowed</span>
                                </label>
                                {form.upgradable_leads && (
                                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-100">
                                        <span className="text-[10px] font-bold text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="price_per_lead"
                                            value={form.price_per_lead}
                                            onChange={handleChange}
                                            placeholder="Price/Lead"
                                            className="w-full text-[11px] font-bold outline-none text-green-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isStrictPlan && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-md">
                            <p className="text-[11px] font-bold text-orange-700 italic">
                                Note: “This plan does not support upgrades. To increase users, storage, or leads, please upgrade to a higher plan.”
                            </p>
                        </div>
                    )}
                </div>

                {/* ── PRICING & DISCOUNTS ── */}
                <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pricing Configuration</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Base Price */}
                        <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 ring-1 ring-orange-100">
                            <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                                <DollarSign size={16} className="text-[#FF7B1D]" /> Base Monthly Amount (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Monthly base price..."
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-black text-xl text-orange-600 bg-white"
                            />
                        </div>

                        {/* Duration Discounts */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Zap size={14} className="text-orange-500" /> Duration Discounts (%)
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center justify-between bg-white border border-gray-200 p-2 px-3 rounded-md">
                                    <span className="text-xs font-bold text-gray-600">12 Months</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="discount_12_months"
                                            value={form.discount_12_months}
                                            onChange={handleChange}
                                            className="w-16 px-2 py-1 border rounded text-right text-xs font-bold outline-none border-orange-200"
                                        />
                                        <span className="text-xs text-gray-400">%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-white border border-gray-200 p-2 px-3 rounded-md">
                                    <span className="text-xs font-bold text-gray-600">6 Months</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="discount_6_months"
                                            value={form.discount_6_months}
                                            onChange={handleChange}
                                            className="w-16 px-2 py-1 border rounded text-right text-xs font-bold outline-none border-orange-200"
                                        />
                                        <span className="text-xs text-gray-400">%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-white border border-gray-200 p-2 px-3 rounded-md">
                                    <span className="text-xs font-bold text-gray-600">3 Months</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="discount_3_months"
                                            value={form.discount_3_months}
                                            onChange={handleChange}
                                            className="w-16 px-2 py-1 border rounded text-right text-xs font-bold outline-none border-orange-200"
                                        />
                                        <span className="text-xs text-gray-400">%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-2 px-3 rounded-md opacity-60">
                                    <span className="text-xs font-bold text-gray-600">1 Month</span>
                                    <span className="text-[10px] font-black text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded uppercase">Default 0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                        <Plus size={16} className="text-[#FF7B1D]" /> Extra Key Features
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={currentFeature}
                            onChange={(e) => setCurrentFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                            placeholder="Add a feature (e.g. 24/7 Support)"
                            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold text-sm bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={addFeature}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md text-sm active:scale-95"
                        >
                            Add
                        </button>
                    </div>

                    {/* Feature List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {form.key_features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100 group hover:border-orange-200 hover:bg-white transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                    <span className="text-xs font-bold text-gray-600">{feature}</span>
                                </div>
                                <button
                                    onClick={() => removeFeature(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddPlanModal;
