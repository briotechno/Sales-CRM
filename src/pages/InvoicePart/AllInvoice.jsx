import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
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
  Edit2,
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
  Receipt
} from "lucide-react";
import { FiHome } from "react-icons/fi";

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
    status: "Unpaid",
    notes: "",
    tax_type: "GST",
    client_gstin: "",
    business_gstin: "",
    pan_number: "",
    terms_and_conditions: ""
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
        terms_and_conditions: formData.terms_and_conditions
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
      terms_and_conditions: invoice.terms_and_conditions || ""
    });
    setShowModal(true);
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-100">
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Invoices
                </h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5 font-medium">
                  <FiHome className="text-gray-400" size={14} />
                  Dashboard / <span className="text-[#FF7B1D]">Invoice Management</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={refetch}
                  className={`p-2 rounded-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition shadow-sm ${isFetching ? 'animate-spin' : ''}`}
                  title="Refresh Data"
                >
                  <RefreshCw size={18} />
                </button>

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
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["all", "Paid", "Unpaid", "Partial", "Pending"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setFilterStatus(option);
                              setIsStatusFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-[11px] transition-colors uppercase ${filterStatus === option
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
                      className="px-2 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs shadow-sm"
                    />
                    <span className="text-gray-400 text-[10px] font-bold uppercase">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-2 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs shadow-sm"
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
                      status: "Unpaid",
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
                  className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 uppercase tracking-widest"
                >
                  <Plus size={18} />
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">
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

          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between bg-orange-50 border border-orange-200 rounded-sm p-3 gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-orange-600" size={16} />
                <span className="text-sm font-bold text-orange-800 uppercase">
                  ACTIVE FILTERS:
                </span>
                {searchTerm && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Search: "{searchTerm}"</span>}
                {filterStatus !== "all" && <span className="text-xs bg-white px-2 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Status: {filterStatus}</span>}
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

          <div className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest">Invoice ID</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest">Client Name</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="6" className="px-4 py-4 text-center text-gray-400 text-xs italic">Loading...</td>
                      </tr>
                    ))
                  ) : invoices.length > 0 ? (
                    invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`border-b border-gray-100 hover:bg-orange-50/20 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                      >
                        <td className="px-4 py-4 text-gray-600 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-orange-500" />
                            {new Date(invoice.invoice_date).toLocaleDateString('en-GB')}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-900 text-sm italic">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-4 py-4">
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
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wider ${invoice.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                            invoice.status === 'Partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Paid' ? 'bg-green-500' : invoice.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm font-bold text-gray-900">₹{(invoice.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                          <div className={`text-[10px] font-bold mt-0.5 uppercase tracking-widest ${(invoice.balance_amount || 0) > 0 ? "text-red-500" : "text-green-600"}`}>
                            {invoice.balance_amount > 0 ? `BAL: ₹${invoice.balance_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Fully Paid"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-3 text-gray-400">
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowViewModal(true);
                              }}
                              className="text-blue-500 hover:opacity-80 transition-colors"
                              title="View Invoice"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="text-[#FF7B1D] hover:opacity-80 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10">
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
      </div>
    </DashboardLayout>
  );
}
