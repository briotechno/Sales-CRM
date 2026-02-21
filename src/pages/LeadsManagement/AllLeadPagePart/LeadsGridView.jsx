import { Mail, Phone, MapPin, Eye, UserPlus, PhoneIncoming, Clock, TrendingUp, AlertCircle, Inbox } from "lucide-react";
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
      case "Follow Up":
      case "Contacted":
      case "Interested":
        return {
          bg: "bg-yellow-500",
          border: "border-t-yellow-500",
          dot: "bg-yellow-500",
          line: "bg-yellow-500",
        };
      case "Not Connected":
      case "Not Contacted":
        return {
          bg: "bg-purple-500",
          border: "border-t-purple-500",
          dot: "bg-purple-500",
          line: "bg-purple-500",
        };
      case "New Leads":
      case "New Lead":
      case "Closed":
      case "Won":
        return {
          bg: "bg-blue-500",
          border: "border-t-blue-500",
          dot: "bg-blue-500",
          line: "bg-blue-500",
        };
      case "Trending":
        return {
          bg: "bg-orange-500",
          border: "border-t-orange-500",
          dot: "bg-orange-500",
          line: "bg-orange-500",
        };
      case "Lost":
      case "Dropped":
        return {
          bg: "bg-red-500",
          border: "border-t-red-500",
          dot: "bg-red-500",
          line: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-500",
          border: "border-t-gray-500",
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
      case "Follow Up":
      case "Contacted":
      case "Interested":
        return "bg-amber-500";
      case "Not Connected":
      case "Not Contacted":
        return "bg-purple-500";
      case "New Leads":
      case "New Lead":
      case "Closed":
      case "Won":
        return "bg-blue-500";
      case "Lost":
      case "Dropped":
        return "bg-red-500";
      case "Trending":
        return "bg-orange-500";
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

  const groupTags = ["New Leads", "Not Connected", "Follow Up", "Trending"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groupTags.map((groupTag) => {
        const tagLeads = leadsData.filter((lead) => {
          // Identify potential categories based on backend criteria
          const isTrending = lead.is_trending === 1 || lead.priority === "High" || lead.tag === "Trending";
          const isFollowUp = lead.tag === "Follow Up" || lead.tag === "Missed";
          const isNotConnected = lead.tag === "Not Connected";

          // Match backend 'new' criteria: tag is 'Not Contacted' OR created in last 2 days
          // Also include common 'New' identifiers as fallback
          const isNew = lead.tag === "Not Contacted" ||
            lead.tag === "New Lead" ||
            lead.tag === "New Leads" ||
            lead.stage_name === "New" ||
            !lead.tag ||
            (lead.created_at && (new Date() - new Date(lead.created_at)) < 2 * 24 * 60 * 60 * 1000) ||
            (lead.createdAt && (new Date() - new Date(lead.createdAt)) < 2 * 24 * 60 * 60 * 1000);

          // Priority assignment (mutually exclusive) for grid view
          if (isTrending) {
            return groupTag === "Trending";
          }
          if (isFollowUp) {
            return groupTag === "Follow Up";
          }
          if (isNotConnected) {
            return groupTag === "Not Connected";
          }
          if (isNew) {
            return groupTag === "New Leads";
          }

          // Fallback: If it doesn't match above but we want to show it in the workstation grid, 
          // we could put it in New Leads or another column, but per user request we stick to these 4.
          return false;
        }).filter(lead => filterStatus === "All" || lead.status === filterStatus);

        const totalValue = tagLeads.reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
        const tagColor = getTagColor(groupTag);

        const getHeaderIcon = (tag) => {
          switch (tag) {
            case "New Leads": return <UserPlus size={18} className="text-blue-500" />;
            case "Not Connected": return <PhoneIncoming size={18} className="text-purple-500" />;
            case "Follow Up": return <Clock size={18} className="text-yellow-500" />;
            case "Trending": return <TrendingUp size={18} className="text-orange-500" />;
            default: return null;
          }
        };

        const getHeaderBg = (tag) => {
          switch (tag) {
            case "New Leads": return "bg-blue-50/50";
            case "Not Connected": return "bg-purple-50/50";
            case "Follow Up": return "bg-yellow-50/50";
            case "Trending": return "bg-orange-50/50";
            default: return "bg-gray-50/50";
          }
        };

        return (
          <div key={groupTag} className="flex flex-col group/column">
            <div className={`rounded-sm shadow-sm border border-gray-200 p-4 mb-4 border-t-4 bg-white transition-all duration-300 hover:shadow-md ${tagColor.border} ${getHeaderBg(groupTag)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm`}>
                    {getHeaderIcon(groupTag)}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">{groupTag}</h3>
                </div>
                <span className="bg-white text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  {tagLeads.length}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-[10px] text-gray-400 font-bold capitalize tracking-wider font-primary">Total Value</p>
                <p className="text-sm text-orange-600 font-bold font-primary">
                  {formatCurrency(totalValue)}
                </p>
              </div>
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
                          <div className="bg-orange-500 text-white text-[8px] font-bold px-4 py-0.5 rotate-45 translate-x-3 translate-y-[-1px] shadow-sm capitalize tracking-tighter font-primary">
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
                                className="font-bold text-gray-800 text-sm hover:text-orange-600 cursor-pointer line-clamp-1 font-primary"
                                onClick={() => handleLeadClick(lead)}
                                title={lead.name || lead.full_name || lead.organization_name}
                              >
                                {lead.name || lead.full_name || lead.organization_name || "Untitled Lead"}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-bold capitalize tracking-widest font-primary">{lead.lead_id || `ID: ${lead.id}`}</p>
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
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-sm border border-dashed border-gray-200 bg-gray-50/30 group-hover/column:bg-gray-50/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
                    <Inbox className="text-gray-300" size={24} />
                  </div>
                  <h4 className="text-[10px] font-bold text-gray-400 capitalize tracking-widest font-primary">No Active Leads</h4>
                  <p className="text-[9px] text-gray-300 font-semibold mt-1 capitalize font-primary">Empty Pipeline</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
