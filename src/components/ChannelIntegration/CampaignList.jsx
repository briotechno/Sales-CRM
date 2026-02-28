import React, { useState, useRef, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    Calendar,
    Users,
    Target,
    Clock,
    Eye,
    Edit,
    Trash2,
    Play,
    Pause,
    TrendingUp,
    Globe,
    X,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import ViewCampaignModal from "./ViewCampaignModal";
import CreateCampaignModal from "./CreateCampaignModal";
import Modal from "../common/Modal";
import {
    useGetCampaignsQuery,
    useToggleCampaignStatusMutation,
    useDeleteCampaignMutation
} from "../../store/api/leadApi";
import { toast } from "react-hot-toast";
import { useSocket } from "../../hooks/useSocket";

const CampaignList = ({ searchTerm, statusFilter, onClearFilters }) => {
    const filterRef = useRef(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);

    const handleEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setIsEditModalOpen(true);
    };

    // Real-time hits state
    const [liveHits, setLiveHits] = useState({});

    const { data: campaignsData, isLoading, refetch } = useGetCampaignsQuery();
    const [toggleCampaignStatus] = useToggleCampaignStatusMutation();
    const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('campaign_update', (data) => {
                if (data.campaignId && data.newHits !== undefined) {
                    setLiveHits(prev => ({
                        ...prev,
                        [data.campaignId]: data.newHits
                    }));

                    // Show notification for the hit
                    const campaign = campaigns.find(c => c.id === data.campaignId);
                    if (campaign) {
                        toast.success(`New Lead assigned to ${campaign.name}`, {
                            icon: '🎯',
                            duration: 3000
                        });
                    }
                }
            });
            return () => socket.off('campaign_update');
        }
    }, [socket]);

    const campaigns = campaignsData?.campaigns || [];

    const hasActiveFilters = searchTerm !== "" || statusFilter !== "All";

    const handleClearAll = () => {
        if (onClearFilters) onClearFilters();
    };

    const getStatusBadge = (status) => {
        const lowerStatus = status?.toLowerCase();
        if (lowerStatus === "active" || lowerStatus === "running") return "bg-green-50 text-green-600 border-green-200";
        if (lowerStatus === "paused") return "bg-amber-50 text-amber-600 border-amber-200";
        if (lowerStatus === "scheduled") return "bg-blue-50 text-blue-600 border-blue-200";
        if (lowerStatus === "completed") return "bg-gray-50 text-gray-600 border-gray-200";
        return "bg-gray-50 text-gray-500 border-gray-200";
    };

    const formatTime12h = (timeStr) => {
        if (!timeStr) return "";
        try {
            const [hours, minutes] = timeStr.split(':');
            let h = parseInt(hours);
            const m = minutes;
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; // the hour '0' should be '12'
            return `${h}:${m} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    };

    const handleView = (campaign) => {
        setSelectedCampaign(campaign);
        setIsViewModalOpen(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        try {
            await toggleCampaignStatus({ id, status: newStatus }).unwrap();
            toast.success(`Campaign ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteClick = (campaign) => {
        setCampaignToDelete(campaign);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!campaignToDelete) return;
        try {
            await deleteCampaign(campaignToDelete.id).unwrap();
            toast.success("Campaign deleted successfully");
            setIsDeleteModalOpen(false);
            setCampaignToDelete(null);
        } catch (err) {
            toast.error("Failed to delete campaign");
        }
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === "All" || campaign.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <RefreshCw size={40} className="animate-spin text-orange-500" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Waking Up Campaign Engines...</p>
        </div>
    );

    return (
        <div className="w-full space-y-6">
            {/* Filters Menu Removed - Managed by Parent */}

            {/* Campaign Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white !mt-0">
                <table className="w-full border-collapse text-left text-sm font-primary">
                    <thead>
                        <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">ID</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Campaign Name</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Source</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Status</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Duration</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Hits</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-left">Audience</th>
                            <th className="py-3 px-4 font-semibold border-b border-orange-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-t hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="text-gray-400 font-bold text-xs uppercase">
                                            #{campaign.id}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="font-bold text-gray-800 tracking-tight group-hover:text-orange-700 transition-colors">
                                            {campaign.name}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 italic tracking-tight">{campaign.source}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-left whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-sm text-[11px] font-bold border uppercase tracking-wider ${getStatusBadge(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                            <Calendar size={18} className="text-orange-500 shrink-0" />
                                            <div className="flex items-center gap-2 flex-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-800 font-semibold">{new Date(campaign.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                    <span className="text-[13px] text-orange-600 font-bold uppercase bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100">{formatTime12h(campaign.start_time)}</span>
                                                </div>
                                                <span className="text-gray-300 font-light mx-1">→</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-800 font-semibold">{new Date(campaign.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                    <span className="text-[13px] text-orange-600 font-bold uppercase bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100">{formatTime12h(campaign.end_time)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-left">
                                        <span className="text-base font-medium text-orange-600">
                                            {liveHits[campaign.id] !== undefined ? liveHits[campaign.id] : campaign.leads_generated}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleView(campaign)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors group px-2 py-1 hover:bg-orange-50 rounded-sm -ml-2"
                                            title="View Audience Details"
                                        >
                                            <Users size={12} className="text-blue-500 group-hover:text-orange-500 transition-colors" />
                                            <span className="truncate max-w-[120px] uppercase">{campaign.audience_type} Model</span>
                                        </button>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-end gap-2 text-gray-400">
                                            <button
                                                onClick={() => handleView(campaign)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(campaign)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                                                title="Edit Campaign"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            {campaign.status === "paused" || campaign.status === "scheduled" ? (
                                                <button
                                                    onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                                    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-sm transition-all"
                                                    title="Resume/Start"
                                                >
                                                    <Play size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-sm transition-all"
                                                    title="Pause"
                                                >
                                                    <Pause size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(campaign)}
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
                                <td colSpan="8" className="py-20 text-center font-primary flex-col">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                                            <Target size={30} className="text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">No Campaigns Found</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Try adjusting your filters or search term</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Segment */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 font-primary">
                <p className="text-sm font-semibold text-gray-700">
                    Showing <span className="text-orange-600">{filteredCampaigns.length}</span> Campaigns
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={refetch}
                        className="px-4 py-2 rounded-sm font-bold transition flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs shadow-sm"
                    >
                        <RefreshCw size={14} /> Refresh Data
                    </button>
                </div>
            </div>

            {/* View Modal */}
            <ViewCampaignModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                campaign={selectedCampaign}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCampaignToDelete(null);
                }}
                headerVariant="simple"
                maxWidth="max-w-md"
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setCampaignToDelete(null);
                            }}
                            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs capitalize tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 font-primary text-xs capitalize tracking-widest disabled:opacity-50"
                        >
                            {isDeleting ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            {isDeleting ? "Deleting..." : "Delete Now"}
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col items-center text-center text-black font-primary">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="text-red-600" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
                    <p className="text-gray-600 mb-2 leading-relaxed">
                        Are you sure you want to delete the campaign <span className="font-bold text-gray-800">"{campaignToDelete?.name}"</span>?
                    </p>
                    <p className="text-xs text-red-500 italic font-medium">This action cannot be undone. All associated data will be permanently removed.</p>
                </div>
            </Modal>

            {/* Edit Modal */}
            <CreateCampaignModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCampaign(null);
                }}
                initialData={selectedCampaign}
            />

            <style jsx>{`
                .animate-campaignFadeIn {
                    animation: campaignFadeIn 0.2s ease-out;
                }
                @keyframes campaignFadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default CampaignList;
