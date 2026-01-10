import React, { useEffect, useState } from "react";
import {
    Workflow,
    Save,
    GripVertical,
    Edit2,
    Trash2,
    Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const EditPipelineModal = ({
    isOpen,
    onClose,
    pipeline,
    onUpdate, // callback (API / state update)
}) => {
    const [pipelineName, setPipelineName] = useState("");
    const [status, setStatus] = useState("Active");
    const [stages, setStages] = useState([]);

    // Stage form
    const [stageName, setStageName] = useState("");
    const [stageDescription, setStageDescription] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [isStageModalOpen, setIsStageModalOpen] = useState(false);

    useEffect(() => {
        if (pipeline) {
            setPipelineName(pipeline.name || "");
            setStatus(pipeline.status || "Active");

            if (Array.isArray(pipeline.stages)) {
                setStages(pipeline.stages);
            } else {
                setStages([]); // fallback
            }
        }
    }, [pipeline]);

    const openAddStage = () => {
        setEditIndex(null);
        setStageName("");
        setStageDescription("");
        setIsStageModalOpen(true);
    };

    const openEditStage = (index) => {
        setEditIndex(index);
        setStageName(stages[index].name);
        setStageDescription(stages[index].description || "");
        setIsStageModalOpen(true);
    };

    const saveStage = () => {
        if (!stageName.trim()) {
            toast.error("Stage name is required");
            return;
        }

        if (editIndex !== null) {
            const updated = [...stages];
            updated[editIndex] = {
                ...updated[editIndex],
                name: stageName,
                description: stageDescription,
            };
            setStages(updated);
        } else {
            setStages([
                ...stages,
                { name: stageName, description: stageDescription },
            ]);
        }

        setIsStageModalOpen(false);
    };

    const deleteStage = (index) => {
        setStages(stages.filter((_, i) => i !== index));
    };

    const handleUpdate = () => {
        if (!pipelineName.trim()) {
            toast.error("Pipeline name is required");
            return;
        }

        const payload = {
            ...pipeline,
            name: pipelineName,
            status,
            stages,
        };

        onUpdate?.(payload);
        toast.success("Pipeline updated successfully");
        onClose();
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2"
            >
                <Save size={18} />
                Save Changes
            </button>
        </>
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Edit Pipeline"
                subtitle="Update pipeline details & stages"
                icon={<Workflow size={24} />}
                footer={footer}
            >
                <div className="space-y-6">
                    {/* Pipeline Name */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Pipeline Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={pipelineName}
                            onChange={(e) => setPipelineName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D]/20 outline-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Stages */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-semibold text-gray-700">
                                Pipeline Stages
                            </label>

                            <button
                                onClick={openAddStage}
                                className="flex items-center gap-1 text-sm font-semibold text-[#FF7B1D]"
                            >
                                <Plus size={16} />
                                Add Stage
                            </button>
                        </div>

                        <div className="space-y-3">
                            {stages.map((stage, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center border-2 border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 transition"
                                >
                                    <div className="flex gap-3">
                                        <GripVertical size={18} className="text-gray-400 mt-1" />
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

            {/* ADD / EDIT STAGE */}
            {isStageModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editIndex !== null ? "Edit Stage" : "Add Stage"}
                        </h3>

                        <div className="space-y-4">
                            <input
                                placeholder="Stage Name"
                                value={stageName}
                                onChange={(e) => setStageName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none"
                            />

                            <textarea
                                rows={3}
                                placeholder="Description"
                                value={stageDescription}
                                onChange={(e) => setStageDescription(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:border-[#FF7B1D] outline-none"
                            />
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

export default EditPipelineModal;
