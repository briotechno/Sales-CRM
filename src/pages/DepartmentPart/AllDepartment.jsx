import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { Pencil, Trash2, Eye, Grid, FileDown, Plus, Target, Handshake, Warehouse, Users, Search } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import AddDepartmentModal from "../../components/Department/AddDepartmentModal";
import EditDepartmentModal from "../../components/Department/EditDepartmentModal";
import ViewDepartmentModal from "../../components/Department/ViewDepartmentModal";
import DeleteDepartmentModal from "../../components/Department/DeleteDepartmentModal";
import NumberCard from "../../components/NumberCard";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";

const AllDepartment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 6;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const { data, isLoading, isError } = useGetDepartmentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter,
    search: searchTerm
  });

  const departments = data?.departments || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const currentDepartments = departments;

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, data?.pagination?.total || 0);

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* 🔹 Header Section */}
        <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Department</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              HRM / <span className="text-[#FF7B1D] font-medium">All Department</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${statusFilter === status
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {status}
              </button>
            ))}

            <div className="relative">
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold flex items-center gap-2 hover:from-orange-600 hover:to-orange-700 transition shadow-md"
            >
              <Plus size={16} /> Add Department
            </button>
          </div>
        </div>

        {/* Statement Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <NumberCard
            title="Total Employee"
            number={"248"}
            icon={<Users className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Total Department"
            number={data?.pagination?.total || "0"}
            icon={<Warehouse className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Total Designation"
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

        {/* 🧾 Department Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                <th className="py-3 px-4 font-semibold">S.N</th>
                <th className="py-3 px-4 font-semibold">Icon</th>
                <th className="py-3 px-4 font-semibold">Department ID</th>
                <th className="py-3 px-4 font-semibold">Department Name</th>
                <th className="py-3 px-4 font-semibold">Employees</th>
                <th className="py-3 px-4 font-semibold">Designations</th>
                <th className="py-3 px-4 font-semibold">Date Created</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {currentDepartments.length > 0 ? (
                currentDepartments.map((dept, index) => (
                  <tr key={dept.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        {dept.icon ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${dept.icon}`}
                            alt={dept.department_name}
                            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {dept.department_name?.substring(0, 1)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-orange-600 font-medium">{dept.department_id}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{dept.department_name}</td>
                    <td className="py-3 px-4">{dept.employee_count || 0}</td>
                    <td className="py-3 px-4">{dept.designation_count || 0}</td>
                    <td className="py-3 px-4">{new Date(dept.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${dept.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => { setSelectedDept(dept); setIsViewModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => { setSelectedDept(dept); setIsEditModalOpen(true); }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => { setSelectedDept(dept); setIsDeleteModalOpen(true); }}
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
                  <td colSpan="9" className="py-10 text-gray-500 font-medium">
                    {isLoading ? "Loading..." : "No departments found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔸 Pagination Section */}
        <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{indexOfLastItem}</span> of <span className="font-bold">{data?.pagination?.total || 0}</span> departments
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 border rounded-sm text-sm font-bold ${currentPage === i + 1 ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDepartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditDepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedDept(null); }}
        department={selectedDept}
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
      />
    </DashboardLayout>
  );
};

export default AllDepartment;
