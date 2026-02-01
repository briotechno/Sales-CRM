import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Download,
  Eye,
  Trash2,
  FileText,
  Home,
  Search,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Edit2,
  Filter,
  Calendar,
  X
} from "lucide-react";
import * as XLSX from "xlsx";

import CreateQuotationModal from "../../pages/QuotationPart/CreateQuotationModal";
import ViewQuotationModal from "../../pages/QuotationPart/ViewQuotationModal";
import NumberCard from "../../components/NumberCard";

import {
  useGetQuotationsQuery,
  useLazyGetQuotationByIdQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
} from "../../store/api/quotationApi";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";
import { toast } from "react-hot-toast";
import DeleteQuotationModal from "./DeleteQuotationModal";

export default function QuotationPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const dateDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const itemsPerPage = 8;

  const getDateRange = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    let dateFrom = "";
    let dateTo = "";

    if (dateFilter === "Today") {
      dateFrom = formatDate(today);
      dateTo = formatDate(today);
    } else if (dateFilter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateFrom = formatDate(yesterday);
      dateTo = formatDate(yesterday);
    } else if (dateFilter === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 7);
      dateFrom = formatDate(last7);
      dateTo = formatDate(today);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFrom = formatDate(firstDay);
      dateTo = formatDate(today);
    } else if (dateFilter === "Custom") {
      dateFrom = customStart;
      dateTo = customEnd;
    }
    return { dateFrom, dateTo };
  };

  const { dateFrom, dateTo } = getDateRange();

  const { data, isLoading, error, refetch } = useGetQuotationsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: filterStatus,
    search: searchTerm,
    dateFrom,
    dateTo
  });

  const { data: businessInfo } = useGetBusinessInfoQuery();

  const [createQuotation] = useCreateQuotationMutation();
  const [updateQuotation] = useUpdateQuotationMutation();
  const [deleteQuotation] = useDeleteQuotationMutation();
  const [getQuotationById] = useLazyGetQuotationByIdQuery();

  const quotations = data?.quotations || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const summary = data?.summary || { total: 0, approved: 0, pending: 0, totalValue: 0 };

  const hasActiveFilters = searchTerm || filterStatus !== "All" || dateFilter !== "All";

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  const [formData, setFormData] = useState({
    quotationNo: `QT-${new Date().getFullYear()}-0000`,
    companyName: "",
    email: "",
    phone: "",
    quotationDate: new Date().toISOString().split("T")[0],
    validUntil: "",
    currency: "INR",
    lineItems: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    terms_and_conditions: "",
    status: "Draft",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      quotationNo: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: "",
      email: "",
      phone: "",
      quotationDate: new Date().toISOString().split("T")[0],
      validUntil: "",
      currency: "INR",
      lineItems: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      terms_and_conditions: "",
      status: "Draft",
    });
  };

  const handleCreateQuotation = async () => {
    if (!formData.companyName || !formData.quotationDate || !formData.totalAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        quotation_id: formData.quotationNo,
        company_name: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        quotation_date: formData.quotationDate,
        valid_until: formData.validUntil,
        currency: formData.currency,
        line_items: formData.lineItems,
        subtotal: formData.subtotal,
        tax: formData.tax,
        discount: formData.discount,
        total_amount: formData.totalAmount,
        terms_and_conditions: formData.terms_and_conditions,
        status: formData.status,
      };

      if (formData.id) {
        await updateQuotation({ id: formData.id, data: payload }).unwrap();
        toast.success("Quotation updated successfully");
      } else {
        await createQuotation(payload).unwrap();
        toast.success("Quotation created successfully");
      }
      setShowModal(false);
      resetForm();
      // No need to manually refetch - RTK Query will auto-refetch due to cache invalidation
    } catch (err) {
      toast.error(err?.data?.message || "Error saving quotation");
    }
  };

  const handleEdit = async (quote) => {
    // Reset form and close modal first to ensure fresh state
    resetForm();
    setShowModal(false);

    try {
      toast.loading("Fetching details...", { id: "fetch-edit" });
      // Force refetch to get the latest data from server
      const response = await getQuotationById(quote.id, { forceRefetch: true }).unwrap();
      const q = response.quotation;

      if (!q) {
        throw new Error("Quotation not found");
      }

      setFormData({
        id: q.id,
        quotationNo: q.quotation_id,
        companyName: q.company_name,
        email: q.email,
        phone: q.phone,
        quotationDate: q.quotation_date ? new Date(q.quotation_date).toISOString().split('T')[0] : "",
        validUntil: q.valid_until ? new Date(q.valid_until).toISOString().split('T')[0] : "",
        currency: q.currency,
        lineItems: q.line_items || [],
        subtotal: q.subtotal || 0,
        tax: q.tax || 0,
        discount: q.discount || 0,
        totalAmount: q.total_amount || 0,
        terms_and_conditions: q.terms_and_conditions || "",
        status: q.status || "Draft",
      });

      setShowModal(true);
      toast.success("Details loaded", { id: "fetch-edit" });
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err?.data?.message || err.message || "Failed to load details", { id: "fetch-edit" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        await deleteQuotation(id).unwrap();
        toast.success("Quotation deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Error deleting quotation");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const quote = quotations.find((q) => q.id === id);
      if (!quote) return;

      const payload = {
        ...quote,
        quotation_date: quote.quotation_date
          ? new Date(quote.quotation_date).toISOString().split("T")[0]
          : null,
        valid_until: quote.valid_until
          ? new Date(quote.valid_until).toISOString().split("T")[0]
          : null,
        status: newStatus,
      };

      await updateQuotation({ id, data: payload }).unwrap();
      toast.success("Status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleExportExcel = () => {
    try {
      if (!quotations || quotations.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Format data for Excel with professional headers
      const exportData = quotations.map(q => ({
        "Quotation ID": q.quotation_id,
        "Date": new Date(q.quotation_date).toLocaleDateString(),
        "Valid Until": q.valid_until ? new Date(q.valid_until).toLocaleDateString() : 'N/A',
        "Company": q.company_name || 'N/A',
        "Email": q.email || "N/A",
        "Phone": q.phone || "N/A",
        "Subtotal (INR)": q.subtotal,
        "Tax (%)": q.tax || 0,
        "Discount (INR)": q.discount || 0,
        "Total Amount (INR)": q.total_amount,
        "Status": q.status.toUpperCase(),
        "Payment Terms": q.payment_terms || "",
        "Notes": q.notes || ""
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations Report");

      // Professional Column Widths
      const wscols = [
        { wch: 20 }, // Quotation ID
        { wch: 15 }, // Date
        { wch: 15 }, // Valid Until
        { wch: 25 }, // Client Name
        { wch: 25 }, // Company
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 15 }, // Subtotal
        { wch: 12 }, // Tax
        { wch: 15 }, // Discount
        { wch: 18 }, // Total Amount
        { wch: 12 }, // Status
        { wch: 30 }, // Payment Terms
        { wch: 30 }  // Notes
      ];
      worksheet['!cols'] = wscols;

      XLSX.writeFile(workbook, `Quotations_${dateFilter}_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
      toast.success("Exported to Excel successfully!");
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast.error("Error generating Excel report");
    }
  };

  const handleExport = () => {
    if (quotations.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Quotation ID", "Company", "Date", "Amount", "Status", "Valid Until"];
    const csvData = quotations.map(q => [
      q.quotation_id,
      q.company_name,
      new Date(q.quotation_date).toLocaleDateString(),
      q.total_amount,
      q.status,
      q.valid_until ? new Date(q.valid_until).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Quotations_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported successfully");
  };

  const handleDownload = async (quote) => {
    let qData = quote;
    try {
      toast.loading("Fetching details for PDF...", { id: "fetch-pdf" });
      const response = await getQuotationById(quote.id, { preferCacheValue: false }).unwrap();
      qData = response.quotation;
      toast.success("PDF Ready", { id: "fetch-pdf" });
    } catch (err) {
      console.error("Fetch error for PDF:", err);
      toast.error("Using cached data for PDF", { id: "fetch-pdf" });
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Standardize data
    const q = {
      id: qData.quotation_id || qData.id,
      date: qData.quotation_date ? new Date(qData.quotation_date).toLocaleDateString() : qData.date,
      validUntil: qData.valid_until ? new Date(qData.valid_until).toLocaleDateString() : (qData.validUntil || "Not Set"),
      client: qData.company_name || qData.companyName || "Client Name",
      companyName: qData.company_name || qData.companyName,
      email: qData.email,
      phone: qData.phone,
      currency: qData.currency || "INR",
      lineItems: qData.line_items || qData.lineItems || [],
      subtotal: qData.subtotal || 0,
      tax: qData.tax || 0,
      discount: qData.discount || 0,
      totalAmount: qData.total_amount || qData.amount || 0,
      notes: qData.notes || qData.description || qData.notes,
      paymentTerms: qData.payment_terms || qData.paymentTerms
    };

    const brandColor = [255, 123, 29]; // #FF7B1D
    const darkColor = [31, 41, 55];    // #1F2937 (Slate 800)
    const grayColor = [107, 114, 128]; // #6B7280 (Gray 500)
    const lightGray = [249, 250, 251]; // #F9FAFB (Gray 50)
    const sidebarWidth = 6;

    // --- 0. Premium Background & Sidebar ---
    // Left Sidebar Gradient-like shade
    doc.setFillColor(255, 123, 29); // Brand Orange
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

    // Subtle Top Gradient Bar - Increased height to 60 to cover all metadata
    doc.setFillColor(252, 245, 240); // Very light orange tint
    doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, 65, 'F');

    // Add a light watermark/pattern or subtle background text
    doc.setTextColor(245, 245, 245);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    // doc.text(businessInfo?.company_name?.substring(0, 10).toUpperCase() || "TECHVISTA", 40, 150, { angle: 45, opacity: 0.1 });

    // --- 1. Header Section ---
    const startX = sidebarWidth + 15;

    // Page Watermark - Dynamic
    doc.setTextColor(245, 245, 245);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    const watermarkText = (businessInfo?.company_name || "QUOTATION").split(" ")[0].toUpperCase();
    doc.text(watermarkText, 40, 150, { angle: 45, opacity: 0.05 });

    if (businessInfo?.logo_url) {
      try {
        const logoFullUrl = `${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${businessInfo.logo_url}`;
        const img = new Image();
        img.src = logoFullUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        doc.addImage(img, 'PNG', startX, 15, 22, 22);
      } catch (e) {
        doc.setFillColor(...brandColor);
        doc.roundedRect(startX, 15, 12, 12, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const initials = businessInfo?.company_name
          ? businessInfo.company_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
          : "TV";
        doc.text(initials, startX + 3, 23);
      }
    } else {
      doc.setFillColor(...brandColor);
      doc.roundedRect(startX, 15, 12, 12, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const initials = businessInfo?.company_name
        ? businessInfo.company_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
        : "TV";
      doc.text(initials, startX + 3, 23);
    }

    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    // Position company name slightly higher to fit perfectly in the 60mm tint
    const textStartY = businessInfo?.logo_url ? 46 : 38;
    doc.text(businessInfo?.company_name || "TechVista IT Solutions", startX, textStartY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(businessInfo?.website || "www.techvista.com", startX, textStartY + 6);
    doc.text(businessInfo?.email || "contact@techvista.com", startX, textStartY + 11);
    doc.text(businessInfo?.phone || "+91 98765 43210", startX, textStartY + 16);

    doc.setTextColor(...brandColor);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTATION", pageWidth - 15, 28, { align: "right" });

    // Header Details - Fixed Alignment
    const labelX = pageWidth - 80;
    const valueX = pageWidth - 15;

    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Quotation No:`, labelX, 41);
    doc.text(`Date:`, labelX, 47);
    doc.text(`Valid Until:`, labelX, 53);

    doc.setFont("helvetica", "normal");
    doc.text(String(q.id), valueX, 41, { align: "right" });
    doc.text(String(q.date), valueX, 47, { align: "right" });
    doc.text(String(q.validUntil), valueX, 53, { align: "right" });

    // --- 2. Client Information Section ---
    const clientBoxY = textStartY + 25;
    doc.setFillColor(...lightGray);
    doc.roundedRect(startX, clientBoxY, pageWidth - startX - 15, 45, 2, 2, "F");

    doc.setTextColor(...darkColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT DETAILS", startX + 10, clientBoxY + 12);

    doc.setFontSize(10);
    doc.text(String(q.client), startX + 10, clientBoxY + 22);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    if (q.companyName) doc.text(String(q.companyName), startX + 10, clientBoxY + 28);
    if (q.email || q.phone) {
      doc.text(`${q.email || ""} | ${q.phone || ""}`, startX + 10, clientBoxY + 34);
    }
    doc.text(`Billing: As per records`, startX + 10, clientBoxY + 40);

    // --- 3. Services Table ---
    const tableHeaders = [["#", "Service Description", "Rate", "Qty", "Tax", "Amount"]];
    const tableData = (q.lineItems).map((item, index) => [
      index + 1,
      item.name,
      `${q.currency === "INR" ? "Rs." : "$"} ${(item.rate || 0).toLocaleString()}`,
      item.qty,
      `${q.tax || 0}%`,
      `${q.currency === "INR" ? "Rs." : "$"} ${(item.total || 0).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: clientBoxY + 55,
      margin: { left: startX },
      head: tableHeaders,
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
        cellPadding: 3,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle",
        font: "helvetica",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: "auto", halign: "left" },
        2: { halign: "right", cellWidth: 25 },
        3: { halign: "center", cellWidth: 18 },
        4: { halign: "center", cellWidth: 20 },
        5: { halign: "right", cellWidth: 30 },
      }
    });

    // --- 4. Totals Section ---
    const finalY = doc.lastAutoTable.finalY + 10;
    const summaryX = pageWidth - 80;
    const summaryValueX = pageWidth - 15;

    doc.setFillColor(252, 245, 240);
    doc.roundedRect(summaryX - 5, finalY - 5, 75, 42, 2, 2, "F");

    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");

    let currentTotalY = finalY + 5;
    const subtotalVal = q.subtotal || q.totalAmount;

    doc.text("Subtotal", summaryX, currentTotalY);
    doc.text(`${q.currency === "INR" ? "Rs." : "$"} ${(subtotalVal || 0).toLocaleString()}`, summaryValueX, currentTotalY, { align: "right" });

    currentTotalY += 7;
    if (q.discount) {
      doc.text("Discount", summaryX, currentTotalY);
      doc.text(`- ${q.currency === "INR" ? "Rs." : "$"} ${(q.discount || 0).toLocaleString()}`, summaryValueX, currentTotalY, { align: "right" });
      currentTotalY += 7;
    }

    if (q.tax) {
      doc.text(`GST (${q.tax}%)`, summaryX, currentTotalY);
      doc.text(`${q.currency === "INR" ? "Rs." : "$"} ${(((subtotalVal || 0) * (q.tax || 0)) / 100).toLocaleString()}`, summaryValueX, currentTotalY, { align: "right" });
      currentTotalY += 7;
    }

    doc.setDrawColor(230, 230, 230);
    doc.line(summaryX, currentTotalY - 2, summaryValueX, currentTotalY - 2);
    currentTotalY += 6;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandColor);
    doc.text("TOTAL DUE", summaryX, currentTotalY);
    doc.text(`${q.currency === "INR" ? "Rs." : "$"} ${(q.totalAmount || 0).toLocaleString()}`, summaryValueX, currentTotalY, { align: "right" });

    // --- 5. Notes & Payment Terms ---
    const bottomSectionY = Math.max(currentTotalY + 25, doc.lastAutoTable.finalY + 25);

    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TERMS & CONDITIONS", startX, bottomSectionY);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    const termsArr = [];
    if (q.paymentTerms) termsArr.push(`Payment: ${q.paymentTerms}`);
    if (q.notes) termsArr.push(`Notes: ${q.notes}`);
    if (termsArr.length === 0) termsArr.push("This quotation is valid for 30 days. Standard terms apply.");

    let termsY = bottomSectionY + 6;
    termsArr.forEach(t => {
      const splitT = doc.splitTextToSize(t, pageWidth - startX - 20);
      doc.text(splitT, startX, termsY);
      termsY += (splitT.length * 4) + 2;
    });

    // --- 6. Footer ---
    const footerY = pageHeight - 20;
    doc.setDrawColor(230, 230, 230);
    doc.line(sidebarWidth + 10, footerY - 5, pageWidth - 15, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text("Digitally generated document. No signature required.", pageWidth / 2 + sidebarWidth / 2, footerY, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandColor);
    doc.text(`Exclusive Partner: ${businessInfo?.company_name || "TechVista IT Solutions"}`, pageWidth / 2 + sidebarWidth / 2, footerY + 4, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    const cityState = businessInfo?.city && businessInfo?.state ? `${businessInfo.city}, ${businessInfo.state}` : "Tech Park, Bangalore";
    doc.text(cityState, pageWidth / 2 + sidebarWidth / 2, footerY + 8, { align: "center" });

    doc.save(`Quotation_${q.id}.pdf`);
  };

  const handleView = async (quote) => {
    // Reset selection and close modal first
    setSelectedQuote(null);
    setShowViewModal(false);

    try {
      toast.loading("Fetching details...", { id: "fetch-view" });
      // Force refetch to get the latest data from server
      const response = await getQuotationById(quote.id, { forceRefetch: true }).unwrap();

      if (!response?.quotation) {
        throw new Error("Quotation not found");
      }

      setSelectedQuote(response.quotation);
      setShowViewModal(true);
      toast.success("Details loaded", { id: "fetch-view" });
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err?.data?.message || err.message || "Failed to load details", { id: "fetch-view" });
    }
  };

  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));
  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setIsStatusFilterOpen(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setIsDateFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Quotation Management
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> CRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Quotations
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isStatusFilterOpen || filterStatus !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isStatusFilterOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {[
                          { label: "All", value: "All" },
                          { label: "Draft", value: "Draft" },
                          { label: "Pending", value: "Pending" },
                          { label: "Approved", value: "Approved" },
                          { label: "Rejected", value: "Rejected" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterStatus(option.value);
                              setIsStatusFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === option.value
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isDateFilterOpen || dateFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                  </button>

                  {isDateFilterOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setDateFilter(option);
                              setIsDateFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-[11px] transition-colors uppercase ${dateFilter === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50 font-medium"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {dateFilter === "Custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs shadow-sm"
                    />
                    <span className="text-gray-400 text-[10px] font-bold uppercase">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs shadow-sm"
                    />
                  </div>
                )}



                <button
                  onClick={handleExportExcel}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-sm flex items-center gap-2 transition font-semibold shadow-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                  disabled={quotations.length === 0}
                >
                  <Download size={18} className="text-gray-700 transition-transform group-hover:scale-110" />
                  Export
                </button>

                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Quotation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <NumberCard
              title="Total Quotations"
              number={summary.total || "0"}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Total Value"
              number={`₹${((summary.totalValue || 0) / 100000).toFixed(1)}L`}
              icon={<DollarSign className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Pending"
              number={summary.pending || "0"}
              icon={<AlertCircle className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Approved"
              number={summary.approved || "0"}
              icon={<CheckCircle className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between bg-orange-50 border border-orange-200 rounded-sm p-3 gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-orange-600" size={16} />
                <span className="text-sm font-bold text-orange-800 uppercase">
                  ACTIVE FILTERS:
                </span>
                {searchTerm && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Search: "{searchTerm}"</span>}
                {filterStatus !== "All" && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Status: {filterStatus}</span>}
                {dateFilter !== "All" && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Date: {dateFilter}</span>}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-300 text-orange-600 rounded-sm hover:bg-orange-100 transition shadow-sm text-xs font-bold active:scale-95 uppercase"
              >
                <X size={14} />
                Clear All
              </button>
            </div>
          )}

          {/* Table Section */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left">ID</th>
                  <th className="py-3 px-4 font-semibold text-left">Company</th>
                  <th className="py-3 px-4 font-semibold text-left">Date</th>
                  <th className="py-3 px-4 pr-12 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-left">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex justify-center flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-semibold animate-pulse">Fetching quotations...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-red-500 font-medium">
                      Error loading quotations. Please try again.
                    </td>
                  </tr>
                ) : quotations.length > 0 ? (
                  quotations.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-3 px-4 font-bold text-orange-600">{quote.quotation_id}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{quote.company_name}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{new Date(quote.quotation_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 pr-12 text-right font-bold text-gray-900">
                        {quote.currency === "INR" ? "₹" : "$"} {quote.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                          className={`px-3 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wider cursor-pointer shadow-sm outline-none transition-all ${quote.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                            quote.status === "Pending" ? "bg-orange-50 text-orange-700 border-orange-200" :
                              quote.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                                "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(quote)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(quote)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-sm transition-all"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(quote)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuotationId(quote.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={48} className="text-gray-200" />
                        <p className="font-medium">No quotations found.</p>
                        <button
                          onClick={() => { resetForm(); setShowModal(true); }}
                          className="text-orange-600 underline font-semibold mt-2"
                        >
                          Create your first quotation
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-orange-600">{indexOfFirstItem + 1}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Quotations
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:opacity-90 shadow-md"
                  }`}
              >
                Next
              </button>
            </div>
          </div>

          {/* Modals */}
          <CreateQuotationModal
            showModal={showModal}
            setShowModal={(val) => { setShowModal(val); if (!val) resetForm(); }}
            formData={formData}
            handleInputChange={handleInputChange}
            handleCreateQuotation={handleCreateQuotation}
            setFormData={setFormData}
          />

          <ViewQuotationModal
            showViewModal={showViewModal}
            setShowViewModal={setShowViewModal}
            selectedQuote={selectedQuote}
            getStatusColor={getStatusColor}
          />

          <DeleteQuotationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedQuotationId(null);
            }}
            quotationId={selectedQuotationId}
            refetch={refetch}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
