import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Search, User, Building2, FileCheck } from "lucide-react";
import { useGetClientsQuery } from "../../store/api/clientApi";
import { useGetQuotationsQuery } from "../../store/api/quotationApi";
import { useDebounce } from "../../hooks/useDebounce";

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

    const [quotationSearch, setQuotationSearch] = useState("");
    const debouncedQuotationSearch = useDebounce(quotationSearch, 500);
    const [showQuotationDropdown, setShowQuotationDropdown] = useState(false);

    const { data: clientsData } = useGetClientsQuery({ status: 'active' });
    const { data: quotationsData } = useGetQuotationsQuery({
        status: 'Approved',
        search: debouncedQuotationSearch,
        limit: 50
    });

    const clients = clientsData?.data || [];
    const quotations = quotationsData?.quotations || [];

    useEffect(() => {
        if (!showModal) return;

        const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
        const taxAmount = (subtotal * (parseFloat(formData.tax) || 0)) / 100;
        const totalAmount = subtotal + taxAmount - (parseFloat(formData.discount) || 0);
        const balanceAmount = totalAmount - (parseFloat(formData.paidAmount) || 0);

        // Auto-update status based on payments
        let status = formData.status;
        if (parseFloat(formData.paidAmount) === 0) {
            status = "Unpaid";
        } else if (balanceAmount <= 0) {
            status = "Paid";
        } else {
            status = "Partial";
        }

        if (
            subtotal !== formData.subtotal ||
            totalAmount !== formData.totalAmount ||
            balanceAmount !== formData.balanceAmount ||
            status !== formData.status
        ) {
            setFormData(prev => ({
                ...prev,
                subtotal,
                totalAmount,
                balanceAmount,
                status
            }));
        }
    }, [formData.lineItems, formData.tax, formData.discount, formData.paidAmount, showModal]);

    if (!showModal) return null;

    const inputStyles =
        "w-full px-4 py-2 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

    const addLineItem = () => {
        setFormData((prev) => ({
            ...prev,
            lineItems: [
                ...prev.lineItems,
                { id: Date.now(), name: "", qty: 1, rate: 0, total: 0 },
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
                    const updatedItem = { ...item, [field]: value };
                    if (field === "qty" || field === "rate") {
                        updatedItem.total = (parseFloat(updatedItem.qty) || 0) * (parseFloat(updatedItem.rate) || 0);
                    }
                    return updatedItem;
                }
                return item;
            });

            return {
                ...prev,
                lineItems: newLineItems,
            };
        });
    };

    const handleSelectClient = (client) => {
        setFormData(prev => ({
            ...prev,
            clientId: client.id,
            clientName: client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name,
            email: client.email,
            phone: client.phone,
            address: client.address || '',
            companyName: client.company_name || ''
        }));
        setClientSearch("");
        setShowClientDropdown(false);
    };

    const handleSelectQuotation = (q) => {
        // Map line_items from quotation to items in invoice
        const mappedItems = (q.line_items || []).map(item => ({
            id: Date.now() + Math.random(),
            name: item.name,
            qty: item.qty,
            rate: item.rate,
            total: item.total
        }));

        setFormData(prev => ({
            ...prev,
            quotationId: q.quotation_id,
            clientName: q.client_name,
            email: q.email,
            phone: q.phone,
            lineItems: mappedItems,
            subtotal: q.subtotal,
            tax: q.tax,
            discount: q.discount,
            totalAmount: q.total_amount,
            notes: q.notes
        }));
        setQuotationSearch("");
        setShowQuotationDropdown(false);
    };

    const filteredClients = clients.filter(c => {
        const name = c.type === 'person' ? `${c.first_name} ${c.last_name || ''}` : c.company_name;
        return name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.email?.toLowerCase().includes(clientSearch.toLowerCase());
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-2xl font-bold">{formData.id ? "Edit Invoice" : "Create New Invoice"}</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Quotation Selection */}
                    <section className="bg-orange-50 p-4 rounded-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-4">
                            <FileCheck className="text-orange-600" size={24} />
                            <h3 className="text-lg font-bold text-orange-800 uppercase tracking-tighter">Import from Quotation</h3>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={quotationSearch}
                                onChange={(e) => {
                                    setQuotationSearch(e.target.value);
                                    setShowQuotationDropdown(true);
                                }}
                                onFocus={() => setShowQuotationDropdown(true)}
                                className={`${inputStyles} border-orange-200`}
                                placeholder="Search by Quotation ID or Client Name..."
                            />
                            {showQuotationDropdown && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-xl max-h-60 overflow-y-auto font-medium">
                                    {quotations.length > 0 ? (
                                        quotations.map(q => (
                                            <div
                                                key={q.id}
                                                onClick={() => handleSelectQuotation(q)}
                                                className="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-0"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-orange-600 font-black">{q.quotation_id}</span>
                                                    <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">₹{q.total_amount.toLocaleString()}</span>
                                                </div>
                                                <div className="text-sm text-gray-900 font-bold mt-1">{q.client_name}</div>
                                                <div className="text-xs text-gray-500">{new Date(q.quotation_date).toLocaleDateString()}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm italic">No approved quotations found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-orange-600 font-bold italic">* Selecting a quotation will automatically fill client details and line items.</p>
                    </section>

                    {/* Basic Section */}
                    <section>
                        <div className="flex items-center justify-between border-b-2 border-orange-500 pb-2 mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Client Information</h3>
                            <span className="text-xs text-gray-500 italic">* Required fields</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Search & Select Client *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={clientSearch}
                                        onChange={(e) => {
                                            setClientSearch(e.target.value);
                                            setShowClientDropdown(true);
                                        }}
                                        onFocus={() => setShowClientDropdown(true)}
                                        className={inputStyles}
                                        placeholder="Type name or email..."
                                    />
                                    <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
                                </div>
                                {showClientDropdown && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-xl max-h-60 overflow-y-auto">
                                        {filteredClients.length > 0 ? (
                                            filteredClients.map(client => (
                                                <div
                                                    key={client.id}
                                                    onClick={() => handleSelectClient(client)}
                                                    className="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-0 flex items-center gap-3"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                        {client.type === 'person' ? <User size={16} /> : <Building2 size={16} />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{client.email}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm italic">No clients found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Client Name (Self/Auto)
                                </label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="Select client or type"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Invoice No *
                                </label>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    value={formData.invoiceNo}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="client@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Invoice Date *
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Billing Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={inputStyles}
                                    placeholder="123 Street Name, City, Country"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Financial Section */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-6">Items & Payment Details</h3>

                        {/* Line Items Table */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-gray-700">Line Items</label>
                                <button
                                    type="button"
                                    onClick={addLineItem}
                                    className="bg-[#FF7B1D] text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 hover:bg-[#E66A0D] transition-all shadow-md active:scale-95"
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>
                            <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-700 font-bold border-b text-left">
                                        <tr>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3 text-center w-24">Qty</th>
                                            <th className="px-4 py-3 text-right w-32">Rate</th>
                                            <th className="px-4 py-3 text-right w-32">Total</th>
                                            <th className="px-4 py-3 text-center w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {formData.lineItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                                                        className={inputStyles}
                                                        placeholder="Item description"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => updateLineItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                                                        className={`${inputStyles} text-center`}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                                                        className={`${inputStyles} text-right`}
                                                    />
                                                </td>
                                                <td className="p-2 text-right font-bold text-gray-900">
                                                    ₹{(item.total || 0).toLocaleString()}
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        onClick={() => removeLineItem(item.id)}
                                                        className="text-red-400 hover:text-red-600 p-2 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {formData.lineItems.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                                    No items added yet. Click "Add Item" to begin.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Tax (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="tax"
                                            value={formData.tax}
                                            onChange={handleInputChange}
                                            className={inputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Discount (Amt)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className={inputStyles}
                                        />
                                    </div>
                                </div>

                                <div className="bg-orange-50 p-6 rounded-sm border border-orange-100 shadow-inner space-y-4">
                                    <h4 className="font-bold text-orange-800 text-sm uppercase tracking-wider mb-2">Payment Support (Partial)</h4>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                            Amount Paid (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="paidAmount"
                                            value={formData.paidAmount}
                                            onChange={handleInputChange}
                                            className={`${inputStyles} border-orange-200 text-lg font-bold text-green-700`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t border-orange-200">
                                        <span className="text-sm font-bold text-gray-600">Remaining Balance:</span>
                                        <span className={`text-xl font-black ${formData.balanceAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                                            ₹{(formData.balanceAmount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-sm space-y-4 shadow-sm h-full flex flex-col justify-center">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-bold">₹{(formData.subtotal || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Tax ({formData.tax || 0}%)</span>
                                    <span className="font-bold">₹{(((formData.subtotal || 0) * (formData.tax || 0)) / 100).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm pb-4 border-b">
                                    <span>Discount</span>
                                    <span className="font-bold text-red-500">- ₹{(formData.discount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                                    <span className="text-3xl font-black text-[#FF7B1D]">
                                        ₹{(formData.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <span className={`inline-block px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest border-2 ${formData.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-500' :
                                        formData.status === 'Partial' ? 'bg-yellow-100 text-yellow-700 border-yellow-500' :
                                            'bg-red-100 text-red-700 border-red-500'
                                        }`}>
                                        {formData.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Extras Section */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-6">Notes & Terms</h3>
                        <div>
                            <textarea
                                rows="3"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Enter terms & conditions or any specific notes for the client..."
                                className={inputStyles}
                            ></textarea>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-sm hover:bg-gray-100 font-black text-gray-700 transition-all uppercase tracking-widest text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateInvoice}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-black shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest text-sm active:scale-95"
                        >
                            {formData.id ? "Update Invoice" : "Generate Invoice"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
