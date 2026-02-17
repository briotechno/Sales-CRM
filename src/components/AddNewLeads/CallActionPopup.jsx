import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { Phone, PhoneOff, Calendar, Trash2, X, Check, Loader2, AlertCircle, Clock, FileText, Zap } from "lucide-react";
import { useCheckCallConflictQuery } from "../../store/api/leadApi";

export default function CallActionPopup({ isOpen, onClose, lead, onHitCall, initialResponse, rules }) {
    const [step, setStep] = useState(1); // 1: Initial call action, 2: Response form
    const [response, setResponse] = useState(""); // connected, not_connected
    const [finalAction, setFinalAction] = useState(""); // follow_up, drop
    const [nextCallAt, setNextCallAt] = useState("");
    const [dropReason, setDropReason] = useState("");
    const [notConnectedReason, setNotConnectedReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [durationHr, setDurationHr] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [loading, setLoading] = useState(false);
    const [createReminder, setCreateReminder] = useState(true);

    const notConnectedStatuses = [
        "Busy",
        "No Answer",
        "Switch Off",
        "Out of Coverage",
        "Invalid Number",
        "Call Not Picked",
        "Call Failed",
        "Wrong Number"
    ];

    const followupShortcuts = [
        { label: "1 Hour", value: 1, unit: "hour" },
        { label: "2 Hours", value: 2, unit: "hour" },
        { label: "Tomorrow", value: 1, unit: "day" },
        { label: "2 Days", value: 2, unit: "day" },
        { label: "Next Week", value: 7, unit: "day" },
    ];

    const { data: conflicts } = useCheckCallConflictQuery(
        { dateTime: nextCallAt, excludeId: lead?.id },
        { skip: !nextCallAt || finalAction !== "follow_up" || !isOpen }
    );

    const formatDateTime = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleShortcut = (val, unit) => {
        const now = new Date();
        if (unit === "hour") now.setHours(now.getHours() + val);
        else if (unit === "day") now.setDate(now.getDate() + val);
        setNextCallAt(formatDateTime(now));
    };

    useEffect(() => {
        if (initialResponse) {
            setResponse(initialResponse);
            setStep(2);
            setFinalAction("follow_up");
            if (rules?.call_time_gap_minutes) {
                const nextDate = new Date(Date.now() + rules.call_time_gap_minutes * 60000);
                setNextCallAt(formatDateTime(nextDate));
            } else {
                const nextDate = new Date(Date.now() + 60 * 60000);
                setNextCallAt(formatDateTime(nextDate));
            }
        } else {
            setStep(1);
            setResponse("");
            setFinalAction("");
            setNextCallAt("");
            setNotConnectedReason("");
            setRemarks("");
        }
    }, [initialResponse, isOpen, rules]);

    const handleInitialAction = (type) => {
        setResponse(type);
        setStep(2);
        setFinalAction("follow_up");
        setPriority(lead?.priority || "Medium");

        if (rules?.call_time_gap_minutes) {
            const nextDate = new Date(Date.now() + rules.call_time_gap_minutes * 60000);
            setNextCallAt(formatDateTime(nextDate));
        } else {
            const nextDate = new Date(Date.now() + 60 * 60000); // 1 hour default
            setNextCallAt(formatDateTime(nextDate));
        }
    };

    const submitCall = async (data) => {
        setLoading(true);
        try {
            await onHitCall({
                id: lead.id,
                response,
                create_reminder: createReminder,
                not_connected_reason: response === "not_connected" ? notConnectedReason : null,
                remarks: remarks,
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
        if (response === "not_connected" && !notConnectedReason) {
            return alert("Please select why the call was not connected");
        }

        if (response === "connected") {
            if (!remarks) return alert("Please provide a call summary");
            if (!nextCallAt) return alert("Please select next follow-up date/time");
            if (!priority) return alert("Please select a priority");
        }

        if (finalAction === "follow_up") {
            if (!nextCallAt) return alert("Please select next call date/time");
            if (new Date(nextCallAt) < new Date()) return alert("Next call cannot be in the past");
            submitCall({
                status: response || "follow_up",
                next_call_at: nextCallAt,
                priority,
                duration: `${durationHr} Hr ${durationMin} Min`,
                tag: response === "connected" ? "Follow Up" : "Not Connected"
            });
        } else if (finalAction === "drop") {
            if (!dropReason) return alert("Please provide a reason for dropping");
            submitCall({ status: "dropped", drop_reason: dropReason });
        }
    };

    const footer = (
        <div className="flex gap-3 w-full">
            {step === 1 ? (
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all font-primary text-sm flex items-center justify-center gap-2"
                >
                    <X size={18} /> Close Window
                </button>
            ) : (
                <>
                    <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all font-primary text-sm"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className="flex-[2] py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold shadow-md hover:shadow-orange-200 transition-all font-primary text-sm flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        Submit Response
                    </button>
                </>
            )}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Call: ${lead?.name}`}
            icon={<Phone size={20} className="text-white" />}
            footer={footer}
            maxWidth="max-w-md"
        >
            <div className="py-2 font-primary">
                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Current Session</span>
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Call Attempt #{(lead?.call_count || 0) + 1}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-sm">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Active Call</span>
                            </div>
                        </div>
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
                    <div className="space-y-6">
                        {response === "not_connected" && (
                            <div className="space-y-2.5">
                                <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                    <AlertCircle size={15} className="text-[#FF7B1D]" />
                                    Why not connected? <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={notConnectedReason}
                                    onChange={(e) => setNotConnectedReason(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-semibold bg-white shadow-sm"
                                >
                                    <option value="">Select Call Status</option>
                                    {notConnectedStatuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {response === "connected" && (
                            <>
                                <div className="space-y-2.5">
                                    <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                        <FileText size={15} className="text-[#FF7B1D]" />
                                        Call Summary <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Enter detailed call summary here..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-medium bg-white placeholder-gray-400 shadow-sm hover:border-gray-300 resize-none min-h-[100px]"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                            <Zap size={15} className="text-[#FF7B1D]" />
                                            Priority <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-semibold bg-white shadow-sm"
                                        >
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                            <Clock size={15} className="text-[#FF7B1D]" />
                                            Call Duration
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-sm bg-white focus-within:border-[#FF7B1D] focus-within:ring-1 focus-within:ring-[#FF7B1D] transition-all shadow-sm">
                                                <input
                                                    type="number"
                                                    value={durationHr}
                                                    onChange={(e) => setDurationHr(parseInt(e.target.value) || 0)}
                                                    min="0"
                                                    className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="0"
                                                />
                                                <span className="text-[11px] font-bold text-gray-400 capitalize whitespace-nowrap">Hr</span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-sm bg-white focus-within:border-[#FF7B1D] focus-within:ring-1 focus-within:ring-[#FF7B1D] transition-all shadow-sm">
                                                <input
                                                    type="number"
                                                    value={durationMin}
                                                    onChange={(e) => setDurationMin(parseInt(e.target.value) || 0)}
                                                    min="0"
                                                    max="59"
                                                    className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="0"
                                                />
                                                <span className="text-[11px] font-bold text-gray-400 capitalize whitespace-nowrap">Min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {response !== "connected" && response !== "" && (
                            <div className="space-y-2.5">
                                <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                    <FileText size={15} className="text-[#FF7B1D]" />
                                    Remarks (Optional)
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add any quick remarks here..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-medium bg-white placeholder-gray-400 shadow-sm hover:border-gray-300 resize-none"
                                    rows="2"
                                />
                            </div>
                        )}

                        {finalAction === "follow_up" && (
                            <div className="space-y-4 animate-fadeIn border-t border-gray-100 pt-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                        <Calendar size={15} className="text-[#FF7B1D]" />
                                        {response === "connected" ? "Follow-up Date & Time" : "Set Follow-up Time"} <span className="text-red-500">*</span>
                                    </label>

                                    <div className="flex flex-wrap gap-2">
                                        {followupShortcuts.map((sc) => (
                                            <button
                                                key={sc.label}
                                                type="button"
                                                onClick={() => handleShortcut(sc.value, sc.unit)}
                                                className="px-4 py-2 bg-orange-50/50 text-orange-600 text-[11px] font-bold rounded-sm border border-orange-100 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm active:scale-95"
                                            >
                                                +{sc.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative mt-3">
                                        <input
                                            type="datetime-local"
                                            value={nextCallAt}
                                            min={formatDateTime(new Date())}
                                            onChange={(e) => setNextCallAt(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-semibold bg-white placeholder-gray-400 shadow-sm hover:border-gray-300 pr-10"
                                        />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>

                                    {conflicts && conflicts.length > 0 && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 animate-fadeIn mt-2 shadow-sm">
                                            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest leading-none">Schedule Conflict</p>
                                                <p className="text-[11px] text-red-600 font-bold mt-1.5 leading-relaxed">
                                                    Already scheduled: <span className="underline italic">{conflicts[0].name}</span> at {new Date(conflicts[0].next_call_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-sm border border-gray-100 transition-all hover:bg-orange-50/50 group mt-4">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="createReminder"
                                            checked={createReminder}
                                            onChange={() => setCreateReminder(!createReminder)}
                                            className="w-5 h-5 border-2 border-gray-300 rounded-sm text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
                                        />
                                    </div>
                                    <label htmlFor="createReminder" className="flex items-center gap-2 text-[13px] font-bold text-gray-600 cursor-pointer select-none group-hover:text-orange-700 transition-colors capitalize tracking-wide">
                                        <Clock size={16} className="text-orange-400 group-hover:text-[#FF7B1D]" />
                                        Create parallel task reminder
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Drop lead logic hidden as tabs were removed and follow-up is now exclusive */}

                        {!finalAction && (
                            <p className="text-xs text-gray-400 text-center italic py-4">Please select an outcome for the call.</p>
                        )}
                    </div>
                )}
            </div>
        </Modal >
    );
}
