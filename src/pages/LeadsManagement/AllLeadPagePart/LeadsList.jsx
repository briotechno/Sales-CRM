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
            {/* <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Priority/Tag</th> */}
            {/* <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize whitespace-nowrap">Status</th>
            <th className="py-3 px-4 font-semibold border-b border-orange-400 capitalize text-center whitespace-nowrap">Probability</th> */}
            <th className="py-3 px-4 font-semibold border-b border-orange-400 capitalize text-center whitespace-nowrap">Hits</th>
            <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 capitalize whitespace-nowrap">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentLeads.length > 0 ? (
            currentLeads.map((lead, index) => (
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
                        <span className="p-1 bg-orange-100 text-orange-600 rounded-full animate-bounce" title="Trending Lead">
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

                {/* <td className="py-3 px-4 text-left">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize tracking-widest w-fit ${lead.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                      lead.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {lead.priority || 'Medium'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold italic">{lead.tag || 'Not Contacted'}</span>
                  </div>
                </td> */}

                {/* <td className="py-3 px-4 text-left">
                  <span
                    className={`px-3 py-1 rounded-sm text-[10px] font-bold border capitalize tracking-wider ${lead.status === "Active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                      }`}
                  >
                    {lead.status || "Inactive"}
                  </span>
                </td> */}
                {/* 
                <td className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`font-bold text-sm ${lead.conversion_probability > 70 ? 'text-green-600' : lead.conversion_probability > 40 ? 'text-orange-600' : 'text-gray-400'}`}>
                      {lead.conversion_probability || 0}%
                    </span>
                    <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-500 ${lead.conversion_probability > 70 ? 'bg-green-500' : lead.conversion_probability > 40 ? 'bg-orange-500' : 'bg-gray-300'}`}
                        style={{ width: `${lead.conversion_probability || 0}%` }}
                      />
                    </div>
                  </div>
                </td> */}

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
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
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

