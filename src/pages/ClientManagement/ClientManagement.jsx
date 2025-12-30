import React, { useState } from "react";
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
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function AllClientPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientType, setClientType] = useState("person");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClients, setSelectedClients] = useState(new Set());

  // Sample client data
  const [clients, setClients] = useState([
    {
      id: 1,
      type: "person",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+91 98765-43210",
      company: "Tech Corp",
      status: "active",
      value: "₹4,50,000",
      lastContact: "2024-11-15",
      nextFollowUp: "2024-11-20",
      deals: 3,
      source: "Website",
    },
    {
      id: 2,
      type: "organization",
      name: "Acme Industries",
      email: "contact@acme.com",
      phone: "+91 99887-76655",
      industry: "Manufacturing",
      status: "active",
      value: "₹12,50,000",
      lastContact: "2024-11-18",
      nextFollowUp: "2024-11-22",
      deals: 7,
      employees: 250,
    },
    {
      id: 3,
      type: "person",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+91 97654-32109",
      company: "Design Studio",
      status: "inactive",
      value: "₹1,20,000",
      lastContact: "2024-10-30",
      nextFollowUp: "2024-11-25",
      deals: 1,
      source: "Referral",
    },
    {
      id: 4,
      type: "organization",
      name: "Global Solutions Inc",
      email: "info@globalsol.com",
      phone: "+91 98888-77777",
      industry: "Technology",
      status: "pending",
      value: "₹8,75,000",
      lastContact: "2024-11-19",
      nextFollowUp: "2024-11-24",
      deals: 5,
      employees: 150,
    },
    {
      id: 5,
      type: "person",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+91 96543-21098",
      company: "Creative Agency",
      status: "active",
      value: "₹3,20,000",
      lastContact: "2024-11-20",
      nextFollowUp: "2024-11-23",
      deals: 2,
      source: "Social Media",
    },
    {
      id: 6,
      type: "person",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+91 95432-10987",
      company: "Marketing Pro",
      status: "pending",
      value: "₹2,80,000",
      lastContact: "2024-11-17",
      nextFollowUp: "2024-11-26",
      deals: 4,
      source: "Referral",
    },
  ]);

  const [formData, setFormData] = useState({
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
    contractValue: "",
    contractStart: "",
    contractEnd: "",
    paymentTerms: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    setFormData({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "inactive":
        return "bg-gray-50 text-gray-600 border border-gray-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
    setSelectedClients(new Set(filteredClients.map((c) => c.id)));
  };

  const deselectAll = () => {
    setSelectedClients(new Set());
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* Header */}
        <div className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: Title + Breadcrumb */}
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

              {/* Right section */}
              <div className="flex items-center gap-4">
                {/* Filters moved to the right side */}
                <div className="flex items-center gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-5 py-3 border border-orange-200 rounded-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium text-gray-700"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>

                  <button className="flex items-center gap-2 px-5 py-3 border border-orange-200 rounded-sm hover:bg-orange-50 transition-all font-medium text-gray-700">
                    <Filter size={20} />
                    Filters
                  </button>

                  <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl font-medium">
                    <Download size={20} />
                    Export
                  </button>
                </div>

                {/* Add Client Button (right-most) */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <Plus size={20} />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-0 py-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

            <NumberCard
              title="Total Clients"
              number={"248"}
              up={
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <TrendingUp size={12} />
                  +12% this month
                </span>
              }
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Active Clients"
              number={"186"}
              up={"75% of total"}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Inactive Clients"
              number={"18"}
              up={"7% of total"}
              icon={<Clock className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Total Value"
              number={"₹1.2Cr"}
              up={
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <TrendingUp size={12} />
                  +8.5% growth
                </span>
              }
              icon={<DollarSign className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />

          </div>

          {/* Selection Actions Bar */}
          {selectedClients.size > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-4 mb-6 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-white px-4 py-2 rounded-full border-2 border-orange-400 shadow-sm">
                  <span className="text-orange-700 font-bold text-sm">
                    {selectedClients.size} Selected
                  </span>
                </div>
                <button
                  onClick={deselectAll}
                  className="text-sm text-gray-700 hover:text-orange-600 font-medium underline"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-semibold shadow-sm">
                  <Mail size={18} />
                  Email Selected
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-semibold shadow-sm">
                  <Download size={18} />
                  Export Selected
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold shadow-md">
                  <Trash2 size={18} />
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Bulk Selection Bar */}
          <div className="bg-white border border-orange-100 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={
                  filteredClients.length > 0 &&
                  selectedClients.size === filteredClients.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    selectAll();
                  } else {
                    deselectAll();
                  }
                }}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All Clients
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Showing {filteredClients.length} of {clients.length} clients
              </span>
            </div>
          </div>

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`bg-white rounded-lg border-2 p-6 relative transition-all hover:shadow-xl ${selectedClients.has(client.id)
                  ? "border-orange-400 shadow-lg bg-orange-50"
                  : "border-orange-100 hover:border-orange-200"
                  }`}
              >
                {/* Checkbox in top-right corner */}
                <div className="absolute top-5 right-5 z-10">
                  <input
                    type="checkbox"
                    checked={selectedClients.has(client.id)}
                    onChange={() => toggleClientSelection(client.id)}
                    className="w-6 h-6 text-orange-600 border-2 border-orange-300 rounded-md focus:ring-orange-500 focus:ring-2 cursor-pointer shadow-sm"
                  />
                </div>

                <div className="flex items-start justify-between pr-10">
                  <div className="flex items-start gap-5 flex-1">
                    <div
                      className={`p-4 rounded-2xl shadow-lg ${client.type === "person"
                        ? "bg-gradient-to-br from-blue-400 to-blue-500"
                        : "bg-gradient-to-br from-purple-400 to-purple-500"
                        }`}
                    >
                      {client.type === "person" ? (
                        <User className="text-white" size={28} />
                      ) : (
                        <Building2 className="text-white" size={28} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          {client.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            client.status
                          )}`}
                        >
                          {client.status.charAt(0).toUpperCase() +
                            client.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                          {client.type === "person" ? "Person" : "Organization"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <Mail size={16} className="text-orange-500" />
                          </div>
                          <span className="font-medium">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <Phone size={16} className="text-orange-500" />
                          </div>
                          <span className="font-medium">{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="bg-orange-50 p-2 rounded-lg">
                            {client.type === "person" ? (
                              <Building2
                                size={16}
                                className="text-orange-500"
                              />
                            ) : (
                              <User size={16} className="text-orange-500" />
                            )}
                          </div>
                          <span className="font-medium">
                            {client.type === "person"
                              ? client.company
                              : `${client.employees} employees`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm bg-gradient-to-r from-orange-50 to-transparent p-3 rounded-xl flex-wrap">
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-green-600" />
                          <span className="font-bold text-green-700 text-base">
                            {client.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="font-medium">
                            Last: {client.lastContact}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-700 font-semibold bg-orange-100 px-3 py-1 rounded-full">
                          <AlertCircle size={16} />
                          Next: {client.nextFollowUp}
                        </div>
                        <div className="text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full">
                          {client.deals} active deals
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-0 mt-4 justify-end border-t border-orange-100 pt-4">
                  <button className="p-3 text-orange-600 hover:bg-orange-50 rounded-sm transition-all">
                    <Eye size={18} />
                  </button>
                  <button className="p-3 text-orange-600 hover:bg-orange-50 rounded-sm transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-3 text-red-600 hover:bg-red-50 rounded-sm transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Client Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2 border-orange-200">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Add New Client
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

              <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                <form onSubmit={handleSubmit} className="p-8">
                  {/* Client Type Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-800 mb-4">
                      Client Type *
                    </label>
                    <div className="flex gap-4">
                      <label
                        className="flex items-center gap-4 flex-1 p-5 border-2 rounded-2xl cursor-pointer transition-all hover:bg-orange-50"
                        style={{
                          borderColor:
                            clientType === "person" ? "#f97316" : "#e5e7eb",
                          backgroundColor:
                            clientType === "person" ? "#fff7ed" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          name="clientType"
                          value="person"
                          checked={clientType === "person"}
                          onChange={(e) => setClientType(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div
                          className={`p-3 rounded-xl ${clientType === "person"
                            ? "bg-gradient-to-br from-blue-400 to-blue-500"
                            : "bg-gray-200"
                            }`}
                        >
                          <User
                            size={24}
                            className={
                              clientType === "person"
                                ? "text-white"
                                : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Person</div>
                          <div className="text-sm text-gray-600">
                            Individual client
                          </div>
                        </div>
                      </label>
                      <label
                        className="flex items-center gap-4 flex-1 p-5 border-2 rounded-2xl cursor-pointer transition-all hover:bg-orange-50"
                        style={{
                          borderColor:
                            clientType === "organization"
                              ? "#f97316"
                              : "#e5e7eb",
                          backgroundColor:
                            clientType === "organization" ? "#fff7ed" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          name="clientType"
                          value="organization"
                          checked={clientType === "organization"}
                          onChange={(e) => setClientType(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div
                          className={`p-3 rounded-xl ${clientType === "organization"
                            ? "bg-gradient-to-br from-purple-400 to-purple-500"
                            : "bg-gray-200"
                            }`}
                        >
                          <Building2
                            size={24}
                            className={
                              clientType === "organization"
                                ? "text-white"
                                : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            Organization
                          </div>
                          <div className="text-sm text-gray-600">
                            Company client
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Person Form */}
                  {clientType === "person" && (
                    <>
                      <div className="pt-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                          <div className="bg-orange-100 p-3 rounded-xl shadow-sm">
                            <User className="text-orange-600" size={20} />
                          </div>
                          <span className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] bg-clip-text text-transparent">
                            Personal Information
                          </span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="group">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] 
                       transition-all outline-none hover:border-gray-300 shadow-sm"
                              required
                            />
                          </div>

                          <div className="group">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              Birthday
                            </label>
                            <input
                              type="date"
                              name="birthday"
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] 
                       transition-all outline-none hover:border-gray-300 shadow-sm"
                            />
                          </div>

                          <div className="group">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              Source
                            </label>
                            <div className="relative">
                              <select
                                name="source"
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] 
                         transition-all outline-none cursor-pointer
                         hover:border-gray-300 shadow-sm appearance-none bg-white"
                              >
                                <option value="">Select source</option>
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="social">Social Media</option>
                                <option value="cold-call">Cold Call</option>
                                <option value="event">Event</option>
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Organization Form */}
                  {clientType === "organization" && (
                    <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] p-2 rounded-lg text-white shadow-sm">
                          <Building2 size={20} />
                        </div>
                        Organization Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Organization Name *
                          </label>
                          <input
                            type="text"
                            name="orgName"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 transition-all outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="orgEmail"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 transition-all outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="orgPhone"
                            placeholder="+91"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 transition-all outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Industry
                          </label>
                          <select
                            name="industry"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 bg-white cursor-pointer outline-none appearance-none transition-all"
                          >
                            <option value="">Select industry</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="retail">Retail</option>
                            <option value="education">Education</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Number of Employees
                          </label>
                          <input
                            type="number"
                            name="employees"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            GST / Tax ID
                          </label>
                          <input
                            type="text"
                            name="taxId"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
          focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D]
          hover:border-gray-300 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Section */}
                  <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] p-2 rounded-lg text-white">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      Address Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none transition-all hover:border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none transition-all hover:border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contract & Financial Information */}
                  <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] p-2 rounded-lg text-white">
                        <DollarSign size={20} className="text-white" />
                      </div>
                      Contract & Financial Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Contract Value (₹)
                        </label>
                        <input
                          type="number"
                          name="contractValue"
                          placeholder="₹ 0"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none 
        focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all hover:border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Payment Terms
                        </label>
                        <select
                          name="paymentTerms"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none 
        focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all 
        hover:border-gray-300 cursor-pointer appearance-none bg-white"
                        >
                          <option value="">Select terms</option>
                          <option value="net-30">Net 30</option>
                          <option value="net-60">Net 60</option>
                          <option value="net-90">Net 90</option>
                          <option value="immediate">Immediate</option>
                          <option value="advance">Advance Payment</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Contract Start Date
                        </label>
                        <input
                          type="date"
                          name="contractStart"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none 
        focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all hover:border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Contract End Date
                        </label>
                        <input
                          type="date"
                          name="contractEnd"
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none 
        focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all hover:border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-3">
                      <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] p-2 rounded-lg text-white">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      Additional Notes
                    </h3>

                    <textarea
                      name="notes"
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Add any additional notes about this client..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none 
    focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all 
    hover:border-gray-300 resize-none"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-orange-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-semibold hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold hover:scale-105"
                    >
                      Add Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
