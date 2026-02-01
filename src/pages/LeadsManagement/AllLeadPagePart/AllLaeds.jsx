import React, { useState } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import { Download, Upload, Filter, UserPlus, List, Trash2, Users, Server, Type, Phone, Loader2 } from "lucide-react";
import AddLeadPopup from "../../../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../../../components/AddNewLeads/BulkUpload";
import FilterPopup from "../../../pages/LeadsManagement/FilterPopup";
import AssignLeadsModal from "../../../pages/LeadsManagement/AllLeadPagePart/AssignLeadModal";
import LeadsListView from "../../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../../components/NumberCard";
import { useGetLeadsQuery, useDeleteLeadMutation, useUpdateLeadMutation } from "../../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function LeadsList() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterServices, setFilterServices] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterSubtype, setFilterSubtype] = useState("All");
  const itemsPerPage = 7;
  const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);
  const [openLeadMenu, setOpenLeadMenu] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

  // RTK Query hooks
  const { data: leadsResponse, isLoading, isError, refetch } = useGetLeadsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: filterStatus,
    tag: filterTag,
    type: filterType,
    priority: filterPriority,
    services: filterServices,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
  });

  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();

  const leadsData = leadsResponse?.leads || [];
  const totalLeads = leadsResponse?.pagination?.total || 0;
  const totalPages = leadsResponse?.pagination?.totalPages || 1;

  const handleLeadClick = async (lead) => {
    if (!lead.is_read) {
      try {
        await updateLead({ id: lead.id, data: { is_read: 1 } }).unwrap();
      } catch (err) {
        console.error("Failed to mark lead as read", err);
      }
    }
    navigate(`/crm/leads/profile/${lead.id}`, { state: { lead } });
  };

  const handleAddLead = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLeadToEdit(null);
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id).unwrap();
        toast.success("Lead deleted successfully");
        setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
      } catch (error) {
        toast.error("Failed to delete lead");
        console.error(error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedLeads.length} lead(s)?`
      )
    ) {
      // Delete leads sequentially or parallely
      try {
        await Promise.all(selectedLeads.map(id => deleteLead(id).unwrap()));
        toast.success("Selected leads deleted successfully");
        setSelectedLeads([]);
      } catch (error) {
        toast.error("Failed to delete some leads");
        console.error(error);
      }
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leadsData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadsData.map((lead) => lead.id));
    }
  };

  const handleAssignLeads = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to assign");
      return;
    }
    setIsAssignModalOpen(true);
  };

  const handleAssign = (assignmentData) => {
    const totalRecipients =
      assignmentData.teams.length + assignmentData.employees.length;

    toast.success(
      `${selectedLeads.length} leads assigned to ${totalRecipients} recipient(s) successfully!`
    );

    setIsAssignModalOpen(false);
    setSelectedLeads([]);
  };

  const handleBulkUpload = () => {
    setShowBulkUploadPopup(true);
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Type",
      "Created",
      "Status",
      "Tag",
      "Value",
      "Priority",
      "Pipeline",
    ];
    const csvContent = [
      headers.join(","),
      ...leadsData.map((lead) =>
        [
          lead.id,
          `"${lead.name}"`,
          lead.email || "",
          lead.mobile_number || "",
          lead.type || "",
          `"${lead.createdAt}"`,
          lead.status || "",
          lead.tag || "",
          lead.value || "",
          lead.priority || "",
          lead.pipeline_name || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  // Dashboard Summary Data (Can be dynamic later)
  const dashboardStats = {
    totalLeads: totalLeads || 0,
    activeLeads: leadsResponse?.summary?.active || 0, // Assuming backend sends summary
    convertedLeads: leadsResponse?.summary?.converted || 0,
    lostLeads: leadsResponse?.summary?.lost || 0
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Leads Management
                </h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <FiHome className="text-gray-400" size={14} />
                  CRM / <span className="text-[#FF7B1D] font-medium">All Leads</span>
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
                    className={`px-3 py-2 rounded-md font-medium border text-sm transition ${filterStatus === status
                      ? "bg-[#FF7B1D] text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {status}
                  </button>
                ))}

                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition"
                >
                  <Filter size={18} />
                  Filters
                </button>

                <div className="flex border border-gray-300 rounded-md overflow-hidden ml-2 bg-white">
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 transition ${view === "list"
                      ? "bg-orange-50 text-[#FF7B1D]"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <List size={18} />
                  </button>

                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 transition border-l border-gray-300 ${view === "grid"
                      ? "bg-orange-50 text-[#FF7B1D]"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <FiGrid size={18} />
                  </button>
                </div>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition"
                >
                  <Download size={18} />
                  Export
                </button>

                <div className="flex flex-col sm:flex-row gap-3 relative">
                  <button
                    onClick={() => setOpenLeadMenu(!openLeadMenu)}
                    className="bg-[#FF7B1D] text-white px-5 py-2.5 rounded-md flex items-center justify-center gap-2 font-semibold hover:bg-[#e06915] transition-all shadow-md"
                  >
                    <UserPlus size={20} /> Add Lead
                  </button>

                  {openLeadMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          handleAddLead();
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition"
                      >
                        <UserPlus size={16} />
                        Add Single Lead
                      </button>

                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          handleBulkUpload();
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition"
                      >
                        <Upload size={16} />
                        Bulk Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-8xl mx-auto p-4 mt-0">
            {/* Filter Popup Component */}
            <FilterPopup
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filterType={filterType}
              setFilterType={setFilterType}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterServices={filterServices}
              setFilterServices={setFilterServices}
              filterDateFrom={filterDateFrom}
              setFilterDateFrom={setFilterDateFrom}
              filterDateTo={filterDateTo}
              setFilterDateTo={setFilterDateTo}
              filterSubtype={filterSubtype}
              setFilterSubtype={setFilterSubtype}
            />

            {/* Statement Card - Using Static Data for now unless endpoint provides stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <NumberCard
                title="Total Leads"
                number={totalLeads.toString()}
                icon={<Users className="text-blue-600" size={24} />}
                iconBgColor="bg-blue-100"
                lineBorderClass="border-blue-500"
              />
              <NumberCard
                title="Active Leads"
                number={dashboardStats.activeLeads.toString()} // Fallback
                icon={<Server className="text-green-600" size={24} />}
                iconBgColor="bg-green-100"
                lineBorderClass="border-green-500"
              />
              {/* Placeholder stats */}
              <NumberCard
                title="Converted"
                number={dashboardStats.convertedLeads.toString()}
                icon={<Type className="text-orange-600" size={24} />}
                iconBgColor="bg-orange-100"
                lineBorderClass="border-orange-500"
              />
              <NumberCard
                title="Lost"
                number={dashboardStats.lostLeads.toString()}
                icon={<Phone className="text-purple-600" size={24} />}
                iconBgColor="bg-purple-100"
                lineBorderClass="border-purple-500"
              />
            </div>

            {/* Action Bar with Selection */}
            {selectedLeads.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4 flex justify-between items-center animate-fadeIn">
                <div className="flex items-center gap-4 text-orange-800">
                  <span className="font-semibold text-lg">
                    {selectedLeads.length} Lead(s) Selected
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAssignLeads}
                    className="flex items-center gap-2 bg-white border border-orange-300 text-orange-600 px-4 py-2 rounded-md font-semibold hover:bg-orange-50 transition"
                  >
                    <UserPlus size={18} />
                    Assign Leads
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition shadow-sm"
                  >
                    <Trash2 size={18} />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="pb-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 size={40} className="animate-spin text-orange-500" />
                </div>
              ) : isError ? (
                <div className="text-center text-red-500 py-10">
                  Failed to load leads. Please try again.
                </div>
              ) : leadsData.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">No Leads Found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or add a new lead.</p>
                </div>
              ) : (
                <>
                  {/* List or Grid View */}
                  {view === "list" ? (
                    <LeadsListView
                      currentLeads={leadsData}
                      selectedLeads={selectedLeads}
                      handleSelectAll={handleSelectAll}
                      handleSelectLead={handleSelectLead}
                      handleLeadClick={handleLeadClick}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      handleDeleteLead={handleDeleteLead}
                      handleEditLead={handleEditLead}
                    />
                  ) : (
                    <LeadsGridView
                      leadsData={leadsData}
                      filterStatus={filterStatus}
                      handleLeadClick={handleLeadClick}
                      selectedLeads={selectedLeads}
                      handleSelectLead={handleSelectLead}
                    />
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-sm border">
                      <p className="text-sm text-gray-600">
                        Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of <span className="font-bold">{totalLeads}</span> leads
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 text-gray-700"
                        >
                          Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2">...</span>}
                              <button
                                onClick={() => handlePageChange(p)}
                                className={`w-9 h-9 border rounded-sm text-sm font-bold ${currentPage === p
                                  ? "bg-orange-500 text-white border-orange-500"
                                  : "bg-white text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          ))
                        }

                        <button
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 text-gray-700"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Modals */}
          <AssignLeadsModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            selectedLeadsCount={selectedLeads.length}
            onAssign={handleAssign}
          />

          {isModalOpen && (
            <AddLeadPopup
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              leadToEdit={leadToEdit}
            />
          )}

          {showBulkUploadPopup && (
            <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
