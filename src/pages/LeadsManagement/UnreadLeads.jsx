import React, { useState } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Download, Upload, Filter, UserPlus, List, Trash2, Users, Server, Type, Phone, Loader2, MailQuestion } from "lucide-react";
import AddLeadPopup from "../../components/AddNewLeads/AddNewLead";
import FilterPopup from "../../pages/LeadsManagement/FilterPopup";
import LeadsListView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../components/NumberCard";
import { useGetLeadsQuery, useDeleteLeadMutation } from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function UnreadLeads() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const itemsPerPage = 7;
  const [leadToEdit, setLeadToEdit] = useState(null);

  const { data: leadsResponse, isLoading, isError } = useGetLeadsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: filterStatus,
    tag: filterTag,
    type: filterType,
    subview: 'unread'
  });

  const [deleteLead] = useDeleteLeadMutation();

  const leadsData = leadsResponse?.leads || [];
  const totalLeads = leadsResponse?.pagination?.total || 0;
  const totalPages = leadsResponse?.pagination?.totalPages || 1;

  const handleLeadClick = (lead) => {
    navigate(`/crm/leads/profile/${lead.id}`, { state: { lead } });
  };

  const handleAddLead = () => { setLeadToEdit(null); setIsModalOpen(true); };
  const handleEditLead = (lead) => { setLeadToEdit(lead); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setLeadToEdit(null); };

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteLead(id).unwrap();
      toast.success("Lead deleted");
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    setSelectedLeads(selectedLeads.length === leadsData.length ? [] : leadsData.map(l => l.id));
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center bg-white border-b py-3 px-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Unread Leads</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome /> / CRM / <span className="text-[#FF7B1D] font-medium">Unread</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600 hover:bg-gray-50"}`}><List size={18} /></button>
              <button onClick={() => setView("grid")} className={`p-2 border-l border-gray-300 ${view === "grid" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600 hover:bg-gray-50"}`}><FiGrid size={18} /></button>
            </div>
            <button onClick={handleAddLead} className="bg-[#FF7B1D] text-white px-5 py-2.5 rounded-md flex items-center gap-2 font-semibold hover:bg-[#e06915] transition shadow-md">
              <UserPlus size={20} /> Add Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 px-6">
          <NumberCard title="Total Unread" number={totalLeads.toString()} icon={<MailQuestion className="text-blue-600" size={24} />} iconBgColor="bg-blue-100" lineBorderClass="border-blue-500" />
          <NumberCard title="Quick Filters" number="Unread" icon={<Server className="text-green-600" size={24} />} iconBgColor="bg-green-100" lineBorderClass="border-green-500" />
          <NumberCard title="Attention" number="High" icon={<Type className="text-orange-600" size={24} />} iconBgColor="bg-orange-100" lineBorderClass="border-orange-500" />
          <NumberCard title="Source" number="Varies" icon={<Phone className="text-purple-600" size={24} />} iconBgColor="bg-purple-100" lineBorderClass="border-purple-500" />
        </div>

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 font-bold text-orange-500 animate-bounce">Loading...</div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10 font-bold">Error loading leads.</div>
          ) : leadsData.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-100 shadow-sm">
              <MailQuestion size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-medium text-gray-500">All caught up! No unread leads.</h3>
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
                <div className="flex justify-center items-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => handlePageChange(p)} className={`px-4 py-2 border rounded-md transition-all ${currentPage === p ? "bg-orange-500 text-white" : "bg-white hover:bg-gray-100 text-gray-600"}`}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {isModalOpen && <AddLeadPopup isOpen={isModalOpen} onClose={handleCloseModal} leadToEdit={leadToEdit} />}
      </div>
    </DashboardLayout>
  );
}
