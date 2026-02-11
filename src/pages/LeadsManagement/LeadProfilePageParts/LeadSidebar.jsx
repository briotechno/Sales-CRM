import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  Edit2,
  Star,
  ChevronDown,
  Plus,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  User,
  Hash,
  FileText,
} from "lucide-react";
import { FaBuilding } from "react-icons/fa";

export default function LeadSidebar({
  leadData,
  isEditingLead,
  isEditingOwner,
  setIsEditingOwner,
  handleLeadUpdate,
  setShowEditLeadModal,
  formatCurrency,
  setShowModal,
  handleHitCall,
}) {
  const loggedUser = useSelector((state) => state.auth.user);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  // Get tag status color
  const getTagStatusColor = (tag) => {
    switch (tag) {
      case "Contacted":
        return "bg-yellow-100 text-yellow-600";
      case "Not Contacted":
        return "bg-purple-100 text-purple-600";
      case "Closed":
        return "bg-green-100 text-green-700";
      case "Lost":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-[400px] ml-6 bg-white border-r overflow-y-auto">
      {/* Header Card with Gradient */}
      <div className="relative bg-gradient-to-r from-orange-500 to-yellow-400 rounded-b-3xl pt-8 pb-20 px-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white">
            {leadData?.profileImage ? (
              <img
                src={leadData.profileImage}
                alt={leadData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-700">
                {getInitials(leadData?.name || "Lead Name")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lead Title Card - Overlapping */}
      <div className="px-4 -mt-12 mb-4 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {leadData?.name || "Lead Name"}
            </h2>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
          </div>

          <p className="text-center text-sm text-gray-600 mb-3">
            {leadData?.address || "1861 Bayonne Ave, Manchester, NJ, 08759"}
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-3">
            <span className="flex items-center gap-1">
              <FaBuilding />
              <span>{leadData?.company || "Company Name"}</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs flex items-center gap-1 font-medium">
              <span>🔒</span> {leadData?.visibility || "Private"}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-xs font-medium ${getTagStatusColor(
                leadData?.tag
              )}`}
            >
              {leadData?.tag || "Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Lead Information */}
      <div className="px-6 mb-1">
        <div className="flex items-center justify-between mb-3 pb-2 border-gray-200">
          <h3 className="text-base font-bold text-gray-900">
            Lead Information
          </h3>
          <Edit2
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
          />
        </div>

        {/* Information Fields - Two Column Layout */}
        <div className="space-y-1.5">
          {/* Leads ID */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              Leads ID
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2">
              {leadData?.id || "N/A"}
            </span>
          </div>

          {/* Lead Name */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Lead Name
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.name || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Full Name */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Full Name
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.name || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Gender */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Gender
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.gender || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email
            </span>
            <span className="text-sm text-gray-600 truncate max-w-[250px] flex items-center gap-2 text-right">
              {leadData?.email || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Mobile Number */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Mobile Number
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.phone || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Alt. Mobile Number */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Alt. Mobile Number
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.altMobileNumber || "-"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Address */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Address
            </span>
            <span className="text-sm text-gray-600 text-right max-w-[250px] flex items-center gap-2">
              {leadData?.address || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* City */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              City
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.city || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* State */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              State
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.state || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Pincode */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              Pincode
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.pincode || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Date Created */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Date Created
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.dateCreated || "N/A"}
            </span>
          </div>

          {/* Value */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              Value
            </span>
            <span className="text-sm text-gray-600 font-semibold flex items-center gap-2 text-right">
              {leadData?.value || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Due Date */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Due Date
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.dueDate || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Follow up date */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Follow Up
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.followUp || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Source */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Source
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-2 text-right">
              {leadData?.source || "N/A"}
              <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)} />
            </span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium">Status</span>
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-semibold ${leadData?.status === "Active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
                } flex items-center gap-2 cursor-pointer`}
              onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
            >
              {leadData?.status || "Active"}
              <Edit2 className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Owner */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-gray-200">
          <h3 className="text-base font-bold text-gray-900">Owner</h3>
          <Edit2
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border-2 border-white shadow-sm">
            {getInitials(leadData?.owner?.name || "Owner")}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {leadData?.owner?.name || "N/A"}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="px-6 mb-4">
        <div className="mb-3 pb-2 border-gray-200">
          <h3 className="text-base font-bold text-gray-900">Tags</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.isArray(leadData?.tags) && leadData.tags.length > 0 ? leadData.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-md text-xs font-semibold">
              {tag}
            </span>
          )) : <span className="text-xs text-gray-400 italic">No tags</span>}
        </div>
      </div>

      {/* Projects */}
      <div className="px-6 mb-4">
        <div className="mb-3 pb-2  border-gray-200">
          <h3 className="text-base font-bold text-gray-800">Services</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.isArray(leadData?.services) && leadData.services.length > 0 ? leadData.services.map((service, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
              {service}
            </span>
          )) : <span className="text-xs text-gray-400 italic">No services</span>}
        </div>
      </div>

      {/* Priority */}
      <div className="px-6 mb-4">
        <div className="mb-3 pb-2 border-gray-200 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-800">Priority</h3>
          <Edit2
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
          />
        </div>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium ${leadData?.priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
            leadData?.priority === "Medium" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
              "bg-blue-50 text-blue-600 border-blue-200"
            }`}
          onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
        >
          <span className={`w-2 h-2 rounded-full ${leadData?.priority === "High" ? "bg-red-500" :
            leadData?.priority === "Medium" ? "bg-yellow-500" :
              "bg-blue-500"
            }`}></span>
          {leadData?.priority || "Low"}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Contacts */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between mb-3 pb-2  border-gray-200">
          <h3 className="text-base font-bold text-gray-800">
            Assigner Profile
          </h3>
          <button
            className="text-orange-500 text-xs font-semibold flex items-center gap-1"
            onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
          >
            <span className="text-lg">⊕</span> Add New
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border-2 border-white shadow-sm">
            {getInitials(leadData?.assigner?.name || "Assigner")}
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {leadData?.assigner?.name || "N/A"}
          </span>
        </div>
      </div>

      {/* Other Information */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between mb-3 pb-2  border-gray-200">
          <h3 className="text-base font-bold text-gray-800">
            Other Information
          </h3>
        </div>
        <div className="space-y-3">
          {/* Last Modified */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium">
              Last Modified
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.dateCreated || "N/A"}
            </span>
          </div>

          {/* Modified By */}
          <div className="flex justify-between items-center pb-2 border-gray-200">
            <span className="text-sm text-gray-700 font-medium">
              Modified By
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 text-right">
                {leadData?.modifiedBy?.name && leadData.modifiedBy.name !== "N/A" ? leadData.modifiedBy.name : (loggedUser?.employee_name || loggedUser?.name || "N/A")}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal && setShowModal(true)}
          className="bg-gradient-to-r from-orange-500 mt-6 to-orange-600 text-white px-8 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold w-full justify-center"
        >
          <Plus size={20} />
          Generate Quotation
        </button>

        <button
          onClick={() => handleHitCall && handleHitCall()}
          className="bg-orange-50 mt-3 border border-orange-200 text-orange-600 px-8 py-3 rounded-sm hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center gap-2 font-semibold w-full justify-center"
        >
          <Phone size={20} />
          Hit Call
        </button>
      </div>
    </div>
  );
}
