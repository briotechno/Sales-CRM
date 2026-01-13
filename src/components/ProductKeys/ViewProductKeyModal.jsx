import React from "react";
import { KeyRound, Users, Calendar, ShieldCheck, Tag, Info } from "lucide-react";
import Modal from "../common/Modal";

const ViewProductKeyModal = ({ isOpen, onClose, productKey }) => {
    if (!productKey) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-sm hover:bg-gray-100 transition shadow-sm font-semibold"
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
            icon={<KeyRound size={26} />}
            footer={footer}
        >
            <div className="space-y-8 font-semibold">
                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center shadow-sm">
                        <div className="bg-blue-600 p-2 rounded-lg text-white inline-block mb-2 shadow-lg shadow-blue-500/20">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{productKey.users}</div>
                        <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Users</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center shadow-sm">
                        <div className="bg-orange-500 p-2 rounded-lg text-white inline-block mb-2 shadow-lg shadow-orange-500/20">
                            <Tag size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">{productKey.plan}</div>
                        <div className="text-[10px] font-bold tracking-widest text-orange-600 uppercase">Plan</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center shadow-sm">
                        <div className="bg-green-600 p-2 rounded-lg text-white inline-block mb-2 shadow-lg shadow-green-500/20">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">{productKey.status}</div>
                        <div className="text-[10px] font-bold tracking-widest text-green-600 uppercase">Status</div>
                    </div>
                </div>

                {/* KEY DISPLAY */}
                <div className="bg-gray-900 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                        <KeyRound className="text-white" size={40} />
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">License Key</div>
                    <div className="text-2xl font-black text-white tracking-[0.2em] font-mono select-all">
                        {productKey.product_key}
                    </div>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow
                        label="Generated On"
                        value={new Date(productKey.generatedOn).toLocaleDateString()}
                        icon={<Calendar size={18} className="text-orange-500" />}
                    />
                    <DetailRow
                        label="Expires On"
                        value={productKey.expiresOn ? new Date(productKey.expiresOn).toLocaleDateString() : 'N/A'}
                        icon={<Calendar size={18} className="text-red-500" />}
                    />
                    <DetailRow
                        label="Validity"
                        value={productKey.validity}
                        icon={<Info size={18} className="text-blue-500" />}
                    />
                </div>
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 bg-gray-50 rounded-lg">
            {icon}
        </div>
        <div>
            <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-bold text-gray-900">{value}</div>
        </div>
    </div>
);

export default ViewProductKeyModal;
