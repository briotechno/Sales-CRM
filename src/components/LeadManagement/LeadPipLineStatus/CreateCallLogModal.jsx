import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, PhoneCall, Calendar, FileText, CheckCircle, Clock } from "lucide-react";

const CreateCallLogModal = ({ open, onClose, onSave }) => {
  const [status, setStatus] = useState("Interested");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");
  const [followTask, setFollowTask] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDate = (selectedDate && selectedTime) ? `${selectedDate}T${selectedTime}` : "";
    onSave({ status, date: finalDate, note, followTask });
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden font-primary animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-50 rounded-t-sm shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-2.5 rounded-sm">
              <PhoneCall size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white capitalize tracking-wide leading-tight">
                Create Call Log
              </h2>
              <p className="text-xs text-orange-50 font-medium opacity-90">
                Record the details of your conversation with the lead
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <CheckCircle size={14} className="text-orange-500" />
                Call Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 shadow-sm"
                required
              >
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Callback Scheduled">Callback Scheduled</option>
                <option value="Demo Scheduled">Demo Scheduled</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Quotation Sent">Quotation Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted / Sale Closed">Converted / Sale Closed</option>
                <option value="Lost Lead">Lost Lead</option>
                <option value="Call Disconnected">Call Disconnected</option>
                <option value="Wrong Requirement">Wrong Requirement</option>
                <option value="Duplicate Lead">Duplicate Lead</option>
                <option value="Do Not Call (DNC)">Do Not Call (DNC)</option>
              </select>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
                <Calendar size={14} className="text-orange-500" />
                Follow-up Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
                  required
                />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 mb-2 capitalize">
              <FileText size={14} className="text-orange-500" />
              Call Summary/Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
              placeholder="Record key points discussed during the call..."
              required
            ></textarea>
          </div>

          {/* Followup Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100 transition-all hover:bg-orange-50 group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="followTask"
                checked={followTask}
                onChange={() => setFollowTask(!followTask)}
                className="w-5 h-5 border-2 border-gray-300 rounded-sm text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500 shadow-sm"
              />
            </div>
            <label htmlFor="followTask" className="text-sm font-semibold text-gray-700 cursor-pointer select-none flex items-center gap-2 group-hover:text-orange-700 transition-colors">
              <Clock size={16} className="text-orange-400 group-hover:text-orange-500" />
              Create a follow up task automatically
            </label>
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
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateCallLogModal;
