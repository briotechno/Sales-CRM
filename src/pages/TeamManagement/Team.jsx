import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Home,
  X,
  DollarSign,
  Handshake,
  Target,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function TeamManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDesignation, setSelectedDesignation] = useState("All");

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #f97316, #ea580c);
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #ea580c, #c2410c);
    }
  `;
  const [teams, setTeams] = useState([
    {
      id: "TM001",
      name: "Development Team",
      members: 8,
      date: "2024-01-15",
      status: "Active",
    },
    {
      id: "TM002",
      name: "Marketing Team",
      members: 5,
      date: "2024-02-10",
      status: "Active",
    },
    {
      id: "TM003",
      name: "Sales Team",
      members: 12,
      date: "2024-01-20",
      status: "Inactive",
    },
    {
      id: "TM004",
      name: "Design Team",
      members: 6,
      date: "2024-03-05",
      status: "Active",
    },
    {
      id: "TM005",
      name: "Support Team",
      members: 10,
      date: "2024-02-28",
      status: "Active",
    },
    {
      id: "TM006",
      name: "HR Team",
      members: 4,
      date: "2024-01-10",
      status: "Active",
    },
    {
      id: "TM007",
      name: "Finance Team",
      members: 7,
      date: "2024-02-15",
      status: "Inactive",
    },
    {
      id: "TM008",
      name: "Operations Team",
      members: 9,
      date: "2024-03-01",
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
    selectedEmployees: [],
  });

  const employees = [
    { name: "John Doe", department: "Development", designation: "Manager" },
    { name: "Jane Smith", department: "Development", designation: "Team Lead" },
    {
      name: "Mike Johnson",
      department: "Development",
      designation: "Developer",
    },
    { name: "Sarah Williams", department: "Marketing", designation: "Manager" },
    { name: "David Brown", department: "Marketing", designation: "Executive" },
    { name: "Emily Davis", department: "Sales", designation: "Manager" },
    { name: "Chris Wilson", department: "Sales", designation: "Team Lead" },
    { name: "Lisa Anderson", department: "Sales", designation: "Executive" },
    { name: "Robert Taylor", department: "HR", designation: "Manager" },
    { name: "Maria Garcia", department: "HR", designation: "Executive" },
    { name: "James Martinez", department: "Finance", designation: "Manager" },
    { name: "Patricia Lee", department: "Finance", designation: "Accountant" },
    { name: "Michael White", department: "Design", designation: "Team Lead" },
    { name: "Jennifer Harris", department: "Design", designation: "Designer" },
  ];

  const departments = [
    "All",
    ...new Set(employees.map((emp) => emp.department)),
  ];
  const designations = [
    "All",
    ...new Set(employees.map((emp) => emp.designation)),
  ];

  const handleSubmit = () => {
    if (!formData.teamName) return;

    const newTeam = {
      id: `TM${String(teams.length + 1).padStart(3, "0")}`,
      name: formData.teamName,
      members: formData.selectedEmployees.length,
      date: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setTeams([...teams, newTeam]);
    setFormData({ teamName: "", description: "", selectedEmployees: [] });
    setSelectedDepartment("All");
    setSelectedDesignation("All");
    setShowCreateForm(false);
  };

  const handleEmployeeToggle = (employee) => {
    const employeeKey = `${employee.name}-${employee.department}`;
    setFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.some(
        (e) => `${e.name}-${e.department}` === employeeKey
      )
        ? prev.selectedEmployees.filter(
          (e) => `${e.name}-${e.department}` !== employeeKey
        )
        : [...prev.selectedEmployees, employee],
    }));
  };

  // 1. States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Teams data (or fetched data)

  // 3. Filtering logic
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. Pagination (must be AFTER filteredTeams)
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;

  const currentTeams = filteredTeams.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDelete = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  const toggleStatus = (id) => {
    setTeams(
      teams.map((team) =>
        team.id === id
          ? {
            ...team,
            status: team.status === "Active" ? "Inactive" : "Active",
          }
          : team
      )
    );
  };

  const closeModal = () => {
    setShowCreateForm(false);
    setSelectedDepartment("All");
    setSelectedDesignation("All");
    setFormData({ teamName: "", description: "", selectedEmployees: [] });
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesDepartment =
      selectedDepartment === "All" || emp.department === selectedDepartment;
    const matchesDesignation =
      selectedDesignation === "All" || emp.designation === selectedDesignation;
    return matchesDepartment && matchesDesignation;
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getDesignationColor = (designation) => {
    switch (designation) {
      case "Manager":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Team Lead":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Developer":
        return "bg-green-100 text-green-700 border-green-300";
      case "Executive":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Designer":
        return "bg-pink-100 text-pink-700 border-pink-300";
      case "Accountant":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        <style>{scrollbarStyles}</style>
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between mb-4 bg-white border-b py-3">
            <div className="">
              <h1 className="text-3xl font-bold text-gray-800">
                Team Management
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Home className="text-gray-700" size={14} />
                <span className="text-gray-400"></span> HRM /{" "}
                <span className="text-orange-500 font-medium">
                  All Team
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:from-orange-600 hover:to-orange-700 hover:opacity-90 transition ml-2"
            >
              <Plus size={18} />
              Create Team
            </button>
          </div>

          {/* Modal Popup */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users size={24} />
                    Create New Team
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      placeholder="Enter team name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                      rows={3}
                      placeholder="Enter team description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Employees
                    </label>

                    <div className="flex gap-3 mb-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Filter by Department
                        </label>
                        <select
                          value={selectedDepartment}
                          onChange={(e) =>
                            setSelectedDepartment(e.target.value)
                          }
                          className="w-full px-3 py-2 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm"
                        >
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Filter by Designation
                        </label>
                        <select
                          value={selectedDesignation}
                          onChange={(e) =>
                            setSelectedDesignation(e.target.value)
                          }
                          className="w-full px-3 py-2 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm"
                        >
                          {designations.map((desig) => (
                            <option key={desig} value={desig}>
                              {desig}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3 p-3 bg-orange-50 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-700">
                        Selected Employees: {formData.selectedEmployees.length}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1 border-2 border-gray-100 custom-scrollbar">
                      {filteredEmployees.map((employee) => {
                        const isSelected = formData.selectedEmployees.some(
                          (e) =>
                            e.name === employee.name &&
                            e.department === employee.department
                        );
                        return (
                          <label
                            key={`${employee.name}-${employee.department}`}
                            className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all ${isSelected
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 bg-white"
                              }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleEmployeeToggle(employee)}
                                className="w-4 h-4 text-orange-500 focus:ring-2 focus:ring-orange-500"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {employee.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {employee.department}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-bold border ${getDesignationColor(
                                employee.designation
                              )}`}
                            >
                              {employee.designation}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {filteredEmployees.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-gray-100">
                        <Filter size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">
                          No employees found with selected filters
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Create Team
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statement Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <NumberCard
              title="Total Team"
              number={"248"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Total Member"
              number={"186"}
              icon={<DollarSign className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Total Deals"
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

          {/* Teams Table */}
          <div className="bg-white shadow-xl overflow-hidden border-2 border-orange-50">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Teams Overview</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b ">
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 w-16">
                      SN
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Team ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      Total Members
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      Date Creation
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                      Status
                    </th>
                    <th className="px-16 py-4 text-right text-sm font-bold text-gray-700 w-32">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTeams.map((team, index) => (
                    <tr
                      key={team.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-700 font-medium text-left">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-orange-600 hover:text-blue-800">
                          {team.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-orange-600 hover:text-blue-800 font-semibold">
                          {team.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="bg-orange-100 p-1.5">
                            <Users size={14} className="text-orange-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {team.members}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {team.date}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleStatus(team.id)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold transition-all ${team.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {team.status}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-end">
                          <button className="p-2 hover:bg-blue-50 transition-colors group">
                            <Eye
                              size={18}
                              className="text-blue-600 group-hover:scale-110 transition-transform"
                            />
                          </button>
                          <button className="p-2 hover:bg-orange-50 transition-colors group">
                            <Edit2
                              size={18}
                              className="text-orange-600 group-hover:scale-110 transition-transform"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(team.id)}
                            className="p-2 hover:bg-red-50 transition-colors group"
                          >
                            <Trash2
                              size={18}
                              className="text-red-600 group-hover:scale-110 transition-transform"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
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
      </div>
    </DashboardLayout>
  );
}
