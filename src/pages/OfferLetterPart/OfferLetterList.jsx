import React, { useState, useRef, useEffect } from "react";
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

                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white h-64 rounded-sm animate-pulse border border-gray-100"></div>
                        ))
                    ) : offerLetters.length > 0 ? (
                        offerLetters.map((offer) => (
                            <div key={offer.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
                                {/* Top Banner/Status */}
                                <div className={`h-1.5 w-full ${offer.status === 'Accepted' ? 'bg-green-500' : offer.status === 'Sent' ? 'bg-blue-500' : 'bg-[#FF7B1D]'}`}></div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                                {offer.candidate_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg leading-tight uppercase tracking-tight">{offer.candidate_name}</h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border mt-1 ${getStatusStyles(offer.status)}`}>
                                                    {getStatusIcon(offer.status)}
                                                    {offer.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete(offer.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-sm"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 mb-5 px-1">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Mail size={14} className="text-gray-400" />
                                            <span className="truncate">{offer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Briefcase size={14} className="text-gray-400" />
                                            <span>{offer.designation} <span className="text-gray-300">•</span> {offer.department}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>Joined: {offer.joining_date ? new Date(offer.joining_date).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-orange-600 py-2 bg-orange-50/50 px-2 rounded-sm border border-orange-100 transition-colors">
                                            <DollarSign size={16} />
                                            <span>₹{(offer.net_salary || 0).toLocaleString()} <span className="text-[10px] text-orange-400 font-normal ml-1">OFFERED SALARY</span></span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                        {offer.status === 'Draft' ? (
                                            <button
                                                onClick={() => updateStatus(offer.id, 'Sent')}
                                                className="col-span-2 py-2.5 bg-gray-900 text-white rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors"
                                            >
                                                <Send size={14} /> Send Offer
                                            </button>
                                        ) : offer.status === 'Sent' ? (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(offer.id, 'Accepted')}
                                                    className="py-2 bg-green-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(offer.id, 'Rejected')}
                                                    className="py-2 bg-red-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : offer.status === 'Accepted' ? (
                                            <button
                                                onClick={() => updateStatus(offer.id, 'Joined')}
                                                className="col-span-2 py-2.5 bg-[#FF7B1D] text-white rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition"
                                            >
                                                Mark as Joined
                                            </button>
                                        ) : (
                                            <div className="col-span-2 py-2.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 rounded-sm">
                                                No actions available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white p-20 text-center border-2 border-dashed border-gray-100 rounded-sm">
                            <FileSignature size={64} className="text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-wider">No Offer Letters Found</h3>
                            <p className="text-gray-400 mt-2">Start by creating a new offer letter for your candidates.</p>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AddOfferLetterModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleCreateOffer}
                    loading={creating}
                />
            </div>
        </DashboardLayout>
    );
}
