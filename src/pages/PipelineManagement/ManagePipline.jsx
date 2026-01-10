import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AddPipelineModal from "../../components/PiplineManagement/AddPipelineModal";
import {
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
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import EditPipelineModal from "../../components/PiplineManagement/EditPipelineModal";
import DeletePipelineModal from "../../components/PiplineManagement/DeletePipelineModal";
import ViewPipelineModal from "../../components/PiplineManagement/ViewPipelineModal";
import { useGetPipelinesQuery } from "../../store/api/pipelineApi";

const PipelineList = () => {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPipelineOpen, setIsAddPipelineOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  // Pipeline data
  const { data: pipelinesData, isLoading, isError } = useGetPipelinesQuery();
  const pipelines = pipelinesData || [];

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

  // Filter pipelines based on search and status
  const filteredPipelines = pipelines.filter((pipeline) => {
    const matchesSearch = pipeline.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || pipeline.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPipelines.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentPipelines = filteredPipelines.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const handleExport = () => {
    const headers = [
      "S.N",
      "Pipeline Name",
      "Stages",
      "Total Deal Value",
      "No of Deals",
      "Created Date",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredPipelines.map((pipeline) =>
        [
          pipeline.sn,
          `"${pipeline.name}"`,
          Array.isArray(pipeline.stages) ? pipeline.stages.length : pipeline.stages,
          pipeline.totalDealValue,
          pipeline.noOfDeals,
          `"${pipeline.createdDate}"`,
          pipeline.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipelines_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
      <div className="p-0 ml-6 bg-gray-0 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pipeline Management
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> CRM /{" "}
              <span className="text-[#FF7B1D] font-medium">All Pipline</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-sm border transition shadow-sm
      ${isStatusFilterOpen || filterStatus !== "all"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <Filter size={20} />
                <span className="text-sm font-semibold capitalize">
                  {filterStatus === "all" ? "All Status" : filterStatus}
                </span>
              </button>

              {isStatusFilterOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                  <div className="py-1">
                    {[
                      { label: "All", value: "all" },
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterStatus(option.value);
                          setCurrentPage(1);
                          setIsStatusFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors
              ${filterStatus === option.value
                            ? "bg-orange-50 text-orange-600 font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Download size={18} />
              Export
            </button>

            <button
              onClick={() => navigate("/crm/pipeline/stages")}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Layers size={18} />
              Manage Stages
            </button>

            <button
              onClick={() => setIsAddPipelineOpen(true)}
              className="flex items-center gap-2 bg-[#FF7B1D] text-white px-4 py-2 rounded-sm font-semibold hover:opacity-90 transition"
            >
              <Plus size={18} />
              Add Pipeline
            </button>
          </div>
        </div>

        {/* Statement Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            title="Total Status"
            number={new Set(pipelines.map(p => p.status)).size}
            icon={<Target className="text-purple-600" size={24} />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
          {/* Table */}
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-[#FF7B1D] text-white text-sm">
                <th className="py-3 px-4 font-semibold">S.N</th>
                <th className="py-3 px-4 font-semibold">Pipeline Name</th>
                <th className="py-3 px-4 font-semibold">Number of Stages</th>
                <th className="py-3 px-4 font-semibold">Total Deal Value</th>
                <th className="py-3 px-4 font-semibold">No of Deals</th>
                <th className="py-3 px-4 font-semibold">Created Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentPipelines.length > 0 ? (
                currentPipelines.map((pipeline, index) => (
                  <tr
                    key={pipeline.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800 cursor-pointer font-medium"
                      onClick={() => {
                        setSelectedPipeline(pipeline);
                        setIsViewOpen(true);
                      }}
                    >
                      {pipeline.name}
                    </td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800 font-medium">{Array.isArray(pipeline.stages) ? pipeline.stages.length : pipeline.stages}</td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(pipeline.totalDealValue)}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {pipeline.noOfDeals}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {pipeline.createdDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${pipeline.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {pipeline.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          onClick={() => {
                            setSelectedPipeline(pipeline);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                          onClick={() => {
                            setSelectedPipeline(pipeline);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPipeline(pipeline);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Target size={48} className="mb-2 opacity-50" />
                      <p className="font-medium">No pipelines found.</p>
                      <p className="text-sm">Try adjusting your search or add a new pipeline.</p>
                      <button
                        onClick={() => setIsAddPipelineOpen(true)}
                        className="mt-4 px-4 py-2 bg-[#FF7B1D] text-white rounded-sm text-sm font-semibold hover:opacity-90 transition"
                      >
                        Add Your First Pipeline
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination Section */}
        {filteredPipelines.length > 0 && (
          <div className="flex justify-end items-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#FF7B1D] hover:opacity-90"
                }`}
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${currentPage === i + 1
                    ? "bg-gray-200 border-gray-400"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#22C55E] hover:opacity-90"
                }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Add Pipeline Modal */}
        {/* We moved the modal content to a separate component, but here we just render it */}
        {/* WAIT: The original file had the modal generic code INLINED inside {isAddPipelineOpen && ...} but ALSO imported AddPipelineModal component?? */}
        {/* Let's double check lines 379-438 of original file. It was rendering a manual modal. */}
        {/* But line 441 rendered <AddPipelineModal /> as well. Double rendering? */}
        {/* No, lines 379-438 seem to be a hardcoded modal that was likely a placeholder or duplicated code. */}
        {/* I should REMOVE the hardcoded inline modal and use the component <AddPipelineModal /> properly. */}
      </div>

      {/* POPUP MODALS */}
      <AddPipelineModal
        isOpen={isAddPipelineOpen}
        onClose={() => setIsAddPipelineOpen(false)}
      />
      <ViewPipelineModal
        isOpen={isViewOpen}
        pipeline={selectedPipeline}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedPipeline(null);
        }}
      />
      <EditPipelineModal
        isOpen={isEditOpen}
        pipeline={selectedPipeline}
        onClose={() => setIsEditOpen(false)}
        onUpdate={(data) => console.log("Updated pipeline", data)}
      />
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

    </DashboardLayout>
  );
};

export default PipelineList;
