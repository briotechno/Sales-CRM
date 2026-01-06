import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { useCreateAnnouncementCategoryMutation, useUpdateAnnouncementCategoryMutation } from "../../store/api/announcementCategoryApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddEditAnnouncementCategoryModal = ({ isOpen, onClose, category }) => {
    const [formData, setFormData] = useState({
        name: "",
        status: "Active",
    });

    const [createCategory, { isLoading: isCreating }] = useCreateAnnouncementCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateAnnouncementCategoryMutation();

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                status: category.status || "Active",
            });
        } else {
            setFormData({
                name: "",
                status: "Active",
            });
        }
    }, [category, isOpen]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            if (category) {
                await updateCategory({ id: category.id, ...formData }).unwrap();
                toast.success("Category updated successfully!");
            } else {
                await createCategory(formData).unwrap();
                toast.success("Category added successfully!");
            }
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Error saving category");
        }
    };

    const footer = (
        <div className="flex gap-3 justify-end w-full">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="category-form"
                disabled={isCreating || isUpdating}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
            >
                {isCreating || isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Send size={18} />
                )}
                {category ? "Update Changes" : "Save Category"}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={category ? "Edit Category" : "Add New Category"}
            maxWidth="max-w-lg"
            footer={footer}
        >
            <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                        required
                        placeholder="e.g., Software Development"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditAnnouncementCategoryModal;
