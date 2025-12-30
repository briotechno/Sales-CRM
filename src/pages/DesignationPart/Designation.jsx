import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { Pencil, Trash2, Eye, Grid, FileDown, Users, Warehouse, Handshake, Target, Plus } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import AddDesignationModal from "../../components/Designation/AddDesignationModal";
import NumberCard from "../../components/NumberCard";

const AllDesignation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 7;

  // 🔹 Handle add designation submit
  const handleAddSubmit = (data) => {
    console.log("🟢 New Designation Added:", data);
    setIsAddModalOpen(false);
  };

  // 🔹 Dummy Data
  const designations = [
    {
      id: "DSG001",
      department: "Human Resources",
      name: "HR Manager",
      image: "https://i.pravatar.cc/50?img=11",
      description: "Responsible for recruitment and HR operations.",
      employees: 4,
      createdDate: "2024-03-15",
      status: "Active",
    },
    {
      id: "DSG002",
      department: "Sales",
      name: "Sales Executive",
      image: "https://i.pravatar.cc/50?img=12",
      description: "Handles client sales and relationship management.",
      employees: 8,
      createdDate: "2024-04-01",
      status: "Inactive",
    },
    {
      id: "DSG003",
      department: "IT Support",
      name: "Support Engineer",
      image: "https://i.pravatar.cc/50?img=13",
      description: "Manages system maintenance and troubleshooting.",
      employees: 5,
      createdDate: "2024-02-12",
      status: "Active",
    },
    {
      id: "DSG004",
      department: "Finance",
      name: "Accountant",
      image: "https://i.pravatar.cc/50?img=14",
      description: "Oversees budgeting and financial reporting.",
      employees: 3,
      createdDate: "2024-01-20",
      status: "Inactive",
    },
    {
      id: "DSG005",
      department: "Finance",
      name: "Accountant",
      image: "https://i.pravatar.cc/50?img=14",
      description: "Oversees budgeting and financial reporting.",
      employees: 3,
      createdDate: "2024-01-20",
      status: "Inactive",
    },
    {
      id: "DSG006",
      department: "Finance",
      name: "Accountant",
      image: "https://i.pravatar.cc/50?img=14",
      description: "Oversees budgeting and financial reporting.",
      employees: 3,
      createdDate: "2024-01-20",
      status: "Inactive",
    },
    {
      id: "DSG007",
      department: "Human Resources",
      name: "HR Manager",
      image: "https://i.pravatar.cc/50?img=11",
      description: "Responsible for recruitment and HR operations.",
      employees: 4,
      createdDate: "2024-03-15",
      status: "Active",
    },
    {
      id: "DSG008",
      department: "Human Resources",
      name: "HR Manager",
      image: "https://i.pravatar.cc/50?img=11",
      description: "Responsible for recruitment and HR operations.",
      employees: 4,
      createdDate: "2024-03-15",
      status: "Active",
    },
  ];

  // 🔹 Filter + Pagination
  const filteredDesignations = designations.filter((dsg) => {
    const matchesSearch =
      dsg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsg.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || dsg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDesignations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDesignations = filteredDesignations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* 🔹 Header Section */}
        <div className="bg-white border-b py-2 flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Designation Module
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiHome className="text-gray-700 text-sm" />
              <span className="text-gray-400"></span> HRM /{" "}
              <span className="text-[#FF7B1D] font-medium">Designation</span>
            </p>
          </div>

          {/* 🔸 Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-sm font-semibold border text-sm transition ${statusFilter === status
                  ? "bg-gradient-to-r from-orange-500 to-orange-600  text-white border-[#FF7B1D]"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {status}
              </button>
            ))}

            <button className="p-2 border border-gray-300 rounded-sm hover:bg-gray-100">
              <Grid size={18} className="text-[#FF7B1D]" />
            </button>

            <button className="px-3 py-2 border border-gray-300 rounded-sm flex items-center gap-2 hover:bg-gray-100">
              <FileDown size={16} />
              <span className="text-sm font-medium">Export</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:from-orange-600 hover:to-orange-700 hover:opacity-90 transition ml-2"
            >
              <Plus size={18} />
              Add Designation
            </button>
          </div>
        </div>

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

        {/* 🧾 Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                <th className="py-3 px-4 font-semibold">S.N</th>
                <th className="py-3 px-4 font-semibold">Image</th>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Designation</th>
                <th className="py-3 px-4 font-semibold">Employees</th>
                <th className="py-3 px-4 font-semibold">Created Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentDesignations.length > 0 ? (
                currentDesignations.map((dsg, index) => (
                  <tr
                    key={dsg.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <img
                        src={dsg.image}
                        alt={dsg.name}
                        className="w-10 h-10 rounded-full border object-cover mx-auto"
                      />
                    </td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800 font-medium">{dsg.id}</td>
                    <td className="py-3 px-4 text-orange-600 hover:text-blue-800">{dsg.department}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {dsg.name}
                    </td>
                    <td className="py-3 px-4">{dsg.employees}</td>
                    <td className="py-3 px-4">{dsg.createdDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${dsg.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {dsg.status}
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
                    No designations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
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

      {/* 🔹 Add Designation Modal */}
      <AddDesignationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </DashboardLayout>
  );
};

export default AllDesignation;
