import React, { useState } from "react";
import ReactDOM from "react-dom";

const CreateCallLogModal = ({ open, onClose, onSave }) => {
  const [status, setStatus] = useState("Busy");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [followTask, setFollowTask] = useState(false);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-md shadow-lg w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Call Log
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option>Busy</option>
              <option>Not Answered</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Followup Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Note */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Note <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          ></textarea>
        </div>

        {/* Followup Checkbox */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={followTask}
            onChange={() => setFollowTask(!followTask)}
          />
          <label className="text-gray-700">Create a follow up task</label>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave({ status, date, note, followTask });
              onClose();
            }}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateCallLogModal;
