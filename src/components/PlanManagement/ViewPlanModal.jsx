import React from "react";
import { Package, Users, Zap, HardDrive, DollarSign, Info } from "lucide-react";
import Modal from "../common/Modal";

const ViewPlanModal = ({ isOpen, onClose, plan }) => {
    if (!plan) return null;

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
            title={plan.name}
            subtitle={"Plan ID: PLAN-" + plan.id}
            icon={<Package size={26} />}
            footer={footer}
        >
            <div className="space-y-8 font-semibold">
                {/* Description Banner */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Info size={14} /> Plan Overview
                    </div>
                    <p className="text-gray-700 leading-relaxed font-semibold italic">
                        {plan.description || "No description provided for this plan."}
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow
                        label="Monthly Price"
                        value={"₹" + (parseFloat(plan.price) || 0).toLocaleString()}
                        icon={<DollarSign size={20} className="text-green-500" />}
                    />
                    <DetailRow
                        label="Default Users"
                        value={plan.default_users}
                        icon={<Users size={20} className="text-blue-500" />}
                    />
                    <DetailRow
                        label="Leads Limit"
                        value={plan.default_leads}
                        icon={<Zap size={20} className="text-orange-500" />}
                    />
                    <DetailRow
                        label="Included Storage"
                        value={plan.default_storage + " GB"}
                        icon={<HardDrive size={20} className="text-purple-500" />}
                    />
                </div>

                {/* Key Features */}
                {plan.key_features && (
                    <div className="space-y-3">
                        <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest pl-1">Key Features Included</div>
                        <div className="flex flex-wrap gap-2">
                            {plan.key_features.split(',').map((feature, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-2"
                                >
                                    <Zap size={10} className="fill-orange-500" />
                                    {feature.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
            {icon}
        </div>
        <div>
            <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-bold text-gray-900">{value}</div>
        </div>
    </div>
);

export default ViewPlanModal;
