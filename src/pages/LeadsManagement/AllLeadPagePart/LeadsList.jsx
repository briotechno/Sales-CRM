import React from "react";
import { Edit, Trash2, Eye, Phone, TrendingUp } from "lucide-react";

export default function LeadsListView({
  currentLeads,
  selectedLeads,
  handleSelectAll,
  handleSelectLead,
  handleLeadClick,
  currentPage,
  itemsPerPage,
  handleEditLead,
  handleDeleteLead,
  handleHitCall
}) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-10">
              <input
                type="checkbox"
                checked={
                  selectedLeads.length === currentLeads.length &&
                  currentLeads.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer accent-orange-500"
              />
            </th>

            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Lead ID</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Full Name</th>
            <th className="py-3 px-4 font-semibold border-b border-orange-400 capitalize whitespace-nowrap text-center">Source</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Pipeline/Stage</th>
            <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 capitalize whitespace-nowrap">Status</th>
            <th className="py-3 px-4 font-semibold border-b border-orange-400 capitalize text-center whitespace-nowrap">Hits</th>
            <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 capitalize whitespace-nowrap">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentLeads.length > 0 ? (
            currentLeads.map((lead, index) => {
              const getStatusBadge = (tag, isTrending, stageName) => {
                let status = tag || stageName || "New Lead";
                if (status === "Not Contacted") status = "New Lead";

                if (isTrending) return "bg-orange-100 text-orange-600 border-orange-200";

                switch (status.toLowerCase()) {
                  case "new lead":
                  case "new":
                  case "new leads":
                    bg = "bg-blue-100 text-blue-600 border-blue-200";
                    break;
                  case "not connected":
                    bg = "bg-purple-100 text-purple-600 border-purple-200";
                    break;
                  case "follow up":
                  case "contacted":
                  case "interested":
                    bg = "bg-amber-100 text-amber-600 border-amber-200";
                    break;
                  case "missed":
                    bg = "bg-slate-100 text-slate-600 border-slate-200";
                    break;
                  case "assigned":
                    bg = "bg-indigo-100 text-indigo-600 border-indigo-200";
                    break;
                  case "dropped":
                  case "lost":
                    bg = "bg-red-100 text-red-600 border-red-200";
                    break;
                  case "duplicate":
                  case "duplicates":
                    bg = "bg-gray-100 text-gray-500 border-gray-200";
                    break;
                  case "trending":
                    bg = "bg-orange-100 text-orange-600 border-orange-200";
                    break;
                  case "won":
                  case "closed":
                    bg = "bg-green-100 text-green-600 border-green-200";
                    break;
                  default:
                    bg = "bg-gray-100 text-gray-600 border-gray-200";
                }
                return bg;
              };

              const displayStatus = lead.is_trending === 1 ? "Trending" : (lead.tag === "Not Contacted" ? "New Lead" : (lead.tag || lead.stage_name || "New Lead"));

              return (
                <tr
                  key={lead.id}
                  className="border-t hover:bg-gray-50 transition-colors group"
                >
                  <td className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="w-4 h-4 cursor-pointer accent-orange-500"
                    />
                  </td>

                  <td
                    className="py-3 px-4 text-orange-600 hover:text-orange-800 cursor-pointer font-semibold text-sm text-left whitespace-nowrap"
                    onClick={() => handleLeadClick(lead)}
                  >
                    {lead.lead_id || lead.id}
                  </td>

                  <td className="py-3 px-4 text-gray-800 hover:text-orange-600 cursor-pointer text-sm text-left" onClick={() => handleLeadClick(lead)}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate max-w-[150px]" title={lead.name || lead.full_name || lead.organization_name}>
                          {lead.name || lead.full_name || lead.organization_name || "Untitled Lead"}
                        </span>
                        {lead.is_trending === 1 && (
                          <span className="p-1 bg-orange-100 text-orange-600 rounded-full" title="Trending Lead">
                            <TrendingUp size={12} />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{lead.mobile_number || lead.phone || "--"}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-sm text-[10px] font-bold border border-gray-100 capitalize tracking-tighter">
                      {lead.lead_source || "Direct"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]" title={lead.pipeline_name}>
                        {lead.pipeline_name || "General"}
                      </span>
                      <span className="text-[10px] text-[#FF7B1D] font-bold italic">
                        {lead.stage_name || "New"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-[2px] text-[10px] font-bold border uppercase tracking-wider ${((tag, isTrending, stageName) => {
                      let status = tag || stageName || "New Lead";
                      if (status === "Not Contacted") status = "New Lead";

                      if (isTrending) return "bg-orange-100 text-orange-600 border-orange-200";
                      switch (status.toLowerCase()) {
                        case "new lead": case "new": case "new leads": return "bg-blue-100 text-blue-600 border-blue-200";
                        case "not connected": return "bg-purple-100 text-purple-600 border-purple-200";
                        case "follow up": case "contacted": case "interested": return "bg-amber-100 text-amber-600 border-amber-200";
                        case "missed": return "bg-slate-100 text-slate-600 border-slate-200";
                        case "assigned": return "bg-indigo-100 text-indigo-600 border-indigo-200";
                        case "dropped": case "lost": return "bg-red-100 text-red-600 border-red-200";
                        case "duplicate": return "bg-gray-100 text-gray-500 border-gray-200";
                        case "won": case "closed": return "bg-green-100 text-green-600 border-green-200";
                        default: return "bg-gray-100 text-gray-600 border-gray-200";
                      }
                    })(lead.tag, lead.is_trending, lead.stage_name)}`}>
                      {displayStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-700 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm">{lead.call_count || 0}</span>
                      <span className="text-[9px] text-gray-400 font-normal">Hits</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-1.5">

                      <button
                        onClick={() => handleHitCall && handleHitCall(lead)}
                        className="p-1.5 bg-orange-50 hover:bg-orange-500 rounded-sm text-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-500 shadow-sm"
                        title="Hit Call"
                      >
                        <Phone size={16} />
                      </button>
                      <button
                        className="p-1.5 hover:bg-blue-50 rounded-sm text-blue-500 hover:text-blue-700 transition-all border border-transparent hover:border-blue-100"
                        onClick={() => handleLeadClick(lead)}
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 hover:bg-green-50 rounded-sm text-green-500 hover:text-green-700 transition-all border border-transparent hover:border-green-100"
                        onClick={() => handleEditLead(lead)}
                        title="Edit Lead"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1.5 hover:bg-red-50 rounded-sm text-red-500 hover:text-red-700 transition-all border border-transparent hover:border-red-100"
                        onClick={() => handleDeleteLead(lead)}
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td
                colSpan="10"
                className="py-12 text-center text-gray-500 font-medium text-sm"
              >
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
