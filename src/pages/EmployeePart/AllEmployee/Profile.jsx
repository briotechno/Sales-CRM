import React, { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  GraduationCap,
  Briefcase,
  ChevronDown,
  Edit,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export default function EmployeeProfile() {
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    bank: false,
    family: false,
    education: true,
    experience: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen   ml-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-lg overflow-hidden">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stephan"
                        alt="Profile"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-6 px-6 text-center border-b">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    Stephan Peralt
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </span>
                  </h2>
                  <p className="text-orange-600 font-medium mt-1">
                    Software Developer
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    10+ years of Experience
                  </p>
                </div>

                {/* Quick Info */}
                <div className="px-6 py-4 space-y-3 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Client ID
                    </span>
                    <span className="font-semibold text-slate-800">
                      CLT-0024
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Team
                    </span>
                    <span className="font-semibold text-slate-800">
                      UI/UX Design
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date Of Join
                    </span>
                    <span className="font-semibold text-slate-800">
                      1st Jan 2023
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <User className="w-4 h-4" /> Report Office
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Doglas"
                        alt="Manager"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-semibold text-slate-800">
                        Doglas Martini
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 grid grid-cols-2 gap-3">
                  <button className="bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Edit className="w-4 h-4" /> Edit Info
                  </button>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                </div>

                {/* Basic Information */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">
                      Basic Information
                    </h3>
                    <Edit className="w-4 h-4 text-slate-400 cursor-pointer hover:text-orange-500" />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" /> Phone
                      </span>
                      <span className="font-medium text-slate-800">
                        (163) 2459 315
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" /> Email
                      </span>
                      <span className="font-medium text-blue-600 flex items-center gap-2">
                        peralt12@example.com
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 2a1 1 0 000 2h2.586l-7.293 7.293a1 1 0 101.414 1.414L12 5.414V8a1 1 0 102 0V2H8z" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> Gender
                      </span>
                      <span className="font-medium text-slate-800">Male</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" /> Birthday
                      </span>
                      <span className="font-medium text-slate-800">
                        24th July 2000
                      </span>
                    </div>
                    <div className="flex items-start justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" /> Address
                      </span>
                      <span className="font-medium text-slate-800 text-right">
                        1861 Bayonne Ave,
                        <br />
                        Manchester, NJ, 08759
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="px-6 pb-6 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">
                      Personal Information
                    </h3>
                    <Edit className="w-4 h-4 text-slate-400 cursor-pointer hover:text-orange-500" />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />{" "}
                        Passport No
                      </span>
                      <span className="font-medium text-slate-800">
                        QRET4566FGRT
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" /> Passport
                        Exp Date
                      </span>
                      <span className="font-medium text-slate-800">
                        15 May 2029
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />{" "}
                        Nationality
                      </span>
                      <span className="font-medium text-slate-800">Indian</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>{" "}
                        Religion
                      </span>
                      <span className="font-medium text-slate-800">
                        Christianity
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>{" "}
                        Marital status
                      </span>
                      <span className="font-medium text-slate-800">Yes</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>{" "}
                        Employment of spouse
                      </span>
                      <span className="font-medium text-slate-800">No</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" /> No. of
                        children
                      </span>
                      <span className="font-medium text-slate-800">2</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="px-6 pb-6 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">
                      Emergency Contact Number
                    </h3>
                    <Edit className="w-4 h-4 text-slate-400 cursor-pointer hover:text-orange-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Primary</span>
                        <span className="text-sm font-semibold text-slate-800">
                          +1 127 2685 598
                        </span>
                      </div>
                      <div className="text-sm text-slate-700">
                        <span className="font-medium">Adrian Peralt</span>
                        <span className="text-slate-400 mx-2">•</span>
                        <span className="text-slate-500">Father</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">
                          Secondary
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          +1 089 7774 787
                        </span>
                      </div>
                      <div className="text-sm text-slate-700">
                        <span className="font-medium">Karen Wills</span>
                        <span className="text-slate-400 mx-2">•</span>
                        <span className="text-slate-500">Mother</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Employee */}
              <div className="bg-white rounded-sm shadow overflow-hidden">
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
                  onClick={() => toggleSection("about")}
                >
                  <h3 className="font-bold text-slate-800 text-lg">
                    About Employee
                  </h3>
                  <div className="flex items-center gap-3">
                    <Edit className="w-4 h-4 text-slate-400 hover:text-orange-500" />
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedSections.about ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {expandedSections.about && (
                  <div className="px-6 py-5 text-slate-600 leading-relaxed bg-slate-0">
                    As an award winning designer, I deliver exceptional quality
                    work and bring value to your brand! With 10 years of
                    experience and 350+ projects completed worldwide with
                    satisfied customers, I developed the 360° brand approach,
                    which helped me to create numerous brands that are relevant,
                    meaningful and loved.
                  </div>
                )}
              </div>

              {/* Bank Information */}
              <div className="bg-white rounded-sm shadow overflow-hidden">
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
                  onClick={() => toggleSection("bank")}
                >
                  <h3 className="font-bold text-slate-800 text-lg">
                    Bank Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <Edit className="w-4 h-4 text-slate-400 hover:text-orange-500" />
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedSections.bank ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="bg-white rounded-sm shadow overflow-hidden">
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
                  onClick={() => toggleSection("family")}
                >
                  <h3 className="font-bold text-slate-800 text-lg">
                    Family Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <Edit className="w-4 h-4 text-slate-400 hover:text-orange-500" />
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedSections.family ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Education and Experience in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education Details */}
                <div className="bg-white rounded-sm shadow overflow-hidden">
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
                    onClick={() => toggleSection("education")}
                  >
                    <h3 className="font-bold text-slate-800 text-lg">
                      Education Details
                    </h3>
                    <div className="flex items-center gap-3">
                      <Edit className="w-4 h-4 text-slate-400 hover:text-orange-500" />
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedSections.education ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Experience Header */}
                <div className="bg-white rounded-sm shadow overflow-hidden">
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
                    onClick={() => toggleSection("experience")}
                  >
                    <h3 className="font-bold text-slate-800 text-lg">
                      Experience
                    </h3>
                    <div className="flex items-center gap-3">
                      <Edit className="w-4 h-4 text-slate-400 hover:text-orange-500" />
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedSections.experience ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience & Projects - Full Width */}
              {expandedSections.experience && (
                <div className="bg-white rounded-sm shadow overflow-hidden">
                  <div className="px-6 pt-6 pb-3">
                    <div className="flex gap-6 border-b">
                      <button className="pb-3 text-orange-500 border-b-2 border-orange-500 font-semibold text-sm">
                        Projects
                      </button>
                      <button className="pb-3 text-slate-500 hover:text-slate-700 text-sm">
                        Assets
                      </button>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Project 1 */}
                      <div className="border border-slate-200 rounded-sm p-5 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 mb-1">
                              World Health
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>8 tasks</span>
                              <span>•</span>
                              <span className="text-slate-700">
                                15 Completed
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              Deadline
                            </p>
                            <p className="font-medium text-slate-800 text-sm">
                              31 July 2025
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              Project Lead
                            </p>
                            <div className="flex items-center gap-2">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Leona"
                                alt="Leona"
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="font-medium text-slate-800 text-sm">
                                Leona
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project 2 */}
                      <div className="border border-slate-200 rounded-sm p-5 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 mb-1">
                              Hospital Administration
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>8 tasks</span>
                              <span>•</span>
                              <span className="text-slate-700">
                                15 Completed
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              Deadline
                            </p>
                            <p className="font-medium text-slate-800 text-sm">
                              31 July 2025
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              Project Lead
                            </p>
                            <div className="flex items-center gap-2">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Leona"
                                alt="Leona"
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="font-medium text-slate-800 text-sm">
                                Leona
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
