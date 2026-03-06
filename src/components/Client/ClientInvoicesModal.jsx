import React from "react";
import { X, FileText, Plus, Eye, Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "../common/Modal";
import ViewInvoiceModal from "../../pages/InvoicePart/ViewInvoiceModal";
import { useGetInvoicesQuery } from "../../store/api/invoiceApi";

export default function ClientInvoicesModal({ isOpen, onClose, client, onGenerateInvoice }) {
    const { data: invoicesData, isLoading } = useGetInvoicesQuery({
        client_id: client?.id,
        limit: 100
    }, {
        skip: !client?.id || !isOpen,
        refetchOnMountOrArgChange: true
    });

    const [showViewModal, setShowViewModal] = React.useState(false);
    const [selectedInvoiceForView, setSelectedInvoiceForView] = React.useState(null);

    const invoices = invoicesData?.invoices || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
            case 'Partial': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Unpaid': return 'bg-red-50 text-red-700 border-red-200';
            case 'Draft': return 'bg-gray-50 text-gray-700 border-gray-200';
            default: return 'bg-orange-50 text-orange-700 border-orange-200';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${client?.type === 'person' ? `${client?.first_name} ${client?.last_name || ''}` : client?.company_name}'s Invoices`}
            subtitle="Manage and track invoices for this client"
            icon={<FileText size={24} />}
            maxWidth="max-w-4xl"
        >
            <div className="space-y-6 min-h-[400px] max-h-[70vh] flex flex-col font-primary">
                <div className="flex justify-between items-center bg-gray-50 p-5 rounded-sm border border-gray-200 shrink-0">
                    <div>
                        <p className="text-[12px] text-gray-600 font-semibold capitalize tracking-tight mb-1">Client Name</p>
                        <p className="text-base font-bold text-gray-800 capitalize">
                            {client?.type === 'person' ? `${client?.first_name} ${client?.last_name || ''}` : client?.company_name}
                        </p>
                    </div>
                    <button
                        onClick={onGenerateInvoice}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md flex items-center gap-2 font-bold text-xs capitalize tracking-widest active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Generate Invoice
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
                    <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#FF7B1D] text-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold capitalize tracking-widest">Invoice ID</th>
                                    <th className="px-6 py-4 text-xs font-bold capitalize tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold capitalize tracking-widest text-right">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold capitalize tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold capitalize tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-100 border-t-[#FF7B1D] mx-auto"></div>
                                                <p className="text-xs font-semibold text-gray-500 capitalize tracking-tight animate-pulse">Fetching Invoices...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : invoices.length > 0 ? (
                                    invoices.map((invoice, idx) => (
                                        <tr key={invoice.id} className={`hover:bg-orange-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-800 tracking-tight">{invoice.invoice_number}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                    <Calendar size={14} className="text-orange-400" />
                                                    {new Date(invoice.invoice_date).toLocaleDateString('en-GB')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className="text-sm font-bold text-gray-800">₹{(invoice.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-black border capitalize shadow-sm ${getStatusColor(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInvoiceForView(invoice);
                                                            setShowViewModal(true);
                                                        }}
                                                        className="p-2 hover:bg-blue-50 rounded text-blue-500 transition-all border border-transparent hover:border-blue-100 shadow-sm bg-white"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shadow-inner">
                                                    <AlertCircle size={40} className="text-orange-200" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-bold text-gray-800 capitalize tracking-tight">No Invoices Found</p>
                                                    <p className="text-[11px] font-bold text-gray-400 capitalize tracking-widest leading-relaxed">This client doesn't have any professional invoices generated yet.</p>
                                                </div>
                                                <button
                                                    onClick={onGenerateInvoice}
                                                    className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md flex items-center gap-2 font-bold text-xs capitalize tracking-widest active:scale-95"
                                                >
                                                    <Plus size={16} strokeWidth={3} />
                                                    Add First Invoice
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedInvoiceForView && (
                <ViewInvoiceModal
                    showModal={showViewModal}
                    setShowModal={setShowViewModal}
                    invoice={selectedInvoiceForView}
                />
            )}
        </Modal>
    );
}
