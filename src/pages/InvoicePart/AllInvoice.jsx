import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
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
  CreditCard,
  Calendar,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";

import CreateInvoiceModal from "./CreateInvoiceModal";
import ViewInvoiceModal from "./ViewInvoiceModal";
import NumberCard from "../../components/NumberCard";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const dateDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Date Filter Logic matching MyExpanses.jsx
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

  const { data: invoicesResponse, isLoading, refetch } = useGetInvoicesQuery({
    status: filterStatus,
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage,
    dateFrom,
    dateTo
  });

  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

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

  const initialFormState = {
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientId: null,
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
    status: "Unpaid",
    notes: "",
    quotationId: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Effect to handle navigation from Client Card
  useEffect(() => {
    if (location.state?.client) {
      const { client, quotation } = location.state;

      let initialData = {
        ...initialFormState,
        clientId: client.id,
        clientName: client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name,
        email: client.email,
        phone: client.phone,
        address: client.address || '',
      };

      if (quotation) {
        initialData = {
          ...initialData,
          quotationId: quotation.quotation_id,
          lineItems: (quotation.line_items || []).map(item => ({
            id: Date.now() + Math.random(),
            name: item.name,
            qty: item.qty,
            rate: item.rate,
            total: item.total
          })),
          subtotal: quotation.subtotal,
          tax: quotation.tax,
          discount: quotation.discount,
          totalAmount: quotation.total_amount,
          notes: quotation.notes
        };
      }

      setFormData(initialData);
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateInvoice = async () => {
    if (!formData.clientName || !formData.invoiceDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
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
        tax_amount: (formData.subtotal * (formData.tax || 0)) / 100,
        total_amount: formData.totalAmount,
        paid_amount: formData.paidAmount,
        balance_amount: formData.balanceAmount,
        status: formData.status,
        notes: formData.notes,
        quotation_id: formData.quotationId
      };

      if (formData.id) {
        await updateInvoice({ id: formData.id, ...payload }).unwrap();
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice(payload).unwrap();
        toast.success("Invoice generated successfully");
      }
      setShowModal(false);
      setFormData(initialFormState);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Error saving invoice");
    }
  };

  const handleEdit = (invoice) => {
    setFormData({
      id: invoice.id,
      invoiceNo: invoice.invoice_number,
      clientId: invoice.client_id,
      clientName: invoice.client_name,
      email: invoice.client_email,
      phone: invoice.client_phone,
      address: invoice.client_address,
      invoiceDate: invoice.invoice_date ? new Date(invoice.invoice_date).toISOString().split('T')[0] : "",
      dueDate: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : "",
      lineItems: invoice.items || [],
      subtotal: invoice.subtotal || 0,
      tax: invoice.tax_rate || 0,
      discount: invoice.discount || 0,
      totalAmount: invoice.total_amount || 0,
      paidAmount: invoice.paid_amount || 0,
      balanceAmount: invoice.balance_amount || 0,
      status: invoice.status || "Unpaid",
      notes: invoice.notes || "",
      quotationId: invoice.quotation_id || "",
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700 border-green-200";
      case "Partial": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Unpaid": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-100">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoice Management</h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Home size={14} className="text-gray-400" /> CRM / <span className="text-[#FF7B1D] font-medium">Invoices</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isStatusFilterOpen || filterStatus !== "all"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isStatusFilterOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-sm shadow-xl z-50">
                      <div className="py-1">
                        {["all", "Paid", "Partial", "Unpaid"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setFilterStatus(option);
                              setIsStatusFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option === 'all' ? 'All Status' : option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Filter Dropdown */}
                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isDateFilterOpen || dateFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                  </button>

                  {isDateFilterOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setDateFilter(option);
                              setIsDateFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Date Range */}
                {dateFilter === "Custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => {
                        setCustomStart(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                    <span className="text-gray-400 text-xs font-bold">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => {
                        setCustomEnd(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm w-64 shadow-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                <button
                  onClick={() => {
                    setFormData(initialFormState);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={18} /> NEW INVOICE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <NumberCard
              title="Total Invoices"
              number={summary.totalInvoices || 0}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Paid Invoices"
              number={summary.paidInvoices || 0}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Total Revenue"
              number={`₹${(summary.totalValue || 0).toLocaleString("en-IN")}`}
              icon={<DollarSign className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Pending Balance"
              number={`₹${(summary.pendingBalance || 0).toLocaleString("en-IN")}`}
              icon={<CreditCard className="text-red-500" size={24} />}
              iconBgColor="bg-red-50"
              lineBorderClass="border-red-500"
            />
          </div>

          {/* Clear Filters Banner */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between bg-orange-50 border border-orange-200 rounded-sm p-3 gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-orange-600" size={16} />
                <span className="text-sm font-semibold text-orange-800">
                  {(searchTerm ? 1 : 0) + (filterStatus !== "all" ? 1 : 0) + (dateFilter !== "All" ? 1 : 0)} filter(s) active
                </span>
                {searchTerm && <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200 text-orange-700 shadow-sm font-medium">Search: "{searchTerm}"</span>}
                {filterStatus !== "all" && <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200 text-orange-700 shadow-sm font-medium">Status: {filterStatus}</span>}
                {dateFilter !== "All" && <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200 text-orange-700 shadow-sm font-medium">Date: {dateFilter}</span>}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-300 text-orange-600 rounded-sm hover:bg-orange-100 transition shadow-sm text-sm font-semibold active:scale-95"
              >
                <X size={14} /> Clear All
              </button>
            </div>
          )}

          {/* Invoices Table */}
          <div className="bg-white rounded-sm shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Inv No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Client Info</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Date</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm">Total</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm">Paid</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm">Balance</th>
                    <th className="px-4 py-3 text-center font-semibold text-sm">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-gray-500 font-bold">
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length > 0 ? (
                    invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                      >
                        <td className="px-4 py-3 font-bold text-[#FF7B1D] text-sm">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-800 text-sm">{invoice.client_name}</div>
                          <div className="text-[10px] text-gray-500 font-medium">{invoice.client_email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={14} className="text-orange-500" />
                            {new Date(invoice.invoice_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800 text-sm">
                          ₹{(invoice.total_amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-600 text-sm">
                          ₹{(invoice.paid_amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-sm">
                          <span className={(invoice.balance_amount || 0) > 0 ? 'text-red-500' : 'text-green-600'}>
                            ₹{(invoice.balance_amount || 0).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1.5 rounded-sm text-[10px] font-black border uppercase tracking-wider ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowViewModal(true);
                              }}
                              className="text-blue-500 hover:opacity-80"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="text-orange-500 hover:opacity-80"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
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
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No invoices found</h3>
                        <p className="text-gray-500 text-sm">
                          {hasActiveFilters ? "No invoices match your filters" : "Ready to create your first invoice?"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Invoices
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
    </DashboardLayout>
  );
}
