import React from "react";
import {
    Download,
    Printer,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Package,
    User,
    Building,
    FileText,
    Globe,
    X,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

const ViewInvoiceModal = ({ showModal, setShowModal, invoice }) => {
    if (!showModal) return null;
    
    if (!invoice) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-sm shadow-2xl w-full max-w-md p-8 text-center">
                    <p className="text-gray-600 font-bold">Loading invoice details...</p>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };
    const handleDownload = () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Standardize data
            const inv = {
                id: invoice.invoice_number || invoice.id,
                date: invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-GB') : invoice.date,
                dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-GB') : (invoice.dueDate || "Not Set"),
                client: invoice.client_name || invoice.client || "Client Name",
                email: invoice.client_email || invoice.email,
                phone: invoice.client_phone || invoice.phone,
                address: invoice.client_address || invoice.address,
                items: invoice.items || [],
                subtotal: invoice.subtotal || 0,
                tax: invoice.tax_rate || 0,
                taxAmount: invoice.tax_amount || ((invoice.subtotal * (invoice.tax_rate || 0)) / 100) || 0,
                discount: invoice.discount || 0,
                totalAmount: invoice.total_amount || 0,
                paidAmount: invoice.paid_amount || 0,
                balanceAmount: invoice.balance_amount || 0,
                status: invoice.status || "Unpaid",
                notes: invoice.notes || ""
            };

            // Modern color scheme
            const brandColor = [255, 123, 29];      // #FF7B1D - Orange
            const darkColor = [15, 23, 42];         // #0F172A - Dark Blue
            const lightText = [51, 65, 85];         // #334155 - Slate 700
            const grayText = [100, 116, 139];       // #64748B - Slate 500
            const lightBg = [248, 250, 252];        // #F8FAFC - Slate 50
            const borderColor = [226, 232, 240];    // #E2E8F0 - Slate 200
            const headerBg = [15, 23, 42];          // Dark header

            const sidebarWidth = 8;
            const startX = sidebarWidth + 15;
            const endX = pageWidth - 15;
            const contentWidth = endX - startX;

            // === HEADER SECTION ===
            // Left Orange Sidebar
            doc.setFillColor(...brandColor);
            doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

            // Header Background
            doc.setFillColor(253, 247, 242);  // Light orange cream
            doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, 75, 'F');

            // Company Header - Left Side
            doc.setTextColor(...darkColor);
            doc.setFontSize(19);
            doc.setFont("helvetica", "bold");
            doc.text("Rush Delivery Services", startX, 18);

            doc.setFontSize(8.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...grayText);
            doc.text("www.rushdelivery.com", startX, 25);
            doc.text("info@rushdelivery.com", startX, 29);
            doc.text("+91 1800 123 4567", startX, 33);

            // Invoice Title & Details - Right Side
            doc.setTextColor(...brandColor);
            doc.setFontSize(38);
            doc.setFont("helvetica", "bold");
            doc.text("INVOICE", endX, 20, { align: "right" });

            // Invoice Details Box
            const detailsBoxX = pageWidth - 80;
            const detailsValueX = endX;
            const detailsY = 26;

            doc.setFontSize(8.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...lightText);
            doc.text("Invoice No:", detailsBoxX, detailsY);
            doc.text("Date:", detailsBoxX, detailsY + 7);
            doc.text("Due Date:", detailsBoxX, detailsY + 14);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(...brandColor);
            doc.setFontSize(9);
            doc.text(String(inv.id), detailsValueX, detailsY, { align: "right" });
            doc.text(String(inv.date), detailsValueX, detailsY + 7, { align: "right" });
            doc.text(String(inv.dueDate), detailsValueX, detailsY + 14, { align: "right" });

            // === BILL TO SECTION ===
            const billToY = 82;

            // Modern card style for Bill To
            doc.setFillColor(241, 245, 249);
            doc.roundedRect(startX, billToY, contentWidth, 38, 2, 2, 'F');
            
            // Border
            doc.setDrawColor(189, 205, 219);
            doc.setLineWidth(0.5);
            doc.roundedRect(startX, billToY, contentWidth, 38, 2, 2);

            doc.setTextColor(...darkColor);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("BILL TO", startX + 8, billToY + 8);

            doc.setFontSize(10);
            doc.setTextColor(...darkColor);
            doc.text(String(inv.client), startX + 8, billToY + 16);

            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...grayText);
            let billToLineY = billToY + 22;
            if (inv.email) {
                doc.text(String(inv.email), startX + 8, billToLineY);
                billToLineY += 4;
            }
            if (inv.phone) {
                doc.text(String(inv.phone), startX + 8, billToLineY);
                billToLineY += 4;
            }
            if (inv.address) {
                const addressLines = doc.splitTextToSize(String(inv.address), contentWidth - 16);
                doc.text(addressLines, startX + 8, billToLineY);
            }

            // === SERVICES TABLE ===
            const tableStartY = billToY + 44;

            // Calculate proper column widths
            const colWidths = {
                num: 10,
                desc: contentWidth * 0.35,
                rate: 28,
                qty: 18,
                tax: 22,
                amount: 28
            };

            const tableHeaders = [["#", "Description", "Rate", "Qty", "Tax", "Amount"]];

            let tableData = [];
            if (inv.items && inv.items.length > 0) {
                tableData = inv.items.map((item, index) => [
                    String(index + 1),
                    item.name || item.description || "Service",
                    `₹${(item.rate || item.unitPrice || 0).toLocaleString()}`,
                    String(item.qty || item.quantity || 1),
                    `${inv.tax || 0}%`,
                    `₹${((item.qty || 1) * (item.rate || 0)).toLocaleString()}`,
                ]);
            } else {
                tableData = [["1", "No items specified", "₹0", "1", "0%", "₹0"]];
            }

            autoTable(doc, {
                startY: tableStartY,
                margin: { left: startX, right: 15 },
                head: tableHeaders,
                body: tableData,
                theme: "grid",
                headStyles: {
                    fillColor: [15, 23, 42],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    fontSize: 9,
                    cellPadding: 4,
                    halign: "center",
                    valign: "middle",
                    lineColor: [226, 232, 240],
                    lineWidth: 0.5,
                },
                bodyStyles: {
                    fontSize: 8.5,
                    cellPadding: 3.5,
                    textColor: [51, 65, 85],
                    lineColor: [226, 232, 240],
                    lineWidth: 0.5,
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { 
                        halign: "center", 
                        cellWidth: colWidths.num,
                        fontStyle: "bold"
                    },
                    1: { 
                        halign: "left",
                        cellWidth: colWidths.desc
                    },
                    2: { 
                        halign: "right", 
                        cellWidth: colWidths.rate
                    },
                    3: { 
                        halign: "center", 
                        cellWidth: colWidths.qty,
                        fontStyle: "bold"
                    },
                    4: { 
                        halign: "center", 
                        cellWidth: colWidths.tax
                    },
                    5: { 
                        halign: "right", 
                        cellWidth: colWidths.amount,
                        fontStyle: "bold",
                        textColor: [255, 123, 29]
                    }
                }
            });

            // === TOTALS SECTION ===
            const tableEndY = doc.lastAutoTable.finalY;
            const totalsSectionY = tableEndY + 10;
            const totalsBoxWidth = 70;
            const totalsBoxX = endX - totalsBoxWidth;

            // Modern card background for totals
            doc.setFillColor(253, 247, 242);
            doc.roundedRect(totalsBoxX - 3, totalsSectionY - 3, totalsBoxWidth + 6, 68, 2, 2, 'F');
            
            // Orange border
            doc.setDrawColor(...brandColor);
            doc.setLineWidth(1.2);
            doc.roundedRect(totalsBoxX - 3, totalsSectionY - 3, totalsBoxWidth + 6, 68, 2, 2);

            doc.setFontSize(8.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...lightText);

            let totalY = totalsSectionY + 3;
            const labelX = totalsBoxX + 4;
            const valueX = totalsBoxX + totalsBoxWidth - 4;

            // Subtotal
            doc.text("Subtotal", labelX, totalY);
            doc.setTextColor(...darkColor);
            doc.setFont("helvetica", "bold");
            doc.text(`₹${inv.subtotal.toLocaleString()}`, valueX, totalY, { align: "right" });

            // Tax
            totalY += 7;
            doc.setTextColor(...lightText);
            doc.setFont("helvetica", "normal");
            if (inv.taxAmount > 0) {
                doc.text(`Tax (${inv.tax}%)`, labelX, totalY);
                doc.setTextColor(...darkColor);
                doc.setFont("helvetica", "bold");
                doc.text(`₹${inv.taxAmount.toLocaleString()}`, valueX, totalY, { align: "right" });
                totalY += 7;
            }

            // Discount
            if (inv.discount > 0) {
                doc.setTextColor([220, 38, 38]);
                doc.setFont("helvetica", "normal");
                doc.text("Discount", labelX, totalY);
                doc.setFont("helvetica", "bold");
                doc.text(`- ₹${inv.discount.toLocaleString()}`, valueX, totalY, { align: "right" });
                totalY += 7;
            }

            // Divider
            doc.setDrawColor(...borderColor);
            doc.setLineWidth(0.3);
            doc.line(labelX, totalY - 1, valueX, totalY - 1);

            // Total Due - Highlighted
            totalY += 7;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...brandColor);
            doc.text("TOTAL DUE", labelX, totalY);
            doc.text(`₹${inv.totalAmount.toLocaleString()}`, valueX, totalY, { align: "right" });

            // Status section with better spacing
            totalY += 9;
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...darkColor);
            doc.text(`Status: ${inv.status}`, labelX, totalY);
            
            totalY += 5;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...grayText);
            doc.text(`Paid: ₹${inv.paidAmount.toLocaleString()}`, labelX, totalY);
            
            totalY += 4;
            doc.text(`Balance: ₹${inv.balanceAmount.toLocaleString()}`, labelX, totalY);

            // === NOTES SECTION ===
            if (inv.notes) {
                const notesY = Math.max(totalsSectionY + 75, tableEndY + 40);
                
                doc.setTextColor(...darkColor);
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.text("NOTES", startX, notesY);

                doc.setFontSize(8.5);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...grayText);
                const notesLines = doc.splitTextToSize(inv.notes, contentWidth);
                doc.text(notesLines, startX, notesY + 6);
            }

            // === FOOTER ===
            const footerY = pageHeight - 16;
            doc.setDrawColor(...borderColor);
            doc.setLineWidth(0.3);
            doc.line(startX, footerY - 2, endX, footerY - 2);

            doc.setFontSize(7.5);
            doc.setTextColor(...grayText);
            doc.setFont("helvetica", "normal");
            doc.text("Digitally generated invoice. No signature required.", pageWidth / 2, footerY + 2, { align: "center" });

            doc.setFont("helvetica", "bold");
            doc.setTextColor(...brandColor);
            doc.text("Rush Delivery Services", pageWidth / 2, footerY + 6, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setTextColor(...grayText);
            doc.setFontSize(7);
            doc.text("123 Business Park, Patna, Bihar - 800001 | +91 1800 123 4567", pageWidth / 2, footerY + 9.5, { align: "center" });

            // Save PDF
            doc.save(`Invoice_${inv.id}.pdf`);
            toast.success("Invoice PDF downloaded successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Error downloading invoice PDF");
        }
    };

    const statusColors = {
        Paid: "bg-green-50 text-green-700 border-green-500",
        Partial: "bg-yellow-50 text-yellow-700 border-yellow-500",
        Unpaid: "bg-red-50 text-red-700 border-red-500",
        Pending: "bg-orange-50 text-orange-700 border-orange-500",
        Cancelled: "bg-gray-50 text-gray-700 border-gray-500",
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl lg:max-w-5xl my-4 relative animate-slideUp max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors bg-black/20 p-2 rounded-full print:hidden"
                >
                    <X size={32} />
                </button>

                {/* Invoice Container */}
                <div className="bg-white rounded-sm overflow-hidden border-2" style={{ borderColor: "#FF7B1D" }}>
                    {/* Header */}
                    <div className="text-white p-6 sm:p-10" style={{ backgroundColor: "#FF7B1D" }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-5xl font-black mb-2 tracking-tighter">INVOICE</h1>
                                <p className="text-white/90 text-xl font-bold">
                                    #{invoice.invoice_number || invoice.invoiceNumber}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/20 backdrop-blur-md rounded-sm px-6 py-3 border border-white/30">
                                    <p className="text-xs uppercase tracking-widest mb-1 text-white font-black">
                                        Payment Status
                                    </p>
                                    <span
                                        className={`inline-block px-4 py-1.5 rounded-sm text-sm font-black border-2 ${statusColors[invoice.status] || "bg-gray-100"
                                            }`}
                                    >
                                        {invoice.status?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10">
                        {/* Action Bar in Modal */}
                        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end no-print">
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white font-black rounded-sm shadow-lg transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
                                style={{ backgroundColor: "#FF7B1D" }}
                            >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                Download PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-sm shadow-lg transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
                            >
                                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                                Print Invoice
                            </button>
                        </div>

                        {/* Date Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                            <div className="bg-orange-50 rounded-sm p-4 border-l-4 border-[#FF7B1D] shadow-sm">
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar className="w-4 h-4 text-[#FF7B1D]" />
                                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Invoice Date</p>
                                </div>
                                <p className="text-lg font-black text-gray-900">{formatDate(invoice.invoice_date || invoice.date)}</p>
                            </div>
                            <div className="bg-orange-50 rounded-sm p-4 border-l-4 border-[#FF7B1D] shadow-sm">
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar className="w-4 h-4 text-[#FF7B1D]" />
                                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Due Date</p>
                                </div>
                                <p className="text-lg font-black text-gray-900">{formatDate(invoice.due_date || invoice.dueDate)}</p>
                            </div>
                            <div className="bg-orange-50 rounded-sm p-4 border-l-4 border-[#FF7B1D] shadow-sm">
                                <div className="flex items-center gap-3 mb-1">
                                    <Package className="w-4 h-4 text-[#FF7B1D]" />
                                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Client ID</p>
                                </div>
                                <p className="text-lg font-black text-gray-900">CL-{invoice.client_id || '001'}</p>
                            </div>
                        </div>

                        {/* Company and Customer Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
                            {/* Company Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 border-b-2 border-orange-100 pb-2">
                                    <Building className="w-5 h-5 text-[#FF7B1D]" />
                                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Your Company</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black text-gray-900">Rush Delivery Services</p>
                                    <div className="flex flex-col gap-1 text-sm text-gray-600 font-medium">
                                        <span className="flex items-center gap-2"><Mail size={14} className="text-[#FF7B1D]" /> info@rushdelivery.com</span>
                                        <span className="flex items-center gap-2"><Phone size={14} className="text-[#FF7B1D]" /> +91 1800 123 4567</span>
                                        <span className="flex items-start gap-2"><MapPin size={14} className="text-[#FF7B1D] mt-1" /> 123 Business Park, Patna, Bihar - 800001</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 border-b-2 border-orange-100 pb-2">
                                    <User className="w-5 h-5 text-[#FF7B1D]" />
                                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Bill To</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black text-gray-900">{invoice.client_name || invoice.user}</p>
                                    <div className="flex flex-col gap-1 text-sm text-gray-600 font-medium">
                                        <span className="flex items-center gap-2"><Mail size={14} className="text-[#FF7B1D]" /> {invoice.client_email || invoice.userEmail}</span>
                                        <span className="flex items-center gap-2"><Phone size={14} className="text-[#FF7B1D]" /> {invoice.client_phone || invoice.userPhone}</span>
                                        <span className="flex items-start gap-2"><MapPin size={14} className="text-[#FF7B1D] mt-1" /> {invoice.client_address || invoice.userAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-10">
                            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3 uppercase tracking-tighter">
                                <FileText className="w-6 h-6 text-[#FF7B1D]" />
                                Description of Services
                            </h3>
                            {(invoice.items && invoice.items.length > 0) ? (
                                <div className="overflow-x-auto border-2 border-orange-100 rounded-sm">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-white" style={{ backgroundColor: "#FF7B1D" }}>
                                                <th className="p-4 text-left font-black uppercase tracking-widest">Service Description</th>
                                                <th className="p-4 text-center font-black uppercase tracking-widest w-24">Qty</th>
                                                <th className="p-4 text-right font-black uppercase tracking-widest w-32">Rate</th>
                                                <th className="p-4 text-right font-black uppercase tracking-widest w-32">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-orange-50">
                                            {invoice.items.map((item, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? "bg-orange-50/30" : "bg-white"}>
                                                    <td className="p-4 text-gray-900 font-bold">{item.name || item.description || 'N/A'}</td>
                                                    <td className="p-4 text-center text-gray-700 font-black">{item.qty || item.quantity || 0}</td>
                                                    <td className="p-4 text-right text-gray-700 font-black">₹{(item.rate || item.unitPrice || 0).toLocaleString()}</td>
                                                    <td className="p-4 text-right font-black text-[#FF7B1D]">₹{(item.total || 0).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 font-bold">
                                    No items found for this invoice.
                                </div>
                            )}
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-center lg:justify-end mb-8 sm:mb-10">
                            <div className="w-full max-w-md lg:w-96 bg-gray-50 p-6 sm:p-8 rounded-sm border-2 border-gray-100 shadow-sm space-y-4">
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Subtotal:</span>
                                    <span>₹{(invoice.subtotal || 0).toLocaleString()}</span>
                                </div>
                                {(invoice.tax_amount && invoice.tax_amount > 0) && (
                                    <div className="flex justify-between text-gray-600 font-bold">
                                        <span>Tax ({invoice.tax_rate || 0}%):</span>
                                        <span>₹{(invoice.tax_amount).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t-2 border-orange-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Total Due:</span>
                                        <span className="text-3xl font-black text-[#FF7B1D]">₹{(invoice.total_amount || 0).toLocaleString()}</span>
                                    </div>

                                    {/* Payment Progress */}
                                    <div className="space-y-2 mt-6 p-4 bg-orange-100/50 rounded-sm">
                                        <div className="flex justify-between text-xs font-black text-orange-900 uppercase">
                                            <span>Paid: ₹{(invoice.paid_amount || 0).toLocaleString()}</span>
                                            <span>Balance: ₹{(invoice.balance_amount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-orange-200">
                                            <div
                                                className="bg-green-500 h-full transition-all duration-1000"
                                                style={{ width: `${Math.min(100, ((invoice.paid_amount || 0) / (invoice.total_amount || 1)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {invoice.notes && (
                            <div className="mt-10 p-6 bg-gray-50 border-l-4 border-[#FF7B1D] rounded-sm">
                                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-widest text-xs">Important Notes:</h4>
                                <p className="text-sm text-gray-700 font-medium leading-relaxed">{invoice.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xl font-black mb-1">Thank you for your business!</p>
                            <p className="text-gray-400 text-sm">For any questions, reach out at help@rushdelivery.com</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Generated on</p>
                            <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInvoiceModal;
