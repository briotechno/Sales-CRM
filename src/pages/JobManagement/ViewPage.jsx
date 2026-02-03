import React from "react";
import {
  Briefcase,
  X,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

/**
 * JobViewModal Component
 *
 * This component displays detailed information about a specific job posting in a modal.
 *
 * Props:
 * - job: Object containing job details (title, department, location, type, positions, applicants, status, postedDate)
 * - onClose: Function to close the modal
 *
 * Usage:
 * <JobViewModal
 *   job={selectedJob}
 *   onClose={() => setShowViewModal(false)}
 * />
 */

const JobViewModal = ({ job, onClose }) => {
  if (!job) return null;

  const getList = (items) => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      try {
        return JSON.parse(items);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const responsibilities = getList(job.responsibilities);
  const requirements = getList(job.requirements);
  const interviewRounds = getList(job.interview_rounds);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">{job.department} Department</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 space-y-8 font-sans">

          {/* QUICK INFO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <span className="text-lg font-bold text-blue-900 line-clamp-1">{job.location}</span>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Location</span>
            </div>

            <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="bg-green-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                <Clock size={20} />
              </div>
              <span className="text-lg font-bold text-green-900 line-clamp-1">{job.type}</span>
              <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Job Type</span>
            </div>

            <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="bg-orange-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <span className="text-lg font-bold text-orange-900">{job.applicants}</span>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">Applicants</span>
            </div>

            <div className="bg-purple-50 p-4 rounded-sm border border-purple-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="bg-purple-600 p-2 rounded-sm text-white mb-2 group-hover:scale-110 transition-transform">
                <Briefcase size={20} />
              </div>
              <span className="text-lg font-bold text-purple-900">{job.positions}</span>
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">Positions</span>
            </div>
          </div>

          {/* STATUS AND DATES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                {job.status === "Active" ? <CheckCircle size={18} /> : <XCircle size={18} />}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</p>
                <span
                  className={`text-sm font-bold ${job.status === "Active"
                    ? "text-green-600"
                    : job.status === "On Hold"
                      ? "text-yellow-600"
                      : "text-gray-600"
                    }`}
                >
                  {job.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-sm text-orange-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Posted Date</p>
                <p className="text-sm font-semibold text-gray-700">{new Date(job.posted_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div> Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-sm border border-gray-200 break-words whitespace-pre-wrap text-sm">
              {job.description}
            </p>
          </div>

          {/* RESPONSIBILITIES */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div> Key Responsibilities
            </h3>
            <div className="bg-white border border-gray-200 p-4 rounded-sm">
              <ul className="space-y-3">
                {responsibilities.length > 0 ? (
                  responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <div className="bg-orange-100 p-1 rounded-full mt-0.5">
                        <CheckCircle size={14} className="text-orange-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">No specific responsibilities listed.</p>
                )}
              </ul>
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div> Requirements
            </h3>
            <div className="bg-white border border-gray-200 p-4 rounded-sm">
              <ul className="space-y-3">
                {requirements.length > 0 ? (
                  requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                        <CheckCircle size={14} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">No specific requirements listed.</p>
                )}
              </ul>
            </div>
          </div>

          {/* INTERVIEW ROUNDS */}
          {interviewRounds.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full"></div> Interview Rounds (Pre-Defined Sequence)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {interviewRounds.map((round, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-100 p-4 rounded-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">{round}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER SECTION */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all shadow-sm font-sans"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobViewModal;
