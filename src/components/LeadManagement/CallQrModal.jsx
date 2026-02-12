import React from "react";
import Modal from "../common/Modal";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";

export default function CallQrModal({ isOpen, onClose, lead }) {
    if (!lead) return null;

    const phoneNumber = lead.mobile_number || lead.phone;
    const dialerUrl = `tel:${phoneNumber}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Scan to Call"
            icon={<Smartphone size={20} className="text-[#FF7B1D]" />}
            maxWidth="max-w-md"
        >
            <div className="py-6 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-white border-2 border-orange-100 rounded-2xl shadow-inner">
                    {phoneNumber ? (
                        <QRCodeSVG
                            value={dialerUrl}
                            size={200}
                            level="H"
                            includeMargin={true}
                            fgColor="#1a1a1a"
                        />
                    ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-xs font-bold uppercase italic">No Phone Number Found</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4 w-full">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 font-primary">
                            {lead.name || lead.full_name || "Lead Contact"}
                        </h3>
                        <p className="text-[#FF7B1D] font-bold text-sm tracking-widest mt-1">
                            {phoneNumber || "N/A"}
                        </p>
                    </div>

                </div>
            </div>
        </Modal>
    );
}
