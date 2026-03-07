import React, { useState, useEffect } from "react";
import { X, FileText, LayoutGrid, Upload, CheckCircle, Plus } from "lucide-react";
import { toast } from 'react-hot-toast';

const AddNoteModal = ({ open, onClose, onSave, editData = null, title: modalTitle = "Add Note" }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setDescription(editData.content || editData.description || "");
    } else {
      setTitle("");
      setDescription("");
      setFiles([]);
    }
  }, [editData, open]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Attachments required for new notes/documents
    if (!editData && files.length === 0) {
      toast.error("Please attach at least one file");
      return;
    }

    onSave({
      title,
      description,
      files,
    });

    // reset fields after save
    if (!editData) {
      setTitle("");
      setDescription("");
      setFiles([]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 font-primary">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-sm text-white">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-white capitalize tracking-wide">
              {editData ? (modalTitle.startsWith('Edit') ? modalTitle : `Edit ${modalTitle}`) : modalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 transition-all rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-[14px] font-semibold text-gray-700 mb-2 capitalize">
              <LayoutGrid size={14} className="text-[#FF7B1D]" />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm"
              placeholder="Enter title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-[14px] font-semibold text-gray-700 mb-2 capitalize">
              <FileText size={14} className="text-[#FF7B1D]" />
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-gray-300"
              placeholder="Write your description here..."
            ></textarea>
          </div>

          {/* File Upload - Only for new notes or if backend supports it for edits */}
          {!editData && (
            <div>
              <label className="flex items-center gap-2 text-[14px] font-semibold text-gray-700 mb-2 capitalize">
                <Upload size={14} className="text-[#FF7B1D]" />
                Attachments <span className="text-red-500">*</span>
              </label>

              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-[#FF7B1D] hover:bg-orange-50/30 transition-all bg-gray-50/50 group">
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <Plus size={20} className="text-gray-400 group-hover:text-[#FF7B1D] mb-1" />
                  <p className="text-xs text-gray-500 group-hover:text-[#FF7B1D]">
                    Click to upload or drag files
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </label>

              {/* Show selected files */}
              {files.length > 0 && (
                <div className="mt-3 space-y-1">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-sm border border-gray-100">
                      <FileText size={12} className="text-gray-400" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 -mx-6 px-6 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-white transition-all text-sm bg-white active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg transform transition-all active:scale-95 text-sm"
            >
              {editData ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
