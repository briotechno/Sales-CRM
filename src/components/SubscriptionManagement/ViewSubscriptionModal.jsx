import React from "react";
import {
    CreditCard,
    Users,
    Handshake,
    Calendar,
    CheckCircle,
    XCircle,
    RefreshCw,
    DollarSign,
    Zap,
    HardDrive,
    Check,
    List,
} from "lucide-react";
import Modal from "../common/Modal";

const ViewSubscriptionModal = ({ isOpen, onClose, subscription }) => {
    if (!subscription) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-sm"
        >
            Close
        </button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={subscription.name}
            subtitle={"Subscription ID: " + subscription.id}
            icon={<CreditCard size={26} />}
            footer={footer}
        >
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">

                {/* STATS */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                        <div className="bg-blue-600 p-2 rounded-xl text-white inline-block mb-2 shadow-lg shadow-blue-500/20">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{subscription.users || "0"}</div>
                        <div className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Users</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                        <div className="bg-orange-500 p-2 rounded-xl text-white inline-block mb-2 shadow-lg shadow-orange-500/20">
                            <Handshake size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-900">{subscription.plan}</div>
                        <div className="text-[10px] font-black tracking-widest text-orange-600 uppercase">Plan</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                        <div className="bg-green-600 p-2 rounded-xl text-white inline-block mb-2 shadow-lg shadow-green-500/20">
                            {subscription.status === "Active" ? (
                                <CheckCircle size={20} />
                            ) : (
                                <XCircle size={20} />
                            )}
                        </div>
                        <div className="text-xl font-black text-gray-900">{subscription.status}</div>
                        <div className="text-[10px] font-black tracking-widest text-green-600 uppercase">Status</div>
                    </div>
                </div>

                {/* PLATFORM LIMITS */}
                <div className="bg-[#f8fafc] p-6 rounded-[24px] border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                        <Layers size={14} /> Platform Limits
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                                <Zap size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Monthly Leads</div>
                                <div className="text-sm font-bold text-slate-700">{subscription.leads || "N/A"}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                                <HardDrive size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cloud Storage</div>
                                <div className="text-sm font-bold text-slate-700">{subscription.storage || "N/A"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KEY FEATURES */}
                {subscription.features && subscription.features.length > 0 && (
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                            <List size={14} /> Key Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {subscription.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                        <Check className="text-green-500" size={10} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DETAILS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                        label="Billing Cycle"
                        value={subscription.billingCycle}
                        icon={<RefreshCw size={18} className="text-blue-500" />}
                    />
                    <DetailRow
                        label="Amount Paid"
                        value={"₹" + (subscription.amount || 0).toLocaleString()}
                        icon={<DollarSign size={18} className="text-green-500" />}
                    />
                    <DetailRow
                        label="Start Date"
                        value={subscription.onboardingDate}
                        icon={<Calendar size={18} className="text-orange-500" />}
                    />
                    <DetailRow
                        label="Expiry Date"
                        value={subscription.expiryDate || "N/A"}
                        icon={<Calendar size={18} className="text-red-500" />}
                    />
                </div>
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 bg-gray-50 rounded-xl">
            {icon}
        </div>
        <div>
            <div className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-bold text-gray-900">{value}</div>
        </div>
    </div>
);

export default ViewSubscriptionModal;
