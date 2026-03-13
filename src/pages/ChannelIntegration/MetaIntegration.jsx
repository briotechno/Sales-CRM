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
    Users,
    Calendar,
    Clock
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
    const [formData, setFormData] = useState({
        account_name: "",
        page_id: "",
        api_key: ""
    });

    // Real API fetching
    const { data: configsData, isLoading: isLoadingConfigs } = useGetChannelConfigsQuery("meta");
    const [saveConfig, { isLoading: isConnecting }] = useSaveChannelConfigMutation();
    const [deleteConfig] = useDeleteChannelConfigMutation();
    const [syncLeads, { isLoading: isSyncing }] = useSyncChannelLeadsMutation();

    const connectedPages = configsData?.data || [];

    const { data: logsResponse, isLoading: isLoadingLogs } = useGetLogsQuery({
        page: 1,
        limit: 10,
        channel_type: "meta"
    });

    const logs = logsResponse?.data || [];

    const formatTime12h = (dateObj) => {
        if (!dateObj) return "";
        try {
            const h = dateObj.getHours();
            const m = dateObj.getMinutes().toString().padStart(2, '0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            let DisplayH = h % 12;
            DisplayH = DisplayH ? DisplayH : 12;
            return `${DisplayH}:${m} ${ampm}`;
        } catch (e) {
            return "";
        }
    };

    const handleConnect = () => {
        setIsConnectModalOpen(true);
    };

    const confirmConnect = async (e) => {
        if (e) e.preventDefault();
        try {
            await saveConfig({
                channel_type: "meta",
                account_name: formData.account_name,
                api_key: formData.api_key,
                config_data: { page_id: formData.page_id }
            }).unwrap();

            setIsConnectModalOpen(false);
            setFormData({ account_name: "", page_id: "", api_key: "" });
            toast.success("Meta Assets linked! Your leads will now sync automatically.");
        } catch (err) {
            const errorMsg = err.data?.message || "Authentication failed. Please check your Page ID and Token.";
            toast.error(errorMsg);
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

                <div className="max-w-8xl mx-auto px-4 py-6   pt-0 mt-2">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <NumberCard
                        variant="matrix"
                        title="Connected Pages"
                        number={connectedPages.length}
                        icon={<Facebook className="text-blue-600" size={24} />}
                        iconBgColor="bg-blue-100"
                        lineBorderClass="border-blue-500"
                    />
                    <NumberCard
                        variant="matrix"
                        title="Total Sync Leads"
                        number={connectedPages.reduce((acc, p) => acc + (p.leadsCount || 0), 0)}
                        icon={<RefreshCw className="text-green-600" size={24} />}
                        iconBgColor="bg-green-100"
                        lineBorderClass="border-green-500"
                    />
                    <NumberCard
                        variant="matrix"
                        title="Sync Success Rate"
                        number="98.5%"
                        icon={<CheckCircle className="text-orange-600" size={24} />}
                        iconBgColor="bg-orange-100"
                        lineBorderClass="border-orange-500"
                    />
                    <NumberCard
                        variant="matrix"
                        title="Last Activity"
                        number="2m ago"
                        icon={<Clock className="text-purple-600" size={24} />}
                        iconBgColor="bg-purple-100"
                        lineBorderClass="border-purple-500"
                    />
                    </div>

                    {/* Tabs Navigation - Premium Segmented Pill UI */}
                    <div className="flex mb-8">
                        <div className="flex p-1 bg-white border border-gray-200 rounded-sm shadow-sm">
                            <button
                                onClick={() => setActiveTab("accounts")}
                                className={`px-8 py-2.5 rounded-sm text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'accounts'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_12px_rgba(255,123,29,0.3)]'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                <Facebook size={18} />
                                <span>Connected Pages</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("logs")}
                                className={`px-8 py-2.5 rounded-sm text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'logs'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_12px_rgba(255,123,29,0.3)]'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                <History size={18} />
                                <span>Sync History</span>
                            </button>
                        </div>
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
                                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                                    <th className="px-6 py-3.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Page Name</th>
                                                    <th className="px-6 py-3.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Status</th>
                                                    <th className="px-6 py-3.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Leads Synced</th>
                                                    <th className="px-6 py-3.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Last Sync</th>
                                                    <th className="px-6 py-3.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
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
                        <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[14px]">
                                        <th className="px-6 py-2.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Event Time</th>
                                        <th className="px-6 py-2.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Sync ID</th>
                                        <th className="px-6 py-2.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap">Status</th>
                                        <th className="px-6 py-2.5 font-bold border-b border-orange-400 capitalize whitespace-nowrap text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.length > 0 ? logs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                                    <Calendar size={18} className="text-orange-500 shrink-0" />
                                                    <div className="flex items-center gap-2 flex-nowrap">
                                                        <span className="text-gray-800 font-bold">{new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        <span className="text-[12px] text-orange-600 font-black uppercase bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100">{formatTime12h(new Date(log.created_at))}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2.5 text-sm font-mono font-bold text-gray-600">
                                                #{log.id.toString().substring(0, 8)}
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <span className={`px-3 py-1 rounded-sm text-xs font-bold capitalize tracking-wider ${log.status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2.5 text-right text-sm text-gray-800 font-medium">
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
                    )}
                </div>
            </div>

            {/* Connect Modal */}
            {(() => {
                const connectFooter = (
                    <div className="flex items-center justify-end w-full gap-3">
                        <button
                            type="button"
                            onClick={() => setIsConnectModalOpen(false)}
                            className="px-6 py-2.5 rounded-sm border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-700 transition-all font-primary text-sm bg-white shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmConnect}
                            disabled={isConnecting}
                            className="px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all font-primary text-sm flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isConnecting ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} /> Authenticate & Connect
                                </>
                            )}
                        </button>
                    </div>
                );

                return (
                    <Modal
                        isOpen={isConnectModalOpen}
                        onClose={() => setIsConnectModalOpen(false)}
                        title="Connect Meta Assets"
                        subtitle="Connect your Facebook Business Manager to import leads from your Ads campaigns. Make sure you have Admin access."
                        icon={<Facebook size={24} />}
                        headerVariant="orange"
                        maxWidth="max-w-md"
                        footer={connectFooter}
                    >
                        <div className="space-y-6 pt-2">
                            <form onSubmit={confirmConnect} className="space-y-5 text-left font-primary">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                                        <Users size={16} className="text-orange-500 inline mr-2" />
                                        Account name / Page name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Facebook Main Page"
                                        value={formData.account_name}
                                        onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                                        <Settings size={16} className="text-orange-500 inline mr-2" />
                                        Page ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your Facebook Page ID"
                                        value={formData.page_id}
                                        onChange={(e) => setFormData({ ...formData, page_id: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                                        <Link2 size={16} className="text-orange-500 inline mr-2" />
                                        Access token (API Key) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Paste Page Access Token here"
                                        value={formData.api_key}
                                        onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 italic leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                                        * Use a Long-lived User Token or Page Token for uninterrupted lead sync.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </Modal>
                );
            })()}
        </DashboardLayout>
    );
};

export default MetaIntegration;
