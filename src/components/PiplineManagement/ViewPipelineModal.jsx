import {
  Activity,
  DollarSign,
  Handshake,
  Calendar,
  CheckCircle,
  XCircle,
  Layers,
  Percent,
  Flag,
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

  const stages = Array.isArray(pipeline.stages) ? pipeline.stages : [];

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
            value={stages.length}
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
            value={`₹ ${Number(pipeline.totalDealValue || 0).toLocaleString()}`}
          />
          <DetailRow
            icon={<Calendar size={16} />}
            label="Created Date"
            value={pipeline.createdDate}
          />
        </div>

        {/* Stages List */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Layers size={20} className="text-[#FF7B1D]" />
            Pipeline Stages
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {stages.length > 0 ? (
              stages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-all bg-gray-50 hover:bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded-full text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        {stage.name}
                        {(stage.is_final === 1 || stage.is_final === true) && (
                          <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                            <Flag size={10} /> Final
                          </span>
                        )}
                      </p>
                      {stage.description && (
                        <p className="text-sm text-gray-500 line-clamp-1" title={stage.description}>
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-lg border">
                    <Percent size={14} className="text-gray-400" />
                    {stage.probability}%
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">No stages found.</p>
            )}
          </div>
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
