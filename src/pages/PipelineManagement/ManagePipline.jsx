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
                      if (filterStatus !== "all") {
                        setFilterStatus("all");
                      } else {
                        setIsStatusFilterOpen(!isStatusFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isStatusFilterOpen || filterStatus !== "all"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {filterStatus !== "all" ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isStatusFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[250px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Filter Status</span>
                        <button
                          onClick={() => setFilterStatus("all")}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="space-y-2">
                          {[{ label: "All Status", value: "all" }, { label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }].map((option) => (
                            <label key={option.value} className="flex items-center group cursor-pointer">
                              <div className="relative flex items-center">
                                <input
                                  type="radio"
                                  name="status_filter"
                                  checked={filterStatus === option.value}
                                  onChange={() => {
                                    setFilterStatus(option.value);
                                    setIsStatusFilterOpen(false);
                                  }}
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
                  )}
                </div>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-3 rounded-sm border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm"
                >
                  <Download size={18} />
                  <span className="text-sm">Export</span>
                </button>

                <button
                  onClick={() => navigate("/crm/pipeline/stages")}
                  className="flex items-center gap-2 px-4 py-3 rounded-sm border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm"
                >
                  <Layers size={18} />
                  <span className="text-sm">Manage Stages</span>
                </button>

                <button
                  onClick={() => setIsAddPipelineOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={20} />
                  Add Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-6">
          {/* Search Bar */}
          <div className="mb-6 relative max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search pipelines by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm font-medium text-gray-700 bg-white hover:shadow-sm"
            />
          </div>

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
                            className="hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all p-2"
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setIsViewOpen(true);
                            }}
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="hover:bg-orange-100 rounded-sm text-orange-500 hover:text-orange-700 transition-all p-2"
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setIsEditOpen(true);
                            }}
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPipeline(pipeline);
                              setIsDeleteOpen(true);
                            }}
                            className="hover:bg-red-100 rounded-sm text-red-500 hover:text-red-700 transition-all p-2"
                            title="Delete"
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
                          onClick={() => setIsAddPipelineOpen(true)}
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

          {/* 🔹 Pagination Section */}
          {filteredPipelines.length > 0 && (
            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-sm border border-gray-200 mt-6 shadow-sm mb-10">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Displaying {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredPipelines.length)} of {filteredPipelines.length} Pipelines
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-sm text-xs font-bold transition-all border ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-600"
                    }`}
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-sm text-xs font-bold transition-all flex items-center justify-center border ${currentPage === i + 1
                        ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                        : "bg-white text-gray-600 border-gray-300 hover:border-orange-500"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-sm text-xs font-bold transition-all border ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-600 font-bold"
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
      </div>
    </DashboardLayout>
  );
};

export default PipelineList;
