import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiHome, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Upload,
  Filter,
  UserPlus,
  List,
  Trash2,
  Users,
  Server,
  Type,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  AlertCircle,
  PlusIcon,
  Edit,
  Eye,
  TrendingUp,
  Inbox,
  PhoneIncoming,
  Clock,
  QrCode,
  Calendar
} from "lucide-react";
import Modal from "../../components/common/Modal";
import AddLeadPopup from "../../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../../components/AddNewLeads/BulkUpload";
import AssignLeadsModal from "../../pages/LeadsManagement/AllLeadPagePart/AssignLeadModal";
import { useGetLeadsQuery, useDeleteLeadMutation, useUpdateLeadMutation, useHitCallMutation, useManualAssignLeadsMutation } from "../../store/api/leadApi";
import { useGetPipelinesQuery } from "../../store/api/pipelineApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import NumberCard from "../../components/NumberCard";
import CallActionPopup from "../../components/AddNewLeads/CallActionPopup";
import CallQrModal from "../../components/LeadManagement/CallQrModal";

const WorkStationLeadsListView = ({
  currentLeads,
  selectedLeads,
  handleSelectAll,
  handleSelectLead,
  handleLeadClick,
  handleEditLead,
  handleDeleteLead,
  handleHitCall
}) => {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-10">
              <input
                type="checkbox"
                checked={selectedLeads.length === currentLeads.length && currentLeads.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer accent-orange-500"
              />
            </th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Lead ID</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Full Name</th>
            <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 capitalize whitespace-nowrap">Mobile Number</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Interested In</th>
            <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 capitalize whitespace-nowrap">Lead Status</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Pipeline Stages</th>
            <th className="py-3 px-4 font-semibold border-b border-orange-400 capitalize text-center whitespace-nowrap">Call Hits</th>
            <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 capitalize whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentLeads.length > 0 ? (
            currentLeads.map((lead) => (
              <tr key={lead.id} className="border-t hover:bg-gray-50 transition-colors group">
                <td className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    className="w-4 h-4 cursor-pointer accent-orange-500"
                  />
                </td>
                <td
                  className="py-3 px-4 text-orange-600 hover:text-orange-800 cursor-pointer font-semibold text-sm text-left whitespace-nowrap font-primary"
                  onClick={() => handleLeadClick(lead)}
                >
                  {lead.lead_id || lead.id}
                </td>
                <td className="py-3 px-4 text-gray-800 hover:text-orange-600 cursor-pointer text-sm font-bold text-left" onClick={() => handleLeadClick(lead)} title={lead.name || lead.full_name || lead.organization_name}>
                  {((name) => name.length > 25 ? name.substring(0, 25) + "..." : name)(lead.name || lead.full_name || lead.organization_name || "Untitled Lead")}
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <span>{lead.mobile_number || lead.phone || "--"}</span>
                    {lead.mobile_number || lead.phone ? (
                      <button
                        onClick={() => handleHitCall && handleHitCall(lead)}
                        className="p-1 hover:bg-orange-50 rounded-full text-orange-500 transition-colors"
                        title="View QR"
                      >
                        <QrCode size={16} />
                      </button>
                    ) : null}
                  </div>
                </td>
                <td className="py-3 px-4 text-left">
                  <div className="flex flex-wrap gap-1">
                    {lead.interested_in ? (
                      (Array.isArray(lead.interested_in) ? lead.interested_in : lead.interested_in.split(',')).map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-sm text-[10px] font-bold border border-gray-200 uppercase">
                          {item.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-[10px]">--</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-1 rounded-[2px] text-[10px] font-bold border uppercase tracking-wider ${((tag, isTrending, status) => {
                      let s = tag || status || "New Lead";
                      if (s === "Not Contacted") s = "New Lead";
                      if (isTrending) return "bg-orange-100 text-orange-600 border-orange-200";
                      switch (s.toLowerCase()) {
                        case "new lead": case "new": case "new leads": return "bg-blue-100 text-blue-600 border-blue-200";
                        case "not connected": return "bg-purple-100 text-purple-600 border-purple-200";
                        case "follow up": return "bg-yellow-100 text-yellow-600 border-yellow-200";
                        case "won": case "closed": return "bg-green-100 text-green-600 border-green-200";
                        case "dropped": case "lost": return "bg-red-100 text-red-600 border-red-200";
                        default: return "bg-gray-100 text-gray-600 border-gray-200";
                      }
                    })(lead.tag, lead.is_trending, lead.status)}`}>
                      {lead.is_trending === 1 ? "Trending" : (lead.tag || lead.status || "New Lead")}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold font-primary">
                      {(lead.rawUpdated || lead.last_call_at || lead.updated_at) ? new Date(lead.rawUpdated || lead.last_call_at || lead.updated_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }).toUpperCase() : "--"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-left">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">{lead.pipeline_name || "General"}</span>
                    <span className="text-[10px] text-[#FF7B1D] font-bold italic">{lead.stage_name || "New"}</span>
                    <span className="text-[10px] text-gray-500 font-semibold mt-1 font-primary">
                      {(lead.rawCreated || lead.created_at) ? new Date(lead.rawCreated || lead.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }).toUpperCase() : "--"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-gray-700 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm">{lead.call_count || 0}</span>
                    <span className="text-[9px] text-gray-400 font-normal">Hits</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => handleHitCall && handleHitCall(lead)} className="p-1.5 bg-orange-50 hover:bg-orange-500 rounded-sm text-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-500 shadow-sm" title="Call">
                      <Phone size={16} />
                    </button>
                    <a
                      href={((lead.mobile_number || lead.phone || '').replace(/\D/g, '')) ? `https://wa.me/${(lead.mobile_number || lead.phone || '').replace(/\D/g, '')}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-green-50 hover:bg-green-500 rounded-sm text-green-600 hover:text-white transition-all border border-green-100 hover:border-green-500 shadow-sm"
                      title="WhatsApp"
                    >
                      <FaWhatsapp size={16} />
                    </a>
                    <a
                      href={lead.email ? `mailto:${lead.email}` : '#'}
                      className="p-1.5 bg-blue-50 hover:bg-blue-500 rounded-sm text-blue-600 hover:text-white transition-all border border-blue-100 hover:border-blue-500 shadow-sm"
                      title="Email"
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="py-12 text-center text-gray-500 font-medium text-sm">No leads found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const WorkStationLeadsGridView = ({
  leadsData,
  filterStatus,
  handleLeadClick,
  selectedLeads,
  handleSelectLead,
  handleHitCall,
  employees = []
}) => {
  const groupTags = ["New Leads", "Not Connected", "Follow Up", "Trending"];

  const getAvatarBg = (tag) => {
    switch (tag) {
      case "Follow Up": return "bg-amber-500";
      case "Not Connected": return "bg-purple-500";
      case "Trending": return "bg-orange-500";
      default: return "bg-blue-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low": return "bg-teal-50 text-teal-700 border-teal-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const calculateProfileCompletion = (lead) => {
    const fields = [
      'name', 'email', 'mobile_number', 'whatsapp_number',
      'address', 'city', 'state', 'pincode',
      'organization_name', 'interested_in',
      'gender', 'dob', 'lead_source', 'description'
    ];
    const filledFields = fields.filter(field => lead[field] && lead[field].toString().trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groupTags.map((groupTag) => {
        let tagLeads = leadsData.filter((lead) => {
          const isTrending = lead.is_trending === 1 || lead.priority === "High" || (lead.tag && (lead.tag === "Trending" || lead.tag === "High Priority"));
          const isFollowUp = lead.tag === "Follow Up";
          const isNotConnected = lead.tag === "Not Connected";
          const isNew = lead.tag === "Not Contacted" || lead.tag === "New Lead" || lead.tag === "New Leads" || lead.stage_name === "New" || !lead.tag;

          if (groupTag === "Trending") return isTrending;
          if (groupTag === "Follow Up") return isFollowUp;
          if (groupTag === "Not Connected") return isNotConnected;
          if (groupTag === "New Leads") return isNew;
          return false;
        }).filter(lead => filterStatus === "All" || (lead.tag || lead.status) === filterStatus);

        // Sorting Not Connected leads by next_call_at (soonest first)
        if (groupTag === "Not Connected") {
          tagLeads = [...tagLeads].sort((a, b) => {
            if (!a.next_call_at) return 1;
            if (!b.next_call_at) return -1;
            return new Date(a.next_call_at) - new Date(b.next_call_at);
          });
        }

        return (
          <div key={groupTag} className="flex flex-col group/column">
            <div className={`rounded-sm shadow-sm border border-gray-200 p-4 mb-4 border-t-4 bg-white transition-all duration-300 hover:shadow-md ${groupTag === 'Trending' ? 'border-t-orange-500 bg-orange-50/50' : groupTag === 'New Leads' ? 'border-t-blue-500 bg-blue-50/50' : groupTag === 'Not Connected' ? 'border-t-purple-500 bg-purple-50/50' : 'border-t-yellow-500 bg-yellow-50/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    {groupTag === 'New Leads' && <UserPlus size={18} className="text-blue-500" />}
                    {groupTag === 'Not Connected' && <PhoneIncoming size={18} className="text-purple-500" />}
                    {groupTag === 'Follow Up' && <Clock size={18} className="text-yellow-500" />}
                    {groupTag === 'Trending' && <TrendingUp size={18} className="text-orange-500" />}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">{groupTag}</h3>
                </div>
                <span className="bg-white text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">{tagLeads.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {tagLeads.length > 0 ? (
                tagLeads.map((lead) => {
                  const leadDisplayName = lead.name || lead.full_name || lead.organization_name || "L";
                  const initials = leadDisplayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  const cleanNumber = (lead.mobile_number || lead.phone || '').replace(/\D/g, '');
                  const waLink = cleanNumber ? `https://wa.me/${cleanNumber}` : '#';

                  return (
                    <div key={lead.id} className="bg-white border border-gray-300 rounded-sm shadow-sm hover:shadow-lg transition-all relative group flex flex-col overflow-hidden">
                      {/* Top Selection */}
                      <div className="absolute top-4 right-4 z-10">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="w-4 h-4 cursor-pointer accent-orange-500 rounded-sm border-gray-300 transition-all hover:scale-110"
                        />
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        {/* Lead Header */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-gray-100 shadow-sm overflow-hidden bg-white">
                            {lead.profile_image ? (
                              <img src={lead.profile_image} alt={leadDisplayName} className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full ${getAvatarBg(lead.tag)} flex items-center justify-center text-white text-base font-semibold capitalize`}>
                                {initials}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className="text-base font-bold text-gray-900 capitalize font-primary cursor-pointer hover:text-orange-600 transition-colors truncate max-w-[150px]"
                                onClick={() => handleLeadClick(lead)}
                                title={leadDisplayName}
                              >
                                {leadDisplayName}
                              </h3>
                              <span className="text-[10px] text-orange-600 font-bold px-2 py-0.5 rounded-sm bg-orange-50 border border-orange-100 whitespace-nowrap capitalize">
                                {lead.lead_id || lead.id}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] font-semibold font-primary text-gray-500 whitespace-nowrap capitalize">
                                <Calendar size={12} className="text-orange-500" />
                                {(lead.rawCreated || lead.created_at) ? new Date(lead.rawCreated || lead.created_at).toLocaleDateString('en-IN', {
                                  day: '2-digit', month: 'short', year: 'numeric'
                                }) : "--"}
                              </div>
                            </div>

                            {lead.next_call_at && (groupTag === "Not Connected" || groupTag === "Follow Up") && (
                              <div className="mt-1.5 text-[11px] text-orange-700 font-semibold flex items-center gap-1.5 font-primary bg-orange-50 px-2 py-1 rounded-sm border border-orange-100 w-fit capitalize">
                                <Clock size={12} className="text-orange-500" />
                                <span className="text-orange-600">Next:</span>
                                {new Date(lead.next_call_at).toLocaleString('en-IN', {
                                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pipeline info */}
                        <div className="bg-gray-50/80 rounded-sm p-3 border border-gray-200">
                          <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-[12px] font-bold text-gray-500 capitalize font-primary tracking-tight mb-1">Pipeline</span>
                              <span className="text-sm font-bold text-gray-800 font-primary truncate max-w-[130px] capitalize">{lead.pipeline_name || "General"}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[12px] font-bold text-gray-500 capitalize font-primary tracking-tight mb-1">Stage</span>
                              <span className="text-sm text-[#FF7B1D] font-bold italic font-primary capitalize">{lead.stage_name || "New"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Profile Strength */}
                        <div className="w-full space-y-2">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[12px] font-bold text-gray-500 capitalize font-primary tracking-wider">Lead Profile</span>
                            <span className={`text-[12px] font-bold font-primary ${calculateProfileCompletion(lead) > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                              {calculateProfileCompletion(lead)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${calculateProfileCompletion(lead) > 70 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`}
                              style={{ width: `${calculateProfileCompletion(lead)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Stats & Info */}
                      <div className="bg-gray-50 p-4 space-y-4 border-t border-gray-200 mt-auto">
                        <div className="flex justify-between items-center text-center border-b border-gray-300/60 pb-3.5">
                          <div className="flex-1 border-r border-gray-300/60 pr-2">
                            <p className="text-[12px] text-[#FF7B1D] font-bold tracking-tight font-primary capitalize">Hits</p>
                            <p className="text-sm font-bold text-gray-900 mt-1 font-primary">{lead.call_count || 0}</p>
                          </div>
                          <div className="flex-1 border-r border-gray-300/60 px-2">
                            <p className="text-[12px] text-[#FF7B1D] font-bold tracking-tight font-primary capitalize">Priority</p>
                            <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-[2px] mt-1 capitalize border font-primary ${getPriorityColor(lead.priority)}`}>
                              {lead.priority || 'Medium'}
                            </span>
                          </div>
                          <div className="flex-1 pl-2">
                            <p className="text-[12px] text-[#FF7B1D] font-bold tracking-tight font-primary capitalize">Source</p>
                            <p className="text-sm font-bold text-gray-800 mt-1 truncate font-primary capitalize">{lead.lead_source || "Direct"}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 max-w-[65%]">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-sm border border-gray-200 bg-white">
                              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold text-[10px] capitalize">
                                {((lead.owner_name || lead.employee_name || employees.find(emp => (emp.user_id || emp.id) == lead.owner)?.employee_name || "A").charAt(0).toUpperCase())}
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[12px] text-gray-500 font-bold capitalize tracking-wider leading-none">Owner</span>
                              <span className="text-sm text-gray-800 font-bold truncate capitalize font-primary mt-1">
                                {lead.owner_name || lead.employee_name || employees.find(emp => (emp.user_id || emp.id) == lead.owner)?.employee_name || "Unassigned"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button onClick={() => handleHitCall && handleHitCall(lead)} className="p-2 bg-white hover:bg-orange-500 rounded-sm text-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-500 shadow-sm" title="Call">
                              <Phone size={14} />
                            </button>
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-green-500 rounded-sm text-green-600 hover:text-white transition-all border border-green-100 hover:border-green-500 shadow-sm" title="WhatsApp">
                              <FaWhatsapp size={14} />
                            </a>
                            <a href={lead.email ? `mailto:${lead.email}` : '#'} className="p-2 bg-white hover:bg-blue-500 rounded-sm text-blue-600 hover:text-white transition-all border border-blue-100 hover:border-blue-500 shadow-sm" title="Email">
                              <Mail size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 rounded-sm border border-dashed border-gray-200 bg-gray-50/30">
                  <Inbox className="text-gray-300 mb-2" size={24} />
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-primary">No Leads</h4>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function WorkStation() {
  const isLocked = useSelector((state) => state.ui.sidebarLocked);
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
  const [callPopupData, setCallPopupData] = useState({ isOpen: false, lead: null });
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedLeadForCall, setSelectedLeadForCall] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isAddMobileModalOpen, setIsAddMobileModalOpen] = useState(false);
  const [leadForMobileUpdate, setLeadForMobileUpdate] = useState(null);
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const addLeadMenuRef = useRef(null);

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
      if (addLeadMenuRef.current && !addLeadMenuRef.current.contains(event.target)) {
        setOpenLeadMenu(false);
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

  const { data: pipelinesData } = useGetPipelinesQuery({ limit: 1000 });
  const pipelines = pipelinesData?.pipelines || [];
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
    // subview: 'new', // Removed specific subview for general workstation view
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
  const [hitCallMutation] = useHitCallMutation();
  const [manualAssignLeads] = useManualAssignLeadsMutation();

  const handleHitCall = async (callData) => {
    try {
      await hitCallMutation(callData).unwrap();
      toast.success("Lead status updated based on call response");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update call status");
    }
  };

  const openCallAction = (lead) => {
    if (!lead.mobile_number && !lead.phone) {
      setLeadForMobileUpdate(lead);
      setNewMobileNumber("");
      setIsAddMobileModalOpen(true);
      return;
    }
    setSelectedLeadForCall(lead);
    setIsQrModalOpen(true);
  };

  const handleUpdateMobile = async () => {
    if (!newMobileNumber.trim()) {
      toast.error("Please enter a mobile number");
      return;
    }
    try {
      await updateLead({ id: leadForMobileUpdate.id, data: { mobile_number: newMobileNumber } }).unwrap();
      toast.success("Mobile number updated successfully");
      setIsAddMobileModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update mobile number");
    }
  };

  const handleProceedToLog = () => {
    setIsQrModalOpen(false);
    setCallPopupData({ isOpen: true, lead: selectedLeadForCall });
  };

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

  const handleDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      if (Array.isArray(leadToDelete)) {
        // Bulk delete
        await Promise.all(leadToDelete.map(id => deleteLead(id).unwrap()));
        toast.success("Selected leads deleted successfully");
        setSelectedLeads([]);
      } else {
        // Single delete
        await deleteLead(leadToDelete.id).unwrap();
        toast.success("Lead deleted successfully");
        setSelectedLeads(selectedLeads.filter((leadId) => leadId !== leadToDelete.id));
      }
      setShowDeleteModal(false);
      setLeadToDelete(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete lead");
      console.error(error);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to delete");
      return;
    }
    setLeadToDelete(selectedLeads);
    setShowDeleteModal(true);
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

  const handleAssign = async (assignmentData) => {
    try {
      await manualAssignLeads({
        leadIds: selectedLeads,
        employeeIds: assignmentData.employees,
        teamIds: assignmentData.teams
      }).unwrap();
      toast.success(`${selectedLeads.length} leads assigned successfully!`);
      setIsAssignModalOpen(false);
      setSelectedLeads([]);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to assign leads");
    }
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
    a.download = `workstation_leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white sticky top-0 z-30">
        <div className="max-w-8xl mx-auto px-4 py-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {filterStatus === "All" ? "Work Station" : `${filterStatus} Leads`}
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <FiHome className="text-gray-700" size={14} />
                <span className="text-gray-400">CRM / </span>
                <span className="text-[#FF7B1D] font-medium">
                  Work Station
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggles */}
              <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-sm shadow-sm">
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-sm transition-all ${view === "list"
                    ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded-sm transition-all ${view === "grid"
                    ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                  title="Grid View"
                >
                  <FiGrid size={18} />
                </button>
              </div>

              {/* Filter - Icon Only */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    if (filterStatus !== "All" || filterType !== "All" || filterPriority !== "All" || filterPipeline !== "" || filterCity !== "" || filterValue !== "" || filterDateFrom !== "" || filterDateTo !== "") {
                      handleResetFilters();
                      handleApplyFilters();
                    } else {
                      setIsFilterOpen(!isFilterOpen);
                    }
                  }}
                  className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || (filterStatus !== "All" || filterType !== "All" || filterPriority !== "All" || filterPipeline !== "" || filterCity !== "" || filterValue !== "" || filterDateFrom !== "" || filterDateTo !== "")
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  title="Filters"
                >
                  {(filterStatus !== "All" || filterType !== "All" || filterPriority !== "All" || filterPipeline !== "" || filterCity !== "" || filterValue !== "" || filterDateFrom !== "" || filterDateTo !== "") ? <AlertCircle size={18} /> : <Filter size={18} />}
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-[480px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center text-black">
                      <span className="text-sm font-bold capitalize">Filter Options</span>
                      <button
                        onClick={handleResetFilters}
                        className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-tighter"
                      >
                        Reset All
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
              {/* <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-sm text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm capitalize tracking-wider"
                >
                  <Download size={18} className="text-[#FF7B1D]" />
                  Export
                </button> */}

              {/* Add Lead Button */}
              <div className="relative" ref={addLeadMenuRef}>
                <button
                  onClick={() => setOpenLeadMenu(!openLeadMenu)}
                  className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <PlusIcon size={20} />
                  Add Lead
                </button>
                {openLeadMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-sm z-50 overflow-hidden divide-y divide-gray-100 animate-fadeIn">
                    <button
                      onClick={() => {
                        setOpenLeadMenu(false);
                        handleAddLead();
                      }}
                      className="w-full flex items-center gap-3 text-left px-5 py-3.5 hover:bg-orange-50 text-sm font-bold text-gray-700 hover:text-orange-600 transition font-primary"
                    >
                      <UserPlus size={18} />
                      Add Single Lead
                    </button>

                    <button
                      onClick={() => {
                        setOpenLeadMenu(false);
                        setShowBulkUploadPopup(true);
                      }}
                      className="w-full flex items-center gap-3 text-left px-5 py-3.5 hover:bg-orange-50 text-sm font-bold text-gray-700 hover:text-orange-600 transition font-primary"
                    >
                      <Upload size={18} />
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



        <div className="pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-orange-500" /></div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10 capitalize">Failed to load new leads.</div>
          ) : leadsData.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 capitalize">No Leads Found</h3>
            </div>
          ) : (
            <>
              {view === "list" ? (
                <WorkStationLeadsListView
                  currentLeads={leadsData}
                  selectedLeads={selectedLeads}
                  handleSelectAll={handleSelectAll}
                  handleSelectLead={handleSelectLead}
                  handleLeadClick={handleLeadClick}
                  handleDeleteLead={handleDeleteLead}
                  handleEditLead={handleEditLead}
                  handleHitCall={openCallAction}
                />
              ) : (
                <WorkStationLeadsGridView
                  leadsData={leadsData}
                  filterStatus={filterStatus}
                  handleLeadClick={handleLeadClick}
                  selectedLeads={selectedLeads}
                  handleSelectLead={handleSelectLead}
                  handleHitCall={openCallAction}
                  employees={employees}
                />
              )}

              {totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 shadow-sm animate-fadeIn">
                  <p className="text-sm font-semibold text-gray-700">
                    Showing <span className="text-orange-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of <span className="text-orange-600 font-bold">{totalLeads}</span> Leads
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 text-[11px] uppercase tracking-wider ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                        }`}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                        .map((p, i, arr) => (
                          <React.Fragment key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-400 px-1">...</span>}
                            <button
                              onClick={() => handlePageChange(p)}
                              className={`w-10 h-10 rounded-sm font-bold transition text-xs ${currentPage === p
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
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
                      className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 text-[11px] uppercase tracking-wider ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                        }`}
                    >
                      Next
                      <ChevronRight size={16} />
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
      {callPopupData.isOpen && (
        <CallActionPopup
          isOpen={callPopupData.isOpen}
          onClose={() => setCallPopupData({ isOpen: false, lead: null })}
          lead={callPopupData.lead}
          onHitCall={handleHitCall}
        />
      )}

      <CallQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        lead={selectedLeadForCall}
        onProceedToLog={handleProceedToLog}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLeadToDelete(null);
        }}
        headerVariant="simple"
        maxWidth="max-w-md"
        footer={
          <div className="flex gap-4 w-full">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setLeadToDelete(null);
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs capitalize tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 font-primary text-xs capitalize tracking-widest"
            >
              <Trash2 size={18} />
              Delete Now
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center text-black font-primary">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="text-red-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
          <p className="text-gray-600 mb-2 leading-relaxed">
            {Array.isArray(leadToDelete)
              ? `Are you sure you want to delete ${leadToDelete.length} selected lead(s)?`
              : <>Are you sure you want to delete the lead <span className="font-bold text-gray-800">"{leadToDelete?.name || leadToDelete?.full_name || "this lead"}"</span>?</>}
          </p>
          <p className="text-xs text-red-500 italic font-medium">This action cannot be undone. All associated data will be permanently removed.</p>
        </div>
      </Modal>

      {/* Floating Action Bar for Selected Leads - Properly Centered in Content Area */}
      {selectedLeads.length > 0 && !isAssignModalOpen && !isModalOpen && !showDeleteModal && !callPopupData.isOpen && !isQrModalOpen && !showBulkUploadPopup && (
        <div
          className={`fixed bottom-10 z-[100] flex justify-center pointer-events-none transition-all duration-300 left-0 ${isLocked ? "md:left-[280px]" : "md:left-[68px]"} right-0 animate-slideUp`}
        >
          <div className="pointer-events-auto flex items-center gap-8 px-8 py-4 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-sm shadow-[0_30px_70px_rgba(0,0,0,0.25)] flex-wrap md:flex-nowrap justify-center">
            <div className="flex items-center gap-4 border-r border-gray-200 pr-8">
              <span className="w-11 h-11 rounded-full bg-orange-100 text-[#FF7B1D] flex items-center justify-center text-xl font-black font-primary shadow-inner">
                {selectedLeads.length}
              </span>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-800 capitalize tracking-tight font-primary leading-none">
                  Leads Selected
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 font-primary">Ready to manage</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAssignLeads}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-sm font-bold hover:bg-orange-50 hover:border-[#FF7B1D] hover:text-[#FF7B1D] transition-all capitalize flex items-center gap-2.5 text-sm shadow-sm active:scale-95 font-primary group"
              >
                <UserPlus size={18} className="text-[#FF7B1D] group-hover:scale-110 transition-transform" />
                Assign Leads
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white px-6 py-2.5 rounded-sm font-bold hover:bg-red-700 transition-all capitalize flex items-center gap-2.5 text-sm shadow-md shadow-red-200 active:scale-95 font-primary border border-red-700"
              >
                <Trash2 size={18} />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Mobile Number Modal */}
      <Modal
        isOpen={isAddMobileModalOpen}
        onClose={() => setIsAddMobileModalOpen(false)}
        title="Add Mobile Number"
        subtitle={`Please add a mobile number for ${leadForMobileUpdate?.name || leadForMobileUpdate?.full_name || leadForMobileUpdate?.organization_name || 'this lead'} to proceed with the call.`}
        maxWidth="max-w-md"
        icon={<Phone size={24} />}
        footer={
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setIsAddMobileModalOpen(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs capitalize tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateMobile}
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-sm hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 font-primary text-xs capitalize tracking-widest"
            >
              Add
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-primary capitalize">Mobile Number</label>
            <input
              type="text"
              value={newMobileNumber}
              onChange={(e) => setNewMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-sm focus:border-orange-500 focus:bg-white transition-all outline-none font-primary"
            />
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

