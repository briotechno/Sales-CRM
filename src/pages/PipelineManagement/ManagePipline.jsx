import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AddPipelineModal from "../../components/PiplineManagement/AddPipelineModal";
import {
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Type,
  Server,
  Users,
  Phone,
  DollarSignIcon,
  Handshake,
  Target,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

const PipelineList = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPipelineOpen, setIsAddPipelineOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");

  // Pipeline data
  const [pipelines] = useState([
    {
      id: 1,
      sn: 1,
      name: "Sales",
      stages: 5,
      totalDealValue: 450000,
      noOfDeals: 315,
      stageLabel: "Won",
      stageColor: "green",
      createdDate: "14 Jan 2024",
      status: "Active",
    },
    {
      id: 2,
      sn: 2,
      name: "Marketing",
      stages: 4,
      totalDealValue: 315000,
      noOfDeals: 447,
      stageLabel: "In Pipeline",
      stageColor: "purple",
      createdDate: "21 Jan 2024",
      status: "Active",
    },
    {
      id: 3,
      sn: 3,
      name: "Calls",
      stages: 6,
      totalDealValue: 840000,
      noOfDeals: 654,
      stageLabel: "Won",
      stageColor: "green",
      createdDate: "20 Feb 2024",
      status: "Active",
    },
    {
      id: 4,
      sn: 4,
      name: "Email",
      stages: 3,
      totalDealValue: 610000,
      noOfDeals: 545,
      stageLabel: "Conversation",
      stageColor: "cyan",
      createdDate: "15 Mar 2024",
      status: "Active",
    },
    {
      id: 5,
      sn: 5,
      name: "Chats",
      stages: 4,
      totalDealValue: 470000,
      noOfDeals: 787,
      stageLabel: "Won",
      stageColor: "cyan",
      createdDate: "12 Apr 2024",
      status: "Active",
    },
    {
      id: 6,
      sn: 6,
      name: "Operational",
      stages: 5,
      totalDealValue: 550000,
      noOfDeals: 787,
      stageLabel: "Follow Up",
      stageColor: "yellow",
      createdDate: "20 May 2024",
      status: "Active",
    },
    {
      id: 7,
      sn: 7,
      name: "Collaborative",
      stages: 4,
      totalDealValue: 500000,
      noOfDeals: 315,
      stageLabel: "Won",
      stageColor: "green",
      createdDate: "06 Jul 2024",
      status: "Inactive",
    },
    {
      id: 8,
      sn: 8,
      name: "Differentiate",
      stages: 6,
      totalDealValue: 450000,
      noOfDeals: 478,
      stageLabel: "Schedule servise",
      stageColor: "pink",
      createdDate: "02 Sep 2024",
      status: "Active",
    },
    {
      id: 9,
      sn: 9,
      name: "Sales",
      stages: 5,
      totalDealValue: 450000,
      noOfDeals: 315,
      stageLabel: "Won",
      stageColor: "green",
      createdDate: "14 Jan 2024",
      status: "Active",
    },
    {
      id: 10,
      sn: 9,
      name: "Sales",
      stages: 5,
      totalDealValue: 450000,
      noOfDeals: 315,
      stageLabel: "Won",
      stageColor: "green",
      createdDate: "14 Jan 2024",
      status: "Active",
    },
    {
      id: 11,
      sn: 9,
      name: "Sales",
      stages: 5,
      totalDealValue: 450000,
      noOfDeals: 315,
      stageLabel: "Won",
      stageColor: "green",
      createdDate: "14 Jan 2024",
      status: "Active",
    },
  ]);

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
      filterStatus === "All" || pipeline.status === filterStatus;
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
          pipeline.stages,
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

  const handleDeletePipeline = (id) => {
    if (window.confirm("Are you sure you want to delete this pipeline?")) {
      console.log("Delete pipeline:", id);
    }
  };

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
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${filterStatus === status
                    ? "bg-[#FF7B1D] text-white border-[#FF7B1D]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {status}
              </button>
            ))}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Download size={18} />
              Export
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
            number={"248"}
            icon={<Users className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Total Value"
            number={"186"}
            icon={<DollarSign className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Total Deals"
            number={"18"}
            icon={<Handshake className="text-orange-600" size={24} />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
          <NumberCard
            title="Total Status"
            number={"24"}
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
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800 cursor-pointer font-medium">
                      {pipeline.name}
                    </td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800 font-medium">{pipeline.stages}</td>
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
                          onClick={() => console.log("Edit", pipeline.id)}
                          className="text-[#FF7B1D] hover:opacity-80"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePipeline(pipeline.id)}
                          className="text-red-500 hover:opacity-80"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="text-[#FF7B1D] hover:opacity-80">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-6 text-gray-500 font-medium text-sm"
                  >
                    No pipelines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔸 Pagination Section */}
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

        {/* Add Pipeline Modal */}
        {isAddPipelineOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-sm w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Pipeline
                </h2>
                <button
                  onClick={() => setIsAddPipelineOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pipeline Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter pipeline name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Stages <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter number of stages"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsAddPipelineOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-sm hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert("✅ Pipeline added successfully!");
                      setIsAddPipelineOpen(false);
                    }}
                    className="px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded-sm hover:opacity-90 transition"
                  >
                    Add Pipeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* POPUP MODAL */}
      <AddPipelineModal
        isOpen={isAddPipelineOpen}
        onClose={() => setIsAddPipelineOpen(false)}
      />
    </DashboardLayout>
  );
};

export default PipelineList;
