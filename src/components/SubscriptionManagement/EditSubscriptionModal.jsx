import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { CreditCard, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const EditSubscriptionModal = ({ isOpen, onClose, subscription, onSave }) => {
    const [form, setForm] = useState({
        name: "",
        plan: "",
        status: "",
        users: 0,
        onboardingDate: "",
    });

    useEffect(() => {
        if (subscription) {
            setForm({
                name: subscription.name,
                plan: subscription.plan,
                status: subscription.status,
                users: subscription.users,
                onboardingDate: subscription.onboardingDate,
            });
        }
    }, [subscription]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Call onSave prop to update subscription in parent
        if (onSave) onSave({ ...subscription, ...form });
        toast.success("Subscription updated successfully!");
        onClose();
    };

    if (!subscription) return null;

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
            title={`Edit Subscription`}
            subtitle={subscription.id}
            icon={<CreditCard size={26} />}
            footer={footer}
        >
            <div className="space-y-4">
                {/* NAME */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    />
                </div>

                {/* PLAN */}
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

                {/* STATUS */}
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
                        <option value="Trial">Trial</option>
                    </select>
                </div>

                {/* USERS */}
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

                {/* ONBOARDING DATE */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">Onboarding Date</label>
                    <input
                        type="date"
                        name="onboardingDate"
                        value={form.onboardingDate}
                        onChange={handleChange}
                        className="mt-1 border rounded-xl p-3"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditSubscriptionModal;
