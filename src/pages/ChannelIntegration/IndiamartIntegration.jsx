import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
    ShoppingBag,
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
    Table as TableIcon,
    Home,
    Trash2,
    Edit2,
    Users,
    Database,
    ShieldCheck
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

const IndiamartIntegration = () => {
    const [activeTab, setActiveTab] = useState("accounts");
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [formData, setFormData] = useState({ account_name: '', api_key: '' });

    // Real API fetching
    const { data: configsData, isLoading: isLoadingConfigs } = useGetChannelConfigsQuery("indiamart");
    const [saveConfig] = useSaveChannelConfigMutation();
    const [deleteConfig] = useDeleteChannelConfigMutation();
    const [syncLeads, { isLoading: isSyncing }] = useSyncChannelLeadsMutation();

    const vendors = configsData?.data || [];

    const { data: logsResponse, isLoading: isLoadingLogs } = useGetLogsQuery({
        page: 1,
        limit: 10,
        channel_type: "indiamart"
    });

    const logs = logsResponse?.data || [];

    const handleConnect = () => {
        setIsConnectModalOpen(true);
    };

    const confirmConnect = async (e) => {
        e.preventDefault();
        try {
            await saveConfig({
                channel_type: "indiamart",
                account_name: formData.account_name, // mobile
                api_key: formData.api_key,
                config_data: {}
            }).unwrap();

            setIsConnectModalOpen(false);
            setFormData({ account_name: '', api_key: '' });
            toast.success("IndiaMart CRM API connected!");
        } catch (err) {
            toast.error(err.data?.message || "Failed to connect");
        }
    };

    const handleDisconnect = async (id) => {
        if (window.confirm("Disconnect IndiaMart vendor?")) {
            try {
                await deleteConfig(id).unwrap();
                toast.success("Vendor disconnected");
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
                                <h1 className="text-2xl font-bold text-gray-800">IndiaMart Integration</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400">Integration /</span>
                                    <span className="text-[#FF7B1D] font-medium">IndiaMart</span>
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
                                    Add CRM Key
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-4 py-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <NumberCard
                            title="Active Keys"
                            number={vendors.length}
                            icon={<ShieldCheck className="text-blue-600" size={24} />}
                            iconBgColor="bg-blue-100"
                            lineBorderClass="border-blue-500"
                        />
                        <NumberCard
                            title="IndiaMart Leads"
                            number="0"
                            icon={<ShoppingBag className="text-green-600" size={24} />}
                            iconBgColor="bg-green-100"
                            lineBorderClass="border-green-500"
                        />
                        <NumberCard
                            title="Sync Status"
                            number={vendors.length > 0 ? "Healthy" : "Offline"}
                            icon={<Database className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                        <NumberCard
                            title="Last Fetch"
                            number="--"
                            icon={<RefreshCw className="text-purple-600" size={24} />}
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
                            API Connections
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
                        vendors.length === 0 ? (
                            <EmptyState
                                title="No IndiaMart Integration"
                                message="Unlock massive B2B leads by connecting your IndiaMart CRM API key. All enquires will sync instantly."
                                type="leads"
                            />
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "bg-white border rounded-sm overflow-hidden"}>
                                {viewMode === "grid" ? (
                                    vendors.map(vendor => (
                                        <div key={vendor.id} className="bg-white rounded-sm border border-orange-100 p-6 shadow-sm hover:shadow-xl transition-all group border-t-4 border-t-orange-500">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="w-10 h-10 bg-orange-600 text-white rounded-sm flex items-center justify-center font-bold text-xl">
                                                    IM
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Live Syncing</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{vendor.name}</h3>
                                            <p className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-sm w-fit border border-gray-100 mb-6 font-bold truncate max-w-full">
                                                KEY: {vendor.crm_key}
                                            </p>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-gray-400 uppercase">Leads Captured</span>
                                                    <span className="text-orange-600">{vendor.leadsCount}</span>
                                                </div>
                                                <div className="w-full bg-gray-50 h-1.5 rounded-full">
                                                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSync(vendor.id)}
                                                    disabled={isSyncing}
                                                    className="flex-1 py-3 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-sm transition-all flex items-center justify-center gap-2 border border-gray-200 hover:border-orange-200 disabled:opacity-50"
                                                >
                                                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> Sync
                                                </button>
                                                <button
                                                    onClick={() => handleDisconnect(vendor.id)}
                                                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-sm border border-red-100 transition-all flex items-center justify-center"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#FF7B1D] text-white text-xs font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Account Name</th>
                                                    <th className="px-6 py-4">API Key</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Fetch Time</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {vendors.map(vendor => (
                                                    <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-orange-600 text-white rounded-sm font-bold text-[10px]">IM</div>
                                                                <span className="font-bold text-gray-800">{vendor.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-xs text-gray-400 font-bold">{vendor.crm_key}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-sm border border-green-200 uppercase">Active</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-gray-500">{new Date(vendor.lastSync).toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2 text-gray-400">
                                                                <button
                                                                    onClick={() => handleSync(vendor.id)}
                                                                    disabled={isSyncing}
                                                                    className="p-2 hover:bg-orange-50 hover:text-orange-600 rounded-sm transition-all disabled:opacity-50"
                                                                >
                                                                    <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                                                                </button>
                                                                <button className="p-2 hover:bg-gray-50 hover:text-gray-800 rounded-sm transition-all"><Settings size={16} /></button>
                                                                <button onClick={() => handleDisconnect(vendor.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-sm transition-all"><Trash2 size={16} /></button>
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
                        <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-800 text-gray-300 text-[11px] font-bold uppercase tracking-widest border-b">
                                        <tr>
                                            <th className="px-6 py-4">Sync Timestamp</th>
                                            <th className="px-6 py-4">System Event</th>
                                            <th className="px-6 py-4">Sync Results</th>
                                            <th className="px-6 py-4 text-right">Server Log</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-xs">
                                        {logs.length > 0 ? logs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 font-bold text-gray-700 uppercase">IndiaMart Feed</td>
                                                <td className="px-6 py-4 italic text-gray-400">{log.status}</td>
                                                <td className="px-6 py-4 text-right font-medium">{log.message}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12">
                                                    <EmptyState title="History is empty" message="Enquiry sync history will be populated here." type="leads" />
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
                >
                    <form onSubmit={confirmConnect} className="font-primary">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-4xl shadow-xl rotate-3">
                                IM
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">B2B Lead Sync</h2>
                            <p className="text-gray-500 text-sm mt-1">Connect your IndiaMart account via CRM API Key.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">IndiaMart Mobile Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 9876543210"
                                        value={formData.account_name}
                                        onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none font-bold text-sm shadow-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">CRM API KEY</label>
                                    <div className="relative">
                                        <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="password"
                                            placeholder="Paste your IndiaMart API Key"
                                            value={formData.api_key}
                                            onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none font-bold text-sm shadow-sm transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 italic ml-1">* You can find this in your IndiaMart Seller Panel under Settings {" > "} CRM Integration.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-10 py-4 bg-orange-600 text-white font-bold rounded-sm shadow-lg hover:bg-orange-700 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95"
                        >
                            <ShieldCheck size={18} /> Authenticate API
                        </button>
                    </form>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default IndiamartIntegration;
