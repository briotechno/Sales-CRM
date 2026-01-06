import React, { useState } from "react";
import { Megaphone, User, Calendar, FileText, Send, Tag } from "lucide-react";
import { useCreateAnnouncementMutation } from "../../store/api/announcementApi";
import { useGetAnnouncementCategoriesQuery } from "../../store/api/announcementCategoryApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddAnnouncementModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("General");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();
    const { data: categoriesData } = useGetAnnouncementCategoriesQuery({ status: "Active", limit: 100 });
    const categories = categoriesData?.categories || [];

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error("Title and Content are required");
            return;
        }

        try {
            await createAnnouncement({ title, content, author, category, date }).unwrap();
            toast.success("Announcement published successfully!");
            resetForm();
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Error saving announcement");
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setAuthor("");
        setCategory("General");
        setDate(new Date().toISOString().split("T")[0]);
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
                {isLoading ? "Publishing..." : "Publish Announcement"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="New Announcement"
            subtitle="Share important updates with your team"
            icon={<Megaphone size={24} />}
            footer={footer}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-5 text-black">
                {/* Title */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Megaphone size={16} className="text-[#FF7B1D]" />
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                        placeholder="Enter announcement title"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Author */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <User size={16} className="text-[#FF7B1D]" />
                            Author
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            placeholder="e.g. HR Department"
                        />
                    </div>
                    {/* Date */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Calendar size={16} className="text-[#FF7B1D]" />
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Tag size={16} className="text-[#FF7B1D]" />
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 cursor-pointer"
                    >
                        <option value="General">General</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Content */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="text-[#FF7B1D]" />
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 resize-none"
                        placeholder="Write your announcement content here..."
                    ></textarea>
                </div>
            </div>
        </Modal>
    );
};

export default AddAnnouncementModal;
