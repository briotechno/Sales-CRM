import React from "react";
import { useState } from "react";

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
}) {
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [ownerName, setOwnerName] = useState("Vaughan Lewis");

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
      <div className="relative bg-gradient-to-r from-orange-500 to-yellow-400 rounded-b-3xl pt-8 pb-24 px-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-gray-700">
              {getInitials(leadData?.name || "Lead Name")}
            </span>
          </div>
        </div>
      </div>

      {/* Lead Title Card - Overlapping */}
      <div className="px-4 -mt-16 mb-6 relative z-10">
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
      <div className="px-6 mb-2">
        <div className="flex items-center justify-between mb-4 pb-3  border-gray-200">
          <h3 className="text-base font-bold text-gray-900">
            Lead Information
          </h3>
          <Edit2
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setShowEditLeadModal && setShowEditLeadModal(true)}
          />
        </div>

        {/* Information Fields - Two Column Layout */}
        <div className="space-y-2">
          {/* Leads ID */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              Leads ID
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.id || "N/A"}
            </span>
          </div>

          {/* Lead Name */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Lead Name
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.name || "N/A"}
            </span>
          </div>

          {/* Full Name */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Full Name
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.name || "N/A"}
            </span>
          </div>

          {/* Gender */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Gender
            </span>
            <span className="text-sm text-gray-600">Male</span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email
            </span>
            <span className="text-sm text-gray-600 truncate max-w-[250px]">
              {leadData?.email || "N/A"}
            </span>
          </div>

          {/* Mobile Number */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Mobile Number
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.phone || "N/A"}
            </span>
          </div>

          {/* Alt. Mobile Number */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Alt. Mobile Number
            </span>
            <span className="text-sm text-gray-600">-</span>
          </div>

          {/* Address */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Address
            </span>
            <span className="text-sm text-gray-600 text-right max-w-[250px]">
              {leadData?.address || "N/A"}
            </span>
          </div>

          {/* City */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              City
            </span>
            <span className="text-sm text-gray-600">Manchester</span>
          </div>

          {/* State */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              State
            </span>
            <span className="text-sm text-gray-600">New Jersey</span>
          </div>

          {/* Pincode */}
          <div className="flex justify-between items-center pb-3 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              Pincode
            </span>
            <span className="text-sm text-gray-600">08759</span>
          </div>

          {/* Date Created */}
          <div className="flex justify-between items-center pb-3 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Date Created
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.dateCreated || "N/A"}
            </span>
          </div>

          {/* Value */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              Value
            </span>
            <span className="text-sm text-gray-600 font-semibold">
              {leadData?.value || "N/A"}
            </span>
          </div>

          {/* Due Date */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Due Date
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.dueDate || "N/A"}
            </span>
          </div>

          {/* Follow up date */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Follow Up
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.followUp || "N/A"}
            </span>
          </div>

          {/* Source */}
          <div className="flex justify-between items-center pb-3 border-gray-200">
            <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Source
            </span>
            <span className="text-sm text-gray-600">
              {leadData?.source || "N/A"}
            </span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium">Status</span>
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                leadData?.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {leadData?.status || "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Owner */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-gray-200">
          <h3 className="text-base font-bold text-gray-900">Owner</h3>

          <Edit2
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setIsEditingOwner(!isEditingOwner)}
          />
        </div>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Owner"
            className="w-10 h-10 rounded-full"
          />

          {/* Editable Field */}
          {isEditingOwner ? (
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="text-sm font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-orange-400"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              {ownerName}
            </span>
          )}
        </div>

        {/* Save Button */}
        {isEditingOwner && (
          <button
            onClick={() => setIsEditingOwner(false)}
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-md"
          >
            Save
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="px-6 mb-6">
        <div className="mb-4 pb-3 border-gray-200">
          <h3 className="text-base font-bold text-gray-900">Tags</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-md text-xs font-semibold">
            Collab
          </span>
          <span className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-md text-xs font-semibold">
            Rated
          </span>
        </div>
      </div>

      {/* Projects */}
      <div className="px-6 mb-6">
        <div className="mb-4 pb-3  border-gray-200">
          <h3 className="text-base font-bold text-gray-800">Services</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
            Product Demo
          </span>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
            Pricing Info
          </span>
        </div>
      </div>

      {/* Priority */}
      <div className="px-6 mb-6">
        <div className="mb-4 pb-3  border-gray-200">
          <h3 className="text-base font-bold text-gray-800">Priority</h3>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm font-medium">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          High
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Contacts */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-3  border-gray-200">
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
          <img
            src="https://i.pravatar.cc/150?img=5"
            alt="Contact"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm font-semibold text-gray-800">
            Khushi Soni
          </span>
        </div>
      </div>

      {/* Other Information */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-3  border-gray-200">
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
          <div className="flex justify-between items-center pb-3  border-gray-200">
            <span className="text-sm text-gray-700 font-medium">
              Modified By
            </span>
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/150?img=8"
                alt="Modified by"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">Darlee Robertson</span>
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
      </div>
    </div>
  );
}
