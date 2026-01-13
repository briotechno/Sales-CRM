import React from "react";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useDeleteProductKeyMutation } from "../../store/api/productKeyApi";

const DeleteProductKeyModal = ({ isOpen, onClose, productKey }) => {
    const [deleteProductKey, { isLoading }] = useDeleteProductKeyMutation();

    const handleDelete = async () => {
        try {
            await deleteProductKey(productKey.id).unwrap();
            toast.success("Product key deleted successfully");
            onClose();
        } catch (error) {
            toast.error("Failed to delete product key");
        }
    };

    if (!productKey) return null;

    const footer = (
        <div className="flex gap-4 w-full font-bold">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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
            <div className="flex flex-col items-center text-center text-black py-4">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={48} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2 uppercase tracking-tight">
                    Confirm Delete
                </h2>

                <p className="text-gray-600 mb-2 leading-relaxed font-semibold px-4">
                    Are you sure you want to delete the product key for{" "}
                    <span className="text-red-600">
                        "{productKey.enterprise}"
                    </span>?
                </p>

                <p className="text-sm text-gray-400 font-semibold italic">
                    This action cannot be undone.
                </p>
            </div>
        </Modal>
    );
};

export default DeleteProductKeyModal;
