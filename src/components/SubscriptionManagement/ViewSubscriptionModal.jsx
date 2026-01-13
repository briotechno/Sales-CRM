import React from "react";
import {
    CreditCard,
    Users,
    Handshake,
    Calendar,
    CheckCircle,
    XCircle,
} from "lucide-react";
import Modal from "../common/Modal";

const ViewSubscriptionModal = ({ isOpen, onClose, subscription }) => {
    if (!subscription) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
        >
            Close
        </button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={subscription.name}
            subtitle={subscription.id}
            icon={<CreditCard size={26} />}
            footer={footer}
        >
            <div className="space-y-8">

                {/* STATS */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border text-center">
                        <div className="bg-blue-600 p-2 rounded-xl text-white inline-block mb-2">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold">{subscription.users}</div>
                        <div className="text-xs font-semibold text-blue-600">USERS</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border text-center">
                        <div className="bg-orange-500 p-2 rounded-xl text-white inline-block mb-2">
                            <Handshake size={20} />
                        </div>
                        <div className="text-2xl font-bold">{subscription.plan}</div>
                        <div className="text-xs font-semibold text-orange-600">PLAN</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl border text-center">
                        <div className="bg-green-600 p-2 rounded-xl text-white inline-block mb-2">
                            {subscription.status === "Active" ? (
                                <CheckCircle size={20} />
                            ) : (
                                <XCircle size={20} />
                            )}
                        </div>
                        <div className="text-xl font-bold">{subscription.status}</div>
                        <div className="text-xs font-semibold text-green-600">STATUS</div>
                    </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-4">
                    <DetailRow label="Onboarding Date" value={subscription.onboardingDate} />
                </div>
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
        <div>
            <div className="text-xs uppercase text-gray-400 font-bold">{label}</div>
            <div className="font-semibold text-gray-800">{value}</div>
        </div>
    </div>
);

export default ViewSubscriptionModal;
