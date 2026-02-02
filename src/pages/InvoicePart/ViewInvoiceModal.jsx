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
                `GSTIN: ${businessInfo?.gst_number || invoice.business_gstin || 'N/A'}`,
                `State: ${businessInfo?.state || 'N/A'}`
            ], startX, infoTop + 13);
            doc.setFontSize(8);
            const bizAddr = doc.splitTextToSize(businessInfo?.street_address || '', usableWidth / 2 - 10);
            doc.text(bizAddr, startX, infoTop + 30);

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
            const clientInfoLines = [
                invoice.client_email || '',
                invoice.client_phone || '',
                invoice.contact_person ? `Contact: ${invoice.contact_person}` : '',
                `GSTIN: ${invoice.client_gstin || 'N/A'}`,
                invoice.state ? `State: ${invoice.state}` : ''
            ].filter(line => line !== '');

            doc.text(clientInfoLines, pageWidth / 2 + 10, infoTop + 13);

            doc.setFontSize(8);
            let addressStr = invoice.client_address || '';
            if (invoice.pincode) addressStr += ` - ${invoice.pincode}`;
            const clientAddr = doc.splitTextToSize(addressStr, usableWidth / 2 - 10);
            doc.text(clientAddr, pageWidth / 2 + 10, infoTop + 13 + (clientInfoLines.length * 4) + 1);

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
        Paid: "bg-green-100 text-green-700 border-green-200",
        Partial: "bg-blue-100 text-blue-700 border-blue-200",
        Unpaid: "bg-red-100 text-red-700 border-red-200",
        Draft: "bg-gray-100 text-gray-700 border-gray-200",
        Sent: "bg-orange-100 text-orange-700 border-orange-200",
        Cancelled: "bg-slate-100 text-slate-700 border-slate-200",
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
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
                <Printer size={18} /> Print Invoice
            </button>
            <button
                type="button"
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
            >
                <Download size={18} /> Download PDF
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={`Invoice ${invoice.invoice_number}`}
            subtitle={invoice.tax_type === 'GST' ? 'GST Tax Invoice' : 'Simple / Non-GST Invoice'}
            icon={<FileText size={24} />}
            maxWidth="max-w-4xl"
            footer={footer}
        >
            <div className="space-y-8 py-2">
                {/* Status & Dates Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-orange-50 p-5 rounded-sm border border-orange-100">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
                            <Tag size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Payment Status</p>
                            <span className={`text-xs font-bold ${statusColors[invoice.status] || statusColors.Unpaid} px-3 py-1 rounded-sm border uppercase`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border-l border-orange-200 pl-4">
                        <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Invoice Date</p>
                            <p className="text-sm font-bold text-gray-800">{formatDate(invoice.invoice_date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border-l border-orange-200 pl-4">
                        <div className="p-2.5 bg-white rounded-sm text-orange-500 shadow-sm border border-orange-100">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Due Date</p>
                            <p className="text-sm font-bold text-gray-800">{formatDate(invoice.due_date)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Business Details */}
                    <section className="space-y-5">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 border-b-2 border-orange-500 pb-2 uppercase tracking-widest">
                            <Building size={18} className="text-orange-500" />
                            Business Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building2 size={16} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{businessInfo?.company_name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Registered Entity</p>
                                </div>
                            </div>
                            {businessInfo?.gst_number && (
                                <div className="flex items-center gap-3">
                                    <Tag size={16} className="text-orange-500/60" />
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">GSTIN: {businessInfo.gst_number}</p>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-gray-400" />
                                <p className="text-xs font-semibold text-gray-600">{businessInfo?.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-400" />
                                <p className="text-xs font-semibold text-gray-600">{businessInfo?.phone}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-gray-400 mt-0.5" />
                                <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-[250px] italic">
                                    {businessInfo?.street_address}, {businessInfo?.city}, {businessInfo?.state}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Financial Summary */}
                    <section className="space-y-5">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 border-b-2 border-orange-500 pb-2 uppercase tracking-widest">
                            <CreditCard size={18} className="text-orange-500" />
                            Financial Summary
                        </h3>
                        <div className="bg-slate-900 p-6 rounded-sm space-y-4 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-500/20 transition-all duration-500"></div>

                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <span>Subtotal</span>
                                <span className="text-slate-200">₹{(invoice.subtotal || 0).toLocaleString()}</span>
                            </div>

                            {invoice.tax_type === "GST" ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                                        <span>CGST ({invoice.tax_rate / 2}%)</span>
                                        <span>₹{(invoice.tax_amount / 2 || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                                        <span>SGST ({invoice.tax_rate / 2}%)</span>
                                        <span>₹{(invoice.tax_amount / 2 || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            ) : invoice.tax_rate > 0 && (
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                                    <span>Tax ({invoice.tax_rate}%)</span>
                                    <span>₹{(invoice.tax_amount || 0).toLocaleString()}</span>
                                </div>
                            )}

                            {invoice.discount > 0 && (
                                <div className="flex justify-between items-center text-[10px] font-bold text-red-400 uppercase tracking-[0.1em] pt-1">
                                    <span>Discount Applied</span>
                                    <span>- ₹{(invoice.discount || 0).toLocaleString()}</span>
                                </div>
                            )}

                            <div className="pt-5 mt-2 border-t border-white/10 flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1.5">Grand Total</p>
                                    <p className="text-3xl font-black text-white tracking-tight">₹{(invoice.total_amount || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                                    <Building2 className="text-orange-500" size={24} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Customer Details */}
                <section className="space-y-5">
                    <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 border-b-2 border-orange-500 pb-2 uppercase tracking-widest">
                        <User size={18} className="text-orange-500" />
                        Customer Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-sm border border-slate-100">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer Name</p>
                                <p className="text-sm font-bold text-gray-900">{invoice.client_name}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-black uppercase rounded-full">
                                    {invoice.customer_type || 'Standard'}
                                </span>
                            </div>
                            {invoice.contact_person && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Person</p>
                                    <p className="text-sm font-bold text-gray-800">{invoice.contact_person}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Details</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                    <Mail size={14} className="text-gray-400" />
                                    {invoice.client_email || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mt-2">
                                    <Phone size={14} className="text-gray-400" />
                                    {invoice.client_phone || 'N/A'}
                                </div>
                            </div>
                            {invoice.client_gstin && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tax ID / GSTIN</p>
                                    <p className="text-xs font-black text-blue-600 uppercase tabular-nums">{invoice.client_gstin}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Billing Address</p>
                                <p className="text-xs font-medium text-gray-600 leading-relaxed italic">
                                    {invoice.client_address || 'No address provided'}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">
                                    {invoice.state && `${invoice.state}, `}{invoice.pincode && `PIN: ${invoice.pincode}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Line Items Table */}
                <section className="space-y-5">
                    <div className="flex justify-between items-center border-b-2 border-orange-500 pb-2">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 uppercase tracking-widest">
                            <Package size={18} className="text-orange-500" />
                            Billed Line Items
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">
                            {invoice.items?.length || 0} Total {invoice.items?.length === 1 ? 'Entry' : 'Entries'}
                        </span>
                    </div>
                    <div className="border border-slate-100 rounded-sm overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">S.No</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Item Description</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-24">Qty</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-32">Rate</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-32">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {invoice.items?.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-400 tabular-nums">{String(idx + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                                        <td className="px-4 py-4 text-center text-sm font-black text-slate-600 tabular-nums">{item.qty}</td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-600">₹{(item.rate || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-orange-600">₹{(item.total || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Terms & Payment Boxes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                    <section className="space-y-5">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 border-b-2 border-orange-500 pb-2 uppercase tracking-widest">
                            <ScrollText size={18} className="text-orange-500" />
                            Terms & Conditions
                        </h3>
                        <div className="p-6 bg-orange-50/30 rounded-sm border border-orange-100 text-xs text-gray-600 italic leading-relaxed whitespace-pre-line break-words shadow-sm min-h-[100px]">
                            {invoice.terms_and_conditions || "Standard business terms and conditions apply to this invoice. Late payments may be subject to interest."}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 border-b-2 border-orange-500 pb-2 uppercase tracking-widest">
                            <DollarSign size={18} className="text-orange-500" />
                            Payment Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4 h-[calc(100%-40px)]">
                            <div className="p-5 bg-green-50/50 rounded-sm border-2 border-green-100/50 flex flex-col justify-center">
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Total Collected</p>
                                <p className="text-2xl font-black text-green-700">₹{(invoice.paid_amount || 0).toLocaleString()}</p>
                            </div>
                            <div className={`p-5 rounded-sm border-2 flex flex-col justify-center ${invoice.balance_amount > 0 ? 'bg-red-50/50 border-red-100/50' : 'bg-blue-50/50 border-blue-100/50'}`}>
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${invoice.balance_amount > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {invoice.balance_amount > 0 ? 'Outstanding' : 'Balance Clear'}
                                </p>
                                <p className={`text-2xl font-black ${invoice.balance_amount > 0 ? 'text-red-700' : 'text-blue-700'}`}>
                                    ₹{(invoice.balance_amount || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Modal>
    );
};

export default ViewInvoiceModal;
