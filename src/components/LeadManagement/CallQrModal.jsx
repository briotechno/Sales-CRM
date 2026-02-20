import React from "react";
import Modal from "../common/Modal";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Phone, User, FileText } from "lucide-react";

export default function CallQrModal({ isOpen, onClose, lead, onProceedToLog, onViewProfile }) {
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
                <div className="mb-6 bg-white border-2 border-orange-100 rounded-2xl shadow-sm overflow-hidden w-fit mx-auto">
                    <div className="bg-orange-50/60 border-b border-orange-100 py-2.5 px-6 flex items-center justify-center gap-3">
                        <span className="text-[12px] font-bold text-gray-400 capitalize tracking-widest">Call Hits :</span>
                        <span className="text-xl font-black text-[#FF7B1D] tracking-tight leading-none">{lead.call_count || 0}</span>
                    </div>
                    <div className="p-6">
                        {phoneNumber ? (
                            <QRCodeSVG
                                value={dialerUrl}
                                size={200}
                                level="H"
                                includeMargin={false}
                                fgColor="#1a1a1a"
                            />
                        ) : (
                            <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-xs font-bold uppercase italic">No Phone Number Found</p>
                            </div>
                        )}
                    </div>
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

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                if (onProceedToLog) onProceedToLog();
                            }}
                            className="w-full py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 active:scale-[0.98] capitalize font-primary"
                        >
                            <Phone size={18} />
                            Call With IVR
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    if (onViewProfile) onViewProfile();
                                    onClose();
                                }}
                                className="py-3 rounded-sm font-semibold transition shadow-md hover:shadow-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 active:scale-[0.98] capitalize font-primary text-sm"
                            >
                                <User size={16} className="text-[#FF7B1D]" />
                                View Profile
                            </button>

                            <button
                                onClick={() => {
                                    if (onProceedToLog) onProceedToLog();
                                }}
                                className="py-3 rounded-sm font-semibold transition shadow-md hover:shadow-lg bg-orange-50 border border-orange-100 text-[#FF7B1D] hover:bg-orange-100 flex items-center justify-center gap-2 active:scale-[0.98] capitalize font-primary text-sm"
                            >
                                <FileText size={16} />
                                Add Call Logs
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold capitalize tracking-tight mt-2">
                        Click Above Options To Proceed With Lead Management
                    </p>
                </div>
            </div>
        </Modal>
    );
}
