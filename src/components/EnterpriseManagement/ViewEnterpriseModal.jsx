import React from "react";
import {
  Building2,
  Handshake,
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  User,
  Phone,
  Briefcase,
  FileText,
  MapPin,
  Clock,
} from "lucide-react";
import Modal from "../common/Modal";

const ViewEnterpriseModal = ({ isOpen, onClose, enterprise }) => {
  if (!enterprise) return null;

  const footer = (
    <button
      onClick={onClose}
      className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-sm"
    >
      Close
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={enterprise.businessName}
      subtitle={`Enterprise ID: ENT-${enterprise.id}`}
      icon={<Building2 size={26} />}
      footer={footer}
    >
      <div className="space-y-8 px-2">

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center shadow-sm">
            <div className="bg-orange-500 p-2 rounded-xl text-white inline-block mb-2 shadow-lg shadow-orange-500/20">
              <Handshake size={20} />
            </div>
            <div className="text-xl font-black text-gray-900 leading-none mb-1">{enterprise.plan}</div>
            <div className="text-[10px] font-black tracking-widest text-orange-600 uppercase">Current Plan</div>
          </div>

          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center shadow-sm">
            <div className="bg-green-600 p-2 rounded-xl text-white inline-block mb-2 shadow-lg shadow-green-500/20">
              {enterprise.status === "Active" ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>
            <div className="text-xl font-black text-gray-900 leading-none mb-1">{enterprise.status}</div>
            <div className="text-[10px] font-black tracking-widest text-green-600 uppercase">Account Status</div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailRow
            icon={<User size={18} className="text-orange-500" />}
            label="Contact Person"
            value={`${enterprise.firstName} ${enterprise.lastName}`}
          />
          <DetailRow
            icon={<Mail size={18} className="text-teal-500" />}
            label="Email Address"
            value={enterprise.email}
          />
          <DetailRow
            icon={<Phone size={18} className="text-blue-500" />}
            label="Mobile Number"
            value={enterprise.mobileNumber}
          />
          <DetailRow
            icon={<Briefcase size={18} className="text-indigo-500" />}
            label="Business Type"
            value={enterprise.businessType}
          />
          <DetailRow
            icon={<FileText size={18} className="text-pink-500" />}
            label="GST Number"
            value={enterprise.gst || 'N/A'}
          />
          <DetailRow
            icon={<MapPin size={18} className="text-red-500" />}
            label="Address"
            value={enterprise.address}
          />
          <DetailRow
            icon={<Calendar size={18} className="text-purple-500" />}
            label="Onboarding Date"
            value={enterprise.onboardingDate ? new Date(enterprise.onboardingDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
          />
          <DetailRow
            icon={<Clock size={18} className="text-gray-500" />}
            label="Registration Status"
            value="Enterprise Client"
          />
        </div>
      </div>
    </Modal>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="p-3 bg-gray-50 rounded-xl">
      {icon}
    </div>
    <div>
      <div className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-0.5">{label}</div>
      <div className="text-sm font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

export default ViewEnterpriseModal;
