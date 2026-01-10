import React, { useState } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Trash2, Users, Server, Type, Loader2, List, UserPlus } from "lucide-react";
import AddLeadPopup from "../../components/AddNewLeads/AddNewLead";
import LeadsListView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../components/NumberCard";
import { useGetLeadsQuery, useDeleteLeadMutation } from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function DroppedLeads() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const itemsPerPage = 7;
  const [leadToEdit, setLeadToEdit] = useState(null);

  const { data: leadsResponse, isLoading, isError } = useGetLeadsQuery({
    page: currentPage,
    limit: itemsPerPage,
    subview: 'dropped'
  });

  const [deleteLead] = useDeleteLeadMutation();

  const leadsData = leadsResponse?.leads || [];
  const totalLeads = leadsResponse?.pagination?.total || 0;
  const totalPages = leadsResponse?.pagination?.totalPages || 1;

  const handleLeadClick = (lead) => {
    navigate(`/crm/leads/profile/${lead.id}`, { state: { lead } });
  };

  const handleEditLead = (lead) => { setLeadToEdit(lead); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setLeadToEdit(null); };

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteLead(id).unwrap();
      toast.success("Lead permanently removed");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center bg-white border-b py-3 px-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dropped Leads</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome /> / CRM / <span className="text-red-500 font-medium">Dropped</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600"}`}><List size={18} /></button>
              <button onClick={() => setView("grid")} className={`p-2 border-l border-gray-300 ${view === "grid" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600"}`}><FiGrid size={18} /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 px-6">
          <NumberCard title="Total Dropped" number={totalLeads.toString()} icon={<Trash2 className="text-red-600" size={24} />} iconBgColor="bg-red-100" lineBorderClass="border-red-500" />
          <NumberCard title="Status" number="Lost" icon={<Server className="text-gray-600" size={24} />} iconBgColor="bg-gray-100" lineBorderClass="border-gray-500" />
          <NumberCard title="Quick Filters" number="Dropped" icon={<Type className="text-orange-600" size={24} />} iconBgColor="bg-orange-100" lineBorderClass="border-orange-500" />
          <NumberCard title="Potential Loss" number="Variable" icon={<Users className="text-blue-600" size={24} />} iconBgColor="bg-blue-100" lineBorderClass="border-blue-500" />
        </div>

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-red-500" size={40} /></div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">Error fetching dropped leads.</div>
          ) : leadsData.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-xl font-medium text-gray-400">Great news! You have no dropped leads.</h3>
            </div>
          ) : (
            <>
              {view === "list" ? (
                <LeadsListView
                  currentLeads={leadsData}
                  selectedLeads={selectedLeads}
                  handleSelectAll={() => setSelectedLeads(selectedLeads.length === leadsData.length ? [] : leadsData.map(l => l.id))}
                  handleSelectLead={(id) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])}
                  handleLeadClick={handleLeadClick}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  handleDeleteLead={handleDeleteLead}
                  handleEditLead={handleEditLead}
                />
              ) : (
                <LeadsGridView leadsData={leadsData} filterStatus="All" handleLeadClick={handleLeadClick} selectedLeads={selectedLeads} handleSelectLead={(id) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])} />
              )}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded border font-semibold transition ${currentPage === p ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{p}</button>
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
