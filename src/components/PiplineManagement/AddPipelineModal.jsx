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
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import { useCreatePipelineMutation, useUpdatePipelineMutation } from "../../store/api/pipelineApi";
import { useGetCatalogsQuery } from "../../store/api/catalogApi";
import { useGetStagesQuery, useCreateStageMutation, useDeleteStageMutation } from "../../store/api/stageApi";

const AddPipelineModal = ({ isOpen, onClose, pipelineToEdit }) => {
  const [createPipeline, { isLoading: isCreating }] = useCreatePipelineMutation();
  const [updatePipeline, { isLoading: isUpdating }] = useUpdatePipelineMutation();
  const { data: stagesResponse, isLoading: isLoadingStages } = useGetStagesQuery({ limit: 1000 }); // Fetch all master stages
  const [createStage, { isLoading: isCreatingMasterStage }] = useCreateStageMutation();
  const [deleteMasterStageMutation] = useDeleteStageMutation();
  const masterStages = stagesResponse?.stages || [];
  const { data: catalogsData } = useGetCatalogsQuery({ limit: 1000, status: 'Active' }); // Fetch all active catalogs

  const [pipelineName, setPipelineName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [stages, setStages] = useState([]);
  const [isAddMasterModalOpen, setIsAddMasterModalOpen] = useState(false);
  const [isDeleteMasterModalOpen, setIsDeleteMasterModalOpen] = useState(false);
  const [masterStageToDelete, setMasterStageToDelete] = useState(null);
  const [createdStageIds, setCreatedStageIds] = useState([]);
  const [isInlineCreatingMaster, setIsInlineCreatingMaster] = useState(false);
  const [inlineMasterName, setInlineMasterName] = useState("");
  const [inlineMasterProb, setInlineMasterProb] = useState(0);
  const [inlineMasterDesc, setInlineMasterDesc] = useState("");

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
      setIsAddMasterModalOpen(false);
      setCreatedStageIds([]); // Reset the dropdown list for fresh pipeline creation
    }
  }, [pipelineToEdit, isOpen]);



  const totalProbability = stages.reduce((sum, s) => sum + (Number(s.probability) || 0), 0);

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

  const handleCreateMasterStage = async (stageData) => {
    try {
      const result = await createStage(stageData).unwrap();
      toast.success("Master stage created successfully");
      setIsAddMasterModalOpen(false);
      // Track this stage ID to show it in the dropdown
      const newStage = result.stage || result;
      if (newStage?.id) {
        setCreatedStageIds(prev => [...prev, newStage.id]);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create master stage");
    }
  };

  const handleDeleteMasterStage = (stage) => {
    setMasterStageToDelete(stage);
    setIsDeleteMasterModalOpen(true);
  };

  const handleSaveInlineMaster = async () => {
    if (!inlineMasterName.trim()) return toast.error("Stage name is required");
    try {
      const result = await createStage({
        name: inlineMasterName,
        probability: inlineMasterProb,
        description: inlineMasterDesc
      }).unwrap();
      toast.success("Master stage created");

      const newStage = result.stage || result;
      if (newStage?.id) {
        setCreatedStageIds(prev => [...prev, newStage.id]);
        // Auto-select the newly created stage
        handleStageSelect(newStage.name);
      }
      setIsInlineCreatingMaster(false);
      setInlineMasterName("");
      setInlineMasterProb(0);
      setInlineMasterDesc("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create stage");
    }
  };

  const confirmDeleteMasterStage = async () => {
    if (!masterStageToDelete) return;
    try {
      await deleteMasterStageMutation(masterStageToDelete.id).unwrap();
      toast.success("Master stage deleted");
      setIsDeleteMasterModalOpen(false);
      setMasterStageToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete stage");
    }
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

  const deleteStageFromList = (index) => {
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

    if (totalProbability !== 100) {
      return toast.error(`Total probability must be exactly 100%. Current total: ${totalProbability}%`);
    }

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
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        {totalProbability !== 100 && (
          <div className={`flex items-center gap-2 font-primary transition-all duration-300 ${totalProbability > 100 ? 'text-red-500' : 'text-orange-600 animate-pulse'}`}>
            <AlertCircle size={18} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">Action Required</span>
              <span className="text-[12px] font-bold">
                {totalProbability < 100 
                  ? `Please set stages probability to 100% (Current: ${totalProbability}%)` 
                  : `Probability exceeds 100% (${totalProbability}%) - Please adjust.`
                }
              </span>
            </div>
          </div>
        )}
        {totalProbability === 100 && (
          <div className="flex items-center gap-2 text-green-600 font-primary">
            <Check size={18} className="bg-green-100 rounded-full p-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">Ready</span>
              <span className="text-[12px] font-bold">Pipeline configuration is valid.</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-sm border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-700 transition-all font-primary text-sm bg-white shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSavePipeline}
          disabled={isLoading || totalProbability !== 100}
          className={`px-8 py-2.5 rounded-sm font-bold transition-all font-primary text-sm flex items-center gap-2 shadow-md
            ${totalProbability === 100 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
            }
          `}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Workflow size={18} />
          )}
          {isLoading ? (pipelineToEdit ? "Updating..." : "Creating...") : (pipelineToEdit ? "Update Pipeline" : "Create Pipeline")}
        </button>
      </div>
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
              {catalogsData?.catalogs?.length > 0 &&
                catalogsData.catalogs.map((catalog) => {
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

          {/* INLINE FORM CONTAINER */}
          <div className="bg-orange-50/50 p-5 rounded-sm border border-orange-100 shadow-sm relative overflow-hidden">
            {/* STAGE SELECTION VIEW */}
            <div className={`transition-all duration-300 ${isInlineCreatingMaster ? "opacity-0 invisible absolute -z-10" : "opacity-100 visible relative"}`}>
              <div className="flex items-center justify-between border-b border-orange-100 pb-2 mb-4">
                <h4 className="text-[13px] font-bold text-gray-800 capitalize flex items-center gap-2">
                  {editIndex !== null ? (
                    <><Edit2 size={14} className="text-orange-500" /> Edit Stage</>
                  ) : (
                    <><Plus size={14} className="text-orange-500" /> Add New Stage</>
                  )}
                </h4>
                {editIndex !== null ? (
                  <button
                    onClick={resetStageForm}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 capitalize transition-colors"
                  >
                    <RotateCcw size={14} /> Cancel Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsInlineCreatingMaster(true)}
                    className="text-[10px] bg-orange-600 text-white px-3 py-1.5 rounded-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus size={14} /> Create Stage
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Stage Name Dropdown */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 capitalize tracking-normal mb-1">
                    <Workflow size={14} className="text-[#FF7B1D]" />
                    Stage Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D]/20 outline-none transition-all text-sm font-medium text-gray-700 bg-white hover:border-gray-300 shadow-sm"
                    >
                      <span className={!stageName ? "text-gray-400" : "text-gray-800"}>
                        {stageName || "Select a Stage"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${isStageDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isStageDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-fadeIn">
                        <div className="py-1">
                          {masterStages.filter(ms => createdStageIds.includes(ms.id)).length > 0 ? (
                            masterStages
                              .filter(ms => createdStageIds.includes(ms.id))
                              .map((ms) => (
                                <div
                                  key={ms.id}
                                  className={`group px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between border-b border-gray-50 last:border-0 ${stageName === ms.name
                                    ? "bg-orange-50 text-[#FF7B1D] font-bold"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  onClick={() => handleStageSelect(ms.name)}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="truncate pr-2">{ms.name}</span>
                                    {ms.probability !== undefined && (
                                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold shrink-0">
                                        {ms.probability}%
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMasterStage(ms);
                                    }}
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Master Stage"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))
                          ) : (
                            <div className="px-4 py-10 text-center bg-gray-50/50">
                              <p className="text-[12px] font-bold text-[#FF7B1D] mb-2 tracking-wide">No Stage Available Yet</p>
                              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Please create a stage first using the<br />"Create Master Stage" button above.</p>
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
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 capitalize tracking-normal mb-1">
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
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-sm bg-gray-100 text-gray-500 focus:outline-none cursor-not-allowed text-sm font-medium transition-all shadow-inner"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Percent size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-transparent select-none mb-1">&nbsp;</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2.5 rounded-sm border border-gray-200 w-full hover:border-[#FF7B1D] transition-all h-[46px] shadow-sm select-none">
                      <input
                        type="checkbox"
                        checked={stageIsFinal}
                        onChange={(e) => setStageIsFinal(e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-700 capitalize tracking-normal">Final Stage?</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 capitalize tracking-normal mb-1">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={stageDescription}
                    readOnly
                    placeholder="Brief description of this stage..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm resize-none bg-gray-100 text-gray-500 focus:outline-none cursor-not-allowed text-sm font-medium transition-all shadow-inner"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={saveStage}
                    disabled={!stageName}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {editIndex !== null ? (
                      <><Save size={18} /> Update Stage Listing</>
                    ) : (
                      <><Plus size={18} /> Add Stage to List</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* INLINE CREATE MASTER STAGE FORM */}
            <div className={`transition-all duration-300 ${isInlineCreatingMaster ? "opacity-100 visible relative" : "opacity-0 invisible absolute top-0 left-0 w-full h-full pointer-events-none"}`}>
              <div className="flex items-center justify-between border-b border-orange-100 pb-2 mb-4">
                <h4 className="text-[13px] font-bold text-orange-600 capitalize flex items-center gap-2">
                  <Layers size={16} /> Create Stage
                </h4>
                <button
                  type="button"
                  onClick={() => setIsInlineCreatingMaster(false)}
                  className="p-1 px-2 text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-all flex items-center gap-1 active:scale-90 border border-orange-200"
                >
                  <X size={14} /> Close
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                    Stage Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={inlineMasterName}
                    onChange={(e) => setInlineMasterName(e.target.value)}
                    placeholder="e.g. Negotiation Phase"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                    Default Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inlineMasterProb}
                    onChange={(e) => setInlineMasterProb(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm font-semibold shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={inlineMasterDesc}
                    onChange={(e) => setInlineMasterDesc(e.target.value)}
                    placeholder="Briefly describe this stage..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm font-semibold resize-none shadow-sm placeholder:text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInlineCreatingMaster(false)}
                    className="py-3 border border-gray-200 text-gray-500 font-bold rounded-sm hover:bg-gray-50 transition-all text-[11px] uppercase tracking-wider bg-white shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInlineMaster}
                    disabled={isCreatingMasterStage}
                    className="py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider disabled:opacity-50 active:scale-95 shadow-md shadow-orange-500/20"
                  >
                    {isCreatingMasterStage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Save Stage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stages List */}
        <div className="bg-gray-50 rounded-sm border border-gray-200 flex flex-col h-full min-h-[400px] max-h-[600px] shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-100/50 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-700 flex items-center gap-2 text-sm capitalize">
                <Layers size={18} className="text-[#FF7B1D]" />
                Pipeline Stages ({stages.length})
              </h4>
              <span className="text-[11px] text-[#FF7B1D] font-bold bg-white px-2.5 py-1.5 rounded-sm border border-orange-200 shadow-sm uppercase tracking-wider font-primary">
                Drag to Reorder
              </span>
            </div>

            {/* Probability Progress Tracker */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[11px] font-bold text-[#FF7B1D] uppercase tracking-widest font-primary">Total Probability</p>
                <p className={`text-sm font-black px-2 py-1 rounded-sm font-primary ${totalProbability === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#FF7B1D]'}`}>
                  {totalProbability}% / 100%
                </p>
              </div>
              <div className="h-2 w-full bg-white border border-gray-200 rounded-full overflow-hidden shadow-inner p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${totalProbability === 100 ? 'bg-green-500' : totalProbability > 100 ? 'bg-red-500' : 'bg-orange-500'}`}
                  style={{ width: `${Math.min(totalProbability, 100)}%` }}
                />
              </div>
              {totalProbability > 100 && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 animate-pulse justify-center bg-red-50 py-1 rounded-sm border border-red-100">
                  <AlertCircle size={12} /> Total probability exceeds 100%!
                </p>
              )}
              {totalProbability === 100 && (
                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 justify-center bg-green-50 py-1 rounded-sm border border-green-100">
                  <Check size={12} /> Perfect Balance Achieved
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {stages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 min-h-[300px] opacity-60">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-100">
                  <Workflow size={32} className="text-gray-200" />
                </div>
                <p className="text-sm font-bold text-gray-400">No Stages Defined</p>
                <p className="text-[11px] text-gray-400 text-center max-w-[200px] font-medium leading-relaxed">
                  Start building your pipeline by adding stages from the left panel.
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
                  className={`group relative flex items-start gap-4 bg-white border-2 rounded-sm p-4 transition-all cursor-move
                    ${editIndex === i
                      ? "border-[#FF7B1D] shadow-lg scale-[1.02] z-10"
                      : "border-transparent hover:border-gray-200 hover:shadow-md bg-white shadow-sm"
                    }`}
                >
                  <div className="mt-1 text-gray-200 group-hover:text-[#FF7B1D] transition-colors shrink-0">
                    <GripVertical size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-extrabold text-gray-800 text-sm truncate tracking-tight">
                        {stage.name}
                      </span>
                      {stage.is_final && (
                        <span className="text-[8px] bg-green-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                          Final
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                        <Percent size={10} className="text-[#FF7B1D]" /> {stage.probability}% Probability
                      </span>
                    </div>
                    {stage.description && (
                      <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed italic border-l-2 border-orange-100 pl-2">
                        {stage.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => deleteStageFromList(i)}
                      className="p-2 hover:bg-red-50 text-gray-200 hover:text-red-500 rounded-full transition-all group-hover:text-gray-300"
                      title="Remove Stage"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditStage(i)}
                      className="p-2 hover:bg-orange-50 text-gray-200 hover:text-[#FF7B1D] rounded-full transition-all group-hover:text-gray-300"
                      title="Edit Stage"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DeleteMasterStageModal
        isOpen={isDeleteMasterModalOpen}
        onClose={() => {
          setIsDeleteMasterModalOpen(false);
          setMasterStageToDelete(null);
        }}
        onConfirm={confirmDeleteMasterStage}
        stageName={masterStageToDelete?.name}
      />
    </Modal>
  );
};


const DeleteMasterStageModal = ({ isOpen, onClose, onConfirm, stageName }) => {
  const footer = (
    <div className="flex gap-4 w-full">
      <button
        onClick={onClose}
        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs capitalize tracking-normal"
      >
        Cancel
      </button>

      <button
        onClick={onConfirm}
        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 font-primary text-xs capitalize tracking-normal"
      >
        <Trash2 size={18} />
        Delete Now
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerVariant="simple"
      maxWidth="max-w-md"
      footer={footer}
    >
      <div className="flex flex-col items-center text-center text-black font-primary pt-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2 font-primary">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed text-sm">
          Are you sure you want to delete the stage{" "}
          <span className="font-bold text-gray-800">
            "{stageName}"
          </span>
          ?
        </p>

        <p className="text-xs text-red-500 italic">
          This action cannot be undone and will affect all pipelines.
        </p>
      </div>
    </Modal>
  );
};

export default AddPipelineModal;
