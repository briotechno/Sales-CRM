import React from "react";
import {
    Download, Printer, Mail, Phone, MapPin, Calendar, CreditCard, Package, User, Building, FileText, Globe, X, CheckCircle, DollarSign, Tag, Hash, Building2, ScrollText
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";
import Modal from "../../components/common/Modal";

const ViewInvoiceModal = ({ showModal, setShowModal, invoice }) => {
    const { data: businessInfo } = useGetBusinessInfoQuery();

    if (!invoice) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            let logoData = null;
            if (businessInfo?.logo_url) {
                try {
                    const logoUrl = `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}${businessInfo.logo_url}`;
                    const response = await fetch(logoUrl);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    logoData = await new Promise((resolve) => {
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    console.log('Logo not loaded:', error);
                }
            }

            const brandColor = [255, 123, 29];
            const darkColor = [15, 23, 42];
            const lightText = [51, 65, 85];
            const grayText = [100, 116, 139];
            const borderColor = [226, 232, 240];

            const sidebarWidth = 8;
            doc.setFillColor(...brandColor);
            doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

            doc.setFillColor(253, 247, 242);
            doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, 54, 'F');

            const startX = sidebarWidth + 15;
            let logoY = 10;
            if (logoData) {
                doc.addImage(logoData, 'JPEG', startX, logoY, 28, 18, undefined, 'FAST');
            }
            let textStartX = logoData ? startX + 34 : startX;
            let textY = 15;
            doc.setTextColor(...darkColor);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(businessInfo?.company_name || 'Your Company', textStartX, textY);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...grayText);
            doc.text(businessInfo?.email || '', textStartX, textY + 6);
            doc.text(businessInfo?.phone || '', textStartX, textY + 10);
            if (invoice.business_gstin || businessInfo?.gst_number) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...brandColor);
                doc.text(`GSTIN: ${invoice.business_gstin || businessInfo?.gst_number}`, textStartX, textY + 14);
            }

            const endX = pageWidth - 15;
            doc.setTextColor(...brandColor);
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE', endX, 18, { align: 'right' });

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...lightText);
            const detailsBoxX = pageWidth - 70;
            const detailsValueX = endX;
            let detailsY = 24;
            doc.text('Invoice No:', detailsBoxX, detailsY);
            doc.text('Date:', detailsBoxX, detailsY + 5);
            doc.text('Due Date:', detailsBoxX, detailsY + 10);

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text(String(invoice.invoice_number || invoice.id), detailsValueX, detailsY, { align: 'right' });
            doc.text(String(invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-GB') : ''), detailsValueX, detailsY + 5, { align: 'right' });
            doc.text(String(invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-GB') : 'Not Set'), detailsValueX, detailsY + 10, { align: 'right' });

            const billToY = 60;
            doc.setFillColor(241, 245, 249);
            doc.roundedRect(startX, billToY, endX - startX, 28, 2, 2, 'F');
            doc.setDrawColor(189, 205, 219);
            doc.setLineWidth(0.5);
            doc.roundedRect(startX, billToY, endX - startX, 28, 2, 2);

            doc.setTextColor(...darkColor);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('BILL TO', startX + 6, billToY + 8);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(String(invoice.client_name || 'Client Name'), startX + 6, billToY + 14);

            doc.setFontSize(7);
            doc.setTextColor(...grayText);
            let billToLineY = billToY + 19;
            if (invoice.client_gstin) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...brandColor);
                doc.text(`GSTIN: ${invoice.client_gstin}`, startX + 6, billToLineY);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...grayText);
                billToLineY += 4;
            }

            const clientDetails = [invoice.client_email, invoice.client_phone, invoice.client_address].filter(Boolean).join(', ');
            const addressLines = doc.splitTextToSize(clientDetails, endX - startX - 12);
            doc.text(addressLines, startX + 6, billToLineY);

            const head = [["#", "Description", "Rate", "Qty", "Amount"]];

            const body = (invoice.items && invoice.items.length > 0)
                ? invoice.items.map((item, idx) => {
                    const row = [String(idx + 1), item.name || 'Service'];
                    row.push(`₹${(item.rate || 0).toLocaleString()}`);
                    row.push(String(item.qty || 1));
                    row.push(`₹${(item.total || 0).toLocaleString()}`);
                    return row;
                })
                : [["1", "No items", "₹0", "1", "₹0"]];

            autoTable(doc, {
                startY: billToY + 34,
                margin: { left: startX, right: 15 },
                head: head,
                body: body,
                theme: 'grid',
                headStyles: {
                    fillColor: [15, 23, 42],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 8,
                    cellPadding: 3,
                    halign: 'center',
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 2.5,
                    textColor: [51, 65, 85],
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 10 },
                    1: { halign: 'left' },
                    2: { halign: 'center', cellWidth: 20 },
                    3: { halign: 'right', cellWidth: 24 },
                    4: { halign: 'center', cellWidth: 16 },
                    5: { halign: 'right', cellWidth: 26, fontStyle: 'bold', textColor: [255, 123, 29] }
                }
            });

            const tableEndY = doc.lastAutoTable.finalY;
            const totalsBoxWidth = 70;
            const totalsBoxX = endX - totalsBoxWidth;
            const totalsSectionY = tableEndY + 8;

            doc.setFillColor(253, 247, 242);
            const boxHeight = invoice.tax_type === "GST" ? 48 : 38;
            doc.roundedRect(totalsBoxX - 2, totalsSectionY - 2, totalsBoxWidth + 4, boxHeight, 2, 2, 'F');
            doc.setDrawColor(...brandColor);
            doc.setLineWidth(1);
            doc.roundedRect(totalsBoxX - 2, totalsSectionY - 2, totalsBoxWidth + 4, boxHeight, 2, 2);

            doc.setFontSize(8.5);
            doc.setTextColor(...darkColor);
            let totalY = totalsSectionY + 5;
            const labelX = totalsBoxX + 4;
            const valueX = totalsBoxX + totalsBoxWidth - 4;

            doc.text('Subtotal', labelX, totalY);
            doc.setFont('helvetica', 'bold');
            doc.text(`₹${(invoice.subtotal || 0).toLocaleString()}`, valueX, totalY, { align: 'right' });
            totalY += 7;

            doc.setFont('helvetica', 'normal');
            if (invoice.tax_amount > 0) {
                if (invoice.tax_type === "GST") {
                    const halfTax = invoice.tax_rate / 2;
                    const halfAmount = invoice.tax_amount / 2;

                    doc.text(`CGST (${halfTax}%)`, labelX, totalY);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`₹${halfAmount.toLocaleString()}`, valueX, totalY, { align: 'right' });
                    totalY += 7;

                    doc.setFont('helvetica', 'normal');
                    doc.text(`SGST (${halfTax}%)`, labelX, totalY);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`₹${halfAmount.toLocaleString()}`, valueX, totalY, { align: 'right' });
                    totalY += 7;
                } else {
                    doc.text(`Tax (${invoice.tax_rate || 0}%)`, labelX, totalY);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`₹${(invoice.tax_amount).toLocaleString()}`, valueX, totalY, { align: 'right' });
                    totalY += 7;
                }
            }

            if (invoice.discount > 0) {
                doc.setTextColor([220, 38, 38]);
                doc.setFont('helvetica', 'normal');
                doc.text('Discount', labelX, totalY);
                doc.setFont('helvetica', 'bold');
                doc.text(`- ₹${invoice.discount.toLocaleString()}`, valueX, totalY, { align: 'right' });
                totalY += 7;
            }

            doc.setDrawColor(...borderColor);
            doc.line(labelX, totalY - 1, valueX, totalY - 1);
            totalY += 7;

            doc.setFontSize(11);
            doc.setTextColor(...brandColor);
            doc.text('TOTAL AMOUNT', labelX, totalY);
            doc.text(`₹${(invoice.total_amount || 0).toLocaleString()}`, valueX, totalY, { align: 'right' });

            // Balance Details
            totalY += 8;
            doc.setFontSize(8);
            doc.setTextColor(...grayText);
            doc.setFont('helvetica', 'normal');
            doc.text(`Paid: ₹${invoice.paid_amount.toLocaleString()}`, labelX, totalY);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(invoice.balance_amount > 0 ? [220, 38, 38] : [21, 128, 61]);
            doc.text(`Balance: ₹${invoice.balance_amount.toLocaleString()}`, valueX, totalY, { align: 'right' });

            // Policy Section in PDF
            let policyY = Math.max(tableEndY + 55, totalY + 15);
            if (invoice.terms_and_conditions) {
                doc.setDrawColor(...borderColor);
                doc.line(startX, policyY - 5, endX, policyY - 5);

                doc.setFontSize(8);
                doc.setTextColor(...darkColor);
                doc.setFont('helvetica', 'bold');
                doc.text('Terms & Conditions:', startX, policyY);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(...lightText);
                const termsLines = doc.splitTextToSize(invoice.terms_and_conditions, endX - startX);
                doc.text(termsLines, startX, policyY + 4);
            }

            const footerY = pageHeight - 15;
            doc.setFontSize(7.5);
            doc.setTextColor(...grayText);
            doc.setFont('helvetica', 'normal');
            doc.text('This is a computer generated invoice. No physical signature is required.', pageWidth / 2, footerY, { align: 'center' });
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text(businessInfo?.company_name || 'Your Company', pageWidth / 2, footerY + 5, { align: 'center' });

            doc.save(`Invoice_${invoice.invoice_number}.pdf`);
            toast.success('Professional Invoice PDF generated!');
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
        }
    };

    const statusColors = {
        Paid: "bg-green-50 text-green-700 border-green-200",
        Partial: "bg-yellow-50 text-yellow-700 border-yellow-200",
        Unpaid: "bg-red-50 text-red-700 border-red-200",
    };

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
                type="button"
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
                <Printer size={18} /> Print
            </button>
            <button
                type="button"
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
            >
                <Download size={18} /> Download
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={`Invoice ${String(invoice.invoice_number || invoice.id)}`}
            subtitle={`${invoice.tax_type} Compliant Invoice`}
            icon={<FileText size={24} />}
            maxWidth="max-w-4xl"
            footer={footer}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-sm flex items-center justify-center shadow-sm ${invoice.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {invoice.status === 'Paid' ? <CheckCircle size={24} /> : <FileText size={24} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Status</p>
                            <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${statusColors[invoice.status]}`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invoice Amount</p>
                        <p className="text-2xl font-bold text-slate-900">₹{invoice.total_amount?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3 p-5 bg-white border border-slate-100 rounded-sm">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Building size={14} className="text-orange-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Business Details</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{businessInfo?.company_name}</h4>
                        {businessInfo?.gst_number && (
                            <p className="text-[10px] text-orange-600 font-bold uppercase">GSTIN: {businessInfo.gst_number}</p>
                        )}
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {businessInfo?.street_address}, {businessInfo?.city}
                        </p>
                    </div>

                    <div className="space-y-3 p-5 bg-white border border-slate-100 rounded-sm">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <User size={14} className="text-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Client Details</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{invoice.client_name}</h4>
                        {invoice.client_gstin && (
                            <p className="text-[10px] text-blue-600 font-bold uppercase">GSTIN: {invoice.client_gstin}</p>
                        )}
                        <p className="text-xs text-slate-500 leading-relaxed font-medium truncate">
                            {invoice.client_email}
                        </p>
                    </div>

                    <div className="space-y-3 p-5 bg-white border border-slate-100 rounded-sm">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Calendar size={14} className="text-purple-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Date & Period</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Dated:</span>
                                <span className="font-bold text-slate-900">{formatDate(invoice.invoice_date)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Due by:</span>
                                <span className="font-bold text-slate-700">{formatDate(invoice.due_date)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-slate-100 rounded-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Description</th>
                                <th className="px-5 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">Qty</th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">Rate</th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {invoice.items?.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4 text-xs font-bold text-slate-800">{item.name}</td>
                                    <td className="px-5 py-4 text-center text-xs font-bold text-slate-600">{item.qty}</td>
                                    <td className="px-5 py-4 text-right text-xs font-bold text-slate-600">₹{item.rate?.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-right text-xs font-bold text-orange-600">₹{item.total?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                    <div className="space-y-4">
                        {invoice.terms_and_conditions && (
                            <div className="p-5 bg-white border border-slate-100 rounded-sm">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <ScrollText size={14} className="text-orange-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Terms & Conditions</span>
                                </div>
                                <div className="text-xs text-gray-600 leading-relaxed italic whitespace-pre-line">
                                    {invoice.terms_and_conditions}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-green-50/50 rounded-sm border border-green-100">
                                <p className="text-[9px] font-bold text-green-600 uppercase mb-1">Collected</p>
                                <p className="text-sm font-bold text-green-700">₹{invoice.paid_amount?.toLocaleString()}</p>
                            </div>
                            <div className={`p-3 rounded-sm border ${invoice.balance_amount > 0 ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
                                <p className={`text-[9px] font-bold uppercase mb-1 ${invoice.balance_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>Pending</p>
                                <p className={`text-sm font-bold ${invoice.balance_amount > 0 ? 'text-red-700' : 'text-green-700'}`}>₹{invoice.balance_amount?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-sm text-white shadow-lg space-y-3 relative overflow-hidden h-fit">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>₹{invoice.subtotal?.toLocaleString()}</span>
                        </div>

                        {invoice.tax_type === "GST" ? (
                            <>
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>CGST ({invoice.tax_rate / 2}%)</span>
                                    <span>₹{(invoice.tax_amount / 2)?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>SGST ({invoice.tax_rate / 2}%)</span>
                                    <span>₹{(invoice.tax_amount / 2)?.toLocaleString()}</span>
                                </div>
                            </>
                        ) : invoice.tax_rate > 0 ? (
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>Tax ({invoice.tax_rate}%)</span>
                                <span>₹{invoice.tax_amount?.toLocaleString()}</span>
                            </div>
                        ) : null}

                        {invoice.discount > 0 && (
                            <div className="flex justify-between items-center text-[10px] font-bold text-red-400 uppercase tracking-widest">
                                <span>Discount</span>
                                <span>- ₹{invoice.discount?.toLocaleString()}</span>
                            </div>
                        )}

                        <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Final Payable</p>
                                <p className="text-3xl font-bold text-white tracking-tight">₹{invoice.total_amount?.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                                <Building2 className="text-orange-500" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewInvoiceModal;
