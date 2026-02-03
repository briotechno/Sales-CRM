import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
    FileSignature,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    Search,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Building2,
    Briefcase,
    DollarSign,
    Clock,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Send,
    X
} from "lucide-react";
import toast from 'react-hot-toast';
import {
    useGetOfferLettersQuery,
    useCreateOfferLetterMutation,
    useUpdateOfferLetterMutation,
    useDeleteOfferLetterMutation
} from "../../store/api/offerLetterApi";
import AddOfferLetterModal from "../../components/OfferLetter/AddOfferLetterModal";
import usePermission from "../../hooks/usePermission";
import Modal from "../../components/common/Modal";

const DeleteOfferLetterModal = ({ isOpen, onClose, onConfirm, isLoading, title }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerVariant="simple"
            maxWidth="max-w-md"
            footer={
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 shadow-sm transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2 size={20} />
                        )}
                        {isLoading ? "Deleting..." : "Delete Now"}
                    </button>
                </div>
            }
        >
            <div className="flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <AlertTriangle size={48} className="text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Delete
                </h2>

                <p className="text-gray-600 mb-2 leading-relaxed">
                    Are you sure you want to delete offer letter for{" "}
                    <span className="font-bold text-gray-800">"{title}"</span>?
                </p>

                <p className="text-sm text-red-500 italic mb-6">
                    This action cannot be undone. All associated data will be permanently removed.
                </p>

            </div>
        </Modal>
    );
};

