import React, { useState, useEffect, useRef } from "react";
import {
    X,
    User,
    Phone,
    Mail,
    Building2,
    CheckCircle,
    Users,
    Search,
    Loader2,
    Clock,
    Calendar,
    ShieldCheck,
    FileText,
    BadgeInfo,
    Plus,
    Layout,
    ChevronDown,
    Check
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

export default function AddVisitorModal({ open, onClose, onSave, editData, employees = [] }) {
    const [visitorName, setVisitorName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [visitorType, setVisitorType] = useState("Client");
    const [purpose, setPurpose] = useState("");
    const [hostEmployeeIds, setHostEmployeeIds] = useState([]);
    const [visitDate, setVisitDate] = useState("");
    const [checkInTime, setCheckInTime] = useState("");
    const [idProofType, setIdProofType] = useState("Aadhar");
    const [idProofNumber, setIdProofNumber] = useState("");
    const [remarks, setRemarks] = useState("");
    const [sendReminder, setSendReminder] = useState(true);

    // Employee search state
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    useEffect(() => {
        if (editData && open) {
            setVisitorName(editData.visitor_name || "");
            setPhoneNumber(editData.phone_number || "");
            setEmail(editData.email || "");
            setCompanyName(editData.company_name || "");
            setVisitorType(editData.visitor_type || "Client");
            setPurpose(editData.purpose || "");
            setHostEmployeeIds(Array.isArray(editData.host_employee_ids) ? editData.host_employee_ids : JSON.parse(editData.host_employee_ids || "[]"));
            setVisitDate(editData.visit_date ? editData.visit_date.split('T')[0] : "");
            setCheckInTime(editData.check_in_time || "");
            setIdProofType(editData.id_proof_type || "Aadhar");
            setIdProofNumber(editData.id_proof_number || "");
            setRemarks(editData.remarks || "");
            setSendReminder(!!editData.send_reminder);
        } else if (open) {
            const now = new Date();
            setVisitorName("");
            setPhoneNumber("");
            setEmail("");
            setCompanyName("");
            setVisitorType("Client");
            setPurpose("");
            setHostEmployeeIds([]);
            setVisitDate(now.toISOString().split('T')[0]);
            setCheckInTime(now.toTimeString().split(' ')[0].substring(0, 5));
            setIdProofType("Aadhar");
            setIdProofNumber("");
            setRemarks("");
            setSendReminder(true);
        }
    }, [editData, open]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
        };
    }, []);

    const handleSubmit = () => {
        if (!visitorName || !phoneNumber || hostEmployeeIds.length === 0) {
            toast.error("Please fill all required fields");
            return;
        }

        onSave({
            visitor_name: visitorName,
            phone_number: phoneNumber,
            email,
            company_name: companyName,
            visitor_type: visitorType,
            purpose,
            host_employee_ids: hostEmployeeIds,
            visit_date: visitDate,
            check_in_time: checkInTime,
            id_proof_type: idProofType,
            id_proof_number: idProofNumber,
            remarks,
            send_reminder: sendReminder
        });
    };

    const filteredEmployees = (employees || []).filter(emp => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            emp.employee_name?.toLowerCase().includes(search) ||
            emp.employee_id?.toLowerCase().includes(search) ||
            emp.id?.toString().includes(search)
        );
    });

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
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 text-sm"
            >
                <CheckCircle size={18} />
                {editData ? "Update Entry" : "Register Visitor"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={editData ? "Edit Visitor" : "Visitor Registration"}
            subtitle={editData ? "Update visitor record and host info" : "Log a new visitor entry at the desk"}
            icon={<User size={24} />}
            footer={footer}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-6 px-1 pb-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                {/* Visitor Information Section */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={14} className="text-[#FF7B1D]" />
                        Visitor Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <User size={16} className="text-[#FF7B1D]" />
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={visitorName}
                                onChange={(e) => setVisitorName(e.target.value)}
                                placeholder="Enter visitor's name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            />
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Phone size={16} className="text-[#FF7B1D]" />
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="10-digit mobile number"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            />
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Mail size={16} className="text-[#FF7B1D]" />
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            />
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Building2 size={16} className="text-[#FF7B1D]" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Organization name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Visit Details Section */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BadgeInfo size={14} className="text-[#FF7B1D]" />
                        Visit Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Layout size={16} className="text-[#FF7B1D]" />
                                Visitor Type
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 font-bold"
                                value={visitorType}
                                onChange={(e) => setVisitorType(e.target.value)}
                            >
                                <option value="Client">Client / Business</option>
                                <option value="Vendor">Vendor / Supplier</option>
                                <option value="Interviewee">Job Interview</option>
                                <option value="Personal">Personal Visit</option>
                                <option value="Maintenance">Maintenance / Service</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FileText size={16} className="text-[#FF7B1D]" />
                                Meeting Purpose
                            </label>
                            <input
                                type="text"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="Reason for visit"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            />
                        </div>

                        <div className="md:col-span-2 group relative" ref={suggestionRef}>
                            <label className="flex items-center justify-between gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-[#FF7B1D]" />
                                    Meeting With (Employees) <span className="text-red-500">*</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">Search name, ID or department</span>
                            </label>
                            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition-all min-h-[48px] focus-within:border-[#FF7B1D] focus-within:ring-2 focus-within:ring-[#FF7B1D] focus-within:ring-opacity-20">
                                {hostEmployeeIds.map(id => {
                                    const emp = employees.find(e => e.id === id);
                                    return (
                                        <div key={id} className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-sm">
                                            <span className="text-xs font-semibold text-orange-700">{emp?.employee_name || id}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setHostEmployeeIds(hostEmployeeIds.filter(i => i !== id));
                                                }}
                                                className="text-orange-400 hover:text-orange-600 transition-colors"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    );
                                })}
                                <input
                                    type="text"
                                    className="flex-1 min-w-[150px] bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                                    placeholder={hostEmployeeIds.length === 0 ? "Search employee name..." : ""}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors px-1"
                                >
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {showSuggestions && (
                                <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-sm z-[100] max-h-60 overflow-y-auto no-scrollbar animate-fadeIn p-1">
                                    {filteredEmployees.length > 0 ? (
                                        filteredEmployees.map(emp => (
                                            <div
                                                key={emp.id}
                                                onClick={() => {
                                                    if (hostEmployeeIds.includes(emp.id)) {
                                                        setHostEmployeeIds(hostEmployeeIds.filter(id => id !== emp.id));
                                                    } else {
                                                        setHostEmployeeIds([...hostEmployeeIds, emp.id]);
                                                    }
                                                }}
                                                className="w-full px-3 py-2.5 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3 group"
                                            >
                                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${hostEmployeeIds.includes(emp.id) ? 'bg-[#FF7B1D] border-[#FF7B1D]' : 'border-gray-300 group-hover:border-[#FF7B1D]'}`}>
                                                    {hostEmployeeIds.includes(emp.id) && <Check size={12} className="text-white" strokeWidth={4} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-gray-900 group-hover:text-[#FF7B1D] capitalize">{emp.employee_name}</p>
                                                        <span className="text-[10px] bg-orange-100 text-[#FF7B1D] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-wider">
                                                            {emp.department_name}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{emp.employee_id}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            No employees found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Identification & Remarks Section */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#FF7B1D]" />
                        Identification & Remarks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                ID Proof Type
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 font-bold"
                                value={idProofType}
                                onChange={(e) => setIdProofType(e.target.value)}
                            >
                                <option value="Aadhar">Aadhar Card</option>
                                <option value="DL">Driving License</option>
                                <option value="PAN">PAN Card</option>
                                <option value="Voter ID">Voter ID</option>
                                <option value="Passport">Passport</option>
                                <option value="Company ID">Company Employee ID</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                ID Number
                            </label>
                            <input
                                type="text"
                                value={idProofNumber}
                                onChange={(e) => setIdProofNumber(e.target.value)}
                                placeholder="Enter ID number"
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            />
                        </div>
                        <div className="md:col-span-2 group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FileText size={16} className="text-[#FF7B1D]" />
                                Additional Remarks
                            </label>
                            <textarea
                                rows={2}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Any special notes or carryings..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all resize-none text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 font-semibold"
                            />
                        </div>
                    </div>
                </div>

                {/* Reminders Toggle */}
                <div className="pt-2">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100 cursor-pointer hover:bg-orange-50 transition-all select-none group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={sendReminder}
                                onChange={(e) => setSendReminder(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${sendReminder ? 'bg-[#FF7B1D]' : 'bg-gray-300'}`}></div>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${sendReminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={20} className={sendReminder ? 'text-[#FF7B1D]' : 'text-gray-400'} />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Send Instant Notification</h4>
                                <p className="text-[10px] text-gray-500 font-medium">Alert host employees about visitor arrival via WhatsApp/System.</p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </Modal>
    );
}
