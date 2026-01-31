import React, { useState } from 'react';
import { X, FileText, DollarSign, Calendar, Upload, Plus } from 'lucide-react';
import { useAddExpenseMutation } from '../../store/api/expenseApi';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';

const AddExpenseModal = ({ isOpen, onClose }) => {
    const [addExpense, { isLoading }] = useAddExpenseMutation();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Meals',
        date: new Date().toISOString().split('T')[0],
        receipt: null
    });

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

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('amount', formData.amount);
            data.append('category', formData.category);
            data.append('date', formData.date);
            if (formData.receipt) {
                data.append('receipt', formData.receipt);
            }

            await addExpense(data).unwrap();
            toast.success("Expense added successfully");
            setFormData({
                title: '',
                amount: '',
                category: 'Meals',
                date: new Date().toISOString().split('T')[0],
                receipt: null
            });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to add expense");
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
                    'Adding...'
                ) : (
                    <>
                        <Plus size={18} />
                        Add Expense
                    </>
                )}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Expense"
            subtitle="Track and manage your company expenses"
            icon={<DollarSign size={24} />}
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
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Office Supplies, Client Lunch..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
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
                            placeholder="0.00"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                </div>

                {/* Receipt Upload Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Upload size={16} className="text-[#FF7B1D]" />
                        Upload Receipt (PDF or Image)
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="receipt-upload"
                        />
                        <label
                            htmlFor="receipt-upload"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FF7B1D] hover:bg-orange-50 cursor-pointer transition-all text-sm text-gray-600"
                        >
                            {formData.receipt ? (
                                <span className="text-[#FF7B1D] font-medium flex items-center gap-2">
                                    <FileText size={18} />
                                    {formData.receipt.name}
                                </span>
                            ) : (
                                <>
                                    <Upload size={18} className="text-gray-400" />
                                    <span>Click to upload or drag and drop</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddExpenseModal;
