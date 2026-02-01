import React, { useEffect } from "react";
import { X, Plus, Trash2, Search, User, Building2, Tag, Calendar, Hash, Mail, Phone, Building, FileText, CheckCircle } from "lucide-react";
import { useGetCatalogsQuery } from "../../store/api/catalogApi";
import { useGetAllTermsQuery } from "../../store/api/termApi";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";
import { toast } from "react-hot-toast";

export default function CreateQuotationModal({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleCreateQuotation,
  setFormData,
}) {
  const [activeItemSearchId, setActiveItemSearchId] = React.useState(null);
  const itemDropdownRef = React.useRef(null);

  const { data: catalogsData } = useGetCatalogsQuery({ limit: 100, status: 'Active' });
  const { data: termsData } = useGetAllTermsQuery({ limit: 100 });
  const { data: businessInfo } = useGetBusinessInfoQuery();

  const catalogs = catalogsData?.catalogs || catalogsData?.data || (Array.isArray(catalogsData) ? catalogsData : []);
  const termsList = Array.isArray(termsData) ? termsData : [];

  useEffect(() => {
    if (showModal && !formData.id && businessInfo) {
      setFormData(prev => ({
        ...prev,
        companyName: prev.companyName || businessInfo.company_name || "",
        email: prev.email || businessInfo.email || "",
        phone: prev.phone || businessInfo.phone || "",
      }));
    }
  }, [showModal, businessInfo, formData.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
        setActiveItemSearchId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  if (!showModal) return null;

  const inputStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm";

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: Date.now(), name: "", qty: 1, rate: 0, total: 0, minPrice: 0, maxPrice: 0 },
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
          if (field === "qty" || field === "rate") {
            newValue = Math.max(0, parseFloat(value) || 0);
          }

          // Enforce price constraints if they exist
          if (field === "rate") {
            if (item.minPrice !== undefined && item.minPrice > 0 && newValue < item.minPrice) {
              newValue = item.minPrice;
              toast.error(`Minimum price for this item is ₹${item.minPrice}`);
            }
            if (item.maxPrice !== undefined && item.maxPrice > 0 && newValue > item.maxPrice) {
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

      return {
        ...prev,
        lineItems: newLineItems,
      };
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
            minPrice: parseFloat(item.minPrice) || 0,
            maxPrice: parseFloat(item.maxPrice) || 0,
            total: (li.qty || 1) * rate
          };
        }
        return li;
      })
    }));
    setActiveItemSearchId(null);
  };

  const handlePolicyChange = (e) => {
    const { value } = e.target;
    const selectedId = parseInt(value);
    const selected = termsList.find(t => t.id === selectedId);
    setFormData(prev => ({ ...prev, terms_and_conditions: selected ? selected.description : "" }));
  };

  const validateAndSubmit = () => {
    if (!formData.companyName) return toast.error("Company Name is required");
    if (!formData.quotationDate) return toast.error("Quotation Date is required");
    if (formData.lineItems.length === 0) return toast.error("At least one item is required");

    const invalidItem = formData.lineItems.find(item => !item.name || item.rate <= 0 || item.qty <= 0);
    if (invalidItem) return toast.error("Please fill all item details correctly (Name, Qty > 0, Rate > 0)");

    handleCreateQuotation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-bold">{formData.id ? "Edit Quotation" : "Create New Quotation"}</h2>
          </div>

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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Hash size={16} className="text-[#FF7B1D]" />
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Building size={16} className="text-[#FF7B1D]" />
                  Company Name <span className="text-red-500">*</span>
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="text-[#FF7B1D]" />
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="text-[#FF7B1D]" />
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="text-[#FF7B1D]" />
                  Quotation Date <span className="text-red-500">*</span>
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
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="text-[#FF7B1D]" />
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
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag size={16} className="text-[#FF7B1D]" />
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
              <div className="border border-gray-200 rounded-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                    <tr>
                      <th className="px-4 py-3 text-left uppercase tracking-[0.15em] text-[10px] font-bold">Item Name <span className="text-red-500">*</span></th>
                      <th className="px-4 py-3 text-center w-24 uppercase tracking-[0.15em] text-[10px] font-bold">Qty <span className="text-red-500">*</span></th>
                      <th className="px-4 py-3 text-right w-32 uppercase tracking-[0.15em] text-[10px] font-bold">Rate <span className="text-red-500">*</span></th>
                      <th className="px-4 py-3 text-right w-32 uppercase tracking-[0.15em] text-[10px] font-bold">Amount</th>
                      <th className="px-4 py-3 text-center w-16 uppercase tracking-[0.15em] text-[10px] font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="p-2 relative">
                          <div className="relative flex items-center">
                            <Search size={14} className="absolute left-2 text-gray-400" />
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                updateLineItem(item.id, "name", e.target.value);
                                setActiveItemSearchId(item.id);
                              }}
                              onFocus={() => setActiveItemSearchId(item.id)}
                              className="w-full pl-8 pr-2 py-2 border border-transparent hover:border-gray-200 bg-transparent focus:bg-white focus:border-orange-200 outline-none rounded-sm transition-all text-xs"
                              placeholder="Type to search catalog..."
                            />
                          </div>
                          {activeItemSearchId === item.id && (
                            <div
                              ref={itemDropdownRef}
                              className="absolute z-[100] left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto w-[350px]"
                            >
                              <div className="p-2 border-b border-gray-50 bg-gray-50/50 sticky top-0 z-10 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                                Catalog Items
                              </div>
                              {catalogs.filter(c => c.name.toLowerCase().includes(item.name.toLowerCase())).length > 0 ? (
                                catalogs.filter(c => c.name.toLowerCase().includes(item.name.toLowerCase())).map(cat => (
                                  <div
                                    key={cat.id}
                                    onClick={() => handleSelectCatalogItem(cat, item.id)}
                                    className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center transition-colors group"
                                  >
                                    <div>
                                      <div className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{cat.name}</div>
                                      <div className="text-[10px] text-gray-400">{cat.sku || 'No SKU'}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs font-bold text-orange-600">
                                        {cat.maxPrice && cat.maxPrice > cat.minPrice ? (
                                          <span>₹{parseFloat(cat.minPrice).toLocaleString()} - ₹{parseFloat(cat.maxPrice).toLocaleString()}</span>
                                        ) : (
                                          <span>₹{parseFloat(cat.minPrice || cat.price || cat.rate || 0).toLocaleString()}</span>
                                        )}
                                      </div>
                                      {cat.category && <div className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 mt-1 inline-block">{cat.category}</div>}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center">
                                  <div className="text-gray-400 text-xs italic mb-1">No matching catalog items</div>
                                  <button
                                    onClick={() => setActiveItemSearchId(null)}
                                    className="text-[10px] text-orange-500 font-bold hover:underline"
                                  >
                                    Use custom name
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                            value={item.qty}
                            onChange={(e) => updateLineItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-transparent hover:border-gray-100 bg-transparent focus:bg-white text-center outline-none rounded-sm transition-all text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-transparent hover:border-gray-100 bg-transparent focus:bg-white text-right outline-none rounded-sm transition-all text-xs"
                          />
                        </td>
                        <td className="p-2 text-right font-bold text-gray-900 pr-4">
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
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Tag size={16} className="text-[#FF7B1D]" />
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                    name="tax"
                    value={formData.tax}
                    onChange={handleInputChange}
                    className={inputStyles}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Tag size={16} className="text-[#FF7B1D]" />
                    Discount
                  </label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={inputStyles}
                    placeholder="0.00"
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
                  <span className="text-orange-600 font-bold">
                    {formData.currency === "INR" ? "₹" : "$"} {(formData.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Extras Section */}
          <section className="bg-orange-50/30 p-6 rounded-lg border border-orange-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider text-[11px]">
                  Select Terms & Conditions
                </label>
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
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider text-[11px]">
                  <Tag size={14} className="text-[#FF7B1D]" />
                  Quotation Status
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
            {formData.terms_and_conditions && (
              <div className="mt-4 p-4 bg-white/50 border border-orange-100 rounded-lg text-xs text-gray-600 italic leading-relaxed shadow-sm">
                <div className="font-bold text-[10px] text-orange-500 uppercase mb-1 tracking-widest">Applied Terms:</div>
                <p className="break-words"> {formData.terms_and_conditions}</p>
              </div>
            )}
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
              onClick={validateAndSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-lg transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2 active:scale-95"
            >
              {formData.id ? <><CheckCircle size={18} /> Update Quotation</> : <><Plus size={18} /> Create Quotation</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

