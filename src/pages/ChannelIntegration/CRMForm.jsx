import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Code,
    Copy,
    Check,
    X,
    FileText,
    Save,
    Settings,
    AlertCircle,
    LayoutGrid,
    List,
    Filter,
    Clock,
    CheckCircle,
    Layout,
    MoreVertical,
    FileSpreadsheet,
    Calendar,
    Home,
    SquarePen,
    Search,
    PlusCircle,
    SearchX,
    Eye
} from "lucide-react";
import {
    useGetFormsQuery,
    useCreateFormMutation,
    useUpdateFormMutation,
    useDeleteFormMutation
} from "../../store/api/integrationApi";
import { toast } from "react-hot-toast";
import Modal from "../../components/common/Modal";
import NumberCard from "../../components/NumberCard";

const CRMForm = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    const [filterStatus, setFilterStatus] = useState("All");

    const { data: formsResponse, isLoading } = useGetFormsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: filterStatus
    });

    const forms = formsResponse?.data || [];
    const pagination = formsResponse?.pagination || { totalPages: 1, total: 0 };
    const [createForm] = useCreateFormMutation();
    const [updateForm] = useUpdateFormMutation();
    const [deleteForm] = useDeleteFormMutation();

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null);
    const [editingForm, setEditingForm] = useState(null);
    const [showEmbedModal, setShowEmbedModal] = useState(null);
    const [viewMode, setViewMode] = useState("table");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState("All");
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewForm, setViewForm] = useState(null);

    const [formData, setFormData] = useState({
        form_name: "",
        fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email Address", type: "email", required: true },
            { name: "mobile_number", label: "Phone Number", type: "tel", required: true },
            { name: "interested_in", label: "Interested In", type: "text", required: false }
        ],
        settings: {
            success_message: "Thank you for contacting us!",
            redirect_url: ""
        }
    });

    const handleAddField = () => {
        setFormData({
            ...formData,
            fields: [...formData.fields, { name: "", label: "", type: "text", required: false }]
        });
    };

    const handleRemoveField = (index) => {
        const newFields = [...formData.fields];
        newFields.splice(index, 1);
        setFormData({ ...formData, fields: newFields });
    };

    const handleFieldChange = (index, field, value) => {
        const newFields = [...formData.fields];
        newFields[index][field] = value;
        if (field === 'label' && !newFields[index].id_manual) {
            newFields[index].name = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        }
        setFormData({ ...formData, fields: newFields });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingForm) {
                await updateForm({ id: editingForm.id, data: formData }).unwrap();
                toast.success("Form updated successfully");
            } else {
                const slug = formData.form_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.random().toString(36).substring(2, 7);
                await createForm({ ...formData, form_slug: slug }).unwrap();
                toast.success("Form created successfully");
            }
            setShowModal(false);
            resetForm();
        } catch (err) {
            toast.error(err.data?.message || "Failed to save form");
        }
    };

    const resetForm = () => {
        setEditingForm(null);
        setFormData({
            form_name: "",
            fields: [
                { name: "name", label: "Full Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "mobile_number", label: "Phone Number", type: "tel", required: true }
            ],
            settings: {
                success_message: "Thank you for contacting us!",
                redirect_url: ""
            }
        });
    };

    const handleEdit = (form) => {
        setEditingForm(form);
        setFormData({
            form_name: form.form_name,
            fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
            settings: typeof form.settings === 'string' ? JSON.parse(form.settings) : form.settings
        });
        setShowModal(true);
    };

    const handleDelete = (form) => {
        setFormToDelete(form);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteForm(formToDelete.id).unwrap();
            toast.success("Form deleted successfully");
            setShowDeleteModal(false);
        } catch (err) {
            toast.error("Failed to delete form");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const getPublicUrl = (slug) => `${window.location.origin}/public/form/${slug}`;

    const getEmbedCode = (slug) => `<iframe src="${getPublicUrl(slug)}" style="width:100%; height:800px; border:none;"></iframe>`;

    const handleView = (form) => {
        setViewForm(form);
        setShowViewModal(true);
    };

    // Filter Logic
    // Filter Logic -- Handled by backend
    const filteredForms = forms || [];

    const stats = {
        total: forms?.length || 0,
        active: forms?.filter(f => f.status === 'active').length || 0,
        inactive: forms?.filter(f => f.status !== 'active').length || 0,
        totalFields: forms?.reduce((acc, f) => acc + (typeof f.fields === 'string' ? JSON.parse(f.fields) : f.fields).length, 0) || 0
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setFilterStatus("All");
    };

    const hasActiveFilters = searchTerm || filterStatus !== "All";

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white font-primary">
                {/* Header Section */}
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">CRM Form Integration</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400">Integration /</span>
                                    <span className="text-[#FF7B1D] font-medium">CRM Forms</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-3">


                                {/* Filter Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            if (hasActiveFilters) {
                                                clearAllFilters();
                                            } else {
                                                setTempStatus(filterStatus);
                                                setTempSearchTerm(searchTerm);
                                                setIsFilterOpen(!isFilterOpen);
                                            }
                                        }}
                                        className={`p-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-800">Filter Options</span>
                                                <button
                                                    onClick={() => {
                                                        setTempStatus("All");
                                                        setTempSearchTerm("");
                                                    }}
                                                    className="text-[10px] font-bold text-orange-600 hover:underline capitalize"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold text-gray-500 capitalize tracking-wide">Form name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Search by form name..."
                                                        value={tempSearchTerm}
                                                        onChange={(e) => setTempSearchTerm(e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D] outline-none transition-all text-xs font-semibold"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <span className="text-[11px] font-bold text-gray-500 capitalize tracking-wide block border-b pb-1">Status</span>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {["All", "Active", "Inactive"].map((s) => (
                                                            <label key={s} className="flex items-center group cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="status_filter"
                                                                    checked={tempStatus === s}
                                                                    onChange={() => setTempStatus(s)}
                                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                                                />
                                                                <span className={`ml-3 text-sm font-medium transition-colors ${tempStatus === s ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                                                    {s}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 border-t flex gap-3">
                                                <button
                                                    onClick={() => setIsFilterOpen(false)}
                                                    className="flex-1 py-2 text-[11px] font-bold text-gray-500 bg-white border border-gray-200 rounded-sm hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFilterStatus(tempStatus);
                                                        setSearchTerm(tempSearchTerm);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className="flex-1 py-2 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm shadow-md"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-gray-100 p-1 rounded-sm border border-gray-200 shadow-inner">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "grid"
                                            ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "table"
                                            ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => { resetForm(); setShowModal(true); }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700"
                                >
                                    <Plus size={20} />
                                    Create Form
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-4 pb-4 pt-2 mt-0 font-primary w-full flex-1">
                    {/* Matrix Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <NumberCard
                            title="Total forms"
                            number={stats.total}
                            icon={<Layout className="text-blue-600" size={24} />}
                            iconBgColor="bg-blue-100"
                            lineBorderClass="border-blue-500"
                        />
                        <NumberCard
                            title="Published forms"
                            number={stats.active}
                            icon={<CheckCircle className="text-green-600" size={24} />}
                            iconBgColor="bg-green-100"
                            lineBorderClass="border-green-500"
                        />
                        <NumberCard
                            title="Inactive forms"
                            number={stats.inactive}
                            icon={<Clock className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                        <NumberCard
                            title="Total input fields"
                            number={stats.totalFields}
                            icon={<Settings className="text-purple-600" size={24} />}
                            iconBgColor="bg-purple-100"
                            lineBorderClass="border-purple-500"
                        />
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center p-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                <p className="text-gray-500 font-semibold animate-pulse">Loading forms...</p>
                            </div>
                        </div>
                    ) : filteredForms.length === 0 ? (
                        forms?.length > 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm border border-gray-200 shadow-sm text-center">
                                <div className="p-4 bg-orange-50 rounded-full mb-4">
                                    <SearchX className="text-orange-400" size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No matching forms found</h3>
                                <p className="text-gray-500 max-w-sm mb-6 text-sm">
                                    We couldn't find any forms matching your current search or filters. Try adjusting your criteria.
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-2.5 border-2 border-orange-100 text-[#FF7B1D] hover:bg-orange-50 rounded-sm font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95 text-sm"
                                >
                                    <X size={16} /> Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm border border-gray-200 shadow-sm text-center">
                                <div className="p-4 bg-orange-50 rounded-full mb-4">
                                    <FileText className="text-orange-400" size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No CRM Forms Found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                                    You haven't created any lead forms yet. Create a form to start collecting leads from your website.
                                </p>
                                <button
                                    onClick={() => { resetForm(); setShowModal(true); }}
                                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <Plus size={18} /> Create First Form
                                </button>
                            </div>
                        )
                    ) : (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredForms.map((form) => (
                                    <div key={form.id} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group flex flex-col h-full relative">

                                        {/* Action Icons - Top Right (Hidden by default, shown on hover) */}
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={() => handleEdit(form)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm bg-white shadow-sm border border-green-100"
                                                title="Edit"
                                            >
                                                <SquarePen size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(form)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm bg-white shadow-sm border border-red-100"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleView(form)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm bg-white shadow-sm border border-blue-100"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>

                                        <div className="p-6 pb-4 flex-1 flex flex-col items-center mt-2">
                                            {/* Icon/Avatar */}
                                            <div className="relative mb-4">
                                                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold border-4 border-orange-100/50">
                                                    <FileText size={32} className="text-[#FF7B1D]" />
                                                </div>
                                                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${form.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize text-center line-clamp-2" title={form.form_name}>{form.form_name}</h3>

                                            <div className="flex flex-col items-center gap-2 mb-4 w-full">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${form.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {form.status}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-sm border border-gray-100">
                                                    <Settings size={12} className="text-orange-500" />
                                                    {(typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields).length} Fields Configured
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-100 p-4 border-t border-gray-200 mt-auto">
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => setShowEmbedModal(form)}
                                                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-sm font-bold text-[11px] transition-all capitalize tracking-wider border border-gray-200 shadow-sm"
                                                >
                                                    <Code size={14} /> Embed
                                                </button>
                                                <a
                                                    href={getPublicUrl(form.form_slug)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-[#FF7B1D] px-3 py-2.5 rounded-sm font-bold text-[11px] transition-all capitalize tracking-wider border border-orange-100 shadow-sm"
                                                >
                                                    <ExternalLink size={14} /> View
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div><div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold capitalize tracking-wide">
                                            <tr>
                                                <th className="px-4 py-3">Form details</th>
                                                <th className="px-4 py-3">Fields count</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-center">Embed options</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium">
                                            {filteredForms.map((form) => (
                                                <tr key={form.id} className="border-t border-gray-100 hover:bg-orange-50/30 transition-colors group text-sm">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-orange-50 rounded-sm">
                                                                <FileText className="text-[#FF7B1D]" size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-800 capitalize leading-none text-base">{form.form_name}</div>
                                                                <div className="text-[11px] text-gray-400 font-mono mt-1">{form.form_slug}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7B1D]"></div>
                                                            {(typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields).length} fields
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-sm text-[11px] font-black capitalize tracking-wider border ${form.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                            {form.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => setShowEmbedModal(form)}
                                                                className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-sm font-bold text-[11px] transition-all capitalize tracking-wider border border-gray-200 shadow-sm"
                                                            >
                                                                <Code size={14} /> Embed code
                                                            </button>
                                                            <a
                                                                href={getPublicUrl(form.form_slug)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF7B1D] px-3 py-1.5 rounded-sm font-bold text-[11px] transition-all capitalize tracking-wider border border-orange-100 shadow-sm"
                                                            >
                                                                <ExternalLink size={14} /> Public view
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleView(form)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(form)}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                                                                title="Edit"
                                                            >
                                                                <SquarePen size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(form)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Section */}

                            </div> {forms.length > 0 && (
                                <div className="border border-gray-200 flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 mt-6 rounded-sm shadow-sm">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total || 0)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Forms
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
                                            {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }, (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                            disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                                            className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}</div>

                        )
                    )}


                    {/* Modal for Create/Edit */}
                    {showModal && (
                        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shrink-0">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-2 rounded-sm">
                                                <FileText />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold capitalize">
                                                    {editingForm ? "Edit CRM Form" : "Create New CRM Form"}
                                                </h2>
                                                <p className="text-orange-50 text-xs font-medium mt-0.5">Customize your form fields and settings</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-orange-700 rounded-sm transition-all focus:outline-none">
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                <FileText size={16} className="text-[#FF7B1D]" />
                                                Form name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-sm placeholder:font-normal"
                                                value={formData.form_name}
                                                onChange={(e) => setFormData({ ...formData, form_name: e.target.value })}
                                                placeholder="e.g. Website contact form"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="flex justify-between items-center">
                                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                    <Layout size={16} className="text-[#FF7B1D]" />
                                                    Form fields
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleAddField}
                                                    className="text-[#FF7B1D] hover:text-[#E66A0D] font-bold flex items-center gap-1.5 text-[10px] capitalize tracking-wide bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-sm transition-all shadow-sm"
                                                >
                                                    <PlusCircle size={14} /> Add new field
                                                </button>
                                            </div>

                                            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                                {formData.fields.map((field, index) => (
                                                    <div key={index} className="group flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-sm transition-all relative">
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-500 capitalize tracking-wide ml-1 mb-1 block">Label</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm outline-none font-semibold text-sm focus:border-[#FF7B1D]"
                                                                    value={field.label}
                                                                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                                                                    placeholder="e.g. Full name"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-500 capitalize tracking-wide ml-1 mb-1 block">Type</label>
                                                                <select
                                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm outline-none font-semibold text-sm focus:border-[#FF7B1D] cursor-pointer"
                                                                    value={field.type}
                                                                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                                                >
                                                                    <option value="text">Text</option>
                                                                    <option value="email">Email</option>
                                                                    <option value="tel">Phone</option>
                                                                    <option value="number">Number</option>
                                                                    <option value="textarea">Message</option>
                                                                    <option value="date">Date</option>
                                                                    <option value="time">Time</option>
                                                                    <option value="url">URL</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <label className="flex items-center gap-2 cursor-pointer pt-6">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="w-4 h-4 rounded-sm text-[#FF7B1D] focus:ring-0 cursor-pointer border-gray-300"
                                                                        checked={field.required}
                                                                        onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                                                                    />
                                                                    <span className="text-xs font-bold text-gray-500 capitalize tracking-wide">Required</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveField(index)}
                                                            className="mt-5 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all shadow-sm"
                                                            title="Remove field"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t space-y-4">
                                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                <Settings size={16} className="text-[#FF7B1D]" /> Submission settings
                                            </h3>
                                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm">
                                                <label className="text-[10px] font-bold text-gray-500 capitalize tracking-wide ml-1 block mb-2">Success message</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-sm outline-none font-semibold text-sm focus:border-[#FF7B1D]"
                                                    value={formData.settings.success_message}
                                                    onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, success_message: e.target.value } })}
                                                    placeholder="Thank you for your submission!"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end pt-4 mt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2.5 border-2 border-gray-200 rounded-sm font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all capitalize tracking-wide shadow-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 capitalize tracking-wide active:scale-95 hover:shadow-xl"
                                        >
                                            <FileText size={18} /> {editingForm ? "Update Changes" : "Create Form"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    <Modal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        headerVariant="simple"
                        maxWidth="max-w-md"
                        footer={
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                                >
                                    <Trash2 size={18} />
                                    Delete Form
                                </button>
                            </div>
                        }
                    >
                        <div className="flex flex-col items-center text-center text-black">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle size={48} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Form</h2>
                            <p className="text-gray-600 mb-2 leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-gray-800">"{formToDelete?.form_name}"</span>?
                            </p>
                            <p className="text-xs text-red-500 italic font-medium">This action cannot be undone. All leads collected through this form will remain, but the form will no longer be accessible.</p>
                        </div>
                    </Modal>

                    {/* Embed Code Modal */}
                    {showEmbedModal && (
                        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-sm w-full max-w-xl shadow-2xl animate-fadeIn overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center relative">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2.5 rounded-sm border border-white/10">
                                            <Code className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold capitalize tracking-tight">Embed Form</h2>
                                            <p className="text-orange-50 text-xs font-medium mt-0.5">Use this code to embed the form on your site</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowEmbedModal(null)}
                                        className="p-1.5 hover:bg-white/20 rounded-sm transition-all text-white/80 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Direct URL Section */}
                                    <div className="space-y-3">
                                        <label className="text-base font-bold text-gray-800 capitalize flex items-center gap-2 px-0.5">
                                            <ExternalLink size={18} className="text-[#FF7B1D]" /> Direct URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                readOnly
                                                value={getPublicUrl(showEmbedModal.form_slug)}
                                                className="flex-1 bg-gray-50 px-4 py-3.5 rounded-sm border-2 border-gray-100 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#FF7B1D]/20 transition-all selection:bg-orange-100 placeholder:text-gray-400"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(getPublicUrl(showEmbedModal.form_slug))}
                                                className="p-3 bg-orange-50 text-[#FF7B1D] rounded-sm hover:bg-[#FF7B1D] hover:text-white transition-all border border-orange-100 group shadow-sm"
                                                title="Copy Link"
                                            >
                                                <Copy size={18} className="group-active:scale-90 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Iframe Code Section */}
                                    <div className="space-y-3">
                                        <label className="text-base font-bold text-gray-800 capitalize flex items-center gap-2 px-0.5">
                                            <Code size={18} className="text-[#FF7B1D]" /> Iframe Embed Code
                                        </label>
                                        <div className="flex flex-col gap-4">
                                            <textarea
                                                readOnly
                                                value={getEmbedCode(showEmbedModal.form_slug)}
                                                rows={4}
                                                className="bg-gray-50 text-gray-700 p-5 rounded-sm font-mono text-sm leading-relaxed resize-none focus:outline-none border-2 border-gray-100 shadow-sm transition-all selection:bg-orange-100"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(getEmbedCode(showEmbedModal.form_slug))}
                                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-sm font-bold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/30 uppercase tracking-widest active:scale-[0.98]"
                                            >
                                                <Copy size={20} /> Copy Embed Code
                                            </button>
                                        </div>
                                    </div>

                                    {/* Help Info */}
                                    <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-sm flex gap-3">
                                        <AlertCircle className="text-[#FF7B1D] shrink-0 mt-0.5" size={18} />
                                        <p className="text-xs text-orange-800 font-medium leading-relaxed">
                                            Copy the iframe code and paste it into your website's HTML where you want the form to appear. The form will automatically sync leads to your CRM.
                                        </p>
                                    </div>

                                    {/* Modal Footer Actions */}
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => setShowEmbedModal(null)}
                                            className="px-10 py-2.5 bg-white text-gray-700 rounded-sm font-bold text-xs hover:bg-gray-50 transition-all uppercase tracking-widest border border-gray-200 shadow-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* View Modal */}
                <ViewCRMFormModal
                    isOpen={showViewModal}
                    onClose={() => {
                        setShowViewModal(false);
                        setViewForm(null);
                    }}
                    form={viewForm}
                />

            </div >
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fff7ed; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF7B1D; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ea580c; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
        </DashboardLayout >
    );
};

export default CRMForm;

const ViewCRMFormModal = ({ isOpen, onClose, form }) => {
    if (!form) return null;

    const fields = typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields;
    const settings = typeof form.settings === 'string' ? JSON.parse(form.settings) : form.settings;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm font-sans"
        >
            Close Details
        </button>
    );

    const icon = (
        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
            <FileText size={24} className="text-[#FF7B1D]" />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={form.form_name}
            subtitle={form.form_slug}
            icon={icon}
            footer={footer}
        >
            <div className="space-y-8 text-black bg-white font-sans">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            <Settings size={20} />
                        </div>
                        <span className="text-2xl font-bold text-blue-900">{fields.length}</span>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Form Fields</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-orange-500 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            <Code size={20} />
                        </div>
                        <span className="text-2xl font-bold text-orange-900">Embed</span>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">Responsive</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            {form.status === "active" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <span className={`text-xl font-bold capitalize ${form.status === "active" ? "text-green-900" : "text-gray-600"}`}>{form.status}</span>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Status</span>
                    </div>
                </div>

                {/* Fields Section */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 capitalize mb-3 flex items-center gap-2">
                        <List size={16} className="text-[#FF7B1D]" /> Form Fields
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-sm overflow-hidden flex flex-col max-h-60">
                        <div className="overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm relative">
                                <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Label</th>
                                        <th className="px-4 py-2 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Type</th>
                                        <th className="px-4 py-2 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                            <td className="px-4 py-2 font-bold text-gray-800 capitalize">{field.label}</td>
                                            <td className="px-4 py-2 text-gray-600 font-medium capitalize">{field.type}</td>
                                            <td className="px-4 py-2">
                                                {field.required ? (
                                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Required</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">Optional</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 capitalize mb-3 flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#FF7B1D]" /> Success Message
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 text-sm text-gray-700 italic">
                            "{settings.success_message}"
                        </div>
                    </div>
                    {settings.redirect_url && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 capitalize mb-3 flex items-center gap-2">
                                <ExternalLink size={16} className="text-[#FF7B1D]" /> Redirect URL
                            </h3>
                            <a href={settings.redirect_url} target="_blank" rel="noopener noreferrer" className="block bg-gray-50 p-4 rounded-sm border border-gray-100 text-sm text-blue-600 hover:underline truncate">
                                {settings.redirect_url}
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer Meta */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-sm">
                    <Calendar size={16} />
                    <span>Created on {new Date(form.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        </Modal>
    );
};

