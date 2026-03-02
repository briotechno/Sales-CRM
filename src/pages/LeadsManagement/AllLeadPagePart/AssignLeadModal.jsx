import React, { useState, useMemo, useEffect } from "react";
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
  title = "Assign Leads",
  buttonText = "Assign Leads",
  selectedLeadsList = []
}) {
  const [assignView, setAssignView] = useState("teams");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && selectedLeadsList.length === 1) {
      // If single lead, we could pre-populate if we had the IDs, 
      // but usually the user wants to pick NEW ones for 'Change Assignment'
    }
  }, [isOpen, selectedLeadsList]);
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
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white capitalize tracking-wide leading-tight">
                {title}
              </h2>
              <p className="text-xs text-orange-50 font-medium opacity-90">
                {title.toLowerCase().includes('change') ? 'Updating' : 'Assigning'} <strong className="text-white">{selectedLeadsCount}</strong> selected lead(s) to employees
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

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
          <div className="p-6 pb-0 flex-shrink-0">
            {/* Employee Search & Filters */}
            <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="SEARCH BY NAME OR EMAIL..."
                    value={employeeFilter.search}
                    onChange={(e) => setEmployeeFilter({ ...employeeFilter, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-bold uppercase tracking-wider"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-[#FF7B1D]" />
                  <select
                    value={employeeFilter.department}
                    onChange={(e) => setEmployeeFilter({ ...employeeFilter, department: e.target.value })}
                    className="px-4 py-3 border border-gray-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-bold uppercase"
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
                    className="px-4 py-3 border border-gray-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all font-bold uppercase"
                  >
                    <option value="All">ALL DESIGNATIONS</option>
                    {designations.map(desig => (
                      <option key={desig.id} value={desig.id}>{desig.designation_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden p-6 gap-6">
            {/* Employee Selection List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <div className="flex items-center gap-4 text-left">
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

            {/* Selected Summary Sidebar */}
            <div className="w-80 bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Selected Employees</span>
                <span className="bg-[#FF7B1D] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{selectedEmployees.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {selectedEmployees.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Users size={32} className="text-gray-300 mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">No employees selected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedEmployees.map(id => {
                      const emp = employees.find(e => e.id === id);
                      if (!emp) return null;
                      return (
                        <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 group">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded-sm bg-orange-100 text-[#FF7B1D] flex items-center justify-center text-[10px] font-black">
                              {emp.employee_name?.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-gray-700 leading-none truncate max-w-[120px] uppercase">{emp.employee_name}</span>
                              <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">{emp.designation_name}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleEmployee(id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="p-4 bg-orange-50 border-t border-orange-100">
                <p className="text-[9px] text-orange-600 font-bold leading-relaxed uppercase tracking-tighter">
                  Leads will be assigned equally among the selected employees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 px-4 py-2 rounded-sm border border-orange-100">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">Lead Selection:</span>
                <span className="text-sm font-black text-[#FF7B1D]">
                  {selectedLeadsCount} LEAD(S) SELECTED
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
                disabled={selectedEmployees.length === 0}
                className="flex-1 sm:flex-none px-10 py-3 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
