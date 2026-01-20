import React, { useEffect, useRef, useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
    Download,
    Plus,
    Trash2,
    X,
    Eye,
    Pencil,
    Filter,
    Loader,
    CheckCircle,
    XCircle,
    Layers,
    AlertCircle,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";
import { toast } from "react-hot-toast";
import {
    useGetStagesQuery,
    useCreateStageMutation,
    useUpdateStageMutation,
    useDeleteStageMutation,
} from "../../store/api/stageApi";

const ManageStage = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);

    // API
    const { data: stagesData, isLoading, isError } = useGetStagesQuery();
    const stages = stagesData || [];

    // Filter
    const filteredStages = stages.filter((stage) =>
        stage.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredStages.length / rowsPerPage);
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentStages = filteredStages.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size={40} className="text-[#FF7B1D] animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="text-red-500 mb-4">
                    <XCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
                <p className="text-gray-600">Failed to load stages.</p>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-0 ml-6 bg-gray-0 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Stage Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <FiHome className="text-gray-700 text-sm" />
                            <span className="text-gray-400"></span> CRM /{" "}
                            <span className="text-[#FF7B1D] font-medium">All Stages</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex items-center gap-2 bg-[#FF7B1D] text-white px-4 py-2 rounded-sm font-semibold hover:opacity-90 transition"
                        >
                            <Plus size={18} />
                            Add Stage
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr className="bg-[#FF7B1D] text-white text-sm">
                                <th className="py-3 px-4 font-semibold">S.N</th>
                                <th className="py-3 px-4 font-semibold">Stage Name</th>
                                <th className="py-3 px-4 font-semibold">Default Probability</th>
                                <th className="py-3 px-4 font-semibold">Description</th>
                                <th className="py-3 px-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStages.length > 0 ? (
                                currentStages.map((stage, index) => (
                                    <tr key={stage.id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium">{indexOfFirstItem + index + 1}</td>
                                        <td className="py-3 px-4 text-orange-600 hover:text-blue-800 font-medium cursor-pointer" onClick={() => { setSelectedStage(stage); setIsEditOpen(true); }}>
                                            {stage.name}
                                        </td>
                                        <td className="py-3 px-4 font-medium">{stage.probability}%</td>
                                        <td className="py-3 px-4 font-medium text-gray-500 truncate max-w-[200px]">{stage.description || "-"}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center gap-3">
                                                <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors" key={`edit-${stage.id}`} onClick={() => { setSelectedStage(stage); setIsEditOpen(true); }}>
                                                    <Pencil size={18} />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors" key={`delete-${stage.id}`} onClick={() => { setSelectedStage(stage); setIsDeleteOpen(true); }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500">
                                        No stages found. Add a new stage to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredStages.length > 0 && (
                    <div className="flex justify-end items-center gap-3 mt-6">
                        <button onClick={handlePrev} disabled={currentPage === 1} className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF7B1D] hover:opacity-90"}`}>
                            Back
                        </button>
                        <span className="text-sm font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#22C55E] hover:opacity-90"}`}>
                            Next
                        </button>
                    </div>
                )}

                {/* Modals */}
                <AddStageModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
                <EditStageModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} stage={selectedStage} />
                <DeleteStageModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} stage={selectedStage} />
            </div>
        </DashboardLayout>
    );
};

const AddStageModal = ({ isOpen, onClose }) => {
    const [createStage, { isLoading }] = useCreateStageMutation();
    const [name, setName] = useState("");
    const [probability, setProbability] = useState(0);
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error("Stage Name is required");
        if (probability < 0 || probability > 100) return toast.error("Probability must be 0-100");

        try {
            await createStage({ name, probability, description }).unwrap();
            toast.success("Stage added successfully");
            setName("");
            setProbability(0);
            setDescription("");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to add stage");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Stage" icon={<Layers size={24} />}>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-700">Stage Name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g. Qualification" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Default Probability (%) *</label>
                    <input type="number" min="0" max="100" value={probability} onChange={(e) => setProbability(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" rows="3" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded-sm hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-[#FF7B1D] text-white rounded-sm hover:opacity-90">{isLoading ? "Adding..." : "Add Stage"}</button>
                </div>
            </div>
        </Modal>
    );
};

const EditStageModal = ({ isOpen, onClose, stage }) => {
    const [updateStage, { isLoading }] = useUpdateStageMutation();
    const [name, setName] = useState("");
    const [probability, setProbability] = useState(0);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (stage) {
            setName(stage.name);
            setProbability(stage.probability);
            setDescription(stage.description);
        }
    }, [stage]);

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error("Stage Name is required");
        if (probability < 0 || probability > 100) return toast.error("Probability must be 0-100");

        try {
            await updateStage({ id: stage.id, data: { name, probability, description } }).unwrap();
            toast.success("Stage updated successfully");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update stage");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Stage" icon={<Layers size={24} />}>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-700">Stage Name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Default Probability (%) *</label>
                    <input type="number" min="0" max="100" value={probability} onChange={(e) => setProbability(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500" rows="3" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded-sm hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-[#FF7B1D] text-white rounded-sm hover:opacity-90">{isLoading ? "Saving..." : "Save Changes"}</button>
                </div>
            </div>
        </Modal>
    );
};

const DeleteStageModal = ({ isOpen, onClose, stage, refetchStages }) => {
  const [deleteStage, { isLoading }] = useDeleteStageMutation();

  const handleDelete = async () => {
    try {
      await deleteStage(stage.id).unwrap();

      if (refetchStages) {
        refetchStages();
      }

      toast.success("Stage deleted successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete stage");
    }
  };

  if (!stage) return null;

  const footer = (
    <div className="flex gap-4 w-full">
      <button
        onClick={onClose}
        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
      >
        Cancel
      </button>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Trash2 size={20} />
        )}
        {isLoading ? "Deleting..." : "Delete Now"}
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
      <div className="flex flex-col items-center text-center text-black">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <AlertCircle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete the stage{" "}
          <span className="font-bold text-gray-800">
            "{stage.name}"
          </span>
          ?
        </p>

        <p className="text-sm text-red-500 italic">
          This action cannot be undone. All related data will be permanently removed.
        </p>
      </div>
    </Modal>
  );
};

export default ManageStage;
