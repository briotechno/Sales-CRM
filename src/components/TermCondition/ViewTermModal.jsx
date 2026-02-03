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
    <button
      onClick={onClose}
      className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all shadow-sm font-sans"
    >
      Close Details
    </button>
  );

  const icon = (
    <div className="bg-orange-500 text-white p-2 rounded-lg">
      <FileText size={22} />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={term.title}
      subtitle={`${term.department} • ${term.designation}`}
      icon={icon}
      footer={footer}
    >
      <div className="space-y-8 text-black bg-white font-sans">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
              <Building size={20} />
            </div>
            <span className="text-sm font-bold text-blue-900 truncate w-full px-1">
              {term.department}
            </span>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
              Department
            </span>
          </div>

          <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="bg-orange-500 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
            <span className="text-sm font-bold text-orange-900 truncate w-full px-1">
              {term.designation}
            </span>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
              Designation
            </span>
          </div>

          <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
              <CheckCircle size={20} />
            </div>
            <span className="text-sm font-bold text-green-900">
              Active
            </span>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
              Status
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} /> Term Description
          </h3>

          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-sm border border-gray-100 break-words whitespace-pre-wrap">
            {term.description || "No description available"}
          </p>
        </div>

        {/* Created At */}
        <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-sm">
          <Calendar size={16} />
          <span>
            Created on{" "}
            {new Date(term.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTermModal;
