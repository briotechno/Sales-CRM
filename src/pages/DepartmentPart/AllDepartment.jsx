import React, { useState, useRef, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { Edit, Trash2, Eye, Grid, FileDown, Plus, Target, Handshake, Warehouse, Users, Search, Filter, X } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import AddDepartmentModal from "../../components/Department/AddDepartmentModal";
import EditDepartmentModal from "../../components/Department/EditDepartmentModal";
import ViewDepartmentModal from "../../components/Department/ViewDepartmentModal";
import DeleteDepartmentModal from "../../components/Department/DeleteDepartmentModal";
import NumberCard from "../../components/NumberCard";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetHRMDashboardDataQuery } from "../../store/api/hrmDashboardApi";
import usePermission from "../../hooks/usePermission";

const AllDepartment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemsPerPage = 6;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const { create, read, update, delete: remove } = usePermission("Department");

  const { data, isLoading, isError } = useGetDepartmentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter,
  });

  const { data: dashboardData, refetch: refetchDashboard } = useGetHRMDashboardDataQuery();
  const summary = dashboardData?.data?.summary;

  const departments = data?.departments || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const clearAllFilters = () => {
    setStatusFilter("All");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== "All" || dateFilter !== "All";

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
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, data?.pagination?.total || 0);

  const getStatusClass = (status) =>
    status === "Active"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Department</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">All Department</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setIsFilterOpen(!isFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Statuses</span>
                      </div>
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

                      <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Date Filter</span>
                      </div>
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "Custom"].map((option) => (
                          <div key={option}>
                            <button
                              onClick={() => {
                                setDateFilter(option);
                                if (option !== "Custom") {
                                  setIsFilterOpen(false);
                                  setCurrentPage(1);
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option}
                            </button>
                            {option === "Custom" && dateFilter === "Custom" && (
                              <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                <input
                                  type="date"
                                  value={customStart}
                                  onChange={(e) => setCustomStart(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <input
                                  type="date"
                                  value={customEnd}
                                  onChange={(e) => setCustomEnd(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <button
                                  onClick={() => { setIsFilterOpen(false); setCurrentPage(1); }}
                                  className="w-full bg-orange-500 text-white text-[10px] font-bold py-2 rounded-sm"
                                >
                                  Apply
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={!create}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={20} />
                  Add Department
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <NumberCard
              title="Total Employees"
              number={summary?.totalEmployees?.value || "-"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Departments"
              number={summary?.totalDepartments?.value || "-"}
              icon={<Warehouse className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Designations"
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

          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm mt-4">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">S.N</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Icon</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Dept ID</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Department Name</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Description</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Employees</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Status</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <div className="flex justify-center flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-semibold">Loading departments...</p>
                      </div>
                    </td>
                  </tr>
                ) : departments.length > 0 ? (
                  departments.map((dept, index) => (
                    <tr key={dept.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          {dept.icon ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${dept.icon}`}
                              alt={dept.department_name}
                              className="w-10 h-10 rounded-full border border-orange-200 object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200 shadow-sm">
                              {dept.department_name?.substring(0, 1)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-orange-600 font-bold">{dept.department_id}</td>
                      <td className="py-3 px-4 text-gray-800 font-semibold">{dept.department_name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="cursor-pointer" title={dept.description}>
                          {dept.description && dept.description.length > 60
                            ? dept.description.substring(0, 60) + "..."
                            : dept.description || "---"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-700">{dept.employee_count || 0}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${getStatusClass(dept.status)}`}>
                          {dept.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedDept(dept); setIsViewModalOpen(true); }}
                            className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => { setSelectedDept(dept); setIsEditModalOpen(true); }}
                            disabled={!update}
                            className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${update ? "text-green-500 hover:text-green-700" : "text-gray-300 cursor-not-allowed"
                              }`}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => { setSelectedDept(dept); setIsDeleteModalOpen(true); }}
                            disabled={!remove}
                            className={`p-1 hover:bg-orange-100 rounded-sm transition-all ${remove ? "text-red-500 hover:text-red-700" : "text-gray-300 cursor-not-allowed"
                              }`}
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
                    <td colSpan="8" className="py-20 text-center flex flex-col items-center gap-3">
                      <Warehouse size={48} className="text-gray-200" />
                      <p className="text-gray-500 font-medium">No departments found.</p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                      >
                        Create first Department
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600 font-bold">{indexOfFirstItem + 1}</span> to <span className="text-orange-600 font-bold">{indexOfLastItem}</span> of <span className="text-orange-600 font-bold">{data?.pagination?.total || 0}</span> Departments
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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === pageNum
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
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

        {/* Modals */}
        <AddDepartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} refetchDashboard={refetchDashboard} />
        <EditDepartmentModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedDept(null); }}
          department={selectedDept}
          refetchDashboard={refetchDashboard}
        />
        <ViewDepartmentModal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setSelectedDept(null); }}
          department={selectedDept}
        />
        <DeleteDepartmentModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedDept(null); }}
          departmentId={selectedDept?.id}
          refetchDashboard={refetchDashboard}
        />
      </div>
    </DashboardLayout>
  );
};

export default AllDepartment;
