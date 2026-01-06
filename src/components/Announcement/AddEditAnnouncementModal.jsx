import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { useCreateAnnouncementMutation, useUpdateAnnouncementMutation } from "../../store/api/announcementApi";
import { useGetAnnouncementCategoriesQuery } from "../../store/api/announcementCategoryApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddEditAnnouncementModal = ({ isOpen, onClose, announcement }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        category: "General",
        date: new Date().toISOString().split("T")[0],
    });

    const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
    const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
    const { data: categoriesData } = useGetAnnouncementCategoriesQuery({ status: "Active", limit: 100 });
    const categories = categoriesData?.categories || [];

    useEffect(() => {
        if (announcement) {
            setFormData({
                title: announcement.title || "",
                content: announcement.content || "",
                author: announcement.author || "",
                category: announcement.category || "General",
                date: announcement.date ? new Date(announcement.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            });
        } else {
            setFormData({
                title: "",
                content: "",
                author: "",
                category: "General",
                date: new Date().toISOString().split("T")[0],
            });
        }
    }, [announcement, isOpen]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error("Title and Content are required");
            return;
        }

        try {
            if (announcement) {
                await updateAnnouncement({ id: announcement.id, ...formData }).unwrap();
                toast.success("Announcement updated successfully!");
            } else {
                await createAnnouncement(formData).unwrap();
                toast.success("Announcement published successfully!");
            }
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Error saving announcement");
        }
    };

    const footer = (
        <div className="flex gap-3 justify-end w-full">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="announcement-form"
                disabled={isCreating || isUpdating}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
            >
                {isCreating || isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Send size={18} />
                )}
                {announcement ? "Update Announcement" : "Publish Announcement"}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={announcement ? "Edit Announcement" : "New Announcement"}
            subtitle={announcement ? "Modify existing update" : "Share important updates with your team"}
            maxWidth="max-w-2xl"
            footer={footer}
        >
            <form id="announcement-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all"
                        placeholder="Enter announcement title"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all"
                            placeholder="e.g. HR Department"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Category
                    </label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all appearance-none bg-white"
                        >
                            <option value="General">General</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows="6"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your announcement content here..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all resize-none"
                        required
                    ></textarea>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditAnnouncementModal;
