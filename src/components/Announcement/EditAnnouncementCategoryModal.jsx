import React, { useState, useEffect } from "react";
import { LayoutGrid, Save, Tag } from "lucide-react";
import { useUpdateAnnouncementCategoryMutation } from "../../store/api/announcementCategoryApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const EditAnnouncementCategoryModal = ({ isOpen, onClose, category }) => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Active");

    const [updateCategory, { isLoading }] = useUpdateAnnouncementCategoryMutation();

    useEffect(() => {
        if (category) {
            setName(category.name || "");
            setStatus(category.status || "Active");
        }
    }, [category]);

    const handleUpdate = async () => {
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            await updateCategory({ id: category.id, name, status }).unwrap();
            toast.success("Category updated successfully!");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Error updating category");
        }
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 rounded-sm text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Save size={18} />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Category"
            subtitle="Update category details"
            icon={<LayoutGrid size={24} />}
            footer={footer}
            maxWidth="max-w-lg"
        >
            <div className="space-y-5 text-black">
                {/* Category Name */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Tag size={16} className="text-[#FF7B1D]" />
                        Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        placeholder="e.g., Software Development"
                    />
                </div>

                {/* Status */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <LayoutGrid size={16} className="text-[#FF7B1D]" />
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};

export default EditAnnouncementCategoryModal;
