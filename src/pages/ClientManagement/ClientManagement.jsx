import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Search,
  Plus,
  Filter,
  Download,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  MapPin,
  Globe,
  Briefcase,
  FileText,
  FileCheck,
  Check,
  LayoutGrid,
  List,
  SquarePen,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "../../store/api/clientApi";
import { useGetQuotationsQuery } from "../../store/api/quotationApi";
import { toast } from "react-hot-toast";
import Modal from "../../components/common/Modal";
import ViewClientModal from "../../components/Client/ViewClientModal";
import { useDebounce } from "../../hooks/useDebounce";
import { Country, State, City } from "country-state-city";
import { ChevronDown } from "lucide-react";

export default function AllClientPage() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clientType, setClientType] = useState("person");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [selectedClients, setSelectedClients] = useState(new Set());
  const [viewMode, setViewMode] = useState("table");

  // Temporary Filter States for "Apply" logic
  const [tempFilterStatus, setTempFilterStatus] = useState("all");
  const [tempFilterIndustry, setTempFilterIndustry] = useState("all");
  const [tempFilterSource, setTempFilterSource] = useState("all");

  // New Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null); // ID for single delete
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [clientToView, setClientToView] = useState(null);

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quotation Selection State
  const [quotationSearch, setQuotationSearch] = useState("");
  const debouncedQuotationSearch = useDebounce(quotationSearch, 500);
  const [showQuotationDropdown, setShowQuotationDropdown] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // API Hooks
  const { data: clientsResponse, isLoading, refetch } = useGetClientsQuery({
    search: searchTerm,
    status: filterStatus,
    industry: filterIndustry !== "all" ? filterIndustry : undefined,
    source: filterSource !== "all" ? filterSource : undefined
  });
  // Dynamic search for quotations with higher limit
  const { data: quotationsResponse } = useGetQuotationsQuery({
    status: 'Approved',
    search: debouncedQuotationSearch,
    limit: 50
  });
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient(clientToDelete).unwrap();
      toast.success("Client deleted successfully");
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete client");
      console.error(error);
    }
  };

  const clients = clientsResponse?.data || [];

  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    birthday: "",
    source: "",
    orgName: "",
    orgEmail: "",
    orgPhone: "",
    industry: "",
    website: "",
    employees: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    notes: "",
    status: "active"
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // Reset dependent fields
      ...(name === "permanentCountry" && {
        permanentState: "",
        permanentCity: "",
      }),

      ...(name === "permanentState" && {
        permanentCity: "",
      }),
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
    setClientType("person");
    setSelectedQuotation(null);
    setShowAddModal(true);
  };

  const handleSelectQuotation = (q) => {
    setSelectedQuotation(q);
    const names = (q.client_name || "").split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    setFormData(prev => ({
      ...prev,
      firstName,
      lastName,
      email: q.email || "",
      phone: q.phone || "",
      company: q.company_name || "",
      orgName: q.company_name || "",
      orgEmail: q.email || "",
      orgPhone: q.phone || "",
      notes: q.notes || ""
    }));
    setQuotationSearch("");
    setShowQuotationDropdown(false);
  };

  const openEditModal = (client) => {
    setIsEditing(true);
    setEditingId(client.id);
    setClientType(client.type);

    setFormData({
      firstName: client.first_name || "",
      lastName: client.last_name || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company_name || "",
      position: client.position || "",
      birthday: client.birthday ? client.birthday.split('T')[0] : "",
      source: client.source || "",
      orgName: client.company_name || "",
      orgEmail: client.email || "",
      orgPhone: client.phone || "",
      industry: client.industry || "",
      website: client.website || "",
      employees: client.number_of_employees || "",
      taxId: client.tax_id || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      zipCode: client.zip_code || "",
      country: client.country || "",
      notes: client.notes || "",
      status: client.status || "active"
    });
    setShowAddModal(true);
  };

  const openDeleteModal = (id) => {
    setClientToDelete(id);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (client) => {
    setClientToView(client);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: clientType,
        first_name: clientType === 'person' ? formData.firstName : null,
        last_name: clientType === 'person' ? formData.lastName : null,
        email: clientType === 'person' ? formData.email : formData.orgEmail,
        phone: clientType === 'person' ? formData.phone : formData.orgPhone,
        company_name: clientType === 'person' ? formData.company : formData.orgName,
        position: formData.position,
        birthday: formData.birthday || null,
        source: formData.source,
        industry: formData.industry,
        website: formData.website,
        number_of_employees: formData.employees || null,
        tax_id: formData.taxId,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        notes: formData.notes,
        status: formData.status
      };

      if (isEditing) {
        await updateClient({ id: editingId, ...payload }).unwrap();
        toast.success("Client updated successfully");
      } else {
        await createClient(payload).unwrap();
        toast.success("Client created successfully");
      }
      setShowAddModal(false);
      setFormData(initialFormState);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Failed to update client" : "Failed to create client");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const toggleClientSelection = (clientId) => {
    setSelectedClients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedClients(new Set(clients.map((c) => c.id)));
  };

  const deselectAll = () => {
    setSelectedClients(new Set());
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  // Mock value just to show something nice
  const totalValue = "₹" + (clients.length * 4.5).toFixed(1) + "L";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        {/* Header */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">
                  All Clients
                </h1>
                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-2 font-bold capitalize tracking-wider">
                  <FiHome className="text-gray-400" size={12} />
                  <span>CRM</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-[#FF7B1D]">
                    All Clients
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                {/* <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-sm text-sm w-64 focus:border-[#FF7B1D] focus:ring-1 focus:ring-[#FF7B1D] outline-none pl-10 bg-white hover:border-gray-300 transition-all font-semibold text-gray-700"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                </div> */}

                {/* Filter Button & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setTempFilterStatus(filterStatus);
                      setTempFilterIndustry(filterIndustry);
                      setTempFilterSource(filterSource);
                      setIsFilterOpen(!isFilterOpen);
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || filterStatus !== "all" || filterIndustry !== "all" || filterSource !== "all"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    title="Filters"
                  >
                    {isFilterOpen || filterStatus !== "all" ? <Filter size={18} /> : <Filter size={18} />}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center text-black">
                        <span className="text-sm font-bold capitalize">Filter Options</span>
                        <button
                          onClick={() => {
                            setTempFilterStatus("all");
                            setTempFilterIndustry("all");
                            setTempFilterSource("all");
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-tighter"
                        >
                          Reset All
                        </button>
                      </div>

                      <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Status Filter */}
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                            Status
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {["all", "active", "inactive"].map((status) => (
                              <label key={status} className="flex items-center group cursor-pointer bg-gray-50 px-3 py-2 rounded-sm border border-transparent hover:border-gray-200 transition-all">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="status_filter"
                                    checked={tempFilterStatus === status}
                                    onChange={() => setTempFilterStatus(status)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-2 text-xs font-bold transition-colors capitalize ${tempFilterStatus === status ? "text-[#FF7B1D]" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {status}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Industry Filter */}
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                            Industry
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {["all", "technology", "healthcare", "finance", "manufacturing", "retail", "education", "other"].map((ind) => (
                              <label key={ind} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="industry_filter"
                                    checked={tempFilterIndustry === ind}
                                    onChange={() => setTempFilterIndustry(ind)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-2 text-xs font-bold transition-colors capitalize ${tempFilterIndustry === ind ? "text-[#FF7B1D]" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {ind}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Source Filter */}
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">
                            Source
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {["all", "website", "referral", "social", "cold-call", "event"].map((src) => (
                              <label key={src} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="source_filter"
                                    checked={tempFilterSource === src}
                                    onChange={() => setTempFilterSource(src)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-2 text-xs font-bold transition-colors capitalize ${tempFilterSource === src ? "text-[#FF7B1D]" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {src}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setFilterStatus(tempFilterStatus);
                            setFilterIndustry(tempFilterIndustry);
                            setFilterSource(tempFilterSource);
                            setIsFilterOpen(false);
                          }}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-sm border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "table"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Export Button */}
                {/* <button
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-sm text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm capitalize tracking-wider"
                >
                  <Download size={18} className="text-[#FF7B1D]" />
                  Export
                </button> */}

                {/* Add Client Button */}
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm text-sm font-bold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 capitalize tracking-wider"
                >
                  <Plus size={20} />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-8xl mx-auto px-4 pb-4 pt-2 mt-0 font-primary w-full flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <NumberCard
              title="Total Clients"
              number={totalClients}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Active Clients"
              number={activeClients}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Inactive Clients"
              number={inactiveClients}
              icon={<Clock className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Pipeline Value"
              number={totalValue}
              icon={<DollarSign className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          {selectedClients.size > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="bg-white px-4 py-1.5 rounded-full border border-orange-300 shadow-sm">
                  <span className="text-orange-700 font-bold text-sm">
                    {selectedClients.size} Selected
                  </span>
                </div>
                <button
                  onClick={deselectAll}
                  className="text-sm text-gray-600 hover:text-orange-600 font-medium underline transition-colors"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-semibold text-sm shadow-sm">
                  <Mail size={16} />
                  Email Selected
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-semibold text-sm shadow-sm">
                  <Download size={16} />
                  Export Selected
                </button>
                <button
                  onClick={openBulkDeleteModal}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold text-sm shadow-md"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Bulk Selection Bar */}
          <div className="bg-white border border-gray-200 rounded-sm p-3 mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  clients.length > 0 &&
                  selectedClients.size === clients.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    selectAll();
                  } else {
                    deselectAll();
                  }
                }}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600">
                Select All
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                Displaying {clients.length} results
              </span>
            </div>
          </div>

          {/* Client Cards Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 pb-12">
                  {clients.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Clients Found</h3>
                      <p className="text-gray-500 mb-6">Get started by adding your first client.</p>
                      <button onClick={openAddModal} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-sm transition-colors">
                        Add New Client
                      </button>
                    </div>
                  ) : (
                    clients.map((client) => {
                      const isSelected = selectedClients.has(client.id);
                      return (
                        <div
                          key={client.id}
                          className={`bg-white rounded-sm border transition-all duration-300 group hover:shadow-lg flex flex-col min-h-[400px] ${isSelected
                            ? "border-orange-400 shadow-lg bg-orange-50/10 ring-1 ring-orange-200"
                            : "border-gray-200 hover:border-orange-300"
                            }`}
                        >
                          <div className="p-6 flex flex-col flex-1">
                            {/* Selection Checkbox - Top Right */}
                            <div className="absolute top-4 right-4 z-10">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleClientSelection(client.id)}
                                className="w-5 h-5 text-orange-600 border-2 border-gray-300 rounded-lg focus:ring-orange-500 cursor-pointer hover:border-orange-400 transition-colors"
                              />
                            </div>

                            {/* Header Section */}
                            <div className="flex items-start gap-4 mb-6">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${client.type === "person"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : "bg-purple-50 text-purple-600 border border-purple-100"
                                  }`}
                              >
                                {client.type === "person" ? <User size={32} /> : <Building2 size={32} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 truncate">
                                  {client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <span className={`px-3 py-1 rounded-sm text-xs font-bold capitalize tracking-wide border ${getStatusColor(client.status)}`}>
                                    {client.status || 'Active'}
                                  </span>
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs font-semibold border border-gray-200 capitalize">
                                    {client.type}
                                  </span>
                                </div>
                                {client.industry && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Briefcase size={14} className="text-gray-400" />
                                    <span className="font-medium">{client.industry}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4 mb-6 flex-1">
                              {client.email && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group/item">
                                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/item:bg-orange-100 transition-colors">
                                    <Mail size={16} className="text-gray-500 group-hover/item:text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{client.email}</p>
                                    <p className="text-xs text-gray-500">Email</p>
                                  </div>
                                </div>
                              )}

                              {client.phone && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group/item">
                                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/item:bg-orange-100 transition-colors">
                                    <Phone size={16} className="text-gray-500 group-hover/item:text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{client.phone}</p>
                                    <p className="text-xs text-gray-500">Phone</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group/item">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/item:bg-orange-100 transition-colors">
                                  {client.type === 'person' ? <Building2 size={16} className="text-gray-500 group-hover/item:text-orange-600" /> : <Users size={16} className="text-gray-500 group-hover/item:text-orange-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {client.type === 'person' ? (client.company_name || 'Individual') : `${client.number_of_employees || 0} Employees`}
                                  </p>
                                  <p className="text-xs text-gray-500">{client.type === 'person' ? 'Company' : 'Team Size'}</p>
                                </div>
                              </div>

                              {client.city && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group/item">
                                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/item:bg-orange-100 transition-colors">
                                    <MapPin size={16} className="text-gray-500 group-hover/item:text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {client.city}{client.state ? `, ${client.state}` : ''}{client.country ? `, ${client.country}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-500">Location</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="mt-auto bg-gray-100 -mx-6 -mb-6 px-6 py-4 rounded-b-sm border-t border-gray-200">
                              {/* Stats Info - Matching AllToDo Design */}
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex flex-col items-center flex-1 border-r border-gray-300">
                                  <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide">Invoices</p>
                                  <p className="text-sm font-bold text-gray-700 mt-1">₹ 0</p>
                                </div>
                                <div className="flex flex-col items-center flex-1">
                                  <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide">Status</p>
                                  <p className={`text-sm font-black mt-1 capitalize ${client.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                                    {client.status || 'Active'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                {/* Primary Actions Row */}
                                <div className="flex items-center gap-2 flex-1">
                                  <button
                                    onClick={() => openViewModal(client)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-sm transition-all font-bold text-xs uppercase tracking-widest border border-blue-100 shadow-sm flex-1 min-h-[44px]"
                                  >
                                    <Eye size={16} />
                                    <span className="hidden sm:inline">View</span>
                                    <span className="sm:hidden">View</span>
                                  </button>
                                  <button
                                    onClick={() => navigate('/additional/invoice', { state: { client } })}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-sm transition-all font-bold text-xs uppercase tracking-widest border border-orange-100 shadow-sm flex-1 min-h-[44px]"
                                  >
                                    <FileText size={16} />
                                    <span className="hidden sm:inline">Invoice</span>
                                    <span className="sm:hidden">Invoice</span>
                                  </button>
                                </div>

                                {/* Secondary Actions */}
                                <div className="flex items-center justify-center gap-1 sm:gap-2 border-l border-gray-300 pl-3 ml-0 sm:ml-2">
                                  <button
                                    onClick={() => openEditModal(client)}
                                    className="p-2.5 text-green-600 hover:bg-green-50 rounded-sm transition-all hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white shadow-sm border border-green-100"
                                    title="Edit Client"
                                  >
                                    <SquarePen size={18} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(client.id)}
                                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-sm transition-all hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white shadow-sm border border-red-100"
                                    title="Delete Client"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                          <th className="py-3 px-4 font-semibold text-left w-[25%]">Client Name</th>
                          <th className="py-3 px-4 font-semibold text-left w-[20%]">Contact</th>
                          <th className="py-3 px-4 font-semibold text-left w-[10%]">Type</th>
                          <th className="py-3 px-4 font-semibold text-left w-[15%]">Status</th>
                          {/* <th className="py-3 px-4 font-semibold text-left w-[20%]">Location</th> */}
                          <th className="py-3 px-4 font-semibold text-right w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {clients.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-16 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <User className="w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-lg font-semibold">No Clients Found</p>
                                <button onClick={openAddModal} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-sm text-sm font-bold hover:bg-orange-600 transition">
                                  Add First Client
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          clients.map((client, idx) => (
                            <tr key={client.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-orange-50/50 transition-colors group`}>
                              <td className="py-3 px-4 text-left">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${client.type === 'person' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {client.type === 'person' ? 'P' : 'C'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 capitalize">
                                      {client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name}
                                    </p>
                                    {client.company_name && client.type === 'person' && (
                                      <p className="text-xs text-gray-500 capitalize">{client.company_name}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-left">
                                <div className="space-y-0.5">
                                  {client.email && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                      <Mail size={12} className="text-gray-400" />
                                      <span className="truncate max-w-[150px]" title={client.email}>{client.email}</span>
                                    </div>
                                  )}
                                  {client.phone && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                      <Phone size={12} className="text-gray-400" />
                                      <span>{client.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-left">
                                <span className={`px-2 py-1 rounded-sm text-xs font-bold capitalize ${client.type === 'person' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                                  {client.type}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-left">
                                <span className={`px-2 py-1 rounded-sm text-xs font-bold capitalize border ${getStatusColor(client.status)}`}>
                                  {client.status}
                                </span>
                              </td>
                              {/* <td className="py-3 px-4 text-left">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <MapPin size={12} className="text-gray-400" />
                                  <span className="truncate max-w-[150px] capitalize">
                                    {client.city}{client.state ? `, ${client.state}` : ''}
                                  </span>
                                </div>
                              </td> */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => openViewModal(client)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all" title="View">
                                    <Eye size={16} />
                                  </button>
                                  <button onClick={() => navigate('/additional/invoice', { state: { client } })} className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-sm transition-all" title="Invoice">
                                    <FileText size={16} />
                                  </button>
                                  <button onClick={() => openEditModal(client)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all" title="Edit">
                                    <SquarePen size={16} />
                                  </button>
                                  <button onClick={() => openDeleteModal(client.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all" title="Delete">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add/Edit Client Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100 animate-slideUp">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
                  {isEditing ? "Edit Client" : "Add New Client"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all hover:rotate-90"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-90px)] custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-8">
                  {/* Quotation Selection (New) */}
                  {!isEditing && (
                    <div className="mb-10 bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <FileCheck className="text-orange-600" size={24} />
                        <h3 className="text-lg font-bold text-orange-800">Import from Approved Quotation</h3>
                      </div>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={quotationSearch}
                            onChange={(e) => {
                              setQuotationSearch(e.target.value);
                              setShowQuotationDropdown(true);
                            }}
                            onFocus={() => setShowQuotationDropdown(true)}
                            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all pr-10 bg-white"
                            placeholder="Search by Quotation ID or Client Name..."
                          />
                          <Search className="absolute right-3 top-3.5 text-orange-400" size={20} />
                        </div>

                        {showQuotationDropdown && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                            {(quotationsResponse?.quotations || []).map(q => (
                              <div
                                key={q.id}
                                onClick={() => handleSelectQuotation(q)}
                                className="p-4 hover:bg-orange-50 cursor-pointer border-b last:border-0 transition-colors"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[#FF7B1D] font-black text-sm">{q.quotation_id}</span>
                                  <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">₹{q.total_amount.toLocaleString()}</span>
                                </div>
                                <div className="text-sm font-bold text-gray-900">{q.client_name}</div>
                                <div className="text-[10px] text-gray-500 font-medium">{new Date(q.quotation_date).toLocaleDateString()}</div>
                              </div>
                            ))}
                            {quotationsResponse?.quotations?.length === 0 && (
                              <div className="p-4 text-center text-gray-500 text-sm">No approved quotations found</div>
                            )}
                          </div>
                        )}
                      </div>
                      {selectedQuotation && (
                        <div className="mt-4 flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="text-green-500" size={16} />
                            <span className="text-sm font-bold text-gray-700">Selected: <span className="text-orange-600">{selectedQuotation.quotation_id}</span></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedQuotation(null)}
                            className="text-xs text-red-500 font-bold hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                      <p className="mt-2 text-[11px] text-orange-600 font-bold italic">* Selecting a quotation will pre-fill this form for quick client creation.</p>
                    </div>
                  )}
                  {/* Client Type Selection */}
                  {!isEditing && (
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-4 capitalize tracking-wider">
                        Client Type
                      </label>
                      <div className="flex gap-4">
                        <label
                          className={`flex items-center gap-4 flex-1 p-4 border rounded-sm cursor-pointer transition-all ${clientType === "person" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <input
                            type="radio"
                            name="clientType"
                            value="person"
                            checked={clientType === "person"}
                            onChange={(e) => setClientType(e.target.value)}
                            className="hidden" // Hiding default radio
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${clientType === "person" ? "border-orange-500" : "border-gray-300"}`}>
                            {clientType === "person" && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                          </div>

                          <div
                            className={`p-3 rounded-sm ${clientType === "person"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            <User size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">Person</div>
                            <div className="text-xs text-gray-500">
                              Individual client account
                            </div>
                          </div>
                        </label>
                        <label
                          className={`flex items-center gap-4 flex-1 p-4 border rounded-sm cursor-pointer transition-all ${clientType === "organization" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <input
                            type="radio"
                            name="clientType"
                            value="organization"
                            checked={clientType === "organization"}
                            onChange={(e) => setClientType(e.target.value)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${clientType === "organization" ? "border-orange-500" : "border-gray-300"}`}>
                            {clientType === "organization" && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                          </div>

                          <div
                            className={`p-3 rounded-sm ${clientType === "organization"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            <Building2 size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              Organization
                            </div>
                            <div className="text-xs text-gray-500">
                              Corporate/Company account
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Person Form */}
                  {clientType === "person" && (
                    <div className="animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
                        <User className="text-orange-500" size={20} /> Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><User size={14} className="text-orange-500" /> First Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            required
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><User size={14} className="text-orange-500" /> Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            placeholder="Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Mail size={14} className="text-orange-500" /> Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Phone size={14} className="text-orange-500" /> Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Building2 size={14} className="text-orange-500" /> Company (if any)</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            placeholder="Workplace name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> Birthday</label>
                          <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Organization Form */}
                  {clientType === "organization" && (
                    <div className="animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
                        <Building2 className="text-orange-500" size={20} /> Organization Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Building2 size={14} className="text-orange-500" /> Organization Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="orgName"
                            value={formData.orgName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            required
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Mail size={14} className="text-orange-500" /> Work Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="orgEmail"
                            value={formData.orgEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            required
                            placeholder="contact@acme.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Phone size={14} className="text-orange-500" /> Work Phone <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            name="orgPhone"
                            value={formData.orgPhone}
                            placeholder="+1 234 567 890"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Globe size={14} className="text-orange-500" /> Website</label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Users size={14} className="text-orange-500" /> Employees</label>
                          <input
                            type="number"
                            name="employees"
                            value={formData.employees}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all font-semibold text-gray-700 bg-white"
                            placeholder="e.g. 50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common Fields */}
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
                      <MapPin className="text-orange-500" size={20} /> Communication & Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Briefcase size={14} className="text-orange-500" /> Category / Industry</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 bg-white cursor-pointer outline-none font-semibold text-gray-700"
                        >
                          <option value="">Select industry</option>
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="retail">Retail</option>
                          <option value="education">Education</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Globe size={14} className="text-orange-500" /> Source</label>
                        <select
                          name="source"
                          value={formData.source}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 cursor-pointer outline-none bg-white font-semibold text-gray-700"
                        >
                          <option value="">Select source</option>
                          <option value="website">Website</option>
                          <option value="referral">Referral</option>
                          <option value="social">Social Media</option>
                          <option value="cold-call">Cold Call</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><FileText size={14} className="text-orange-500" /> Tax ID / GSTIN</label>
                        <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none font-semibold text-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><CheckCircle size={14} className="text-orange-500" /> Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none bg-white font-semibold text-gray-700">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> Street Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none font-semibold text-gray-700"
                          placeholder="123 Main St..."
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        {/* Country */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Country</label>

                          <div className="relative">
                            <select
                              name="permanentCountry"
                              value={formData.permanentCountry || ""}
                              onChange={handlePermanentAddressChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            >
                              <option value="">Select Country</option>

                              {Country.getAllCountries().map((country) => (
                                <option key={country.isoCode} value={country.isoCode}>
                                  {country.name}
                                </option>
                              ))}
                            </select>

                            <ChevronDown
                              size={18}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">State</label>

                          <div className="relative">
                            <select
                              name="permanentState"
                              value={formData.permanentState || ""}
                              onChange={handlePermanentAddressChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            >
                              <option value="">Select State</option>

                              {State.getStatesOfCountry(formData.permanentCountry || "")?.map(
                                (state) => (
                                  <option key={state.isoCode} value={state.isoCode}>
                                    {state.name}
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown
                              size={18}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">City</label>

                          <div className="relative">
                            <select
                              name="permanentCity"
                              value={formData.permanentCity || ""}
                              onChange={handlePermanentAddressChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            >
                              <option value="">Select City</option>

                              {City.getCitiesOfState(
                                formData.permanentCountry || "",
                                formData.permanentState || ""
                              )?.map((city) => (
                                <option key={city.name} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>

                            <ChevronDown
                              size={18}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                          </div>
                        </div>

                        {/* Zip Code */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Zip Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-semibold text-gray-700">Internal Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Any private notes about this client..." />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end gap-4 p-4 border-t bg-gray-50 rounded-b-lg -mx-8 -mb-8">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-white transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(isCreating || isUpdating) && <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>}
                      {isEditing ? "Update Client" : "Create Client"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          headerVariant="simple"
          maxWidth="max-w-md"
          footer={
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs uppercase tracking-widest"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={20} />
                )}
                {isDeleting ? "Deleting..." : "Delete Now"}
              </button>
            </div>
          }
        >
          <div className="flex flex-col items-center text-center text-black font-primary">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={48} className="text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-2 leading-relaxed">
              Are you sure you want to delete this client?
            </p>

            <p className="text-xs text-red-500 italic">
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>
        </Modal>

        {/* View Client Modal */}
        <ViewClientModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          client={clientToView}
        />
      </div>
    </DashboardLayout>
  );
}