export default function OfferLetterList() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("All");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [page, setPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [offerToDelete, setOfferToDelete] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const { create, read, update, delete: canDelete } = usePermission("Offer Letter");

    useEffect(() => {
        if (location.state?.applicant) {
            setSelectedOffer(location.state.applicant);
            setShowAddModal(true);
        }
    }, [location.state]);

    const { data, isLoading } = useGetOfferLettersQuery({
        page,
        limit: 10,
        status: statusFilter
    });

    const [createOfferLetter, { isLoading: creating }] = useCreateOfferLetterMutation();
    const [updateOfferLetter] = useUpdateOfferLetterMutation();
    const [deleteOfferLetter, { isLoading: deleteLoading }] = useDeleteOfferLetterMutation();

    const offerLetters = data?.offerLetters || [];
    const pagination = data?.pagination || {};

    const handleCreateOffer = async (payload) => {
        await createOfferLetter(payload).unwrap();
    };

    const handleDelete = (offer) => {
        setOfferToDelete(offer);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (offerToDelete?.id) {
            try {
                await deleteOfferLetter(offerToDelete.id).unwrap();
                toast.success("Deleted successfully");
                setShowDeleteModal(false);
                setOfferToDelete(null);
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await updateOfferLetter({ id, status: newStatus }).unwrap();
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const clearAllFilters = () => {
        setStatusFilter("All");
        setDateFilter("All");
        setCustomStart("");
        setCustomEnd("");
        setPage(1);
    };

    const hasActiveFilters = statusFilter !== "All" || dateFilter !== "All";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Draft': return <Clock size={14} />;
            case 'Sent': return <Send size={14} />;
            case 'Accepted': return <CheckCircle2 size={14} />;
            case 'Rejected': return <AlertCircle size={14} />;
            case 'Joined': return <Building2 size={14} />;
            default: return null;
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Draft': return "bg-gray-50 text-gray-600 border-gray-200";
            case 'Sent': return "bg-blue-50 text-blue-600 border-blue-200";
            case 'Accepted': return "bg-green-50 text-green-700 border-green-200";
            case 'Rejected': return "bg-red-50 text-red-700 border-red-200";
            case 'Joined': return "bg-orange-50 text-orange-700 border-orange-200";
            default: return "bg-gray-50 text-gray-500 border-gray-200";
        }
    };

    const renderActions = (offer) => {
        if ((offer.status === 'Sent' || offer.status === 'Draft') && update) {
            return (
                <div className="flex gap-2">
                    <button
                        onClick={() => updateStatus(offer.id, 'Accepted')}
                        className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-green-100 transition-colors shadow-sm"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => updateStatus(offer.id, 'Rejected')}
                        className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors shadow-sm"
                    >
                        Reject
                    </button>
                </div>
            );
        }

        if (offer.status === 'Accepted' && update) {
            return (
                <button
                    onClick={() => updateStatus(offer.id, 'Joined')}
                    className="px-3 py-1 bg-orange-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition shadow-md active:scale-95"
                >
                    Mark Joined
                </button>
            );
        }

        return (
            <div className="flex gap-2 justify-end">
                {update && (
                    <button
                        onClick={() => {
                            setSelectedOffer(offer);
                            setShowAddModal(true);
                        }}
                        className="p-1 hover:bg-orange-100 rounded-sm text-green-500 transition-all hover:text-green-700"
                        title="Edit Offer"
                    >
                        <Edit size={18} />
                    </button>
                )}
                {read && (
                    <button
                        className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 transition-all hover:text-blue-700"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={() => handleDelete(offer)}
                        className="p-1 hover:bg-orange-100 rounded-sm text-red-500 transition-all hover:text-red-700"
                        title="Delete Offer"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Offer Letter</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FiHome className="text-gray-700" size={14} />
                                    <span className="text-gray-400"></span> HRM /{" "}
                                    <span className="text-[#FF7B1D] font-medium">Offer Letters</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => {
                                            if (hasActiveFilters) {
                                                clearAllFilters();
                                            } else {
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
                                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                                            <div className="p-3 border-b border-gray-100 bg-gray-50">
                                                <span className="text-sm font-bold text-gray-700 tracking-wide">Statuses</span>
                                            </div>
                                            <div className="py-1">
                                                {["All", "Draft", "Sent", "Accepted", "Rejected", "Joined"].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => {
                                                            setStatusFilter(status);
                                                            setIsFilterOpen(false);
                                                            setPage(1);
                                                        }}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status
                                                            ? "bg-orange-50 text-orange-600 font-bold"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                                                <span className="text-sm font-bold text-gray-700 tracking-wide">Date Filter</span>
                                            </div>
                                            <div className="py-1">
                                                {["All", "Today", "Yesterday", "Last 7 Days", "Custom"].map((option) => (
                                                    <div key={option}>
                                                        <button
                                                            onClick={() => {
                                                                setDateFilter(option);
                                                                if (option !== "Custom") {
                                                                    setIsFilterOpen(false);
                                                                    setPage(1);
                                                                }
                                                            }}
                                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                                                                ? "bg-orange-50 text-orange-600 font-bold"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            {option}
                                                        </button>
                                                        {option === "Custom" && dateFilter === "Custom" && (
                                                            <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                                                <input
                                                                    type="date"
                                                                    value={customStart}
                                                                    onChange={(e) => setCustomStart(e.target.value)}
                                                                    className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                                                />
                                                                <input
                                                                    type="date"
                                                                    value={customEnd}
                                                                    onChange={(e) => setCustomEnd(e.target.value)}
                                                                    className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                                                />
                                                                <button
                                                                    onClick={() => { setIsFilterOpen(false); setPage(1); }}
                                                                    className="w-full bg-orange-500 text-white text-[10px] font-bold py-2 rounded-sm"
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowAddModal(true)}
                                    disabled={!create}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    <Plus size={20} />
                                    Create Offer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto p-4 pt-0 mt-4">
                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                    <th className="py-3 px-6 font-semibold text-left border-b border-orange-400">Candidate Name</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Email</th>
                                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Job Position</th>
                                    <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Salary</th>
                                    <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Joining Date</th>
                                    <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex justify-center flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-semibold">Loading offer letters...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : offerLetters.length > 0 ? (
                                    offerLetters.map((offer) => (
                                        <tr key={offer.id} className="border-t hover:bg-gray-50 transition-all">
                                            <td className="py-3 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-[10px] border border-orange-200 shadow-sm">
                                                        {offer.candidate_name?.charAt(0) || 'C'}
                                                    </div>
                                                    <span className="font-bold text-gray-800 uppercase tracking-tight">{offer.candidate_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 font-medium truncate max-w-[200px]">{offer.email}</td>
                                            <td className="py-3 px-4 text-gray-700">
                                                <div className="font-bold">{offer.designation}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{offer.department}</div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="font-bold text-orange-600">₹{(offer.net_salary || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="py-3 px-4 text-center text-gray-600 font-medium">
                                                {offer.joining_date ? new Date(offer.joining_date).toLocaleDateString() : '---'}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all ${getStatusStyles(offer.status)}`}>
                                                    {getStatusIcon(offer.status)}
                                                    {offer.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {renderActions(offer)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <FileSignature size={48} className="text-gray-200" />
                                                <p className="text-gray-500 font-medium">No offer letters found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPages > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 shadow-sm">
                            <p className="text-sm font-semibold text-gray-700">
                                Showing <span className="text-orange-600 font-bold">{(page - 1) * 10 + 1}</span> to <span className="text-orange-600 font-bold">{Math.min(page * 10, pagination.total)}</span> of <span className="text-orange-600 font-bold">{pagination.total || 0}</span> Offer Letters
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${page === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                                        }`}
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-sm font-bold transition border ${page === pageNum
                                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-md"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${page === pagination.totalPages
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                                        : "bg-[#22C55E] text-white hover:opacity-90 shadow-md active:scale-95"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <AddOfferLetterModal
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedOffer(null);
                    }}
                    onSubmit={handleCreateOffer}
                    loading={creating}
                    initialData={selectedOffer}
                />

                <DeleteOfferLetterModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    isLoading={deleteLoading}
                    title={offerToDelete?.candidate_name || ""}
                />
            </div>
        </DashboardLayout>
    );
}
