// components/ProductKeys/EditProductKeyModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";

const EditProductKeyModal = ({ isOpen, onClose, productKey, onSave }) => {
    const [form, setForm] = useState({
        enterprise: "",
        plan: "",
        status: "",
        users: 0,
        generatedOn: "",
        expiresOn: "",
    });

    useEffect(() => {
        if (productKey) {
            setForm({
                enterprise: productKey.enterprise || "",
                plan: productKey.plan || "",
                status: productKey.status || "",
                users: productKey.users || 0,
                generatedOn: productKey.generatedOn || "",
                expiresOn: productKey.expiresOn || "",
            });
        }
    }, [productKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (onSave) onSave({ ...productKey, ...form });
        toast.success("Product key updated successfully!");
        onClose();
    };

    if (!productKey) return null;

    const footer = (
        <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
            >
                Save Changes
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Product Key"
            subtitle={productKey.id}
            icon={<KeyRound size={26} />}
            footer={footer}
        >
            <div className="space-y-4">
                {/* Enterprise */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Enterprise</label>
                    <input
                        type="text"
                        name="enterprise"
                        value={form.enterprise}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    />
                </div>

                {/* Plan */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Plan</label>
                    <select
                        name="plan"
                        value={form.plan}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    >
                        <option value="Basic">Basic</option>
                        <option value="Professional">Professional</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                {/* Users */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Users</label>
                    <input
                        type="number"
                        name="users"
                        value={form.users}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    />
                </div>

                {/* Generated On */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Generated On</label>
                    <input
                        type="date"
                        name="generatedOn"
                        value={form.generatedOn}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    />
                </div>

                {/* Expires On */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Expires On</label>
                    <input
                        type="date"
                        name="expiresOn"
                        value={form.expiresOn}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditProductKeyModal;
