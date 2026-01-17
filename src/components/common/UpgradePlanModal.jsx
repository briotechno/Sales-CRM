import React from "react";
import { Crown, ArrowUpCircle, X, BadgeCheck, ShieldCheck } from "lucide-react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const UpgradePlanModal = ({ isOpen, onClose, data }) => {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        navigate("/packages");
    };

    const limitTypeMap = {
        leads: {
            title: "Leads Limit Reached",
            icon: <Crown className="w-12 h-12 text-white" />,
            description: "You've reached your monthly leads generation limit."
        },
        users: {
            title: "Team Limit Reached",
            icon: <ArrowUpCircle className="w-12 h-12 text-white" />,
            description: "You've reached the maximum number of team members for your plan."
        },
        storage: {
            title: "Storage Full",
            icon: <ShieldCheck className="w-12 h-12 text-white" />,
            description: "Your cloud storage is full. Please upgrade to add more files."
        },
        subscription: {
            title: "Subscription Required",
            icon: <Crown className="w-12 h-12 text-white" />,
            description: "An active subscription is required to perform this action."
        }
    };

    const type = data?.type || "leads";
    const info = limitTypeMap[type] || limitTypeMap.leads;

    const footer = (
        <div className="flex w-full gap-3">
            <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-sm border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
            >
                Maybe Later
            </button>
            <button
                onClick={handleUpgrade}
                className="flex-1 px-4 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all shadow-md text-sm"
            >
                Upgrade Now
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerVariant="orange"
            maxWidth="max-w-md"
            zIndex="z-[9999]"
            title={info.title}
            subtitle={data?.message || info.description}
            icon={info.icon}
        >
            <div className="py-2 overflow-x-hidden">
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-sm p-6 mb-6 border border-orange-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown size={40} />
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-2 rounded-sm mt-1 shrink-0">
                            <BadgeCheck className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="font-bold text-orange-950 mb-1 text-lg">Scale Your Business</p>
                            <p className="text-sm text-orange-800 leading-relaxed">
                                Unlock unlimited leads, advanced team management, and 24/7 priority support. Don't let limits slow you down!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plan Highlights:</p>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {['Unlimited Leads', 'Priority Support', 'Team Analytics', 'Custom Branding'].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <BadgeCheck className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="truncate">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {footer}

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                        SelectCRM Enterprise Edition
                    </span>
                </div>
            </div>
        </Modal>
    );
};

export default UpgradePlanModal;
