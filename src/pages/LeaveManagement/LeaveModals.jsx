import React from "react";
import { X, User } from "lucide-react";

// Leave Form Modal Component
export const LeaveFormModal = ({
  showModal,
  setShowModal,
  editingLeave,
  formData,
  handleInputChange,
  handleSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
          {/* Left section: icon + title + subheading */}
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <User size={24} />
            </div>

            <div className="flex flex-col leading-tight">
              <h2 className="text-xl font-semibold">
                {editingLeave ? "Edit Leave Type" : "Add New Leave Type"}
              </h2>
              <p className="text-sm opacity-80">Manage leave type details</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="text-white hover:bg-orange-700 p-1 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type *
              </label>
              <input
                type="text"
                name="leave_type"
                value={formData.leave_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="e.g., Casual Leave"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="Enter leave description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renewal Type *
              </label>
              <select
                name="renewal_type"
                value={formData.renewal_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Monthly: Renews every month | Yearly: Renews on joining date
                anniversary
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Allocation *
              </label>
              <input
                type="number"
                name="leave_allocation"
                value={formData.leave_allocation}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="Number of leaves"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.renewal_type === "Monthly"
                  ? "Leaves allocated per month"
                  : "Leaves allocated per year"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Consecutive Days *
              </label>
              <input
                type="number"
                name="max_consecutive_days"
                value={formData.max_consecutive_days}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="Maximum days in a row"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of consecutive days employee can take this leave
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligibility After (Days) *
              </label>
              <input
                type="number"
                name="eligibility_days"
                value={formData.eligibility_days}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="Days after joining"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of days after joining date when employee becomes eligible
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid
              </label>
              <select
                name="paid"
                value={formData.paid}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-sm font-medium transition-all duration-200 transform shadow-md hover:shadow-lg"
            >
              {editingLeave ? "Update Leave Type" : "Add Leave Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Filter Modal Component
export const FilterModal = ({
  showFilterModal,
  setShowFilterModal,
  filters,
  setFilters,
}) => {
  if (!showFilterModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-md w-full">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Filter Leave Types</h2>
          <button
            onClick={() => setShowFilterModal(false)}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded-sm transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid
              </label>
              <select
                value={filters.paid}
                onChange={(e) =>
                  setFilters({ ...filters, paid: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setFilters({ status: "All", paid: "All", unpaid: "All" });
                setShowFilterModal(false);
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-sm font-medium transition-all duration-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-sm font-medium transition-all duration-200 transform shadow-md hover:shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
