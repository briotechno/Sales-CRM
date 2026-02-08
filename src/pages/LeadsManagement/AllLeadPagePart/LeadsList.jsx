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
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-[#FF7B1D] text-white text-sm">
            <th className="py-3 px-4 font-semibold">
              <input
                type="checkbox"
                checked={
                  selectedLeads.length === currentLeads.length &&
                  currentLeads.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
            </th>

            <th className="py-3 px-4 font-semibold">Lead ID</th>
            <th className="py-3 px-4 font-semibold">Full Name</th>
            <th className="py-3 px-4 font-semibold">Mobile Number</th>
            <th className="py-3 px-4 font-semibold">Email</th>
            <th className="py-3 px-4 font-semibold">Services</th>

            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Calls</th>
            <th className="py-3 px-4 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentLeads.length > 0 ? (
            currentLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>



                <td
                  className="py-3 px-4 text-orange-600 hover:text-blue-800 cursor-pointer font-medium"
                  onClick={() => handleLeadClick(lead)}
                >
                  {lead.id} || {lead.lead_id}
                </td>

                <td
                  className="py-3 px-4 text-orange-600 hover:text-blue-800 cursor-pointer font-medium"
                  onClick={() => handleLeadClick(lead)}
                >
                  {lead.name}
                </td>

                <td className="py-3 px-4">{lead.mobile_number || lead.phone}</td>
                <td className="py-3 px-4">{lead.email}</td>

                <td className="py-3 px-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${lead.interested_in ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"}`}>
                    {lead.interested_in ? "Connected" : "Not Connected"}
                  </span>
                </td>



                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${lead.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {lead.status || "Inactive"}
                  </span>
                </td>

                <td className="py-3 px-4 font-semibold">{lead.calls || 0}</td>

                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="p-1 hover:bg-orange-100 rounded text-blue-500 hover:text-blue-700"
                      onClick={() => handleLeadClick(lead)}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-orange-100 rounded text-green-500 hover:text-green-700"
                      onClick={() => handleEditLead(lead)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-orange-100 rounded text-red-500 hover:text-red-700"
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
                className="py-6 text-gray-500 font-medium text-sm"
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
