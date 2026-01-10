import React, { useEffect, useState } from "react";
import {
    Workflow,
    Save,
    GripVertical,
    Edit2,
    Trash2,
    Plus,
    Percent,
    Flag,
    X,
    Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useUpdatePipelineMutation } from "../../store/api/pipelineApi";
import { useGetStagesQuery } from "../../store/api/stageApi";

const EditPipelineModal = ({
    isOpen,
    onClose,
    pipeline,
    onUpdate, // callback (API / state update)
}) => {
    const [updatePipeline, { isLoading }] = useUpdatePipelineMutation();
    const { data: masterStages } = useGetStagesQuery();

    const [pipelineName, setPipelineName] = useState("");
    const [status, setStatus] = useState("Active");
    const [stages, setStages] = useState([]);

    // Stage form
    const [stageName, setStageName] = useState("");
    const [stageDescription, setStageDescription] = useState("");
    const [stageProbability, setStageProbability] = useState(0);
    const [stageIsFinal, setStageIsFinal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isStageModalOpen, setIsStageModalOpen] = useState(false);

    useEffect(() => {
        if (pipeline) {
            setPipelineName(pipeline.name || "");
            setStatus(pipeline.status || "Active");

            if (Array.isArray(pipeline.stages)) {
                // Ensure proper types
                setStages(pipeline.stages.map(s => ({
                    ...s,
                    probability: s.probability !== undefined ? s.probability : 0,
                    is_final: s.is_final === 1 || s.is_final === true
                })));
            } else {
                setStages([]); // fallback
            }
        }
    }, [pipeline]);

    const openAddStage = () => {
        setEditIndex(null);
        setStageName("");
        setStageDescription("");
        setStageProbability(0);
        setStageIsFinal(false);
        setIsStageModalOpen(true);
    };

    const openEditStage = (index) => {
        setEditIndex(index);
        setStageName(stages[index].name);
        setStageDescription(stages[index].description || "");
        setStageProbability(stages[index].probability || 0);
        setStageIsFinal(stages[index].is_final || false);
        setIsStageModalOpen(true);
    };

    const handleStageSelect = (e) => {
        const selectedName = e.target.value;
        setStageName(selectedName);

        // Auto-fill from master stage if found
        if (masterStages) {
            const master = masterStages.find(s => s.name === selectedName);
            if (master) {
                setStageProbability(master.probability);
                setStageDescription(master.description || "");
            }
        }
    };

    const saveStage = () => {
        if (!stageName.trim()) {
            toast.error("Stage name is required");
            return;
        }
        if (stageProbability < 0 || stageProbability > 100) return toast.error("Probability must be between 0 and 100");

        const newStage = {
            name: stageName,
            description: stageDescription,
            probability: parseInt(stageProbability),
            is_final: stageIsFinal,
        };

        if (editIndex !== null) {
            const updated = [...stages];
            // Preserve ID if editing existing stage
            updated[editIndex] = {
                ...updated[editIndex],
                ...newStage,
            };
            setStages(updated);
        } else {
            setStages([...stages, newStage]);
        }

        setIsStageModalOpen(false);
    };

    const deleteStage = (index) => {
        setStages(stages.filter((_, i) => i !== index));
    };

    const handleUpdate = async () => {
        if (!pipelineName.trim()) {
            toast.error("Pipeline name is required");
            return;
        }

        // Check if there is more than one final stage
        const finalStages = stages.filter(s => s.is_final);
        if (finalStages.length > 1) {
            return toast.error("There can be only one Final Stage per pipeline.");
        }

        const payload = {
            name: pipelineName,
            status,
            stages,
        };

        try {
            await updatePipeline({ id: pipeline.id, data: payload }).unwrap();
            toast.success("Pipeline updated successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update pipeline");
        }
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
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
            >
                <Save size={18} />
                {isLoading ? "Saving..." : "Save Changes"}
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none transition-all"
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
                                className="flex items-center gap-1 text-sm font-semibold text-[#FF7B1D] hover:underline"
                            >
                                <Plus size={16} />
                                Add Stage
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {stages.map((stage, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center border-2 border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 transition-all"
                                >
                                    <div className="flex gap-3 items-start">
                                        <GripVertical size={18} className="text-gray-400 mt-1 cursor-move" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-800">
                                                    {stage.name}
                                                </p>
                                                {stage.is_final && (
                                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">
                                                        Final
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Percent size={12} /> {stage.probability}%
                                                </span>
                                                {stage.description && (
                                                    <span className="truncate max-w-[200px]" title={stage.description}>
                                                        - {stage.description}
                                                    </span>
                                                )}
                                            </div>
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
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
                        <button
                            onClick={() => setIsStageModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={22} />
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-gray-800">
                            {editIndex !== null ? "Edit Stage" : "Add Stage"}
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                    Select Stage <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={stageName}
                                        onChange={handleStageSelect}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D]/20 outline-none transition-all appearance-none"
                                    >
                                        <option value="">-- Select a Stage --</option>
                                        {masterStages && masterStages.map((ms) => (
                                            <option key={ms.id} value={ms.name}>
                                                {ms.name} ({ms.probability}%)
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Layers size={16} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Manual Override Inputs */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">customize for this pipeline</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                            Probability (%) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={stageProbability}
                                                onChange={(e) => setStageProbability(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-[#FF7B1D] focus:outline-none"
                                            />
                                            <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-md transition-colors">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={stageIsFinal}
                                                onChange={(e) => setStageIsFinal(e.target.checked)}
                                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            Mark as Final Stage?
                                        </div>
                                    </label>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                        Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={stageDescription}
                                        onChange={(e) => setStageDescription(e.target.value)}
                                        placeholder="Describe this stage..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:border-[#FF7B1D] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsStageModalOpen(false)}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveStage}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-md transition-all"
                            >
                                {editIndex !== null ? "Update Stage" : "Add Stage"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditPipelineModal;
