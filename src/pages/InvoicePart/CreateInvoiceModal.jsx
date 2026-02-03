import React, { useEffect, useState, useRef } from "react";
import { X, Plus, Trash2, Search, User, Building2, FileCheck, FileText, Tag, CreditCard, Calendar, Hash, Building, Mail, Phone, MapPin, DollarSign } from "lucide-react";
import { useGetClientsQuery } from "../../store/api/clientApi";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";
import { useGetCatalogsQuery } from "../../store/api/catalogApi";
import { useGetAllTermsQuery } from "../../store/api/termApi";
import Modal from "../../components/common/Modal";
import { toast } from "react-hot-toast";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CreateInvoiceModal({
    showModal,
    setShowModal,
    formData,
    handleInputChange,
    handleCreateInvoice,
    setFormData,
}) {
    const [clientSearch, setClientSearch] = useState("");
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [activeItemSearchId, setActiveItemSearchId] = useState(null);
    const clientDropdownRef = useRef(null);
    const itemDropdownRef = useRef(null);

    const { data: clientsData } = useGetClientsQuery({ status: 'active' });
    const { data: businessInfo } = useGetBusinessInfoQuery();
    const { data: catalogsData } = useGetCatalogsQuery({ limit: 100, status: 'Active' });
    const { data: termsData } = useGetAllTermsQuery({ limit: 100 });

    const clients = clientsData?.data || [];
    const catalogs = catalogsData?.catalogs || [];
    const termsList = Array.isArray(termsData) ? termsData : [];

    const [invoiceType, setInvoiceType] = useState(formData.tax_type || "GST");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
                setShowClientDropdown(false);
            }
            if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
                setActiveItemSearchId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!showModal) return;

        if (businessInfo && !formData.business_gstin) {
            setFormData(prev => ({
                ...prev,
                business_gstin: businessInfo.gst_number || "",
            }));
        }

        const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);

        let tax_rate = parseFloat(formData.tax) || 0;
        if (invoiceType === "Non-GST") {
            tax_rate = 0;
        } else if (tax_rate === 0 && invoiceType === "GST") {
            tax_rate = 18;
        }

        const taxAmount = (subtotal * tax_rate) / 100;
        const totalAmount = subtotal + taxAmount - (parseFloat(formData.discount) || 0);
        const balanceAmount = totalAmount - (parseFloat(formData.paidAmount) || 0);

        let status = formData.status;
        const autoStatuses = ["Paid", "Unpaid", "Partial"];

        if (autoStatuses.includes(status) || !status) {
            if (parseFloat(formData.paidAmount) === 0) {
                status = "Unpaid";
            } else if (balanceAmount <= 0) {
                status = "Paid";
            } else {
                status = "Partial";
            }
        }

        if (
            subtotal !== formData.subtotal ||
            totalAmount !== formData.totalAmount ||
            balanceAmount !== formData.balanceAmount ||
            status !== formData.status ||
            tax_rate !== formData.tax ||
            invoiceType !== formData.tax_type
        ) {
            setFormData(prev => ({
                ...prev,
                subtotal,
                tax: tax_rate,
                totalAmount,
                balanceAmount,
                status,
                tax_type: invoiceType
            }));
        }
    }, [formData.lineItems, formData.tax, formData.discount, formData.paidAmount, showModal, invoiceType, businessInfo]);

    if (!showModal) return null;

    const inputStyles =
        "w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-medium";

    const addLineItem = () => {
        setFormData((prev) => ({
            ...prev,
            lineItems: [
                ...prev.lineItems,
                { id: Date.now(), name: "", hsn_code: "", qty: 1, rate: 0, total: 0 },
            ],
        }));
    };

    const removeLineItem = (id) => {
        setFormData((prev) => ({
            ...prev,
            lineItems: prev.lineItems.filter((item) => item.id !== id),
        }));
    };

    const updateLineItem = (id, field, value) => {
        setFormData((prev) => {
            const newLineItems = prev.lineItems.map((item) => {
                if (item.id === id) {
                    let newValue = value;

                    // Prevent negative numbers for numeric fields
                    if (field === "qty" || field === "rate") {
                        newValue = Math.max(0, parseFloat(value) || 0);
                    }

                    // Enforce price constraints if they exist
                    if (field === "rate") {
                        if (item.minPrice !== undefined && item.minPrice !== null && newValue < item.minPrice) {
                            newValue = item.minPrice;
                            toast.error(`Minimum price for this item is ₹${item.minPrice}`);
                        }
                        if (item.maxPrice !== undefined && item.maxPrice !== null && item.maxPrice > 0 && newValue > item.maxPrice) {
                            newValue = item.maxPrice;
                            toast.error(`Maximum price for this item is ₹${item.maxPrice}`);
                        }
                    }

                    const updatedItem = { ...item, [field]: newValue };
                    if (field === "qty" || field === "rate") {
                        updatedItem.total = (parseFloat(updatedItem.qty) || 0) * (parseFloat(updatedItem.rate) || 0);
                    }
                    return updatedItem;
                }
                return item;
            });
            return { ...prev, lineItems: newLineItems };
        });
    };

    const handleSelectCatalogItem = (item, lineItemId) => {
        setFormData((prev) => ({
            ...prev,
            lineItems: prev.lineItems.map((li) => {
                if (li.id === lineItemId) {
                    const rate = parseFloat(item.minPrice) || parseFloat(item.price) || parseFloat(item.rate) || 0;
                    return {
                        ...li,
                        name: item.name,
                        rate: rate,
                        minPrice: parseFloat(item.minPrice),
                        maxPrice: parseFloat(item.maxPrice),
                        total: (li.qty || 1) * rate
                    };
                }
                return li;
            })
        }));
        setActiveItemSearchId(null);
    };

    const handleSelectClient = (client) => {
        const name = client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name;
        setFormData(prev => ({
            ...prev,
            clientId: client.id,
            clientName: name,
            email: client.email || "",
            phone: client.phone || "",
            address: client.address || "",
            client_gstin: client.tax_id || "",
            state: client.state || prev.state,
            pincode: client.pincode || prev.pincode,
            customer_type: client.type === 'person' ? 'Individual' : 'Business',
            contact_person: client.type === 'business' ? `${client.first_name} ${client.last_name || ''}` : ""
        }));
        setClientSearch(name);
        setShowClientDropdown(false);
    };

    const handlePolicyChange = (e) => {
        const { name, value } = e.target;
        const selectedId = parseInt(value);
        if (name === "terms_and_conditions_id") {
            const selected = termsList.find(t => t.id === selectedId);
            setFormData(prev => ({ ...prev, terms_and_conditions: selected ? selected.description : "" }));
        }
    };

    const validateAndSubmit = () => {
        if (!formData.clientName) return toast.error("Client name is required");
        if (!formData.invoiceNo) return toast.error("Invoice Number is required");
        if (!formData.invoiceDate) return toast.error("Invoice Date is required");

        if (invoiceType === "GST") {
            if (!formData.state) return toast.error("State is required for GST Invoice");
            if (!formData.address) return toast.error("Billing Address is required");
            if (formData.customer_type === "Business") {
                if (!formData.client_gstin) return toast.error("GSTIN is required for B2B Invoice");
                if (!formData.pincode) return toast.error("Pincode is required for Business customer");
            }
        } else {
            if (!formData.address) return toast.error("Address is required");
        }

        if (formData.lineItems.length === 0) return toast.error("At least one item is required");

        const invalidItem = formData.lineItems.find(item => !item.name || item.rate < 0 || item.qty <= 0);
        if (invalidItem) return toast.error("Please fill all item details correctly");

        handleCreateInvoice();
    };

    const filteredClients = clients.filter(c => {
        const name = c.type === 'person' ? `${c.first_name} ${c.last_name || ''}` : c.company_name;
        return name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.email?.toLowerCase().includes(clientSearch.toLowerCase());
    });

    const footer = (
        <div className="flex gap-4 w-full">
            <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-8 py-3 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 font-bold text-gray-700 transition-all text-sm"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={validateAndSubmit}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-md transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
            >
                {formData.id ? <><FileCheck size={18} /> Update Invoice</> : <><Plus size={18} /> Generate Invoice</>}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={formData.id ? "Edit Invoice" : "Create New Invoice"}
            subtitle={formData.id ? "Update existing invoice details" : "Generate a professional invoice for your client"}
            icon={<FileText size={24} />}
            maxWidth="max-w-5xl"
            footer={footer}
        >
            <div className="space-y-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="bg-slate-50 p-5 rounded-sm border border-slate-100 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest leading-none">Invoice Type</h3>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Compliance Mode</p>
                            </div>
                        </div>

                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm mb-4">
                            <button
                                type="button"
                                onClick={() => setInvoiceType("GST")}
                                className={`flex-1 py-2 rounded-md text-[11px] font-bold transition-all ${invoiceType === "GST"
                                    ? "bg-orange-500 text-white shadow-md font-black"
                                    : "text-gray-400 hover:bg-gray-50"
                                    }`}
                            >
                                GST Tax Invoice
                            </button>
                            <button
                                type="button"
                                onClick={() => setInvoiceType("Non-GST")}
                                className={`flex-1 py-2 rounded-md text-[11px] font-bold transition-all ${invoiceType === "Non-GST"
                                    ? "bg-orange-500 text-white shadow-md font-black"
                                    : "text-gray-400 hover:bg-gray-50"
                                    }`}
                            >
                                Simple / Non-GST
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    <Hash size={14} className="text-[#FF7B1D]" />
                                    Invoice No <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    value={formData.invoiceNo}
                                    onChange={handleInputChange}
                                    className={`${inputStyles} ${formData.id ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100" : ""}`}
                                    placeholder="INV-2024-001"
                                    disabled={!!formData.id}
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    <Calendar size={14} className="text-[#FF7B1D]" />
                                    Invoice Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="invoiceDate"
                                    value={formData.invoiceDate}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    <Tag size={14} className="text-[#FF7B1D]" />
                                    Current Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={`${inputStyles} cursor-pointer`}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Sent">Sent</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/30 p-5 rounded-sm border border-blue-50 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest leading-none">Customer Type</h3>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Classification</p>
                            </div>
                        </div>

                        {invoiceType === "GST" ? (
                            <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm mb-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, customer_type: "Business" }))}
                                    className={`flex-1 py-2 rounded-md text-[11px] font-bold transition-all ${formData.customer_type === "Business"
                                        ? "bg-blue-600 text-white shadow-md font-black"
                                        : "text-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    Business (B2B)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, customer_type: "Individual" }))}
                                    className={`flex-1 py-2 rounded-md text-[11px] font-bold transition-all ${formData.customer_type === "Individual"
                                        ? "bg-blue-600 text-white shadow-md font-black"
                                        : "text-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    Individual (B2C)
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-4 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-[11px] font-bold text-gray-400 text-center">Standard Customer Mode</p>
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                <Calendar size={14} className="text-[#FF7B1D]" />
                                Payment Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className={inputStyles}
                            />
                        </div>
                    </div>
                </div>

                <section className="bg-white border border-gray-200 rounded-sm p-6 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-gray-50">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Building2 size={18} />
                        </div>
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.1em]">
                            {invoiceType === "GST"
                                ? (formData.customer_type === "Business" ? "Business Info" : "Individual Customer")
                                : "Customer Information"}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 lg:col-span-1 relative group" ref={clientDropdownRef}>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                <User size={14} className="text-[#FF7B1D]" />
                                {invoiceType === "GST" && formData.customer_type === "Business" ? "Company Name" : "Customer Name"} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={clientSearch || formData.clientName}
                                    onChange={(e) => {
                                        setClientSearch(e.target.value);
                                        setFormData(prev => ({ ...prev, clientName: e.target.value }));
                                        setShowClientDropdown(true);
                                    }}
                                    onFocus={() => setShowClientDropdown(true)}
                                    className={inputStyles}
                                    placeholder="Search or enter name..."
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                            {showClientDropdown && (
                                <div className="absolute z-40 w-full mt-1 bg-white border-2 border-gray-100 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                    {filteredClients.length > 0 ? (
                                        filteredClients.map(client => (
                                            <div
                                                key={client.id}
                                                onClick={() => handleSelectClient(client)}
                                                className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0 font-bold">
                                                    {client.type === 'person' ? "C" : "B"}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-bold text-gray-900 truncate">{client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name}</div>
                                                    <div className="text-[10px] text-gray-400 truncate uppercase font-bold tracking-tighter">{client.email} | {client.type}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-xs italic">No matching clients</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {invoiceType === "GST" && (
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                    <Building size={14} className="text-[#FF7B1D]" />
                                    GSTIN {formData.customer_type === "Business" && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="client_gstin"
                                    value={formData.client_gstin}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="29AAAAA0000A1Z5"
                                />
                            </div>
                        )}

                        {invoiceType === "GST" && formData.customer_type === "Business" && (
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                    <User size={14} className="text-[#FF7B1D]" />
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="Full Name"
                                />
                            </div>
                        )}

                        <div className={invoiceType === "GST" ? "md:col-span-1" : "md:col-span-2"}>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                <MapPin size={14} className="text-[#FF7B1D]" />
                                Billing Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={inputStyles}
                                placeholder="Street, Area..."
                            />
                        </div>

                        {invoiceType === "GST" && (
                            <>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                        <MapPin size={14} className="text-[#FF7B1D]" />
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="state"
                                        value={formData.state || formData.place_of_supply}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setFormData(prev => ({ ...prev, place_of_supply: e.target.value }));
                                        }}
                                        className={inputStyles}
                                    >
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                {formData.customer_type === "Business" && (
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                            <Hash size={14} className="text-[#FF7B1D]" />
                                            Pincode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className={inputStyles}
                                            placeholder="6 Digits"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                <Phone size={14} className="text-[#FF7B1D]" />
                                Mobile Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={inputStyles}
                                placeholder="+91 00000 00000"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase">
                                <Mail size={14} className="text-[#FF7B1D]" />
                                Email ID
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={inputStyles}
                                placeholder="name@domain.com"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white border border-gray-100 rounded-sm p-5">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <Tag size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Line Items</h3>
                        </div>
                        <button
                            type="button"
                            onClick={addLineItem}
                            className="bg-[#FF7B1D] text-white px-6 capitalize py-2.5 rounded-sm text-sm font-bold flex items-center gap-2 hover:bg-[#E66A0D] transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Plus size={16} strokeWidth={3} /> Add New Item
                        </button>
                    </div>

                    <div className="border border-gray-100 rounded-sm overflow-visible mb-8 shadow-sm">
                        <table className="w-full text-[11px]">
                            <thead className="bg-gray-50 text-gray-500 font-bold border-b text-left">
                                <tr>
                                    <th className="px-4 py-3 uppercase tracking-widest">Description <span className="text-red-500">*</span></th>
                                    <th className="px-4 py-3 text-center w-20">Qty <span className="text-red-500">*</span></th>
                                    <th className="px-4 py-3 text-right w-28">Rate (₹) <span className="text-red-500">*</span></th>
                                    <th className="px-4 py-3 text-right w-32">Total (₹)</th>
                                    <th className="px-4 py-3 text-center w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {formData.lineItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50">
                                        <td className="p-3 relative">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => {
                                                    updateLineItem(item.id, "name", e.target.value);
                                                    setActiveItemSearchId(item.id);
                                                }}
                                                onFocus={() => setActiveItemSearchId(item.id)}
                                                className="w-full px-3 py-2 border border-gray-200 focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none rounded-sm transition-all text-xs font-medium bg-gray-50/30 focus:bg-white"
                                                placeholder="Service or Product name..."
                                            />
                                            {activeItemSearchId === item.id && (
                                                <div ref={itemDropdownRef} className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-sm shadow-xl max-h-48 overflow-y-auto">
                                                    {catalogs.filter(c => c.name.toLowerCase().includes(item.name.toLowerCase())).length > 0 ? (
                                                        catalogs.filter(c => c.name.toLowerCase().includes(item.name.toLowerCase())).map(cat => (
                                                            <div
                                                                key={cat.id}
                                                                onClick={() => handleSelectCatalogItem(cat, item.id)}
                                                                className="p-2 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center"
                                                            >
                                                                <div>
                                                                    <div className="text-xs font-bold text-gray-800 truncate max-w-[200px]" title={cat.name}>
                                                                        {cat.name.length > 40 ? `${cat.name.substring(0, 40)}...` : cat.name}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs font-bold text-orange-600">
                                                                    {cat.maxPrice && cat.maxPrice > cat.minPrice ? (
                                                                        <span>₹{parseFloat(cat.minPrice).toLocaleString()} - ₹{parseFloat(cat.maxPrice).toLocaleString()}</span>
                                                                    ) : (
                                                                        <span>₹{parseFloat(cat.minPrice || cat.price || cat.rate || 0).toLocaleString()}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-3 text-center text-gray-400 text-[10px] italic">No matching catalog items</div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                min="0"
                                                onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                                value={item.qty}
                                                onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none rounded-sm text-center transition-all text-xs font-bold bg-gray-50/30 focus:bg-white"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                                    value={item.rate}
                                                    onChange={(e) => updateLineItem(item.id, "rate", e.target.value)}
                                                    className="w-full pl-7 pr-3 py-2 border border-gray-200 focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-10 outline-none rounded-sm text-right transition-all text-xs font-bold bg-gray-50/30 focus:bg-white"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3 text-right font-black text-gray-900 pr-4 text-xs">
                                            ₹{(item.total || 0).toLocaleString()}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => removeLineItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {formData.lineItems.length === 0 && (
                                    <tr>
                                        <td colSpan={invoiceType === "GST" ? 6 : 5} className="p-10 text-center text-gray-400 italic">No items added. Click "Add Item" to begin.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {invoiceType === "GST" && (
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">
                                            <Tag size={12} className="text-orange-500" />
                                            GST Rate (%)
                                        </label>
                                        <select
                                            name="tax"
                                            value={formData.tax}
                                            onChange={handleInputChange}
                                            className={inputStyles}
                                        >
                                            <option value="0">0%</option>
                                            <option value="5">5%</option>
                                            <option value="12">12%</option>
                                            <option value="18">18%</option>
                                            <option value="28">28%</option>
                                        </select>
                                    </div>
                                )}
                                <div className={invoiceType === "Non-GST" ? "col-span-2" : ""}>
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">
                                        <Tag size={12} className="text-orange-500" />
                                        Discount (Amt)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                        name="discount"
                                        value={formData.discount}
                                        onChange={(e) => handleInputChange({ target: { name: "discount", value: Math.max(0, parseFloat(e.target.value) || 0) } })}
                                        className={inputStyles}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-sm border border-gray-100 space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <CreditCard size={12} /> Payment Info
                                </h4>
                                <div>
                                    <label className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2 uppercase">
                                        <span className="flex items-center gap-2">
                                            <DollarSign size={13} className="text-orange-500" />
                                            Amount Received (₹)
                                        </span>
                                        {parseFloat(formData.paidAmount) >= formData.totalAmount && formData.totalAmount > 0 &&
                                            <span className="text-[9px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-sm">COMPLETELY PAID</span>
                                        }
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                        name="paidAmount"
                                        value={formData.paidAmount}
                                        onChange={(e) => handleInputChange({ target: { name: "paidAmount", value: Math.max(0, parseFloat(e.target.value) || 0) } })}
                                        className={`${inputStyles} bg-white text-lg font-bold text-green-700 ring-2 ring-transparent focus:ring-green-100`}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold pt-1 border-t border-gray-200 mt-2">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Pending Balance:</span>
                                    <span className={formData.balanceAmount > 0 ? "text-red-600" : "text-green-600"}>
                                        ₹{(formData.balanceAmount || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-sm p-6 text-white space-y-3 flex flex-col justify-center shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Building2 size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                                    <span>Subtotal</span>
                                    <span>₹{(formData.subtotal || 0).toLocaleString()}</span>
                                </div>

                                {invoiceType === "GST" && (
                                    <>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                                            <span>CGST ({formData.tax / 2}%)</span>
                                            <span>₹{(((formData.subtotal || 0) * (formData.tax / 2)) / 100).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                                            <span>SGST ({formData.tax / 2}%)</span>
                                            <span>₹{(((formData.subtotal || 0) * (formData.tax / 2)) / 100).toLocaleString()}</span>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] border-b border-white/5 pb-4 mb-4">
                                    <span>Discount</span>
                                    <span>- ₹{(formData.discount || 0).toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-1">Total Payable</p>
                                        <p className="text-4xl font-bold text-white tracking-tight">₹{(formData.totalAmount || 0).toLocaleString()}</p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.status === 'Paid' ? 'bg-green-500 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                                        formData.status === 'Partial' ? 'bg-blue-500 text-white border-blue-500' :
                                            formData.status === 'Draft' ? 'bg-gray-500 text-white border-gray-500' :
                                                formData.status === 'Sent' ? 'bg-orange-500 text-white border-orange-500' :
                                                    formData.status === 'Cancelled' ? 'bg-slate-700 text-white border-slate-700' :
                                                        'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                        }`}>
                                        {formData.status}
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${invoiceType === 'GST' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-gray-400'}`}></div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{invoiceType} MODE</span>
                                    </div>
                                    {formData.client_gstin && (
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">GSTIN: {formData.client_gstin}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Select Terms & Conditions</label>
                        <select
                            name="terms_and_conditions_id"
                            onChange={handlePolicyChange}
                            className={inputStyles}
                        >
                            <option value="">Choose Terms...</option>
                            {termsList.map(term => (
                                <option key={term.id} value={term.id}>{term.title || `Terms ${term.id}`}</option>
                            ))}
                        </select>
                        {formData.terms_and_conditions && (
                            <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-sm text-[11px] text-gray-600 italic">
                                {formData.terms_and_conditions}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </Modal>
    );
}
