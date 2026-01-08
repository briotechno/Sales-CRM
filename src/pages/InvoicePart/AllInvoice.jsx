import React, { useState, useEffect } from "react";
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
  CreditCard
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

export default function AllInvoicePage() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: invoicesResponse, isLoading, refetch } = useGetInvoicesQuery({
    status: filterStatus,
    search: searchTerm,
  });

  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const invoices = invoicesResponse?.data || [];

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
      // Clear location state to prevent modal reopening on refresh
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id).unwrap();
        toast.success("Invoice deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Error deleting invoice");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700 border-green-200";
      case "Partial": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Unpaid": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid').length;
  const totalValue = invoices.reduce((sum, i) => sum + parseFloat(i.total_amount || 0), 0);
  const pendingBalance = invoices.reduce((sum, i) => sum + parseFloat(i.balance_amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="ml-6 min-h-screen bg-white text-black">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Invoice Management</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Home size={14} /> CRM / <span className="text-[#FF7B1D] font-bold">Invoices</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search invoice or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-sm focus:border-[#FF7B1D] outline-none text-sm w-64 transition-all"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-100 rounded-sm focus:border-[#FF7B1D] outline-none text-sm font-bold bg-white"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              <button
                onClick={() => {
                  setFormData(initialFormState);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-[#FF7B1D] text-white px-6 py-2.5 rounded-sm hover:bg-[#E66A0D] transition-all font-black text-sm shadow-lg active:scale-95"
              >
                <Plus size={18} /> NEW INVOICE
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <NumberCard
              title="Total Invoices"
              number={totalInvoices}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Paid Invoices"
              number={paidInvoices}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Total Revenue"
              number={`₹${(totalValue / 100000).toFixed(2)}L`}
              icon={<DollarSign className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Pending Balance"
              number={`₹${(pendingBalance / 100000).toFixed(2)}L`}
              icon={<CreditCard className="text-red-500" size={24} />}
              iconBgColor="bg-red-50"
              lineBorderClass="border-red-500"
            />
          </div>

          {/* Invoices Table */}
          <div className="bg-white border-2 border-gray-100 rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100 text-gray-700 uppercase p-4">
                  <th className="px-6 py-4 font-black text-xs tracking-widest">Inv No.</th>
                  <th className="px-6 py-4 font-black text-xs tracking-widest">Client Name</th>
                  <th className="px-6 py-4 font-black text-xs tracking-widest">Date</th>
                  <th className="px-6 py-4 font-black text-xs tracking-widest text-right">Total</th>
                  <th className="px-6 py-4 font-black text-xs tracking-widest text-right">Balance</th>
                  <th className="px-6 py-4 font-black text-xs tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 font-black text-xs tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-[#FF7B1D] rounded-full animate-spin"></div>
                        <p className="text-gray-500 animate-pulse font-bold">Loading Invoices...</p>
                      </div>
                    </td>
                  </tr>
                ) : invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#FF7B1D]">{invoice.invoice_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{invoice.client_name}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{invoice.client_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">
                        ₹{(invoice.total_amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-red-500">
                        ₹{(invoice.balance_amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-sm text-[10px] font-black border-2 uppercase tracking-tighter ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowViewModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors border-2 border-transparent hover:border-blue-100"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-sm transition-colors border-2 border-transparent hover:border-orange-100"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors border-2 border-transparent hover:border-red-100"
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
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4 grayscale opacity-50">
                        <FileText size={64} className="text-gray-300" />
                        <div>
                          <p className="text-xl font-black text-gray-400 uppercase tracking-tighter">No Invoices Found</p>
                          <p className="text-sm text-gray-400 font-bold mt-1">Ready to create your first invoice?</p>
                        </div>
                        <button
                          onClick={() => setShowModal(true)}
                          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-sm font-black uppercase tracking-widest text-xs"
                        >
                          Add Now
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
    </DashboardLayout>
  );
}
