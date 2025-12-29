import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiHome, FiGrid } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Pencil, Trash2, Plus, List } from "lucide-react";
import AddEmployeePopup from "../../components/Employee/AddEmployeeModal";
import EmployeeGridView from "../../pages/EmployeePart/EmployeeGridView";

const AllEmployee = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 🔹 New: View mode state
  const itemsPerPage = viewMode === "list" ? 7 : 8; // 8 cards per page in grid view
  const navigate = useNavigate();
  const openProfile = (id) => {
    navigate(`/employee-profile/${id}`);
  };

  // 🔹 Sample Employee Data
  const employees = [
    {
      id: "EMP001",
      name: "John Doe",
      image: "https://i.pravatar.cc/50?img=15",
      department: "Human Resources",
      designation: "HR Manager",
      gender: "Male",
      dateOfJoining: "2023-01-15",
      status: "Active",
      projects: 20,
      done: 13,
      progress: 7,
      productivity: 65,
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      image: "https://i.pravatar.cc/50?img=16",
      department: "IT Support",
      designation: "Support Engineer",
      gender: "Female",
      dateOfJoining: "2022-08-10",
      status: "Terminate",
      projects: 30,
      done: 10,
      progress: 20,
      productivity: 30,
    },
    {
      id: "EMP003",
      name: "Michael Lee",
      image: "https://i.pravatar.cc/50?img=17",
      department: "Sales",
      designation: "Sales Executive",
      gender: "Male",
      dateOfJoining: "2021-05-05",
      status: "Resign",
      projects: 25,
      done: 7,
      progress: 18,
      productivity: 20,
    },
    {
      id: "EMP004",
      name: "Priya Patel",
      image: "https://i.pravatar.cc/50?img=18",
      department: "Finance",
      designation: "Accountant",
      gender: "Female",
      dateOfJoining: "2020-09-21",
      status: "Blocked",
      projects: 15,
      done: 13,
      progress: 2,
      productivity: 90,
    },
    {
      id: "EMP005",
      name: "Amit Kumar",
      image: "https://i.pravatar.cc/50?img=19",
      department: "Marketing",
      designation: "Manager",
      gender: "Male",
      dateOfJoining: "2019-12-11",
      status: "Hold",
      projects: 15,
      done: 2,
      progress: 13,
      productivity: 10,
    },
    {
      id: "EMP006",
      name: "Linda Ray",
      image: "https://i.pravatar.cc/50?img=20",
      department: "Marketing",
      designation: "Software Developer",
      gender: "Female",
      dateOfJoining: "2019-12-11",
      status: "Hold",
      projects: 20,
      done: 10,
      progress: 10,
      productivity: 50,
    },
    {
      id: "EMP007",
      name: "Rebecca Smith",
      image: "https://i.pravatar.cc/50?img=21",
      department: "Marketing",
      designation: "Tester",
      gender: "Female",
      dateOfJoining: "2019-12-11",
      status: "Active",
      projects: 30,
      done: 22,
      progress: 8,
      productivity: 80,
    },
    {
      id: "EMP008",
      name: "Harvey Smith",
      image: "https://i.pravatar.cc/50?img=22",
      department: "Development",
      designation: "Developer",
      gender: "Male",
      dateOfJoining: "2020-03-15",
      status: "Active",
      projects: 25,
      done: 7,
      progress: 18,
      productivity: 20,
    },
  ];

  // 🔹 Filtering Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const handleAddEmployee = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 🔹 Color badge logic
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Terminate":
        return "bg-red-100 text-red-600";
      case "Resign":
        return "bg-yellow-100 text-yellow-600";
      case "Blocked":
        return "bg-gray-200 text-gray-600";
      case "Hold":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          {/* Left: Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Employees</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> HRM /{" "}
              <span className="text-[#FF7B1D] font-medium">All Employee</span>
            </p>
          </div>

          {/* Right Side: Status Filters + List/Grid + Add Button */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Status Filter Buttons */}
            {["All", "Active", "Terminate", "Resign", "Blocked", "Hold"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              )
            )}

            {/* List / Grid Buttons (RIGHT SIDE) */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-sm ml-2">
              <button
                onClick={() => {
                  setViewMode("list");
                  setCurrentPage(1);
                }}
                className={`px-2 py-2 font-semibold text-sm transition flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <List size={18} />
              </button>

              <button
                onClick={() => {
                  setViewMode("grid");
                  setCurrentPage(1);
                }}
                className={`px-2 py-2 font-semibold text-sm transition flex items-center gap-2 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiGrid size={18} />
              </button>
            </div>

            {/* Add Employee Button */}
            <button
              onClick={handleAddEmployee}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:from-orange-600 hover:to-orange-700 hover:opacity-90 transition ml-2"
            >
              <Plus size={18} />
              Add Employee
            </button>
          </div>
        </div>

        {/* 🔹 Conditional Rendering: List or Grid View */}
        {viewMode === "list" ? (
          // LIST VIEW
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold">S.N</th>
                  <th className="py-3 px-4 font-semibold">Profile Image</th>
                  <th className="py-3 px-4 font-semibold">Employee ID</th>
                  <th className="py-3 px-4 font-semibold">Employee Name</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Designation</th>
                  <th className="py-3 px-4 font-semibold">Gender</th>
                  <th className="py-3 px-4 font-semibold">Date of Joining</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <img
                            src={emp.image}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                          />
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 font-medium text-orange-600 cursor-pointer "
                        onClick={() => openProfile(emp.id)}
                      >
                        {emp.id}
                      </td>

                      <td
                        className="py-3 px-4 text-orange-600 cursor-pointer"
                        onClick={() => openProfile(emp.id)}
                      >
                        {emp.name}
                      </td>

                      <td className="py-3 px-4">{emp.department}</td>
                      <td className="py-3 px-4">{emp.designation}</td>
                      <td className="py-3 px-4">{emp.gender}</td>
                      <td className="py-3 px-4">{emp.dateOfJoining}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                            emp.status
                          )}`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openProfile(emp.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          >
                            <Eye size={18} />
                          </button>

                          <button className="text-[#FF7B1D] hover:bg-red-50 rounded-sm transition-colors p-2">
                            <Pencil size={18} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-6 text-gray-500 font-medium text-sm"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // GRID VIEW
          <EmployeeGridView employees={currentEmployees} />
        )}

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-sm text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transition"
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${
                  currentPage === i + 1
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
            className="px-4 py-2 rounded-sm text-white font-semibold bg-[#22C55E] hover:opacity-90 transition"
          >
            Next
          </button>
        </div>

        {/* 🔹 Add Employee Modal */}
        {isModalOpen && (
          <AddEmployeePopup isOpen={isModalOpen} onClose={handleCloseModal} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllEmployee;
