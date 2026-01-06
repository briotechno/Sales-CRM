import React from 'react';
import {
    X,
    FileText,
    DollarSign,
    Calendar,
    Tag,
    CheckCircle,
    Clock,
    ExternalLink,
    Download,
    Receipt,
    AlertCircle
} from 'lucide-react';
import Modal from '../common/Modal';

const ViewExpenseModal = ({ isOpen, onClose, expense }) => {
    if (!expense) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={14} className="mr-1" />;
            case 'rejected': return <AlertCircle size={14} className="mr-1" />;
            default: return <Clock size={14} className="mr-1" />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Expense Details"
            maxWidth="max-w-3xl"
        >
            <div className="flex flex-col h-full">
                {/* Header Summary Card */}
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl border border-orange-100 mb-6 flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{expense.title}</h3>
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(expense.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span>•</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center ${getStatusColor(expense.status)}`}>
                                {getStatusIcon(expense.status)}
                                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-0.5">Total Amount</p>
                        <p className="text-3xl font-bold text-gray-800 flex items-center justify-end">
                            <span className="text-lg text-gray-400 font-normal mr-1">₹</span>
                            {expense.amount}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Category Card */}
                    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Tag size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Category</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-800 ml-1">{expense.category}</p>
                    </div>

                    {/* Created Date Card */}
                    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Clock size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Created At</span>
                        </div>
                        <p className="text-base font-medium text-gray-800 ml-1">
                            {new Date(expense.created_at || expense.date).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Receipt Status Card */}
                    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <Receipt size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Receipt</span>
                        </div>
                        <p className="text-base font-medium text-gray-800 ml-1">
                            {expense.receipt_url ? "Attached" : "Not Attached"}
                        </p>
                    </div>
                </div>

                {/* Receipt Preview Section */}
                <div className="flex-1 min-h-0 border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-orange-500" size={20} />
                            Receipt Attachment
                        </h4>
                        {expense.receipt_full_url && (
                            <a
                                href={expense.receipt_full_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                Open Original <ExternalLink size={14} />
                            </a>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden min-h-[200px] flex items-center justify-center relative group">
                        {expense.receipt_full_url ? (
                            expense.receipt_full_url.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={expense.receipt_full_url}
                                    className="w-full h-[400px]"
                                    title="Receipt PDF"
                                ></iframe>
                            ) : (
                                <div className="relative w-full h-full p-4 flex items-center justify-center">
                                    <img
                                        src={expense.receipt_full_url}
                                        alt="Receipt"
                                        className="max-h-[400px] max-w-full object-contain shadow-sm rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-gray-400 py-12">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Receipt size={32} className="opacity-50" />
                                </div>
                                <p className="font-medium">No receipt attached to this expense</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
                >
                    Close
                </button>
                {expense.receipt_full_url && (
                    <a
                        href={expense.receipt_full_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all flex items-center gap-2"
                    >
                        <Download size={18} />
                        Download Receipt
                    </a>
                )}
            </div>
        </Modal>
    );
};

export default ViewExpenseModal;
