import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Megaphone, User, Calendar, FileText, Send, Tag, Plus, X, Check, Trash2, ChevronDown } from "lucide-react";
import { useCreateAnnouncementMutation } from "../../store/api/announcementApi";
import {
    useGetAnnouncementCategoriesQuery,
    useCreateAnnouncementCategoryMutation,
    useDeleteAnnouncementCategoryMutation
} from "../../store/api/announcementCategoryApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddAnnouncementModal = ({ isOpen, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("General");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (user && !author) {
            setAuthor(`${user.firstName} ${user.lastName}`);
        }
    }, [user, author]);

    const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();
    const [createCategory, { isLoading: isCreatingCategory }] = useCreateAnnouncementCategoryMutation();
    const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteAnnouncementCategoryMutation();
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

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            await createCategory({ name: newCategoryName, status: "Active" }).unwrap();
            toast.success("Category added successfully!");
            setCategory(newCategoryName);
            setNewCategoryName("");
            setIsAddingCategory(false);
        } catch (err) {
            toast.error(err?.data?.message || "Error adding category");
        }
    };

    const handleDeleteCategory = async (e, catId, catName) => {
        e.stopPropagation();
        if (catName === "General") return;

        try {
            await deleteCategory(catId).unwrap();
            toast.success("Category deleted successfully!");
            if (category === catName) {
                setCategory("General");
            }
        } catch (err) {
            toast.error(err?.data?.message || "Error deleting category");
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setAuthor(user ? `${user.firstName} ${user.lastName}` : user.email);
        setCategory("General");
        setDate(new Date().toISOString().split("T")[0]);
        setIsAddingCategory(false);
        setNewCategoryName("");
        setIsDropdownOpen(false);
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
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag size={16} className="text-[#FF7B1D]" />
                            Category
                        </label>
                        <div className="flex items-center gap-3">
                            {!isAddingCategory && (
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    className="text-xs font-bold text-orange-600 hover:text-orange-600 flex items-center gap-1 transition-colors "
                                >
                                    <Plus size={14} />
                                    Add New Category
                                </button>
                            )}
                        </div>
                    </div>

                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-[#FF7B1D] rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white"
                                placeholder="Enter new category name"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleAddNewCategory}
                                disabled={isCreatingCategory}
                                className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 shadow-sm"
                                title="Add Category"
                            >
                                {isCreatingCategory ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Check size={20} />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddingCategory(false);
                                    setNewCategoryName("");
                                }}
                                className="p-3 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                                title="Cancel"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 cursor-pointer"
                            >
                                <span className={category === "General" ? "text-gray-500" : "text-gray-900 font-medium"}>
                                    {category}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-100 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden">
                                    <div className="py-1">
                                        <div
                                            onClick={() => {
                                                setCategory("General");
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${category === "General" ? "bg-orange-50 text-[#FF7B1D] font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            General
                                        </div>
                                        {categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => {
                                                    setCategory(cat.name);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between group/item ${category === cat.name ? "bg-orange-50 text-[#FF7B1D] font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                                            >
                                                <span className="truncate mr-2">{cat.name}</span>
                                                <button
                                                    onClick={(e) => handleDeleteCategory(e, cat.id, cat.name)}
                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all sm:opacity-0 group-hover/item:opacity-100"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
