import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiHome } from "react-icons/fi";
import {
    Trash2,
    RotateCcw,
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Calendar
} from "lucide-react";
import {
    useGetTrashedLeadsQuery,
    usePermanentDeleteLeadMutation,
    useRestoreLeadMutation
} from "../../store/api/leadApi";
import { toast } from "react-hot-toast";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";

export default function TrashLeads() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [leadToPermanentlyDelete, setLeadToPermanentlyDelete] = useState(null);
    const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);

    const { data: trashResponse, isLoading, isError, refetch } = useGetTrashedLeadsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
    });

    const [permanentDeleteLead, { isLoading: isDeleting }] = usePermanentDeleteLeadMutation();
    const [restoreLead, { isLoading: isRestoring }] = useRestoreLeadMutation();

    const trashedLeads = trashResponse?.leads || [];
    const totalLeads = trashResponse?.pagination?.total || 0;
    const totalPages = trashResponse?.pagination?.totalPages || 1;

    const handlePermanentDelete = (lead) => {
        setLeadToPermanentlyDelete(lead);
        setShowPermanentDeleteModal(true);
    };

    const confirmPermanentDelete = async () => {
        if (!leadToPermanentlyDelete) return;
        try {
            await permanentDeleteLead(leadToPermanentlyDelete.id).unwrap();
            toast.success("Lead permanently deleted");
            setShowPermanentDeleteModal(false);
            setLeadToPermanentlyDelete(null);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to permanently delete lead");
        }
    };

    const handleRestore = async (id) => {
        try {
            await restoreLead(id).unwrap();
            toast.success("Lead restored successfully");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to restore lead");
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="min-h-screen bg-white font-primary">
            {/* Header Section */}
            <div className="bg-white sticky top-0 z-30">
                <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Lead Management Trash
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <FiHome className="text-gray-700" size={14} />
                                <span className="text-gray-400">CRM / Leads / </span>
                                <span className="text-[#FF7B1D] font-medium">Trash</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search in trash..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none w-64 text-sm font-medium transition-all shadow-sm font-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 size={40} className="animate-spin text-orange-500" />
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-500 py-10 font-bold bg-white border rounded-sm shadow-sm">
                        Failed to load trashed leads. Please try again.
                    </div>
                ) : trashedLeads.length === 0 ? (
                    <EmptyState
                        title="Trash is Empty"
                        message="There are no deleted leads here. Deleted leads will appear in this trash."
                        type="trash"
                    />
                ) : (
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden animate-fadeIn font-primary">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                        <th className="py-3 px-4 font-semibold border-b border-orange-400 whitespace-nowrap capitalize">Lead ID</th>
                                        <th className="py-3 px-4 font-semibold border-b border-orange-400 whitespace-nowrap capitalize">Full Name</th>
                                        <th className="py-3 px-4 font-semibold border-b border-orange-400 whitespace-nowrap capitalize">Mobile Number</th>
                                        <th className="py-3 px-4 font-semibold border-b border-orange-400 whitespace-nowrap capitalize">Last Status</th>
                                        <th className="py-3 px-4 font-semibold border-b border-orange-400 whitespace-nowrap capitalize">Deleted Date</th>
                                        <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 whitespace-nowrap capitalize">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {trashedLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="py-4 px-4 text-orange-600 font-bold text-sm whitespace-nowrap">
                                                {lead.lead_id || lead.id}
                                            </td>
                                            <td className="py-4 px-4 font-bold text-gray-800 text-sm whitespace-nowrap">
                                                {lead.name || lead.full_name || "Untitled Lead"}
                                            </td>
                                            <td className="py-4 px-4 text-gray-600 text-sm font-medium whitespace-nowrap">
                                                {lead.mobile_number || lead.phone || "--"}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 rounded-sm bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200 uppercase whitespace-nowrap leading-none">
                                                    {lead.tag || lead.status || "New Lead"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                                    <Calendar size={18} className="text-orange-500 shrink-0" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-800 font-semibold">
                                                            {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : "--"}
                                                        </span>
                                                        {lead.updated_at && (
                                                            <span className="text-[13px] text-orange-600 font-bold uppercase bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100">
                                                                {new Date(lead.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRestore(lead.id)}
                                                        disabled={isRestoring}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-600 rounded-sm text-green-600 hover:text-white transition-all border border-green-100 shadow-sm text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                                                        title="Restore Lead"
                                                    >
                                                        <RotateCcw size={14} />
                                                        Restore
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(lead)}
                                                        disabled={isDeleting}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 rounded-sm text-red-600 hover:text-white transition-all border border-red-100 shadow-sm text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                                                        title="Permanent Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-50/50 border-t border-gray-100 gap-4">
                                <p className="text-sm font-semibold text-gray-700">
                                    Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of <span className="text-orange-600 font-bold">{totalLeads}</span> Leads
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 text-[11px] uppercase tracking-wider ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-10 h-10 rounded-sm font-bold transition text-xs ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 text-[11px] uppercase tracking-wider ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Permanent Delete Confirmation Modal */}
            <Modal
                isOpen={showPermanentDeleteModal}
                onClose={() => setShowPermanentDeleteModal(false)}
                title="Confirm Permanent Deletion"
                size="md"
            >
                <div className="p-6">
                    <div className="flex items-center gap-4 text-red-600 mb-4 bg-red-50 p-4 rounded-sm border border-red-100">
                        <AlertTriangle size={32} className="shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold">This action cannot be undone!</h3>
                            <p className="text-sm opacity-90">Are you sure you want to permanently delete this lead from the system?</p>
                        </div>
                    </div>

                    {leadToPermanentlyDelete && (
                        <div className="mb-6 p-4 border rounded-sm bg-gray-50">
                            <p className="text-sm font-bold text-gray-700">Lead Details:</p>
                            <p className="text-sm text-gray-600 mt-1">ID: <span className="font-mono">{leadToPermanentlyDelete.lead_id || leadToPermanentlyDelete.id}</span></p>
                            <p className="text-sm text-gray-600">Name: <span className="font-bold">{leadToPermanentlyDelete.name || leadToPermanentlyDelete.full_name || "--"}</span></p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={() => setShowPermanentDeleteModal(false)}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-sm font-bold text-gray-600 hover:bg-gray-50 transition-all text-sm uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmPermanentDelete}
                            disabled={isDeleting}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold transition-all shadow-lg shadow-red-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
