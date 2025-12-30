import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loader2,
  ArrowLeft,
  Shield,
  Heart,
  Globe
} from "lucide-react";
import { useGetEmployeeByIdQuery } from "../../../store/api/employeeApi";

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value || 'N/A'}</p>
  </div>
);

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetEmployeeByIdQuery(id);
  const employee = response?.data;

  const [expandedSections, setExpandedSections] = useState({
    about: true,
    bank: true,
    family: false,
    education: true,
    experience: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold text-gray-800">Employee not found</p>
          <button
            onClick={() => navigate('/hrm/employee/all')}
            className="px-6 py-2 bg-orange-500 text-white rounded-sm font-bold flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Employees
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen   ml-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 rounded-sm shadow-lg">
              <div className="bg-white  overflow-hidden">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                      {employee.profile_picture_url ? (
                        <img
                          src={employee.profile_picture_url}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl">
                          {employee.employee_name?.substring(0, 1)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-6 px-6 text-center border-b">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 uppercase">
                    {employee.employee_name}
                    {employee.status === 'Active' && (
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </h2>
                  <p className="text-orange-600 font-bold mt-1 uppercase tracking-wider">
                    {employee.designation_name}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    {employee.department_name}
                  </p>
                </div>

                {/* Quick Info */}
                <div className="px-6 py-4 space-y-3 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Employee ID
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.employee_id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Department
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.department_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date Of Join
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <User className="w-4 h-4" /> Employee Type
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.employee_type}
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
                    <span className="font-bold text-slate-800">
                      {employee.mobile_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> Email
                    </span>
                    <span className="font-bold text-blue-600">
                      {employee.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Gender
                    </span>
                    <span className="font-bold text-slate-800">{employee.gender}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> Birthday
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> Address
                    </span>
                    <span className="font-bold text-slate-800 text-right max-w-[150px]">
                      {employee.permanent_address}
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
                      <Shield className="w-4 h-4 text-slate-400" /> Aadhar No
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.aadhar_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" /> PAN No
                    </span>
                    <span className="font-bold text-slate-800">
                      {employee.pan_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" /> Work Type
                    </span>
                    <span className="font-bold text-slate-800">{employee.work_type}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-slate-400" /> Marital status
                    </span>
                    <span className="font-bold text-slate-800">{employee.marital_status}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" /> Blood Group
                    </span>
                    <span className="font-bold text-slate-800">{employee.blood_group}</span>
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
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Contact Person</span>
                      <span className="text-sm font-bold text-slate-800 uppercase">
                        {employee.emergency_contact_person}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Emergency No</span>
                      <span className="text-sm font-bold text-orange-600">
                        {employee.emergency_contact_number}
                      </span>
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
                      className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.about ? "rotate-180" : ""
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
              <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                  onClick={() => toggleSection("bank")}
                >
                  <h3 className="font-bold text-slate-800 text-lg">
                    Bank Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.bank ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </div>
                {expandedSections.bank && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30">
                    <DetailItem label="Account Holder" value={employee.account_holder_name} />
                    <DetailItem label="Account Number" value={employee.account_number} />
                    <DetailItem label="IFSC Code" value={employee.ifsc_code} />
                    <DetailItem label="Branch Name" value={employee.branch_name} />
                  </div>
                )}
              </div>

              {/* Family Information */}
              <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                  onClick={() => toggleSection("family")}
                >
                  <h3 className="font-bold text-slate-800 text-lg">
                    Identity Documents
                  </h3>
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.family ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </div>
                {expandedSections.family && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/30">
                    <div className="space-y-2 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aadhar Front</p>
                      <div className="h-40 bg-white border border-gray-200 rounded-sm overflow-hidden p-2">
                        {employee.aadhar_front_url ? <img src={employee.aadhar_front_url} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Image</div>}
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aadhar Back</p>
                      <div className="h-40 bg-white border border-gray-200 rounded-sm overflow-hidden p-2">
                        {employee.aadhar_back_url ? <img src={employee.aadhar_back_url} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Image</div>}
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">PAN Card</p>
                      <div className="h-40 bg-white border border-gray-200 rounded-sm overflow-hidden p-2">
                        {employee.pan_card_url ? <img src={employee.pan_card_url} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Image</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Education and Experience in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education Details */}
                <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                    onClick={() => toggleSection("education")}
                  >
                    <h3 className="font-bold text-slate-800 text-lg">
                      Education Details
                    </h3>
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.education ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                  {expandedSections.education && (
                    <div className="p-6 bg-slate-50/30">
                      <p className="text-gray-400 italic text-sm">No education details available.</p>
                    </div>
                  )}
                </div>

                {/* Experience Header */}
                <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                    onClick={() => toggleSection("experience")}
                  >
                    <h3 className="font-bold text-slate-800 text-lg">
                      Experience
                    </h3>
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.experience ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                  {expandedSections.experience && (
                    <div className="p-6 bg-slate-50/30">
                      <p className="text-gray-400 italic text-sm">No experience details available.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience & Projects - Full Width */}
              {expandedSections.experience && (
                <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                  <div className="px-6 pt-6 pb-3">
                    <div className="flex gap-6 border-b border-gray-100">
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
                      <p className="col-span-full text-gray-400 italic text-sm py-4">No projects assigned yet.</p>
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
