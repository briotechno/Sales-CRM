import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Plus,
    Edit2,
    Trash2,
    RefreshCw,
    Table as TableIcon,
    Check,
    X,
    LayoutGrid,
    List,
    Filter,
    Clock,
    CheckCircle,
    Layout,
    MoreVertical,
    FileSpreadsheet,
    Calendar,
    Share2,
    CheckSquare,
    Search,
    Home,
    Save,
    Settings,
    History,
    ArrowRight,
    Database,
    AlertCircle,

    FileText,
    SearchX,
    SquarePen,
    Eye
} from "lucide-react";
import {
    useGetSheetsConfigsQuery,
    useCreateSheetConfigMutation,
    useUpdateSheetConfigMutation,
    useDeleteSheetConfigMutation,
    useSyncSheetMutation,
    useGetLogsQuery
} from "../../store/api/integrationApi";
import { toast } from "react-hot-toast";
import Modal from "../../components/common/Modal";
import NumberCard from "../../components/NumberCard";

const GoogleDocs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [filterFrequency, setFilterFrequency] = useState("All");

    const { data: configsResponse, isLoading } = useGetSheetsConfigsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        sync_frequency: filterFrequency
    });

    const configs = configsResponse?.data || [];
    const pagination = configsResponse?.pagination || { totalPages: 1, total: 0 };
    const [currentLogPage, setCurrentLogPage] = useState(1);
    const { data: logsResponse } = useGetLogsQuery({
        page: currentLogPage,
        limit: itemsPerPage
    });
    const logs = logsResponse?.data || [];
    const logsPagination = logsResponse?.pagination || { totalPages: 1, total: 0 };
    const [createConfig] = useCreateSheetConfigMutation();
    const [updateConfig] = useUpdateSheetConfigMutation();
    const [deleteConfig] = useDeleteSheetConfigMutation();
    const [syncSheet, { isLoading: isSyncing }] = useSyncSheetMutation();

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [configToDelete, setConfigToDelete] = useState(null);
    const [editingConfig, setEditingConfig] = useState(null);
    const [activeTab, setActiveTab] = useState("accounts");
    const [viewMode, setViewMode] = useState("table");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempFrequency, setTempFrequency] = useState("All");
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewConfig, setViewConfig] = useState(null);

    const [configData, setConfigData] = useState({
        sheet_name: "",
        spreadsheet_id: "",
        sheet_id: "Sheet1",
        credentials_json: "",
        field_mapping: {
            name: "",
            mobile_number: "",
            email: "",
            interested_in: "",
            city: "",
            organization_name: ""
        }
    });


    const crmFields = [
        { label: "Full Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Mobile Number", value: "mobile_number" },
        { label: "Interested In", value: "interested_in" },
        { label: "City", value: "city" },
        { label: "Company Name", value: "organization_name" }
    ];

    const handleFieldMapping = (crmField, sheetColumn) => {
        setConfigData({
            ...configData,
            field_mapping: { ...configData.field_mapping, [crmField]: sheetColumn }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingConfig) {
                await updateConfig({ id: editingConfig.id, data: configData }).unwrap();
                toast.success("Configuration updated successfully");
            } else {
                await createConfig(configData).unwrap();
                toast.success("Connection added successfully");
            }
            setShowModal(false);
            resetForm();
        } catch (err) {
            toast.error(err.data?.message || "Failed to save configuration");
        }
    };

    const handleSync = async (id) => {
        try {
            const res = await syncSheet(id).unwrap();
            toast.success(`Sync complete: ${res.successCount} leads processed`);
        } catch (err) {
            toast.error(err.data?.message || "Sync failed");
        }
    };

    const resetForm = () => {
        setEditingConfig(null);
        setConfigData({
            sheet_name: "",
            spreadsheet_id: "",
            sheet_id: "Sheet1",
            credentials_json: "",
            field_mapping: {
                name: "",
                mobile_number: "",
                email: "",
                interested_in: "",
                city: "",
                organization_name: ""
            }
        });
    };

    const handleEdit = (config) => {
        setEditingConfig(config);
        setConfigData({
            sheet_name: config.sheet_name,
            spreadsheet_id: config.spreadsheet_id,
            sheet_id: config.sheet_id,
            credentials_json: config.credentials_json,
            field_mapping: typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping
        });
        setShowModal(true);
    };

    const handleDelete = (config) => {
        setConfigToDelete(config);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteConfig(configToDelete.id).unwrap();
            toast.success("Disconnected successfully");
            setShowDeleteModal(false);
        } catch (err) {
            toast.error("Failed to disconnect");
        }
    };

    const handleView = (config) => {
        setViewConfig(config);
        setShowViewModal(true);
    };

    // Filter Logic
    // Filter Logic -- Handled by backend
    const filteredConfigs = configs || [];

    const stats = {
        total: configs?.length || 0,
        manual: configs?.filter(c => c.sync_frequency === 'manual').length || 0,
        automated: configs?.filter(c => c.sync_frequency !== 'manual').length || 0,
        totalLogs: logs?.length || 0
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setFilterFrequency("All");
        setTempSearchTerm("");
        setTempFrequency("All");
    };

    const hasActiveFilters = searchTerm || filterFrequency !== "All";

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white font-primary">
                {/* Header Section */}
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Google Sheets Sync</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400">Integration /</span>
                                    <span className="text-[#FF7B1D] font-medium">Google Sheets</span>
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
                                                setTempFrequency(filterFrequency);
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
                                                        setTempFrequency("All");
                                                        setTempSearchTerm("");
                                                    }}
                                                    className="text-[10px] font-bold text-orange-600 hover:underline capitalize"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold text-gray-500 capitalize tracking-wide">Sheet Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Search by sheet name..."
                                                        value={tempSearchTerm}
                                                        onChange={(e) => setTempSearchTerm(e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D] outline-none transition-all text-xs font-semibold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block border-b pb-1">Sync Frequency</span>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {["All", "Manual", "Daily", "Weekly"].map((f) => (
                                                            <label key={f} className="flex items-center group cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="frequency_filter"
                                                                    checked={tempFrequency === f}
                                                                    onChange={() => setTempFrequency(f)}
                                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                                                />
                                                                <span className={`ml-3 text-sm font-medium transition-colors ${tempFrequency === f ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                                                    {f}
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
                                                        setFilterFrequency(tempFrequency);
                                                        setSearchTerm(tempSearchTerm);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className="flex-1 py-2 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm shadow-md"
                                                >
                                                    Apply Filters
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
                                    Connect Sheet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-4 pb-4 pt-2 mt-0 font-primary w-full flex-1">
                    {/* Matrix Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <NumberCard
                            title="Total sheets"
                            number={stats.total}
                            icon={<FileSpreadsheet className="text-blue-600" size={24} />}
                            iconBgColor="bg-blue-100"
                            lineBorderClass="border-blue-500"
                        />
                        <NumberCard
                            title="Automated syncs"
                            number={stats.automated}
                            icon={<RefreshCw className="text-green-600" size={24} />}
                            iconBgColor="bg-green-100"
                            lineBorderClass="border-green-500"
                        />
                        <NumberCard
                            title="Sync history"
                            number={stats.totalLogs}
                            icon={<History className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                        <NumberCard
                            title="Manual connections"
                            number={stats.manual}
                            icon={<Share2 className="text-purple-600" size={24} />}
                            iconBgColor="bg-purple-100"
                            lineBorderClass="border-purple-500"
                        />
                    </div>
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab("accounts")}
                            className={`px-6 py-2.5 rounded-sm font-bold transition-all capitalize text-sm border ${activeTab === 'accounts'
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D] shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}
                        >
                            Connected Sheets
                        </button>
                        <button
                            onClick={() => setActiveTab("logs")}
                            className={`px-6 py-2.5 rounded-sm font-bold transition-all capitalize text-sm border ${activeTab === 'logs'
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D] shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}
                        >
                            Sync History
                        </button>
                    </div>

                    {activeTab === 'accounts' ? (
                        isLoading ? (
                            <div className="flex justify-center p-20">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-semibold animate-pulse">Loading configurations...</p>
                                </div>
                            </div>
                        ) : filteredConfigs.length === 0 ? (
                            configs?.length > 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm border border-gray-200 shadow-sm text-center">
                                    <div className="p-4 bg-orange-50 rounded-full mb-4">
                                        <SearchX className="text-orange-400" size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">No matching sheets found</h3>
                                    <p className="text-gray-500 max-w-sm mb-6 text-sm">
                                        We couldn't find any sheets matching your current search or filters. Try adjusting your criteria.
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
                                        <FileSpreadsheet className="text-orange-400" size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Sheets Connected</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                                        You haven't connected any Google Sheets yet. Start syncing leads automatically by connecting your first sheet.
                                    </p>
                                    <button
                                        onClick={() => { resetForm(); setShowModal(true); }}
                                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        <Plus size={18} /> Connect First Sheet
                                    </button>
                                </div>
                            )
                        ) : (
                            viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredConfigs.map((config) => (
                                        <div key={config.id} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group flex flex-col h-full relative">

                                            {/* Action Icons - Top Right (Hidden by default, shown on hover) */}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button
                                                    onClick={() => handleEdit(config)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm bg-white shadow-sm border border-green-100"
                                                    title="Edit"
                                                >
                                                    <SquarePen size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(config)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm bg-white shadow-sm border border-red-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleView(config)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm bg-white shadow-sm border border-blue-100"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>

                                            <div className="p-6 pb-4 flex-1 flex flex-col items-center mt-2">
                                                {/* Icon */}
                                                <div className="relative mb-4">
                                                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold border-4 border-orange-100/50">
                                                        <FileSpreadsheet size={32} className="text-[#FF7B1D]" />
                                                    </div>
                                                    <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${config.last_sync_at ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize text-center line-clamp-2" title={config.sheet_name}>{config.sheet_name}</h3>

                                                <div className="flex flex-col items-center gap-2 mb-4 w-full">
                                                    <p className="text-[10px] text-gray-400 font-medium font-mono bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">
                                                        {config.spreadsheet_id.substring(0, 12)}...
                                                    </p>
                                                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-sm border border-gray-100">
                                                        <RefreshCw size={12} className="text-orange-500" />
                                                        {config.sync_frequency} Sync
                                                    </span>
                                                    <div className="text-[10px] text-gray-400 font-medium">
                                                        Last: {config.last_sync_at ? new Date(config.last_sync_at).toLocaleDateString() : 'Never'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-100 p-4 border-t border-gray-200 mt-auto">
                                                <button
                                                    onClick={() => handleSync(config.id)}
                                                    disabled={isSyncing}
                                                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-[#FF7B1D] py-2.5 rounded-sm font-bold text-[11px] transition-all capitalize tracking-wider border border-orange-100 shadow-sm"
                                                >
                                                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                                                    {isSyncing ? "Syncing..." : "Sync Now"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div> <div className="bg-white rounded-sm border border-gray-200 shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold capitalize tracking-wide">
                                                <tr>
                                                    <th className="px-4 py-3">Sheet details</th>
                                                    <th className="px-4 py-3">Sheet mapping</th>
                                                    <th className="px-4 py-3 text-center">Last sync</th>
                                                    <th className="px-4 py-3 text-center">Frequency</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm font-medium">
                                                {filteredConfigs.map((config) => (
                                                    <tr key={config.id} className="border-t border-gray-100 hover:bg-orange-50/30 transition-colors group text-sm">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-orange-50 rounded-sm">
                                                                    <FileSpreadsheet className="text-[#FF7B1D]" size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-800 capitalize leading-none text-base">{config.sheet_name}</div>
                                                                    <div className="text-[11px] text-gray-400 font-mono mt-1 truncate max-w-[150px]">ID: {config.spreadsheet_id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                                                                {Object.entries(typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping)
                                                                    .filter(([_, v]) => v)
                                                                    .slice(0, 3)
                                                                    .map(([k, _]) => (
                                                                        <span key={k} className="px-1.5 py-0.5 bg-gray-50 text-[11px] font-bold capitalize text-gray-500 border border-gray-200 rounded-sm">
                                                                            {k.replace('_', ' ')}
                                                                        </span>
                                                                    ))}
                                                                {Object.entries(typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping).filter(([_, v]) => v).length > 3 && (
                                                                    <div className="relative group/tooltip">
                                                                        <span className="text-[11px] font-bold text-[#FF7B1D] cursor-pointer hover:underline decoration-[#FF7B1D]">
                                                                            +{Object.entries(typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping).filter(([_, v]) => v).length - 3} more
                                                                        </span>

                                                                        {/* Tooltip */}
                                                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-max max-w-[250px] z-50">
                                                                            <div className="bg-white text-gray-800 rounded-sm py-3 px-4 shadow-xl border border-gray-100 relative">
                                                                                <div className="font-bold border-b border-gray-100 pb-2 mb-2 text-[#FF7B1D] uppercase tracking-wider text-[10px] flex items-center gap-1">
                                                                                    <CheckCircle size={10} /> Remaining Fields
                                                                                </div>
                                                                                <div className="flex flex-col gap-1.5">
                                                                                    {Object.entries(typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping)
                                                                                        .filter(([_, v]) => v)
                                                                                        .slice(3)
                                                                                        .map(([k, _]) => (
                                                                                            <span key={k} className="capitalize font-semibold truncate text-xs text-gray-600 flex items-center gap-1.5">
                                                                                                <div className="w-1 h-1 bg-[#FF7B1D] rounded-full"></div> {k.replace('_', ' ')}
                                                                                            </span>
                                                                                        ))}
                                                                                </div>
                                                                                {/* Arrow */}
                                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white drop-shadow-sm"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="text-sm font-semibold text-gray-700">
                                                                {config.last_sync_at ? new Date(config.last_sync_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-sm capitalize tracking-wide">
                                                                {config.sync_frequency}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleSync(config.id)}
                                                                    disabled={isSyncing}
                                                                    className={`p-1.5 text-[#FF7B1D] hover:bg-orange-50 rounded-sm transition-all ${isSyncing ? 'animate-spin opacity-50' : ''}`}
                                                                    title="Manual Sync"
                                                                >
                                                                    <RefreshCw size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleView(config)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(config)}
                                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <SquarePen size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(config)}
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

                                </div> {configs.length > 0 && (
                                    <div className="border border-gray-200 flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 mt-6 rounded-sm shadow-sm">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total || 0)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Sheets
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
                                                {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }, (_, i) => {
                                                    // Simple pagination logic for first 5 pages or handle properly if needed. 
                                                    // For now showing up to 5 or using AllToDo logic which shows all.
                                                    // AllToDo logic:
                                                    return (
                                                        <button
                                                            key={i + 1}
                                                            onClick={() => setCurrentPage(i + 1)}
                                                            className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    )
                                                })}
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
                        )
                    ) : (<div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold capitalize tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3">Timestamp</th>
                                        <th className="px-4 py-3">Source</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-right">Message</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium">
                                    {logs?.length > 0 ? logs.map((log) => (
                                        <tr key={log.id} className="border-t hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 capitalize font-bold text-gray-700">{log.channel_type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${log.status === 'success'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-right text-xs">{log.message}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                                No sync logs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section for Logs */}
                        {logs?.length > 0 && (
                            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 border-t border-gray-200">
                                <p className="text-sm font-semibold text-gray-700">
                                    Showing <span className="text-orange-600">{(currentLogPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentLogPage * itemsPerPage, logsPagination.total || 0)}</span> of <span className="text-orange-600">{logsPagination.total || 0}</span> Logs
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentLogPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentLogPage === 1}
                                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentLogPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(logsPagination.totalPages || 1, 5) }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentLogPage(i + 1)}
                                                className={`w-10 h-10 rounded-sm font-bold transition ${currentLogPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentLogPage(prev => Math.min(prev + 1, logsPagination.totalPages))}
                                        disabled={currentLogPage === logsPagination.totalPages || logsPagination.totalPages === 0}
                                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentLogPage === logsPagination.totalPages || logsPagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    )}

                    {/* Sync Modal */}
                    {showModal && (
                        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shrink-0">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-2 rounded-sm">
                                                <FileSpreadsheet />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold capitalize">
                                                    {editingConfig ? "Edit Connection" : "Connect Google Sheet"}
                                                </h2>
                                                <p className="text-orange-50 text-xs font-medium mt-0.5">Configure spreadsheet API and field mapping</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-orange-700 rounded-sm transition-all focus:outline-none">
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                    <FileText size={16} className="text-[#FF7B1D]" />
                                                    Connection name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm font-semibold placeholder:font-normal placeholder:text-gray-300"
                                                    value={configData.sheet_name}
                                                    onChange={(e) => setConfigData({ ...configData, sheet_name: e.target.value })}
                                                    placeholder="e.g. Sales master sheet"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                    <Database size={16} className="text-[#FF7B1D]" />
                                                    Spreadsheet ID <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm font-semibold placeholder:font-normal placeholder:text-gray-300"
                                                    value={configData.spreadsheet_id}
                                                    onChange={(e) => setConfigData({ ...configData, spreadsheet_id: e.target.value })}
                                                    placeholder="Enter spreadsheet ID"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                    <Layout size={16} className="text-[#FF7B1D]" />
                                                    Sheet ID (tab name) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm font-semibold"
                                                    value={configData.sheet_id}
                                                    onChange={(e) => setConfigData({ ...configData, sheet_id: e.target.value })}
                                                    placeholder="e.g. Sheet1"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                    <RefreshCw size={16} className="text-[#FF7B1D]" />
                                                    Sync frequency
                                                </label>
                                                <select
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-sm font-semibold cursor-pointer"
                                                    value={configData.sync_frequency}
                                                    onChange={(e) => setConfigData({ ...configData, sync_frequency: e.target.value })}
                                                >
                                                    <option value="manual">Manual only</option>
                                                    <option value="hourly">Every hour</option>
                                                    <option value="daily">Daily sync</option>
                                                    <option value="weekly">Weekly sync</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                <Settings size={16} className="text-[#FF7B1D]" />
                                                Credentials JSON <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-[#FF7B1D] outline-none transition-all text-xs font-mono h-32 leading-relaxed"
                                                value={configData.credentials_json}
                                                onChange={(e) => setConfigData({ ...configData, credentials_json: e.target.value })}
                                                placeholder='Paste your Google Service Account JSON here...'
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                                <CheckSquare size={16} className="text-[#FF7B1D]" />
                                                Field mapping (enter column headers)
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-6 rounded-sm border border-gray-200 shadow-inner">
                                                {crmFields.map((field) => (
                                                    <div key={field.value} className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500 capitalize tracking-wide ml-1">{field.label}</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none transition-all text-xs font-semibold placeholder:font-normal"
                                                            value={configData.field_mapping[field.value]}
                                                            onChange={(e) => handleFieldMapping(field.value, e.target.value)}
                                                            placeholder={`Google sheet column for ${field.label.toLowerCase()}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end pt-6 mt-6 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 border-2 border-gray-200 rounded-sm font-bold text-xs text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
                                        >
                                            <Save size={16} /> {editingConfig ? "Update Changes" : "Connect Sheet"}
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
                                    Disconnect
                                </button>
                            </div>
                        }
                    >
                        <div className="flex flex-col items-center text-center text-black">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle size={48} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Disconnect Sheet</h2>
                            <p className="text-gray-600 mb-2 leading-relaxed">
                                Are you sure you want to disconnect <span className="font-bold text-gray-800">"{configToDelete?.sheet_name}"</span>?
                            </p>
                            <p className="text-xs text-red-500 italic font-medium">Auto-syncing for this sheet will be disabled immediately.</p>
                        </div>
                    </Modal>
                </div>
            </div>
            {/* View Modal */}
            <ViewGoogleSheetModal
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setViewConfig(null);
                }}
                config={viewConfig}
            />
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

export default GoogleDocs;

const ViewGoogleSheetModal = ({ isOpen, onClose, config }) => {
    if (!config) return null;

    const mapping = typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping;
    const mappingEntries = Object.entries(mapping).filter(([_, v]) => v);

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
            <FileSpreadsheet size={24} className="text-[#FF7B1D]" />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={config.sheet_name}
            subtitle={config.spreadsheet_id}
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
                        <span className="text-2xl font-bold text-blue-900">{mappingEntries.length}</span>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Mapped Fields</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-orange-500 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            <Clock size={20} />
                        </div>
                        <span className="text-2xl font-bold text-orange-900 capitalize">{config.sync_frequency}</span>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">Frequency</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            <RefreshCw size={20} />
                        </div>
                        <span className="text-sm font-bold text-green-900 mt-2">
                            {config.last_sync_at ? new Date(config.last_sync_at).toLocaleDateString() : 'Never'}
                        </span>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Last Sync</span>
                    </div>
                </div>

                {/* Fields Section */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 capitalize mb-3 flex items-center gap-2">
                        <List size={16} className="text-[#FF7B1D]" /> Field Mapping
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-sm overflow-hidden flex flex-col max-h-60">
                        <div className="overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm relative">
                                <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-gray-700 uppercase tracking-wider text-[10px]">CRM Field</th>
                                        <th className="px-4 py-2 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Sheet Header</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mappingEntries.map(([key, value], idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                            <td className="px-4 py-2 font-bold text-gray-800 capitalize">{key.replace('_', ' ')}</td>
                                            <td className="px-4 py-2 text-gray-600 font-mono text-xs">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Settings Section */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 capitalize mb-3 flex items-center gap-2">
                        <FileSpreadsheet size={16} className="text-[#FF7B1D]" /> Spreadsheet ID
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 text-sm font-mono text-gray-600 break-all">
                        {config.spreadsheet_id}
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-sm">
                    <Calendar size={16} />
                    <span>Connected on {new Date(config.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        </Modal>
    );
};

