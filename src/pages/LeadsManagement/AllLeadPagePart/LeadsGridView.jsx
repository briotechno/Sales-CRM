import React from "react";
import { Mail, Phone, MapPin, Eye } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function LeadsGridView({
  leadsData,
  filterStatus,
  handleLeadClick,
  selectedLeads,
  handleSelectLead,
  handleHitCall,
}) {
  const getTagColor = (tag) => {
    switch (tag) {
      case "Contacted":
      case "Interested":
        return {
          bg: "bg-yellow-500",
          border: "border-yellow-500",
          dot: "bg-yellow-500",
          line: "bg-yellow-500",
        };
      case "Not Contacted":
      case "Not Connected":
        return {
          bg: "bg-purple-500",
          border: "border-purple-500",
          dot: "bg-purple-500",
          line: "bg-purple-500",
        };
      case "Closed":
      case "Won":
        return {
          bg: "bg-teal-500",
          border: "border-teal-500",
          dot: "bg-teal-500",
          line: "bg-teal-500",
        };
      case "Lost":
      case "Dropped":
        return {
          bg: "bg-red-500",
          border: "border-red-500",
          dot: "bg-red-500",
          line: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-500",
          border: "border-gray-500",
          dot: "bg-gray-500",
          line: "bg-gray-500",
        };
    }
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "₹0";

    const [intPart] = num.toFixed(0).split(".");
    const lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    const formatted =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree;

    let finalValue = "₹   " + formatted;
    if (finalValue.length < 8) {
      finalValue = "₹0" + formatted;
    }
    return finalValue;
  };

  const getAvatarBg = (tag) => {
    switch (tag) {
      case "Contacted":
      case "Interested":
        return "bg-amber-500";
      case "Not Contacted":
      case "Not Connected":
        return "bg-purple-500";
      case "Closed":
      case "Won":
        return "bg-emerald-500";
      case "Lost":
      case "Dropped":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const groupTags = ["Contacted", "Not Contacted", "Closed", "Lost"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groupTags.map((groupTag) => {
        const tagLeads = leadsData.filter((lead) => {
          if (groupTag === "Contacted") return ["Contacted", "Interested", "Follow Up"].includes(lead.tag);
          if (groupTag === "Not Contacted") return ["Not Contacted", "Not Connected"].includes(lead.tag) || !lead.tag;
          if (groupTag === "Closed") return ["Closed", "Won"].includes(lead.tag);
          if (groupTag === "Lost") return ["Lost", "Dropped", "Dropped Lead"].includes(lead.tag);
          return false;
        }).filter(lead => filterStatus === "All" || lead.status === filterStatus);

        const totalValue = tagLeads.reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
        const tagColor = getTagColor(groupTag);

        return (
          <div key={groupTag} className="flex flex-col">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4 mb-3 border-t-4" style={{ borderTopColor: tagColor.bg.replace('bg-', '') }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">{groupTag}</h3>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {tagLeads.length}
                </span>
              </div>
              <p className="text-sm text-orange-600 font-bold">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="space-y-4 flex-1">
              {tagLeads.length > 0 ? (
                tagLeads.map((lead) => {
                  const leadDisplayName = lead.name || lead.full_name || lead.organization_name || "L";
                  const initials = leadDisplayName
                    ? leadDisplayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "L";

                  return (
                    <div
                      key={lead.id}
                      className={`bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition relative overflow-hidden ${lead.is_trending === 1 ? 'ring-1 ring-orange-500/50 shadow-orange-100' : ''}`}
                    >
                      {lead.is_trending === 1 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-orange-500 text-white text-[8px] font-bold px-4 py-0.5 rotate-45 translate-x-3 translate-y-[-1px] shadow-sm uppercase tracking-tighter">
                            Trending
                          </div>
                        </div>
                      )}

                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 ${getAvatarBg(lead.tag)} rounded-sm flex items-center justify-center text-white font-semibold text-sm shadow-inner`}
                            >
                              {initials}
                            </div>
                            <div>
                              <h4
                                className="font-bold text-gray-800 text-sm hover:text-orange-600 cursor-pointer line-clamp-1"
                                onClick={() => handleLeadClick(lead)}
                                title={lead.name || lead.full_name || lead.organization_name}
                              >
                                {lead.name || lead.full_name || lead.organization_name || "Untitled Lead"}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{lead.lead_id || `ID: ${lead.id}`}</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="w-4 h-4 cursor-pointer accent-orange-500 mt-1"
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700">{formatCurrency(lead.value)}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-[10px] uppercase font-bold">Prob:</span>
                            <span className={`font-bold ${lead.conversion_probability > 70 ? 'text-green-600' : lead.conversion_probability > 40 ? 'text-orange-600' : 'text-gray-400'}`}>
                              {lead.conversion_probability || 0}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <Phone size={12} className="text-orange-500" />
                            <span className="font-medium">{lead.mobile_number || lead.phone || '--'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-gray-400 uppercase font-bold">Calls:</span>
                              <span className="font-bold text-gray-700">{lead.call_count || 0} Hits</span>
                            </div>
                            {lead.next_call_at && (
                              <div className="ml-auto bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold border border-blue-100">
                                Next: {new Date(lead.next_call_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider ${getPriorityColor(
                              lead.priority
                            )}`}
                          >
                            {lead.priority || 'Medium'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleHitCall && handleHitCall(lead)}
                              className="p-1.5 bg-orange-50 hover:bg-orange-500 rounded-sm text-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-500"
                              title="Hit Call"
                            >
                              <Phone size={14} />
                            </button>
                            <button
                              onClick={() => handleLeadClick(lead)}
                              className="p-1.5 bg-gray-50 hover:bg-gray-200 rounded-sm text-gray-500 hover:text-gray-700 transition-all border border-gray-100"
                              title="View Profile"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-300 text-xs bg-gray-50 rounded-sm border border-dashed border-gray-200 uppercase font-bold tracking-widest px-4">
                  Empty State
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
