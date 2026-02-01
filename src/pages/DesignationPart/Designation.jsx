import React, { useState, useRef, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { Pencil, Trash2, Eye, FileDown, Users, Warehouse, Handshake, Target, Plus, Search, Filter } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import AddDesignationModal from "../../components/Designation/AddDesignationModal";
import EditDesignationModal from "../../components/Designation/EditDesignationModal";
import ViewDesignationModal from "../../components/Designation/ViewDesignationModal";
import DeleteDesignationModal from "../../components/Designation/DeleteDesignationModal";
import NumberCard from "../../components/NumberCard";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import { useGetHRMDashboardDataQuery } from "../../store/api/hrmDashboardApi";
import usePermission from "../../hooks/usePermission";

const AllDesignation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemsPerPage = 7;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  const { create, read, update, delete: remove } = usePermission("Designation");

  // RTK Query
  const { data, isLoading } = useGetDesignationsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter,
    search: searchTerm,
  });

  const { data: dashboardData, refetch: refetchDashboard } = useGetHRMDashboardDataQuery();
  const summary = dashboardData?.data?.summary;

  const designations = data?.designations || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));

  const handleView = (dsg) => {
    setSelectedDesignation(dsg);
    setIsViewModalOpen(true);
  };

  const handleEdit = (dsg) => {
    setSelectedDesignation(dsg);
    setIsEditModalOpen(true);
  };

  const handleDelete = (dsg) => {
    setSelectedDesignation(dsg);
    setIsDeleteModalOpen(true);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Designation</h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <FiHome className="text-gray-400" size={14} /> HRM / <span className="text-orange-500 font-medium">Designation</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isFilterOpen || statusFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search designations..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm w-64 shadow-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={!create}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={18} /> ADD DESIGNATION
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <NumberCard
              title="Total Employee"
              number={summary?.totalEmployees?.value || "-"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Total Department"
              number={summary?.totalDepartments?.value || "-"}
              icon={<Warehouse className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Total Designation"
              number={summary?.totalDesignations?.value || "-"}
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

          {/* 🧾 Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold">S.N</th>
                  <th className="py-3 px-4 font-semibold">Icon</th>
                  <th className="py-3 px-4 font-semibold">Designation ID</th>
                  <th className="py-3 px-4 font-semibold">Designation Name</th>
                  <th className="py-3 px-4 font-semibold text-left">Description</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Employees</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="py-10 text-gray-500 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : designations.length > 0 ? (
                  designations.map((dsg, index) => (
                    <tr
                      key={dsg.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          {dsg.image_url ? (
                            <img src={dsg.image_url} alt="" className="w-10 h-10 rounded-full border border-gray-300 object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                              {dsg.designation_name?.substring(0, 1)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-orange-600 font-medium">{dsg.designation_id}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{dsg.designation_name}</td>
                      <td className="py-3 px-4 text-gray-600 text-left max-w-xs overflow-hidden">
                        <div className="truncate cursor-pointer" title={dsg.description}>
                          {dsg.description && dsg.description.length > 60
                            ? dsg.description.substring(0, 60) + "..."
                            : dsg.description || "---"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{dsg.department_name}</td>
                      <td className="py-3 px-4">{dsg.employee_count}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${dsg.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {dsg.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          {read && (
                            <button
                              onClick={() => handleView(dsg)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => handleEdit(dsg)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => handleDelete(dsg)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-10 text-gray-500 font-medium">
                      No designations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔹 Pagination */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{indexOfLastItem}</span> of <span className="font-bold">{pagination.total}</span> designations
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 border rounded-sm text-sm font-bold ${currentPage === i + 1
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddDesignationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          refetchDashboard={refetchDashboard}
        />

        <EditDesignationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDesignation(null);
          }}
          designation={selectedDesignation}
          refetchDashboard={refetchDashboard}
        />

        <ViewDesignationModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedDesignation(null);
          }}
          designation={selectedDesignation}
        />

        <DeleteDesignationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedDesignation(null);
          }}
          designationId={selectedDesignation?.id}
          refetchDashboard={refetchDashboard}
        />
      </div>
    </DashboardLayout>
  );
};

export default AllDesignation;
