import React from "react";
import {
  Building2,
  Users,
  Handshake,
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  User,
} from "lucide-react";
import Modal from "../common/Modal";

const ViewEnterpriseModal = ({ isOpen, onClose, enterprise }) => {
  if (!enterprise) return null;

  const footer = (
    <button
      onClick={onClose}
      className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
    >
      Close
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={enterprise.name}
      subtitle={enterprise.id}
      icon={<Building2 size={26} />}
      footer={footer}
    >
      <div className="space-y-8">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-2xl border text-center">
            <div className="bg-blue-600 p-2 rounded-xl text-white inline-block mb-2">
              <Users size={20} />
            </div>
            <div className="text-2xl font-bold">{enterprise.users}</div>
            <div className="text-xs font-semibold text-blue-600">USERS</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-2xl border text-center">
            <div className="bg-orange-500 p-2 rounded-xl text-white inline-block mb-2">
              <Handshake size={20} />
            </div>
            <div className="text-2xl font-bold">{enterprise.plan}</div>
            <div className="text-xs font-semibold text-orange-600">PLAN</div>
          </div>

          <div className="bg-green-50 p-4 rounded-2xl border text-center">
            <div className="bg-green-600 p-2 rounded-xl text-white inline-block mb-2">
              {enterprise.status === "Active" ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>
            <div className="text-xl font-bold">{enterprise.status}</div>
            <div className="text-xs font-semibold text-green-600">STATUS</div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          <DetailRow icon={<User size={16} />} label="Owner" value={enterprise.owner} />
          <DetailRow icon={<Mail size={16} />} label="Email" value={enterprise.email} />
          <DetailRow
            icon={<Calendar size={16} />}
            label="Onboarding Date"
            value={enterprise.onboardingDate}
          />
        </div>
      </div>
    </Modal>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
    <div className="text-gray-500">{icon}</div>
    <div>
      <div className="text-xs uppercase text-gray-400 font-bold">{label}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  </div>
);

export default ViewEnterpriseModal;
