import React, { useState } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import { Download, Upload, Filter, UserPlus, List, Trash2, FileText, Users, CheckCircle, Clock, DollarSign, Workflow, Server, Type, Phone } from "lucide-react";
import AddLeadPopup from "../../../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../../../components/AddNewLeads/BulkUpload";
import FilterPopup from "../../../pages/LeadsManagement/FilterPopup";
import AssignLeadsModal from "../../../pages/LeadsManagement/AllLeadPagePart/AssignLeadModal";
import LeadsListView from "../../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../../components/NumberCard";

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

  const [leadsData, setLeadsData] = useState([
    {
      id: "L001",
      name: "Linda White",
      email: "linda@gmail.com",
      phone: "(193) 7839 748",
      type: "Person",
      createdAt: "2025-11-10 10:35 AM",
      status: "Active",
      visibility: "Public",
      tag: "Contacted",
      value: 3500000,
      location: "Austin, United States",
      priority: "High",
      services: "Consulting",
      pipeline: "Sales",
      calls: 5,
      date: "2025-11-10",
    },
    {
      id: "L002",
      name: "Emily Johnson",
      email: "emily@gmail.com",
      phone: "(179) 7382 829",
      type: "Person",
      createdAt: "2025-11-11 12:15 PM",
      status: "Active",
      visibility: "Private",
      tag: "Not Contacted",
      value: 3500000,
      location: "Newyork, United States",
      priority: "Medium",
      services: "Development",
      pipeline: "Marketing",
      calls: 2,
      date: "2025-11-11",
    },
    {
      id: "L003",
      name: "John Smith",
      email: "john@gmail.com",
      phone: "(123) 4567 890",
      type: "Person",
      createdAt: "2025-11-12 09:42 AM",
      status: "Active",
      visibility: "Public",
      tag: "Closed",
      value: 3200000,
      location: "Chester, United Kingdom",
      priority: "Low",
      services: "Support",
      pipeline: "Sales",
      calls: 8,
      date: "2025-11-12",
    },
    {
      id: "L004",
      name: "Michael Brown",
      email: "micael@gmail.com",
      phone: "(184) 2719 738",
      type: "Organization",
      createdAt: "2025-11-12 11:20 AM",
      status: "Active",
      visibility: "Public",
      tag: "Lost",
      value: 4100000,
      location: "London, United Kingdom",
      priority: "High",
      services: "Consulting",
      pipeline: "Support",
      calls: 3,
      date: "2025-11-12",
    },
    {
      id: "L005",
      name: "Chris Johnson",
      email: "chris@gmail.com",
      phone: "(162) 8920 713",
      type: "Person",
      createdAt: "2025-11-13 02:15 PM",
      status: "Active",
      visibility: "Private",
      tag: "Contacted",
      value: 3500000,
      location: "Atlanta, United States",
      priority: "Medium",
      services: "Development",
      pipeline: "Sales",
      calls: 6,
      date: "2025-11-13",
    },
    {
      id: "L006",
      name: "Maria Garcia",
      email: "maria@gmail.com",
      phone: "(120) 3728 039",
      type: "Person",
      createdAt: "2025-11-13 03:45 PM",
      status: "Active",
      visibility: "Public",
      tag: "Not Contacted",
      value: 4100000,
      location: "Denver, United States",
      priority: "High",
      services: "Consulting",
      pipeline: "Marketing",
      calls: 1,
      date: "2025-11-13",
    },
    {
      id: "L007",
      name: "David Lee",
      email: "david@gmail.com",
      phone: "(183) 9302 890",
      type: "Person",
      createdAt: "2025-11-14 09:30 AM",
      status: "Active",
      visibility: "Public",
      tag: "Closed",
      value: 3100000,
      location: "Charlotte, United States",
      priority: "Low",
      services: "Support",
      pipeline: "Sales",
      calls: 4,
      date: "2025-11-14",
    },
    {
      id: "L008",
      name: "Karen Davis",
      email: "darleeo@gmail.com",
      phone: "(163) 2459 315",
      type: "Organization",
      createdAt: "2025-11-14 11:00 AM",
      status: "Inactive",
      visibility: "Private",
      tag: "Lost",
      value: 4000000,
      location: "Detroit, United States",
      priority: "Medium",
      services: "Development",
      pipeline: "Support",
      calls: 7,
      date: "2025-11-14",
    },
  ]);

  const handleLeadClick = (lead) => {
    navigate(`/crm/leads/profile/:id${lead.id}`, { state: { lead } });
  };

  const handleAddLead = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNewLead = (newLead) => {
    const newId = `L${String(leadsData.length + 1).padStart(3, "0")}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours() % 12 || 12
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"
      }`;

    setLeadsData([
      ...leadsData,
      {
        id: newId,
        ...newLead,
        createdAt: formattedDate,
        calls: 0,
      },
    ]);
  };

  const handleDeleteLead = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeadsData(leadsData.filter((lead) => lead.id !== id));
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedLeads.length === 0) {
      alert("Please select leads to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedLeads.length} lead(s)?`
      )
    ) {
      setLeadsData(
        leadsData.filter((lead) => !selectedLeads.includes(lead.id))
      );
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(currentLeads.map((lead) => lead.id));
    }
  };

  const handleAssignLeads = () => {
    if (selectedLeads.length === 0) {
      alert("Please select leads to assign");
      return;
    }
    setIsAssignModalOpen(true);
  };

  const handleAssign = (assignmentData) => {
    const totalRecipients =
      assignmentData.teams.length + assignmentData.employees.length;

    alert(
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
      "Services",
      "Pipeline",
      "Calls",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.id,
          `"${lead.name}"`,
          lead.email,
          lead.phone,
          lead.type,
          `"${lead.createdAt}"`,
          lead.status,
          lead.tag,
          lead.value,
          lead.priority,
          lead.services,
          lead.pipeline,
          lead.calls,
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

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesStatus =
      filterStatus === "All" || lead.status === filterStatus;
    const matchesTag = filterTag === "All" || lead.tag === filterTag;
    const matchesType = filterType === "All" || lead.type === filterType;
    const matchesPriority =
      filterPriority === "All" || lead.priority === filterPriority;
    const matchesServices =
      filterServices === "All" || lead.services === filterServices;
    return (
      matchesSearch &&
      matchesStatus &&
      matchesTag &&
      matchesType &&
      matchesPriority &&
      matchesServices
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <DashboardLayout>
      <div className="p-0 ml-6 bg-gray-0 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3 bg-white border-b py-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Leads Management
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> CRM /{" "}
              <span className="text-[#FF7B1D] font-medium">All Leads</span>
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
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Filter size={18} />
              More Filters
            </button>

            <div className="flex border border-gray-300 rounded-sm overflow-hidden ml-2">
              <button
                onClick={() => setView("list")}
                className={`p-2 transition ${view === "list"
                  ? "bg-[#FF7B1D] text-white"
                  : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                <List size={18} />
              </button>

              <button
                onClick={() => setView("grid")}
                className={`p-2 transition border-l border-gray-300 ${view === "grid"
                  ? "bg-[#FF7B1D] text-white"
                  : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                <FiGrid size={18} />
              </button>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
            >
              <Download size={18} />
              Export
            </button>

            <div className="flex flex-col sm:flex-row gap-3 relative">
              <button
                onClick={() => setOpenLeadMenu(!openLeadMenu)}
                className="bg-[#F26422] text-white px-6 py-2.5 rounded-sm flex items-center justify-center gap-2 font-semibold hover:bg-[#d95a1f] transition-all shadow-sm hover:shadow-lg"
              >
                <UserPlus size={20} /> Add Lead
              </button>

              {openLeadMenu && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border shadow-md rounded-sm z-50">
                  <button
                    onClick={() => {
                      setOpenLeadMenu(false);
                      handleAddLead();
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <UserPlus size={16} />
                    Single Lead
                  </button>

                  <button
                    onClick={() => {
                      setOpenLeadMenu(false);
                      handleBulkUpload();
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <Upload size={16} />
                    Bulk Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

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

        {/* Statement Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-3">
          <NumberCard
            title="Total Clients"
            number={"248"}
            icon={<Users className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Total Service"
            number={"186"}
            icon={<Server className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Total Type"
            number={"18"}
            icon={<Type className="text-orange-600" size={24} />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
          <NumberCard
            title="Total Calls"
            number={"24"}
            icon={<Phone className="text-purple-600" size={24} />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
        </div>
        
        {/* Action Bar with Selection */}
        {selectedLeads.length > 0 && (
          <div className="bg-orange-500 text-white p-4 rounded-sm mb-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                {selectedLeads.length} Lead(s) Selected
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAssignLeads}
                className="flex items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-sm font-semibold hover:bg-gray-100 transition"
              >
                <UserPlus size={18} />
                Assign Leads
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition"
              >
                <Trash2 size={18} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* List or Grid View */}
        {view === "list" ? (
          <LeadsListView
            currentLeads={currentLeads}
            selectedLeads={selectedLeads}
            handleSelectAll={handleSelectAll}
            handleSelectLead={handleSelectLead}
            handleLeadClick={handleLeadClick}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
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
        {view === "list" && filteredLeads.length > 0 && (

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
            onAdd={handleAddNewLead}
          />
        )}

        {showBulkUploadPopup && (
          <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />
        )}
      </div>
    </DashboardLayout>
  );
}
