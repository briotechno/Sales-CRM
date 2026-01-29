import React, { useState, useMemo } from "react";
import { Users, X, Filter, Plus, Trash2, ArrowDown } from "lucide-react";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import { useGetTeamsQuery } from "../../store/api/teamApi";

const AddTeamModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        teamName: "",
        description: "",
        selectedEmployees: [], // for compatibility if needed, but we'll use levels
        status: "Active",
        levels: [{ id: Date.now(), departmentId: "All", designationId: "All", employeeId: "" }]
    });

    // Fetch employees with a large limit to allow selection
    const { data: employeesData } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });
    const { data: departmentsData } = useGetDepartmentsQuery({ limit: 1000 });
    const { data: designationsData } = useGetDesignationsQuery({ limit: 1000 });
    const { data: teamsData } = useGetTeamsQuery({ limit: 1000 }, { skip: !isOpen });

    const employees = employeesData?.employees || [];
    const departments = departmentsData?.departments || [];
    const designations = designationsData?.designations || [];
    const teams = teamsData?.teams || [];

    // Create a map of employee ID to Team Name for assignment check
    const employeeTeamMap = useMemo(() => {
        const map = {};
        teams.forEach(team => {
            if (team.members) {
                team.members.forEach(member => {
                    map[member.id] = team.team_name;
                });
            }
        });
        return map;
    }, [teams]);

    const addLevel = () => {
        setFormData(prev => ({
            ...prev,
            levels: [...prev.levels, { id: Date.now(), departmentId: "All", designationId: "All", employeeId: "" }]
        }));
    };

    const removeLevel = (id) => {
        if (formData.levels.length === 1) return;
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.filter(l => l.id !== id)
        }));
    };

    const updateLevel = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.map(l => {
                if (l.id === id) {
                    const updated = { ...l, [field]: value };
                    if (field === 'departmentId' || field === 'designationId') {
                        updated.employeeId = "";
                    }
                    return updated;
                }
                return l;
            })
        }));
    };

    const getFilteredEmployeesForLevel = (level) => {
        return employees.filter((emp) => {
            const matchesDepartment =
                level.departmentId === "All" || emp.department_id === parseInt(level.departmentId);
            const matchesDesignation =
                level.designationId === "All" || emp.designation_id === parseInt(level.designationId);
            return matchesDepartment && matchesDesignation;
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const employeeIds = formData.levels.map(l => l.employeeId).filter(id => id !== "");
        if (!formData.teamName || employeeIds.length === 0) return;

        onSubmit({
            team_name: formData.teamName,
            description: formData.description,
            status: formData.status,
            employee_ids: employeeIds
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar rounded-sm">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-50 rounded-t-sm shadow-md">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users size={24} />
                        Create New Team
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
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

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Team Structure (Levels) <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addLevel}
                                className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-sm font-bold text-[10px] uppercase tracking-wider hover:bg-orange-100 transition-all shadow-sm"
                            >
                                <Plus size={14} />
                                Add New Level
                            </button>
                        </div>

                        <div className="space-y-6 px-1 pt-2">
                            <div className="space-y-6">
                                {formData.levels.map((level, index) => {
                                    const levelEmployees = getFilteredEmployeesForLevel(level);
                                    return (
                                        <div key={level.id} className="relative">
                                            {index > 0 && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-0">
                                                    <div className="h-4 w-0.5 bg-orange-200"></div>
                                                    <ArrowDown size={12} className="text-orange-400 -mt-1" />
                                                </div>
                                            )}
                                            <div className="bg-white border-2 border-gray-100 p-4 rounded-sm shadow-sm relative z-10 hover:border-orange-200 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                                                            Level {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {formData.levels.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeLevel(level.id)}
                                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm transition-all"
                                                                title="Remove level"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Department</label>
                                                        <select
                                                            value={level.departmentId}
                                                            onChange={(e) => updateLevel(level.id, 'departmentId', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-200 focus:border-orange-500 outline-none text-xs rounded-sm bg-gray-50"
                                                        >
                                                            <option value="All">All Departments</option>
                                                            {departments.map((dept) => (
                                                                <option key={dept.id} value={dept.id}>
                                                                    {dept.department_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Designation</label>
                                                        <select
                                                            value={level.designationId}
                                                            onChange={(e) => updateLevel(level.id, 'designationId', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-200 focus:border-orange-500 outline-none text-xs rounded-sm bg-gray-50"
                                                        >
                                                            <option value="All">All Designations</option>
                                                            {designations.map((desig) => (
                                                                <option key={desig.id} value={desig.id}>
                                                                    {desig.designation_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Employee</label>
                                                        <select
                                                            required={index === 0}
                                                            value={level.employeeId}
                                                            onChange={(e) => updateLevel(level.id, 'employeeId', e.target.value)}
                                                            className={`w-full px-3 py-2 border text-xs rounded-sm outline-none transition-all ${level.employeeId
                                                                ? 'border-orange-500 bg-orange-50/30'
                                                                : 'border-gray-200 bg-white'
                                                                }`}
                                                        >
                                                            <option value="">Select Employee...</option>
                                                            {levelEmployees.map((emp) => {
                                                                const assignedTeam = employeeTeamMap[emp.id];
                                                                return (
                                                                    <option key={emp.id} value={emp.id}>
                                                                        {emp.employee_name} ({emp.employee_id}) {assignedTeam ? `[Already in Team: ${assignedTeam}]` : ""}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                        {level.employeeId && (
                                                            <div className="mt-1 space-y-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1 rounded-sm uppercase">
                                                                        {levelEmployees.find(e => e.id == level.employeeId)?.designation_name}
                                                                    </span>
                                                                </div>
                                                                {employeeTeamMap[level.employeeId] && (
                                                                    <p className="text-[9px] font-bold text-red-500 flex items-center gap-1">
                                                                        <Users size={10} />
                                                                        Already assigned to: <span className="underline">{employeeTeamMap[level.employeeId]}</span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Hierarchy Preview */}
                        {formData.levels.some(l => l.employeeId) && (
                            <div className="bg-white rounded-sm p-6 border-2 border-slate-100 mt-6 shadow-sm">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2 border-b pb-4">
                                    <Users size={16} className="text-orange-500" />
                                    Team Hierarchy Preview
                                </h3>
                                <div className="flex flex-col items-center space-y-0">
                                    {formData.levels.filter(l => l.employeeId).map((level, idx, filteredLevels) => {
                                        const emp = employees.find(e => e.id == level.employeeId);
                                        return (
                                            <React.Fragment key={level.id}>
                                                <div className="w-full max-w-md bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex items-center gap-4 relative">
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border-2 border-orange-200 flex-shrink-0 z-10">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-base font-bold text-slate-800 tracking-tight">{emp?.employee_name}</p>
                                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{emp?.designation_name}</p>
                                                    </div>
                                                </div>
                                                {idx < filteredLevels.length - 1 && (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-0.5 h-8 bg-orange-200"></div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                        <button
                            type="submit"
                            disabled={isLoading || !formData.levels.some(l => l.employeeId)}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 rounded-sm"
                        >
                            {isLoading ? "Creating..." : "Create Team"}
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
            </div>
        </div>
    );
};

export default AddTeamModal;
