import {
  Activity,
  DollarSign,
  Handshake,
  Calendar,
  CheckCircle,
  XCircle,
  Layers,
} from "lucide-react";
import Modal from "../common/Modal";

const ViewPipelineModal = ({ isOpen, onClose, pipeline }) => {
  if (!pipeline) return null;

  const footer = (
    <button
      onClick={onClose}
      className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
    >
      Close Details
    </button>
  );

  const icon = (
    <div className="bg-orange-500 text-white p-3 rounded-xl">
      <Activity size={24} />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pipeline.name}
      subtitle={`Pipeline ID : ${pipeline.id}`}
      icon={icon}
      footer={footer}
    >
      <div className="space-y-8 bg-white text-black">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            icon={<Layers size={20} />}
            value={pipeline.stages}
            label="Stages"
            color="blue"
          />
          <StatCard
            icon={<Handshake size={20} />}
            value={pipeline.noOfDeals}
            label="Deals"
            color="orange"
          />
          <StatCard
            icon={
              pipeline.status === "Active"
                ? <CheckCircle size={20} />
                : <XCircle size={20} />
            }
            value={pipeline.status}
            label="Status"
            color={pipeline.status === "Active" ? "green" : "red"}
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <DetailRow
            icon={<DollarSign size={16} />}
            label="Total Deal Value"
            value={`₹ ${pipeline.totalDealValue.toLocaleString()}`}
          />
          <DetailRow
            icon={<Calendar size={16} />}
            label="Created Date"
            value={pipeline.createdDate}
          />
          <DetailRow
            icon={<Activity size={16} />}
            label="Current Stage"
            value={pipeline.stageLabel}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewPipelineModal;

/* 🔹 Small reusable components */
const StatCard = ({ icon, value, label, color }) => (
  <div className={`bg-${color}-50 border border-${color}-100 p-4 rounded-2xl flex flex-col items-center`}>
    <div className={`bg-${color}-600 text-white p-2 rounded-xl mb-2`}>
      {icon}
    </div>
    <span className="text-2xl font-bold">{value}</span>
    <span className={`text-xs font-semibold uppercase tracking-widest text-${color}-600`}>
      {label}
    </span>
  </div>
);

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
    <div className="text-orange-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);
