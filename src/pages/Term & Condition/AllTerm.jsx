import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import AddTermModal from "../../components/TermCondition/AddTermModal";
import ViewTermModal from "../../components/TermCondition/ViewTermModal";
import EditTermModal from "../../components/TermCondition/EditTermModal";
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  Filter,
  FileText,
  Calendar,
  Clock,
  Building,
  Plus,
  X,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import {
  useGetAllTermsQuery,
  useDeleteTermMutation,
  useCreateTermMutation,
  useUpdateTermMutation,
} from "../../store/api/termApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import DeleteTermModal from "../../components/TermCondition/DeleteTermModal";
import usePermission from "../../hooks/usePermission";

const TermsAndCondition = () => {
  /* ================= STATES ================= */
  const [filterDept, setFilterDept] = useState("");
  const [filterDesig, setFilterDesig] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempDept, setTempDept] = useState("");
  const [tempDesig, setTempDesig] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    title: "",
    description: "",
  });

  const { create, read, update, delete: remove } = usePermission("HR Policy"); // Terms are part of HR Policy usually, or I should check keys. I'll stick to HR Policy or check if "Terms" is a key. Given user request, I'll use "HR Policy".

  /* ================= API ================= */
  const { data: deptData } = useGetDepartmentsQuery({ limit: 100 });
  const { data: desigData } = useGetDesignationsQuery({ limit: 100 });

  const { data, isLoading } = useGetAllTermsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    department: filterDept,
    designation: filterDesig,
  });

  const departments = deptData?.departments || [];
  const designations = desigData?.designations || [];

  const [createTerm, { isLoading: creating }] = useCreateTermMutation();
  const [updateTerm, { isLoading: updating }] = useUpdateTermMutation();
  const [deleteTerm] = useDeleteTermMutation();

  const terms = Array.isArray(data) ? data : [];
  const pagination = {
    total: terms.length,
    totalPages: Math.ceil(terms.length / itemsPerPage),
  };

  /* ================= PAGINATION ================= */
  const indexOfFirstItem =
    pagination.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < pagination.totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  /* ================= HANDLERS ================= */
  const handleAddTerm = async () => {
    if (
      !formData.department ||
      !formData.designation ||
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      alert("All fields are required");
      return;
    }

    await createTerm(formData).unwrap();
    setIsModalOpen(false);
    setFormData({
      department: "",
      designation: "",
      title: "",
      description: "",
    });
  };

  const handleUpdateTerm = async (id, updatedData) => {
    await updateTerm({ id, ...updatedData }).unwrap();
    setIsEditModalOpen(false);
    setSelectedTerm(null);
  };

  const handleDeleteTerm = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      await deleteTerm(id).unwrap();
    }
  };

  const handleClearFilters = () => {
    setFilterDept("");
    setFilterDesig("");
    setSearchTerm("");
    setTempDept("");
    setTempDesig("");
    setTempSearch("");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setFilterDept(tempDept);
    setFilterDesig(tempDesig);
    setSearchTerm(tempSearch);
    setShowFilters(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = filterDept || filterDesig || searchTerm;

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Terms & Conditions</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    Terms & Conditions
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        handleClearFilters();
                      } else {
                        setTempDept(filterDept);
                        setTempDesig(filterDesig);
                        setTempSearch(searchTerm);
                        setShowFilters(!showFilters);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${showFilters || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 tracking-tight">Filter Options</span>
                        <button
                          onClick={() => {
                            setTempDept("");
                            setTempDesig("");
                            setTempSearch("");
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize tracking-wider"
                        >
                          Reset All
                        </button>
                      </div>

                      <div className="p-5 space-y-6">
                        {/* Search Input */}
                        <div className="group">
                          <label className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Search Terms</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={tempSearch}
                              onChange={(e) => setTempSearch(e.target.value)}
                              placeholder="Search by title or description..."
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10">
                          {/* Column 1: Department */}
                          <div className="space-y-4">
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Department</span>
                            <div className="relative">
                              <select
                                value={tempDept}
                                onChange={(e) => setTempDept(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                              >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                  <option key={dept.id} value={dept.department_name}>
                                    {dept.department_name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>

                          {/* Column 2: Designation */}
                          <div className="space-y-4">
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Designation</span>
                            <div className="relative">
                              <select
                                value={tempDesig}
                                onChange={(e) => setTempDesig(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                              >
                                <option value="">All Designations</option>
                                {designations.map((desig) => (
                                  <option key={desig.id} value={desig.designation_name}>
                                    {desig.designation_name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white shadow-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleApplyFilters}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!create}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={20} />
                  Add Terms
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <NumberCard
              title="Total Policies"
              number={pagination.total || "0"}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Page Items"
              number={terms.length || "0"}
              icon={<Calendar className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Departments"
              number={new Set(terms.map((t) => t.department)).size || "0"}
              icon={<Building className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
            <NumberCard
              title="Total Result"
              number={pagination.total || "0"}
              icon={<Filter className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
          </div>

          {/* TABLE SECTION */}
          {isLoading ? (
            <div className="flex justify-center flex-col items-center gap-4 py-32 mt-4 border border-gray-200 rounded-sm">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-semibold animate-pulse">Loading terms...</p>
            </div>
          ) : terms.length > 0 ? (
            <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[5%]">S.N</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[40%]">Title</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[25%]">Description</th>
                    <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[20%]">Created</th>
                    <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 w-[10%]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {terms.map((term, index) => (
                    <tr key={term.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        <div className="truncate w-full max-w-lg overflow-hidden text-ellipsis whitespace-nowrap" title={term.title}>
                          {term.title}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600 text-left">
                        <div className="cursor-pointer text-sm truncate w-full max-w-sm overflow-hidden text-ellipsis whitespace-nowrap" title={term.description}>
                          {term.description || "---"}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-700 text-sm">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-orange-500" />
                            <span className="font-medium">{formatDate(term.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <Clock size={12} className="text-blue-500" />
                            <span>{formatTime(term.created_at)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedTerm(term);
                              setIsViewModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-blue-50 rounded-sm text-blue-500 hover:text-blue-700 transition-all border border-transparent hover:border-blue-100"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTerm(term);
                              setIsEditModalOpen(true);
                            }}
                            disabled={!update}
                            className={`p-1.5 hover:bg-green-50 rounded-sm transition-all border border-transparent ${update ? "text-green-500 hover:text-green-700 hover:border-green-100" : "text-gray-300 cursor-not-allowed text-opacity-50"}`}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTerm(term);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={!remove}
                            className={`p-1.5 hover:bg-red-50 rounded-sm transition-all border border-transparent ${remove ? "text-red-500 hover:text-red-700 hover:border-red-100" : "text-gray-300 cursor-not-allowed text-opacity-50"}`}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mt-6 font-primary">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {hasActiveFilters ? "No matches found" : "No Terms & Conditions found"}
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm mb-6">
                {hasActiveFilters
                  ? "We couldn't find any terms matching your current filters. Try adjusting your search."
                  : "Your Terms & Conditions list is currently empty. Start by adding your first policy!"}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!create}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add First Term
                </button>
              )}
            </div>
          )}

          {/* PAGINATION */}
          {pagination.totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600">{indexOfFirstItem}</span> to <span className="text-orange-600">{indexOfLastItem}</span> of <span className="text-orange-600">{pagination.total}</span> Terms
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>



        {/* ADD MODAL */}
        <AddTermModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddTerm}
          loading={creating}
        />
        <ViewTermModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTerm(null);
          }}
          term={selectedTerm}
        />
        <EditTermModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTerm(null);
          }}
          term={selectedTerm}
          onSubmit={handleUpdateTerm}
          loading={updating}
        />
        <DeleteTermModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTerm(null);
          }}
          term={selectedTerm}
        />
      </div>
    </>
  );
};

export default TermsAndCondition;
