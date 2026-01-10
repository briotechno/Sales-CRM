import React, { useState } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Download, Upload, Filter, UserPlus, List, Trash2, Users, Server, Type, Phone, Loader2 } from "lucide-react";
import AddLeadPopup from "../../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../../components/AddNewLeads/BulkUpload";
import FilterPopup from "../../pages/LeadsManagement/FilterPopup";
import AssignLeadsModal from "../../pages/LeadsManagement/AllLeadPagePart/AssignLeadModal";
import LeadsListView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../components/NumberCard";
import { useGetLeadsQuery, useDeleteLeadMutation } from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function NewLeads() {
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

  // RTK Query hooks -- Fixed to subview: 'new'
  const { data: leadsResponse, isLoading, isError, refetch } = useGetLeadsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: filterStatus,
    tag: filterTag,
    type: filterType,
    subview: 'new',
    priority: filterPriority,
    services: filterServices,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
  });

  const [deleteLead] = useDeleteLeadMutation();

  const leadsData = leadsResponse?.leads || [];
  const totalLeads = leadsResponse?.pagination?.total || 0;
  const totalPages = leadsResponse?.pagination?.totalPages || 1;

  const handleLeadClick = (lead) => {
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
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} lead(s)?`)) {
      try {
        await Promise.all(selectedLeads.map(id => deleteLead(id).unwrap()));
        toast.success("Selected leads deleted successfully");
        setSelectedLeads([]);
      } catch (error) {
        toast.error("Failed to delete some leads");
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
    toast.success(`${selectedLeads.length} leads assigned successfully!`);
    setIsAssignModalOpen(false);
    setSelectedLeads([]);
  };

  const handleBulkUpload = () => setShowBulkUploadPopup(true);

  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Type", "Created", "Status", "Tag"];
    const csvContent = [
      headers.join(","),
      ...leadsData.map((lead) =>
        [lead.id, `"${lead.name}"`, lead.email || "", lead.mobile_number || "", lead.type || "", lead.createdAt, lead.status || "", lead.tag || ""].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `new_leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center flex-wrap gap-3 bg-white border-b py-3 px-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">New Leads</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400">/</span> CRM <span className="text-gray-400">/</span>{" "}
              <span className="text-[#FF7B1D] font-medium">New Leads</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition"
            >
              <Filter size={18} /> Filters
            </button>

            <div className="flex border border-gray-300 rounded-md overflow-hidden ml-2 bg-white">
              <button onClick={() => setView("list")} className={`p-2 transition ${view === "list" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600 hover:bg-gray-50"}`}><List size={18} /></button>
              <button onClick={() => setView("grid")} className={`p-2 transition border-l border-gray-300 ${view === "grid" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600 hover:bg-gray-50"}`}><FiGrid size={18} /></button>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition"
            >
              <Download size={18} /> Export
            </button>

            <button
              onClick={handleAddLead}
              className="bg-[#FF7B1D] text-white px-5 py-2.5 rounded-md flex items-center justify-center gap-2 font-semibold hover:bg-[#e06915] transition-all shadow-md"
            >
              <UserPlus size={20} /> Add Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 px-6">
          <NumberCard title="Total New Leads" number={totalLeads.toString()} icon={<Users className="text-blue-600" size={24} />} iconBgColor="bg-blue-100" lineBorderClass="border-blue-500" />
          <NumberCard title="Quick Filters" number="New" icon={<Server className="text-green-600" size={24} />} iconBgColor="bg-green-100" lineBorderClass="border-green-500" />
          <NumberCard title="Avg Value" number="-" icon={<Type className="text-orange-600" size={24} />} iconBgColor="bg-orange-100" lineBorderClass="border-orange-500" />
          <NumberCard title="Priority" number="Mix" icon={<Phone className="text-purple-600" size={24} />} iconBgColor="bg-purple-100" lineBorderClass="border-purple-500" />
        </div>

        {selectedLeads.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 mx-6 p-4 rounded-lg mb-4 flex justify-between items-center animate-fadeIn">
            <span className="font-semibold text-orange-800 text-lg">{selectedLeads.length} Lead(s) Selected</span>
            <div className="flex gap-3">
              <button onClick={handleAssignLeads} className="bg-white border border-orange-300 text-orange-600 px-4 py-2 rounded-md font-semibold hover:bg-orange-50 transition"><UserPlus size={18} /> Assign</button>
              <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"><Trash2 size={18} /> Delete</button>
            </div>
          </div>
        )}

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-orange-500" /></div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">Failed to load new leads.</div>
          ) : leadsData.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No New Leads</h3>
            </div>
          ) : (
            <>
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
                <LeadsGridView leadsData={leadsData} filterStatus={filterStatus} handleLeadClick={handleLeadClick} selectedLeads={selectedLeads} handleSelectLead={handleSelectLead} />
              )}

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
                  <p className="text-sm text-gray-600">Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of <span className="font-bold">{totalLeads}</span> leads</p>
                  <div className="flex items-center gap-2">
                    <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 text-gray-700">Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => handlePageChange(p)} className={`w-9 h-9 border rounded-sm text-sm font-bold ${currentPage === p ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 hover:bg-gray-50"}`}>{p}</button>
                    ))}
                    <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 text-gray-700">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <FilterPopup isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filterType={filterType} setFilterType={setFilterType} filterPriority={filterPriority} setFilterPriority={setFilterPriority} filterServices={filterServices} setFilterServices={setFilterServices} filterDateFrom={filterDateFrom} setFilterDateFrom={setFilterDateFrom} filterDateTo={filterDateTo} setFilterDateTo={setFilterDateTo} filterSubtype={filterSubtype} setFilterSubtype={setFilterSubtype} />
        <AssignLeadsModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} selectedLeadsCount={selectedLeads.length} onAssign={handleAssign} />
        {isModalOpen && <AddLeadPopup isOpen={isModalOpen} onClose={handleCloseModal} leadToEdit={leadToEdit} />}
        {showBulkUploadPopup && <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />}
      </div>
    </DashboardLayout>
  );
}