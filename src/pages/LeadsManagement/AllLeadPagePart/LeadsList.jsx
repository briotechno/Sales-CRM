import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

export default function LeadsListView({
  currentLeads,
  selectedLeads,
  handleSelectAll,
  handleSelectLead,
  handleLeadClick,
  currentPage,
  itemsPerPage,
  handleEditLead,
  handleDeleteLead
}) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">
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

            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize">Lead ID</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize">Full Name</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize">Mobile</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize">Email</th>
            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize">Contact</th>

            <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 capitalize">Status</th>
            <th className="py-3 px-4 font-semibold border-b border-orange-400 capitalize text-center">Calls</th>
            <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 capitalize">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentLeads.length > 0 ? (
            currentLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className="border-t hover:bg-gray-50 transition-colors"
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
                  className="py-3 px-4 text-orange-600 hover:text-orange-800 cursor-pointer font-semibold text-sm text-left"
                  onClick={() => handleLeadClick(lead)}
                >
                  {lead.id}
                </td>

                <td
                  className="py-3 px-4 text-gray-800 hover:text-orange-600 cursor-pointer font-bold text-sm text-left"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className="line-clamp-1 truncate max-w-[150px]" title={lead.name}>
                    {lead.name}
                  </div>
                </td>

                <td className="py-3 px-4 text-gray-600 text-sm font-medium text-left truncate max-w-[120px]">
                  {lead.mobile_number || lead.phone || "--"}
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm font-medium text-left truncate max-w-[150px]" title={lead.email}>
                  {lead.email || "--"}
                </td>

                <td className="py-3 px-4 text-left">
                  <span className={`px-3 py-1 rounded-sm text-[10px] font-bold border capitalize tracking-wider ${lead.interested_in
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}>
                    {lead.interested_in ? "Connected" : "Not Connected"}
                  </span>
                </td>

                <td className="py-3 px-4 text-left">
                  <span
                    className={`px-3 py-1 rounded-sm text-[10px] font-bold border capitalize tracking-wider ${lead.status === "Active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                      }`}
                  >
                    {lead.status || "Inactive"}
                  </span>
                </td>

                <td className="py-3 px-4 font-bold text-gray-700 text-center">{lead.calls || 0}</td>

                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                      onClick={() => handleLeadClick(lead)}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all"
                      onClick={() => handleEditLead(lead)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all"
                      onClick={() => handleDeleteLead(lead.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
