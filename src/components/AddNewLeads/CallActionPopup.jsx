import React, { useState } from "react";
import Modal from "../common/Modal";
import { Phone, PhoneOff, Calendar, Trash2, X, Check, Loader2 } from "lucide-react";

export default function CallActionPopup({ isOpen, onClose, lead, onHitCall }) {
    const [step, setStep] = useState(1); // 1: Initial call action, 2: Response form
    const [response, setResponse] = useState(""); // connected, not_connected
    const [finalAction, setFinalAction] = useState(""); // follow_up, drop
    const [nextCallAt, setNextCallAt] = useState("");
    const [dropReason, setDropReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInitialAction = (type) => {
        setResponse(type);
        if (type === "not_connected") {
            // Auto handle not connected or show reschedule?
            // Requirement says: Mark as Not Connected, Reschedule for retry.
            submitCall({ status: "not_connected" });
        } else {
            setStep(2);
        }
    };

    const submitCall = async (data) => {
        setLoading(true);
        try {
            await onHitCall({
                id: lead.id,
                ...data
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = () => {
        if (finalAction === "follow_up") {
            if (!nextCallAt) return alert("Please select next call date/time");
            submitCall({ status: "follow_up", next_call_at: nextCallAt });
        } else if (finalAction === "drop") {
            if (!dropReason) return alert("Please provide a reason for dropping");
            submitCall({ status: "dropped", drop_reason: dropReason });
        }
    };

    const footer = step === 2 ? (
        <div className="flex gap-3 w-full">
            <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 border border-gray-200 rounded-sm font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-[10px] tracking-widest"
            >
                Back
            </button>
            <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-md hover:shadow-orange-200 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Submit Response
            </button>
        </div>
    ) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Call: ${lead?.name}`}
            icon={<Phone size={20} className="text-orange-600" />}
            footer={footer}
            maxWidth="max-w-md"
        >
            <div className="py-2">
                {step === 1 ? (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-500 text-center">How was the call with <span className="font-bold text-gray-800">{lead?.name}</span>?</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleInitialAction("connected")}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-sm hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Phone size={24} className="text-green-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Connected</span>
                            </button>

                            <button
                                onClick={() => handleInitialAction("not_connected")}
                                disabled={loading}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-sm hover:border-red-500 hover:bg-red-50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <PhoneOff size={24} className="text-red-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest text-center">Not Connected</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="flex gap-4 p-1 bg-gray-100 rounded-sm">
                            <button
                                onClick={() => setFinalAction("follow_up")}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${finalAction === "follow_up" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"}`}
                            >
                                Follow Up
                            </button>
                            <button
                                onClick={() => setFinalAction("drop")}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${finalAction === "drop" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
                            >
                                Drop Lead
                            </button>
                        </div>

                        {finalAction === "follow_up" && (
                            <div className="space-y-2 animate-fadeIn">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Next Call Date & Time</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={nextCallAt}
                                        onChange={(e) => setNextCallAt(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium bg-gray-50"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        )}

                        {finalAction === "drop" && (
                            <div className="space-y-2 animate-fadeIn">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Reason for Drop <span className="text-red-500">*</span></label>
                                <textarea
                                    value={dropReason}
                                    onChange={(e) => setDropReason(e.target.value)}
                                    placeholder="Enter detailed reason for dropping this lead..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium bg-gray-50 resize-none"
                                    rows="4"
                                />
                            </div>
                        )}

                        {!finalAction && (
                            <p className="text-xs text-gray-400 text-center italic py-4">Please select an outcome for the connected call.</p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
