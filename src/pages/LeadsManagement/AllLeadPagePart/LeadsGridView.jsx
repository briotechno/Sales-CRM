import React from "react";
import { Mail, Phone, MapPin, Eye } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function LeadsGridView({
  leadsData,
  filterStatus,
  handleLeadClick,
  selectedLeads,
  handleSelectLead,
}) {
  const getTagColor = (tag) => {
    switch (tag) {
      case "Contacted":
        return {
          bg: "bg-yellow-500",
          border: "border-yellow-500",
          dot: "bg-yellow-500",
          line: "bg-yellow-500",
        };
      case "Not Contacted":
        return {
          bg: "bg-purple-500",
          border: "border-purple-500",
          dot: "bg-purple-500",
          line: "bg-purple-500",
        };
      case "Closed":
        return {
          bg: "bg-teal-500",
          border: "border-teal-500",
          dot: "bg-teal-500",
          line: "bg-teal-500",
        };
      case "Lost":
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
        return "bg-amber-500";
      case "Not Contacted":
        return "bg-purple-500";
      case "Closed":
        return "bg-emerald-500";
      case "Lost":
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {["Contacted", "Not Contacted", "Closed", "Lost"].map((tag) => {
        const tagLeads = leadsData.filter(
          (lead) =>
            lead.tag === tag &&
            (filterStatus === "All" || lead.status === filterStatus)
        );
        const totalValue = tagLeads.reduce((sum, lead) => sum + lead.value, 0);
        const tagColor = getTagColor(tag);

        return (
          <div key={tag} className="flex flex-col">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${tagColor.dot}`}></div>
                  <h3 className="text-lg font-bold text-gray-800">{tag}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {String(tagLeads.length).padStart(2, "0")} Leads -{" "}
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="space-y-4 flex-1">
              {tagLeads.length > 0 ? (
                tagLeads.map((lead) => {
                  const initials = lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={lead.id}
                      className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition"
                    >
                      <div
                        className={`h-1 ${tagColor.line} rounded-t-sm`}
                      ></div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 ${getAvatarBg(
                                lead.tag
                              )} rounded-sm flex items-center justify-center text-white font-semibold text-sm`}
                            >
                              {initials}
                            </div>
                            <h4
                              className="font-semibold text-gray-800 text-lg hover:text-blue-600 cursor-pointer"
                              onClick={() => handleLeadClick(lead)}
                            >
                              {lead.name}
                            </h4>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>

                        <div className="text-sm font-semibold text-gray-500">
                          {formatCurrency(lead.value)}
                        </div>

                        <div className="space-y-1 text-sm text-gray-700">
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-500" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone size={16} className="text-gray-500" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-gray-500" />
                            <span className="truncate">{lead.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                lead.priority
                              )}`}
                            >
                              {lead.priority}
                            </span>
                          </div>
                          <div className="flex gap-3 text-gray-500">
                            <button
                              onClick={() => console.log("Call", lead.id)}
                              className="hover:text-blue-500"
                              title="Call"
                            >
                              <Phone size={18} />
                            </button>
                            <button
                              onClick={() => console.log("WhatsApp", lead.id)}
                              className="hover:text-green-500"
                              title="WhatsApp"
                            >
                              <FaWhatsapp size={18} />
                            </button>
                            <button
                              onClick={() => console.log("View", lead.id)}
                              className="hover:text-blue-500"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-sm border border-gray-200">
                  No leads in this category
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
