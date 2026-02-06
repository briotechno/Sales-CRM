import React, { useRef } from "react";
import {
    X, Download, Printer, Mail, User, Briefcase, Building2,
    Calendar, MapPin, DollarSign, Clock, ShieldCheck, FileText,
    CheckCircle2, Globe, Phone, FileSignature, Layout
} from "lucide-react";
import Modal from "../common/Modal";

const ViewOfferLetterModal = ({ isOpen, onClose, offer }) => {
    const printRef = useRef();

    if (!offer) return null;

    const handlePrint = () => {
        window.print();
    };

    const getLogoSrc = () => {
        const logo_url = offer.company_info?.logo_url;
        if (logo_url) {
            if (logo_url.startsWith('http') || logo_url.startsWith('blob:') || logo_url.startsWith('data:')) {
                return logo_url;
            }
            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
            return `${baseUrl}${logo_url.startsWith('/') ? '' : '/'}${logo_url}`;
        }
        return null;
    };

    const sectionTitle = "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-l-4 border-orange-500 pl-3 font-primary";
    const labelClass = "text-xs font-semibold text-gray-500 block mb-1 font-primary";
    const valueClass = "text-sm font-bold text-gray-900 font-primary";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Preview Offer Letter"
            maxWidth="max-w-5xl"
            cleanLayout={true}
            icon={<div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg"><FileSignature size={22} /></div>}
            footer={
                <div className="flex justify-between items-center w-full bg-gray-50 px-6 py-4 border-t">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${offer.status === 'Accepted' ? 'bg-green-50 text-green-600 border-green-200' :
                            offer.status === 'Sent' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                            {offer.status || 'Draft'}
                        </span>
                        <span className="text-xs font-bold text-gray-400 capitalize font-primary">
                            Version {offer.version_number || 1}.0
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold hover:bg-white hover:shadow-sm transition-all text-sm">
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm flex items-center gap-2 font-bold shadow-[0_4px_15px_rgba(255,123,29,0.3)] hover:from-orange-600 hover:to-orange-700 transition-all text-sm"
                        >
                            <Printer size={18} />
                            Print / PDF
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col h-[75vh]">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-gray-50/50">
                    <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl border border-gray-100 rounded-sm overflow-hidden" ref={printRef}>
                        {/* Header Branding */}
                        <div className="p-10 border-b border-gray-100 bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16" />
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    {getLogoSrc() ? (
                                        <img src={getLogoSrc()} alt="Logo" className="h-16 w-auto object-contain mb-6" />
                                    ) : (
                                        <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mb-6 border border-orange-100">
                                            <Building2 size={32} className="text-orange-500" />
                                        </div>
                                    )}
                                    <h1 className="text-2xl font-black text-gray-900 tracking-tight capitalize font-primary">
                                        {offer.company_info?.name || "Company Name"}
                                    </h1>
                                    <div className="flex flex-col gap-1 mt-3">
                                        <p className="text-xs font-bold text-gray-400 capitalize flex items-center gap-2 font-primary">
                                            <Globe size={12} className="text-orange-500" /> {offer.company_info?.website || "www.company.com"}
                                        </p>
                                        <p className="text-xs font-bold text-gray-400 capitalize flex items-center gap-2 font-primary">
                                            <Mail size={12} className="text-orange-500" /> {offer.company_info?.email || "hr@company.com"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-block px-4 py-2 bg-slate-900 rounded-sm mb-4">
                                        <span className="text-white text-xs font-bold capitalize font-primary">Private & Confidential</span>
                                    </div>
                                    <p className={labelClass}>Reference Number</p>
                                    <p className="text-lg font-black text-orange-600 tracking-tighter mb-4">{offer.reference_no}</p>
                                    <p className={labelClass}>Dated</p>
                                    <p className={valueClass}>{new Date(offer.offer_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="p-10 space-y-12 bg-white">
                            {/* Personal & Professional Summary */}
                            <section>
                                <h3 className={sectionTitle}><User size={14} className="text-orange-500" /> Employment Recipient</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-sm border border-gray-100">
                                    <div className="space-y-4">
                                        <div>
                                            <p className={labelClass}>Candidate Name</p>
                                            <p className="text-xl font-black text-gray-900 font-primary">{offer.candidate_details?.name}</p>
                                        </div>
                                        <div>
                                            <p className={labelClass}>Primary Email</p>
                                            <p className={valueClass}>{offer.candidate_details?.email}</p>
                                        </div>
                                        <div>
                                            <p className={labelClass}>Contact Number</p>
                                            <p className={valueClass}>{offer.candidate_details?.phone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className={labelClass}>Residential Address</p>
                                            <p className="text-sm font-semibold text-gray-700 leading-relaxed max-w-xs">{offer.candidate_details?.address}</p>
                                        </div>
                                        {offer.candidate_details?.employee_id && (
                                            <div>
                                                <p className={labelClass}>Assigned Employee ID</p>
                                                <p className="text-sm font-black text-orange-500">{offer.candidate_details?.employee_id}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Position Details */}
                            <section>
                                <h3 className={sectionTitle}><Briefcase size={14} className="text-orange-500" /> Position Framework</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className={labelClass}>Designation</p>
                                        <p className={valueClass}>{offer.designation}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Department</p>
                                        <p className={valueClass}>{offer.department}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Employment Type</p>
                                        <p className={valueClass}>{offer.candidate_details?.employment_type}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Work Location</p>
                                        <p className={valueClass}>{offer.candidate_details?.location}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Reporting Manager</p>
                                        <p className={valueClass}>{offer.candidate_details?.manager || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Date of Joining</p>
                                        <p className="text-sm font-bold text-orange-600">{new Date(offer.joining_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Working Hours</p>
                                        <p className={valueClass}>{offer.offer_details?.working_hours}</p>
                                    </div>
                                    <div>
                                        <p className={labelClass}>Working Days</p>
                                        <p className={valueClass}>{offer.offer_details?.working_days}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Compensation & Benefits */}
                            <section>
                                <h3 className={sectionTitle}><DollarSign size={14} className="text-orange-500" /> Remuneration Strategy</h3>
                                <div className="bg-slate-900 rounded-sm p-8 text-white">
                                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 capitalize font-primary">Annual Compensation (CTC)</p>
                                            <p className="text-4xl font-black tracking-tighter mt-1">₹{Number(offer.annual_ctc || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 capitalize font-primary">Monthly Net</p>
                                            <p className="text-2xl font-bold tracking-tight mt-1 text-orange-500">₹{Number(offer.net_salary || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    {offer.salary_model === 'Structured' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-slate-400 capitalize font-primary">Basic Component</span>
                                                    <span className="font-bold">₹{Number(offer.salary_structure?.basic || 0).toLocaleString()}</span>
                                                </div>
                                                {offer.salary_structure?.allowances?.map((allow, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs text-slate-300 py-1 font-primary">
                                                        <span>{allow.name}</span>
                                                        <span className="font-semibold text-white">₹{Number(allow.amount || 0).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-l border-slate-700 pl-12">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-slate-400 capitalize font-primary">Probation</span>
                                                    <span className="font-bold text-orange-400">{offer.offer_details?.probation_duration} {offer.offer_details?.probation_unit}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed capitalize font-bold font-primary">Standard deductions and taxes as per government norms will apply to the above mentioned gross salary.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Roles & Roles */}
                            {offer.roles_responsibilities?.summary && (
                                <section>
                                    <h3 className={sectionTitle}><Layout size={14} className="text-orange-500" /> Operational Context</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-sm border border-gray-100 italic">
                                        "{offer.roles_responsibilities.summary}"
                                    </p>
                                </section>
                            )}

                            {/* Terms & Legals */}
                            <section>
                                <h3 className={sectionTitle}><ShieldCheck size={14} className="text-orange-500" /> Compliance & Legal Guard</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-sm border-l-4 border-gray-300">
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            {offer.legal_disclaimer?.statement || "This offer is contingent upon your successful completion of our standard background check and verification of the documents provided by you."}
                                        </p>
                                    </div>
                                    <div className="flex gap-12 pt-8">
                                        <div className="flex-1 border-t border-gray-200 pt-4">
                                            <p className={labelClass}>Authorized Representative</p>
                                            <p className="text-sm font-black text-gray-900 font-primary capitalize tracking-tighter">Business HR / MD</p>
                                        </div>
                                        <div className="flex-1 border-t border-gray-200 pt-4 text-right">
                                            <p className={labelClass}>Candidate Acceptance</p>
                                            <p className="text-sm font-bold text-gray-300 italic">(Digital Signature Placeholder)</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer / Branding */}
                        <div className="p-10 bg-slate-50 border-t border-gray-100 flex flex-col items-center">
                            <p className="text-xs font-bold text-gray-400 capitalize mb-4 font-primary">Branded By {offer.company_info?.name}</p>
                            <div className="flex gap-8">
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 capitalize font-primary"><Globe size={10} /> {offer.company_info?.website}</span>
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 capitalize font-primary"><Phone size={10} /> {offer.company_info?.contact}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF7B1D; border-radius: 10px; }
                
                @media print {
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                }

                .font-primary { font-family: 'Outfit', sans-serif; }
            `}</style>
        </Modal>
    );
};

export default ViewOfferLetterModal;
