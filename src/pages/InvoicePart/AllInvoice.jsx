import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Download,
  Eye,
  Trash2,
  FileText,
  Search,
  CheckCircle,
  DollarSign,
  Edit,
  CreditCard,
  Calendar,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  User,
  ArrowUpDown,
  Printer,
  FileSpreadsheet,
  RefreshCw,
  Hash,
  Receipt,
  Edit2
} from "lucide-react";
import { FiHome } from "react-icons/fi";

import CreateInvoiceModal from "./CreateInvoiceModal";
import ViewInvoiceModal from "./ViewInvoiceModal";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation
} from "../../store/api/invoiceApi";
import { toast } from "react-hot-toast";
import DeleteInvoiceModal from "./DeleteInvoiceModal";

export default function AllInvoicePage() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [invoiceForPartial, setInvoiceForPartial] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const dateDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    invoiceNo: "",
    clientName: "",
    email: "",
    phone: "",
    address: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    lineItems: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    status: "Draft",
    notes: "",
    tax_type: "GST",
    client_gstin: "",
    business_gstin: "",
    pan_number: "",
    terms_and_conditions: "",
    customer_type: "Business",
    pincode: "",
    contact_person: "",
    state: ""
  });

  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateInvoice = async () => {
    try {
      if (!formData.clientName || !formData.invoiceNo || !formData.invoiceDate) {
        toast.error("Please fill in all required fields");
        return;
      }

      const payload = {
        invoice_number: formData.invoiceNo,
        client_id: formData.clientId,
        client_name: formData.clientName,
        client_email: formData.email,
        client_phone: formData.phone,
        client_address: formData.address,
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate,
        items: formData.lineItems,
        subtotal: formData.subtotal,
        tax_rate: formData.tax,
        tax_amount: ((formData.subtotal || 0) * (formData.tax || 0)) / 100,
        discount: formData.discount,
        total_amount: formData.totalAmount,
        paid_amount: formData.paidAmount,
        balance_amount: formData.balanceAmount,
        status: formData.status,
        notes: formData.notes,
        tax_type: formData.tax_type,
        client_gstin: formData.client_gstin,
        business_gstin: formData.business_gstin,
        pan_number: formData.pan_number,
        terms_and_conditions: formData.terms_and_conditions,
        customer_type: formData.customer_type,
        pincode: formData.pincode,
        contact_person: formData.contact_person,
        state: formData.state || formData.place_of_supply
      };

      if (formData.id) {
        await updateInvoice({ id: formData.id, ...payload }).unwrap();
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice(payload).unwrap();
        toast.success("Invoice created successfully");
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to save invoice");
    }
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      id: invoice.id,
      invoiceNo: invoice.invoice_number,
      clientId: invoice.client_id,
      clientName: invoice.client_name,
      email: invoice.client_email,
      phone: invoice.client_phone,
      address: invoice.client_address,
      invoiceDate: invoice.invoice_date?.split("T")[0],
      dueDate: invoice.due_date?.split("T")[0],
      lineItems: invoice.items || [],
      subtotal: invoice.subtotal,
      tax: invoice.tax_rate,
      discount: invoice.discount,
      totalAmount: invoice.total_amount,
      paidAmount: invoice.paid_amount,
      balanceAmount: invoice.balance_amount,
      status: invoice.status,
      notes: invoice.notes,
      tax_type: invoice.tax_type || "GST",
      client_gstin: invoice.client_gstin || "",
      business_gstin: invoice.business_gstin || "",
      pan_number: invoice.pan_number || "",
      terms_and_conditions: invoice.terms_and_conditions || "",
      customer_type: invoice.customer_type || "Business",
      pincode: invoice.pincode || "",
      contact_person: invoice.contact_person || "",
      state: invoice.state || invoice.place_of_supply || ""
    });
    setShowModal(true);
  };

  const handleStatusUpdate = async (invoice, newStatus) => {
    if (newStatus === "Partial") {
      setInvoiceForPartial(invoice);
      setPartialAmount(invoice.paid_amount || "");
      setShowPartialModal(true);
      return;
    }

    try {
      let paid_amount = invoice.paid_amount;
      let balance_amount = invoice.balance_amount;

      if (newStatus === "Paid") {
        paid_amount = invoice.total_amount;
        balance_amount = 0;
      } else if (newStatus === "Unpaid") {
        paid_amount = 0;
        balance_amount = invoice.total_amount;
      }

      const payload = {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        quotation_id: invoice.quotation_id,
        client_id: invoice.client_id,
        client_name: invoice.client_name,
        client_email: invoice.client_email,
        client_phone: invoice.client_phone,
        client_address: invoice.client_address,
        invoice_date: invoice.invoice_date?.split("T")[0],
        due_date: invoice.due_date?.split("T")[0],
        items: invoice.items,
        subtotal: invoice.subtotal,
        tax_rate: invoice.tax_rate,
        tax_amount: invoice.tax_amount,
        discount: invoice.discount,
        total_amount: invoice.total_amount,
        paid_amount: paid_amount,
        balance_amount: balance_amount,
        status: newStatus,
        notes: invoice.notes,
        tax_type: invoice.tax_type,
        client_gstin: invoice.client_gstin,
        business_gstin: invoice.business_gstin,
        pan_number: invoice.pan_number,
        terms_and_conditions: invoice.terms_and_conditions
      };

      await updateInvoice(payload).unwrap();
      toast.success(`Invoice marked as ${newStatus}`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handlePartialSubmit = async () => {
    if (!invoiceForPartial) return;
    const amount = parseFloat(partialAmount) || 0;

    if (amount > invoiceForPartial.total_amount) {
      toast.error("Paid amount cannot exceed total amount");
      return;
    }

    try {
      let finalStatus = "Partial";
      if (amount === 0) finalStatus = "Unpaid";
      if (amount >= invoiceForPartial.total_amount) finalStatus = "Paid";

      const payload = {
        id: invoiceForPartial.id,
        invoice_number: invoiceForPartial.invoice_number,
        quotation_id: invoiceForPartial.quotation_id,
        client_id: invoiceForPartial.client_id,
        client_name: invoiceForPartial.client_name,
        client_email: invoiceForPartial.client_email,
        client_phone: invoiceForPartial.client_phone,
        client_address: invoiceForPartial.client_address,
        invoice_date: invoiceForPartial.invoice_date?.split("T")[0],
        due_date: invoiceForPartial.due_date?.split("T")[0],
        items: invoiceForPartial.items,
        subtotal: invoiceForPartial.subtotal,
        tax_rate: invoiceForPartial.tax_rate,
        tax_amount: invoiceForPartial.tax_amount,
        discount: invoiceForPartial.discount,
        total_amount: invoiceForPartial.total_amount,
        paid_amount: amount,
        balance_amount: invoiceForPartial.total_amount - amount,
        status: finalStatus,
        notes: invoiceForPartial.notes,
        tax_type: invoiceForPartial.tax_type,
        client_gstin: invoiceForPartial.client_gstin,
        business_gstin: invoiceForPartial.business_gstin,
        pan_number: invoiceForPartial.pan_number,
        terms_and_conditions: invoiceForPartial.terms_and_conditions
      };

      await updateInvoice(payload).unwrap();
      toast.success(`Payment updated: ${finalStatus}`);
      setShowPartialModal(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update payment");
    }
  };

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

  const { data: invoicesResponse, isLoading, refetch, isFetching } = useGetInvoicesQuery({
    status: filterStatus,
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage,
    dateFrom,
    dateTo
  });

  const invoices = invoicesResponse?.invoices || [];
  const summary = invoicesResponse?.summary || {};
  const pagination = invoicesResponse?.pagination || { total: 0, totalPages: 1 };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateFilterOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || filterStatus !== "all" || dateFilter !== "All";

  const handleExportExcel = () => {
    try {
      if (!invoices || invoices.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Format data for Excel with professional headers
      const exportData = invoices.map(inv => ({
        "Invoice Number": inv.invoice_number,
        "Invoice Date": inv.invoice_date?.split('T')[0] || "N/A",
        "Due Date": inv.due_date?.split('T')[0] || "N/A",
        "Client Name": inv.client_name,
        "Client Email": inv.client_email || "N/A",
        "Client Phone": inv.client_phone || "N/A",
        "Status": inv.status.toUpperCase(),
        "Subtotal (INR)": inv.subtotal,
        "Discount (INR)": inv.discount || 0,
        "Tax Rate (%)": inv.tax_rate || 0,
        "Tax Amount (INR)": inv.tax_amount || 0,
        "Grand Total (INR)": inv.total_amount,
        "Paid Amount (INR)": inv.paid_amount || 0,
        "Balance Due (INR)": inv.balance_amount || 0,
        "Notes": inv.notes || ""
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices Report");

      // Professional Column Widths
      const wscols = [
        { wch: 20 }, // Invoice Number
        { wch: 15 }, // Invoice Date
        { wch: 15 }, // Due Date
        { wch: 25 }, // Client Name
        { wch: 30 }, // Client Email
        { wch: 15 }, // Client Phone
        { wch: 12 }, // Status
        { wch: 15 }, // Subtotal
        { wch: 15 }, // Discount
        { wch: 12 }, // Tax Rate
        { wch: 15 }, // Tax Amount
        { wch: 18 }, // Grand Total
        { wch: 18 }, // Paid Amount
        { wch: 18 }, // Balance Due
        { wch: 30 }  // Notes
      ];
      worksheet['!cols'] = wscols;

      XLSX.writeFile(workbook, `Invoices_${dateFilter}_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
      toast.success("Exported to Excel successfully!");
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast.error("Error generating Excel report");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-100">
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Invoices
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> Dashboard /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    Invoice Management
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                {/* Unified Filter Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setIsStatusFilterOpen(!isStatusFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isStatusFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isStatusFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Statuses</span>
                      </div>
                      <div className="py-1">
                        {["all", "Draft", "Sent", "Partial", "Paid", "Unpaid", "Cancelled"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilterStatus(status);
                              setIsStatusFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status === "all" ? "All Invoices" : status}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Date Range</span>
                      </div>
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <div key={option}>
                            <button
                              key={option}
                              onClick={() => {
                                setDateFilter(option);
                                if (option !== "Custom") {
                                  setIsStatusFilterOpen(false);
                                  setCurrentPage(1);
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option}
                            </button>
                            {option === "Custom" && dateFilter === "Custom" && (
                              <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                <input
                                  type="date"
                                  value={customStart}
                                  onChange={(e) => setCustomStart(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <input
                                  type="date"
                                  value={customEnd}
                                  onChange={(e) => setCustomEnd(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <button
                                  onClick={() => {
                                    setIsStatusFilterOpen(false);
                                    setCurrentPage(1);
                                  }}
                                  className="w-full bg-orange-500 text-white text-[10px] font-bold py-2 rounded-sm uppercase tracking-wider"
                                >
                                  Apply
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExportExcel}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-sm flex items-center gap-2 transition font-semibold shadow-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                  disabled={invoices.length === 0}
                >
                  <Download size={18} className="text-gray-700 transition-transform group-hover:scale-110" />
                  Export
                </button>

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
                  onClick={() => {
                    setFormData({
                      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      clientName: "",
                      email: "",
                      phone: "",
                      address: "",
                      invoiceDate: new Date().toISOString().split("T")[0],
                      dueDate: "",
                      lineItems: [],
                      subtotal: 0,
                      tax: 0,
                      discount: 0,
                      totalAmount: 0,
                      paidAmount: 0,
                      balanceAmount: 0,
                      status: "Draft",
                      notes: "",
                      tax_type: "GST",
                      client_gstin: "",
                      place_of_supply: "",
                      business_gstin: "",
                      pan_number: "",
                      terms_and_conditions: ""
                    });
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <NumberCard
              title={"Total Invoices"}
              number={(summary.totalInvoices || 0).toLocaleString()}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"Paid Total"}
              number={`₹${(summary.paidInvoices || 0).toLocaleString("en-IN")}`}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"Total Revenue"}
              number={`₹${(summary.totalValue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<DollarSign className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
            <NumberCard
              title={"Pending Balance"}
              number={`₹${(summary.pendingBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<CreditCard className="text-red-600" size={24} />}
              iconBgColor={"bg-red-100"}
              lineBorderClass={"border-red-500"}
            />
          </div>


          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                    <th className="py-3 px-4 font-semibold text-left">Date</th>
                    <th className="py-3 px-4 font-semibold text-left">Invoice ID</th>
                    <th className="py-3 px-4 font-semibold text-left">Client Name</th>
                    <th className="py-3 px-4 font-semibold text-left">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Total Amount</th>
                    <th className="py-3 px-4 font-semibold text-right">Received Amount</th>
                    <th className="py-3 px-4 font-semibold text-right">Pending Amount</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="py-20 text-center">
                        <div className="flex justify-center flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                          <p className="text-gray-500 font-semibold animate-pulse">Loading invoices...</p>
                        </div>
                      </td>
                    </tr>
                  ) : invoices.length > 0 ? (
                    invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`border-b border-gray-100 hover:bg-orange-50/20 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                      >
                        <td className="py-3 px-4 text-gray-600 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-orange-500" />
                            {new Date(invoice.invoice_date).toLocaleDateString('en-GB')}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900 text-sm italic">
                          {invoice.invoice_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                              <User size={14} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-gray-900 truncate">{invoice.client_name}</div>
                              <div className="text-[10px] font-medium text-gray-400 truncate uppercase mt-0.5">{invoice.client_email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={invoice.status}
                              onChange={(e) => handleStatusUpdate(invoice, e.target.value)}
                              className={`px-2.5 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wider outline-none cursor-pointer transition-all ${invoice.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                  invoice.status === 'Partial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    invoice.status === 'Unpaid' ? 'bg-red-50 text-red-700 border-red-200' :
                                      invoice.status === 'Draft' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                                        invoice.status === 'Sent' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                          'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                            >
                              <option value="Draft">Draft</option>
                              <option value="Sent">Sent</option>
                              <option value="Unpaid">Unpaid</option>
                              <option value="Paid">Paid</option>
                              <option value="Partial">Partial</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            {invoice.status === "Partial" && (
                              <button
                                onClick={() => handleStatusUpdate(invoice, "Partial")}
                                className="p-1.5 bg-orange-50 text-[#FF7B1D] rounded-full hover:bg-orange-100 transition-colors shadow-sm"
                                title="Edit Partial Payment"
                              >
                                <Edit2 size={12} strokeWidth={3} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm font-bold text-gray-900">₹{(invoice.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm font-bold text-green-600">₹{(invoice.paid_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className={`text-sm font-bold ${(invoice.balance_amount || 0) > 0 ? "text-red-500" : "text-green-600"}`}>
                            ₹{(invoice.balance_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </div>
                          {(invoice.balance_amount || 0) === 0 && (
                            <div className="text-[9px] font-black text-green-500 uppercase tracking-tighter mt-0.5 animate-pulse">CLEARED</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-3 text-gray-400">
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowViewModal(true);
                              }}
                              className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                              title="View Invoice"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all shadow-sm"
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
                      <td colSpan="8" className="text-center py-10">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText size={32} className="text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 uppercase tracking-tight">
                          No Invoices Found
                        </h3>
                        <p className="text-gray-500 text-sm font-medium italic">
                          {hasActiveFilters ? "No invoices match your selected filters" : "Start by creating your first client invoice"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-orange-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Invoices
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 text-xs uppercase tracking-widest ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.max(pagination.totalPages, 1) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-sm font-bold transition text-xs ${currentPage === page ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(next => Math.min(next + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages || pagination.total === 0}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 text-xs uppercase tracking-widest ${currentPage === pagination.totalPages || pagination.total === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <CreateInvoiceModal
          showModal={showModal}
          setShowModal={setShowModal}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleCreateInvoice={handleCreateInvoice}
        />

        <ViewInvoiceModal
          showModal={showViewModal}
          setShowModal={setShowViewModal}
          invoice={selectedInvoice}
        />
        <DeleteInvoiceModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          invoice={selectedInvoice}
          refetchInvoices={refetch}
        />

        {/* Partial Payment Modal */}
        <Modal
          isOpen={showPartialModal}
          onClose={() => setShowPartialModal(false)}
          title="Partial Payment"
          subtitle={`Updating payment for ${invoiceForPartial?.invoice_number}`}
          icon={<DollarSign size={24} />}
          maxWidth="max-w-md"
          footer={
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowPartialModal(false)}
                className="flex-1 px-8 py-3 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 font-bold text-gray-700 transition-all uppercase tracking-widest text-[10px]"
              >
                Discard
              </button>
              <button
                onClick={handlePartialSubmit}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-md transition-all uppercase tracking-widest text-[10px] active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Update Receipt
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-sm border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Invoice Amount</p>
                <p className="text-xl font-bold text-slate-900 leading-none">₹{invoiceForPartial?.total_amount?.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-5 rounded-sm border border-orange-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 opacity-10">
                  <CreditCard size={40} className="text-orange-300" />
                </div>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mb-2">Pending Balance</p>
                <p className="text-xl font-bold text-orange-700 leading-none">₹{invoiceForPartial?.balance_amount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-3 uppercase tracking-widest">
                <div className="w-6 h-6 bg-orange-100 text-[#FF7B1D] rounded-full flex items-center justify-center font-bold">₹</div>
                Enter Received Amount <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative group">
                <input
                  type="number"
                  autoFocus
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="w-full px-5 py-5 border-2 border-gray-100 rounded-lg focus:border-[#FF7B1D] focus:ring-4 focus:ring-orange-50 outline-none transition-all text-4xl font-bold text-gray-900 placeholder-gray-200 bg-white"
                  placeholder="0.00"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <DollarSign size={24} className="text-[#FF7B1D] opacity-20" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 font-bold flex items-center gap-2 uppercase tracking-widest italic">
                <RefreshCw size={12} className="text-[#FF7B1D] animate-spin-slow" />
                System will auto-calculate remaining balance
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
