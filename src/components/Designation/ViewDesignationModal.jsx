import React from "react";
import { User, Users, Briefcase, Calendar, CheckCircle, XCircle, FileText } from "lucide-react";
import Modal from "../common/Modal";

const ViewDesignationModal = ({ isOpen, onClose, designation }) => {
    if (!designation) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all shadow-sm font-sans"
        >
            Close Details
        </button>
    );

    const icon = designation.image_url ? (
        <img src={designation.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
    ) : (
        <User size={24} />
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={designation.designation_name?.slice(0, 50) + "..."}
            subtitle={designation.designation_id}
            icon={icon}
            footer={footer}
        >
            <div className="space-y-8 text-black bg-white font-sans">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <span className="text-2xl font-bold text-blue-900">{designation.employee_count || 0}</span>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Employees</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-orange-500 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            <Briefcase size={20} />
                        </div>
                        <div className="truncate w-full px-1">
                            <span className="text-sm font-bold text-orange-900 block truncate">{designation.department_name}</span>
                            <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-widest mt-1">Department</span>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                            {designation.status === "Active" ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </div>
                        <span className={`text-xl font-bold ${designation.status === "Active" ? "text-green-900" : "text-red-900"}`}>{designation.status}</span>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Status</span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3 tracking-wide">
                            <FileText size={18} className="text-[#FF7B1D]" />
                            <span>Description</span>
                        </h3>
                        <div className="bg-white rounded-sm border-2 border-gray-100 shadow-inner overflow-hidden">
                            <div className="h-[200px] overflow-y-auto p-4 custom-scrollbar text-sm text-gray-700 leading-relaxed font-sans ">
                                {designation.description || (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                                        <FileText size={40} className="mb-2 opacity-20" />
                                        <p>No description provided for this role.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-sm">
                        <Calendar size={16} />
                        <span>Created on {new Date(designation.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewDesignationModal;
