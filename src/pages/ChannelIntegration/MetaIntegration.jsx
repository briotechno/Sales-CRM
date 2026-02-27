import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Facebook,
    Plus,
    RefreshCw,
    History,
    LayoutGrid,
    List,
    Filter,
    Search,
    Settings,
    X,
    CheckCircle,
    AlertCircle,
    Link2,
    ExternalLink,
    Table as TableIcon,
    Home,
    Trash2,
    Edit2,
    Users
} from "lucide-react";
import {
    useGetLogsQuery,
    useGetChannelConfigsQuery,
    useSaveChannelConfigMutation,
    useDeleteChannelConfigMutation,
    useSyncChannelLeadsMutation
} from "../../store/api/integrationApi";
import { toast } from "react-hot-toast";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import NumberCard from "../../components/NumberCard";

const MetaIntegration = () => {
    const [activeTab, setActiveTab] = useState("accounts");
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");

    // Real API fetching
    const { data: configsData, isLoading: isLoadingConfigs } = useGetChannelConfigsQuery("meta");
    const [saveConfig] = useSaveChannelConfigMutation();
    const [deleteConfig] = useDeleteChannelConfigMutation();
    const [syncLeads, { isLoading: isSyncing }] = useSyncChannelLeadsMutation();

    const connectedPages = configsData?.data || [];

    const { data: logsResponse, isLoading: isLoadingLogs } = useGetLogsQuery({
        page: 1,
        limit: 10,
        channel_type: "meta"
    });

    const logs = logsResponse?.data || [];

    const handleConnect = () => {
        setIsConnectModalOpen(true);
    };

    const confirmConnect = async () => {
        try {
            await saveConfig({
                channel_type: "meta",
                account_name: "My Business Page",
                api_key: "EAAL...", // This would be the OAuth token in production
                config_data: { page_id: "12345" }
            }).unwrap();

            setIsConnectModalOpen(false);
            toast.success("Meta Page connected successfully!");
        } catch (err) {
            toast.error(err.data?.message || "Failed to connect");
        }
    };

    const handleDisconnect = async (id) => {
        if (window.confirm("Are you sure you want to disconnect this page?")) {
            try {
                await deleteConfig(id).unwrap();
                toast.success("Disconnected successfully");
            } catch (err) {
                toast.error("Failed to disconnect");
            }
        }
    };

    const handleSync = async (id) => {
        try {
            const res = await syncLeads(id).unwrap();
            toast.success(`Sync successful! ${res.successCount} leads imported.`);
        } catch (err) {
            toast.error("Sync failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white font-primary">
                {/* Header Section */}
                <div className="bg-white sticky top-0 z-30">
                    <div className="max-w-8xl mx-auto px-4 py-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Meta Integration</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400">Integration /</span>
                                    <span className="text-[#FF7B1D] font-medium">Meta Ads</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-100 p-1 rounded-sm border border-gray-200 shadow-inner">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-sm transition-all ${viewMode === "grid" ? "bg-white text-orange-600 shadow-sm border border-gray-100" : "text-gray-400"}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={`p-2 rounded-sm transition-all ${viewMode === "table" ? "bg-white text-orange-600 shadow-sm border border-gray-100" : "text-gray-400"}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleConnect}
                                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700"
                                >
                                    <Plus size={20} />
                                    Connect Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-4 py-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <NumberCard
                            title="Connected Pages"
                            number={connectedPages.length}
                            icon={<Facebook className="text-blue-600" size={24} />}
                            iconBgColor="bg-blue-100"
                            lineBorderClass="border-blue-500"
                        />
                        <NumberCard
                            title="Leads Sync (24h)"
                            number="0"
                            icon={<RefreshCw className="text-green-600" size={24} />}
                            iconBgColor="bg-green-100"
                            lineBorderClass="border-green-500"
                        />
                        <NumberCard
                            title="Sync Success Rate"
                            number="100%"
                            icon={<CheckCircle className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                        <NumberCard
                            title="Active Webhooks"
                            number={connectedPages.length > 0 ? "1" : "0"}
                            icon={<Link2 className="text-purple-600" size={24} />}
                            iconBgColor="bg-purple-100"
                            lineBorderClass="border-purple-500"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab("accounts")}
                            className={`px-6 py-2.5 rounded-sm font-bold transition-all text-sm border ${activeTab === 'accounts' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D] shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
                        >
                            Connected Pages
                        </button>
                        <button
                            onClick={() => setActiveTab("logs")}
                            className={`px-6 py-2.5 rounded-sm font-bold transition-all text-sm border ${activeTab === 'logs' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D] shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
                        >
                            Sync History
                        </button>
                    </div>

                    {/* Content Area */}
                    {activeTab === "accounts" ? (
                        connectedPages.length === 0 ? (
                            <EmptyState
                                title="No Meta Pages Connected"
                                message="Connect your Facebook Business page to start downloading leads from your Lead Ads automatically."
                                type="leads"
                            />
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "bg-white border rounded-sm overflow-hidden"}>
                                {viewMode === "grid" ? (
                                    connectedPages.map(page => (
                                        <div key={page.id} className="bg-gradient-to-br from-white to-gray-50 rounded-sm border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <Facebook size={24} />
                                                </div>
                                                <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    {page.status}
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">{page.name}</h3>
                                            <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                                                <RefreshCw size={10} /> Last synced: {new Date(page.lastSync).toLocaleString()}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <div className="bg-white border border-gray-100 p-3 rounded-sm">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Total Leads</span>
                                                    <span className="text-xl font-bold text-gray-800">{page.leadsCount}</span>
                                                </div>
                                                <div className="bg-white border border-gray-100 p-3 rounded-sm flex flex-col justify-center items-center">
                                                    <button
                                                        onClick={() => handleSync(page.id)}
                                                        disabled={isSyncing}
                                                        className="text-orange-600 hover:text-orange-700 disabled:opacity-50"
                                                    >
                                                        <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
                                                    </button>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Sync</span>
                                                </div>
                                            </div>
                                            <div className="mt-5 flex gap-2">
                                                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-sm hover:bg-gray-50">
                                                    <Settings size={14} /> Config
                                                </button>
                                                <button
                                                    onClick={() => handleDisconnect(page.id)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-sm border border-red-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#FFF8F4] text-gray-800 text-sm font-bold border-b border-orange-100">
                                                <tr>
                                                    <th className="px-6 py-4">Page Name</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Leads Synced</th>
                                                    <th className="px-6 py-4">Last Sync</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {connectedPages.map(page => (
                                                    <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-sm">
                                                                    <Facebook size={18} />
                                                                </div>
                                                                <span className="font-bold text-gray-800">{page.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100 uppercase">
                                                                {page.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-gray-700">{page.leadsCount}</td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{new Date(page.lastSync).toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleSync(page.id)}
                                                                    disabled={isSyncing}
                                                                    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-sm disabled:opacity-50"
                                                                >
                                                                    <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                                                                </button>
                                                                <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-sm"><Settings size={16} /></button>
                                                                <button
                                                                    onClick={() => handleDisconnect(page.id)}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm"
                                                                ><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-[11px] font-bold uppercase tracking-widest border-b">
                                        <tr>
                                            <th className="px-6 py-4">Event Time</th>
                                            <th className="px-6 py-4">Sync ID</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.length > 0 ? logs.map(log => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-[10px] font-mono font-bold text-gray-600">
                                                    #{log.id.toString().substring(0, 8)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${log.status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-gray-600">
                                                    {log.message}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <EmptyState
                                                        title="No logs found"
                                                        message="Sync history will appear here once you connect a page."
                                                        type="leads"
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Connect Modal */}
                <Modal
                    isOpen={isConnectModalOpen}
                    onClose={() => setIsConnectModalOpen(false)}
                    headerVariant="simple"
                    maxWidth="max-w-md"
                    footer={
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setIsConnectModalOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-sm hover:bg-gray-50 transition-all font-primary text-xs uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmConnect}
                                className="flex-1 px-6 py-3 bg-[#1877F2] text-white font-bold rounded-sm hover:bg-[#166fe5] transition-all shadow-lg flex items-center justify-center gap-2 font-primary text-xs uppercase"
                            >
                                Connect Page
                            </button>
                        </div>
                    }
                >
                    <div className="flex flex-col items-center text-center font-primary p-2">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <Facebook className="text-[#1877F2]" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Meta Assets</h2>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Connect your Facebook Business Manager to import leads from your Ads campaigns. Make sure you have Admin access to the page.
                        </p>

                        <div className="w-full space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100 text-left">
                                <CheckCircle className="text-green-500" size={18} />
                                <span className="text-xs font-semibold text-gray-600">Automatic Lead Import</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100 text-left">
                                <CheckCircle className="text-green-500" size={18} />
                                <span className="text-xs font-semibold text-gray-600">Real-time Webhook Sync</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default MetaIntegration;
