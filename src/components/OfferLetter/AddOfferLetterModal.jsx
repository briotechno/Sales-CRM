import React, { useState, useEffect } from "react";
import { FileSignature, Save, User as UserIcon, Mail, Phone, Building2, Briefcase, DollarSign, Calendar } from "lucide-react";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const AddOfferLetterModal = ({ isOpen, onClose, onSubmit, loading, initialData }) => {
    const [formData, setFormData] = useState({
        employee_id: null,
        candidate_name: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        basic_salary: "",
        allowances: [{ label: "", amount: "" }],
        deductions: [{ label: "", amount: "" }],
        joining_date: "",
        offer_date: new Date().toISOString().split('T')[0],
        address: "",
        status: "Draft",
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure allowances and deductions stay as arrays if not provided
                allowances: initialData.allowances || prev.allowances,
                deductions: initialData.deductions || prev.deductions,
            }));
        }
    }, [initialData, isOpen]);

    const { data: departmentData } = useGetDepartmentsQuery({ limit: 100 });
    const { data: designationData } = useGetDesignationsQuery({ limit: 100 });


    const handleAddField = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], { label: "", amount: "" }]
        }));
    };

    const handleFieldChange = (type, index, field, value) => {
        const newList = [...formData[type]];
        newList[index][field] = value;
        setFormData(prev => ({ ...prev, [type]: newList }));
    };

    const handleRemoveField = (type, index) => {
        const newList = formData[type].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [type]: newList }));
    };

    const calculateNetSalary = () => {
        const basic = Number(formData.basic_salary) || 0;
        const allowancesTotal = formData.allowances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const deductionsTotal = formData.deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        return basic + allowancesTotal - deductionsTotal;
    };

    const handleAdd = async () => {
        if (!formData.candidate_name || !formData.email) {
            toast.error("Candidate Name and Email are required");
            return;
        }

        const payload = {
            ...formData,
            net_salary: calculateNetSalary(),
        };

        try {
            await onSubmit(payload);
            toast.success("Offer Letter created successfully");
            onClose();
            setFormData({
                employee_id: null,
                candidate_name: "",
                email: "",
                phone: "",
                designation: "",
                department: "",
                basic_salary: "",
                allowances: [{ label: "", amount: "" }],
                deductions: [{ label: "", amount: "" }],
                joining_date: "",
                offer_date: new Date().toISOString().split('T')[0],
                address: "",
                status: "Draft",
            });
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create offer letter");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Offer Letter"
            maxWidth="max-w-4xl"
            icon={
                <div className="bg-orange-500 p-2 rounded-xl text-white">
                    <FileSignature size={22} />
                </div>
            }
            footer={
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? "Creating..." : "Generate Offer Letter"}
                    </button>
                </div>
            }
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                {/* Selection & Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <UserIcon size={16} className="text-[#FF7B1D]" />
                            Candidate Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.candidate_name}
                            onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Mail size={16} className="text-[#FF7B1D]" />
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            placeholder="candidate@example.com"
                        />
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Phone size={16} className="text-[#FF7B1D]" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            placeholder="+91 0000000000"
                        />
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Building2 size={16} className="text-[#FF7B1D]" />
                            Candidate Address
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            placeholder="Current address"
                        />
                    </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Building2 size={16} className="text-[#FF7B1D]" />
                            Department
                        </label>
                        <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 cursor-pointer"
                        >
                            <option value="">Select Department</option>
                            {departmentData?.departments?.map(dept => (
                                <option key={dept.id} value={dept.department_name}>{dept.department_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Briefcase size={16} className="text-[#FF7B1D]" />
                            Designation
                        </label>
                        <select
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 cursor-pointer"
                        >
                            <option value="">Select Designation</option>
                            {designationData?.designations?.map(des => (
                                <option key={des.id} value={des.designation_name}>{des.designation_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Calendar size={16} className="text-[#FF7B1D]" />
                            Offer Date
                        </label>
                        <input
                            type="date"
                            value={formData.offer_date}
                            onChange={(e) => setFormData({ ...formData, offer_date: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        />
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Calendar size={16} className="text-[#FF7B1D]" />
                            Expected Joining Date
                        </label>
                        <input
                            type="date"
                            value={formData.joining_date}
                            onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        />
                    </div>
                </div>

                {/* Salary Section */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <DollarSign size={18} className="text-orange-500" />
                        Salary Structure Details
                    </h3>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign size={16} className="text-[#FF7B1D]" />
                            Basic Salary (Annual/Monthly as per policy)
                        </label>
                        <input
                            type="number"
                            value={formData.basic_salary}
                            onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            placeholder="Enter base amount"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Allowances */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-green-600 uppercase tracking-widest">Allowances</label>
                                <button type="button" onClick={() => handleAddField('allowances')} className="text-xs text-[#FF7B1D] font-bold hover:underline">+ Add</button>
                            </div>
                            {formData.allowances.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. HRA)"
                                        value={item.label}
                                        onChange={(e) => handleFieldChange('allowances', index, 'label', e.target.value)}
                                        className="flex-1 text-sm border-b border-gray-200 focus:border-orange-500 outline-none py-1"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={item.amount}
                                        onChange={(e) => handleFieldChange('allowances', index, 'amount', e.target.value)}
                                        className="w-24 text-sm border-b border-gray-200 focus:border-orange-500 outline-none py-1"
                                    />
                                    {formData.allowances.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveField('allowances', index)} className="text-rose-500 font-bold px-1">×</button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Deductions */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Deductions</label>
                                <button type="button" onClick={() => handleAddField('deductions')} className="text-xs text-rose-500 font-bold hover:underline">+ Add</button>
                            </div>
                            {formData.deductions.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. PF)"
                                        value={item.label}
                                        onChange={(e) => handleFieldChange('deductions', index, 'label', e.target.value)}
                                        className="flex-1 text-sm border-b border-gray-200 focus:border-rose-500 outline-none py-1"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={item.amount}
                                        onChange={(e) => handleFieldChange('deductions', index, 'amount', e.target.value)}
                                        className="w-24 text-sm border-b border-gray-200 focus:border-rose-500 outline-none py-1"
                                    />
                                    {formData.deductions.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveField('deductions', index)} className="text-rose-500 font-bold px-1">×</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Net Offered Salary:</span>
                        <span className="text-2xl font-black text-[#FF7B1D]">₹{calculateNetSalary().toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #FF7B1D;
                    border-radius: 10px;
                }
            `}</style>
        </Modal>
    );
};

export default AddOfferLetterModal;
