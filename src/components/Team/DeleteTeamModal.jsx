import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

const DeleteTeamModal = ({ isOpen, onClose, onConfirm, isLoading, teamName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-sm">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Trash2 className="text-red-500" size={24} />
                        Confirm Delete
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                    <p className="text-gray-600 mb-2">Are you sure you want to delete the team</p>
                    <p className="text-lg font-bold text-gray-800 mb-6">"{teamName}"?</p>
                    <p className="text-sm text-red-500 italic">This action cannot be undone.</p>
                </div>

                <div className="flex gap-3 p-6 bg-gray-50 border-t">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-all rounded-sm shadow-md disabled:opacity-50"
                    >
                        {isLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-gray-300 font-bold text-gray-700 hover:bg-white transition-all rounded-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTeamModal;
