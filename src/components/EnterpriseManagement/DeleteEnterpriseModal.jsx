import React from "react";
import { AlertCircle, Trash2, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useDeleteEnterpriseMutation } from "../../store/api/enterpriseApi";

const DeleteEnterpriseModal = ({
    isOpen,
    onClose,
    enterprise,
    onSuccess,
}) => {
    const [deleteEnterprise, { isLoading }] = useDeleteEnterpriseMutation();

    const handleDelete = async () => {
        try {
            await deleteEnterprise(enterprise.id).unwrap();
            toast.success("Enterprise deleted successfully");
            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete enterprise");
        }
    };

    const footer = (
        <div className="flex gap-3 w-full">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary"
            >
                Cancel
            </button>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-2.5 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-md hover:shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 font-primary"
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
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
            <div className="flex flex-col items-center text-center p-2">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                    <AlertCircle size={40} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-primary">
                    Confirm Delete
                </h2>

                <p className="text-gray-600 mb-2 leading-relaxed text-sm font-medium">
                    Are you sure you want to delete the enterprise{" "}
                    <span className="font-bold text-gray-800">"{enterprise?.businessName || enterprise?.name}"</span>?
                </p>

                <p className="text-xs text-red-500 font-bold uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-sm border border-red-100">
                    This action cannot be undone.
                </p>
            </div>
        </Modal>
    );
};

export default DeleteEnterpriseModal;
