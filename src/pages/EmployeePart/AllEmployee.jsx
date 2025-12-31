import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiGrid } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Pencil, Trash2, Plus, List, Warehouse, Users, Handshake, Target, Search } from "lucide-react";
import AddEmployeeModal from "../../components/Employee/AddEmployeeModal";
import EditEmployeeModal from "../../components/Employee/EditEmployeeModal";
import DeleteEmployeeModal from "../../components/Employee/DeleteEmployeeModal";
import EmployeeGridView from "../../pages/EmployeePart/EmployeeGridView";
import NumberCard from "../../components/NumberCard";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const AllEmployee = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const itemsPerPage = viewMode === "list" ? 7 : 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const navigate = useNavigate();

  const { data, isLoading } = useGetEmployeesQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter,
    search: searchTerm,
  });

  const { data: deptData } = useGetDepartmentsQuery({ limit: 1 });
  const { data: dsgData } = useGetDesignationsQuery({ limit: 1 });

  const employees = data?.employees || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };
  const totalDepts = deptData?.pagination?.total || 0;
  const totalDsgs = dsgData?.pagination?.total || 0;

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleView = (emp) => {
    navigate(`/employee-profile/${emp.id}`);
  };

  const handleDelete = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-600";
      case "Terminate": return "bg-red-100 text-red-600";
      case "Resign": return "bg-yellow-100 text-yellow-600";
      case "Blocked": return "bg-gray-200 text-gray-600";
      case "Hold": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, pagination.total || 0);

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4 bg-white border-b py-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Employees</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              HRM / <span className="text-[#FF7B1D] font-medium">All Employee</span>
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {["All", "Active", "Terminate", "Resign", "Blocked", "Hold"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-2 py-2 rounded-sm font-semibold border text-sm transition ${statusFilter === status
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
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded-sm ml-2">
              <button
                onClick={() => { setViewMode("list"); setCurrentPage(1); }}
                className={`px-2 py-2 font-semibold text-sm transition flex items-center gap-2 ${viewMode === "list" ? "bg-[#FF7B1D] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => { setViewMode("grid"); setCurrentPage(1); }}
                className={`px-2 py-2 font-semibold text-sm transition flex items-center gap-2 ${viewMode === "grid" ? "bg-[#FF7B1D] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <FiGrid size={18} />
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:opacity-90 transition ml-2 shadow-md"
            >
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>

        {/* Statement Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <NumberCard
            title="Total Employee"
            number={pagination.total.toString()}
            icon={<Users className="text-blue-600" size={24} />}
            iconBgColor="bg-blue-100"
            lineBorderClass="border-blue-500"
          />
          <NumberCard
            title="Total Department"
            number={totalDepts.toString()}
            icon={<Warehouse className="text-green-600" size={24} />}
            iconBgColor="bg-green-100"
            lineBorderClass="border-green-500"
          />
          <NumberCard
            title="Total Designation"
            number={totalDsgs.toString()}
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

        {viewMode === "list" ? (
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold">S.N</th>
                  <th className="py-3 px-4 font-semibold">Profile</th>
                  <th className="py-3 px-4 font-semibold text-left">Emp ID</th>
                  <th className="py-3 px-4 font-semibold text-left">Employee Name</th>
                  <th className="py-3 px-4 font-semibold text-left">Department</th>
                  <th className="py-3 px-4 font-semibold text-left">Designation</th>
                  <th className="py-3 px-4 font-semibold">Join Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  <tr><td colSpan="9" className="py-10 text-gray-500">Loading...</td></tr>
                ) : employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          {emp.profile_picture_url ? (
                            <img src={emp.profile_picture_url} alt="" className="w-10 h-10 rounded-full border border-gray-300 object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                              {emp.employee_name?.substring(0, 1)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-left font-medium text-orange-600 cursor-pointer" onClick={() => navigate(`/employee-profile/${emp.id}`)}>
                        {emp.employee_id}
                      </td>
                      <td className="py-3 px-4 text-left font-medium text-gray-800">{emp.employee_name}</td>
                      <td className="py-3 px-4 text-left">{emp.department_name}</td>
                      <td className="py-3 px-4 text-left">{emp.designation_name}</td>
                      <td className="py-3 px-4">{new Date(emp.joining_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(emp.status)}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleView(emp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => handleEdit(emp)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(emp)} className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" className="py-10 text-gray-500">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <EmployeeGridView employees={employees} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{indexOfLastItem}</span> of <span className="font-bold">{pagination.total}</span> employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
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
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditEmployeeModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedEmployee(null); }} employee={selectedEmployee} />
      <DeleteEmployeeModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedEmployee(null); }} employeeId={selectedEmployee?.id} />
    </DashboardLayout>
  );
};

export default AllEmployee;
