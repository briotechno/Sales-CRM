import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Edit2,
  Star,
  Plus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Hash,
  FileText,
  Zap,
  DollarSign,
} from "lucide-react";
import { FaBuilding, FaWhatsapp } from "react-icons/fa";

export default function LeadSidebar({
  leadData,
  isEditingLead,
  isEditingOwner,
  setIsEditingOwner,
  handleLeadUpdate,
  handleSingleFieldUpdate,
  formatCurrency,
  setShowModal,
  handleHitCall,
  employees = [],
}) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (field, value) => {
    setEditingField(field);
    setEditValue(value || "");
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveEditing = async (field) => {
    if (handleSingleFieldUpdate) {
      await handleSingleFieldUpdate(field, editValue);
    }
    setEditingField(null);
    setEditValue("");
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderEditableField = (label, field, currentValue, type = "text", options = []) => {
    const isEditing = editingField === field;

    return (
      <div className="flex justify-between items-start pb-2.5 border-b border-gray-50 group min-h-[48px] py-1.5 transition-colors hover:bg-gray-50/30 px-1 rounded-sm">
        <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider pt-1">{label}</span>

        {isEditing ? (
          <div className="flex flex-col gap-2 items-end flex-1 max-w-[220px] animate-in fade-in slide-in-from-top-1 duration-200">
            {type === "select" ? (
              <select
                className="w-full p-2 text-sm border border-orange-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white transition-all font-semibold"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              >
                <option value="">Select {label}</option>
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                className="w-full p-2 text-sm border border-orange-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white transition-all font-semibold min-h-[90px] resize-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
            ) : (
              <input
                type={type}
                className="w-full p-2 text-sm border border-orange-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white transition-all font-semibold"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing(field);
                  if (e.key === 'Escape') cancelEditing();
                }}
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={cancelEditing}
                className="text-[11px] font-bold text-gray-500 hover:text-gray-700 transition-all bg-white px-3 py-1 rounded-sm border border-gray-200 shadow-sm active:scale-95"
              >
                Close
              </button>
              <button
                onClick={() => saveEditing(field)}
                className="text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded-sm transition-all shadow-md active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 group/value">
            <span className="text-gray-900 font-bold text-sm text-right break-words max-w-[190px] capitalize">
              {currentValue || "N/A"}
            </span>
            <Edit2
              size={14}
              className="text-orange-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:scale-110"
              onClick={() => startEditing(field, currentValue)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[400px] ml-6 bg-white border-r overflow-y-auto no-scrollbar shadow-sm h-full">
      {/* Old Design: Orange-Yellow Gradient Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-b-3xl pt-8 pb-20 px-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md relative group">
            {leadData?.profileImage ? (
              <img
                src={leadData.profileImage}
                alt={leadData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-orange-500">
                {getInitials(leadData?.name || "Lead")}
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Edit2 size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Old Design: Floating White Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 -mt-10 mb-6 mx-6 relative z-10 transition-transform hover:scale-[1.01]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            {editingField === 'name' ? (
              <div className="flex flex-col gap-1">
                <input
                  className="w-full p-1 text-sm border-2 border-orange-100 rounded focus:border-orange-500 outline-none font-bold"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={cancelEditing} className="text-[10px] text-gray-500">Close</button>
                  <button onClick={() => saveEditing('name')} className="text-[10px] text-orange-500 font-bold">Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h2 className="text-lg font-bold text-gray-900 truncate" title={leadData?.name}>
                  {leadData?.name || "Lead Name"}
                </h2>
                <Edit2
                  size={14}
                  className="text-orange-500 cursor-pointer opacity-0 group-hover/title:opacity-100 transition-opacity"
                  onClick={() => startEditing('name', leadData?.name)}
                />
              </div>
            )}

          </div>
          <Star size={18} className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform flex-shrink-0 ml-2" />
        </div>

        <div className="flex justify-between border-t border-gray-50 pt-4">
          <div className="flex-1 text-center border-r border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Company</p>
            <p className="text-xs font-bold text-gray-700 flex items-center gap-1 justify-center truncate px-2">
              <FaBuilding className="text-orange-500 flex-shrink-0" />
              {leadData?.company || "Individual"}
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
            <div className="flex justify-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200">
                {leadData?.tag || "New Lead"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 space-y-8 pb-20">
        {/* Core Lead Info */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} className="text-orange-500" />
              Lead Information
            </h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 py-1">
              <span className="text-gray-500 font-medium text-sm">Lead ID:</span>
              <span className="text-gray-900 font-mono font-bold text-sm">#{leadData?.id || "N/A"}</span>
            </div>
            {renderEditableField("Gender", "gender", leadData?.gender, "select", [
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" }
            ])}
            {renderEditableField("Email", "email", leadData?.email, "email")}
            {renderEditableField("Phone", "phone", leadData?.phone, "tel")}
            {renderEditableField("Alt. Phone", "altMobileNumber", leadData?.altMobileNumber, "tel")}
          </div>
        </section>

        {/* Location Section */}
        <section>
          <h3 className="text-gray-400 font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
            <MapPin size={14} className="text-orange-500" />
            Location Info
          </h3>
          <div className="space-y-1">
            {renderEditableField("Address", "address", leadData?.address, "textarea")}
            {renderEditableField("City", "city", leadData?.city)}
            {renderEditableField("State", "state", leadData?.state)}
            {renderEditableField("Pincode", "pincode", leadData?.pincode)}
          </div>
        </section>

        {/* Business Section */}
        <section>
          <h3 className="text-gray-400 font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
            <DollarSign size={14} className="text-orange-500" />
            Business Details
          </h3>
          <div className="space-y-1">
            {renderEditableField("Lead Value", "value", leadData?.value)}
            {renderEditableField("Follow Up", "followUp", leadData?.followUp, "date")}
            {renderEditableField("Source", "source", leadData?.source)}
            {renderEditableField("Status", "status", leadData?.status, "select", [
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" }
            ])}
            {renderEditableField("Priority", "priority", leadData?.priority, "select", [
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" }
            ])}
          </div>
        </section>

        {/* Stakeholders Section */}
        <section>
          <h3 className="text-gray-400 font-bold mb-5 text-xs uppercase tracking-wider flex items-center gap-2">
            <User size={14} className="text-orange-500" />
            Stakeholders
          </h3>
          <div className="space-y-5">
            {/* Lead Owner */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lead Owner</p>
              </div>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-sm border border-orange-50 shadow-sm transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-sm bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm border-2 border-white shadow-sm">
                  {getInitials(leadData?.owner?.name || "Owner")}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800 block capitalize">{leadData?.owner?.name || "Unassigned"}</span>
                  <span className="text-[11px] text-gray-400 font-semibold">Administrator</span>
                </div>
              </div>
            </div>

            {/* Assigned Agent */}
            <div className="group/agent">
              <div className="flex justify-between items-center mb-2.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assigned Agent</p>
                <Edit2
                  size={12}
                  className="text-orange-500 cursor-pointer opacity-0 group-hover/agent:opacity-100 transition-opacity hover:scale-110"
                  onClick={() => startEditing('assigned_to', leadData?.assigned_to)}
                />
              </div>
              {editingField === 'assigned_to' ? (
                <div className="flex flex-col gap-2 items-end bg-white p-2.5 rounded-sm border border-orange-200 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                  <select
                    className="w-full p-2 text-sm border border-orange-200 rounded-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white font-bold"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  >
                    <option value="">Select Agent</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.employee_name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={cancelEditing} className="text-[11px] font-bold text-gray-500 hover:text-gray-700 transition-all bg-gray-50 px-3 py-1 rounded-sm border border-gray-100 active:scale-95">Close</button>
                    <button onClick={() => saveEditing('assigned_to')} className="text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded-sm shadow-md active:scale-95">Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-sm border border-orange-50 shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 rounded-sm bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm border-2 border-white shadow-sm">
                    {getInitials(leadData?.assignee?.name || "Agent")}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800 block capitalize">{leadData?.assignee?.name || "Not Assigned"}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">Sales Executive</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-8 space-y-3 pb-10">
          <button
            onClick={() => setShowModal && setShowModal(true)}
            className="w-full bg-gray-900 text-white py-3.5 rounded-sm font-bold text-[13px] uppercase tracking-wider shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-95"
          >
            <Plus size={18} className="text-orange-500" />
            Generate Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
