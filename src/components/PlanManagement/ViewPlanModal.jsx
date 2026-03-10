import React from "react";
import { Package, Users, Zap, HardDrive, DollarSign, Info, List, CheckCircle, XCircle } from "lucide-react";
import Modal from "../common/Modal";

const ViewPlanModal = ({ isOpen, onClose, plan }) => {
    if (!plan) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-sm hover:bg-gray-100 transition shadow-sm font-bold text-sm font-primary"
        >
            Close
        </button>
    );

    const isStrictPlan = !plan.upgradable_users && !plan.upgradable_storage && !plan.upgradable_leads;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={plan.name}
            subtitle={"Plan ID: PLAN-" + plan.id}
            icon={<Package size={24} className="text-[#FF7B1D]" />}
            footer={footer}
        >
            <div className="space-y-6 p-1">
                {/* Stats Grid - High Level */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 text-center shadow-sm">
                        <div className="bg-blue-600 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{plan.default_users || "0"}</div>
                        <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Default Users</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 text-center shadow-sm">
                        <div className="bg-orange-500 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <DollarSign size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">₹{(parseFloat(plan.price) || 0).toLocaleString()}</div>
                        <div className="text-[10px] font-bold tracking-widest text-orange-600 uppercase">Base Price</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 text-center shadow-sm font-primary">
                        <div className="bg-green-600 p-2 rounded-sm text-white inline-block mb-2 shadow-sm">
                            <Zap size={20} />
                        </div>
                        <div className="text-xl font-bold text-gray-900">{plan.monthly_leads.toLocaleString()}</div>
                        <div className="text-[10px] font-bold tracking-widest text-green-600 uppercase">Monthly Leads</div>
                    </div>
                </div>

                {/* DescriptionSection */}
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-orange-100 pb-2">
                        <Info size={14} /> Plan Description
                    </div>
                    <p className="text-gray-700 leading-relaxed font-semibold relative z-10 text-sm italic">
                        {plan.description || "No description provided for this plan."}
                    </p>
                </div>

                {/* PLATFORM LIMITS & UPGRADES */}
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <h4 className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-orange-100 pb-2">
                        Resource Allocation & Upgrades
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-sm shadow-sm border border-gray-100">
                                <HardDrive size={18} className="text-purple-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider leading-none mb-1">Storage Limit</div>
                                <div className="text-sm font-bold text-gray-700">{plan.default_storage} GB</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-sm shadow-sm border border-gray-100">
                                {plan.upgradable_storage ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-300" />}
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider leading-none mb-1">Upgradable Storage</div>
                                <div className="text-sm font-bold text-gray-700">{plan.upgradable_storage ? "Allowed" : "Fixed"}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-sm shadow-sm border border-gray-100">
                                {plan.upgradable_users ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-300" />}
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider leading-none mb-1">Upgradable Users</div>
                                <div className="text-sm font-bold text-gray-700">{plan.upgradable_users ? "Allowed" : "Fixed"}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-sm shadow-sm border border-gray-100">
                                {plan.upgradable_leads ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-300" />}
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider leading-none mb-1">Upgradable Leads</div>
                                <div className="text-sm font-bold text-gray-700">{plan.upgradable_leads ? "Allowed" : "Fixed"}</div>
                            </div>
                        </div>
                    </div>
                    {isStrictPlan && (
                        <div className="mt-5 p-3 bg-orange-50 border border-orange-100 rounded-sm">
                            <p className="text-[10px] font-bold text-orange-700 italic flex items-center gap-2">
                                <Info size={12} /> Strictly Fixed Content: No upgrades supported on this tier.
                            </p>
                        </div>
                    )}
                </div>

                {/* DISCOUNTS */}
                <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                    <h4 className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-orange-100 pb-2">
                        Duration Based Discounts
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <DiscountItem label="3 Months" value={(plan.discount_3_months || 0) + "%"} />
                        <DiscountItem label="6 Months" value={(plan.discount_6_months || 0) + "%"} />
                        <DiscountItem label="12 Months" value={(plan.discount_12_months || 0) + "%"} />
                        <div className="p-2.5 bg-gray-50 rounded-sm border border-gray-100 text-center opacity-50">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">1 Month</div>
                            <div className="text-sm font-bold text-gray-500">0%</div>
                        </div>
                    </div>
                </div>

                {/* KEY FEATURES */}
                {plan.key_features && (
                    <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                        <h4 className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-orange-100 pb-2">
                            <List size={14} /> Key Features Included
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(typeof plan.key_features === 'string' ? plan.key_features.split(',') : plan.key_features).map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700 font-semibold group transition-all duration-300 hover:translate-x-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
                                    {feature.trim()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const DiscountItem = ({ label, value }) => (
    <div className="p-2.5 bg-orange-50 rounded-sm border border-orange-100 text-center shadow-sm">
        <div className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter mb-0.5">{label}</div>
        <div className="text-sm font-bold text-gray-900">{value}</div>
    </div>
);

export default ViewPlanModal;
