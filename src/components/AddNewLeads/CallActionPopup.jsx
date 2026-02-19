import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { Phone, PhoneOff, Calendar, Trash2, X, Check, Loader2, AlertCircle, Clock, FileText, Zap } from "lucide-react";
import { useCheckCallConflictQuery } from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function CallActionPopup({ isOpen, onClose, lead, onHitCall, initialResponse, rules }) {
    const [step, setStep] = useState(1); // 1: Initial call action, 2: Response form
    const [response, setResponse] = useState(""); // connected, not_connected
    const [finalAction, setFinalAction] = useState(""); // follow_up, drop
    const [nextCallAt, setNextCallAt] = useState("");
    const [dropReason, setDropReason] = useState("");
    const [notConnectedReason, setNotConnectedReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [durationMin, setDurationMin] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const notConnectedStatuses = [
        "Busy",
        "No Answer",
        "Switched Off",
        "Out of Coverage",
        "Invalid Number",
        "Call Not Picked",
        "Call Failed",

        "Number Not Reachable",
        "Number Does Not Exist",
        "Voicemail Reached",
        "Call Dropped",
        "Poor Network",
        "Network Issue",
        "Call Rejected",
        "Customer Disconnected",
        "Call Blocked",
        "Do Not Disturb (DND) Active",
        "Not Interested",
        "Asked to Call Later",
        "Customer in Meeting",
        "Customer Driving",
        "Outside Working Hours",
        "Language Barrier",
        "Technical Error"
    ];

    const followupShortcuts = [
        { label: "15 Mins", value: 15, unit: "minute" },
        { label: "30 Mins", value: 30, unit: "minute" },
        { label: "1 Hour", value: 1, unit: "hour" },
        { label: "2 Hours", value: 2, unit: "hour" },
        { label: "3 Hours", value: 3, unit: "hour" },
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
        if (unit === "minute") now.setMinutes(now.getMinutes() + val);
        else if (unit === "hour") now.setHours(now.getHours() + val);
        else if (unit === "day") now.setDate(now.getDate() + val);
        setNextCallAt(formatDateTime(now));
    };

    useEffect(() => {
        if (nextCallAt) {
            const [date, time] = nextCallAt.split('T');
            setSelectedDate(date || "");
            setSelectedTime(time || "");
        } else {
            setSelectedDate("");
            setSelectedTime("");
        }
    }, [nextCallAt]);

    const handleDateChange = (date) => {
        const time = selectedTime || "09:00";
        setNextCallAt(`${date}T${time}`);
    };

    const handleTimeChange = (time) => {
        const date = selectedDate || formatDateTime(new Date()).split('T')[0];
        setNextCallAt(`${date}T${time}`);
    };

    useEffect(() => {
        if (initialResponse) {
            setResponse(initialResponse);
            setStep(2);
            setFinalAction("follow_up");
            setNextCallAt(formatDateTime(new Date()));
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
        setNextCallAt(formatDateTime(new Date()));
    };

    const submitCall = async (data) => {
        setLoading(true);
        try {
            await onHitCall({
                id: lead.id,
                response,
                create_reminder: false,
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
            return toast.error("Please select why the call was not connected");
        }

        if (response === "connected") {
            if (!remarks) return toast.error("Please provide a call summary");
            if (!nextCallAt) return toast.error("Please select next follow-up date/time");
            if (!priority) return toast.error("Please select a priority");
        }

        if (finalAction === "follow_up") {
            if (!nextCallAt) return toast.error("Please select next call date/time");
            if (new Date(nextCallAt) < new Date()) return toast.error("Next call cannot be in the past");
            submitCall({
                status: response || "follow_up",
                next_call_at: nextCallAt,
                priority,
                duration: parseInt(durationMin) || 0,
                tag: response === "connected" ? "Follow Up" : "Not Connected"
            });
        } else if (finalAction === "drop") {
            if (!dropReason) return toast.error("Please provide a reason for dropping");
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
                {/* Session Header - Always Visible */}
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm mb-6">
                    {/* Top Row: Session Info & Status Badge */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-extrabold text-gray-400 capitalize tracking-wider leading-tight">Current Session</span>
                            <span className="text-[15px] font-bold text-gray-900 capitalize tracking-tight mt-0.5">Call Attempt #{(lead?.call_count || 0) + 1}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Previous Status Badge - Show only if no current session response selected */}
                            {lead?.call_count > 0 && !response && (
                                <div className={`px-3 py-1 rounded-sm text-[11px] font-bold border capitalize shadow-sm ${lead.tag === 'Not Connected' ? 'bg-red-50 text-red-600 border-red-100' :
                                    lead.tag === 'Follow Up' ? 'bg-green-50 text-green-600 border-green-100' :
                                        'bg-gray-50 text-gray-500 border-gray-100'
                                    }`}>
                                    Prev: {lead.tag === 'Not Connected' ? 'Not Connected' : lead.tag === 'Follow Up' ? 'Connected' : lead.tag}
                                </div>
                            )}

                            {/* Current Session Progress Status */}
                            {response && (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border shadow-sm ${response === 'connected' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${response === 'connected' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]'}`} />
                                    <span className="text-[10px] font-bold capitalize tracking-tight">
                                        {response === 'connected' ? 'Connected' : 'Not Connected'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row: Reason (If present) */}
                    {lead?.tag === 'Not Connected' && lead?.not_connected_reason && !response && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-200/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-semibold text-red-600 capitalize tracking-tight">Reason Of Not Connect:</span>
                                <span className="text-[12px] font-medium text-gray-700 capitalize tracking-tight">{lead.not_connected_reason}</span>
                            </div>
                        </div>
                    )}
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleInitialAction("connected")}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-sm hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Phone size={24} className="text-green-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-600 capitalize tracking-tight">Connected</span>
                            </button>

                            <button
                                onClick={() => handleInitialAction("not_connected")}
                                disabled={loading}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-sm hover:border-red-500 hover:bg-red-50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <PhoneOff size={24} className="text-red-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-600 capitalize tracking-tight text-center">Not Connected</span>
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
                                            Call Duration (Min)
                                        </label>
                                        <div className="flex items-center gap-2 px-3 py-3 border border-gray-200 rounded-sm bg-white focus-within:border-[#FF7B1D] focus-within:ring-2 focus-within:ring-[#FF7B1D] focus-within:ring-opacity-10 transition-all shadow-sm">
                                            <input
                                                type="number"
                                                value={durationMin}
                                                onChange={(e) => setDurationMin(parseInt(e.target.value) || 0)}
                                                min="0"
                                                className="w-full bg-transparent outline-none text-sm font-semibold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="0"
                                            />
                                            <span className="text-[11px] font-bold text-gray-400 capitalize whitespace-nowrap">Mins</span>
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

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {followupShortcuts.map((sc) => (
                                            <button
                                                key={sc.label}
                                                type="button"
                                                onClick={() => handleShortcut(sc.value, sc.unit)}
                                                className="px-3 py-1.5 bg-orange-50/50 text-orange-600 text-[11px] font-bold rounded-sm border border-orange-100 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm active:scale-95"
                                            >
                                                +{sc.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2.5">
                                            <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                                <Calendar size={15} className="text-[#FF7B1D]" />
                                                Select Date
                                            </label>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                min={formatDateTime(new Date()).split('T')[0]}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-semibold bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="flex items-center gap-2 text-[14px] font-bold text-gray-700 capitalize tracking-wide">
                                                <Clock size={15} className="text-[#FF7B1D]" />
                                                Select Time
                                            </label>
                                            <input
                                                type="time"
                                                value={selectedTime}
                                                onChange={(e) => handleTimeChange(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none transition-all text-sm font-semibold bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    {conflicts && conflicts.length > 0 && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 animate-fadeIn mt-2 shadow-sm">
                                            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-bold text-red-700 capitalize tracking-tight leading-none">Schedule Conflict</p>
                                                <p className="text-[11px] text-red-600 font-bold mt-1.5 leading-relaxed">
                                                    Already scheduled: <span className="underline italic">{conflicts[0].name}</span> at {new Date(conflicts[0].next_call_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
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
