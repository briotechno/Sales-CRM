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
    Send
} from "lucide-react";
import toast from 'react-hot-toast';
import {
    useGetOfferLettersQuery,
    useCreateOfferLetterMutation,
    useUpdateOfferLetterMutation,
    useDeleteOfferLetterMutation
} from "../../store/api/offerLetterApi";
import AddOfferLetterModal from "../../components/OfferLetter/AddOfferLetterModal";
// Similar modals for Edit, View etc could be created if needed, 
// for now focusing on implementation.

export default function OfferLetterList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.applicant) {
            setSelectedOffer(location.state.applicant);
            setShowAddModal(true);
        }
    }, [location.state]);

    const { data, isLoading } = useGetOfferLettersQuery({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter
    });

    const [createOfferLetter, { isLoading: creating }] = useCreateOfferLetterMutation();
    const [updateOfferLetter] = useUpdateOfferLetterMutation();
    const [deleteOfferLetter] = useDeleteOfferLetterMutation();

    const offerLetters = data?.offerLetters || [];
    const pagination = data?.pagination || {};

    const handleCreateOffer = async (payload) => {
        await createOfferLetter(payload).unwrap();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this offer letter?")) {
            try {
                await deleteOfferLetter(id).unwrap();
                toast.success("Deleted successfully");
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Draft': return <Clock size={14} className="text-gray-400" />;
            case 'Sent': return <Send size={14} className="text-blue-500" />;
            case 'Accepted': return <CheckCircle2 size={14} className="text-green-500" />;
            case 'Rejected': return <AlertCircle size={14} className="text-red-500" />;
            case 'Joined': return <Building2 size={14} className="text-orange-500" />;
            default: return null;
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Draft': return "bg-gray-100 text-gray-600 border-gray-200";
            case 'Sent': return "bg-blue-50 text-blue-600 border-blue-100";
            case 'Accepted': return "bg-green-50 text-green-600 border-green-100";
            case 'Rejected': return "bg-red-50 text-red-600 border-red-100";
            case 'Joined': return "bg-orange-50 text-orange-600 border-orange-100";
            default: return "bg-gray-50 text-gray-500";
        }
    };

    return (
        <DashboardLayout>
            <div className="ml-6 min-h-screen">
                {/* Header */}
                <div className="bg-white rounded-sm p-4 mb-6 border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileSignature className="text-[#FF7B1D]" />
                                Offer Letter Generator
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <FiHome className="text-gray-700 text-sm" />
                                <span className="text-gray-400">HRM /</span>
                                <span className="text-[#FF7B1D] font-medium">Offer Letters</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    className="pl-10 pr-4 py-2 border-2 border-gray-100 rounded-sm focus:border-orange-500 outline-none w-full transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-sm flex items-center gap-2 font-bold shadow-lg shadow-orange-100 hover:from-orange-600 hover:to-orange-700 transition-all whitespace-nowrap"
                            >
                                <Plus size={20} />
                                Create Offer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Table Format */}
                <div className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-48">Candidate Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-56">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-40">Job Position</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-32">Salary</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-32">Joining Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-white whitespace-nowrap w-32">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-white whitespace-nowrap w-48">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="animate-pulse bg-white">
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                            <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-200 rounded w-20 mx-auto"></div></td>
                                            <td className="px-6 py-4 text-center"><div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div></td>
                                        </tr>
                                    ))
                                ) : offerLetters.length > 0 ? (
                                    offerLetters.map((offer, index) => (
                                        <tr key={offer.id} className={`hover:bg-orange-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
                                                        {offer.candidate_name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-800 uppercase tracking-tight truncate">{offer.candidate_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm truncate">{offer.email}</td>
                                            <td className="px-6 py-4 text-gray-700 text-sm whitespace-nowrap">
                                                <div className="font-medium">{offer.designation}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">{offer.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-bold text-orange-600 text-sm">₹{(offer.net_salary || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                                                {offer.joining_date ? new Date(offer.joining_date).toLocaleDateString() : 'TBD'}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(offer.status)}`}>
                                                    {getStatusIcon(offer.status)}
                                                    {offer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <div className="flex justify-center gap-2">
                                                    {offer.status === 'Sent' || offer.status === 'Draft' ? (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(offer.id, 'Accepted')}
                                                                className="px-3 py-1.5 bg-green-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition shadow-sm"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(offer.id, 'Rejected')}
                                                                className="px-3 py-1.5 bg-red-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition shadow-sm"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : offer.status === 'Accepted' ? (
                                                        <button
                                                            onClick={() => updateStatus(offer.id, 'Joined')}
                                                            className="px-4 py-1.5 bg-[#FF7B1D] text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition shadow-sm"
                                                        >
                                                            Mark Joined
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDelete(offer.id)}
                                                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-colors"
                                                            title="Delete Offer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <FileSignature size={48} className="text-gray-100 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider">No Offer Letters Found</h3>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modals */}
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
            </div>
        </DashboardLayout>
    );
}
