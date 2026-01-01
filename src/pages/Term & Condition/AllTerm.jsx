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
import DeleteTermModal from "../../components/TermCondition/DeleteTermModal";

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

  /* ================= API ================= */
  const { data, isLoading } = useGetAllTermsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    department: filterDept,
    designation: filterDesig,
  });

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
                className="px-4 py-2 border flex gap-2"
              >
                <Filter size={16} /> Filters
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 text-white px-4 py-2 flex gap-2"
              >
                <Plus size={18} /> Add Terms
              </button>
            </div>
          </div>
        </div>

        {/* FILTER DROPDOWN */}
        {showFilters && (
          <div className="bg-white p-4 mb-4 shadow rounded w-64">
            <select
              className="w-full mb-3 border p-2"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
            </select>

            <select
              className="w-full border p-2"
              value={filterDesig}
              onChange={(e) => setFilterDesig(e.target.value)}
            >
              <option value="">All Designations</option>
              <option value="Manager">Manager</option>
              <option value="Engineer">Engineer</option>
              <option value="Executive">Executive</option>
            </select>
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
                    <td className="py-3 px-1 whitespace-nowrap">{term.created_at}</td>
                    <td className="py-3 px-1 whitespace-nowrap">{term.updated_at}</td>
                    <td className="py-3 px-1">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTerm(term);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTerm(term);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTermId(term.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
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
