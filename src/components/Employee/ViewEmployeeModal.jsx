import React from "react";
import {
    User, Briefcase, Phone, FileText, CreditCard,
    Calendar, CheckCircle, XCircle, Mail, MapPin,
    Smartphone, Heart, Shield, Globe, Award, Eye
} from "lucide-react";
import Modal from "../common/Modal";

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
    if (!employee) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm"
        >
            Close Details
        </button>
    );

    const icon = employee.profile_picture_url ? (
        <img src={employee.profile_picture_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
    ) : (
        <div className="w-12 h-12 bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl rounded-lg">
            {employee.employee_name?.substring(0, 1)}
        </div>
    );

    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Icon size={18} className="text-orange-500" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h3>
        </div>
    );

    const DetailItem = ({ label, value, fullWidth }) => (
        <div className={fullWidth ? "col-span-full" : ""}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{label}</p>
            <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100 min-h-[42px] flex items-center font-medium">
                {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
            </p>
        </div>
    );

    const DocPreview = ({ label, src }) => (
        <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</p>
            <div className="w-full h-32 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-2 group relative">
                {src ? (
                    <>
                        <img src={src} alt={label} className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                            <a href={src} target="_blank" rel="noopener noreferrer" className="bg-white text-orange-600 p-2 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                                <Eye size={18} />
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                        <FileText size={24} />
                        <span className="text-[10px] mt-1 font-bold">MISSING</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={employee.employee_name}
            subtitle={employee.employee_id}
            icon={icon}
            footer={footer}
            maxWidth="max-w-4xl"
        >
            <div className="space-y-8 text-black bg-white">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center group transition-all hover:bg-blue-100/50">
                        <div className="bg-blue-600 p-2 rounded-xl text-white mb-2 shadow-lg shadow-blue-200">
                            <User size={18} />
                        </div>
                        <span className="text-lg font-bold text-blue-900 leading-none">{employee.gender || 'N/A'}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-blue-100/50 rounded-full">Gender</span>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center group transition-all hover:bg-orange-100/50">
                        <div className="bg-orange-500 p-2 rounded-xl text-white mb-2 shadow-lg shadow-orange-200">
                            <Calendar size={18} />
                        </div>
                        <span className="text-lg font-bold text-orange-900 leading-none">{employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : 'N/A'}</span>
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-orange-100/50 rounded-full">Join Date</span>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center text-center group transition-all hover:bg-purple-100/50">
                        <div className="bg-purple-600 p-2 rounded-xl text-white mb-2 shadow-lg shadow-purple-200">
                            <Award size={18} />
                        </div>
                        <span className="text-lg font-bold text-purple-900 leading-none truncate w-full px-2">{employee.designation_name || 'N/A'}</span>
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-purple-100/50 rounded-full">Designation</span>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center text-center group transition-all hover:bg-green-100/50">
                        <div className="bg-green-600 p-2 rounded-xl text-white mb-2 shadow-lg shadow-green-200">
                            {employee.status === "Active" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        </div>
                        <span className={`text-lg font-bold ${employee.status === "Active" ? "text-green-900" : "text-red-900"} leading-none`}>{employee.status}</span>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-green-100/50 rounded-full">Status</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Column 1 */}
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div className="bg-gray-50/30 p-1 rounded-2xl border border-gray-100/50">
                            <div className="p-4 space-y-4">
                                <SectionHeader icon={User} title="Personal Details" />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Marital Status" value={employee.marital_status} />
                                    <DetailItem label="Blood Group" value={employee.blood_group} />
                                    <DetailItem label="Date of Birth" value={employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : ""} />
                                    <DetailItem label="Age" value={employee.age} />
                                    <DetailItem label="Father's Name" value={employee.father_name} />
                                    <DetailItem label="Mother's Name" value={employee.mother_name} />
                                    <DetailItem label="Languages" value={employee.languages} fullWidth />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50/30 p-1 rounded-2xl border border-gray-100/50">
                            <div className="p-4 space-y-4">
                                <SectionHeader icon={Smartphone} title="Contact Info" />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Mobile Number" value={employee.mobile_number} />
                                    <DetailItem label="Email Address" value={employee.email} />
                                    <DetailItem label="Emergency Contact" value={employee.emergency_contact_person} />
                                    <DetailItem label="Emergency Number" value={employee.emergency_contact_number} />
                                    <DetailItem label="Permanent Address" value={employee.permanent_address} fullWidth />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-8">
                        {/* Job Details */}
                        <div className="bg-gray-50/30 p-1 rounded-2xl border border-gray-100/50">
                            <div className="p-4 space-y-4">
                                <SectionHeader icon={Briefcase} title="Job Details" />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Department" value={employee.department_name} />
                                    <DetailItem label="Employee Type" value={employee.employee_type} />
                                    <DetailItem label="Work Type" value={employee.work_type} />
                                    <DetailItem label="Joining Date" value={employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : ""} />
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-gray-50/30 p-1 rounded-2xl border border-gray-100/50">
                            <div className="p-4 space-y-4">
                                <SectionHeader icon={CreditCard} title="Bank Account" />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Account Number" value={employee.account_number} />
                                    <DetailItem label="IFSC Code" value={employee.ifsc_code} />
                                    <DetailItem label="Branch Name" value={employee.branch_name} fullWidth />
                                    <div className="col-span-full pt-2">
                                        <DocPreview label="Cancelled Cheque" src={employee.cancelled_cheque_url} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Identity Documents - Full Width */}
                    <div className="col-span-full bg-gray-50/30 p-1 rounded-2xl border border-gray-100/50">
                        <div className="p-4 space-y-4">
                            <SectionHeader icon={FileText} title="Identity Documents" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                                <DetailItem label="Aadhar Number" value={employee.aadhar_number} />
                                <DetailItem label="PAN Number" value={employee.pan_number} />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <DocPreview label="Aadhar Front" src={employee.aadhar_front_url} />
                                <DocPreview label="Aadhar Back" src={employee.aadhar_back_url} />
                                <DocPreview label="PAN Card" src={employee.pan_card_url} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewEmployeeModal;
