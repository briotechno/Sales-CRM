import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Target,
  Activity,
  X,
  Check,
  Home,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function ChampionsLeadPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");

  const [leads, setLeads] = useState([
    {
      id: "LD001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      company: "Tech Solutions Pvt Ltd",
      location: "Mumbai, Maharashtra",
      status: "Hot",
      source: "Website",
      score: 95,
      date: "2024-11-20",
      lastContact: "2024-11-22",
    },
    {
      id: "LD002",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43211",
      company: "Digital Innovations",
      location: "Delhi, NCR",
      status: "Warm",
      source: "Referral",
      score: 85,
      date: "2024-11-19",
      lastContact: "2024-11-21",
    },
    {
      id: "LD003",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91 98765 43212",
      company: "Smart Business Corp",
      location: "Ahmedabad, Gujarat",
      status: "Cold",
      source: "LinkedIn",
      score: 60,
      date: "2024-11-18",
      lastContact: "2024-11-20",
    },
    {
      id: "LD004",
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      phone: "+91 98765 43213",
      company: "Future Tech Labs",
      location: "Hyderabad, Telangana",
      status: "Hot",
      source: "Campaign",
      score: 92,
      date: "2024-11-21",
      lastContact: "2024-11-23",
    },
    {
      id: "LD005",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      phone: "+91 98765 43214",
      company: "Enterprise Solutions",
      location: "Bangalore, Karnataka",
      status: "Warm",
      source: "Website",
      score: 78,
      date: "2024-11-17",
      lastContact: "2024-11-22",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    status: "Cold",
    source: "Website",
  });

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #f97316, #ea580c);
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #ea580c, #c2410c);
    }
  `;

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) return;

    const newLead = {
      id: `LD${String(leads.length + 1).padStart(3, "0")}`,
      ...formData,
      score: Math.floor(Math.random() * 40) + 60,
      date: new Date().toISOString().split("T")[0],
      lastContact: new Date().toISOString().split("T")[0],
    };

    setLeads([newLead, ...leads]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      location: "",
      status: "Cold",
      source: "Website",
    });
    setShowCreateForm(false);
  };

  const handleDelete = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hot":
        return "bg-red-100 text-red-700 border-red-300";
      case "Warm":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Cold":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-orange-600";
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || lead.status === filterStatus;
    const matchesSource =
      filterSource === "All" || lead.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6 ">
        <style>{scrollbarStyles}</style>

        <div className="">
          {/* Header Section */}
          <div className="mb-8">
            {/* Top Section: Title + Filters + Add Button */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
              {/* Left Side Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Champions Lead
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home size={14} className="text-gray-700" />
                  CRM /{" "}
                  <span className="text-orange-600 font-medium">Lead</span>
                </p>
              </div>

              {/* Middle Filters */}
              <div className="flex items-center gap-4">
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 focus:border-orange-500 
                   focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>

                {/* Source Filter */}
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 focus:border-orange-500 
                   focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                >
                  <option value="All">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Direct">Direct</option>
                </select>

                {/* Right Side Add Lead Button */}
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 
                 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 
                 shadow-xl hover:shadow-2xl transition-all duration-300 transform "
                >
                  <Plus size={20} />
                  Add New Lead
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              <NumberCard
                title={"Total Leads"}
                number={leads.length}
                icon={<Users className="text-blue-600" size={24} />}
                iconBgColor={"bg-blue-100"}
                lineBorderClass={"border-blue-500"} />

              <NumberCard
                title={"Hot Leads"}
                number={leads.filter((l) => l.status === "Hot").length}
                icon={<TrendingUp className="text-green-600" size={24} />}
                iconBgColor={"bg-green-100"}
                lineBorderClass={"border-green-500"} />

              <NumberCard
                title={"Warm Leads"}
                number={leads.filter((l) => l.status === "Warm").length}
                icon={<Activity className="text-orange-600" size={24} />}
                iconBgColor={"bg-orange-100"}
                lineBorderClass={"border-orange-500"} />

              <NumberCard
                title={"Avg Lead Score"}
                number={Math.round(
                  leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length
                )}
                icon={<Award className="text-purple-600" size={24} />}
                iconBgColor={"bg-purple-100"}
                lineBorderClass={"border-purple-500"} />
            </div> */}
          </div>

          {/* Modal Popup */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Star size={24} />
                    Add New Champion Lead
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="City, State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lead Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      >
                        <option value="Cold">Cold</option>
                        <option value="Warm">Warm</option>
                        <option value="Hot">Hot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lead Source
                      </label>
                      <select
                        value={formData.source}
                        onChange={(e) =>
                          setFormData({ ...formData, source: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      >
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Campaign">Campaign</option>
                        <option value="Direct">Direct</option>
                      </select>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      Add Lead
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-3 border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters Section */}

          {/* Leads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-orange-500 transform"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2">
                      <Star className="text-white" size={20} />
                    </div>
                    <span className="text-white font-bold">{lead.id}</span>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-bold border-2 ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {lead.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-semibold">
                        {lead.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <Award
                          className={getScoreColor(lead.score)}
                          size={20}
                        />
                        <span
                          className={`text-lg font-bold ${getScoreColor(
                            lead.score
                          )}`}
                        >
                          {lead.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Lead Score</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-orange-500" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-orange-500" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="text-orange-500" />
                      <span>{lead.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 border-t-2 border-gray-100 pt-3 mb-4">
                    <div>
                      <span className="font-semibold">Created:</span>{" "}
                      {lead.date}
                    </div>
                    <div>
                      <span className="font-semibold">Last Contact:</span>{" "}
                      {lead.lastContact}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                      Source: {lead.source}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 transition-colors group">
                        <Eye
                          size={18}
                          className="text-blue-600 group-hover:scale-110 transition-transform"
                        />
                      </button>
                      <button className="p-2 hover:bg-orange-50 transition-colors group">
                        <Edit2
                          size={18}
                          className="text-orange-600 group-hover:scale-110 transition-transform"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 hover:bg-red-50 transition-colors group"
                      >
                        <Trash2
                          size={18}
                          className="text-red-600 group-hover:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="bg-white p-12 shadow-lg text-center">
              <Target size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                No Leads Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
