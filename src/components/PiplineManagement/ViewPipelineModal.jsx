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
      className="px-6 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
    >
      Close Details
    </button>
  );

  const icon = (
    <div className="bg-orange-50 text-orange-600 p-2 rounded-sm border border-orange-100">
      <Activity size={20} />
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
      <div className="space-y-6 text-gray-800">

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
            icon={<CheckedIcon status={pipeline.status} />}
            value={pipeline.status}
            label="Status"
            color={pipeline.status === "Active" ? "green" : "red"}
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
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
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 capitalize">
            <Layers size={16} className="text-[#FF7B1D]" />
            Pipeline Stages
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {stages.length > 0 ? (
              stages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-sm hover:border-orange-300 transition-all bg-white hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center bg-orange-50 text-orange-600 font-bold rounded-sm border border-orange-100 text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm flex items-center gap-2 capitalize">
                        {stage.name}
                        {(stage.is_final === 1 || stage.is_final === true) && (
                          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-sm border border-green-100 font-bold capitalize flex items-center gap-1">
                            <Flag size={10} /> Final
                          </span>
                        )}
                      </p>
                      {stage.description && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5" title={stage.description}>
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-sm border border-gray-200">
                    <Percent size={12} className="text-gray-400" />
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
const StatCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    green: "bg-green-50 border-green-100 text-green-600",
    red: "bg-red-50 border-red-100 text-red-600",
  };

  const currentClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`border p-4 rounded-sm flex flex-col items-center justify-center gap-1 ${currentClass}`}>
      <div className="bg-white p-1.5 rounded-full shadow-sm mb-1">
        {icon}
      </div>
      <span className="text-lg font-bold text-gray-800">{value}</span>
      <span className="text-xs font-medium text-gray-500 capitalize">
        {label}
      </span>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white p-3 rounded-sm border border-gray-100 hover:border-gray-200 transition-colors">
    <div className="text-[#FF7B1D] bg-orange-50 p-1.5 rounded-sm border border-orange-100">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 capitalize mb-0.5">
        {label}
      </p>
      <p className="font-semibold text-sm text-gray-800 capitalize">{value}</p>
    </div>
  </div>
);

const CheckedIcon = ({ status }) => (
  status === "Active" ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />
);
