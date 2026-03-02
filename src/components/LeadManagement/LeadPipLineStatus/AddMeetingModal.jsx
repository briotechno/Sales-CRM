import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X, Calendar, Clock, FileText, Users, CheckCircle, Video, Monitor, MapPin, MessageSquare, Plus, Search, Layers, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddMeetingModal({ open, onClose, onSave, editData, employees = [] }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [attendees, setAttendees] = useState([]);
    const [meetingType, setMeetingType] = useState("Online");
    const [sendWhatsapp, setSendWhatsapp] = useState(false);
    const [meetingLink, setMeetingLink] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState("");

    // Employee search state
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editData && open) {
            setTitle(editData.title || "");
            const rawDate = editData.date || editData.meeting_date || "";
            setDate(rawDate ? (typeof rawDate === "string" ? rawDate.split('T')[0] : rawDate) : "");
            setTime(editData.time || editData.meeting_time || "");
            setDescription(editData.description || "");
            setMeetingType(editData.meeting_type || "Online");
            setSendWhatsapp(!!editData.send_whatsapp_reminder);
            setMeetingLink(editData.meeting_link || "");
            setAddressLine1(editData.address_line1 || "");
            setAddressLine2(editData.address_line2 || "");
            setCity(editData.city || "");
            setState(editData.state || "");
            setPincode(editData.pincode || "");

            let attendeesArray = [];
            if (editData.attendees) {
                if (Array.isArray(editData.attendees)) {
                    attendeesArray = editData.attendees;
                } else if (typeof editData.attendees === "string") {
                    try {
                        const parsed = JSON.parse(editData.attendees);
                        attendeesArray = Array.isArray(parsed) ? parsed : editData.attendees.split(",").map(s => s.trim()).filter(Boolean);
                    } catch (e) {
                        attendeesArray = editData.attendees.split(",").map(s => s.trim()).filter(Boolean);
                    }
                }
            }
            setAttendees(attendeesArray);
        } else if (open) {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

            setTitle("");
            setDate(currentDate);
            setTime(currentTime);
            setDescription("");
            setAttendees([]);
            setMeetingType("Online");
            setSendWhatsapp(false);
            setMeetingLink("");
            setAddressLine1("");
            setAddressLine2("");
            setCity("");
            setState("");
            setPincode("");
        }
    }, [editData, open]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
        };
    }, []);

    if (!open) return null;

    const filteredEmployees = employees.filter(emp =>
        (emp.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !attendees.includes(emp.email)
    );

    const handleSelectEmail = (email) => {
        if (email && !attendees.includes(email)) {
            setAttendees(prev => [...prev, email]);
        }
        setSearchTerm("");
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleRemoveAttendee = (emailToRemove) => {
        setAttendees(prev => prev.filter(email => email !== emailToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            const email = searchTerm.trim();
            // Basic email validation check
            if (email.includes('@')) {
                handleSelectEmail(email);
            }
        } else if (e.key === 'Backspace' && !searchTerm && attendees.length > 0) {
            handleRemoveAttendee(attendees[attendees.length - 1]);
        }
    };

    const handlePincodeLookup = async (code) => {
        if (code.length !== 6) return;
        setLoadingPincode(true);
        setPincodeError("");
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
            const data = await response.json();
            if (data[0].Status === "Success") {
                const postOffice = data[0].PostOffice[0];
                setState(postOffice.State);
                setCity(postOffice.District);
                setPincodeError("");
            } else {
                setPincodeError("Invalid Pincode");
                toast.error("Invalid Pincode");
            }
        } catch (error) {
            console.error("Pincode lookup failed:", error);
            setPincodeError("Lookup failed");
        } finally {
            setLoadingPincode(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) return toast.error("Please enter meeting title");
        if (!date) return toast.error("Please select a date");
        if (!time) return toast.error("Please select a time");
        if (attendees.length === 0) return toast.error("Please add at least one attendee");
        if (!description.trim()) return toast.error("Please enter description/agenda");

        if (meetingType === "Online") {
            if (!meetingLink.trim()) return toast.error("Please enter meeting link");
        } else {
            if (!addressLine1.trim()) return toast.error("Please enter address line 1");
            if (!addressLine2.trim()) return toast.error("Please enter address line 2");
            if (!pincode.trim() || pincode.length !== 6) return toast.error("Please enter a valid 6-digit pincode");
            if (!city.trim()) return toast.error("Please enter city");
            if (!state.trim()) return toast.error("Please enter state");
        }

        onSave({
            title,
            date,
            time,
            description,
            meeting_type: meetingType,
            meeting_link: meetingLink,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city,
            state,
            pincode,
            send_whatsapp_reminder: sendWhatsapp,
            attendees: attendees
        });
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl overflow-hidden font-primary animate-slideUp">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-50 rounded-t-sm shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 p-2.5 rounded-sm">
                            <Video size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white capitalize tracking-wide leading-tight">
                                {editData ? "Edit Meeting" : "Schedule Meeting"}
                            </h2>
                            <p className="text-xs text-orange-50 font-medium opacity-90">
                                {editData ? "Update meeting details and attendees" : "Set up a new meeting with the lead"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh] no-scrollbar">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-1.5 capitalize">
                            <FileText size={14} className="text-orange-500" />
                            Meeting Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm text-slate-800 bg-white hover:border-gray-300 font-semibold placeholder:text-[11px]"
                            placeholder="e.g., Project Discovery Call"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-1.5 capitalize">
                                <Calendar size={14} className="text-orange-500" />
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm text-slate-800 bg-white font-semibold hover:border-gray-300"
                            />
                        </div>
                        {/* Time */}
                        <div>
                            <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-1.5 capitalize">
                                <Clock size={14} className="text-orange-500" />
                                Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm text-slate-800 bg-white font-semibold hover:border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div className="relative" ref={suggestionRef}>
                        <label className="flex items-center justify-between gap-2 text-[14px] font-semibold text-slate-700 mb-1.5 capitalize">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-orange-500" />
                                Attendees <span className="text-red-500">*</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">Add by email or select from list</span>
                        </label>

                        <div className={`w-full p-2 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition-all min-h-[46px] flex flex-wrap gap-2 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 cursor-text`}
                            onClick={() => inputRef.current?.focus()}>
                            {attendees.map((email) => (
                                <div key={email} className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-sm animate-fadeIn">
                                    <span className="text-xs font-semibold text-orange-700">{email}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAttendee(email);
                                        }}
                                        className="text-orange-400 hover:text-orange-600 transition-colors"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setShowSuggestions(true)}
                                onClick={() => setShowSuggestions(true)}
                                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-800 font-semibold placeholder:text-[11px] placeholder-slate-400"
                                placeholder={attendees.length === 0 ? "Type email and press Enter..." : ""}
                            />
                        </div>

                        {/* Suggestions List */}
                        {showSuggestions && filteredEmployees.length > 0 && (
                            <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-sm z-[100] max-h-48 overflow-y-auto overflow-x-hidden animate-fadeIn">
                                {filteredEmployees.map(emp => (
                                    <button
                                        key={emp.id}
                                        type="button"
                                        onClick={() => handleSelectEmail(emp.email)}
                                        className="w-full px-4 py-2.5 hover:bg-orange-50 text-left border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-slate-800 group-hover:text-orange-700 capitalize">{emp.employee_name}</span>
                                            <span className="text-[10px] text-slate-500">{emp.email}</span>
                                        </div>
                                        <Plus size={14} className="text-slate-300 group-hover:text-orange-500" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Meeting Type */}
                    <div>
                        <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-1.5 capitalize">
                            <Layers size={14} className="text-orange-500" />
                            Meeting Type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setMeetingType("Online")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm border text-xs font-semibold capitalize transition-all ${meetingType === "Online"
                                    ? "bg-orange-50 text-orange-600 border-orange-500 shadow-sm"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}
                            >
                                <Monitor size={14} /> Online
                            </button>
                            <button
                                type="button"
                                onClick={() => setMeetingType("Offline")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm border text-xs font-semibold capitalize transition-all ${meetingType === "Offline"
                                    ? "bg-orange-50 text-orange-600 border-orange-500 shadow-sm"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}
                            >
                                <MapPin size={14} /> Offline
                            </button>
                        </div>

                        {/* Conditional Location Fields */}
                        {meetingType === "Online" ? (
                            <div className="animate-fadeIn">
                                <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize">Meeting Link <span className="text-red-500">*</span></label>
                                <input
                                    type="url"
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                    placeholder="https://zoom.us/j/..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold placeholder:text-[11px]"
                                />
                            </div>
                        ) : (
                            <div className="space-y-3 animate-fadeIn">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize">Address Line 1 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={addressLine1}
                                        onChange={(e) => setAddressLine1(e.target.value)}
                                        placeholder="Building, Street name"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold placeholder:text-[11px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize">Address Line 2 <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={addressLine2}
                                            onChange={(e) => setAddressLine2(e.target.value)}
                                            placeholder="Area, Landmark"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold placeholder:text-[11px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize">Pincode <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setPincode(val);
                                                    setPincodeError("");
                                                    if (val.length === 6) handlePincodeLookup(val);
                                                }}
                                                placeholder="6 Digit PIN"
                                                className={`w-full px-4 py-2 border rounded-sm focus:ring-1 outline-none text-sm font-semibold placeholder:text-[11px] transition-all ${pincodeError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'}`}
                                            />
                                            {loadingPincode && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 size={16} className="text-orange-500 animate-spin" />
                                                </div>
                                            )}
                                            {pincodeError && (
                                                <p className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-bold animate-fadeIn">{pincodeError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize">City <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5 capitalize">State <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700 mb-1.5 capitalize">
                            <FileText size={14} className="text-orange-500" />
                            Description / Agenda <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none text-sm text-slate-800 bg-white placeholder-slate-400 font-semibold hover:border-gray-300 placeholder:text-[11px]"
                            placeholder="What is this meeting about?"
                        />
                    </div>

                    {/* Reminders Toggle - AFTER Description */}
                    <div className="pt-1">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all select-none group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={sendWhatsapp}
                                    onChange={(e) => setSendWhatsapp(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${sendWhatsapp ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${sendWhatsapp ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare size={14} className={sendWhatsapp ? 'text-orange-500' : 'text-slate-400'} />
                                <span className="text-[11px] font-semibold text-slate-700 capitalize">Send Reminder in Whatsapp</span>
                            </div>
                        </label>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-sm hover:bg-slate-50 transition-all text-xs capitalize shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-sm hover:shadow-lg hover:brightness-110 transition-all active:scale-95 text-xs capitalize flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />
                            {editData ? "Update Meeting" : "Schedule Now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
