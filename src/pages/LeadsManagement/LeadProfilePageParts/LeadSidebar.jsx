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
  ChevronDown,
  Clock,
  Briefcase,
  Shield,
  Heart,
  Globe,
  CheckCircle,
  History,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import { FaBuilding, FaWhatsapp } from "react-icons/fa";
import Modal from "../../../components/common/Modal";

import { toast } from "react-hot-toast";
import ConvertClientModal from "../../../components/LeadManagement/ConvertClientModal";

const interestedInOptions = [
  "Product Demo",
  "Pricing Info",
  "Support",
  "Partnership",
  "Consultation",
  "Training",
  "Other"
];

export default function LeadSidebar({
  leadData,
  isEditingLead,
  isEditingOwner,
  setIsEditingOwner,
  handleLeadUpdate,
  handleSingleFieldUpdate,
  formatCurrency,
  setShowModal,
  handleQrCall,
  employees = [],
  handleUpdateStatus,
}) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [sectionValues, setSectionValues] = useState({});
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [openMultiSelect, setOpenMultiSelect] = useState(null);

  const startEditing = (field, value) => {
    setEditingField(field);
    if (field === 'services') {
      // Convert comma-separated string to array for multi-select
      const initialArray = typeof value === 'string' && value.trim() !== ""
        ? value.split(',').map(s => s.trim())
        : [];
      setEditValue(initialArray);
    } else {
      setEditValue(value || "");
    }
    setEditingSection(null);
  };

  const handleInterestedInToggle = (item) => {
    setEditValue(prev => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(item)
        ? current.filter(s => s !== item)
        : [...current, item];
    });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
    setOpenMultiSelect(null);
  };

  const startSectionEditing = (section, fields) => {
    const values = {};
    fields.forEach(field => {
      values[field] = leadData[field] || "";
    });
    setSectionValues(values);
    setEditingSection(section);
    setEditingField(null);
  };

  const cancelSectionEditing = () => {
    setEditingSection(null);
    setSectionValues({});
  };

  const handleSectionValueChange = (field, value) => {
    setSectionValues(prev => ({ ...prev, [field]: value }));
  };

  const saveSectionEditing = async () => {
    if (handleSingleFieldUpdate) {
      // Only update fields that have actually changed to minimize API calls
      for (const [field, value] of Object.entries(sectionValues)) {
        const originalValue = leadData[field] || "";
        if (value !== originalValue) {
          await handleSingleFieldUpdate(field, value);
        }
      }
    }
    setEditingSection(null);
    setSectionValues({});
  };

  const saveEditing = async (field) => {
    if (handleSingleFieldUpdate) {
      let finalValue = editValue;
      if (field === 'services' && Array.isArray(editValue)) {
        finalValue = editValue.join(', ');
      }
      await handleSingleFieldUpdate(field, finalValue);
    }
    setEditingField(null);
    setEditValue("");
    setOpenMultiSelect(null);
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

  const renderEditableField = (label, field, currentValue, type = "text", options = [], IconComponent) => {
    const isEditing = editingField === field;
    const isSectionEditing = editingSection !== null && Object.prototype.hasOwnProperty.call(sectionValues, field);
    const value = isSectionEditing ? sectionValues[field] : (isEditing ? editValue : currentValue);

    return (
      <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 group min-h-[40px]">
        <div className="flex items-center gap-2 text-slate-500">
          {IconComponent && <IconComponent size={14} className="text-slate-400" />}
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>

        {isEditing || isSectionEditing ? (
          <div className="flex flex-col gap-1 items-end flex-1 max-w-[200px] relative">
            {type === "select" ? (
              <select
                className="w-full p-1.5 text-xs border border-orange-200 rounded-sm focus:border-orange-500 outline-none bg-white font-bold"
                value={value}
                onChange={(e) => isSectionEditing ? handleSectionValueChange(field, e.target.value) : setEditValue(e.target.value)}
                autoFocus={isEditing}
              >
                <option value="">Select {label}</option>
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : type === "multi-select" ? (
              <div className="w-full relative">
                <div
                  onClick={() => setOpenMultiSelect(prev => prev === field ? null : field)}
                  className="w-full min-h-[30px] p-1.5 border border-orange-200 rounded-sm cursor-pointer flex flex-wrap gap-1 items-center bg-white hover:border-orange-500 transition-all shadow-sm"
                >
                  {(!Array.isArray(value) || value.length === 0) ? (
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Select Options...</span>
                  ) : (
                    value.map(item => (
                      <span key={item} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black rounded-sm border border-orange-200">
                        {item}
                        <Plus
                          size={10}
                          className="rotate-45 hover:text-orange-800 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleInterestedInToggle(item); }}
                        />
                      </span>
                    ))
                  )}
                  <ChevronDown size={10} className={`ml-auto text-gray-400 transition-transform ${openMultiSelect === field ? 'rotate-180' : ''}`} />
                </div>

                {openMultiSelect === field && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-sm shadow-xl z-[100] w-[200px] max-h-48 overflow-y-auto ring-1 ring-black ring-opacity-5">
                    {interestedInOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer transition-colors border-b last:border-0 border-gray-50">
                        <input
                          type="checkbox"
                          checked={Array.isArray(value) && value.includes(option)}
                          onChange={() => handleInterestedInToggle(option)}
                          className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-700 font-bold uppercase">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : type === "textarea" ? (
              <textarea
                className="w-full p-1.5 text-xs border border-orange-200 rounded-sm focus:border-orange-500 outline-none bg-white font-bold min-h-[60px] resize-none"
                value={value}
                onChange={(e) => isSectionEditing ? handleSectionValueChange(field, e.target.value) : setEditValue(e.target.value)}
                autoFocus={isEditing}
              />
            ) : (
              <input
                type={type}
                className="w-full p-1.5 text-xs border border-orange-200 rounded-sm focus:border-orange-500 outline-none bg-white font-bold"
                value={value}
                onChange={(e) => isSectionEditing ? handleSectionValueChange(field, e.target.value) : setEditValue(e.target.value)}
                autoFocus={isEditing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isEditing) saveEditing(field);
                  if (e.key === 'Escape' && isEditing) cancelEditing();
                }}
              />
            )}
            {isEditing && (
              <div className="flex gap-2">
                <button onClick={cancelEditing} className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-sm border border-gray-200">Close</button>
                <button onClick={() => saveEditing(field)} className="text-[10px] font-bold text-white bg-orange-500 px-3 py-0.5 rounded-sm">Save</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 group/value flex-1 justify-end truncate">
            <span className={`font-bold text-xs text-right break-words max-w-[180px] capitalize truncate ${field === 'email' ? 'text-blue-600' : 'text-slate-800'}`}>
              {Array.isArray(currentValue)
                ? (currentValue.length > 0 ? currentValue.join(', ') : "N/A")
                : (currentValue || "N/A")}
            </span>
            <Edit2
              size={12}
              className="text-slate-400 cursor-pointer opacity-0 group-hover/value:opacity-100 transition-opacity flex-shrink-0 hover:text-orange-500"
              onClick={() => startEditing(field, currentValue)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[400px] bg-white shadow-sm h-full overflow-y-auto no-scrollbar border-l border-gray-100">
      {/* Employee-style Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl relative group overflow-hidden">
            {leadData?.profileImage ? (
              <img
                src={leadData.profileImage}
                alt={leadData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl">
                {getInitials(leadData?.name || "L").charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Edit2 size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Basic Info */}
      <div className="pt-16 pb-6 px-6 text-center border-b border-gray-100 min-h-[160px] flex flex-col items-center justify-center">
        {editingField === 'name' ? (
          <div className="flex flex-col gap-2 items-center mb-2 w-full animate-in fade-in slide-in-from-top-1 duration-200">
            <input
              type="text"
              className="w-full max-w-[280px] p-2 text-xl border border-orange-200 rounded-sm focus:border-orange-500 outline-none bg-white font-bold text-center"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing('name');
                if (e.key === 'Escape') cancelEditing();
              }}
            />
            <div className="flex gap-2">
              <button onClick={cancelEditing} className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-sm border border-gray-200 shadow-sm transition-all hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveEditing('name')} className="text-[10px] font-bold text-white bg-orange-500 px-3 py-1 rounded-sm shadow-sm hover:bg-orange-600 transition-all">Save Name</button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-full mb-1 group/name">
            <h2 className="text-2xl font-bold text-slate-800 uppercase truncate px-6" title={leadData?.name}>
              {leadData?.name || "Lead Name"}
            </h2>
            <Edit2
              size={15}
              className="absolute right-[15%] text-slate-400 cursor-pointer opacity-0 group-hover/name:opacity-100 transition-all hover:text-orange-500 translate-x-1/2"
              onClick={() => startEditing('name', leadData?.name)}
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-1 w-full">
          <p className="text-slate-600 font-bold text-[14px] flex items-center gap-2">
            <Phone size={14} className="text-orange-500" />
            {leadData?.phone || "N/A"}
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100">
        <button
          onClick={() => setShowConvertModal(true)}
          disabled={leadData?.tag !== 'Follow Up'}
          className={`py-2.5 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 transition-all ${leadData?.tag === 'Follow Up'
            ? "bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
        >
          <UserCheck className={`w-4 h-4 ${leadData?.tag === 'Follow Up' ? 'text-orange-500' : 'text-slate-300'}`} /> Convert Client
        </button>
        <button
          onClick={() => handleQrCall && handleQrCall()}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 transition-colors "
        >
          <Phone className="w-4 h-4" /> Call Now
        </button>
      </div>

      {/* Quick Quick Info Cards */}
      <div className="px-6 py-5 space-y-4 border-b border-gray-100 bg-slate-50/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-400" /> Lead ID
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">#{leadData?.id || "N/A"}</span>
            {(leadData?.tag === 'Duplicate' || leadData?.duplicate_count > 1) && (
              <span className="text-[10px] text-rose-600 font-bold px-1.5 py-0.5 rounded-sm bg-rose-50 border border-rose-100 capitalize tracking-wide w-fit animate-pulse">
                Duplicate {leadData?.duplicate_count > 1 ? `(${leadData.duplicate_count - 1})` : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" /> Lead Status
          </span>
          <span className="px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter bg-orange-100 text-orange-600 border border-orange-200">
            {leadData?.tag || "New Lead"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" /> Estimated Value
          </span>
          <span className="font-bold text-emerald-600 text-sm">
            {formatCurrency ? formatCurrency(leadData?.value) : `₹${leadData?.value || 0}`}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 space-y-2 pb-20 pt-2">
        {/* Core Lead Info */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-slate-800 font-bold text-sm tracking-tight flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              Basic Information
            </h3>
            {editingSection === 'basic' ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-right-1 duration-200">
                <button onClick={cancelSectionEditing} className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={saveSectionEditing} className="text-[10px] font-bold text-white bg-orange-500 px-3 py-0.5 rounded-sm shadow-sm hover:bg-orange-600 transition-colors">Save All</button>
              </div>
            ) : (
              !editingSection && !editingField && (
                <Edit2
                  size={14}
                  className="text-slate-400 hover:text-orange-500 cursor-pointer"
                  onClick={() => startSectionEditing('basic', ['gender', 'email', 'phone', 'altMobileNumber', 'dateOfBirth'])}
                />
              )
            )}
          </div>
          <div className="space-y-0">
            {renderEditableField("Gender", "gender", leadData?.gender, "select", [
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" }
            ], User)}
            {renderEditableField("Email", "email", leadData?.email, "email", [], Mail)}
            {renderEditableField("Phone", "phone", leadData?.phone, "tel", [], Phone)}
            {renderEditableField("Alt. Phone", "altMobileNumber", leadData?.altMobileNumber, "tel", [], History)}
            {renderEditableField("Birthday", "dateOfBirth", leadData?.dateOfBirth, "date", [], Calendar)}
          </div>
        </section>

        {/* Location Section */}
        <section className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-slate-800 font-bold text-sm tracking-tight flex items-center gap-2">
              <MapPin size={16} className="text-orange-500" />
              Location Details
            </h3>
            {editingSection === 'location' ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-right-1 duration-200">
                <button onClick={cancelSectionEditing} className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={saveSectionEditing} className="text-[10px] font-bold text-white bg-orange-500 px-3 py-0.5 rounded-sm shadow-sm hover:bg-orange-600 transition-colors">Save All</button>
              </div>
            ) : (
              !editingSection && !editingField && (
                <Edit2
                  size={14}
                  className="text-slate-400 hover:text-orange-500 cursor-pointer"
                  onClick={() => startSectionEditing('location', ['address', 'city', 'state', 'pincode'])}
                />
              )
            )}
          </div>
          <div className="space-y-0">
            {renderEditableField("Address", "address", leadData?.address, "textarea", [], MapPin)}
            {renderEditableField("City", "city", leadData?.city, "text", [], Globe)}
            {renderEditableField("State", "state", leadData?.state, "text", [], Globe)}
            {renderEditableField("Pincode", "pincode", leadData?.pincode, "text", [], Globe)}
          </div>
        </section>

        {/* Business Section */}
        <section className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-slate-800 font-bold text-sm tracking-tight flex items-center gap-2">
              <Briefcase size={16} className="text-orange-500" />
              Lead Specifics
            </h3>
            {editingSection === 'business' ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-right-1 duration-200">
                <button onClick={cancelSectionEditing} className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={saveSectionEditing} className="text-[10px] font-bold text-white bg-orange-500 px-3 py-0.5 rounded-sm shadow-sm hover:bg-orange-600 transition-colors">Save All</button>
              </div>
            ) : (
              !editingSection && !editingField && (
                <Edit2
                  size={14}
                  className="text-slate-400 hover:text-orange-500 cursor-pointer"
                  onClick={() => startSectionEditing('business', ['followUp', 'source', 'priority'])}
                />
              )
            )}
          </div>
          <div className="space-y-0">
            {renderEditableField("Follow Up", "followUp", leadData?.followUp, "date", [], Clock)}
            {renderEditableField("Source", "source", leadData?.source, "text", [], TrendingUp)}
            {renderEditableField("Interested In", "services", leadData?.services, "multi-select", [], FileText)}
            {renderEditableField("Priority", "priority", leadData?.priority, "select", [
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" }
            ], Shield)}
          </div>
        </section>

        {/* Stakeholders Section */}
        <section className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-slate-800 font-bold text-sm tracking-tight flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              Ownership
            </h3>
          </div>
          <div className="space-y-2">
            {/* Lead Owner */}
            <div className="bg-slate-50/50 rounded-sm p-4 border border-slate-100">
              <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-3">Managed By (Owner)</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm border border-emerald-100 overflow-hidden">
                  <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">
                    {getInitials(leadData?.lead_owner || "Owner")}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block capitalize">{leadData?.lead_owner || "Individual"}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50/50 rounded-sm p-4 border border-slate-100 group/agent relative">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Assigned To</p>
                {!editingSection && !editingField && (
                  <Edit2
                    size={14}
                    className="text-slate-400 cursor-pointer opacity-0 group-hover/agent:opacity-100 transition-opacity hover:text-orange-500"
                    onClick={() => startEditing('assigned_to', leadData?.assigned_to)}
                  />
                )}
              </div>

              {editingField === 'assigned_to' ? (
                <div className="flex flex-col gap-2 items-end animate-in fade-in slide-in-from-top-1 duration-200">
                  <select
                    className="w-full p-2 text-xs border border-orange-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white transition-all font-bold"
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
                    <button onClick={cancelEditing} className="text-[10px] font-bold text-gray-500 hover:text-gray-700 transition-all bg-white px-2 py-1 rounded-sm border border-gray-200 shadow-sm">Close</button>
                    <button onClick={() => saveEditing('assigned_to')} className="text-[10px] font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-sm shadow-md">Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-sm border border-blue-100 overflow-hidden">
                    <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                      {getInitials(leadData?.assignee?.name || "Agent")}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block capitalize">{leadData?.assignee?.name || "Not Assigned"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-4 pb-10">
          <button
            onClick={() => setShowModal && setShowModal(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-sm font-semibold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 group"
          >
            <Plus size={18} className="text-orange-500 group-hover:rotate-90 transition-transform duration-300" />
            Generate Quotation
          </button>
        </div>
      </div>

      {/* Convert Client Confirmation Modal */}
      <ConvertClientModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        leadData={leadData}
      />
    </div>
  );
}
