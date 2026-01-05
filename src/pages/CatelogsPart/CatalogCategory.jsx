import React, { useState, useEffect, useRef } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    X,
    Package,
    AlertCircle,
    LayoutGrid,
} from "lucide-react";
import { toast } from "react-hot-toast";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "../../store/api/catalogCategoryApi";
import { useGetHRMDashboardDataQuery } from "../../store/api/hrmDashboardApi";
import usePermission from "../../hooks/usePermission";

export default function CatalogCategoryPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const itemsPerPage = 10;

    const { create, update, delete: canDelete } = usePermission("Catalog"); // Using Catalog permission for categories too

    const { data, isLoading, refetch } = useGetCategoriesQuery({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        search: searchTerm,
    });

    const { data: dashboardData } = useGetHRMDashboardDataQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const categories = data?.categories || [];
    const pagination = data?.pagination || {};

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        status: "Active",
    });

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
            if (formData.id) {
                await updateCategory({ id: formData.id, ...formData }).unwrap();
                toast.success("Category updated successfully!");
            } else {
                await createCategory(formData).unwrap();
                toast.success("Category added successfully!");
            }
            refetch();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            toast.error("Error saving category: " + (err?.data?.message || err.message));
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: "",
            status: "Active",
        });
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteCategory(categoryToDelete.id).unwrap();
            toast.success("Category deleted successfully!");
            setShowDeleteModal(false);
        } catch (err) {
            toast.error("Error deleting category: " + (err?.data?.message || err.message));
        }
    };

    const handleEdit = (category) => {
        setFormData({
            id: category.id,
            name: category.name,
            status: category.status,
        });
        setShowAddModal(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const totalPages = pagination.totalPages || 1;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <DashboardLayout>
            <div className=" ml-6 min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b my-3">
                    <div className="max-w-8xl mx-auto">
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Catalog Categories
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FiHome className="text-gray-700 text-sm" />
                                    CRM / <span className="text-[#FF7B1D] font-medium">Categories</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={`p-3 rounded-sm border transition shadow-sm ${isFilterOpen || statusFilter !== "All"
                                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                                                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Filter size={20} />
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-sm shadow-xl z-50">
                                            <div className="py-1">
                                                {["All", "Active", "Inactive"].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => {
                                                            setStatusFilter(status);
                                                            setIsFilterOpen(false);
                                                            setCurrentPage(1);
                                                        }}
                                                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${statusFilter === status
                                                                ? "bg-orange-50 text-orange-600 font-bold"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] text-sm w-64"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                </div>

                                <button
                                    onClick={() => {
                                        resetForm();
                                        setShowAddModal(true);
                                    }}
                                    disabled={!create}
                                    className={`px-6 py-3 rounded-sm hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-md ${create
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    <Plus size={20} />
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <NumberCard
                        title="Total Categories"
                        number={pagination.total || "0"}
                        icon={<LayoutGrid className="text-orange-600" size={24} />}
                        iconBgColor="bg-orange-100"
                        lineBorderClass="border-orange-500"
                    />
                    <NumberCard
                        title="Active Categories"
                        number={categories.filter(c => c.status === 'Active').length || "0"}
                        icon={<LayoutGrid className="text-green-600" size={24} />}
                        iconBgColor="bg-green-100"
                        lineBorderClass="border-green-500"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                <th className="py-3 px-4 font-semibold">S.N</th>
                                <th className="py-3 px-4 font-semibold text-left">Category Name</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Created Date</th>
                                <th className="py-3 px-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-20">
                                        <div className="flex justify-center flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                            <p className="text-gray-500 font-semibold animate-pulse">Loading categories...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((category, index) => (
                                    <tr key={category.id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="py-3 px-4 text-left font-semibold text-gray-800">{category.name}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${category.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                                }`}>
                                                {category.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 text-sm">
                                            {new Date(category.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    disabled={!update}
                                                    className={`p-2 rounded-sm transition-all ${update ? "text-orange-500 hover:bg-orange-50" : "text-gray-300 cursor-not-allowed"
                                                        }`}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    disabled={!canDelete}
                                                    className={`p-2 rounded-sm transition-all ${canDelete ? "text-red-600 hover:bg-red-50" : "text-gray-300 cursor-not-allowed"
                                                        }`}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-gray-500 font-medium text-sm">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package size={48} className="text-gray-200" />
                                            <p>No categories found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">
                        Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Categories
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                                }`}
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {formData.id ? "Edit Category" : "Add New Category"}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-white hover:bg-orange-700 p-1 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                <div className="flex gap-3 justify-end pt-4 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all font-semibold"
                                    >
                                        {formData.id ? "Update Changes" : "Save Category"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    headerVariant="simple"
                    maxWidth="max-w-md"
                    footer={
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Trash2 size={20} />
                                Delete Now
                            </button>
                        </div>
                    }
                >
                    <div className="flex flex-col items-center text-center text-black">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <AlertCircle size={48} className="text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
                        <p className="text-gray-600 mb-2 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-gray-800">"{categoryToDelete?.name}"</span>?
                        </p>
                        <p className="text-sm text-red-500 italic">This action cannot be undone and will permanently remove all associated data.</p>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
