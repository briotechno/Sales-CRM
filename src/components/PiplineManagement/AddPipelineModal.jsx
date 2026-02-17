import React, { useState, useRef } from "react";
import {
  X,
  GripVertical,
  Edit2,
  Trash2,
  Workflow,
  Layers,
  FileText,
  Percent,
  Plus,
  Save,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useCreatePipelineMutation, useUpdatePipelineMutation } from "../../store/api/pipelineApi";
import { useGetCatalogsQuery } from "../../store/api/catalogApi";
import { useGetStagesQuery } from "../../store/api/stageApi";

const AddPipelineModal = ({ isOpen, onClose, pipelineToEdit }) => {
  const [createPipeline, { isLoading: isCreating }] = useCreatePipelineMutation();
  const [updatePipeline, { isLoading: isUpdating }] = useUpdatePipelineMutation();
  const { data: stagesResponse, isLoading: isLoadingStages } = useGetStagesQuery({ limit: 1000 }); // Fetch all master stages
  const masterStages = stagesResponse?.stages || [];
  const { data: catalogsData } = useGetCatalogsQuery({ limit: 1000, status: 'Active' }); // Fetch all active catalogs

  const [pipelineName, setPipelineName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [stages, setStages] = useState([]);

  React.useEffect(() => {
    if (pipelineToEdit && isOpen) {
      setPipelineName(pipelineToEdit.name || "");
      setSelectedService(pipelineToEdit.catalog_id || "");
      // Ensure stages is an array and properly formatted
      const loadedStages = Array.isArray(pipelineToEdit.stages) ? pipelineToEdit.stages : [];
      // If stages don't have is_final property, we might need to default it, but backend should send it.
      // We also need to make sure we don't break strict mode if we mutate.
      const formattedStages = loadedStages.map(s => ({
        ...s,
        probability: s.probability || 0,
        is_final: Boolean(s.is_final)
      }));
      setStages(formattedStages);
    } else if (isOpen) {
      // Reset logic for Add mode
      setPipelineName("");
      setSelectedService("");
      setStages([]);
    }
  }, [pipelineToEdit, isOpen]);



  const [editIndex, setEditIndex] = useState(null);
  const [stageName, setStageName] = useState("");
  const [stageDescription, setStageDescription] = useState("");
  const [stageProbability, setStageProbability] = useState(0);
  const [stageIsFinal, setStageIsFinal] = useState(false);

  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Drag Refs
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const resetStageForm = () => {
    setEditIndex(null);
    setStageName("");
    setStageDescription("");
    setStageProbability(0);
    setStageIsFinal(false);
    setIsStageDropdownOpen(false);
  };

  const openEditStage = (index) => {
    setEditIndex(index);
    setStageName(stages[index].name);
    setStageDescription(stages[index].description || "");
    setStageProbability(stages[index].probability || 0);
    setStageIsFinal(stages[index].is_final || false);
  };

  const handleStageSelect = (selectedName) => {
    setStageName(selectedName);
    setIsStageDropdownOpen(false);

    // Auto-fill from master stage if found
    if (masterStages) {
      const master = masterStages.find((s) => s.name === selectedName);
      if (master) {
        setStageProbability(master.probability);
        setStageDescription(master.description || "");
      }
    }
  };



  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveStage = () => {
    if (!stageName.trim()) return toast.error("Stage name is required");
    if (stageProbability < 0 || stageProbability > 100)
      return toast.error("Probability must be between 0 and 100");

    const newStage = {
      name: stageName,
      description: stageDescription,
      probability: parseInt(stageProbability),
      is_final: stageIsFinal,
    };

    if (editIndex !== null) {
      const updated = [...stages];
      updated[editIndex] = newStage;
      setStages(updated);
      toast.success("Stage updated in list");
    } else {
      setStages([...stages, newStage]);
      toast.success("Stage added to list");
    }

    resetStageForm();
  };

  const deleteStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
    if (editIndex === index) {
      resetStageForm();
    }
  };

  // Drag Handlers
  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = (e) => {
    const copyListItems = [...stages];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setStages(copyListItems);
  };

  const handleSavePipeline = async () => {
    if (!pipelineName.trim()) return toast.error("Pipeline name is required");

    if (!stages.length) return toast.error("At least one stage is required");

    // Check if there is more than one final stage
    const finalStages = stages.filter((s) => s.is_final);
    if (finalStages.length > 1) {
      return toast.error("There can be only one Final Stage per pipeline.");
    }

    try {
      if (pipelineToEdit) {
        await updatePipeline({
          id: pipelineToEdit.id,
          data: {
            name: pipelineName,
            status: pipelineToEdit.status || "Active",
            description: pipelineToEdit.description, // Preserve description if not editable
            catalog_id: selectedService || null,
            stages: stages,
          }
        }).unwrap();
        toast.success("Pipeline updated successfully");
      } else {
        await createPipeline({
          name: pipelineName,
          status: "Active",
          catalog_id: selectedService || null, // Optional service/catalog association
          stages: stages,
        }).unwrap();
        toast.success("Pipeline added successfully");
      }
      setPipelineName("");
      setSelectedService("");
      setStages([]);
      resetStageForm();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || (pipelineToEdit ? "Failed to update pipeline" : "Failed to create pipeline"));
    }
  };

  const isLoading = isCreating || isUpdating;

  const footer = (
    <div className="flex gap-3 w-full justify-end">
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all font-primary text-xs uppercase tracking-widest"
      >
        Cancel
      </button>
      <button
        onClick={handleSavePipeline}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-md transition-all disabled:opacity-50 font-primary text-xs uppercase tracking-widest flex items-center gap-2"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Workflow size={18} />
        )}
        {isLoading ? (pipelineToEdit ? "Updating..." : "Creating...") : (pipelineToEdit ? "Update Pipeline" : "Create Pipeline")}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pipelineToEdit ? "Edit Pipeline" : "Add New Pipeline"}
      subtitle={pipelineToEdit ? "Manage your pipeline stages" : "Define your pipeline and its stages"}
      icon={<Workflow size={24} />}
      footer={footer}
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Pipeline Info & Inline Add Stage Form */}
        <div className="space-y-6">
          {/* Pipeline Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize tracking-normal">
              <Layers size={16} className="text-[#FF7B1D]" />
              Pipeline Name <span className="text-red-500">*</span>
            </label>
            <input
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="e.g. Sales Pipeline"
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold"
            />
          </div>

          {/* Services (Catalogs) Select - Optional */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 capitalize tracking-normal">
              <Layers size={16} className="text-[#FF7B1D]" />
              Service (Optional)
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-semibold text-gray-700 bg-white cursor-pointer hover:border-gray-300"
            >
              <option value="" className="text-gray-400">Select a Service</option>
              {catalogsData?.catalogs?.length > 0 && catalogsData.catalogs.map((catalog) => {
                const displayName = catalog.service_name || catalog.name || "Unnamed Service";
                const truncatedName = displayName.length > 35 ? displayName.substring(0, 35) + "..." : displayName;
                return (
                  <option key={catalog.id} value={catalog.id} className="text-gray-700">
                    {truncatedName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-orange-50/50 p-5 rounded-sm border border-orange-100 space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 pb-2 mb-2">
              <h4 className="text-sm font-bold text-gray-800 capitalize flex items-center gap-2">
                {editIndex !== null ? (
                  <>
                    <Edit2 size={14} /> Edit Stage
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add New Stage
                  </>
                )}
              </h4>
              {editIndex !== null && (
                <button
                  onClick={resetStageForm}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 capitalize"
                >
                  <RotateCcw size={14} /> Cancel Edit
                </button>
              )}
            </div>

            {/* Stage Name Select/Input */}
            {/* Stage Name Select/Input */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 capitalize tracking-normal">
                <Workflow size={14} className="text-[#FF7B1D]" />
                Stage Name <span className="text-red-500">*</span>
              </label>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-medium text-gray-700 bg-white hover:border-gray-300"
                >
                  <span className={!stageName ? "text-gray-400" : "text-gray-800"}>
                    {stageName || "Select a Stage"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isStageDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isStageDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-sm shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-fadeIn">
                    <div className="py-1">
                      {isLoadingStages ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          Loading stages...
                        </div>
                      ) : masterStages.length > 0 ? (
                        masterStages.map((ms) => (
                          <div
                            key={ms.id}
                            onClick={() => handleStageSelect(ms.name)}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between group ${stageName === ms.name
                              ? "bg-orange-50 text-[#FF7B1D] font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span>{ms.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {ms.probability && (
                                <span className="text-xs text-gray-400 font-normal group-hover:text-gray-500">
                                  {ms.probability}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No stages found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Probability & Final Checkbox */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 capitalize tracking-normal">
                  <Percent size={14} className="text-[#FF7B1D]" />
                  Probability (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stageProbability}
                    readOnly
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-sm bg-gray-100 text-gray-500 focus:outline-none cursor-not-allowed text-sm font-medium"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Percent size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                {/* Invisible label for alignment */}
                <label className="flex items-center gap-2 text-xs font-bold text-transparent select-none">
                  &nbsp;
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2.5 rounded-sm border border-gray-200 w-full hover:border-[#FF7B1D] transition-colors h-[42px]">
                  <input
                    type="checkbox"
                    checked={stageIsFinal}
                    onChange={(e) => setStageIsFinal(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-gray-700 capitalize tracking-normal">
                    Final Stage?
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 capitalize tracking-normal">
                <FileText size={14} className="text-[#FF7B1D]" />
                Description
              </label>
              <textarea
                rows={2}
                value={stageDescription}
                readOnly
                placeholder="Brief description of this stage..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-sm resize-none bg-gray-100 text-gray-500 focus:outline-none cursor-not-allowed text-sm font-medium"
              />
            </div>

            <button
              onClick={saveStage}
              className="w-full py-2.5 bg-gray-800 text-white text-xs font-bold capitalize rounded-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {editIndex !== null ? (
                <>
                  <Save size={16} /> Update Stage
                </>
              ) : (
                <>
                  <Plus size={16} /> Add Stage to List
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Stages List */}
        <div className="bg-gray-50 rounded-sm border border-gray-200 flex flex-col h-full min-h-[400px] max-h-[600px]">
          <div className="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
            <h4 className="font-bold text-gray-700 flex items-center gap-2 text-sm capitalize">
              <Layers size={18} className="text-[#FF7B1D]" />
              Pipeline Stages ({stages.length})
            </h4>
            <span className="text-[10px] text-gray-500 font-semibold bg-white px-2 py-1 rounded border border-gray-200">
              Drag to Reorder
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {stages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 min-h-[200px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Workflow size={32} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium">No stages added yet</p>
                <p className="text-xs text-gray-400 text-center max-w-[200px]">
                  Use the form on the left to add stages to this pipeline.
                </p>
              </div>
            ) : (
              stages.map((stage, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragEnter={(e) => handleDragEnter(e, i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`group relative flex items-start gap-3 bg-white border rounded-sm p-4 transition-all cursor-move
                    ${editIndex === i
                      ? "border-[#FF7B1D] ring-1 ring-[#FF7B1D]/30 shadow-md"
                      : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
                    }`}
                >
                  <div className="mt-1 text-gray-300 group-hover:text-gray-500 transition-colors">
                    <GripVertical size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800 text-sm truncate">
                        {stage.name}
                      </span>
                      {stage.is_final && (
                        <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wider">
                          Final
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        <Percent size={10} /> {stage.probability}% Probability
                      </span>
                    </div>
                    {stage.description && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed pl-2 border-l-2 border-gray-100">
                        {stage.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditStage(i)}
                      className="p-1.5 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded transition-all"
                      title="Edit Stage"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteStage(i)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-all"
                      title="Remove Stage"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddPipelineModal;
