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

const JobViewModal = ({ job, onClose, onEdit }) => {
  // Don't render if no job is provided
  if (!job) return null;

  // Helper to ensure we have an array
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="text-sm opacity-90">{job.department} Department</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-orange-700 p-2 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8">
          {/* QUICK INFO CARDS - 4 Cards in a Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Location Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 uppercase">
                  Location
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">{job.location}</p>
            </div>

            {/* Job Type Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-sm border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={18} className="text-green-600" />
                <span className="text-xs font-semibold text-green-600 uppercase">
                  Job Type
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">{job.type}</p>
            </div>

            {/* Applicants Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-sm border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-1">
                <Users size={18} className="text-orange-600" />
                <span className="text-xs font-semibold text-orange-600 uppercase">
                  Applicants
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {job.applicants}
              </p>
            </div>

            {/* Positions Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-sm border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={18} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 uppercase">
                  Positions
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">{job.positions}</p>
            </div>
          </div>

          {/* JOB DETAILS SECTIONS */}
          <div className="space-y-6">
            {/* STATUS AND POSTED DATE SECTION */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    {job.status === "Active" ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <XCircle size={20} className="text-red-600" />
                    )}
                    <span
                      className={`px-4 py-2 text-sm font-semibold rounded-sm ${job.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "On Hold"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Posted Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Posted Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-orange-600" />
                    <span className="text-gray-800 font-medium">
                      {new Date(job.posted_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* JOB DESCRIPTION SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Job Description
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* KEY RESPONSIBILITIES SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Key Responsibilities
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <ul className="space-y-2">
                  {responsibilities.length > 0 ? (
                    responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-orange-100 p-1 rounded-full mt-1">
                          <CheckCircle size={16} className="text-orange-600" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No specific responsibilities listed.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* REQUIREMENTS SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Requirements
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <ul className="space-y-2">
                  {requirements.length > 0 ? (
                    requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1 rounded-full mt-1">
                          <CheckCircle size={16} className="text-blue-600" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No specific requirements listed.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER SECTION - Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-sm font-semibold transition-all"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm font-semibold shadow-lg transition-all">
            Edit Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobViewModal;
