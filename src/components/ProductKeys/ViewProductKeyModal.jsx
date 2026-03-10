import React from "react";
import { KeyRound, Users, Calendar, ShieldCheck, Tag, Info, Zap, HardDrive, Layout, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import Modal from "../common/Modal";

const ViewProductKeyModal = ({ isOpen, onClose, productKey }) => {
    if (!productKey) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-sm hover:bg-gray-100 transition shadow-sm font-bold text-sm font-primary"
        >
            Close
        </button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={productKey.enterprise}
            subtitle={"Product Key ID: KEY-" + productKey.id}
            icon={<KeyRound size={24} className="text-[#FF7B1D]" />}
            footer={footer}
        >
            <div className="space-y-6 p-1">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 text-center shadow-sm">
                        <div className="bg-blue-600 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{productKey.users || "0"}</div>
                        <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Allowed Users</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 text-center shadow-sm">
                        <div className="bg-orange-500 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <Tag size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">{productKey.plan}</div>
                        <div className="text-[10px] font-bold tracking-widest text-orange-600 uppercase">Plan Type</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 text-center shadow-sm font-primary">
                        <div className="bg-green-600 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">{productKey.status}</div>
                        <div className="text-[10px] font-bold tracking-widest text-green-600 uppercase">License Status</div>
                    </div>
                </div>

                {/* License Key Display */}
                <div className="bg-[#1a222c] p-6 rounded-sm relative overflow-hidden group shadow-lg border border-gray-800">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <KeyRound className="text-orange-500" size={60} />
                    </div>
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
                        <Layout size={14} /> Product License Key
                    </div>
                    <div className="text-2xl font-black text-white tracking-[0.2em] font-mono select-all break-all drop-shadow-md">
                        {productKey.product_key}
                    </div>
                </div>

                {/* Detailed Resource Info */}
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <h4 className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-orange-100 pb-2">
                        Assigned Resources & Limits
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <DetailRow
                            label="Monthly Leads"
                            value={productKey.leads.toLocaleString()}
                            icon={<Zap size={18} className="text-yellow-500" />}
                        />
                        <DetailRow
                            label="Cloud Storage"
                            value={`${productKey.storage} GB`}
                            icon={<HardDrive size={18} className="text-purple-500" />}
                        />
                        <DetailRow
                            label="Validity Period"
                            value={productKey.validity}
                            icon={<Calendar size={18} className="text-blue-500" />}
                        />
                        <DetailRow
                            label="Expiration Date"
                            value={productKey.expiresOn ? new Date(productKey.expiresOn).toLocaleDateString() : 'Lifetime'}
                            icon={<Calendar size={18} className="text-red-500" />}
                        />
                    </div>
                </div>

                {/* Metadata */}
                <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated On:</span>
                        <span className="text-xs font-bold text-gray-700">{new Date(productKey.generatedOn).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${productKey.status === "Active" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                        {productKey.status === "Active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {productKey.status}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1">
        <div className="p-2.5 bg-white rounded-sm shadow-sm border border-gray-100 group-hover:border-orange-200 transition-colors">
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider leading-none mb-1">{label}</div>
            <div className="text-sm font-bold text-gray-700">{value}</div>
        </div>
    </div>
);

export default ViewProductKeyModal;
