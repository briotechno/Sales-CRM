import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { KeyRound, Building2, Layers, ToggleLeft, Users, Calendar, Loader2, Save, Zap, HardDrive } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateProductKeyMutation } from "../../store/api/productKeyApi";
import { useGetPlansQuery } from "../../store/api/planApi";
import { useGetEnterprisesQuery } from "../../store/api/enterpriseApi";

const EditProductKeyModal = ({ isOpen, onClose, productKey }) => {
    const [form, setForm] = useState({
        enterprise: "",
        plan: "Starter",
        status: "Pending",
        users: 0,
        leads: 0,
        storage: 0,
        validity: "1 Month",
        expiresOn: "",
    });

    const [updateProductKey, { isLoading }] = useUpdateProductKeyMutation();
    const { data: plansResponse } = useGetPlansQuery();
    const plansList = plansResponse?.data || [];
    const { data: enterprisesResponse } = useGetEnterprisesQuery({ limit: 1000 });
    const enterprisesList = enterprisesResponse?.data || [];

    useEffect(() => {
        if (productKey) {
            setForm({
                enterprise: productKey.enterprise || "",
                plan: productKey.plan || "Starter",
                status: productKey.status || "Pending",
                users: productKey.users || 0,
                leads: productKey.leads || 0,
                storage: productKey.storage || 0,
                validity: productKey.validity || "1 Month",
                expiresOn: productKey.expiresOn ? new Date(productKey.expiresOn).toISOString().split('T')[0] : "",
            });
        }
    }, [productKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.enterprise || !form.users) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            await updateProductKey({ id: productKey.id, ...form }).unwrap();
            toast.success("Product key updated successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to update product key");
        }
    };

    if (!productKey) return null;

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
            title="Edit Product Key"
            subtitle={"Editing details for ID: KEY-" + productKey.id}
            icon={<KeyRound size={26} />}
            footer={footer}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1 font-semibold">
                {/* Enterprise */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Building2 size={16} className="text-[#FF7B1D]" /> Enterprise
                    </label>
                    <select
                        name="enterprise"
                        value={form.enterprise}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer outline-none transition-all font-semibold"
                    >
                        {enterprisesList.map(ent => (
                            <option key={ent.id} value={ent.businessName}>{ent.businessName}</option>
                        ))}
                    </select>
                </div>

                {/* Plan */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Layers size={16} className="text-[#FF7B1D]" /> Plan
                    </label>
                    <select
                        name="plan"
                        value={form.plan}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer outline-none transition-all font-semibold"
                    >
                        {plansList.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <ToggleLeft size={16} className="text-[#FF7B1D]" /> Status
                    </label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer outline-none transition-all font-semibold"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                {/* Validity */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Calendar size={16} className="text-[#FF7B1D]" /> Validity
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
                        <Users size={16} className="text-[#FF7B1D]" /> Users
                    </label>
                    <input
                        type="number"
                        name="users"
                        value={form.users}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Expires On */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Calendar size={16} className="text-[#FF7B1D]" /> Expires On
                    </label>
                    <input
                        type="date"
                        name="expiresOn"
                        value={form.expiresOn}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Leads */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <Zap size={16} className="text-[#FF7B1D]" /> Monthly Leads
                    </label>
                    <input
                        type="number"
                        name="leads"
                        value={form.leads}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>

                {/* Storage */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-1 text-gray-700">
                        <HardDrive size={16} className="text-[#FF7B1D]" /> Storage (GB)
                    </label>
                    <input
                        type="number"
                        name="storage"
                        value={form.storage}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditProductKeyModal;
