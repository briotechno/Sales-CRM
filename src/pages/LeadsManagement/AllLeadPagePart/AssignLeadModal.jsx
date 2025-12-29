import React, { useState } from "react";
import { X, Users, UserPlus } from "lucide-react";

export default function AssignLeadsModal({
  isOpen,
  onClose,
  selectedLeadsCount,
  onAssign,
}) {
  const [assignView, setAssignView] = useState("teams");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [teamFilter, setTeamFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState({
    department: "All",
    designation: "All",
    performance: "All",
  });

  const teamsData = [
    {
      id: "T001",
      name: "Sales Team Alpha",
      department: "Sales",
      members: 8,
      activeLeads: 45,
      closedDeals: 23,
      performance: "Excellent",
    },
    {
      id: "T002",
      name: "Marketing Champions",
      department: "Marketing",
      members: 6,
      activeLeads: 32,
      closedDeals: 18,
      performance: "Good",
    },
    {
      id: "T003",
      name: "Support Squad",
      department: "Support",
      members: 10,
      activeLeads: 28,
      closedDeals: 15,
      performance: "Good",
    },
    {
      id: "T004",
      name: "Sales Team Beta",
      department: "Sales",
      members: 5,
      activeLeads: 20,
      closedDeals: 12,
      performance: "Average",
    },
    {
      id: "T005",
      name: "Development Team",
      department: "Development",
      members: 7,
      activeLeads: 15,
      closedDeals: 8,
      performance: "Average",
    },
  ];

  const employeesData = [
    {
      id: "E001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Sales",
      designation: "Senior Sales Executive",
      activeLeads: 12,
      closedDeals: 8,
      performance: "Best Performer",
      team: "Sales Team Alpha",
    },
    {
      id: "E002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      designation: "Marketing Manager",
      activeLeads: 10,
      closedDeals: 6,
      performance: "Good Performer",
      team: "Marketing Champions",
    },
    {
      id: "E003",
      name: "Mike Johnson",
      email: "mike.j@company.com",
      department: "Support",
      designation: "Support Lead",
      activeLeads: 8,
      closedDeals: 5,
      performance: "Good Performer",
      team: "Support Squad",
    },
    {
      id: "E004",
      name: "Sarah Williams",
      email: "sarah.w@company.com",
      department: "Sales",
      designation: "Sales Executive",
      activeLeads: 15,
      closedDeals: 10,
      performance: "Best Performer",
      team: "Sales Team Alpha",
    },
    {
      id: "E005",
      name: "Robert Brown",
      email: "robert.b@company.com",
      department: "Sales",
      designation: "Junior Sales Executive",
      activeLeads: 6,
      closedDeals: 3,
      performance: "Average Performer",
      team: "Sales Team Beta",
    },
    {
      id: "E006",
      name: "Emily Davis",
      email: "emily.d@company.com",
      department: "Marketing",
      designation: "Content Strategist",
      activeLeads: 7,
      closedDeals: 4,
      performance: "Good Performer",
      team: "Marketing Champions",
    },
    {
      id: "E007",
      name: "David Wilson",
      email: "david.w@company.com",
      department: "Development",
      designation: "Tech Lead",
      activeLeads: 5,
      closedDeals: 2,
      performance: "Average Performer",
      team: "Development Team",
    },
    {
      id: "E008",
      name: "Lisa Anderson",
      email: "lisa.a@company.com",
      department: "Support",
      designation: "Customer Success Manager",
      activeLeads: 9,
      closedDeals: 7,
      performance: "Best Performer",
      team: "Support Squad",
    },
  ];

  const handleToggleTeam = (teamId) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleToggleEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredTeams = teamsData.filter((team) => {
    if (teamFilter === "All") return true;
    return team.department === teamFilter;
  });

  const filteredEmployees = employeesData.filter((employee) => {
    const matchesDepartment =
      employeeFilter.department === "All" ||
      employee.department === employeeFilter.department;
    const matchesDesignation =
      employeeFilter.designation === "All" ||
      employee.designation === employeeFilter.designation;
    const matchesPerformance =
      employeeFilter.performance === "All" ||
      employee.performance === employeeFilter.performance;
    return matchesDepartment && matchesDesignation && matchesPerformance;
  });

  const handleAssign = () => {
    const totalRecipients = selectedTeams.length + selectedEmployees.length;

    if (totalRecipients === 0) {
      alert("Please select at least one team or employee");
      return;
    }

    onAssign({
      teams: selectedTeams,
      employees: selectedEmployees,
    });

    setSelectedTeams([]);
    setSelectedEmployees([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assign Leads</h2>
            <p className="text-sm text-gray-600 mt-1">
              Assigning <strong>{selectedLeadsCount}</strong> lead(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex border-b border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={() => setAssignView("teams")}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              assignView === "teams"
                ? "bg-[#FF7B1D] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="inline mr-2" size={18} />
            Teams ({selectedTeams.length} selected)
          </button>

          <button
            onClick={() => setAssignView("employees")}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              assignView === "employees"
                ? "bg-[#FF7B1D] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserPlus className="inline mr-2" size={18} />
            Employees ({selectedEmployees.length} selected)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {assignView === "teams" ? (
            <div>
              {/* Team Filters */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex gap-3 items-center">
                  <label className="text-sm font-semibold text-gray-700">
                    Department:
                  </label>
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                  >
                    <option value="All">All Departments</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Support">Support</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
              </div>

              {/* Teams List */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeams.map((team) => {
                  const isSelected = selectedTeams.includes(team.id);

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleToggleTeam(team.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        isSelected
                          ? "border-[#FF7B1D] bg-orange-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleTeam(team.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <h3 className="font-bold text-gray-800 text-lg">
                              {team.name}
                            </h3>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 ml-6">
                            <p>
                              <strong>Department:</strong> {team.department}
                            </p>
                            <p>
                              <strong>Members:</strong> {team.members}
                            </p>
                            <p>
                              <strong>Active Leads:</strong> {team.activeLeads}
                            </p>
                            <p>
                              <strong>Closed Deals:</strong> {team.closedDeals}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            team.performance === "Excellent"
                              ? "bg-green-100 text-green-600"
                              : team.performance === "Good"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {team.performance}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* Employee Filters */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={employeeFilter.department}
                      onChange={(e) =>
                        setEmployeeFilter({
                          ...employeeFilter,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    >
                      <option value="All">All</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Support">Support</option>
                      <option value="Development">Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Designation
                    </label>
                    <select
                      value={employeeFilter.designation}
                      onChange={(e) =>
                        setEmployeeFilter({
                          ...employeeFilter,
                          designation: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    >
                      <option value="All">All Designations</option>
                      <option value="Senior Sales Executive">
                        Senior Sales Executive
                      </option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Junior Sales Executive">
                        Junior Sales Executive
                      </option>
                      <option value="Marketing Manager">
                        Marketing Manager
                      </option>
                      <option value="Support Lead">Support Lead</option>
                      <option value="Tech Lead">Tech Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Performance
                    </label>
                    <select
                      value={employeeFilter.performance}
                      onChange={(e) =>
                        setEmployeeFilter({
                          ...employeeFilter,
                          performance: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    >
                      <option value="All">All</option>
                      <option value="Best Performer">Best Performer</option>
                      <option value="Good Performer">Good Performer</option>
                      <option value="Average Performer">
                        Average Performer
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Employees List */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEmployees.map((employee) => {
                  const isSelected = selectedEmployees.includes(employee.id);
                  const initials = employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={employee.id}
                      onClick={() => handleToggleEmployee(employee.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        isSelected
                          ? "border-[#FF7B1D] bg-orange-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleEmployee(employee.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 mt-1 cursor-pointer"
                        />

                        <div className="w-10 h-10 bg-[#FF7B1D] text-white rounded-full flex items-center justify-center font-semibold">
                          {initials}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">
                            {employee.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {employee.email}
                          </p>

                          <div className="mt-2 space-y-1 text-xs text-gray-600">
                            <p>
                              <strong>Department:</strong> {employee.department}
                            </p>
                            <p>
                              <strong>Designation:</strong>{" "}
                              {employee.designation}
                            </p>
                            <p>
                              <strong>Team:</strong> {employee.team}
                            </p>
                            <p>
                              <strong>Active Leads:</strong>{" "}
                              {employee.activeLeads} | <strong>Closed:</strong>{" "}
                              {employee.closedDeals}
                            </p>
                          </div>

                          <span
                            className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                              employee.performance === "Best Performer"
                                ? "bg-green-100 text-green-600"
                                : employee.performance === "Good Performer"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {employee.performance}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <strong>{selectedTeams.length + selectedEmployees.length}</strong>{" "}
              recipient(s) selected
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleAssign}
                className="px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded-sm hover:opacity-90 transition"
              >
                Assign Leads
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
