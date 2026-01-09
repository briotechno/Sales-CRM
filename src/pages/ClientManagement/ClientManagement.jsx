import React, { useState } from "react";
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
  FileCheck
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../../store/api/clientApi";
import { useGetQuotationsQuery } from "../../store/api/quotationApi";
import { toast } from "react-hot-toast";
import DeleteClientModal from "../../components/Client/DeleteClientModal";
import ViewClientModal from "../../components/Client/ViewClientModal";
import { useDebounce } from "../../hooks/useDebounce";

export default function AllClientPage() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clientType, setClientType] = useState("person");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClients, setSelectedClients] = useState(new Set());

  // New Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null); // ID for single delete
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [clientToView, setClientToView] = useState(null);

  // Quotation Selection State
  const [quotationSearch, setQuotationSearch] = useState("");
  const debouncedQuotationSearch = useDebounce(quotationSearch, 500);
  const [showQuotationDropdown, setShowQuotationDropdown] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // API Hooks
  const { data: clientsResponse, isLoading, refetch } = useGetClientsQuery({ search: searchTerm, status: filterStatus });
  // Dynamic search for quotations with higher limit
  const { data: quotationsResponse } = useGetQuotationsQuery({
    status: 'Approved',
    search: debouncedQuotationSearch,
    limit: 50
  });
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

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
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* Header */}
        <div className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  All Clients
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  CRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Clients
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border rounded-full text-sm w-64 focus:ring-2 focus:ring-orange-500 outline-none pl-10 bg-gray-50 hover:bg-white transition-colors"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-5 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 font-medium text-gray-700 text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <button className="flex items-center gap-2 px-5 py-2.5 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all font-medium text-gray-700 text-sm">
                    <Filter size={16} />
                    Filters
                  </button>

                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg font-medium text-sm">
                    <Download size={16} />
                    Export
                  </button>
                </div>

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-medium text-sm"
                >
                  <Plus size={18} />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-0 py-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6 px-6">
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

          {/* Selection Actions Bar */}
          {selectedClients.size > 0 && (
            <div className="mx-6 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6 flex items-center justify-between animate-fadeIn">
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
          <div className="bg-white border border-gray-200 rounded-sm p-3 mb-6 mx-6 flex items-center justify-between shadow-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 px-6 pb-12">
              {clients.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No Clients Found</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first client.</p>
                  <button onClick={openAddModal} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-sm transition-colors">
                    Add New Client
                  </button>
                </div>
              ) : clients.map((client) => {
                const isSelected = selectedClients.has(client.id);
                return (
                  <div
                    key={client.id}
                    className={`bg-white rounded-2xl border-2 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col min-h-[400px] ${
                      isSelected
                        ? "border-orange-400 shadow-lg bg-gradient-to-br from-orange-50 to-white ring-2 ring-orange-200"
                        : "border-gray-100 hover:border-orange-300"
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
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                            client.type === "person"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200"
                              : "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200"
                            }`}
                        >
                          {client.type === "person" ? <User size={32} /> : <Building2 size={32} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 truncate">
                            {client.type === 'person' ? `${client.first_name} ${client.last_name || ''}` : client.company_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-2 ${getStatusColor(client.status)}`}>
                              {client.status || 'Active'}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200 capitalize">
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

                      {/* Action Buttons - Fixed at Bottom */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                          {/* Primary Actions Row */}
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              onClick={() => openViewModal(client)}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all font-medium text-sm border border-transparent hover:border-orange-200 flex-1 min-h-[44px]"
                            >
                              <Eye size={16} />
                              <span className="hidden sm:inline">View Details</span>
                              <span className="sm:hidden">View</span>
                            </button>
                            <button
                              onClick={() => navigate('/additional/invoice', { state: { client } })}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all font-semibold text-sm hover:scale-105 active:scale-95 flex-1 min-h-[44px]"
                            >
                              <FileText size={16} />
                              <span className="hidden sm:inline">Generate Invoice</span>
                              <span className="sm:hidden">Invoice</span>
                            </button>
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex items-center justify-center gap-1 sm:gap-2 border-l border-gray-200 pl-3 ml-0 sm:ml-2">
                            <button
                              onClick={() => openEditModal(client)}
                              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
                              title="Edit Client"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(client.id)}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              })}
            </div>
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
                      <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                        Client Type
                      </label>
                      <div className="flex gap-4">
                        <label
                          className={`flex items-center gap-4 flex-1 p-4 border rounded-xl cursor-pointer transition-all ${clientType === "person" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}
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
                            className={`p-3 rounded-lg ${clientType === "person"
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
                          className={`flex items-center gap-4 flex-1 p-4 border rounded-xl cursor-pointer transition-all ${clientType === "organization" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}
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
                            className={`p-3 rounded-lg ${clientType === "organization"
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
                          <label className="text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            required
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            placeholder="Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Company (if any)</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            placeholder="Workplace name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Birthday</label>
                          <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
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
                          <label className="text-sm font-semibold text-gray-700">Organization Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="orgName"
                            value={formData.orgName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            required
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Work Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="orgEmail"
                            value={formData.orgEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            required
                            placeholder="contact@acme.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Work Phone <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            name="orgPhone"
                            value={formData.orgPhone}
                            placeholder="+1 234 567 890"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Website</label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Employees</label>
                          <input
                            type="number"
                            name="employees"
                            value={formData.employees}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
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
                        <label className="text-sm font-semibold text-gray-700">Category / Industry</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white cursor-pointer outline-none"
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
                        <label className="text-sm font-semibold text-gray-700">Source</label>
                        <select
                          name="source"
                          value={formData.source}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer outline-none bg-white"
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
                        <label className="text-sm font-semibold text-gray-700">Tax ID / GSTIN</label>
                        <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Street Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          placeholder="123 Main St..."
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">City</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">State</label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Zip Code</label>
                          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Country</label>
                          <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
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
        <DeleteClientModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          clientId={clientToDelete}
          clientIds={Array.from(selectedClients)}
          isBulk={isBulkDelete}
          refetchData={refetch}
          onClearSelection={deselectAll}
        />

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


