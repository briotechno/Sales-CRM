import React from "react";
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
}) {
  if (!isOpen) return null;

  const handleApply = () => {
    onClose();
  };

  const handleReset = () => {
    setFilterType("All");
    setFilterPriority("All");
    setFilterServices("All");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterSubtype("All");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-end z-50 p-6">
      <div
        className="bg-white rounded-sm shadow-2xl w-full max-w-sm h-auto mt-16 mr-4 flex flex-col animate-slideIn"
        style={{
          maxHeight: "calc(100vh - 120px)",
          animation: "slideIn 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-5">
            {/* Lead Type */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-600 uppercase">
                Lead Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]"
              >
                <option value="All">All Types</option>
                <option value="Person">Person</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            {/* Subtype Filter - Conditionally shown */}
            {filterType !== "All" && (
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-600 uppercase">
                  {filterType === "Person"
                    ? "Person Type"
                    : "Organization Type"}
                </label>
                <select
                  value={filterSubtype}
                  onChange={(e) => setFilterSubtype(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]"
                >
                  <option value="All">All</option>
                  {filterType === "Person" && (
                    <>
                      <option value="Employee">Employee</option>
                      <option value="Founder">Founder</option>
                      <option value="Freelancer">Freelancer</option>
                    </>
                  )}
                  {filterType === "Organization" && (
                    <>
                      <option value="Startup">Startup</option>
                      <option value="SMB">SMB</option>
                      <option value="Enterprise">Enterprise</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-600 uppercase">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-600 uppercase">
                Services
              </label>
              <select
                value={filterServices}
                onChange={(e) => setFilterServices(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]"
              >
                <option value="All">All Services</option>
                <option value="Consulting">Consulting</option>
                <option value="Development">Development</option>
                <option value="Support">Support</option>
              </select>
            </div>

            {/* Date Range Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold mb-3 text-gray-600 uppercase">
                Date Range
              </h3>

              {/* Date From */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  From
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  To
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-sm hover:bg-gray-100 transition"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 bg-[#FF7B1D] text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
