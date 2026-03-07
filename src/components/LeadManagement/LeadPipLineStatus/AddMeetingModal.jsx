import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, FileText, Users, CheckCircle, Video, Monitor, MapPin, MessageSquare, Plus, Search, Layers, Loader2, ChevronDown, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../../common/Modal";

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

    const filteredEmployees = (employees || []).filter(emp => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            emp.employee_name?.toLowerCase().includes(search) ||
            emp.employee_id?.toLowerCase().includes(search) ||
            emp.email?.toLowerCase().includes(search) ||
            emp.id?.toString().includes(search) ||
            emp.mobile_number?.toString().includes(search)
        );
    });

    const handleToggleAttendee = (email) => {
        if (attendees.includes(email)) {
            setAttendees(prev => prev.filter(e => e !== email));
        } else {
            setAttendees(prev => [...prev, email]);
        }
    };

    const handleSelectEmail = (email) => {
        if (email && !attendees.includes(email)) {
            setAttendees(prev => [...prev, email]);
        }
        setSearchTerm("");
        inputRef.current?.focus();
    };

    const handleRemoveAttendee = (emailToRemove) => {
        setAttendees(prev => prev.filter(email => email !== emailToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            const value = searchTerm.trim();
            handleSelectEmail(value);
        }
        else if (e.key === 'Backspace' && !searchTerm && attendees.length > 0) {
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

    const handleSubmit = () => {
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

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 text-sm"
            >
                <CheckCircle size={18} />
                {editData ? "Update Meeting" : "Schedule Now"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={editData ? "Edit Meeting" : "Schedule Meeting"}
            subtitle={editData ? "Update meeting details and attendees" : "Set up a new meeting with the lead"}
            icon={<Video size={24} />}
            footer={footer}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-5 px-1 pb-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                {/* Title */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="text-[#FF7B1D]" />
                        Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Project Discovery Call"
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Calendar size={16} className="text-[#FF7B1D]" />
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        />
                    </div>
                    {/* Time */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Clock size={16} className="text-[#FF7B1D]" />
                            Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        />
                    </div>
                </div>

                {/* Attendees */}
                <div className="relative group" ref={suggestionRef}>
                    <label className="flex items-center justify-between gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-[#FF7B1D]" />
                            Attendees <span className="text-red-500">*</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Search name, ID, mobile or enter email</span>
                    </label>

                    <div className="w-full p-2 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition-all min-h-[48px] flex flex-wrap gap-2 focus-within:border-[#FF7B1D] focus-within:ring-2 focus-within:ring-[#FF7B1D] focus-within:ring-opacity-20 cursor-text"
                        onClick={() => inputRef.current?.focus()}>
                        {attendees.map((email) => {
                            const emp = employees.find(e => e.email === email);
                            return (
                                <div key={email} className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-sm">
                                    <span className="text-xs font-semibold text-orange-700">{emp?.employee_name || email}</span>
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
                            );
                        })}
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
                            className="flex-1 min-w-[150px] bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                            placeholder={attendees.length === 0 ? "Search employees or type email..." : ""}
                        />
                        <button
                            type="button"
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="text-gray-400 hover:text-gray-600 transition-colors px-1"
                        >
                            <ChevronDown size={16} className={`transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Suggestions List */}
                    {showSuggestions && (
                        <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-sm z-[100] max-h-60 overflow-y-auto no-scrollbar animate-fadeIn p-1">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map(emp => (
                                    <div
                                        key={emp.id}
                                        onClick={() => handleToggleAttendee(emp.email)}
                                        className="w-full px-3 py-2.5 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3 group"
                                    >
                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${attendees.includes(emp.email) ? 'bg-[#FF7B1D] border-[#FF7B1D]' : 'border-gray-300 group-hover:border-[#FF7B1D]'}`}>
                                            {attendees.includes(emp.email) && <Check size={12} className="text-white" strokeWidth={4} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF7B1D] capitalize">
                                                    {emp.employee_name}
                                                </span>
                                                <span className="text-[10px] bg-orange-100 text-[#FF7B1D] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-wider">
                                                    {emp.designation_name || 'Staff'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                {emp.employee_id} • {emp.email}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : searchTerm.includes('@') ? (
                                <div
                                    onClick={() => handleSelectEmail(searchTerm.trim())}
                                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex items-center gap-3 transition-colors"
                                >
                                    <Plus size={14} className="text-orange-500" />
                                    <span className="text-xs font-bold text-gray-700">Add external attendee: <span className="text-orange-600">{searchTerm}</span></span>
                                </div>
                            ) : (
                                <div className="px-4 py-4 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    No employees found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Meeting Type */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Layers size={16} className="text-[#FF7B1D]" />
                        Meeting Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex p-1 bg-gray-50 rounded-sm mb-4 border border-gray-100">
                        <button
                            type="button"
                            onClick={() => setMeetingType("Online")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-bold transition-all ${meetingType === "Online"
                                ? "bg-white text-[#FF7B1D] shadow-sm border border-gray-200"
                                : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <Monitor size={16} /> Online
                        </button>
                        <button
                            type="button"
                            onClick={() => setMeetingType("Offline")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-bold transition-all ${meetingType === "Offline"
                                ? "bg-white text-[#FF7B1D] shadow-sm border border-gray-200"
                                : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <MapPin size={16} /> Offline
                        </button>
                    </div>

                    {/* Conditional Location Fields */}
                    {meetingType === "Online" ? (
                        <div className="animate-fadeIn group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Video size={16} className="text-[#FF7B1D]" />
                                Meeting Link <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                placeholder="https://zoom.us/j/..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none text-sm font-semibold placeholder-gray-400 bg-white transition-all hover:border-gray-300"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin size={16} className="text-[#FF7B1D]" />
                                    Address Line 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    placeholder="Building, Street name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none text-sm font-semibold placeholder-gray-400 bg-white transition-all hover:border-gray-300"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        value={addressLine2}
                                        onChange={(e) => setAddressLine2(e.target.value)}
                                        placeholder="Area, Landmark"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none text-sm font-semibold placeholder-gray-400 bg-white transition-all hover:border-gray-300"
                                    />
                                </div>
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
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
                                            className={`w-full px-4 py-3 border rounded-sm outline-none text-sm font-semibold placeholder-gray-400 transition-all bg-white hover:border-gray-300 ${pincodeError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20'}`}
                                        />
                                        {loadingPincode && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 size={16} className="text-[#FF7B1D] animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none text-sm font-semibold bg-white transition-all hover:border-gray-300"
                                    />
                                </div>
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none text-sm font-semibold bg-white transition-all hover:border-gray-300"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="text-[#FF7B1D]" />
                        Description / Agenda <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 bg-white placeholder-gray-400 font-semibold hover:border-gray-300"
                        placeholder="What is this meeting about?"
                    />
                </div>

                {/* Reminders Toggle */}
                <div className="pt-2">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100 cursor-pointer hover:bg-orange-50 transition-all select-none group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={sendWhatsapp}
                                onChange={(e) => setSendWhatsapp(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${sendWhatsapp ? 'bg-[#FF7B1D]' : 'bg-gray-300'}`}></div>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${sendWhatsapp ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare size={16} className={sendWhatsapp ? 'text-[#FF7B1D]' : 'text-gray-400'} />
                            <span className="text-xs font-bold text-gray-700">Send Whatsapp Reminder</span>
                        </div>
                    </label>
                </div>
            </div>
        </Modal>
    );
}
