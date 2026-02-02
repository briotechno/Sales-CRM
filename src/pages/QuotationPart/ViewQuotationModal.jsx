import React from "react";
import { X, Printer, Calendar, User, Building2, Building, Mail, Phone, FileText, Tag, MapPin, Hash, UserCheck, Briefcase, CreditCard, ScrollText } from "lucide-react";
import Modal from "../../components/common/Modal";

export default function ViewQuotationModal({
  showViewModal,
  setShowViewModal,
  selectedQuote,
  getStatusColor,
}) {
  if (!showViewModal || !selectedQuote) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const footer = (
    <div className="flex gap-4 w-full">
      <button
        onClick={() => setShowViewModal(false)}
        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
      >
        Close
      </button>
      <button
        onClick={() => window.print()}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <Printer size={18} /> Print Quotation
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={showViewModal}
      onClose={() => setShowViewModal(false)}
      title={`Quotation Details`}
      subtitle={selectedQuote.quotation_id || selectedQuote.id}
      icon={<FileText size={24} />}
      maxWidth="max-w-5xl"
      footer={footer}
    >
      <div className="space-y-8 py-2">
        {/* Status & Dates Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-orange-50 p-5 rounded-sm border border-orange-100">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-600/70 uppercase tracking-widest">Status</p>
              <span className={`text-xs font-bold uppercase ${getStatusColor(selectedQuote.status)} px-2.5 py-1 rounded-sm border inline-block mt-1`}>
                {selectedQuote.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l md:border-l border-orange-100 pl-4">
            <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-600/70 uppercase tracking-widest">Date</p>
              <p className="text-sm font-black text-gray-800 mt-0.5">{formatDate(selectedQuote.quotation_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-orange-100 pl-4">
            <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-600/70 uppercase tracking-widest">Valid Until</p>
              <p className="text-sm font-black text-gray-800 mt-0.5">{formatDate(selectedQuote.valid_until) || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-orange-100 pl-4">
            <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-600/70 uppercase tracking-widest">Executive</p>
              <p className="text-sm font-black text-gray-800 mt-0.5">{selectedQuote.sales_executive || "Not Set"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Info */}
          <section className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 uppercase tracking-wider">
                <Building size={18} className="text-orange-500" />
                Client Information
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${selectedQuote.customer_type === 'Individual' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {selectedQuote.customer_type || 'Business'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-gray-50 rounded">
                  {selectedQuote.customer_type === 'Individual' ? <User size={16} className="text-gray-400" /> : <Briefcase size={16} className="text-gray-400" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedQuote.customer_type === 'Individual' ? 'Full Name' : 'Company Name'}</p>
                  <p className="text-sm font-black text-gray-900">{selectedQuote.company_name || "N/A"}</p>
                </div>
              </div>

              {selectedQuote.customer_type !== 'Individual' && selectedQuote.contact_person && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-gray-50 rounded">
                    <UserCheck size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Person</p>
                    <p className="text-sm font-black text-gray-900">{selectedQuote.contact_person}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-gray-50 rounded">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-gray-700 break-all">{selectedQuote.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-gray-50 rounded">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-bold text-gray-700">{selectedQuote.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-gray-50 rounded">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</p>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {selectedQuote.billing_address}
                    <br />
                    <span className="font-bold text-gray-900">{selectedQuote.state} - {selectedQuote.pincode}</span>
                  </p>
                </div>
              </div>

              {(selectedQuote.gstin || selectedQuote.pan_number || selectedQuote.cin_number) && (
                <div className="pt-4 border-t border-gray-50 grid grid-cols-3 gap-2">
                  {selectedQuote.gstin && (
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">GSTIN</p>
                      <p className="text-[10px] font-black text-gray-800">{selectedQuote.gstin}</p>
                    </div>
                  )}
                  {selectedQuote.pan_number && (
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">PAN</p>
                      <p className="text-[10px] font-black text-gray-800">{selectedQuote.pan_number}</p>
                    </div>
                  )}
                  {selectedQuote.cin_number && (
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">CIN/MSME</p>
                      <p className="text-[10px] font-black text-gray-800">{selectedQuote.cin_number}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Financial Summary Preview */}
          <section className="space-y-4">
            <div className="bg-[#1a202c] p-8 rounded-sm text-white shadow-xl relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-500/20 transition-all duration-500"></div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Currency</span>
                  <span className="text-xs font-black">{selectedQuote.currency || "INR"}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-gray-200">{(selectedQuote.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <span>Tax ({selectedQuote.tax || 0}%)</span>
                    <span className="text-gray-200">{(((selectedQuote.subtotal || 0) * (selectedQuote.tax || 0)) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-400 text-[10px] font-black uppercase tracking-widest pb-4">
                    <span>Discount</span>
                    <span>-{(selectedQuote.discount || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Grand Total</p>
                    <p className="text-4xl font-black text-white tracking-tighter">
                      <span className="text-lg text-orange-500 mr-1">{selectedQuote.currency === "INR" ? "₹" : "$"}</span>
                      {(selectedQuote.total_amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Line Items Table */}
        <section className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 uppercase tracking-wider">
              <ScrollText size={18} className="text-orange-500" />
              Line Items
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {(selectedQuote.line_items || []).length} Items Added
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-4 py-4 text-center w-24">Qty</th>
                <th className="px-6 py-4 text-right w-36">Rate</th>
                <th className="px-6 py-4 text-right w-36">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(selectedQuote.line_items || []).length > 0 ? (
                selectedQuote.line_items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      {item.sku && <p className="text-[10px] text-gray-400 mt-0.5">SKU: {item.sku}</p>}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-600 bg-gray-50/30">{item.qty}</td>
                    <td className="px-6 py-4 text-right text-gray-600 font-bold">
                      ₹{(item.rate || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900 italic">
                      ₹{(item.total || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/20 italic">
                    No line items recorded for this quotation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Terms Section */}
        {selectedQuote.terms_and_conditions && (
          <section className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ScrollText size={14} className="text-orange-500" />
                Terms & Conditions
              </h3>
            </div>
            <div className="p-6 text-xs text-gray-600 leading-relaxed bg-white whitespace-pre-line font-medium italic break-words overflow-wrap-anywhere">
              {selectedQuote.terms_and_conditions}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
