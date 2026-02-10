import React, { useState, useMemo } from "react";
import { X, Users, UserPlus, Building2, Briefcase, Star, Search, CheckCircle2 } from "lucide-react";
import { useGetEmployeesQuery } from "../../../store/api/employeeApi";
import { useGetTeamsQuery } from "../../../store/api/teamApi";
import { useGetDepartmentsQuery } from "../../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../../store/api/designationApi";

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
    search: "",
  });

  // Fetch dynamic data
  const { data: teamsDataResponse, isLoading: teamsLoading } = useGetTeamsQuery({
    limit: 1000,
    status: 'Active',
    department: teamFilter !== 'All' ? teamFilter : ''
  });

  const { data: employeesDataResponse, isLoading: employeesLoading } = useGetEmployeesQuery({
    limit: 1000,
    status: 'Active',
    search: employeeFilter.search
  });

  const { data: departmentsData } = useGetDepartmentsQuery({ limit: 1000 });
  const { data: designationsData } = useGetDesignationsQuery({ limit: 1000 });

  const teams = teamsDataResponse?.teams || [];
  const employees = employeesDataResponse?.employees || [];
  const departments = departmentsData?.departments || [];
  const designations = designationsData?.designations || [];

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

  const filteredTeams = useMemo(() => {
    // Backend already filters by department if passed
    return teams;
  }, [teams]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesDepartment =
        employeeFilter.department === "All" ||
        employee.department_id === parseInt(employeeFilter.department);
      const matchesDesignation =
        employeeFilter.designation === "All" ||
        employee.designation_id === parseInt(employeeFilter.designation);

      return matchesDepartment && matchesDesignation;
    });
  }, [employees, employeeFilter.department, employeeFilter.designation]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 font-primary">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-2.5 rounded-sm">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white capitalize tracking-wide leading-tight">
                Assign Leads
              </h2>
              <p className="text-xs text-orange-50 font-medium opacity-90">
                Assigning <strong className="text-white">{selectedLeadsCount}</strong> selected lead(s) to team members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setAssignView("teams")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all border-b-2 ${assignView === "teams"
              ? "bg-white text-[#FF7B1D] border-[#FF7B1D]"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-white"
              }`}
          >
            <Users size={18} />
            TEAMS ({filteredTeams.length})
          </button>

          <button
            onClick={() => setAssignView("employees")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all border-b-2 ${assignView === "employees"
              ? "bg-white text-[#FF7B1D] border-[#FF7B1D]"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-white"
              }`}
          >
            <UserPlus size={18} />
            EMPLOYEES ({filteredEmployees.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar">
          {assignView === "teams" ? (
            <div className="p-6">
              {/* Team Filters */}
              <div className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#FF7B1D]" />
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">Department:</span>
                </div>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="min-w-[200px] px-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-medium"
                >
                  <option value="All">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </select>

                {teamsLoading && <span className="text-xs text-gray-400 animate-pulse">Loading teams...</span>}
              </div>

              {/* Teams List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((team) => {
                  const isSelected = selectedTeams.includes(team.id);

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleToggleTeam(team.id)}
                      className={`relative group bg-white border-2 rounded-sm p-5 cursor-pointer transition-all duration-200 ${isSelected
                        ? "border-[#FF7B1D] shadow-md ring-1 ring-[#FF7B1D] ring-opacity-10"
                        : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-[#FF7B1D]">
                          <CheckCircle2 size={20} fill="currentColor" className="text-white fill-[#FF7B1D]" />
                        </div>
                      )}

                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-sm ${isSelected ? 'bg-orange-100 text-[#FF7B1D]' : 'bg-gray-100 text-gray-400'}`}>
                            <Users size={20} />
                          </div>
                          <h3 className="font-bold text-gray-800 text-base leading-tight uppercase tracking-wide">
                            {team.team_name}
                          </h3>
                        </div>

                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Users size={14} className="text-gray-400" />
                            <span className="text-gray-500 font-semibold uppercase">Members:</span>
                            <span className="text-gray-800 font-bold">{team.total_members || 0}</span>
                          </div>
                        </div>

                        {team.description && (
                          <p className="mt-4 text-[10px] text-gray-400 line-clamp-2 italic border-t border-gray-50 pt-2">
                            {team.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!teamsLoading && filteredTeams.length === 0 && (
                <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <Users size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No teams found matching your criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {/* Employee Filters */}
              <div className="mb-6 bg-white p-5 rounded-sm border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="SEARCH BY NAME OR EMAIL..."
                      value={employeeFilter.search}
                      onChange={(e) => setEmployeeFilter({ ...employeeFilter, search: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-bold uppercase tracking-wider"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#FF7B1D]" />
                    <select
                      value={employeeFilter.department}
                      onChange={(e) => setEmployeeFilter({ ...employeeFilter, department: e.target.value })}
                      className="px-3 py-2.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-bold uppercase"
                    >
                      <option value="All">ALL DEPARTMENTS</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-[#FF7B1D]" />
                    <select
                      value={employeeFilter.designation}
                      onChange={(e) => setEmployeeFilter({ ...employeeFilter, designation: e.target.value })}
                      className="px-3 py-2.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-bold uppercase"
                    >
                      <option value="All">ALL DESIGNATIONS</option>
                      {designations.map(desig => (
                        <option key={desig.id} value={desig.id}>{desig.designation_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Employees List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => {
                  const isSelected = selectedEmployees.includes(employee.id);
                  const initials = employee.employee_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={employee.id}
                      onClick={() => handleToggleEmployee(employee.id)}
                      className={`relative group bg-white border-2 rounded-sm p-4 cursor-pointer transition-all duration-200 ${isSelected
                        ? "border-[#FF7B1D] shadow-md ring-1 ring-[#FF7B1D] ring-opacity-10"
                        : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-[#FF7B1D] z-10">
                          <CheckCircle2 size={18} fill="currentColor" className="text-white fill-[#FF7B1D]" />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-sm flex items-center justify-center font-bold text-sm tracking-tighter transition-colors ${isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-[#FF7B1D]'}`}>
                          {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">
                            {employee.employee_name}
                          </h3>
                          <p className="text-[10px] text-gray-400 truncate mb-2">
                            {employee.email}
                          </p>

                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[9px]">
                              <Building2 size={10} className="text-gray-400" />
                              <span className="text-gray-500 font-bold uppercase">{employee.department_name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px]">
                              <Briefcase size={10} className="text-gray-400" />
                              <span className="text-gray-500 font-bold uppercase">{employee.designation_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!employeesLoading && filteredEmployees.length === 0 && (
                <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <UserPlus size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No employees found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 px-4 py-2 rounded-sm border border-orange-100">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">Selection:</span>
                <span className="text-sm font-black text-[#FF7B1D]">
                  {selectedTeams.length} TEAMS | {selectedEmployees.length} EMPLOYEES
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-10 py-3 rounded-sm border-2 border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={handleAssign}
                disabled={selectedTeams.length === 0 && selectedEmployees.length === 0}
                className="flex-1 sm:flex-none px-10 py-3 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
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
