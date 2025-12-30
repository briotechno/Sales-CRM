import React from "react";
import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useDeleteEmployeeMutation } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";

const DeleteEmployeeModal = ({ isOpen, onClose, employeeId }) => {
    const [deleteEmployee, { isLoading }] = useDeleteEmployeeMutation();

    const handleDelete = async () => {
        try {
            await deleteEmployee(employeeId).unwrap();
            toast.success("Employee deleted successfully!");
            onClose();
        } catch (err) {
            toast.error(err.data?.message || "Failed to delete employee");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-md relative overflow-hidden">
                <div className="bg-red-50 p-6 flex flex-col items-center text-center">
                    <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                        <Trash2 size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
                    <p className="text-sm text-gray-600">
                        This action cannot be undone. All data associated with this employee will be permanently removed.
                    </p>
                </div>

                <div className="p-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 shadow-md transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                        Delete
                    </button>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1">
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default DeleteEmployeeModal;
