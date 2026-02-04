import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { useDeleteAnnouncementMutation } from "../../store/api/announcementApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const DeleteAnnouncementModal = ({ isOpen, onClose, announcement }) => {
    const [deleteAnnouncement, { isLoading }] = useDeleteAnnouncementMutation();

    const handleDelete = async () => {
        try {
            await deleteAnnouncement(announcement.id).unwrap();
            toast.success("Announcement deleted successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete announcement");
        }
    };

    const footer = (
        <div className="flex gap-4 w-full">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
            >
                Cancel
            </button>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs uppercase tracking-widest"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Trash2 size={18} />
                )}
                {isLoading ? "Deleting..." : "Delete Now"}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerVariant="simple"
            maxWidth="max-w-md"
            footer={footer}
        >
            <div className="flex flex-col items-center text-center text-black font-primary">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={48} className="text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Delete
                </h2>

                <p className="text-gray-600 mb-2 leading-relaxed">
                    Are you sure you want to delete the announcement{" "}
                    <span className="font-bold text-gray-800">"{announcement?.title}"</span>?
                </p>

                <p className="text-xs text-red-500 italic">
                    This action cannot be undone. All associated data will be permanently removed.
                </p>
            </div>
        </Modal>
    );
};

export default DeleteAnnouncementModal;
