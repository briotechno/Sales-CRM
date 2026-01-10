import React, { useState, useEffect } from "react";
import { Users, X, Filter } from "lucide-react";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import { useGetTeamByIdQuery } from "../../store/api/teamApi";

const EditTeamModal = ({ isOpen, onClose, onSubmit, isLoading: isUpdating, teamId }) => {
    const [formData, setFormData] = useState({
        teamName: "",
        description: "",
        selectedEmployees: [],
        status: "Active"
    });

    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedDesignation, setSelectedDesignation] = useState("All");

    // Fetch Team Details
    const { data: team, isLoading: isFetchingTeam } = useGetTeamByIdQuery(teamId, {
        skip: !isOpen || !teamId,
    });

    // Fetch Dropdown Data
    const { data: employeesData } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });
    const { data: departmentsData } = useGetDepartmentsQuery({ limit: 1000 });
    const { data: designationsData } = useGetDesignationsQuery({ limit: 1000 });

    const employees = employeesData?.employees || [];
    const departments = departmentsData?.departments || [];
    const designations = designationsData?.designations || [];

    // Initialize form when team data is fetched
    useEffect(() => {
        if (team) {
            setFormData({
                teamName: team.team_name || "",
                description: team.description || "",
                selectedEmployees: team.members ? team.members.map(m => m.id) : [],
                status: team.status || "Active"
            });
        }
    }, [team]);

    const handleEmployeeToggle = (employeeId) => {
        setFormData((prev) => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.includes(employeeId)
                ? prev.selectedEmployees.filter((id) => id !== employeeId)
                : [...prev.selectedEmployees, employeeId],
        }));
    };

    const filteredEmployees = employees.filter((emp) => {
        const matchesDepartment =
            selectedDepartment === "All" || emp.department_id === parseInt(selectedDepartment);
        const matchesDesignation =
            selectedDesignation === "All" || emp.designation_id === parseInt(selectedDesignation);
        return matchesDepartment && matchesDesignation;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.teamName) return;

        onSubmit({
            id: teamId,
            team_name: formData.teamName,
            description: formData.description,
            status: formData.status,
            employee_ids: formData.selectedEmployees
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar rounded-sm">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users size={24} />
                        {isFetchingTeam ? "Loading..." : `Edit Team: ${team?.team_id || ''}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {isFetchingTeam ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Team Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.teamName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, teamName: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all rounded-sm"
                                    placeholder="Enter team name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all rounded-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
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
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none rounded-sm"
                                rows={3}
                                placeholder="Enter team description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Employees (Selected: {formData.selectedEmployees.length})
                            </label>

                            <div className="flex flex-col md:flex-row gap-3 mb-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Filter by Department
                                    </label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm rounded-sm"
                                    >
                                        <option value="All">All Departments</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.department_name}
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
                                        onChange={(e) => setSelectedDesignation(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm rounded-sm"
                                    >
                                        <option value="All">All Designations</option>
                                        {designations.map((desig) => (
                                            <option key={desig.id} value={desig.id}>
                                                {desig.designation_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6 max-h-96 overflow-y-auto p-4 border-2 border-gray-100 custom-scrollbar rounded-sm bg-gray-50/30">
                                {Object.entries(
                                    filteredEmployees.reduce((acc, emp) => {
                                        const dept = emp.department_name || "Unassigned Department";
                                        if (!acc[dept]) acc[dept] = [];
                                        acc[dept].push(emp);
                                        return acc;
                                    }, {})
                                ).map(([department, deptEmployees]) => (
                                    <div key={department} className="space-y-3">
                                        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
                                            <div className="w-2 h-5 bg-orange-500 rounded-sm"></div>
                                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                                                {department}
                                            </h3>
                                            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                                {deptEmployees.length} Members
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {deptEmployees.map((employee) => {
                                                const isSelected = formData.selectedEmployees.includes(employee.id);
                                                return (
                                                    <label
                                                        key={employee.id}
                                                        className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all rounded-lg ${isSelected
                                                            ? "border-orange-500 bg-orange-50 shadow-sm"
                                                            : "border-gray-200 hover:border-orange-300 bg-white"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => handleEmployeeToggle(employee.id)}
                                                                    className="w-5 h-5 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500 transition-all cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-gray-800">
                                                                    {employee.employee_name}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">
                                                                        {employee.employee_id}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 font-medium">•</span>
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                                                                        {employee.designation_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <div className="text-center py-12 text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-100">
                                        <Filter size={48} className="mx-auto mb-3 opacity-20" />
                                        <p className="text-sm font-bold uppercase tracking-widest">No matching employees</p>
                                        <p className="text-xs mt-1">Try adjusting your department or designation filters</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hierarchy Preview */}
                        {formData.selectedEmployees.length > 0 && (
                            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-100 mt-4">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Users size={18} className="text-orange-500" />
                                    Hierarchy Preview
                                </h3>
                                <div className="space-y-6">
                                    {Object.entries(
                                        employees
                                            .filter(e => formData.selectedEmployees.includes(e.id))
                                            .reduce((acc, emp) => {
                                                const dept = emp.department_name || "General";
                                                if (!acc[dept]) acc[dept] = {};
                                                const desig = emp.designation_name || "Member";
                                                if (!acc[dept][desig]) acc[dept][desig] = [];
                                                acc[dept][desig].push(emp);
                                                return acc;
                                            }, {})
                                    ).map(([dept, designationsHierarchy]) => (
                                        <div key={dept} className="relative pl-4 border-l-2 border-orange-200 py-1">
                                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-orange-500"></div>
                                            <p className="text-[10px] font-black text-orange-600 uppercase mb-3">{dept}</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {Object.entries(designationsHierarchy).map(([desig, members]) => (
                                                    <div key={desig} className="bg-white p-2 border border-slate-200 rounded-sm shadow-sm">
                                                        <p className="text-[8px] font-bold text-blue-600 uppercase mb-1 truncate">{desig}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {members.map(m => (
                                                                <div key={m.id} className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded-sm truncate max-w-full">
                                                                    {m.employee_name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 rounded-sm"
                            >
                                {isUpdating ? "Updating..." : "Update Team"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all rounded-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditTeamModal;
