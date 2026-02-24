import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Calendar, Clock, FileText, Users, CheckCircle, Video } from "lucide-react";

export default function AddMeetingModal({ open, onClose, onSave, editData }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [attendees, setAttendees] = useState("");

    useEffect(() => {
        if (editData && open) {
            setTitle(editData.title || "");
            const rawDate = editData.date || editData.meeting_date || "";
            setDate(rawDate ? (typeof rawDate === "string" ? rawDate.split('T')[0] : rawDate) : "");
            setTime(editData.time || editData.meeting_time || "");
            setDescription(editData.description || "");
            let attendeesList = "";
            if (editData.attendees) {
                if (Array.isArray(editData.attendees)) {
                    attendeesList = editData.attendees.join(", ");
                } else if (typeof editData.attendees === "string") {
                    try {
                        const parsed = JSON.parse(editData.attendees);
                        attendeesList = Array.isArray(parsed) ? parsed.join(", ") : editData.attendees;
                    } catch (e) {
                        attendeesList = editData.attendees;
                    }
                }
            }
            setAttendees(attendeesList);
        } else if (open) {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

            setTitle("");
            setDate(currentDate);
            setTime(currentTime);
            setDescription("");
            setAttendees("");
        }
    }, [editData, open]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            date,
            time,
            description,
            attendees: attendees.split(",").map(s => s.trim()).filter(Boolean)
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
                            <h2 className="text-2xl font-bold text-white capitalize tracking-wide leading-tight">
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                            <FileText size={14} className="text-orange-500" />
                            Meeting Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm"
                            placeholder="e.g., Project Discovery Call"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                                <Calendar size={14} className="text-orange-500" />
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white shadow-sm hover:border-gray-300"
                            />
                        </div>
                        {/* Time */}
                        <div>
                            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                                <Clock size={14} className="text-orange-500" />
                                Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white shadow-sm hover:border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                            <Users size={14} className="text-orange-500" />
                            Attendees (Comma separated emails)
                        </label>
                        <input
                            type="text"
                            value={attendees}
                            onChange={(e) => setAttendees(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
                            placeholder="john@example.com, jane@example.com"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                            <FileText size={14} className="text-orange-500" />
                            Description / Agenda
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
                            placeholder="What is this meeting about?"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
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
