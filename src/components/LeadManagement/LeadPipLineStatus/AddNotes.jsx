import React, { useState } from "react";

const AddNoteModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = () => {
    onSave({
      title,
      description,
      files,
    });

    // reset fields after save
    setTitle("");
    setDescription("");
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Note</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <label className="block mb-3">
          <span className="text-gray-600 font-medium">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-sm px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            placeholder="Enter note title"
          />
        </label>

        {/* Description */}
        <label className="block mb-3">
          <span className="text-gray-600 font-medium">Description</span>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-sm px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            placeholder="Write your note here..."
          ></textarea>
        </label>

        {/* File Upload */}
        <div className="mb-4">
          <span className="text-gray-600 font-medium">Attachments</span>

          <label className="mt-2 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-orange-400 transition-colors">
            <span className="text-gray-500">
              Click to upload or drag files here
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </label>

          {/* Show selected files */}
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700">
              {files.map((file, idx) => (
                <li key={idx} className="mt-1">
                  • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
