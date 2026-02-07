import React from "react";
import {
  FileText,
  Building,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  AlignLeft,
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
      title={term.title?.length > 60 ? `${term.title.substring(0, 60)}...` : term.title}
      subtitle="View detailed terms and conditions setup"
      icon={icon}
      footer={footer}
      bodyClassName="!p-0"
    >
      <div className="space-y-6 text-black bg-white font-primary p-6">
        {/* 1. Metadata Section - 50/50 Split for Dept/Desig */}
        {(term.department || term.designation) && (
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-6">
            {term.department && (
              <div className="bg-orange-50/50 p-4 rounded-sm border border-orange-100/50 flex flex-col items-center text-center group hover:bg-orange-50 transition-colors">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#FF7B1D] capitalize tracking-widest mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Building size={14} /> Department
                </p>
                <p className="text-sm font-semibold text-gray-800 capitalize tracking-tight leading-tight">
                  {term.department}
                </p>
              </div>
            )}
            {term.designation && (
              <div className="bg-blue-50/50 p-4 rounded-sm border border-blue-100/50 flex flex-col items-center text-center group hover:bg-blue-50 transition-colors">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-500 capitalize tracking-widest mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Briefcase size={14} /> Designation
                </p>
                <p className="text-sm font-semibold text-gray-800 capitalize tracking-tight leading-tight">
                  {term.designation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 1.5 Status Bar - Separated if exists */}
        {term.status && (
          <div className="border-b border-gray-100 pb-6">
            <div className={`p-3 rounded-sm border flex items-center justify-center gap-4 group transition-colors ${term.status === 'Active'
              ? 'bg-green-50/50 border-green-100/50 hover:bg-green-50'
              : 'bg-red-50/50 border-red-100/50 hover:bg-red-50'
              }`}>
              <p className={`flex items-center gap-1.5 text-[10px] font-semibold capitalize tracking-widest opacity-80 group-hover:opacity-100 transition-opacity ${term.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle size={14} /> Status:
              </p>
              <p className={`text-sm font-semibold capitalize tracking-tight leading-tight ${term.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>
                {term.status}
              </p>
            </div>
          </div>
        )}

        {/* 2. Created Date Bar */}
        <div className="flex items-center justify-between px-2 text-gray-500 py-1 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-orange-500" />
            <span className="text-xs font-semibold capitalize">Created Date:</span>
            <span className="text-xs font-semibold text-gray-700">
              {new Date(term.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <Clock size={14} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {new Date(term.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* 3. Policy Content Section */}
        <div className="space-y-6 pt-2">
          {/* Section Header: Title */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 capitalize tracking-wide">
              <FileText size={16} className="text-[#FF7B1D]" />
              Policy Title
            </label>
            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                {term.title}
              </p>
            </div>
          </div>

          {/* Section Header: Description with Counter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-semibold text-gray-800 capitalize tracking-wide flex items-center gap-2">
                <AlignLeft size={16} className="text-orange-500" /> Term Description
              </h3>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                {term.description?.length || 0} / 500 characters
              </span>
            </div>

            <div className="bg-gray-50 rounded-sm border border-gray-100 shadow-inner overflow-hidden">
              <div className="p-5 text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                {term.description || "No description available"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTermModal;
