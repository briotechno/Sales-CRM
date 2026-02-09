import React, { useState, useEffect, useRef } from "react";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import { Download, Upload, Filter, UserPlus, List, Trash2, Users, Server, Type, Phone, Loader2, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import AddLeadPopup from "../../../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../../../components/AddNewLeads/BulkUpload";
import AssignLeadsModal from "../../../pages/LeadsManagement/AllLeadPagePart/AssignLeadModal";
import LeadsListView from "../../../pages/LeadsManagement/AllLeadPagePart/LeadsList";
import LeadsGridView from "../../../pages/LeadsManagement/AllLeadPagePart/LeadsGridView";
import NumberCard from "../../../components/NumberCard";
import { useGetLeadsQuery, useDeleteLeadMutation, useUpdateLeadMutation } from "../../../store/api/leadApi";
import { useGetPipelinesQuery } from "../../../store/api/pipelineApi";
import { useGetEmployeesQuery } from "../../../store/api/employeeApi";
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
  const [openLeadMenu, setOpenLeadMenu] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [filterSource, setFilterSource] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterIndustry, setFilterIndustry] = useState("All");
  const [filterPipeline, setFilterPipeline] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterSubtype, setFilterSubtype] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterCity, setFilterCity] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const itemsPerPage = 7;
  const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const dropdownRef = useRef(null);

  // Temporary filter states for the menu
  const [tempFilters, setTempFilters] = useState({
    type: filterType,
    priority: filterPriority,
    services: filterServices,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
    subtype: filterSubtype,
    status: filterStatus || "All",
    source: filterSource,
    owner: filterOwner,
    industry: filterIndustry,
    pipeline_id: filterPipeline,
    gender: filterGender,
    city: filterCity,
    value: filterValue,
  });

  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters({
        type: filterType,
        priority: filterPriority,
        services: filterServices,
        dateFrom: filterDateFrom,
        dateTo: filterDateTo,
        subtype: filterSubtype,
        status: filterStatus || "All",
        source: filterSource,
        owner: filterOwner,
        industry: filterIndustry,
        pipeline_id: filterPipeline,
        gender: filterGender,
        city: filterCity,
        value: filterValue,
      });
    }
  }, [isFilterOpen, filterType, filterPriority, filterServices, filterDateFrom, filterDateTo, filterSubtype, filterStatus, filterSource, filterOwner, filterIndustry, filterPipeline, filterGender, filterCity, filterValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyFilters = () => {
    setFilterType(tempFilters.type);
    setFilterPriority(tempFilters.priority);
    setFilterServices(tempFilters.services);
    setFilterDateFrom(tempFilters.dateFrom);
    setFilterDateTo(tempFilters.dateTo);
    setFilterSubtype(tempFilters.subtype);
    setFilterStatus(tempFilters.status);
    setFilterSource(tempFilters.source);
    setFilterOwner(tempFilters.owner);
    setFilterIndustry(tempFilters.industry);
    setFilterPipeline(tempFilters.pipeline_id);
    setFilterGender(tempFilters.gender);
    setFilterCity(tempFilters.city);
    setFilterValue(tempFilters.value);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempFilters({
      type: "All",
      priority: "All",
      services: "All",
      dateFrom: "",
      dateTo: "",
      subtype: "All",
      status: "All",
      source: "All",
      owner: "All",
      industry: "All",
      pipeline_id: "",
      gender: "All",
      city: "",
      value: "",
    });
  };

  const { data: pipelines } = useGetPipelinesQuery();
  const { data: employeesData } = useGetEmployeesQuery({ limit: 100 });
  const employees = employeesData?.employees || [];

  // RTK Query hooks
  const { data: leadsResponse, isLoading, isError, refetch } = useGetLeadsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: filterStatus,
    tag: filterTag,
    type: filterType,
    priority: filterPriority,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
    pipeline_id: filterPipeline,
    source: filterSource,
    owner: filterOwner,
    industry: filterIndustry,
    gender: filterGender,
    city: filterCity,
    value: filterValue,
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
    a.download = `all_leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">Leads Management</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400">CRM / </span>
                  <span className="text-[#FF7B1D] font-medium">
                    All Leads
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Toggles */}
                <div className="flex p-1 bg-gray-100 rounded-sm">
                  <button
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded-sm transition-all ${view === "list"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded-sm transition-all ${view === "grid"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <FiGrid size={18} />
                  </button>
                </div>

                {/* Filter - Icon Only */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 border rounded-sm transition-all shadow-sm ${isFilterOpen
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500"
                      : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                      }`}
                    title="Filters"
                  >
                    <Filter size={18} className={isFilterOpen ? "text-white" : "text-orange-500"} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[480px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 capitalize">Filter Options</span>
                        <button
                          onClick={handleResetFilters}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset all
                        </button>
                      </div>

                      {/* Content - Scrollable */}
                      <div className="max-h-[70vh] overflow-y-auto p-5">
                        <div className="space-y-6">
                          {/* Navigation Section */}
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-3 border-b pb-1">Lead Categories</span>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { name: "All Leads", path: "/crm/leads/all", icon: <Users size={16} /> },
                                { name: "New Leads", path: "/crm/leads/new", icon: <UserPlus size={16} /> },
                                { name: "Not Connected", path: "/crm/leads/not-connected", icon: <Server size={16} /> },
                                { name: "Follow Up", path: "/crm/leads/follow-up", icon: <Loader2 size={16} /> },
                                { name: "Missed", path: "/crm/leads/missed", icon: <Phone size={16} /> },
                                { name: "Assigned", path: "/crm/leads/assigned", icon: <UserPlus size={16} /> },
                                { name: "Dropped", path: "/crm/leads/dropped", icon: <Trash2 size={16} /> },
                                { name: "Duplicates", path: "/crm/leads/duplicates", icon: <Trash2 size={16} /> },
                                { name: "Trending", path: "/crm/leads/trending", icon: <Users size={16} /> },
                                { name: "Won", path: "/crm/leads/won", icon: <UserPlus size={16} /> },
                                { name: "Analysis", path: "/crm/leads/analysis", icon: <Server size={16} /> },
                              ].map((cat) => (
                                <button
                                  key={cat.path}
                                  onClick={() => navigate(cat.path)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all text-left ${window.location.pathname === cat.path
                                    ? "bg-orange-50 text-orange-600 font-bold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                  <span className={window.location.pathname === cat.path ? "text-orange-500" : "text-gray-400"}>
                                    {cat.icon}
                                  </span>
                                  {cat.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6 pt-2 border-t">
                            {/* Lead Type */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                                Lead Type
                              </label>
                              <select
                                value={tempFilters.type}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Types</option>
                                <option value="Person">Person</option>
                                <option value="Organization">Organization</option>
                              </select>
                            </div>

                            {/* Priority */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                                Priority
                              </label>
                              <select
                                value={tempFilters.priority}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, priority: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </div>

                            {/* Lead Source */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                                Lead Source
                              </label>
                              <select
                                value={tempFilters.source}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, source: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Sources</option>
                                <option value="Website">Website</option>
                                <option value="Referral">Referral</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Advertisement">Advertisement</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* Lead Owner */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                                Lead Owner
                              </label>
                              <select
                                value={tempFilters.owner}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, owner: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Owners</option>
                                {employees.map(emp => (
                                  <option key={emp.id} value={emp.user_id || emp.id}>{emp.employee_name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Industry */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                                Industry
                              </label>
                              <select
                                value={tempFilters.industry}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, industry: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Industries</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Retail">Retail</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* Pipeline */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                                Pipeline
                              </label>
                              <select
                                value={tempFilters.pipeline_id}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, pipeline_id: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="">All Pipelines</option>
                                {pipelines?.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Gender */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-500 block mb-1">Gender</label>
                              <select
                                value={tempFilters.gender}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, gender: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              >
                                <option value="All">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* City */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-500 block mb-1">City</label>
                              <input
                                type="text"
                                value={tempFilters.city}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="Enter city"
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              />
                            </div>

                            {/* Budget/Value */}
                            <div>
                              <label className="text-[11px] font-bold text-gray-500 block mb-1">Expected Value</label>
                              <input
                                type="number"
                                value={tempFilters.value}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, value: e.target.value }))}
                                placeholder="Enter value"
                                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
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

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm capitalize"
                >
                  <Download size={18} className="text-orange-500" />
                  Export
                </button>

                {/* Add Lead - Primary Button */}
                <div className="relative">
                  <button
                    onClick={() => setOpenLeadMenu(!openLeadMenu)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-semibold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 capitalize"
                  >
                    <UserPlus size={20} />
                    Add Lead
                  </button>

                  {openLeadMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-sm z-50 overflow-hidden divide-y divide-gray-100">
                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          handleAddLead();
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-sm font-semibold text-gray-700 hover:text-orange-600 transition capitalize"
                      >
                        <UserPlus size={16} />
                        Add Single Lead
                      </button>

                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          setShowBulkUploadPopup(true);
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-sm font-semibold text-gray-700 hover:text-orange-600 transition capitalize"
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
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <NumberCard title="Total Leads" number={totalLeads.toString()} icon={<Users className="text-blue-600" size={24} />} iconBgColor="bg-blue-100" lineBorderClass="border-blue-500" />
            <NumberCard title="Quick Filters" number="All" icon={<Server className="text-green-600" size={24} />} iconBgColor="bg-green-100" lineBorderClass="border-green-500" />
            <NumberCard title="Avg Value" number="-" icon={<Type className="text-orange-600" size={24} />} iconBgColor="bg-orange-100" lineBorderClass="border-orange-500" />
            <NumberCard title="Priority" number="Mix" icon={<Phone className="text-purple-600" size={24} />} iconBgColor="bg-purple-100" lineBorderClass="border-purple-500" />
          </div>

          {selectedLeads.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4 flex justify-between items-center animate-fadeIn">
              <span className="font-semibold text-orange-800 text-lg capitalize">{selectedLeads.length} Lead(s) Selected</span>
              <div className="flex gap-3">
                <button onClick={handleAssignLeads} className="bg-white border border-orange-300 text-orange-600 px-4 py-2 rounded-sm font-semibold hover:bg-orange-50 transition capitalize flex items-center gap-2"><UserPlus size={18} /> Assign Leads</button>
                <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition capitalize flex items-center gap-2"><Trash2 size={18} /> Delete Selected</button>
              </div>
            </div>
          )}

          <div className="pb-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-orange-500" /></div>
            ) : isError ? (
              <div className="text-center text-red-500 py-10 capitalize">Failed to load leads.</div>
            ) : leadsData.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 capitalize">No Leads Found</h3>
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
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-sm border border-gray-200 gap-4">
                    <p className="text-xs font-semibold text-gray-500 capitalize tracking-wider">
                      Showing <span className="text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-800">{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of <span className="text-gray-800">{totalLeads}</span> leads
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <ChevronLeft size={18} className="text-gray-600 group-hover:text-orange-500" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-400 px-1">...</span>}
                              <button
                                onClick={() => handlePageChange(p)}
                                className={`w-9 h-9 border rounded-sm text-xs font-bold transition-all ${currentPage === p
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-md"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-600"
                                  }`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          ))
                        }
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <ChevronRight size={18} className="text-gray-600 group-hover:text-orange-500" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <AssignLeadsModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} selectedLeadsCount={selectedLeads.length} onAssign={handleAssign} />
        {isModalOpen && <AddLeadPopup isOpen={isModalOpen} onClose={handleCloseModal} leadToEdit={leadToEdit} />}
        {showBulkUploadPopup && <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />}
      </div>
    </DashboardLayout>
  );
}
