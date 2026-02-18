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

    const isStrictPlan = !plan.upgradable_users && !plan.upgradable_storage && !plan.upgradable_leads;

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
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm relative overflow-hidden group">
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Info size={14} /> Plan Overview
                    </div>
                    <p className="text-gray-700 leading-relaxed font-semibold italic relative z-10 text-sm">
                        {plan.description || "No description provided for this plan."}
                    </p>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/30 rounded-full -mr-12 -mt-12 transition-all duration-700 group-hover:scale-150" />
                </div>

                {/* RESOURCE LIMITS & UPGRADES */}
                <div className="space-y-4">
                    <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest pl-1">Resource Limits & Upgrades</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DetailRow
                            label="Default Users"
                            value={plan.default_users}
                            subValue={plan.upgradable_users ? "Upgrade Allowed" : "Fixed Limit"}
                            isAllowed={plan.upgradable_users}
                            icon={<Users size={20} className="text-blue-500" />}
                        />
                        <DetailRow
                            label="Monthly Leads"
                            value={plan.monthly_leads.toLocaleString()}
                            subValue={plan.upgradable_leads ? "Upgrade Allowed" : "Fixed Limit"}
                            isAllowed={plan.upgradable_leads}
                            icon={<Zap size={20} className="text-[#00C853]" />}
                        />
                        <DetailRow
                            label="Storage Limit"
                            value={plan.default_storage + " GB"}
                            subValue={plan.upgradable_storage ? "Upgrade Allowed" : "Fixed Limit"}
                            isAllowed={plan.upgradable_storage}
                            icon={<HardDrive size={20} className="text-purple-500" />}
                        />
                    </div>

                    {isStrictPlan && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                            <Info size={18} className="text-orange-600 mt-0.5" />
                            <p className="text-xs font-bold text-orange-700 italic">
                                Note: “This plan does not support upgrades. To increase users, storage, or leads, please upgrade to a higher plan.”
                            </p>
                        </div>
                    )}
                </div>

                {/* PRICING & DISCOUNTS */}
                <div className="space-y-4">
                    <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest pl-1">Pricing Configuration</div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter block mb-1">Base Monthly Price</span>
                                <span className="text-3xl font-black text-orange-600">₹{(parseFloat(plan.price) || 0).toLocaleString()}</span>
                            </div>

                            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                                <DiscountBox label="1 Month" discount="0%" subText="Default" />
                                <DiscountBox label="3 Months" discount={(plan.discount_3_months || 0) + "%"} highlight />
                                <DiscountBox label="6 Months" discount={(plan.discount_6_months || 0) + "%"} highlight />
                                <DiscountBox label="12 Months" discount={(plan.discount_12_months || 0) + "%"} highlight />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                {plan.key_features && (
                    <div className="space-y-3">
                        <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest pl-1">Key Features Included</div>
                        <div className="flex flex-wrap gap-2">
                            {(typeof plan.key_features === 'string' ? plan.key_features.split(',') : plan.key_features).map((feature, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-bold border border-gray-200 flex items-center gap-2 hover:border-orange-200 hover:text-orange-600 transition-colors cursor-default shadow-sm"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
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

const DetailRow = ({ label, value, subValue, isAllowed, icon }) => (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
                {icon}
            </div>
            <div>
                <div className="text-[9px] uppercase text-gray-400 font-bold tracking-widest mb-0.5">{label}</div>
                <div className="text-sm font-black text-gray-900">{value}</div>
            </div>
        </div>
        <div className={`text-[10px] font-black uppercase text-center py-1 rounded-md ${isAllowed ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {subValue}
        </div>
    </div>
);

const DiscountBox = ({ label, discount, highlight, subText }) => (
    <div className={`p-3 rounded-lg border text-center transition-all ${highlight ? 'bg-white border-orange-100 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-60'}`}>
        <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">{label}</span>
        <span className={`text-sm font-black block ${highlight ? 'text-orange-600' : 'text-gray-600'}`}>{discount}</span>
        {subText && <span className="text-[8px] font-bold text-gray-400 italic block mt-1">{subText}</span>}
    </div>
);

export default ViewPlanModal;
