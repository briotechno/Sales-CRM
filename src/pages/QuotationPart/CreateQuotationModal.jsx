import React, { useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function CreateQuotationModal({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleCreateQuotation,
  setFormData,
}) {
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

  // Automatic calculation effect
  useEffect(() => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * (parseFloat(formData.tax) || 0)) / 100;
    const totalAmount = subtotal + taxAmount - (parseFloat(formData.discount) || 0);

    // Only update if values have actually changed to avoid infinite loops
    if (
      subtotal !== formData.subtotal ||
      totalAmount !== formData.totalAmount
    ) {
      setFormData(prev => ({
        ...prev,
        subtotal,
        totalAmount
      }));
    }
  }, [formData.lineItems, formData.tax, formData.discount]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold">{formData.id ? "Edit Quotation" : "Create New Quotation"}</h2>

          <button
            onClick={() => setShowModal(false)}
            className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Quotation No (Auto)
                </label>
                <input
                  type="text"
                  name="quotationNo"
                  value={formData.quotationNo}
                  readOnly
                  className={`${inputStyles} bg-gray-50`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className={inputStyles}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={inputStyles}
                  placeholder="Enter company name"
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
                  Quotation Date *
                </label>
                <input
                  type="date"
                  name="quotationDate"
                  value={formData.quotationDate}
                  onChange={handleInputChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className={inputStyles}
                />
              </div>
            </div>
          </section>

          {/* Financial Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-4">
              Financial Details
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className={inputStyles}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Line Items Table */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-700">Line Items</label>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="bg-orange-500 text-white px-3 py-1.5 rounded-sm text-sm font-bold flex items-center gap-1 hover:bg-orange-600 transition-colors"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Item Name</th>
                      <th className="px-4 py-2 text-center w-24">Qty</th>
                      <th className="px-4 py-2 text-right w-32">Rate</th>
                      <th className="px-4 py-2 text-right w-32">Amount</th>
                      <th className="px-4 py-2 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                            className={inputStyles}
                            placeholder="Service/Product name"
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
                        <td className="p-2 text-right font-semibold">
                          {(item.total || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.lineItems.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-500 animate-pulse">
                          No items added yet. Click "Add Item" to start.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-4">
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
                    placeholder="Enter tax percentage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Discount
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={inputStyles}
                    placeholder="Enter discount amount"
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-sm space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{(formData.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({formData.tax || 0}%)</span>
                  <span className="font-semibold">{(((formData.subtotal || 0) * (formData.tax || 0)) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 pb-2 border-b">
                  <span>Discount</span>
                  <span className="font-semibold">-{(formData.discount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total Amount</span>
                  <span className="text-orange-600">
                    {formData.currency === "INR" ? "₹" : "$"} {(formData.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Extras Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-4">
              Extras & Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Payment Terms
                </label>
                <textarea
                  rows="3"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  placeholder="Enter payment terms (e.g. 50% advance, 50% on completion)"
                  className={inputStyles}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Notes / T&C
                </label>
                <textarea
                  rows="3"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter terms and conditions or internal notes"
                  className={inputStyles}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={inputStyles}
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-sm hover:bg-gray-50 font-bold text-gray-700 transition-all uppercase tracking-wide text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateQuotation}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-lg transition-all uppercase tracking-wide text-sm"
            >
              {formData.id ? "Update Quotation" : "Create Quotation"}

            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

