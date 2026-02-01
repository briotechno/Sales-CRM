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
                    if (!response.ok) throw new Error("Logo not found");
                    const blob = await response.blob();
                    if (!blob.type.startsWith('image/')) throw new Error("Not an image");

                    const reader = new FileReader();
                    logoData = await new Promise((resolve, reject) => {
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    console.log('Logo not loaded:', error);
                }
            }

            // Design Tokens
            const brandColor = [255, 123, 29]; // Orange
            const darkColor = [15, 23, 42];  // Slate 900
            const lightText = [71, 85, 105];  // Slate 600
            const grayText = [148, 163, 184]; // Slate 400

            // Sidebar Branding
            const sidebarWidth = 6;
            doc.setFillColor(...brandColor);
            doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

            const startX = sidebarWidth + 12;
            const endX = pageWidth - 12;
            const usableWidth = endX - startX;

            // TOP HEADER SECTION
            doc.setFillColor(248, 250, 252);
            doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, 50, 'F');

            // Logo and Title
            if (logoData && logoData.startsWith('data:image')) {
                const format = logoData.includes('png') ? 'PNG' : 'JPEG';
                try {
                    doc.addImage(logoData, format, startX, 10, 30, 20, undefined, 'FAST');
                } catch (e) {
                    doc.setFillColor(...darkColor);
                    doc.roundedRect(startX, 12, 12, 12, 2, 2, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(14);
                    doc.text(businessInfo?.company_name?.[0] || 'I', startX + 4, 20);
                }
            } else {
                doc.setFillColor(...darkColor);
                doc.roundedRect(startX, 12, 12, 12, 2, 2, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(14);
                doc.text(businessInfo?.company_name?.[0] || 'I', startX + 4, 20);
            }

            doc.setTextColor(...brandColor);
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE', endX, 22, { align: 'right' });

            doc.setTextColor(...darkColor);
            doc.setFontSize(10);
            doc.text(`#${invoice.invoice_number}`, endX, 28, { align: 'right' });

            // Status Badge
            const statusLabel = invoice.status.toUpperCase();
            const badgeW = doc.getTextWidth(statusLabel) + 8;
            doc.setFillColor(invoice.status === 'Paid' ? 34 : 220, invoice.status === 'Paid' ? 197 : 38, invoice.status === 'Paid' ? 94 : 38);
            doc.roundedRect(endX - badgeW, 33, badgeW, 7, 1, 1, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(statusLabel, endX - badgeW / 2, 38, { align: 'center' });

            // Details Block
            let infoTop = 65;
            doc.setDrawColor(241, 245, 249);
            doc.line(startX, 50, endX, 50);

            // Left: Business Info
            doc.setTextColor(...darkColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('FROM:', startX, infoTop);
            doc.setFontSize(11);
            doc.text(businessInfo?.company_name || 'Business Name', startX, infoTop + 7);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...lightText);
            doc.text([
                businessInfo?.email || '',
                businessInfo?.phone || '',
                `GSTIN: ${businessInfo?.gst_number || invoice.business_gstin || 'N/A'}`
            ], startX, infoTop + 13);
            doc.setFontSize(8);
            const bizAddr = doc.splitTextToSize(businessInfo?.street_address || '', usableWidth / 2 - 10);
            doc.text(bizAddr, startX, infoTop + 26);

            // Right: Client Info
            doc.setTextColor(...darkColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('BILL TO:', pageWidth / 2 + 10, infoTop);
            doc.setFontSize(11);
            doc.text(invoice.client_name || 'Client', pageWidth / 2 + 10, infoTop + 7);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...lightText);
            doc.text([
                invoice.client_email || '',
                invoice.client_phone || '',
                `GSTIN: ${invoice.client_gstin || 'N/A'}`
            ], pageWidth / 2 + 10, infoTop + 13);
            doc.setFontSize(8);
            const clientAddr = doc.splitTextToSize(invoice.client_address || '', usableWidth / 2 - 10);
            doc.text(clientAddr, pageWidth / 2 + 10, infoTop + 26);

            // Date horizontal Bar
            let barY = infoTop + 48;
            doc.setFillColor(253, 247, 242);
            doc.roundedRect(startX, barY, usableWidth, 14, 1, 1, 'F');
            doc.setFontSize(9);
            doc.setTextColor(...darkColor);

            doc.setFont('helvetica', 'bold');
            doc.text('DATE:', startX + 6, barY + 9);
            doc.setFont('helvetica', 'normal');
            doc.text(formatDate(invoice.invoice_date), startX + 22, barY + 9);

            doc.setFont('helvetica', 'bold');
            doc.text('DUE DATE:', startX + usableWidth / 2, barY + 9);
            doc.setFont('helvetica', 'normal');
            doc.text(formatDate(invoice.due_date), startX + usableWidth / 2 + 22, barY + 9);

            // Tables
            const head = [["#", "Item Description", "Qty", "Rate", "Amount"]];
            const body = (invoice.items || []).map((item, idx) => [
                idx + 1,
                item.name,
                item.qty,
                `${item.rate.toLocaleString()}`,
                `${item.total.toLocaleString()}`
            ]);

            autoTable(doc, {
                startY: barY + 22,
                margin: { left: startX, right: 12 },
                head: head,
                body: body,
                theme: 'striped',
                headStyles: {
                    fillColor: [15, 23, 42],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                    halign: 'left',
                    cellPadding: 5
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [15, 23, 42],
                    cellPadding: 5
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 12 },
                    2: { halign: 'center', cellWidth: 20 },
                    3: { halign: 'right', cellWidth: 35 },
                    4: { halign: 'right', cellWidth: 35, fontStyle: 'bold' }
                }
            });

            // Summary Bottom Section
            let finalY = doc.lastAutoTable.finalY + 12;
            const summaryW = 85;
            const summaryX = endX - summaryW;

            // Background for summary
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(summaryX, finalY, summaryW, 45, 2, 2, 'F');

            let stY = finalY + 10;
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.setFont('helvetica', 'bold');
            doc.text('SUBTOTAL', summaryX + 10, stY);
            doc.setTextColor(255, 255, 255);
            doc.text(`INR ${invoice.subtotal.toLocaleString()}`, endX - 10, stY, { align: 'right' });

            if (invoice.discount > 0) {
                stY += 8;
                doc.setTextColor(248, 113, 113);
                doc.text('DISCOUNT', summaryX + 10, stY);
                doc.text(`- INR ${invoice.discount.toLocaleString()}`, endX - 10, stY, { align: 'right' });
            }

            if (invoice.tax_amount > 0) {
                stY += 8;
                doc.setTextColor(148, 163, 184);
                const taxLabel = invoice.tax_type === "GST" ? `GST (${invoice.tax_rate}%)` : `TAX (${invoice.tax_rate}%)`;
                doc.text(taxLabel, summaryX + 10, stY);
                doc.setTextColor(255, 255, 255);
                doc.text(`INR ${invoice.tax_amount.toLocaleString()}`, endX - 10, stY, { align: 'right' });
            }

            stY += 10;
            doc.setDrawColor(255, 255, 255, 0.1);
            doc.line(summaryX + 10, stY - 4, endX - 10, stY - 4);

            doc.setFontSize(11);
            doc.setTextColor(...brandColor);
            doc.text('TOTAL', summaryX + 10, stY + 2);
            doc.setFontSize(14); // Reduced from 16 to avoid clipping
            doc.setTextColor(255, 255, 255);
            doc.text(`INR ${invoice.total_amount.toLocaleString()}`, endX - 10, stY + 3, { align: 'right' });

            // Left side payment summary
            let payBoxY = finalY;
            doc.setFillColor(240, 253, 244);
            doc.roundedRect(startX, payBoxY, usableWidth - summaryW - 10, 20, 1, 1, 'F');
            doc.setFontSize(8);
            doc.setTextColor(22, 101, 52);
            doc.setFont('helvetica', 'bold');
            doc.text('COLLECTED AMOUNT', startX + 6, payBoxY + 8);
            doc.setFontSize(11);
            doc.text(`INR ${invoice.paid_amount.toLocaleString()}`, startX + 6, payBoxY + 16);

            doc.setFillColor(254, 242, 242);
            doc.roundedRect(startX, payBoxY + 25, usableWidth - summaryW - 10, 20, 1, 1, 'F');
            doc.setFontSize(8);
            doc.setTextColor(153, 27, 27);
            doc.setFont('helvetica', 'bold');
            doc.text('PENDING BALANCE', startX + 6, payBoxY + 33);
            doc.setFontSize(11);
            doc.text(`INR ${invoice.balance_amount.toLocaleString()}`, startX + 6, payBoxY + 41);

            // Policy Section
            if (invoice.terms_and_conditions) {
                let polY = payBoxY + 60;
                doc.setTextColor(...darkColor);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('TERMS & CONDITIONS', startX, polY);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(...lightText);
                const terms = doc.splitTextToSize(invoice.terms_and_conditions, usableWidth);
                doc.text(terms, startX, polY + 6);
            }

            // Footer
            const footerH = 15;
            doc.setFillColor(...darkColor);
            doc.rect(sidebarWidth, pageHeight - footerH, pageWidth - sidebarWidth, footerH, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(`Thank you for doing business with ${businessInfo?.company_name || 'Business'}!`, (pageWidth + sidebarWidth) / 2, pageHeight - 6, { align: 'center' });

            doc.save(`Invoice_${invoice.invoice_number}.pdf`);
            toast.success('Professional Invoice Downloaded!');
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
