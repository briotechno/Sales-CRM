import React from "react";
import { X } from "lucide-react";

export default function CreateQuotationModal({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleCreateQuotation,
}) {
  if (!showModal) return null;

  const inputStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Quotation</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quotation Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className={inputStyles}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter quotation description"
              className={inputStyles}
            ></textarea>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateQuotation}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg transition-all"
            >
              Create Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
