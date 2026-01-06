import React from "react";
import { X, Printer, Calendar, User, Building2, Mail, Phone, FileText } from "lucide-react";

export default function ViewQuotationModal({
  showViewModal,
  setShowViewModal,
  selectedQuote,
  getStatusColor,
}) {
  if (!showViewModal || !selectedQuote) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Quotation Details</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium border border-white/30">
              {selectedQuote.id}
            </span>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Status & Dates Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-orange-50 p-4 rounded-sm border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-sm text-orange-500 shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</p>
                <span className={`text-sm font-bold ${getStatusColor(selectedQuote.status)} px-2 py-0.5 rounded-sm inline-block mt-0.5`}>
                  {selectedQuote.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l md:border-l border-orange-200 pl-4">
              <div className="p-2 bg-white rounded-sm text-orange-500 shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quotation Date</p>
                <p className="text-sm font-bold text-gray-800">{selectedQuote.quotation_date ? new Date(selectedQuote.quotation_date).toLocaleDateString() : selectedQuote.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-orange-200 pl-4">
              <div className="p-2 bg-white rounded-sm text-orange-500 shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valid Until</p>
                <p className="text-sm font-bold text-gray-800">
                  {selectedQuote.valid_until ? new Date(selectedQuote.valid_until).toLocaleDateString() : (selectedQuote.validUntil || "Not specified")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <User size={20} className="text-orange-500" />
                Client Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <Building2 size={18} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{selectedQuote.client_name || selectedQuote.client}</p>
                    <p className="text-xs text-gray-500">
                      {selectedQuote.company_name || selectedQuote.companyName || "No Company Name Provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <p className="text-sm text-gray-700">{selectedQuote.email || "No Email Provided"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <p className="text-sm text-gray-700">{selectedQuote.phone || "No Phone Provided"}</p>
                </div>
              </div>
            </section>

            {/* Financial Summary Preview */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                Financial Summary
              </h3>
              <div className="bg-gray-50 p-6 rounded-sm space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{(selectedQuote.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({selectedQuote.tax || 0}%)</span>
                  <span className="font-semibold">{(((selectedQuote.subtotal || 0) * (selectedQuote.tax || 0)) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 pb-2 border-b">
                  <span>Discount</span>
                  <span className="font-semibold">-{(selectedQuote.discount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Grand Total</span>
                  <span className="text-orange-600">
                    {selectedQuote.currency === "INR" ? "₹" : "$"} {(selectedQuote.total_amount || selectedQuote.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Line Items Table */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Line Items</h3>
            <div className="border border-gray-100 rounded-sm overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b">
                  <tr>
                    <th className="px-6 py-3 text-left">Item Description</th>
                    <th className="px-4 py-3 text-center w-24">Qty</th>
                    <th className="px-6 py-3 text-right w-32">Rate</th>
                    <th className="px-6 py-3 text-right w-32">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {((selectedQuote.line_items || selectedQuote.lineItems || []).length > 0) ? (
                    (selectedQuote.line_items || selectedQuote.lineItems).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800 font-medium">{item.name}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{item.qty}</td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {(item.rate || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          {(item.total || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 bg-gray-50/50">
                        No individual line items recorded. Total amount is {(selectedQuote.total_amount || selectedQuote.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Extras Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <section className="space-y-3">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Payment Terms</h4>
              <div className="p-4 bg-gray-50 rounded-sm border-l-4 border-orange-500 text-sm text-gray-700 min-h-[100px]">
                {selectedQuote.payment_terms || selectedQuote.paymentTerms || "No specific payment terms provided."}
              </div>
            </section>
            <section className="space-y-3">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Notes / T&C</h4>
              <div className="p-4 bg-gray-50 rounded-sm border-l-4 border-orange-500 text-sm text-gray-700 min-h-[100px]">
                {selectedQuote.notes || selectedQuote.description || "No additional notes or terms provided."}
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() => setShowViewModal(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-sm hover:bg-gray-50 font-bold text-gray-700 transition-all uppercase tracking-wide text-sm"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              <Printer size={18} />
              Download/Print PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

