import React, { useState } from "react";
import {
  X,
  GripVertical,
  Edit2,
  Trash2,
  Workflow,
  Layers,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AddPipelineModal = ({ isOpen, onClose }) => {
  const [pipelineName, setPipelineName] = useState("");
  const [stages, setStages] = useState([
    { name: "Inpipeline", description: "" },
    { name: "Follow Up", description: "" },
    { name: "Schedule Service", description: "" },
  ]);

  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [stageName, setStageName] = useState("");
  const [stageDescription, setStageDescription] = useState("");

  const openAddStage = () => {
    setEditIndex(null);
    setStageName("");
    setStageDescription("");
    setIsStageModalOpen(true);
  };

  const openEditStage = (index) => {
    setEditIndex(index);
    setStageName(stages[index].name);
    setStageDescription(stages[index].description);
    setIsStageModalOpen(true);
  };

  const saveStage = () => {
    if (!stageName.trim()) return toast.error("Stage name is required");

    if (editIndex !== null) {
      const updated = [...stages];
      updated[editIndex] = { name: stageName, description: stageDescription };
      setStages(updated);
    } else {
      setStages([...stages, { name: stageName, description: stageDescription }]);
    }

    setIsStageModalOpen(false);
  };

  const deleteStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleAddPipeline = () => {
    if (!pipelineName.trim())
      return toast.error("Pipeline name is required");

    if (!stages.length)
      return toast.error("At least one stage is required");

    toast.success("Pipeline added successfully");
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>
      <button
        onClick={handleAddPipeline}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transition-all"
      >
        Add Pipeline
      </button>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add Pipeline"
        subtitle="Create pipeline stages for better lead flow"
        icon={<Workflow size={24} />}
        footer={footer}
      >
        <div className="space-y-6">
          {/* Pipeline Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Layers size={16} className="text-[#FF7B1D]" />
              Pipeline Name <span className="text-red-500">*</span>
            </label>
            <input
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="e.g. Sales Pipeline"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D]/20 outline-none transition-all"
            />
          </div>

          {/* Stages */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText size={16} className="text-[#FF7B1D]" />
                Pipeline Stages
              </label>

              <button
                onClick={openAddStage}
                className="text-sm font-semibold text-[#FF7B1D] hover:underline"
              >
                + Add Stage
              </button>
            </div>

            <div className="space-y-3">
              {stages.map((stage, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-2 border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 transition-all"
                >
                  <div className="flex gap-3">
                    <GripVertical
                      size={18}
                      className="text-gray-400 mt-1"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {stage.name}
                      </p>
                      {stage.description && (
                        <p className="text-sm text-gray-500">
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Edit2
                      size={18}
                      className="text-gray-600 cursor-pointer hover:text-orange-500"
                      onClick={() => openEditStage(i)}
                    />
                    <Trash2
                      size={18}
                      className="text-red-500 cursor-pointer"
                      onClick={() => deleteStage(i)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* ADD / EDIT STAGE MODAL */}
      {isStageModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsStageModalOpen(false)}
              className="absolute top-4 right-4"
            >
              <X size={22} className="text-gray-500" />
            </button>

            <h3 className="text-lg font-semibold mb-5">
              {editIndex !== null ? "Edit Stage" : "Add Stage"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Stage Name *
                </label>
                <input
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D]/20 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={stageDescription}
                  onChange={(e) => setStageDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D]/20 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsStageModalOpen(false)}
                className="px-5 py-2 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveStage}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md"
              >
                Save Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPipelineModal;
