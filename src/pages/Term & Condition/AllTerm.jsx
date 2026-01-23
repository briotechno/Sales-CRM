import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AddTermModal from "../../components/TermCondition/AddTermModal";
import ViewTermModal from "../../components/TermCondition/ViewTermModal";
import EditTermModal from "../../components/TermCondition/EditTermModal";
import {
  Pencil,
  Trash2,
  Eye,
  Filter,
  FileText,
  Calendar,
  Building,
  Plus,
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

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <div className="ml-6 min-h-screen">
        {/* HEADER */}
        <div className="bg-white rounded-sm p-3 mb-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Terms & Conditions</h1>
              <p className="text-sm text-gray-500 mt-1 flex gap-2">
                <FiHome />
                <span>HRM /</span>
                <span className="text-orange-500 font-semibold">
                  Terms & Conditions
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all shadow-sm ${showFilters || filterDept || filterDesig || searchTerm
                  ? "bg-orange-50 border-orange-200 text-orange-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Filter size={18} className={filterDept || filterDesig || searchTerm ? "fill-orange-500" : ""} />
                <span className="font-semibold text-sm">Filters</span>
                {(filterDept || filterDesig || searchTerm) && (
                  <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!create}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md ${create
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
              >
                <Plus size={18} />
                <span className="font-semibold text-sm">Add Terms</span>
              </button>
            </div>
          </div>
        </div>

        {/* FILTER DROPDOWN */}
        {showFilters && (
          <div className="absolute right-6 top-24 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl w-80 p-5 animate-fadeIn z-50">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter size={18} className="text-orange-500" />
                Filter Options
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Search Title/Desc
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Department
              </label>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.department_name}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                Designation
              </label>
              <select
                value={filterDesig}
                onChange={(e) => setFilterDesig(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-gray-50"
              >
                <option value="">All Designations</option>
                {designations.map((dsg) => (
                  <option key={dsg.id} value={dsg.designation_name}>
                    {dsg.designation_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <NumberCard
            title="Total Policies"
            number={pagination.total}
            icon={<FileText />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Current Page"
            number={terms.length}
            icon={<Calendar />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Departments"
            number={new Set(terms.map((t) => t.department)).size}
            icon={<Building />}
            iconBgColor="bg-purple-100"
            lineBorderClass="border-purple-500"
          />
          <NumberCard
            title="Page"
            number={`${currentPage}/${pagination.totalPages}`}
            icon={<Filter />}
            iconBgColor="bg-orange-100"
            lineBorderClass="border-orange-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">S.N</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Designation</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold">Updated</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
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
                    <td className="py-3 px-1 text-orange-600 font-medium">{term.department}</td>
                    <td className="py-3 px-1 text-orange-600 font-medium">{term.designation}</td>
                    <td>{term.title}</td>
                    <td>{term.description}</td>

                    <td className="py-3 px-1 whitespace-nowrap text-gray-700">
                      {formatDate(term.created_at)}
                    </td>

                    <td className="py-3 px-1 whitespace-nowrap text-gray-700">
                      {formatDate(term.updated_at)}
                    </td>

                    <td className="py-3 px-1">
                      <div className="flex justify-center gap-2">
                        <div className="flex justify-center gap-2">
                          {read && (
                            <button
                              onClick={() => {
                                setSelectedTerm(term);
                                setIsViewModalOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => {
                                setSelectedTerm(term);
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => {
                                setSelectedTermId(term.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
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

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
            <p className="text-sm text-gray-600">
              Showing <b>{indexOfFirstItem}</b> to <b>{indexOfLastItem}</b> of{" "}
              <b>{pagination.total}</b> terms
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-sm font-bold bg-white disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 border rounded-sm font-bold ${currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded-sm font-bold bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
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


    </DashboardLayout>
  );
};

export default TermsAndCondition;
