import React from "react";
import { AlertCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useDeleteEnterpriseMutation } from "../../store/api/enterpriseApi";

const DeleteEnterpriseModal = ({
    isOpen,
    onClose,
    enterprise,
}) => {
    const [deleteEnterprise, { isLoading }] = useDeleteEnterpriseMutation();

    const handleDelete = async () => {
        try {
            await deleteEnterprise(enterprise.id).unwrap();
            toast.success("Enterprise deleted successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete enterprise");
        }
    };

    const footer = (
        <div className="flex gap-4 w-full">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
                {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <Trash2 size={20} />
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
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={48} className="text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Delete
                </h2>

                <p className="text-gray-600 mb-2 leading-relaxed">
                    Are you sure you want to delete the enterprise{" "}
                    <span className="font-bold text-gray-800">"{enterprise?.name}"</span>?
                </p>

                <p className="text-sm text-red-500 italic">
                    This action cannot be undone. All associated data will be permanently removed.
                </p>
            </div>
        </Modal>
    );
};

export default DeleteEnterpriseModal;
