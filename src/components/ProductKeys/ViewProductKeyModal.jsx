import React from "react";
import { KeyRound, Users, Calendar } from "lucide-react";
import Modal from "../common/Modal";

const ViewProductKeyModal = ({ isOpen, onClose, productKey }) => {
    if (!productKey) return null;

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
            title={productKey.enterprise}
            subtitle={productKey.id}
            icon={<KeyRound size={26} />}
            footer={footer}
        >
            <div className="space-y-8">
                {/* STATS */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border text-center">
                        <div className="bg-blue-600 p-2 rounded-xl text-white inline-block mb-2">
                            <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold">{productKey.users}</div>
                        <div className="text-xs font-semibold text-blue-600">USERS</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border text-center">
                        <div className="bg-orange-500 p-2 rounded-xl text-white inline-block mb-2">
                            <KeyRound size={20} />
                        </div>
                        <div className="text-2xl font-bold">{productKey.plan}</div>
                        <div className="text-xs font-semibold text-orange-600">PLAN</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl border text-center">
                        <div className="bg-green-600 p-2 rounded-xl text-white inline-block mb-2">
                            {productKey.status === "Active" ? (
                                <Users size={20} />
                            ) : (
                                <Users size={20} />
                            )}
                        </div>
                        <div className="text-xl font-bold">{productKey.status}</div>
                        <div className="text-xs font-semibold text-green-600">STATUS</div>
                    </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-4">
                    <DetailRow label="Key" value={productKey.key} />
                    <DetailRow label="Generated On" value={productKey.generatedOn} />
                    <DetailRow label="Expires On" value={productKey.expiresOn} />
                </div>
            </div>
        </Modal>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
        <div className="text-gray-500 font-bold text-xs uppercase">{label}</div>
        <div className="font-semibold text-gray-800">{value}</div>
    </div>
);

export default ViewProductKeyModal;
