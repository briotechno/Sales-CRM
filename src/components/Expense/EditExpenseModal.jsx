import React, { useState, useEffect } from 'react';
import { X, FileText, DollarSign, Calendar, Upload, Edit } from 'lucide-react';
import { useUpdateExpenseMutation } from '../../store/api/expenseApi';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';

const EditExpenseModal = ({ isOpen, onClose, expense }) => {
    const [updateExpense, { isLoading }] = useUpdateExpenseMutation();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Meals',
        date: '',
        receipt: null
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
                receipt: null
            });
        }
    }, [expense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, receipt: e.target.files[0] }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.amount || !formData.date) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.title.length > 1000) {
            toast.error("Description cannot exceed 1000 characters");
            return;
        }

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('amount', formData.amount);
            data.append('category', formData.category);
            data.append('date', formData.date);
            if (formData.receipt) {
                data.append('receipt', formData.receipt);
            }

            await updateExpense({ id: expense.id, data }).unwrap();
            toast.success("Expense updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to update expense");
        }
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50 text-sm"
            >
                {isLoading ? (
                    'Updating...'
                ) : (
                    'Update Expense'
                )}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Expense"
            subtitle="Modify your existing expense details"
            icon={<Edit size={24} />}
            footer={footer}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-5 px-1 pb-2">
                {/* Description Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="text-[#FF7B1D]" />
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-sm outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white resize-none ${formData.title.length > 1000
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 hover:border-gray-300"
                            }`}
                    />
                    <div className="flex justify-end mt-1">
                        <span className={`text-xs font-bold ${formData.title.length > 1000 ? "text-red-500" : "text-gray-400"}`}>
                            {formData.title.length}/1000
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount Input */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign size={16} className="text-[#FF7B1D]" />
                            Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                        />
                    </div>

                    {/* Category Input */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FileText size={16} className="text-[#FF7B1D]" />
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        >
                            {["Meals", "Travel", "Supplies", "Training", "Software", "Other"].map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar size={16} className="text-[#FF7B1D]" />
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                </div>

                {/* Receipt Upload Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Upload size={16} className="text-[#FF7B1D]" />
                        Update Receipt (PDF or Image)
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="edit-receipt-upload"
                        />
                        <label
                            htmlFor="edit-receipt-upload"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-sm hover:border-[#FF7B1D] hover:bg-orange-50 cursor-pointer transition-all text-sm text-gray-600"
                        >
                            {formData.receipt ? (
                                <span className="text-[#FF7B1D] font-medium flex items-center gap-2">
                                    <FileText size={18} />
                                    {formData.receipt.name}
                                </span>
                            ) : (
                                <>
                                    <Upload size={18} className="text-gray-400" />
                                    <span>Click to update receipt (Optional)</span>
                                </>
                            )}
                        </label>
                    </div>
                    {expense?.receipt_full_url && !formData.receipt && (
                        <div className="mt-4 p-3 bg-gray-50 border rounded-sm">
                            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Current Receipt</h4>
                            {expense.receipt_full_url.toLowerCase().endsWith('.pdf') ? (
                                <a
                                    href={expense.receipt_full_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#FF7B1D] hover:underline"
                                >
                                    <FileText size={20} />
                                    View PDF Receipt
                                </a>
                            ) : (
                                <div className="h-40 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
                                    <img
                                        src={expense.receipt_full_url}
                                        alt="Current Receipt"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EditExpenseModal;
