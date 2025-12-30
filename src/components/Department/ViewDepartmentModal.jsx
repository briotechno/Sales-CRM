import { Building2, Users, Handshake, Calendar, CheckCircle, XCircle, FileText } from "lucide-react";
import Modal from "../common/Modal";

const ViewDepartmentModal = ({ isOpen, onClose, department }) => {
    if (!department) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm"
        >
            Close Details
        </button>
    );

    const icon = department.icon_url ? (
        <img src={department.icon_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
    ) : (
        <Building2 size={24} />
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={department.department_name}
            subtitle={department.department_id}
            icon={icon}
            footer={footer}
        >
            <div className="space-y-8 text-black bg-white">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-blue-600 p-2 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <span className="text-2xl font-bold text-blue-900">{department.employee_count || 0}</span>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Employees</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-orange-500 p-2 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                            <Handshake size={20} />
                        </div>
                        <span className="text-2xl font-bold text-orange-900">{department.designation_count || 0}</span>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">Designations</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                        <div className="bg-green-600 p-2 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                            {department.status === "Active" ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </div>
                        <span className={`text-xl font-bold ${department.status === "Active" ? "text-green-900" : "text-red-900"}`}>{department.status}</span>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Status</span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FileText size={16} /> Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {department.description || "No description provided for this department."}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-sm">
                        <Calendar size={16} />
                        <span>Created on {new Date(department.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewDepartmentModal;
