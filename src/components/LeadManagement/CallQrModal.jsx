import React from "react";
import Modal from "../common/Modal";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Phone } from "lucide-react";

export default function CallQrModal({ isOpen, onClose, lead, onProceedToLog }) {
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

                <div className="space-y-6 w-full px-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 truncate px-4" title={lead.name || lead.full_name}>
                            {lead.name || lead.full_name || "Lead Contact"}
                        </h3>
                        <p className="text-[#FF7B1D] font-bold text-sm tracking-widest mt-1">
                            {phoneNumber || "N/A"}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (phoneNumber) window.location.href = dialerUrl;
                            if (onProceedToLog) onProceedToLog();
                        }}
                        className="w-full py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 active:scale-[0.98] capitalize"
                    >
                        <Phone size={18} />
                        Call Now & Log Result
                    </button>

                    <p className="text-[10px] text-gray-400 font-bold capitalize tracking-tight">
                        Click Above If You Are Calling Via IVR Or Desktop System
                    </p>
                </div>
            </div>
        </Modal>
    );
}
