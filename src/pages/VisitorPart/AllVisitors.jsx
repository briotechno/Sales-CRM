import React, { useState, useMemo } from "react";
import { FiHome } from "react-icons/fi";
import {
    Users,
    Search,
    Filter,
    Plus,
    Clock,
    UserPlus,
    CheckCircle,
    Edit2,
    Trash2,
    Pencil,
    Eye,
    ChevronLeft,
    ChevronRight,
    Phone,
    Building2,
    AlertCircle,
    SquarePen,
    MoreVertical,
    LogOut,
    Calendar,
    Download,
    X,
    User,
    Mail,
    FileText,
    AlignLeft
} from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import NumberCard from "../../components/NumberCard";
import AddVisitorModal from "../../components/Visitor/AddVisitorModal";
import Modal from "../../components/common/Modal";
import {
    useGetVisitorsQuery,
    useCreateVisitorMutation,
    useUpdateVisitorMutation,
    useDeleteVisitorMutation
} from "../../store/api/visitorApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";

const AllVisitors = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [visitorTypeFilter, setVisitorTypeFilter] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const itemsPerPage = 8;

    // API Calls
    const { data: visitors = [], isLoading, refetch } = useGetVisitorsQuery({
        status: statusFilter === "All" ? "" : statusFilter,
        guest_type: visitorTypeFilter === "All" ? "" : visitorTypeFilter
    });

    const { data: employeesData } = useGetEmployeesQuery({ limit: 1000, status: 'All' });
    const employees = employeesData?.employees || [];

    const [createVisitor] = useCreateVisitorMutation();
    const [updateVisitor] = useUpdateVisitorMutation();
    const [deleteVisitor, { isLoading: isDeleting }] = useDeleteVisitorMutation();

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [viewVisitor, setViewVisitor] = useState(null);
    const [visitorToDelete, setVisitorToDelete] = useState(null);

    const handleSaveVisitor = async (visitorData) => {
        try {
            if (selectedVisitor) {
                await updateVisitor({ id: selectedVisitor.id, ...visitorData }).unwrap();
                toast.success("Visitor entry updated");
            } else {
                await createVisitor(visitorData).unwrap();
                toast.success("Visitor registered & notification sent!");
            }
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedVisitor(null);
            refetch();
        } catch (error) {
            toast.error(error.data?.message || "Failed to process visitor entry");
        }
    };

    const confirmDelete = (visitor) => {
        setVisitorToDelete(visitor);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteVisitor = async () => {
        if (!visitorToDelete) return;
        try {
            await deleteVisitor(visitorToDelete.id).unwrap();
            toast.success("Record deleted");
            setIsDeleteModalOpen(false);
            setVisitorToDelete(null);
            refetch();
        } catch (error) {
            toast.error("Failed to delete record");
        }
    };

    const handleCheckOut = async (visitor) => {
        try {
            const now = new Date();
            const checkOutTime = now.toTimeString().split(' ')[0].substring(0, 5);
            await updateVisitor({
                id: visitor.id,
                ...visitor,
                status: 'Checked-Out',
                check_out_time: checkOutTime
            }).unwrap();
            toast.success(`${visitor.visitor_name} checked out`);
            refetch();
        } catch (error) {
            toast.error("Failed to check out");
        }
    };

    const filteredVisitors = useMemo(() => {
        return visitors.filter(v =>
            v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.phone_number.includes(searchTerm) ||
            (v.company_name && v.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [visitors, searchTerm]);

    const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
    const currentItems = filteredVisitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Utility to format time to 12h clock
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

    // Stats
    const stats = {
        total: visitors.length,
        waiting: visitors.filter(v => v.status === 'Waiting').length,
        inMeeting: visitors.filter(v => v.status === 'In-Meeting').length,
        checkedOut: visitors.filter(v => v.status === 'Checked-Out').length
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Waiting': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'In-Meeting': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Checked-Out': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const hasActiveFilters = searchTerm || statusFilter !== "All" || visitorTypeFilter !== "All";

    const clearAllFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setVisitorTypeFilter("All");
        setCurrentPage(1);
    };

    // Helper to get host names
    const getHostNames = (hostIdsJson) => {
        try {
            const list = Array.isArray(hostIdsJson) ? hostIdsJson : JSON.parse(hostIdsJson || '[]');
            return list.map(id => {
                const emp = employees.find(e => e.id === id);
                return emp ? emp.employee_name : id;
            });
        } catch { return []; }
    };

    // View Modal Footer
    const viewModalFooter = (
        <div className="flex gap-3">
            <button
                onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedVisitor(viewVisitor);
                    setIsEditModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm hover:shadow-lg transition-all"
            >
                <Pencil size={16} /> Edit Entry
            </button>
            <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
            >
                Close
            </button>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-100 font-primary">
                {/* Sticky Header */}
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    Visitor Management
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FiHome className="text-gray-700" size={14} />
                                    <span className="text-gray-400">/</span> Additional /{" "}
                                    <span className="text-[#FF7B1D] font-medium">Visitor Tracking</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
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
                                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn p-4 space-y-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                                <input
                                                    type="text"
                                                    placeholder="Search visitors..."
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none text-xs font-semibold"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mb-2">Guest Type</h4>
                                                <select
                                                    className="w-full text-xs font-semibold p-2 border border-gray-200 rounded-sm outline-none focus:border-[#FF7B1D]"
                                                    value={visitorTypeFilter}
                                                    onChange={(e) => setVisitorTypeFilter(e.target.value)}
                                                >
                                                    <option value="All">All Guests</option>
                                                    <option value="Client">Clients</option>
                                                    <option value="Vendor">Vendors</option>
                                                    <option value="Interviewee">Interviews</option>
                                                    <option value="Personal">Personal</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mb-2">Status</h4>
                                                <select
                                                    className="w-full text-xs font-semibold p-2 border border-gray-200 rounded-sm outline-none focus:border-[#FF7B1D]"
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                >
                                                    <option value="All">All Status</option>
                                                    <option value="Waiting">Waiting</option>
                                                    <option value="In-Meeting">In Meeting</option>
                                                    <option value="Checked-Out">Checked Out</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedVisitor(null);
                                        setIsAddModalOpen(true);
                                    }}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold text-sm"
                                >
                                    <UserPlus size={20} />
                                    New Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                        <NumberCard
                            title={"Total Visitors"}
                            number={stats.total}
                            icon={<Users className="text-indigo-600" size={24} />}
                            iconBgColor={"bg-indigo-100"}
                            lineBorderClass={"border-indigo-500"}
                        />
                        <NumberCard
                            title={"Waiting Guests"}
                            number={stats.waiting}
                            icon={<Clock className="text-orange-600" size={24} />}
                            iconBgColor={"bg-orange-100"}
                            lineBorderClass={"border-orange-500"}
                        />
                        <NumberCard
                            title={"In Meeting"}
                            number={stats.inMeeting}
                            icon={<CheckCircle className="text-blue-600" size={24} />}
                            iconBgColor={"bg-blue-100"}
                            lineBorderClass={"border-blue-500"}
                        />
                        <NumberCard
                            title={"Checked Out"}
                            number={stats.checkedOut}
                            icon={<LogOut className="text-green-600" size={24} />}
                            iconBgColor={"bg-green-100"}
                            lineBorderClass={"border-green-500"}
                        />
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm tracking-wide">
                                        <th className="py-4 px-4 font-bold">Visitor Name</th>
                                        <th className="py-4 px-4 font-bold">Mobile Number</th>
                                        <th className="py-4 px-4 font-bold">Time Info</th>
                                        <th className="py-4 px-4 font-bold text-center">Guest Type</th>
                                        <th className="py-4 px-4 font-bold text-center">Status</th>
                                        <th className="py-4 px-4 font-bold text-right w-[140px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        [1, 2, 3].map((i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="6" className="px-6 py-8">
                                                    <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((visitor) => (
                                            <tr key={visitor.id} className="hover:bg-gray-50 transition-all group">
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-sm bg-orange-100 text-[#FF7B1D] flex items-center justify-center font-bold text-lg border border-orange-200">
                                                            {visitor.visitor_name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-base text-gray-900">{visitor.visitor_name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <Phone size={14} className="text-gray-400" />
                                                        <p className="text-sm text-gray-700 font-bold">{visitor.phone_number}</p>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                                        <Calendar size={18} className="text-orange-500 shrink-0" />
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-800 font-semibold">{new Date(visitor.visit_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                            <span className="text-[13px] text-orange-600 font-bold uppercase bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100">
                                                                {formatTime12h(visitor.check_in_time)} {visitor.check_out_time && `- ${formatTime12h(visitor.check_out_time)}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 rounded-sm text-xs font-bold border border-gray-200 shadow-sm">
                                                        <Building2 size={12} />
                                                        {visitor.visitor_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider border shadow-sm ${getStatusStyle(visitor.status)}`}>
                                                        {visitor.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {visitor.status !== 'Checked-Out' && (
                                                            <button
                                                                onClick={() => handleCheckOut(visitor)}
                                                                className="p-1.5 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-sm transition-all"
                                                                title="Check Out"
                                                            >
                                                                <LogOut size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => { setViewVisitor(visitor); setIsViewModalOpen(true); }}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedVisitor(visitor); setIsEditModalOpen(true); }}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                                                            title="Edit Entry"
                                                        >
                                                            <SquarePen size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(visitor)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                                            title="Delete Entry"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <UserPlus size={64} strokeWidth={1} className="mb-4 text-gray-200" />
                                                    <p className="text-lg font-bold">No Visitor Entries</p>
                                                    <p className="text-xs">Register your first visitor at the desk.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination Section (Global for Grid/List) */}
                <div className="max-w-8xl mx-auto px-4 pb-6 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 shadow-sm">
                        <p className="text-sm font-semibold text-gray-700">
                            Showing <span className="text-orange-600">{filteredVisitors.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, filteredVisitors.length)}</span> of <span className="text-orange-600">{filteredVisitors.length}</span> Visitors
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === page ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500 text-xs" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(next => Math.min(next + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages || totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                headerVariant="simple"
                maxWidth="max-w-md"
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteVisitor}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs uppercase tracking-widest"
                        >
                            {isDeleting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Trash2 size={20} />
                            )}
                            {isDeleting ? "Deleting..." : "Delete Now"}
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col items-center text-center text-black font-primary">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle size={48} className="text-red-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Confirm Delete
                    </h2>

                    <p className="text-gray-600 mb-2 leading-relaxed">
                        Are you sure you want to delete visitor{" "}
                        <span className="font-bold text-gray-800">"{visitorToDelete?.visitor_name}"</span>?
                    </p>

                    <p className="text-xs text-red-500 italic">
                        This action cannot be undone. All associated data will be permanently removed.
                    </p>
                </div>
            </Modal>

            {/* View Visitor Modal */}
            {isViewModalOpen && viewVisitor && (
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title={viewVisitor.visitor_name?.length > 40 ? `${viewVisitor.visitor_name.substring(0, 40)}...` : viewVisitor.visitor_name}
                    subtitle="Visitor Details"
                    icon={<Users size={24} />}
                    footer={viewModalFooter}
                    maxWidth="max-w-2xl"
                >
                    <div className="space-y-5 px-1 py-2">
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider border shadow-sm ${getStatusStyle(viewVisitor.status)}`}>
                                {viewVisitor.status}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200">
                                <Building2 size={12} /> {viewVisitor.visitor_type}
                            </span>
                        </div>

                        {/* Person and Company Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Phone size={11} className="text-[#FF7B1D]" /> Contact Info
                                </p>
                                <p className="text-sm font-bold text-gray-800">{viewVisitor.phone_number}</p>
                                {viewVisitor.email && (
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                        <Mail size={10} /> {viewVisitor.email}
                                    </p>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Building2 size={11} className="text-[#FF7B1D]" /> Company Represented
                                </p>
                                <p className="text-sm font-bold text-gray-800">
                                    {viewVisitor.company_name || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Calendar size={11} className="text-[#FF7B1D]" /> Visit Date
                                </p>
                                <p className="text-sm font-bold text-gray-800">
                                    {new Date(viewVisitor.visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Clock size={11} className="text-[#FF7B1D]" /> Timing
                                </p>
                                <p className="text-sm font-bold text-gray-800">
                                    {viewVisitor.check_in_time ? `In: ${viewVisitor.check_in_time}` : 'Not checked in'}
                                    {viewVisitor.check_out_time && ` • Out: ${viewVisitor.check_out_time}`}
                                </p>
                            </div>
                        </div>

                        {/* Host Employees */}
                        {viewVisitor.host_employee_ids && (
                            <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <User size={11} className="text-[#FF7B1D]" /> Meeting With (Hosts)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {getHostNames(viewVisitor.host_employee_ids).map((name, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold rounded-sm">
                                            {name}
                                        </span>
                                    ))}
                                    {getHostNames(viewVisitor.host_employee_ids).length === 0 && (
                                        <span className="text-xs text-gray-400 italic">No hosts specified</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Purpose */}
                        <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <AlignLeft size={11} className="text-[#FF7B1D]" /> Purpose of Visit
                            </p>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                {viewVisitor.purpose || 'No purpose mentioned'}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Add / Edit Modal */}
            <AddVisitorModal
                open={isAddModalOpen || isEditModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedVisitor(null);
                }}
                onSave={handleSaveVisitor}
                editData={selectedVisitor}
                employees={employees}
            />
        </DashboardLayout>
    );
};

export default AllVisitors;
