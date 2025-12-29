import React from "react";
import { X, Printer } from "lucide-react";

export default function ViewQuotationModal({
  showViewModal,
  setShowViewModal,
  selectedQuote,
  getStatusColor,
}) {
  if (!showViewModal || !selectedQuote) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center">
          <h2 className="text-2xl font-bold">Quotation Details</h2>
          <button
            onClick={() => setShowViewModal(false)}
            className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                Quotation ID
              </p>
              <p className="text-lg font-bold text-orange-600">
                {selectedQuote.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-sm text-sm font-semibold ${getStatusColor(
                  selectedQuote.status
                )}`}
              >
                {selectedQuote.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                Client Name
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {selectedQuote.client}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Amount</p>
              <p className="text-lg font-bold text-gray-800">
                ${selectedQuote.amount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Date</p>
              <p className="text-lg text-gray-800">{selectedQuote.date}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                Valid Until
              </p>
              <p className="text-lg text-gray-800">
                {selectedQuote.validUntil}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">
              Description
            </p>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-sm">
              {selectedQuote.description || "No description provided"}
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowViewModal(false)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700"
            >
              Close
            </button>
            <button
              onClick={() => window.alert("Print functionality")}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <Printer size={20} />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
