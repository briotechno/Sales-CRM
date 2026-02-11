import React from "react";
import { AlertCircle, Trash2, X } from "lucide-react";
import ReactDOM from "react-dom";

const LeadDeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden font-primary animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                            <Trash2 size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                            Confirm Delete
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 transition-all rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                        <AlertCircle size={48} className="text-red-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-tight">
                        {title || "Are you absolute sure?"}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                        {message || "This action cannot be undone. All data associated with this item will be permanently removed from our servers."}
                    </p>

                    <div className="w-full p-3 bg-red-50 border border-red-100 rounded-sm mb-8">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <AlertCircle size={14} />
                            Warning: Permanent Action
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 w-full pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all text-[11px] uppercase tracking-widest disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Trash2 size={16} />
                            )}
                            {isLoading ? "DELETING..." : "DELETE NOW"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LeadDeleteConfirmationModal;
