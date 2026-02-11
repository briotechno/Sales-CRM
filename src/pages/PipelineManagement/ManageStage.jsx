import React, { useEffect, useRef, useState } from "react";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Download,
    Search,
    Plus,
    Trash2,
    X,
    Eye,
    Pencil,
    Filter,
    Loader,
    CheckCircle,
    XCircle,
    Layers,
    AlertCircle,
    SquarePen,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";
import { toast } from "react-hot-toast";
import {
    useGetStagesQuery,
    useCreateStageMutation,
    useUpdateStageMutation,
    useDeleteStageMutation,
} from "../../store/api/stageApi";

const ManageStage = () => {
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedStage, setSelectedStage] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempSearch, setTempSearch] = useState("");
    const filterDropdownRef = useRef(null);

    // API
    const { data, isLoading, isError } = useGetStagesQuery({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery
    });

    const stages = data?.stages || [];
    const pagination = data?.pagination || {};
    const totalPages = pagination.totalPages || 1;

    // With server-side pagination, the 'filtered' list is just the list returned from the API
    const filteredStages = stages;

    // Pagination helpers
    const indexOfLastItem = Math.min(currentPage * rowsPerPage, pagination.total || 0);
    const indexOfFirstItem = (currentPage - 1) * rowsPerPage;
    const currentStages = stages;

    // Filter
    const hasActiveFilters = searchQuery !== "";

    const handleClearFilters = () => {
        setSearchQuery("");
        setTempSearch("");
        setCurrentPage(1);
    };

    const handleApplyFilters = () => {
        setSearchQuery(tempSearch);
        setIsFilterOpen(false);
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader size={40} className="text-[#FF7B1D] animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-red-500 mb-4">
                        <XCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
                    <p className="text-gray-600">Failed to load stages.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                {/* Header Section */}
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Stage Management</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FiHome className="text-gray-700" size={14} />
                                    <span className="text-gray-400">CRM / </span>
                                    <span className="text-[#FF7B1D] font-medium">All Stages</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Unified Filter */}
                                <div className="relative" ref={filterDropdownRef}>
                                    <button
                                        onClick={() => {
                                            if (hasActiveFilters) {
                                                handleClearFilters();
                                            } else {
                                                setTempSearch(searchQuery);
                                                setIsFilterOpen(!isFilterOpen);
                                            }
                                        }}
                                        className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute right-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-800 tracking-tight">Filter Options</span>
                                                <button
                                                    onClick={() => setTempSearch("")}
                                                    className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                                                >
                                                    Reset All
                                                </button>
                                            </div>

                                            <div className="p-5 space-y-6">
                                                {/* Search Input */}
                                                <div className="group">
                                                    <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Stage</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={tempSearch}
                                                            onChange={(e) => setTempSearch(e.target.value)}
                                                            placeholder="Search by stage name..."
                                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                                                        />
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Filter Actions */}
                                            <div className="p-4 bg-gray-50 border-t flex gap-3">
                                                <button
                                                    onClick={() => setIsFilterOpen(false)}
                                                    className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white shadow-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleApplyFilters}
                                                    className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                                                >
                                                    Apply Filters
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                                >
                                    <Plus size={20} />
                                    Add Stage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">

                    {/* Table Container */}
                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">S.N</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Stage Name</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">Default Probability</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400">Description</th>
                                    <th className="py-3 px-4 font-semibold border-b border-orange-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStages.length > 0 ? (
                                    currentStages.map((stage, index) => (
                                        <tr key={stage.id} className="border-t hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-medium text-gray-500">{indexOfFirstItem + index + 1}</td>
                                            <td className="py-4 px-4 font-bold text-gray-800 hover:text-orange-600 cursor-pointer transition-colors"
                                                onClick={() => { setSelectedStage(stage); setIsEditOpen(true); }}>
                                                {stage.name}
                                            </td>
                                            <td className="py-4 px-4 font-bold text-orange-600">
                                                <span className="bg-orange-50 px-2 py-1 rounded-sm border border-orange-100">
                                                    {stage.probability}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-gray-500 truncate max-w-[300px]" title={stage.description}>{stage.description || "-"}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { setSelectedStage(stage); setIsEditOpen(true); }}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedStage(stage); setIsDeleteOpen(true); }}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all"
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
                                        <td colSpan="5" className="py-20 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner text-gray-300">
                                                    <Layers size={32} />
                                                </div>
                                                <div className="space-y-1 text-center">
                                                    <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">No stages found.</p>
                                                    <p className="text-xs text-gray-400">Add a new stage to defined your pipeline flow.</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsAddOpen(true)}
                                                    className="mt-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm text-xs font-bold hover:shadow-lg transition-all active:scale-95 shadow-md"
                                                >
                                                    Add First Stage
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    {totalPages > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">
                                Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfFirstItem + currentStages.length}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Stages
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                                        }`}
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1
                                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Modals */}
                    <AddStageModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
                    <EditStageModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} stage={selectedStage} />
                    <DeleteStageModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} stage={selectedStage} />
                </div>
            </div>
        </DashboardLayout>
    );
};

const AddStageModal = ({ isOpen, onClose }) => {
    const [createStage, { isLoading }] = useCreateStageMutation();
    const [name, setName] = useState("");
    const [probability, setProbability] = useState(0);
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error("Stage Name is required");
        if (probability < 0 || probability > 100) return toast.error("Probability must be 0-100");

        try {
            await createStage({ name, probability, description }).unwrap();
            toast.success("Stage added successfully");
            setName("");
            setProbability(0);
            setDescription("");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to add stage");
        }
    };

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-sm hover:bg-gray-50 transition-all uppercase text-xs"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-orange-200 flex items-center gap-2 uppercase text-xs"
            >
                {isLoading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                {isLoading ? "Adding..." : "Add Stage"}
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Stage" icon={<Layers size={24} />} footer={footer}>
            <div className="space-y-5">
                <div className="space-y-1.5 text-black">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stage Name <span className="text-red-500">*</span></label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                        placeholder="e.g. Qualification"
                    />
                </div>
                <div className="space-y-1.5 text-black">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Default Probability (%) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={probability}
                        onChange={(e) => setProbability(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="space-y-1.5 text-black">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium resize-none"
                        rows="3"
                        placeholder="Define what Happens at this stage..."
                    />
                </div>
            </div>
        </Modal>
    );
};

const EditStageModal = ({ isOpen, onClose, stage }) => {
    const [updateStage, { isLoading }] = useUpdateStageMutation();
    const [name, setName] = useState("");
    const [probability, setProbability] = useState(0);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (stage) {
            setName(stage.name);
            setProbability(stage.probability);
            setDescription(stage.description);
        }
    }, [stage]);

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error("Stage Name is required");
        if (probability < 0 || probability > 100) return toast.error("Probability must be 0-100");

        try {
            await updateStage({ id: stage.id, data: { name, probability, description } }).unwrap();
            toast.success("Stage updated successfully");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update stage");
        }
    };

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-sm hover:bg-gray-50 transition-all uppercase text-xs"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-orange-200 flex items-center gap-2 uppercase text-xs"
            >
                {isLoading ? <Loader size={16} className="animate-spin" /> : <Pencil size={16} />}
                {isLoading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Stage" icon={<Layers size={24} />} footer={footer}>
            <div className="space-y-5">
                <div className="space-y-1.5 text-black">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stage Name <span className="text-red-500">*</span></label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="space-y-1.5 text-black">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Default Probability (%) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={probability}
                        onChange={(e) => setProbability(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="space-y-1.5 text-black">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium resize-none"
                        rows="3"
                    />
                </div>
            </div>
        </Modal>
    );
};

const DeleteStageModal = ({ isOpen, onClose, stage, refetchStages }) => {
    const [deleteStage, { isLoading }] = useDeleteStageMutation();

    const handleDelete = async () => {
        try {
            await deleteStage(stage.id).unwrap();

            if (refetchStages) {
                refetchStages();
            }

            toast.success("Stage deleted successfully");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete stage");
        }
    };

    if (!stage) return null;

    const footer = (
        <div className="flex gap-4 w-full">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
            >
                Cancel
            </button>

            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs uppercase tracking-widest"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Trash2 size={20} />
                )}
                {isLoading ? "Deleting..." : "Delete Now"}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerVariant="simple"
            maxWidth="max-w-md"
            footer={footer}
        >
            <div className="flex flex-col items-center text-center text-black font-primary">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={48} className="text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Delete
                </h2>

                <p className="text-gray-600 mb-2 leading-relaxed">
                    Are you sure you want to delete the stage{" "}
                    <span className="font-bold text-gray-800">
                        "{stage.name}"
                    </span>
                    ?
                </p>

                <p className="text-xs text-red-500 italic">
                    This action cannot be undone. All associated data will be permanently removed.
                </p>
            </div>
        </Modal>
    );
};

export default ManageStage;
