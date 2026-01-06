import React, { useState } from "react";
import { LayoutGrid, Send, Tag } from "lucide-react";
import { useCreateAnnouncementCategoryMutation } from "../../store/api/announcementCategoryApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddAnnouncementCategoryModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Active");

    const [createCategory, { isLoading }] = useCreateAnnouncementCategoryMutation();

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            await createCategory({ name, status }).unwrap();
            toast.success("Category added successfully!");
            setName("");
            setStatus("Active");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Error saving category");
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
                onClick={handleAdd}
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Send size={18} />
                )}
                {isLoading ? "Saving..." : "Save Category"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Category"
            subtitle="Create a new grouping for announcements"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 cursor-pointer"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};

export default AddAnnouncementCategoryModal;
