import React, { useState } from "react";
import { X } from "lucide-react";

export default function FilterPopup({
  isOpen,
  onClose,
  filterType,
  setFilterType,
  filterPriority,
  setFilterPriority,
  filterServices,
  setFilterServices,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  filterSubtype,
  setFilterSubtype,
  filterStatus,
  setFilterStatus,
}) {
  const [tempFilters, setTempFilters] = useState({
    type: filterType,
    priority: filterPriority,
    services: filterServices,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
    subtype: filterSubtype,
    status: filterStatus || "All",
  });

  if (!isOpen) return null;

  const handleApply = () => {
    setFilterType(tempFilters.type);
    setFilterPriority(tempFilters.priority);
    setFilterServices(tempFilters.services);
    setFilterDateFrom(tempFilters.dateFrom);
    setFilterDateTo(tempFilters.dateTo);
    setFilterSubtype(tempFilters.subtype);
    if (setFilterStatus) setFilterStatus(tempFilters.status);
    onClose();
  };

  const handleReset = () => {
    const resetValues = {
      type: "All",
      priority: "All",
      services: "All",
      dateFrom: "",
      dateTo: "",
      subtype: "All",
      status: "All",
    };
    setTempFilters(resetValues);
  };

  const handleChange = (field, value) => {
    setTempFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="absolute right-0 mt-2 w-[450px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <span className="text-sm font-bold text-gray-800 capitalize">Filter Options</span>
        <button
          onClick={handleReset}
          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
        >
          Reset all
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="max-h-[70vh] overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-6">
          {/* Status Section */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Select Status</span>
            <div className="space-y-2">
              {["All", "Active", "Inactive"].map((status) => (
                <label key={status} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="status_filter"
                      checked={tempFilters.status === status}
                      onChange={() => handleChange("status", status)}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                    />
                  </div>
                  <span className={`ml-3 text-sm font-medium transition-colors ${tempFilters.status === status ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Lead Type */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
              Lead Type
            </label>
            <select
              value={tempFilters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
            >
              <option value="All">All Types</option>
              <option value="Person">Person</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
              Priority
            </label>
            <select
              value={tempFilters.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Services/Interested In */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
              Interested In
            </label>
            <select
              value={tempFilters.services}
              onChange={(e) => handleChange("services", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
            >
              <option value="All">All Services</option>
              <option value="Product Demo">Product Demo</option>
              <option value="Pricing Info">Pricing Info</option>
              <option value="Support">Support</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>

          {/* Subtype Filter */}
          {tempFilters.type !== "All" && (
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                {tempFilters.type === "Person"
                  ? "Person Type"
                  : "Organization Type"}
              </label>
              <select
                value={tempFilters.subtype}
                onChange={(e) => handleChange("subtype", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
              >
                <option value="All">All</option>
                {tempFilters.type === "Person" && (
                  <>
                    <option value="Employee">Employee</option>
                    <option value="Founder">Founder</option>
                    <option value="Freelancer">Freelancer</option>
                  </>
                )}
                {tempFilters.type === "Organization" && (
                  <>
                    <option value="Startup">Startup</option>
                    <option value="SMB">SMB</option>
                    <option value="Enterprise">Enterprise</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Date Range Section */}
          <div className="col-span-2 pt-2 border-t">
            <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-4 border-b pb-1">
              Date Range
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Date From */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                  From Date
                </label>
                <input
                  type="date"
                  value={tempFilters.dateFrom}
                  onChange={(e) => handleChange("dateFrom", e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-[11px] font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                  To Date
                </label>
                <input
                  type="date"
                  value={tempFilters.dateTo}
                  onChange={(e) => handleChange("dateTo", e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-[11px] font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
