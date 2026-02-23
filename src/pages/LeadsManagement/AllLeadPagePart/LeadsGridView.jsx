import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  UserPlus,
  PhoneIncoming,
  TrendingUp,
  Inbox,
  History,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  const baseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace('/api/', '');
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

const safeParseDate = (str) => {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d)) return d;

  const parts = str.split(/[\/\s:]/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const hours = parts[3] ? parseInt(parts[3]) : 0;
    const minutes = parts[4] ? parseInt(parts[4]) : 0;
    const isPM = str.toUpperCase().includes('PM');

    const d = new Date(year, month, day, isPM && hours < 12 ? hours + 12 : hours, minutes);
    if (!isNaN(d)) return d;
  }

  return new Date(str);
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

const LeadCard = ({
  lead,
  handleLeadClick,
  selectedLeads,
  handleSelectLead,
  handleHitCall,
  handleShowAssignmentHistory,
  currentTime,
  displayStatus,
  getAvatarBg,
  getPriorityColor
}) => {
  const leadDisplayName = lead.name || lead.full_name || lead.organization_name || "L";
  const initials = leadDisplayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const cleanNumber = (lead.mobile_number || lead.phone || '').replace(/\D/g, '');
  const waLink = cleanNumber ? `https://wa.me/${cleanNumber}` : '#';
  const isMissed = lead.tag === "Missed" || displayStatus.text === "Missed";

  return (
    <div
      className={`group flex flex-col h-auto bg-white border ${isMissed ? 'border-red-500 ring-1 ring-red-500/10' : 'border-gray-200'} rounded-sm shadow-sm transition-all duration-300 relative overflow-hidden`}
    >
      <div className="pt-3 px-3 pb-2 flex flex-col gap-2 text-xs">
        {/* Top Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-sm flex-shrink-0 border border-gray-100 overflow-hidden bg-white shadow-sm">
              {lead.profile_image ? (
                <img src={getImageUrl(lead.profile_image)} alt={leadDisplayName} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${getAvatarBg(lead.tag)} flex items-center justify-center text-white text-base font-bold capitalize`}>
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <h3
                className="text-[15px] font-bold text-gray-900 capitalize font-primary cursor-pointer hover:text-orange-600 transition-colors leading-tight truncate"
                onClick={() => handleLeadClick(lead)}
                title={leadDisplayName}
              >
                {leadDisplayName}
              </h3>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-[11px] text-orange-600 font-bold px-2 py-0.5 rounded-sm bg-orange-50 border border-orange-100 capitalize tracking-wide w-fit">
                  {lead.lead_id || lead.id}
                </span>
                {(lead.tag === 'Duplicate' || lead.duplicate_count > 1) && (
                  <span className="text-[10px] text-rose-600 font-bold px-2 py-0.5 rounded-sm bg-rose-50 border border-rose-100 capitalize tracking-wide w-fit animate-pulse">
                    Duplicate {lead.duplicate_count > 1 ? `(${lead.duplicate_count - 1})` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={selectedLeads.includes(lead.id)}
            onChange={() => handleSelectLead(lead.id)}
            className="w-4 h-4 cursor-pointer accent-orange-500 mt-1"
          />
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-slate-50 text-slate-500 rounded-sm font-bold border border-slate-100 shadow-sm transition-all hover:bg-slate-100 min-w-0">
            <span className="text-[11px] font-semibold text-orange-400 capitalize tracking-tight truncate w-full text-center">Born</span>
            <div className="flex items-center gap-1.5 min-w-0 w-full justify-center">
              <Calendar size={12} className="text-slate-400 shrink-0" />
              <span className="text-[11px] text-gray-800 font-bold font-primary truncate" title={(() => {
                const parsed = safeParseDate(lead.rawCreated || lead.created_at);
                return parsed ? parsed.toLocaleString('en-IN') : "--";
              })()}>
                {(() => {
                  const parsed = safeParseDate(lead.rawCreated || lead.created_at);
                  return parsed ? parsed.toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                  }) : "--";
                })()}
              </span>
            </div>
          </div>

          {lead.next_call_at ? (
            <div className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-orange-50 text-orange-600 rounded-sm font-bold border border-orange-100 shadow-sm transition-all hover:bg-orange-100/50 min-w-0">
              <span className="text-[12px] font-semibold text-orange-400 capitalize tracking-tight truncate w-full text-center">Next Call</span>
              <div className="flex items-center gap-1.5 min-w-0 w-full justify-center">
                <Clock size={12} className="text-orange-400 shrink-0" />
                <span className="text-[11px] text-orange-700 font-bold font-primary truncate" title={lead.next_call_at ? (safeParseDate(lead.next_call_at)?.toLocaleString('en-IN') || "--") : "--"}>
                  {lead.next_call_at ? (safeParseDate(lead.next_call_at)?.toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                  }) || "--") : "--"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-gray-50 text-gray-400 rounded-sm font-bold border border-gray-100 italic">
              <span className="text-[12px] opacity-60 capitalize">Next Call</span>
              <span className="text-[12px]">No Schedule</span>
            </div>
          )}
        </div>

        {/* Pipeline Section */}
        <div className="bg-slate-50/80 rounded-sm p-2 border border-slate-200 transition-colors">
          <div className="flex justify-between items-center gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12px] text-orange-400 font-semibold capitalize mb-1">Pipeline</span>
              <h4 className="text-[14px] font-bold text-gray-800 truncate capitalize font-primary" title={lead.pipeline_name || "General"}>
                {lead.pipeline_name || "General"}
              </h4>
            </div>
            <div className="flex flex-col items-end min-w-0 text-right flex-1">
              <span className="text-[12px] text-orange-400 font-semibold capitalize mb-1">Stage</span>
              <div className="flex items-center gap-1.5 max-w-full">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0"></div>
                <h4 className="text-[14px] font-bold text-orange-600 truncate capitalize font-primary" title={lead.stage_name || "New"}>
                  {lead.stage_name || "New"}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-slate-50/80 rounded-sm px-2 py-1.5 border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-semibold text-orange-400 capitalize">Status</span>
            <span className={`text-[12px] font-bold capitalize px-3 py-0.5 rounded-sm border shadow-sm ${displayStatus.color}`} title={displayStatus.text}>
              {displayStatus.text}
            </span>
          </div>
        </div>

        {/* Assignment */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="flex flex-col gap-1 px-2 py-1.5 bg-slate-50/80 rounded-sm border border-slate-200 cursor-pointer hover:bg-orange-50 transition-all"
            onClick={() => handleShowAssignmentHistory && handleShowAssignmentHistory(lead)}
          >
            <span className="text-[12px] font-semibold text-orange-400 capitalize">Assignee</span>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[13px] font-bold text-gray-800 capitalize truncate" title={lead.employee_name || "Unassigned"}>
                {lead.employee_name || "Unassigned"}
              </span>
              <History size={12} className="text-gray-300 group-hover:text-orange-500 flex-shrink-0" />
            </div>
          </div>
          <div className="flex flex-col gap-1 px-2 py-1.5 bg-slate-50/80 rounded-sm border border-slate-200">
            <span className="text-[12px] font-semibold text-orange-400 capitalize">Owner</span>
            <span className="text-[13px] font-bold text-gray-800 capitalize truncate" title={lead.lead_owner || "-"}>
              {lead.lead_owner || "-"}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="relative mt-1">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${calculateProfileCompletion(lead) > 70 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-orange-400 to-[#FF7B1D]'}`}
              style={{ width: `${calculateProfileCompletion(lead)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/90 px-3 py-2 border-t border-gray-200 mt-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-orange-400 font-semibold capitalize mb-1">Priority</span>
            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-sm capitalize border ${getPriorityColor(lead.priority)} whitespace-nowrap`}>
              {lead.priority || 'Medium'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-orange-400 font-semibold capitalize mb-1">Source</span>
            <p className="text-[12px] font-bold text-gray-700 truncate max-w-[80px] font-primary capitalize italic" title={lead.lead_source || "-"}>
              {lead.lead_source || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); handleHitCall && handleHitCall(lead); }}
            className="p-2 bg-white hover:bg-[#FF7B1D] rounded-sm text-[#FF7B1D] hover:text-white transition-all border border-orange-100 hover:border-[#FF7B1D] shadow-sm"
            title={`Calls: ${lead.call_count || 0}`}
          >
            <Phone size={14} />
          </button>
          <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 bg-white hover:bg-green-600 rounded-sm text-green-600 hover:text-white transition-all border border-green-100 shadow-sm"><FaWhatsapp size={14} /></a>
          <a href={lead.email ? `mailto:${lead.email}` : '#'} onClick={(e) => e.stopPropagation()} className="p-2 bg-white hover:bg-blue-600 rounded-sm text-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm"><Mail size={14} /></a>
        </div>
      </div>
    </div>
  );
};

export default function LeadsGridView({
  leadsData,
  filterStatus,
  handleLeadClick,
  selectedLeads,
  handleSelectLead,
  handleHitCall,
  groupTags,
  handleShowAssignmentHistory,
  currentTime = new Date()
}) {
  const getAvatarBg = (tag) => {
    switch (tag) {
      case "Follow Up": return "bg-amber-500";
      case "Not Connected": return "bg-purple-500";
      case "Trending": case "Trading": return "bg-orange-500";
      case "Won": return "bg-emerald-500";
      case "Dropped": case "Lost": case "Drop": return "bg-rose-500";
      case "Missed": return "bg-red-500";
      case "Duplicate": return "bg-rose-400";
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

  const getHeaderIcon = (tag) => {
    const t = tag.toLowerCase().replace('-', ' ').trim();
    switch (t) {
      case "new leads": case "new lead": return <UserPlus size={18} className="text-blue-500" />;
      case "not connected": return <PhoneIncoming size={18} className="text-purple-500" />;
      case "follow up": case "follow-up": return <Clock size={18} className="text-yellow-500" />;
      case "trending": case "trading": return <TrendingUp size={18} className="text-orange-500" />;
      case "missed": return <Phone size={18} className="text-red-500" />;
      case "won": return <UserPlus size={18} className="text-emerald-500" />;
      case "dropped": case "lost": case "drop": return <Inbox size={18} className="text-rose-500" />;
      case "duplicate": return <Inbox size={18} className="text-rose-400" />;
      case "assigned": return <History size={18} className="text-indigo-500" />;
      default: return <Inbox size={18} className="text-gray-500" />;
    }
  };

  const getHeaderBg = (tag) => {
    const t = tag.toLowerCase().replace('-', ' ').trim();
    switch (t) {
      case "new leads": case "new lead": return "border-t-blue-500 bg-blue-50/50";
      case "not connected": return "border-t-purple-500 bg-purple-50/50";
      case "follow up": case "follow-up": return "border-t-yellow-500 bg-yellow-50/50";
      case "trending": case "trading": return "border-t-orange-500 bg-orange-50/50";
      case "missed": return "border-t-red-500 bg-red-50/50";
      case "won": return "border-t-emerald-500 bg-emerald-50/50";
      case "dropped": case "lost": case "drop": return "border-t-rose-500 bg-rose-50/50";
      case "duplicate": return "border-t-rose-400 bg-rose-50/50";
      case "assigned": return "border-t-indigo-500 bg-indigo-50/50";
      default: return "border-t-gray-500 bg-gray-50/50";
    }
  };

  const getDisplayStatus = (lead, groupTag) => {
    if (groupTag === "Trending" || groupTag === "Trading") {
      return { text: "Trading", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
    }

    const isMovedFromNotConnected = lead.tag === "Not Connected" && lead.next_call_at && safeParseDate(lead.next_call_at) <= currentTime;
    if (isMovedFromNotConnected) {
      return { text: "Moved from Not Connected", color: "text-purple-600 bg-purple-50 border-purple-200" };
    }

    let s = lead.is_trending === 1 ? "Trending" : (lead.tag || lead.status || "New Lead");
    if (s === "Not Contacted") s = "New Lead";

    let c = "text-gray-600 bg-gray-50 border-gray-200";
    switch (s?.toLowerCase()) {
      case "connected": c = "text-green-600 bg-green-50 border-green-200"; break;
      case "not connected": c = "text-red-600 bg-red-50 border-red-200"; break;
      case "follow up": c = "text-amber-600 bg-amber-50 border-amber-200"; break;
      case "trending": c = "text-orange-600 bg-orange-50 border-orange-200"; break;
      case "trading": c = "text-indigo-600 bg-indigo-50 border-indigo-200"; break;
      case "won": case "closed": c = "text-emerald-600 bg-emerald-50 border-emerald-200"; break;
      case "lost": case "dropped": c = "text-rose-600 bg-rose-50 border-rose-200"; break;
      case "new lead": case "new leads": case "new": c = "text-blue-600 bg-blue-50 border-blue-200"; break;
      case "missed": c = "text-red-600 bg-red-50 border-red-500"; break;
      case "duplicate": c = "text-rose-600 bg-rose-50 border-rose-200"; break;
      default: c = "text-gray-600 bg-gray-50 border-gray-200";
    }
    return { text: s, color: c };
  };

  // If no groupTags provided, render a flat grid
  if (!groupTags || groupTags.length === 0) {
    const filteredLeads = leadsData.filter(lead => filterStatus === "All" || (lead.tag || lead.status) === filterStatus);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            handleLeadClick={handleLeadClick}
            selectedLeads={selectedLeads}
            handleSelectLead={handleSelectLead}
            handleHitCall={handleHitCall}
            handleShowAssignmentHistory={handleShowAssignmentHistory}
            currentTime={currentTime}
            displayStatus={getDisplayStatus(lead)}
            getImageUrl={getImageUrl}
            getAvatarBg={getAvatarBg}
            getPriorityColor={getPriorityColor}
            calculateProfileCompletion={calculateProfileCompletion}
            safeParseDate={safeParseDate}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${Math.min(groupTags.length, 4)} gap-4`}>
      {groupTags.map((groupTag) => {
        let tagLeads = leadsData.filter((lead) => {
          // Logic to match lead to column
          const leadTag = lead.tag || lead.status || "New Lead";

          // Specific logic for workstation columns
          const isTrending = lead.is_trending === 1 || lead.priority === "High" || (lead.tag && (lead.tag === "Trending" || lead.tag === "High Priority"));
          const isFollowUp = lead.tag === "Follow Up" || lead.tag === "Missed";
          const isNotConnected = lead.tag === "Not Connected" && (!lead.next_call_at || new Date(lead.next_call_at) > currentTime);
          const isNew = lead.tag === "Not Contacted" || lead.tag === "New Lead" || lead.tag === "New Leads" || lead.stage_name === "New" || !lead.tag || (lead.tag === "Not Connected" && lead.next_call_at && new Date(lead.next_call_at) <= currentTime);

          const normalizedGroupTag = groupTag.toLowerCase().replace('-', ' ').trim();

          if (normalizedGroupTag === "trending" || normalizedGroupTag === "trading") return isTrending;
          if (normalizedGroupTag === "follow up" || normalizedGroupTag === "follow-up") return isFollowUp;
          if (normalizedGroupTag === "not connected") return isNotConnected;
          if (normalizedGroupTag === "new lead" || normalizedGroupTag === "new leads") return isNew;

          // For other pages, match if the tag matches the groupTag exactly
          if (normalizedGroupTag === "assigned") return true; // Show everything if on "Assigned" column (API already filtered)

          return leadTag.toLowerCase() === normalizedGroupTag ||
            (normalizedGroupTag === "won" && (leadTag === "Won" || leadTag === "Closed")) ||
            (normalizedGroupTag === "drop" && (leadTag.toLowerCase() === "dropped" || leadTag.toLowerCase() === "lost"));
        }).filter(lead => filterStatus === "All" || (lead.tag || lead.status) === filterStatus);

        // Sorting Not Connected and Follow Up leads by next_call_at (soonest first)
        if (groupTag === "Not Connected" || groupTag === "Follow Up") {
          tagLeads = [...tagLeads].sort((a, b) => {
            if (!a.next_call_at) return 1;
            if (!b.next_call_at) return -1;
            return new Date(a.next_call_at) - new Date(b.next_call_at);
          });
        }

        return (
          <div key={groupTag} className="flex flex-col group/column">
            <div className={`rounded-sm shadow-sm border border-gray-200 p-4 mb-4 border-t-4 bg-white transition-all duration-300 ${getHeaderBg(groupTag)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    {getHeaderIcon(groupTag)}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">{groupTag}</h3>
                </div>
                <span className="bg-white text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">{tagLeads.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {tagLeads.length > 0 ? (
                tagLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    handleLeadClick={handleLeadClick}
                    selectedLeads={selectedLeads}
                    handleSelectLead={handleSelectLead}
                    handleHitCall={handleHitCall}
                    handleShowAssignmentHistory={handleShowAssignmentHistory}
                    currentTime={currentTime}
                    displayStatus={getDisplayStatus(lead, groupTag)}
                    getImageUrl={getImageUrl}
                    getAvatarBg={getAvatarBg}
                    getPriorityColor={getPriorityColor}
                    calculateProfileCompletion={calculateProfileCompletion}
                    safeParseDate={safeParseDate}
                  />
                ))
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
}

