import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  Upload,
  Package,
  DollarSign,
  Grid3x3,
  Grid,
  FileDown,
  Share2,
  Target,
  Handshake,
  Users,
  CheckCircle,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function CatalogsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 5;

  const [catalogs, setCatalogs] = useState([
    {
      id: "CAT001",
      name: "CRM Software Suite",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
      description:
        "Complete customer relationship management solution with sales pipeline tracking",
      minPrice: 15000,
      maxPrice: 250000,
      skus: 45,
      interestedLeads: 234,
      createdDate: "2024-03-15",
      status: "Active",
    },
    {
      id: "CAT002",
      name: "ERP Solutions",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
      description:
        "Enterprise resource planning software for business automation",
      minPrice: 50000,
      maxPrice: 500000,
      skus: 120,
      interestedLeads: 567,
      createdDate: "2024-04-01",
      status: "Active",
    },
    {
      id: "CAT003",
      name: "Project Management Tools",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop",
      description: "Advanced project tracking and team collaboration platform",
      minPrice: 8000,
      maxPrice: 120000,
      skus: 78,
      interestedLeads: 189,
      createdDate: "2024-02-12",
      status: "Inactive",
    },
    {
      id: "CAT004",
      name: "Analytics Dashboard",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
      description: "Business intelligence and data visualization software",
      minPrice: 12000,
      maxPrice: 180000,
      skus: 156,
      interestedLeads: 892,
      createdDate: "2024-01-20",
      status: "Active",
    },
    {
      id: "CAT005",
      name: "HR Management System",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop",
      description: "Complete human resource management and payroll solution",
      minPrice: 20000,
      maxPrice: 350000,
      skus: 92,
      interestedLeads: 345,
      createdDate: "2024-05-10",
      status: "Active",
    },
    {
      id: "CAT006",
      name: "Accounting Software",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1280&h=720&fit=crop",
      description: "Comprehensive financial management and accounting platform",
      minPrice: 10000,
      maxPrice: 200000,
      skus: 67,
      interestedLeads: 421,
      createdDate: "2024-06-22",
      status: "Inactive",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    minPrice: "",
    maxPrice: "",
    skus: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCatalog = {
      id: `CAT00${catalogs.length + 1}`,
      name: formData.name,
      image:
        imagePreview ||
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
      description: formData.description,
      minPrice: parseInt(formData.minPrice),
      maxPrice: parseInt(formData.maxPrice),
      skus: parseInt(formData.skus),
      interestedLeads: 0,
      createdDate: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setCatalogs([...catalogs, newCatalog]);
    setShowAddModal(false);
    setFormData({
      name: "",
      image: null,
      description: "",
      minPrice: "",
      maxPrice: "",
      skus: "",
    });
    setImagePreview(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this catalog?")) {
      setCatalogs(catalogs.filter((c) => c.id !== id));
    }
  };

  const filteredCatalogs = catalogs
    .filter((catalog) => {
      const matchesSearch =
        catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catalog.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || catalog.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredCatalogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCatalogs = filteredCatalogs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const handlePageChange = (page) => setCurrentPage(page);

  const handleShare = (id) => {
    const url = `${window.location.origin}/catalog/view/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`Catalog link copied to clipboard!\n${url}`);
    });
  };

  const handleView = (id) => {
    window.open(`/catalog/view/${id}`, "_blank");
  };

  return (
    <DashboardLayout>
      <div className=" ml-6 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b my-3">
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center justify-between py-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Catalog Module
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> CRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Catalogs
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search catalogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] text-sm hidden md:block"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hidden md:block"
                    size={16}
                  />
                </div>
                {["All", "Active", "Inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-3 rounded-sm font-semibold border text-sm transition ${statusFilter === status
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {status}
                  </button>
                ))}

                <button className="px-5 py-3 border border-gray-200 rounded-sm flex items-center gap-2 hover:bg-gray-100">
                  <FileDown size={16} />
                  <span className="text-sm font-medium">Export</span>
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  + Add Catalog
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statement Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <NumberCard
            title="Total Team"
            number={"248"}
            icon={<Users className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Total ID"
            number={"186"}
            icon={<DollarSign className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Total Leads"
            number={"18"}
            icon={<Handshake className="text-orange-600" size={24} />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
          <NumberCard
            title="Total Status"
            number={"2"}
            icon={<Target className="text-purple-600" size={24} />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                <th className="py-3 px-4 font-semibold">S.N</th>
                <th className="py-3 px-4 font-semibold">Image</th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("id")}
                >
                  ID
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("minPrice")}
                >
                  Min Price
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("maxPrice")}
                >
                  Max Price
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("skus")}
                >
                  SKUs
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("interestedLeads")}
                >
                  Interested Leads
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("createdDate")}
                >
                  Created Date
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-gray-200"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentCatalogs.length > 0 ? (
                currentCatalogs.map((catalog, index) => (
                  <tr
                    key={catalog.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <img
                        src={catalog.image}
                        alt={catalog.name}
                        className="w-12 h-12 rounded-md border object-cover mx-auto"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{catalog.id}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {catalog.name}
                    </td>
                    <td className="py-3 px-4">
                      ₹{catalog.minPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      ₹{catalog.maxPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{catalog.skus}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {catalog.interestedLeads}
                      </span>
                    </td>
                    <td className="py-3 px-4">{catalog.createdDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${catalog.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {catalog.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleView(catalog.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="text-[#FF7B1D] hover:opacity-80">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(catalog.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleShare(catalog.id)}
                          className="text-orange-500 hover:opacity-80"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="py-6 text-gray-500 font-medium text-sm"
                  >
                    No catalogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#FF7B1D] hover:opacity-90"
              }`}
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${currentPage === i + 1
                  ? "bg-gray-200 border-gray-400"
                  : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#22C55E] hover:opacity-90"
              }`}
          >
            Next
          </button>
        </div>

        {/* Add Catalog Modal */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-white">
                  Add New Catalog
                </h2>

                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:bg-orange-700 p-1 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catalog Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                      required
                      placeholder="e.g., CRM Software Suite"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catalog Image * (1280px × 720px)
                    </label>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="catalog-image"
                      />

                      <label
                        htmlFor="catalog-image"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-sm"
                            />
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <Upload
                              className="mx-auto text-gray-400 mb-2"
                              size={40}
                            />
                            <p className="text-sm font-semibold text-gray-600">
                              Click to upload image
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG (1280×720px)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 resize-none"
                      required
                      placeholder="Describe your catalog..."
                    />
                  </div>

                  {/* Price Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Minimum Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        value={formData.minPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                        required
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Maximum Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        value={formData.maxPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                        required
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* SKUs */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of SKUs *
                    </label>
                    <input
                      type="number"
                      name="skus"
                      value={formData.skus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                      required
                      placeholder="0"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setImagePreview(null);
                        setFormData({
                          name: "",
                          image: null,
                          description: "",
                          minPrice: "",
                          maxPrice: "",
                          skus: "",
                        });
                      }}
                      className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg"
                    >
                      Add Catalog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
