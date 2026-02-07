import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AddTermModal from "../../components/TermCondition/AddTermModal";
import ViewTermModal from "../../components/TermCondition/ViewTermModal";
import EditTermModal from "../../components/TermCondition/EditTermModal";
import {
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
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
  };

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
    <DashboardLayout>
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
                      if (filterDept || filterDesig || searchTerm) {
                        handleClearFilters();
                      } else {
                        setShowFilters(!showFilters);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${showFilters || filterDept || filterDesig || searchTerm
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {filterDept || filterDesig || searchTerm ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="text-base font-bold text-gray-800">Filter Options</h3>
                        <button
                          onClick={handleClearFilters}
                          className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          Reset All
                        </button>
                      </div>

                      {/* Body - Two Column Layout */}
                      <div className="grid grid-cols-2 gap-6 p-5">
                        {/* Department Column */}
                        <div>
                          <label className="text-sm font-medium text-gray-500 mb-3 block">Department</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="radio"
                                name="department"
                                checked={filterDept === ""}
                                onChange={() => setFilterDept("")}
                                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 accent-orange-500"
                              />
                              <span className={`text-sm ${filterDept === "" ? "text-orange-500 font-semibold" : "text-gray-700 group-hover:text-gray-900"}`}>
                                All
                              </span>
                            </label>
                            {departments.slice(0, 4).map((dept) => (
                              <label key={dept.id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="radio"
                                  name="department"
                                  checked={filterDept === dept.department_name}
                                  onChange={() => setFilterDept(dept.department_name)}
                                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 accent-orange-500"
                                />
                                <span className={`text-sm ${filterDept === dept.department_name ? "text-orange-500 font-semibold" : "text-gray-700 group-hover:text-gray-900"}`}>
                                  {dept.department_name}
                                </span>
                              </label>
                            ))}
                            {departments.length > 4 && (
                              <select
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                                className="mt-2 w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                              >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                  <option key={dept.id} value={dept.department_name}>
                                    {dept.department_name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>

                        {/* Designation Column */}
                        <div>
                          <label className="text-sm font-medium text-gray-500 mb-3 block">Designation</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="radio"
                                name="designation"
                                checked={filterDesig === ""}
                                onChange={() => setFilterDesig("")}
                                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 accent-orange-500"
                              />
                              <span className={`text-sm ${filterDesig === "" ? "text-orange-500 font-semibold" : "text-gray-700 group-hover:text-gray-900"}`}>
                                All
                              </span>
                            </label>
                            {designations.slice(0, 4).map((desig) => (
                              <label key={desig.id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="radio"
                                  name="designation"
                                  checked={filterDesig === desig.designation_name}
                                  onChange={() => setFilterDesig(desig.designation_name)}
                                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 accent-orange-500"
                                />
                                <span className={`text-sm ${filterDesig === desig.designation_name ? "text-orange-500 font-semibold" : "text-gray-700 group-hover:text-gray-900"}`}>
                                  {desig.designation_name}
                                </span>
                              </label>
                            ))}
                            {designations.length > 4 && (
                              <select
                                value={filterDesig}
                                onChange={(e) => setFilterDesig(e.target.value)}
                                className="mt-2 w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                              >
                                <option value="">All Designations</option>
                                {designations.map((desig) => (
                                  <option key={desig.id} value={desig.designation_name}>
                                    {desig.designation_name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
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

          {/* TABLE */}
          <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[5%]">S.N</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[25%]">Title</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[45%]">Description</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Created</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 w-[10%]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10">
                      Loading...
                    </td>
                  </tr>
                ) : terms.length ? (
                  terms.map((term, index) => (
                    <tr key={term.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{term.title}</td>

                      <td className="py-3 px-4 text-gray-600 text-left">
                        <div className="cursor-pointer" title={term.description}>
                          {term.description && term.description.length > 100
                            ? term.description.substring(0, 100) + "..."
                            : term.description || "---"}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-700 text-sm">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-orange-500" />
                            <span>{formatDate(term.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-blue-500" />
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
                            className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
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
                            className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${update ? "text-green-500 hover:text-green-700" : "text-gray-300 cursor-not-allowed text-opacity-50"}`}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTermId(term.id);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={!remove}
                            className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${remove ? "text-red-500 hover:text-red-700" : "text-gray-300 cursor-not-allowed text-opacity-50"}`}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10">
                      No Terms & Conditions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

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
            setSelectedTermId(null);
          }}
          termId={selectedTermId}
        />
      </div>
    </DashboardLayout>
  );
};

export default TermsAndCondition;
