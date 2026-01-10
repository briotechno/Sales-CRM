import React, { useState } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { TrendingUp, Users, Server, Type, Loader2, List, UserPlus, Flame } from "lucide-react";
import AddLeadPopup from "../../components/AddNewLeads/AddNewLead";
import LeadsListView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../components/NumberCard";
import { useGetLeadsQuery, useDeleteLeadMutation } from "../../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function TrendingLeads() {
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
    subview: 'trending'
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

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center bg-white border-b py-3 px-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-800 flex items-center gap-2">
              Trending Leads <Flame className="text-orange-500 fill-orange-500" />
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome /> / CRM / <span className="text-orange-500 font-medium">Trending</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
              <button onClick={() => setView("list")} className={`p-2 transition ${view === "list" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600 hover:bg-gray-50"}`}><List size={18} /></button>
              <button onClick={() => setView("grid")} className={`p-2 transition border-l border-gray-300 ${view === "grid" ? "bg-orange-50 text-[#FF7B1D]" : "text-gray-600 hover:bg-gray-50"}`}><FiGrid size={18} /></button>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-5 py-2.5 rounded-md flex items-center gap-2 font-bold shadow-lg hover:from-orange-500 hover:to-orange-700 transition">
              <UserPlus size={20} /> Add Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6 px-6">
          <NumberCard title="Hot Leads" number={totalLeads.toString()} icon={<TrendingUp className="text-red-600" size={24} />} iconBgColor="bg-red-100" lineBorderClass="border-red-500" />
          <NumberCard title="Quick Filters" number="Trending" icon={<Server className="text-green-600" size={24} />} iconBgColor="bg-green-100" lineBorderClass="border-green-500" />
          <NumberCard title="Conversion Hint" number="High" icon={<Flame className="text-orange-500" size={24} />} iconBgColor="bg-orange-100" lineBorderClass="border-orange-500" />
          <NumberCard title="Value Insight" number="Premium" icon={<Type className="text-blue-600" size={24} />} iconBgColor="bg-blue-100" lineBorderClass="border-blue-500" />
        </div>

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">Error loading trending leads.</div>
          ) : leadsData.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
              <TrendingUp size={48} className="text-gray-200 mb-2" />
              <h3 className="text-xl font-medium text-gray-400 uppercase tracking-widest">No Active Trends Found</h3>
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
                  handleDeleteLead={async (id) => { if (window.confirm('Delete?')) { await deleteLead(id).unwrap(); toast.success('Deleted'); } }}
                  handleEditLead={handleEditLead}
                />
              ) : (
                <LeadsGridView leadsData={leadsData} filterStatus="All" handleLeadClick={handleLeadClick} selectedLeads={selectedLeads} handleSelectLead={(id) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])} />
              )}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded-md font-bold transition ${currentPage === p ? "bg-orange-600 text-white shadow-md scale-105" : "bg-white text-gray-500 hover:bg-gray-50"}`}>{p}</button>
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
