import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { Pencil, Trash2, Eye, Grid, FileDown, Plus, Target, Handshake, Warehouse, Users } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import AddDepartmentModal from "../../components/Department/AddDepartmentModal"; // adjust path if needed
import NumberCard from "../../components/NumberCard";

const AllDepartment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = [
    {
      id: "DEP001",
      name: "Human Resources",
      employees: 12,
      designations: 4,
      date: "2024-03-15",
      icon: "https://i.pravatar.cc/50?img=1",
      status: "Active",
    },
    {
      id: "DEP002",
      name: "Sales",
      employees: 20,
      designations: 5,
      date: "2024-05-10",
      icon: "https://i.pravatar.cc/50?img=2",
      status: "Inactive",
    },
    {
      id: "DEP003",
      name: "IT Support",
      employees: 15,
      designations: 3,
      date: "2024-07-22",
      icon: "https://i.pravatar.cc/50?img=3",
      status: "Active",
    },
    {
      id: "DEP004",
      name: "Finance",
      employees: 10,
      designations: 2,
      date: "2024-02-05",
      icon: "https://i.pravatar.cc/50?img=4",
      status: "Inactive",
    },
    {
      id: "DEP005",
      name: "Marketing",
      employees: 8,
      designations: 3,
      date: "2024-06-11",
      icon: "https://i.pravatar.cc/50?img=5",
      status: "Active",
    },
    {
      id: "DEP006",
      name: "Operations",
      employees: 11,
      designations: 4,
      date: "2024-08-01",
      icon: "https://i.pravatar.cc/50?img=6",
      status: "Active",
    },
    {
      id: "DEP007",
      name: "Customer Support",
      employees: 9,
      designations: 2,
      date: "2024-09-10",
      icon: "https://i.pravatar.cc/50?img=7",
      status: "Inactive",
    },
    {
      id: "DEP008",
      name: "Development",
      employees: 25,
      designations: 6,
      date: "2024-10-03",
      icon: "https://i.pravatar.cc/50?img=8",
      status: "Active",
    },
    {
      id: "DEP009",
      name: "Legal",
      employees: 5,
      designations: 2,
      date: "2024-01-20",
      icon: "https://i.pravatar.cc/50?img=9",
      status: "Inactive",
    },
    {
      id: "DEP010",
      name: "Procurement",
      employees: 14,
      designations: 3,
      date: "2024-03-28",
      icon: "https://i.pravatar.cc/50?img=10",
      status: "Active",
    },
  ];

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* 🔹 Header Section (All buttons + filters in one row) */}
        <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
          {/* Left Side */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Department</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> HRM /{" "}
              <span className="text-[#FF7B1D] font-medium">All Department</span>
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons (All, Active, Inactive) */}
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

            {/* Icons & Action Buttons */}
            <button className="p-2 border border-gray-300 rounded-sm hover:bg-gray-100">
              <Grid size={18} className="text-[#FF7B1D]" />
            </button>

            <button className="px-3 py-2 border border-gray-300 rounded-sm flex items-center gap-2 hover:bg-gray-100">
              <FileDown size={16} />
              <span className="text-sm font-medium">Export</span>
            </button>

            {/* <button
              onClick={() => setIsModalOpen(true)}
              className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 hover:from-orange-600 hover:to-orange-700  rounded-sm font-semibold flex items-center gap-2 hover:opacity-90"
            >
              <Plus size={16} /> Add Department
            </button> */}

            <AddDepartmentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:from-orange-600 hover:to-orange-700 hover:opacity-90 transition ml-2"
              onAdd={(data) => {
                console.log("New Department Added:", data);
                setIsModalOpen(false);
              }}
            />
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
            number={"186"}
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

            <tbody>
              {currentDepartments.length > 0 ? (
                currentDepartments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <img
                          src={dept.icon}
                          alt={dept.name}
                          className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800 font-medium">{dept.id}</td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800">{dept.name}</td>
                    <td className="py-3 px-4">{dept.employees}</td>
                    <td className="py-3 px-4">{dept.designations}</td>
                    <td className="py-3 px-4">{dept.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${dept.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors">
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
                    colSpan="9"
                    className="py-6 text-gray-500 font-medium text-sm"
                  >
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔸 Pagination Section */}
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
      </div>

    </DashboardLayout>
  );
};

export default AllDepartment;
