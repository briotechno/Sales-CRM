import React, { useState, useEffect, useRef } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Package,
    LayoutGrid,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
    useGetAnnouncementCategoriesQuery
} from "../../store/api/announcementCategoryApi";
import AddAnnouncementCategoryModal from "../../components/Announcement/AddAnnouncementCategoryModal";
import EditAnnouncementCategoryModal from "../../components/Announcement/EditAnnouncementCategoryModal";
import DeleteAnnouncementCategoryModal from "../../components/Announcement/DeleteAnnouncementCategoryModal";

export default function AnnouncementCategoryPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const itemsPerPage = 10;

    const { data, isLoading } = useGetAnnouncementCategoriesQuery({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        search: searchTerm,
    });

    const categories = data?.categories || [];
    const pagination = data?.pagination || { totalPages: 1, total: 0 };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
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

    const totalPages = pagination.totalPages;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total);

    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <DashboardLayout>
            <div className=" ml-6 min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Announcements
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FiHome className="text-gray-400 text-sm" />
                                    Additional / <span className="text-[#FF7B1D] font-medium">Categories</span>
                                </p>
                            </div>

                            {/* Right Side: Filter + New Button */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Filter */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={`p-3 rounded-sm border transition-all shadow-sm ${isFilterOpen || statusFilter !== "All"
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Filter size={20} />
                                    </button>
                                    {isFilterOpen && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-sm shadow-xl z-50">
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
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] text-sm w-full md:w-64 transition-all"
                                    />
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setShowAddModal(true);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-md"
                                >
                                    <Plus size={20} />
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto">
                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                        <NumberCard
                            title="Total Categories"
                            number={pagination.total}
                            icon={<LayoutGrid className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
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
                                        <td colSpan="5" className="py-10 text-gray-500 font-medium">Loading...</td>
                                    </tr>
                                ) : categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <tr key={category.id} className="border-t hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4">{indexOfFirstItem + index + 1}</td>
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
                                                        className="p-2 rounded-sm transition-all text-orange-500 hover:bg-orange-50"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category)}
                                                        className="p-2 rounded-sm transition-all text-red-600 hover:bg-red-50"
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
                            Showing <span className="text-orange-600">{Math.min(indexOfFirstItem + 1, pagination.total)}</span> to <span className="text-orange-600">{Math.min(indexOfLastItem, pagination.total)}</span> of <span className="text-orange-600">{pagination.total}</span> Categories
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
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages || totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddAnnouncementCategoryModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                }}
            />

            <EditAnnouncementCategoryModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                }}
                category={selectedCategory}
            />

            <DeleteAnnouncementCategoryModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedCategory(null);
                }}
                categoryId={selectedCategory?.id}
                categoryName={selectedCategory?.name}
            />
        </DashboardLayout>
    );
}
