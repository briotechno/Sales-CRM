import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AddPipelineModal from "../../components/PiplineManagement/AddPipelineModal";
import {
  Search,
  Download,
  Plus,
  Trash2,
  X,
  Eye,
  DollarSign,
  Users,
  Handshake,
  Target,
  Pencil,
  Filter,
  Loader,
  Layers,
  ChevronDown,
  SquarePen,
  AlertCircle,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import NumberCard from "../../components/NumberCard";
// import EditPipelineModal from "../../components/PiplineManagement/EditPipelineModal"; // Removed in favor of consolidated AddPipelineModal
// import DeletePipelineModal from "../../components/PiplineManagement/DeletePipelineModal"; // Replaced with inline component
import ViewPipelineModal from "../../components/PiplineManagement/ViewPipelineModal";
import { useGetPipelinesQuery, useDeletePipelineMutation } from "../../store/api/pipelineApi";
import { toast } from "react-hot-toast";

const PipelineList = () => {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPipelineOpen, setIsAddPipelineOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isViewOpen, setIsViewOpen] = useState(false);
  // const [isEditOpen, setIsEditOpen] = useState(false); // Redundant now
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [tempSearch, setTempSearch] = useState("");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  // Pipeline data
  const { data, isLoading, isError } = useGetPipelinesQuery({
    page: currentPage,
    limit: rowsPerPage,
    search: searchQuery
  });

  const pipelines = data?.pipelines || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  // Note: Status filtering is currently done on the fetched page. 
  // For full server-side status filtering, the backend API needs to support it. 
  // We'll filter the current page's results for status.
  const filteredPipelines = pipelines.filter(p => filterStatus === "all" || p.status === filterStatus);

  // Since we are paginating on backend, the "currentPipelines" is just the filtered list from the API response
  const currentPipelines = filteredPipelines;

  const indexOfFirstItem = (currentPage - 1) * rowsPerPage;
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, pagination.total || 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target)
      ) {
        setIsStatusFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return `₹${(value / 1000).toFixed(0)},${(value % 1000)
      .toString()
      .padStart(3, "0")}`;
  };

  const hasActiveFilters = filterStatus !== "all" || searchQuery !== "";

  const handleClearFilters = () => {
    setFilterStatus("all");
    setSearchQuery("");
    setTempSearch("");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setSearchQuery(tempSearch);
    setIsStatusFilterOpen(false);
    setCurrentPage(1);
  };

  // Pagination handlers directly update currentPage, which triggers API refetch
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));



  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size={40} className="text-[#FF7B1D] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-red-500 mb-4">
            <X size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
          <p className="text-gray-600">Failed to load pipelines. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pipeline Management</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400">CRM / </span>
                  <span className="text-[#FF7B1D] font-medium">All Pipeline</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        handleClearFilters();
                      } else {
                        setTempSearch(searchQuery);
                        setIsStatusFilterOpen(!isStatusFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isStatusFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isStatusFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 tracking-tight">Filter Options</span>
                        <button
                          onClick={() => {
                            setTempSearch("");
                            setFilterStatus("all");
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                        >
                          Reset All
                        </button>
                      </div>

                      <div className="p-5 space-y-6">
                        {/* Search Input */}
                        <div className="group">
                          <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Pipeline</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={tempSearch}
                              onChange={(e) => setTempSearch(e.target.value)}
                              placeholder="Search by pipeline name..."
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Select Status</span>
                          <div className="space-y-2">
                            {[{ label: "All Status", value: "all" }, { label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }].map((option) => (
                              <label key={option.value} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="status_filter"
                                    checked={filterStatus === option.value}
                                    onChange={() => setFilterStatus(option.value)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-3 text-sm font-medium transition-colors ${filterStatus === option.value ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsStatusFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white shadow-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleApplyFilters}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>



                <button
                  onClick={() => navigate("/crm/pipeline/stages")}
                  className="flex items-center gap-2 px-4 py-3 rounded-sm border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm"
                >
                  <Layers size={18} />
                  <span className="text-sm">Manage Stages</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPipeline(null);
                    setIsAddPipelineOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={20} />
                  Add Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">

          {/* Statement Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <NumberCard
              title="Total Pipeline"
              number={pipelines.length}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Total Value"
              number={pipelines.reduce((sum, p) => sum + (Number(p.totalDealValue) || 0), 0)}
              icon={<DollarSign className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Total Deals"
              number={pipelines.reduce((sum, p) => sum + (Number(p.noOfDeals) || 0), 0)}
              icon={<Handshake className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Total Active"
              number={pipelines.filter(p => p.status === 'Active').length}
              icon={<Target className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white mt-4">
            {/* Table */}
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <th className="py-3 px-4 font-semibold border-b border-orange-400">S.N</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400">Pipeline Name</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400">Number of Stages</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400">Total Deal Value</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400">No of Deals</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400">Created Date</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400 text-center">Status</th>
                  <th className="py-3 px-4 font-semibold border-b border-orange-400 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentPipelines.length > 0 ? (
                  currentPipelines.map((pipeline, index) => (
                    <tr
                      key={pipeline.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-gray-500">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-800 hover:text-orange-600 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedPipeline(pipeline);
                          setIsViewOpen(true);
                        }}
                      >
                        {pipeline.name}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-600 text-center md:text-left">
                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-sm text-xs font-bold border border-orange-100 uppercase tracking-tight">
                          {Array.isArray(pipeline.stages) ? pipeline.stages.length : (pipeline.stages || 0)} Stages
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {formatCurrency(pipeline.totalDealValue)}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-700">
                        {pipeline.noOfDeals || 0}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-tighter">
                        {pipeline.createdDate}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold rounded-sm border uppercase tracking-wider ${pipeline.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}
                        >
                          {pipeline.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2 text-gray-400">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setIsViewOpen(true);
                            }}
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setIsAddPipelineOpen(true);
                            }}
                            title="Edit"
                          >
                            <SquarePen size={18} />
                          </button>
                          {console.log(pipeline.name)}
                          <button
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setIsDeleteOpen(true);
                            }}
                            className={`p-1.5 rounded-sm transition-all ${pipeline.name === "Default Pipeline"
                              ? "text-gray-300 cursor-not-allowed opacity-50"
                              : "text-red-600 hover:bg-red-50"
                              }`}
                            title={pipeline.name === "Default Pipeline" ? "Default Pipeline (Cannot Delete)" : "Delete"}
                            disabled={pipeline.name === "Default Pipeline"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner text-gray-200">
                          <Target size={32} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">No pipelines found.</p>
                          <p className="text-xs text-gray-400">Try adjusting your search or add a new pipeline.</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPipeline(null);
                            setIsAddPipelineOpen(true);
                          }}
                          className="mt-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm text-xs font-bold hover:shadow-lg transition-all active:scale-95 shadow-md"
                        >
                          Add Pipeline
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfFirstItem + currentPipelines.length}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Pipelines
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* POPUP MODALS */}
        <AddPipelineModal
          isOpen={isAddPipelineOpen}
          onClose={() => {
            setIsAddPipelineOpen(false);
            setSelectedPipeline(null);
          }}
          pipelineToEdit={selectedPipeline}
        />
        <ViewPipelineModal
          isOpen={isViewOpen}
          pipeline={selectedPipeline}
          onClose={() => {
            setIsViewOpen(false);
            setSelectedPipeline(null);
          }}
        />
        {/* EditPipelineModal removed */}
        {selectedPipeline && (
          <DeletePipelineModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedPipeline(null);
            }}
            pipelineId={selectedPipeline.id}
            pipelineName={selectedPipeline.name}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PipelineList;

const DeletePipelineModal = ({
  isOpen,
  onClose,
  pipelineId,
  pipelineName,
  refetchPipelines,
}) => {
  const [deletePipeline, { isLoading }] = useDeletePipelineMutation();

  const handleDelete = async () => {
    try {
      await deletePipeline(pipelineId).unwrap();

      toast.success("Pipeline deleted successfully");

      if (refetchPipelines) {
        refetchPipelines();
      }

      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete pipeline");
    }
  };

  const footer = (
    <div className="flex gap-4 w-full">
      <button
        onClick={onClose}
        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
      >
        Cancel
      </button>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs uppercase tracking-widest"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      <div className="flex flex-col items-center text-center text-black font-primary">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete the pipeline{" "}
          <span className="font-bold text-gray-800">
            "{pipelineName}"
          </span>
          ?
        </p>

        <p className="text-xs text-red-500 italic">
          This action cannot be undone. All associated stages will be permanently removed.
        </p>
      </div>
    </Modal>
  );
};
