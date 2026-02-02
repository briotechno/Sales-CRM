import React from "react";
import {
  FileText,
  Printer,
  Calendar,
  Building2,
  Building,
  Mail,
  Phone,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Hash,
  Briefcase
} from "lucide-react";
import Modal from "../common/Modal";

export default function ViewQuotationModal({
  showViewModal,
  setShowViewModal,
  selectedQuote,
  getStatusColor,
}) {
  if (!selectedQuote) return null;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "approved":
      case "sent":
        return <CheckCircle size={14} className="mr-1" />;
      case "rejected":
      case "cancelled":
        return <XCircle size={14} className="mr-1" />;
      case "pending":
      case "draft":
        return <Clock size={14} className="mr-1" />;
      default:
        return <AlertCircle size={14} className="mr-1" />;
    }
  };

  const getStatusDisplayColor = (status) => {
    const rawColor = getStatusColor(status);
    // Extract color class from getStatusColor if it returns something like "text-green-500"
    if (status?.toLowerCase() === "accepted" || status?.toLowerCase() === "approved") {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (status?.toLowerCase() === "rejected" || status?.toLowerCase() === "cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    } else if (status?.toLowerCase() === "pending" || status?.toLowerCase() === "draft") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const footer = (
    <div className="flex gap-3 w-full">
      <button
        onClick={() => setShowViewModal(false)}
        className="flex-1 px-6 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
      >
        Close
      </button>
      <button
        onClick={() => {
          window.print();
        }}
        className="flex-1 px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all flex items-center justify-center gap-2"
      >
        <Printer size={18} />
        Print / Save PDF
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={showViewModal}
      onClose={() => setShowViewModal(false)}
      title="Quotation Details"
      subtitle="Comprehensive view of your business proposal"
      icon={<FileText size={24} />}
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <div className="flex flex-col h-full space-y-6">
        {/* Header Summary Card */}
        <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl border border-orange-100 flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-orange-300">
                PROPOSAL
              </span>
              <span className="text-gray-400 font-medium text-sm flex items-center gap-1">
                <Hash size={12} />
                {selectedQuote.quotation_id || selectedQuote.id}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedQuote.company_name || selectedQuote.companyName || "Untitled Proposal"}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                <Calendar size={14} className="text-orange-500" />
                {selectedQuote.quotation_date ? new Date(selectedQuote.quotation_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : selectedQuote.date}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center shadow-sm ${getStatusDisplayColor(selectedQuote.status)}`}>
                {getStatusIcon(selectedQuote.status)}
                {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right bg-white p-4 rounded-xl border border-orange-100 shadow-sm min-w-[180px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</p>
            <p className="text-3xl font-black text-orange-600 flex items-center md:justify-end tabular-nums">
              <span className="text-lg font-normal mr-1">{selectedQuote.currency === "INR" ? "₹" : "$"}</span>
              {(selectedQuote.total_amount || selectedQuote.amount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <Building2 size={20} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client Contact</span>
            </div>
            <div className="space-y-1.5 ml-1">
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Mail size={12} className="text-gray-400" />
                {selectedQuote.email || "N/A"}
              </p>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Phone size={12} className="text-gray-400" />
                {selectedQuote.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <Clock size={20} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Validity</span>
            </div>
            <div className="ml-1">
              <p className="text-sm font-bold text-gray-800 mb-0.5">Valid Until</p>
              <p className="text-xs font-medium text-gray-500">
                {selectedQuote.valid_until ? new Date(selectedQuote.valid_until).toLocaleDateString() : (selectedQuote.validUntil || "Not specified")}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                <Briefcase size={20} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scope</span>
            </div>
            <div className="ml-1">
              <p className="text-sm font-bold text-gray-800 mb-0.5">Line Items</p>
              <p className="text-xs font-medium text-gray-500">
                {(selectedQuote.line_items || selectedQuote.lineItems || []).length} items included
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Tag size={18} className="text-orange-500" />
              Service & Item Breakdown
            </h4>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-widest text-[10px] text-gray-400">Description</th>
                  <th className="px-4 py-4 text-center w-24 font-bold uppercase tracking-widest text-[10px] text-gray-400">Qty</th>
                  <th className="px-6 py-4 text-right w-32 font-bold uppercase tracking-widest text-[10px] text-gray-400">Rate</th>
                  <th className="px-6 py-4 text-right w-32 font-bold uppercase tracking-widest text-[10px] text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {((selectedQuote.line_items || selectedQuote.lineItems || []).length > 0) ? (
                  (selectedQuote.line_items || selectedQuote.lineItems).map((item, index) => (
                    <tr key={index} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-6 py-4 text-gray-800 font-bold">{item.name}</td>
                      <td className="px-4 py-4 text-center text-gray-600 font-medium">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-gray-600 font-medium">
                        {(item.rate || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">
                        {(item.total || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                      <div className="flex flex-col items-center gap-2">
                        <XCircle size={32} className="text-gray-300" />
                        <p className="font-medium">No individual line items recorded.</p>
                        <p className="text-xs text-gray-400">Total amount is {(selectedQuote.total_amount || selectedQuote.amount || 0).toLocaleString()}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Financials */}
          <section className="space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Briefcase size={18} className="text-orange-500" />
              Payment Summary
            </h4>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subtotal</span>
                <span className="text-sm font-bold text-gray-700">{(selectedQuote.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tax ({selectedQuote.tax || 0}%)</span>
                <span className="text-sm font-bold text-gray-700">+{(((selectedQuote.subtotal || 0) * (selectedQuote.tax || 0)) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Discount</span>
                <span className="text-sm font-bold text-red-500">-{(selectedQuote.discount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Payable Amount</span>
                <span className="text-2xl font-black text-orange-600 tabular-nums">
                  <span className="text-sm font-normal mr-1">{selectedQuote.currency === "INR" ? "₹" : "$"}</span>
                  {(selectedQuote.total_amount || selectedQuote.amount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          {/* Terms */}
          <section className="space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-orange-500" />
              Terms & Legal
            </h4>
            <div className="p-5 bg-white rounded-xl border-1.5 border-dashed border-gray-200 text-xs text-gray-600 leading-relaxed italic relative h-[calc(100%-2.5rem)] overflow-y-auto max-h-[220px] custom-scrollbar">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Building size={48} />
              </div>
              <p className="relative z-10 whitespace-pre-line">
                {selectedQuote.terms_and_conditions || "Standard business terms apply. No specific conditions provided for this quotation."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
