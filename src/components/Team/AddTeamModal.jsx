import React, { useState } from "react";
import { Users, X, Filter } from "lucide-react";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const AddTeamModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        teamName: "",
        description: "",
        selectedEmployees: [],
        status: "Active"
    });

    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedDesignation, setSelectedDesignation] = useState("All");

    // Fetch employees with a large limit to allow selection
    const { data: employeesData } = useGetEmployeesQuery({ limit: 1000, status: 'Active' });
    const { data: departmentsData } = useGetDepartmentsQuery({ limit: 1000 });
    const { data: designationsData } = useGetDesignationsQuery({ limit: 1000 });

    const employees = employeesData?.employees || [];
    const departments = departmentsData?.departments || [];
    const designations = designationsData?.designations || [];

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
        if (!formData.teamName || formData.selectedEmployees.length === 0) return;

        onSubmit({
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
                            Select Employees <span className="text-red-500">*</span> (Selected: {formData.selectedEmployees.length})
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1 border-2 border-gray-100 custom-scrollbar rounded-sm">
                            {filteredEmployees.map((employee) => {
                                const isSelected = formData.selectedEmployees.includes(employee.id);
                                return (
                                    <label
                                        key={employee.id}
                                        className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all rounded-sm ${isSelected
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-300 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleEmployeeToggle(employee.id)}
                                                className="w-4 h-4 text-orange-500 focus:ring-2 focus:ring-orange-500"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {employee.employee_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {employee.department_name}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-bold border rounded-sm bg-blue-50 text-blue-700 border-blue-200">
                                            {employee.designation_name}
                                        </span>
                                    </label>
                                );
                            })}
                            {filteredEmployees.length === 0 && (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    <Filter size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-medium">No employees found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                        <button
                            type="submit"
                            disabled={isLoading || formData.selectedEmployees.length === 0}
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
