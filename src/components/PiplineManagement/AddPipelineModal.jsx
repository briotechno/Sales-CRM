import React, { useState } from "react";
import { X, GripVertical, Edit2, Trash2 } from "lucide-react";

export default function AddPipelineModal({ isOpen, onClose }) {
  const [pipelineName, setPipelineName] = useState("");

  const [stages, setStages] = useState([
    { name: "Inpipeline", description: "" },
    { name: "Follow Up", description: "" },
    { name: "Schedule Service", description: "" },
  ]);

  // Popup States
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [isEditStageOpen, setIsEditStageOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Stage Form Fields
  const [stageName, setStageName] = useState("");
  const [stageDescription, setStageDescription] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  if (!isOpen) return null;

  /***********************
   ADD STAGE
  ************************/
  const handleAddStage = () => {
    if (!stageName.trim()) return;

    setStages([...stages, { name: stageName, description: stageDescription }]);
    setStageName("");
    setStageDescription("");
    setIsAddStageOpen(false);
  };

  /***********************
   EDIT STAGE
  ************************/
  const openEditStage = (index) => {
    setEditIndex(index);
    setStageName(stages[index].name);
    setStageDescription(stages[index].description);
    setIsEditStageOpen(true);
  };

  const handleUpdateStage = () => {
    let updated = [...stages];
    updated[editIndex] = { name: stageName, description: stageDescription };
    setStages(updated);

    setIsEditStageOpen(false);
    setStageName("");
    setStageDescription("");
  };

  /***********************
   DELETE STAGE
  ************************/
  const handleDeleteStage = () => {
    let updated = stages.filter((_, i) => i !== deleteIndex);
    setStages(updated);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      {/* MAIN PIPELINE POPUP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-md w-full max-w-3xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X size={22} className="text-gray-500" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Add New Pipeline
          </h2>

          {/* Pipeline Name */}
          <label className="font-medium">Pipeline Name *</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1 mb-5"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            placeholder="Enter Pipeline Name"
          />

          {/* Stage Header */}
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">Pipeline Stages *</label>

            <button
              className="text-orange-500 font-medium"
              onClick={() => setIsAddStageOpen(true)}
            >
              + Add New
            </button>
          </div>

          {/* Stages List */}
          <div className="space-y-3 mb-6">
            {stages.map((stage, i) => (
              <div
                key={i}
                className="flex justify-between border rounded-md px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={18} className="text-gray-500" />
                  <div>
                    <p className="font-medium">{stage.name}</p>
                    {stage.description && (
                      <p className="text-sm text-gray-500">
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Edit2
                    size={18}
                    className="cursor-pointer text-gray-600"
                    onClick={() => openEditStage(i)}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-500"
                    onClick={() => {
                      setDeleteIndex(i);
                      setIsDeleteConfirmOpen(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              className="px-5 py-2 bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="px-5 py-2 bg-[#FF7B1D] text-white rounded-md">
              Add Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT STAGE POPUP — SAME UI */}
      {(isAddStageOpen || isEditStageOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-md shadow-md w-full max-w-lg p-6 relative">
            <button
              onClick={() => {
                setIsAddStageOpen(false);
                setIsEditStageOpen(false);
              }}
              className="absolute top-4 right-4"
            >
              <X size={22} className="text-gray-500" />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {isEditStageOpen ? "Edit Stage" : "Add Stage"}
            </h3>

            <label className="font-medium">Stage Name *</label>
            <input
              className="w-full border rounded-md px-3 py-2 mt-1 mb-4"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="Stage Name"
            />

            <label className="font-medium">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 mt-1 mb-6"
              rows={3}
              value={stageDescription}
              onChange={(e) => setStageDescription(e.target.value)}
              placeholder="Description"
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-gray-100 rounded-md"
                onClick={() => {
                  setIsAddStageOpen(false);
                  setIsEditStageOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                className="px-5 py-2 bg-[#FF7B1D] text-white rounded-md"
                onClick={isEditStageOpen ? handleUpdateStage : handleAddStage}
              >
                {isEditStageOpen ? "Update Stage" : "Save Stage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM POPUP */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this stage?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-gray-100 rounded-md"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-5 py-2 bg-red-500 text-white rounded-md"
                onClick={handleDeleteStage}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
