import React from "react";
import {
  FileText,
  Building,
  Briefcase,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Modal from "../common/Modal";

const ViewTermModal = ({ isOpen, onClose, term }) => {
  if (!term) return null;

  const footer = (
    <div className="flex gap-4 w-full">
      <button
        onClick={onClose}
        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition text-xs uppercase tracking-widest font-primary"
      >
        Close Details
      </button>
    </div>
  );

  const icon = (
    <div className="bg-white bg-opacity-20 p-2.5 rounded-sm">
      <FileText size={24} className="text-white" />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={term.title}
      subtitle="View detailed terms and conditions setup"
      icon={icon}
      footer={footer}
      bodyClassName="!p-0"
    >
      <div className="space-y-6 text-black bg-white font-primary p-6">
        {/* Stats - Field wise like Team Modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
              <Building size={14} className="text-[#FF7B1D]" />
              Department
            </p>
            <p className="text-sm font-bold text-gray-800 tracking-tight capitalize">
              {term.department}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
              <Briefcase size={14} className="text-[#FF7B1D]" />
              Designation
            </p>
            <p className="text-sm font-bold text-gray-800 tracking-tight capitalize">
              {term.designation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
              <CheckCircle size={14} className="text-[#FF7B1D]" />
              Status
            </p>
            <span className={`inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-bold border capitalize tracking-wider ${term.status === 'Active'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
              }`}>
              {term.status}
            </span>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
              <Calendar size={14} className="text-[#FF7B1D]" />
              Created Date
            </p>
            <p className="text-sm font-bold text-gray-800 tracking-tight">
              {new Date(term.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
            <FileText size={14} className="text-[#FF7B1D]" />
            Term Description
          </p>

          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-sm border border-gray-100 break-words whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar shadow-inner">
            {term.description || "No description available"}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTermModal;
