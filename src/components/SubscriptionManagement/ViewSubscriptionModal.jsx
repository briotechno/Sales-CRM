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

    const parsedFeatures = typeof subscription.features === 'string' ? JSON.parse(subscription.features) : (subscription.features || []);

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition shadow-sm font-primary"
        >
            Close
        </button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={subscription.enterprise_name}
            subtitle={"Subscription ID: SUB-" + subscription.id}
            icon={<CreditCard size={26} className="text-[#FF7B1D]" />}
            footer={footer}
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar p-2">

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 text-center shadow-sm">
                        <div className="bg-blue-600 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{subscription.users || "0"}</div>
                        <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Users Limit</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 text-center shadow-sm font-primary">
                        <div className="bg-orange-500 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <Handshake size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">{subscription.plan}</div>
                        <div className="text-[10px] font-bold tracking-widest text-orange-600 uppercase">Active Plan</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 text-center shadow-sm">
                        <div className="bg-green-600 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            {subscription.status === "Active" ? (
                                <CheckCircle size={20} />
                            ) : (
                                <XCircle size={20} />
                            )}
                        </div>
                        <div className="text-xl font-bold text-gray-900">{subscription.status}</div>
                        <div className="text-[10px] font-bold tracking-widest text-green-600 uppercase">Current Status</div>
                    </div>
                </div>

                {/* PLATFORM LIMITS */}
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                        Platform Allocation
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-sm">
                                <Zap size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Monthly Leads</div>
                                <div className="text-sm font-bold text-gray-700">{subscription.leads || "N/A"}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-sm">
                                <HardDrive size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Cloud Storage</div>
                                <div className="text-sm font-bold text-gray-700">{subscription.storage || "N/A"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KEY FEATURES */}
                {parsedFeatures && parsedFeatures.length > 0 && (
                    <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                            <List size={14} /> Included Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {parsedFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-sm border border-transparent hover:border-gray-100 transition-all">
                                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center border border-green-200 shadow-sm">
                                        <Check className="text-green-600" size={10} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow
                        label="Billing Cycle"
                        value={subscription.billingCycle}
                        icon={<RefreshCw size={18} className="text-blue-500" />}
                    />
                    <DetailRow
                        label="Amount Paid"
                        value={"₹" + (parseFloat(subscription.amount) || 0).toLocaleString()}
                        icon={<DollarSign size={18} className="text-green-500" />}
                    />
                    <DetailRow
                        label="Start Date"
                        value={subscription.onboardingDate ? new Date(subscription.onboardingDate).toLocaleDateString() : 'N/A'}
                        icon={<Calendar size={18} className="text-orange-500" />}
                    />
                    <DetailRow
                        label="Expiry Date"
                        value={subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : "N/A"}
                        icon={<Calendar size={18} className="text-red-500" />}
                    />
                </div>
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-white p-4 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 bg-gray-50 rounded-sm">
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-bold text-gray-800 truncate">{value}</div>
        </div>
    </div>
);

export default ViewSubscriptionModal;
