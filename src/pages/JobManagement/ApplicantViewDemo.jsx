import React from "react";
import {
  User,
  X,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  GraduationCap,
  Award,
  FileText,
  Clock,
} from "lucide-react";

/**
 * ApplicantViewModal Component
 *
 * This component displays detailed information about a specific job applicant in a modal.
 *
 * Props:
 * - applicant: Object containing applicant details (name, email, phone, position, department,
 *   location, experience, education, appliedDate, status, resume, skills)
 * - onClose: Function to close the modal
 *
 * Usage:
 * <ApplicantViewModal
 *   applicant={selectedApplicant}
 *   onClose={() => setShowViewModal(false)}
 * />
 */

const ApplicantViewModal = ({ applicant, onClose }) => {
  // Don't render if no applicant is provided
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{applicant.name}</h2>
              <p className="text-sm opacity-90">
                Applied for {applicant.position}
              </p>
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
              <p className="text-lg font-bold text-gray-800">
                {applicant.location}
              </p>
            </div>

            {/* Experience Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-sm border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={18} className="text-green-600" />
                <span className="text-xs font-semibold text-green-600 uppercase">
                  Experience
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {applicant.experience}
              </p>
            </div>

            {/* Education Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-sm border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={18} className="text-orange-600" />
                <span className="text-xs font-semibold text-orange-600 uppercase">
                  Education
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {applicant.education}
              </p>
            </div>

            {/* Department Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-sm border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-1">
                <Award size={18} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 uppercase">
                  Department
                </span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {applicant.department}
              </p>
            </div>
          </div>

          {/* APPLICANT DETAILS SECTIONS */}
          <div className="space-y-6">
            {/* STATUS AND APPLIED DATE SECTION */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Application Status
                  </label>
                  <div className="flex items-center gap-2">
                    {applicant.status === "Shortlisted" ||
                    applicant.status === "Hired" ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : applicant.status === "Rejected" ? (
                      <XCircle size={20} className="text-red-600" />
                    ) : (
                      <Clock size={20} className="text-yellow-600" />
                    )}
                    <span
                      className={`px-4 py-2 text-sm font-semibold rounded-sm ${
                        applicant.status === "Shortlisted"
                          ? "bg-green-100 text-green-700"
                          : applicant.status === "Under Review"
                          ? "bg-yellow-100 text-yellow-700"
                          : applicant.status === "Hired"
                          ? "bg-blue-100 text-blue-700"
                          : applicant.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </div>
                </div>

                {/* Applied Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Applied Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-orange-600" />
                    <span className="text-gray-800 font-medium">
                      {applicant.appliedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT INFORMATION SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Contact Information
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Email
                      </p>
                      <p className="text-gray-800 font-medium">
                        {applicant.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Phone
                      </p>
                      <p className="text-gray-800 font-medium">
                        {applicant.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SKILLS SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Skills & Expertise
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <div className="flex flex-wrap gap-2">
                  {applicant.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-sm font-medium text-sm border border-orange-200"
                    >
                      {skill}
                    </span>
                  )) || (
                    <p className="text-gray-500 italic">No skills listed</p>
                  )}
                </div>
              </div>
            </div>

            {/* QUALIFICATIONS SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Qualifications Summary
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-100 p-1 rounded-full mt-1">
                      <CheckCircle size={16} className="text-orange-600" />
                    </div>
                    <span className="text-gray-700">
                      {applicant.experience} of professional experience in the
                      field
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-100 p-1 rounded-full mt-1">
                      <CheckCircle size={16} className="text-orange-600" />
                    </div>
                    <span className="text-gray-700">
                      {applicant.education} degree from accredited institution
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-100 p-1 rounded-full mt-1">
                      <CheckCircle size={16} className="text-orange-600" />
                    </div>
                    <span className="text-gray-700">
                      Strong expertise in {applicant.department} domain
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-100 p-1 rounded-full mt-1">
                      <CheckCircle size={16} className="text-orange-600" />
                    </div>
                    <span className="text-gray-700">
                      Currently based in {applicant.location}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RESUME SECTION */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Resume/CV
              </h3>
              <div className="bg-white border-2 border-gray-200 p-6 rounded-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {applicant.resume || `${applicant.name}_Resume.pdf`}
                      </p>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm font-semibold transition-all">
                    Download
                  </button>
                </div>
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
          <button className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-sm font-semibold shadow-lg transition-all">
            Reject
          </button>
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm font-semibold shadow-lg transition-all">
            Shortlist
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo component to show the modal in action
const ApplicantViewDemo = () => {
  const [showModal, setShowModal] = React.useState(true);

  const sampleApplicant = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    experience: "7+ Years",
    education: "Master's",
    appliedDate: "Dec 5, 2024",
    status: "Under Review",
    resume: "Sarah_Johnson_Resume.pdf",
    skills: [
      "React",
      "Node.js",
      "Python",
      "AWS",
      "TypeScript",
      "MongoDB",
      "Docker",
      "CI/CD",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Applicant View Modal Demo
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          View Applicant Details
        </button>

        {showModal && (
          <ApplicantViewModal
            applicant={sampleApplicant}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicantViewDemo;
