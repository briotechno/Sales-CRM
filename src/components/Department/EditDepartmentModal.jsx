import React, { useState, useEffect } from "react";
import { Building2, Save } from "lucide-react";
import { useUpdateDepartmentMutation } from "../../store/api/departmentApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import PermissionSelector from "../common/PermissionSelector";
import { permissionCategories } from "../../pages/EmployeePart/permissionsData";

const EditDepartmentModal = ({ isOpen, onClose, department, refetchDashboard }) => {
    const [departmentName, setDepartmentName] = useState("");
    const [departmentDescription, setDepartmentDescription] = useState("");
    const [status, setStatus] = useState("Active");
    const [departmentIcon, setDepartmentIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [activeTab, setActiveTab] = useState("general");
    const [selectedPermissions, setSelectedPermissions] = useState({});

    const [updateDepartment, { isLoading }] = useUpdateDepartmentMutation();

    useEffect(() => {
        if (department) {
            setDepartmentName(department.department_name || "");
            setDepartmentDescription(department.description || "");
            setStatus(department.status || "Active");
            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
            setIconPreview(department.icon ? `${baseUrl}${department.icon}` : null);

            // Handle permissions
            if (department.permissions) {
                const perms = typeof department.permissions === 'string'
                    ? JSON.parse(department.permissions)
                    : department.permissions;

                const permObj = {};
                (Array.isArray(perms) ? perms : []).forEach(p => {
                    permObj[p] = true;
                });
                setSelectedPermissions(permObj);
            } else {
                setSelectedPermissions({});
            }
        }
    }, [department]);

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error("Image size must be less than 1MB");
                e.target.value = null;
                return;
            }
            setDepartmentIcon(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleTogglePermission = (id) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSelectCategory = (category) => {
        const permissions = require("../../pages/EmployeePart/permissionsData").permissionCategories[category];
        const allSelected = permissions.every(p => selectedPermissions[p.id]);

        const newPermissions = { ...selectedPermissions };
        permissions.forEach(p => {
            newPermissions[p.id] = !allSelected;
        });
        setSelectedPermissions(newPermissions);
    };

    const handleUpdate = async () => {
        if (!departmentName.trim()) {
            toast.error("Department Name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("department_name", departmentName);
            formData.append("description", departmentDescription);
            formData.append("status", status);

            const permissionsList = Object.keys(selectedPermissions).filter(id => selectedPermissions[id]);
            formData.append("permissions", JSON.stringify(permissionsList));

            if (departmentIcon) {
                formData.append("icon", departmentIcon);
            }

            await updateDepartment({ id: department.id, data: formData }).unwrap();

            if (refetchDashboard) {
                refetchDashboard();
            }

            toast.success("Department updated successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update department");
        }
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100 transition-all text-black"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
            >
                <Save size={18} />
                {isLoading ? "Saving..." : "Save Changes"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Department"
            subtitle="Update department details"
            icon={<Building2 size={24} />}
            footer={footer}
        >
            <div className="flex border-b border-gray-200 mb-6 text-black">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "general"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    General Info
                </button>
                <button
                    onClick={() => setActiveTab("permissions")}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "permissions"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Default Permissions
                </button>
            </div>

            <div className={`${activeTab === "general" ? "block" : "hidden"} text-black`}>
                <div className="space-y-5 text-black">
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            Department Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            maxLength={50}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        />
                        <div className="text-[10px] text-gray-400 mt-1 flex justify-end font-medium">
                            <span>{departmentName.length}/50 characters</span>
                        </div>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            Department Description
                        </label>
                        <textarea
                            value={departmentDescription}
                            onChange={(e) => setDepartmentDescription(e.target.value)}
                            maxLength={500}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 resize-none"
                        />
                        <div className="text-[10px] text-gray-400 mt-1 flex justify-between font-medium">
                            <span>Optional: Add details about this department</span>
                            <span>{departmentDescription.length}/500 characters</span>
                        </div>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            Department Icon
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIconChange}
                                    className="block w-full text-sm text-gray-900 px-4 py-3 border border-gray-200 rounded-sm cursor-pointer focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all bg-white hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                    Recommended: 512px × 512px or smaller (Max: 1MB)
                                </p>
                            </div>
                            {iconPreview && (
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                                        <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-1">Preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={activeTab === "permissions" ? "block" : "hidden"}>
                <div className="bg-orange-50/50 p-4 rounded-lg mb-6 border border-orange-100 italic text-center">
                    <p className="text-xs text-orange-700 leading-relaxed font-bold">
                        Note: Updating these permissions will NOT affect existing employees.
                    </p>
                </div>
                <PermissionSelector
                    selectedPermissions={selectedPermissions}
                    onTogglePermission={handleTogglePermission}
                    onSelectCategory={handleSelectCategory}
                />
            </div>
        </Modal>

    );
};

export default EditDepartmentModal;
