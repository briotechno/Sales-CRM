import React, { useState, useEffect, useRef } from "react";
import {
    UserCheck,
    CheckCircle,
    FileText,
    Upload,
    Plus,
    DollarSign,
    Briefcase,
    Zap,
    Calendar,
    X
} from "lucide-react";
import Modal from "../common/Modal";
import { useConvertLeadToClientMutation } from "../../store/api/leadApi";
import { useGetQuotationsQuery } from "../../store/api/quotationApi";
import { toast } from "react-hot-toast";

const interestedInOptions = [
    "Product Demo",
    "Pricing Info",
    "Support",
    "Partnership",
    "Consultation",
    "Training",
    "Other"
];

const inputStyles =
    "w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

export default function ConvertClientModal({ isOpen, onClose, leadData }) {
    const [conversionData, setConversionData] = useState({
        budget: "",
        projectType: "onetime",
        startDate: "",
        endDate: "",
        subscriptionDate: "",
        services: [],
        selectedQuotationId: "",
        agreementFile: null,
        quotationFile: null,
        useExistingQuotation: true
    });

    const multiSelectRef = useRef(null);
    const [openMultiSelect, setOpenMultiSelect] = useState(null);
    const [convertLead, { isLoading: isConverting }] = useConvertLeadToClientMutation();
    const { data: quotationsData } = useGetQuotationsQuery({ limit: 100 });
    const quotations = quotationsData?.quotations || [];

    useEffect(() => {
        function handleClickOutside(event) {
            if (openMultiSelect && multiSelectRef.current && !multiSelectRef.current.contains(event.target)) {
                setOpenMultiSelect(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMultiSelect]);

    useEffect(() => {
        if (leadData) {
            setConversionData(prev => ({
                ...prev,
                budget: leadData?.value?.replace(/[^0-9.]/g, '') || "",
                services: leadData?.services ? (typeof leadData.services === 'string' ? leadData.services.split(',').map(s => s.trim()) : leadData.services) : [],
            }));
        }
    }, [leadData]);

    const confirmConversion = async () => {
        if (conversionData.projectType === 'onetime' && (!conversionData.startDate || !conversionData.endDate)) {
            toast.error("Please select start and end dates");
            return;
        }
        if (conversionData.projectType === 'subscription' && !conversionData.subscriptionDate) {
            toast.error("Please select subscription date");
            return;
        }

        const formData = new FormData();
        formData.append('budget', conversionData.budget);
        formData.append('project_type', conversionData.projectType);
        if (conversionData.projectType === 'onetime') {
            formData.append('start_date', conversionData.startDate);
            formData.append('end_date', conversionData.endDate);
        } else {
            formData.append('subscription_date', conversionData.subscriptionDate);
        }
        formData.append('services', conversionData.services.join(', '));

        if (conversionData.useExistingQuotation) {
            if (conversionData.selectedQuotationId) {
                formData.append('quotation_id', conversionData.selectedQuotationId);
            }
        } else if (conversionData.quotationFile) {
            formData.append('quotation', conversionData.quotationFile);
        }

        if (conversionData.agreementFile) {
            formData.append('agreement', conversionData.agreementFile);
        }

        try {
            await convertLead({ id: leadData.id, data: formData }).unwrap();
            toast.success("Lead converted to Client successfully!");
            onClose();
        } catch (err) {
            toast.error(err.data?.message || "Failed to convert lead");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-sm text-white">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Convert to Client
                            </h2>
                            <p className="text-sm text-white text-opacity-90 mt-0.5">
                                Finalize the transition of <span className="font-bold underlineDecoration-white whitespace-nowrap">{leadData?.name || 'this lead'}</span> to client
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        {/* Agreement Upload */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                                <Upload size={14} className="text-orange-500" />
                                Upload Agreement (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="modal-agreement"
                                    className="hidden"
                                    onChange={(e) => setConversionData(prev => ({ ...prev, agreementFile: e.target.files[0] }))}
                                />
                                <label
                                    htmlFor="modal-agreement"
                                    className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-sm hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group px-4 text-center"
                                >
                                    {conversionData.agreementFile ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <FileText size={24} className="text-orange-500" />
                                            <span className="text-xs font-bold text-gray-700 truncate max-w-full">{conversionData.agreementFile.name}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-gray-300 group-hover:text-orange-400 mb-2" />
                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-orange-500 uppercase">Click to upload agreement</span>
                                        </>
                                    )}
                                </label>
                                {conversionData.agreementFile && (
                                    <button
                                        onClick={() => setConversionData(prev => ({ ...prev, agreementFile: null }))}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-sm shadow-sm hover:text-red-500 transition-colors"
                                    >
                                        <Plus size={14} className="rotate-45" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quotation Selection/Upload */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize">
                                <FileText size={14} className="text-orange-500" />
                                Agreement/Quotation Detail
                            </label>
                            <div className="flex gap-1 mb-2 p-1 bg-gray-100 rounded-sm shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setConversionData(prev => ({ ...prev, useExistingQuotation: true }))}
                                    className={`flex-1 py-1 text-[9px] font-bold uppercase rounded-sm transition-all ${conversionData.useExistingQuotation ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Select Existing
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConversionData(prev => ({ ...prev, useExistingQuotation: false }))}
                                    className={`flex-1 py-1 text-[9px] font-bold uppercase rounded-sm transition-all ${!conversionData.useExistingQuotation ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Upload New
                                </button>
                            </div>

                            {conversionData.useExistingQuotation ? (
                                <div className="border border-gray-200 rounded-sm h-28 overflow-y-auto bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
                                    {quotations.length > 0 ? (
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            {quotations.map(q => (
                                                <div
                                                    key={q.id}
                                                    onClick={() => {
                                                        const isSelected = conversionData.selectedQuotationId === q.id;
                                                        setConversionData(prev => ({
                                                            ...prev,
                                                            selectedQuotationId: isSelected ? "" : q.id,
                                                            budget: isSelected
                                                                ? (leadData?.value?.replace(/[^0-9.]/g, '') || "")
                                                                : (q.total_amount || prev.budget)
                                                        }));
                                                    }}
                                                    className={`flex items-center gap-3 p-2 cursor-pointer transition-all hover:bg-orange-50 ${conversionData.selectedQuotationId === q.id ? 'bg-orange-50' : 'bg-white'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${conversionData.selectedQuotationId === q.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white'}`}>
                                                        {conversionData.selectedQuotationId === q.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-[11px] font-bold truncate ${conversionData.selectedQuotationId === q.id ? 'text-orange-700' : 'text-gray-700'}`}>
                                                            {q.quotation_id}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-gray-400">₹{q.total_amount?.toLocaleString() || 0}</span>
                                                            <span className="text-[9px] text-gray-400">•</span>
                                                            <span className="text-[9px] text-gray-500">{q.quotation_date ? new Date(q.quotation_date).toLocaleDateString() : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                                            <FileText size={20} className="mb-1 opacity-20" />
                                            <span className="text-[10px] uppercase font-bold">No quotations found</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="modal-quotation"
                                        className="hidden"
                                        onChange={(e) => setConversionData(prev => ({ ...prev, quotationFile: e.target.files[0] }))}
                                    />
                                    <label
                                        htmlFor="modal-quotation"
                                        className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-200 rounded-sm hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group px-4 text-center"
                                    >
                                        {conversionData.quotationFile ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <FileText size={20} className="text-orange-500" />
                                                <span className="text-xs font-bold text-gray-700 truncate max-w-full">{conversionData.quotationFile.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={18} className="text-gray-300 group-hover:text-orange-400 mb-1" />
                                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-orange-500 uppercase text-center">Upload Quotation</span>
                                            </>
                                        )}
                                    </label>
                                    {conversionData.quotationFile && (
                                        <button
                                            onClick={() => setConversionData(prev => ({ ...prev, quotationFile: null }))}
                                            className="absolute top-1 right-1 p-1 bg-white rounded-sm shadow-sm hover:text-red-500 transition-colors"
                                        >
                                            <Plus size={12} className="rotate-45" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Budget */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 capitalize">
                                <DollarSign size={14} className="text-orange-500" />
                                Budget
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    value={conversionData.budget}
                                    onChange={(e) => setConversionData(prev => ({ ...prev, budget: e.target.value }))}
                                    className={inputStyles}
                                    placeholder="Enter budget amount"
                                />
                            </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-1" ref={multiSelectRef}>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 capitalize">
                                <Briefcase size={14} className="text-orange-500" />
                                Select Services
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => setOpenMultiSelect(prev => prev === 'modal-services' ? null : 'modal-services')}
                                    className="w-full min-h-[44px] p-2 border border-gray-200 rounded-sm cursor-pointer flex flex-wrap gap-1 items-center bg-white hover:border-orange-500 transition-all shadow-sm"
                                >
                                    {conversionData.services.length === 0 ? (
                                        <span className="text-xs text-gray-400 px-1">Select Services...</span>
                                    ) : (
                                        conversionData.services.map(s => (
                                            <span key={s} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-sm border border-orange-100 flex items-center gap-1 shadow-sm">
                                                {s}
                                                <X size={10} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); setConversionData(prev => ({ ...prev, services: prev.services.filter(x => x !== s) })) }} />
                                            </span>
                                        ))
                                    )}
                                </div>
                                {openMultiSelect === 'modal-services' && (
                                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-xl z-50 max-h-40 overflow-y-auto ring-1 ring-black ring-opacity-5">
                                        {interestedInOptions.map(opt => (
                                            <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer border-b last:border-0 border-gray-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={conversionData.services.includes(opt)}
                                                    onChange={() => {
                                                        setConversionData(prev => ({
                                                            ...prev,
                                                            services: prev.services.includes(opt) ? prev.services.filter(x => x !== opt) : [...prev.services, opt]
                                                        }));
                                                    }}
                                                    className="accent-orange-500 w-3.5 h-3.5"
                                                />
                                                <span className="text-xs font-bold text-gray-700 uppercase">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-gray-100">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 capitalize">
                            <Zap size={14} className="text-orange-500" />
                            Project Type & Timeline
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex flex-col items-center gap-2 p-3 border-2 rounded-sm cursor-pointer transition-all ${conversionData.projectType === 'onetime' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="modal-projectType"
                                    className="hidden"
                                    checked={conversionData.projectType === 'onetime'}
                                    onChange={() => setConversionData(prev => ({ ...prev, projectType: "onetime" }))}
                                />
                                <Zap size={20} className={conversionData.projectType === 'onetime' ? 'text-orange-500' : 'text-gray-400'} />
                                <span className={`text-[10px] font-black uppercase tracking-tight ${conversionData.projectType === 'onetime' ? 'text-orange-700' : 'text-gray-500'}`}>One-time project</span>
                            </label>
                            <label className={`flex-1 flex flex-col items-center gap-2 p-3 border-2 rounded-sm cursor-pointer transition-all ${conversionData.projectType === 'subscription' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="modal-projectType"
                                    className="hidden"
                                    checked={conversionData.projectType === 'subscription'}
                                    onChange={() => setConversionData(prev => ({ ...prev, projectType: "subscription" }))}
                                />
                                <Calendar size={20} className={conversionData.projectType === 'subscription' ? 'text-orange-500' : 'text-gray-400'} />
                                <span className={`text-[10px] font-black uppercase tracking-tight ${conversionData.projectType === 'subscription' ? 'text-orange-700' : 'text-gray-500'}`}>Subscription Model</span>
                            </label>
                        </div>

                        {conversionData.projectType === 'onetime' ? (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pb-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Start Date</span>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={conversionData.startDate}
                                            onChange={(e) => setConversionData(prev => ({ ...prev, startDate: e.target.value }))}
                                            className={inputStyles + " pl-10 h-10"}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product End Date</span>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={conversionData.endDate}
                                            onChange={(e) => setConversionData(prev => ({ ...prev, endDate: e.target.value }))}
                                            className={inputStyles + " pl-10 h-10"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pb-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subscription Start Date</span>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={conversionData.subscriptionDate}
                                            onChange={(e) => setConversionData(prev => ({ ...prev, subscriptionDate: e.target.value }))}
                                            className={inputStyles + " pl-10 h-10"}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold capitalize"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={confirmConversion}
                        disabled={isConverting}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg disabled:opacity-50 capitalize flex items-center gap-2"
                    >
                        {isConverting ? "Converting..." : "Convert Now"}
                        {!isConverting && <CheckCircle size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
