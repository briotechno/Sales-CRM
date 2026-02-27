import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
    PhoneCall,
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
    Key,
    Globe
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

const JustdialIntegration = () => {
    const [activeTab, setActiveTab] = useState("accounts");
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [formData, setFormData] = useState({ account_name: '', mobile: '', api_key: '' });

    // Real API fetching
    const { data: configsData, isLoading: isLoadingConfigs } = useGetChannelConfigsQuery("justdial");
    const [saveConfig] = useSaveChannelConfigMutation();
    const [deleteConfig] = useDeleteChannelConfigMutation();
    const [syncLeads, { isLoading: isSyncing }] = useSyncChannelLeadsMutation();

    const connections = configsData?.data || [];

    const { data: logsResponse, isLoading: isLoadingLogs } = useGetLogsQuery({
        page: 1,
        limit: 10,
        channel_type: "justdial"
    });

    const logs = logsResponse?.data || [];

    const handleConnect = () => {
        setIsConnectModalOpen(true);
    };

    const confirmConnect = async (e) => {
        e.preventDefault();
        try {
            await saveConfig({
                channel_type: "justdial",
                account_name: formData.account_name,
                api_key: formData.api_key,
                config_data: { mobile: formData.mobile }
            }).unwrap();

            setIsConnectModalOpen(false);
            setFormData({ account_name: '', mobile: '', api_key: '' });
            toast.success("Justdial account linked successfully!");
        } catch (err) {
            toast.error(err.data?.message || "Failed to link account");
        }
    };

    const handleDisconnect = async (id) => {
        if (window.confirm("Disconnect this Justdial account?")) {
            try {
                await deleteConfig(id).unwrap();
                toast.success("Connection removed");
            } catch (err) {
                toast.error("Failed to remove connection");
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
                                <h1 className="text-2xl font-bold text-gray-800">Justdial Integration</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Home className="text-gray-700" size={14} />
                                    <span className="text-gray-400">Integration /</span>
                                    <span className="text-[#FF7B1D] font-medium">Justdial</span>
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
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-4 py-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <NumberCard
                            title="JD Connections"
                            number={connections.length}
                            icon={<PhoneCall className="text-blue-600" size={24} />}
                            iconBgColor="bg-blue-100"
                            lineBorderClass="border-blue-500"
                        />
                        <NumberCard
                            title="Daily Hits"
                            number="0"
                            icon={<Globe className="text-green-600" size={24} />}
                            iconBgColor="bg-green-100"
                            lineBorderClass="border-green-500"
                        />
                        <NumberCard
                            title="Live Status"
                            number={connections.length > 0 ? "Active" : "Inactive"}
                            icon={<CheckCircle className="text-orange-600" size={24} />}
                            iconBgColor="bg-orange-100"
                            lineBorderClass="border-orange-500"
                        />
                        <NumberCard
                            title="Auth Key"
                            number={connections.length > 0 ? "****" : "None"}
                            icon={<Key className="text-purple-600" size={24} />}
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
                            Linked Accounts
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
                        connections.length === 0 ? (
                            <EmptyState
                                title="No Justdial Accounts"
                                message="Connect your Justdial business listing to receive enquiries directly into your CRM workstation."
                                type="leads"
                            />
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "bg-white border rounded-sm overflow-hidden"}>
                                {viewMode === "grid" ? (
                                    connections.map(conn => (
                                        <div key={conn.id} className="bg-white rounded-sm border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                                            {/* Side decoration */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500"></div>

                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#FF7B1D]">
                                                    <PhoneCall size={24} />
                                                </div>
                                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-sm border border-orange-100 uppercase">
                                                    Synced
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{conn.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium mb-4">{conn.mobile}</p>

                                            <div className="flex items-center gap-4 py-3 border-y border-gray-50 mb-4">
                                                <div>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Leads</span>
                                                    <span className="text-lg font-bold text-gray-800">{conn.leadsCount}</span>
                                                </div>
                                                <div className="h-8 w-[1px] bg-gray-100"></div>
                                                <div>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Uptime</span>
                                                    <span className="text-lg font-bold text-green-600">99.9%</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSync(conn.id)}
                                                    disabled={isSyncing}
                                                    className="flex-1 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> Sync
                                                </button>
                                                <button
                                                    onClick={() => handleDisconnect(conn.id)}
                                                    className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-sm border border-red-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider border-b">
                                                <tr>
                                                    <th className="px-6 py-4">Profile Name</th>
                                                    <th className="px-6 py-4">Contact</th>
                                                    <th className="px-6 py-4">Total Leads</th>
                                                    <th className="px-6 py-4">Last Sync</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {connections.map(conn => (
                                                    <tr key={conn.id} className="hover:bg-orange-50/20 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-orange-50 text-[#FF7B1D] rounded-sm">
                                                                    <PhoneCall size={18} />
                                                                </div>
                                                                <span className="font-bold text-gray-800">{conn.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 font-semibold">{conn.mobile}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-sm">{conn.leadsCount}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-400 text-xs">{new Date(conn.lastSync).toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleSync(conn.id)}
                                                                    disabled={isSyncing}
                                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm shadow-sm border border-orange-100 transition-all disabled:opacity-50"
                                                                >
                                                                    <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                                                                </button>
                                                                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-sm transition-all"><Settings size={16} /></button>
                                                                <button
                                                                    onClick={() => handleDisconnect(conn.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all"
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
                        <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
                            {/* Same log table as Meta */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FFFBF8] text-gray-700 text-[11px] font-bold uppercase tracking-widest border-b border-orange-100">
                                        <tr>
                                            <th className="px-6 py-4">Event Time</th>
                                            <th className="px-6 py-4">Log Type</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {logs.length > 0 ? logs.map(log => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-4 text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 font-bold text-gray-700 capitalize">Justdial Fetch</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${log.status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-gray-500">{log.message}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12">
                                                    <EmptyState title="No sync activity" message="You'll see Justdial sync logs here after setup." type="leads" />
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
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#FF7B1D] mx-auto mb-4">
                                <PhoneCall size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Add Justdial Link</h2>
                            <p className="text-gray-500 text-sm">Enter your Justdial credentials to sync leads.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Account Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mumbai Office"
                                    value={formData.account_name}
                                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none font-semibold text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mobile Number (JD Registered)</label>
                                <input
                                    type="tel"
                                    placeholder="Enter 10 digit number"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none font-semibold text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">API KEY (Optional)</label>
                                <input
                                    type="password"
                                    placeholder="Paste JD API key here"
                                    value={formData.api_key}
                                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#FF7B1D] outline-none font-semibold text-sm transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm shadow-xl hover:shadow-orange-200 transition-all uppercase text-xs tracking-widest active:scale-95"
                        >
                            Verify & Connect
                        </button>
                    </form>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default JustdialIntegration;
