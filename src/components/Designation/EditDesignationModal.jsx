import React, { useState, useEffect } from "react";
import { Briefcase, User, Image, FileText, Save } from "lucide-react";
import { useUpdateDesignationMutation } from "../../store/api/designationApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import PermissionSelector from "../common/PermissionSelector";
import { permissionCategories } from "../../pages/EmployeePart/permissionsData";

const EditDesignationModal = ({ isOpen, onClose, designation, refetchDashboard }) => {
    const [designationName, setDesignationName] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Active");
    const [designationImage, setDesignationImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState("general");
    const [selectedPermissions, setSelectedPermissions] = useState({});

    const { data: departmentsData } = useGetDepartmentsQuery({ limit: 100 });
    const [updateDesignation, { isLoading }] = useUpdateDesignationMutation();

    useEffect(() => {
        if (designation) {
            setDesignationName(designation.designation_name || "");
            setDepartmentId(designation.department_id || "");
            setDescription(designation.description || "");
            setStatus(designation.status || "Active");
            setImagePreview(designation.image_url || null);

            // Handle permissions
            if (designation.permissions) {
                const perms = typeof designation.permissions === 'string'
                    ? JSON.parse(designation.permissions)
                    : designation.permissions;

                const permObj = {};
                (Array.isArray(perms) ? perms : []).forEach(p => {
                    permObj[p] = true;
                });
                setSelectedPermissions(permObj);
            } else {
                setSelectedPermissions({});
            }
        }
    }, [designation]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error("Image size must be less than 1MB");
                e.target.value = ""; // Clear the file input
                return;
            }
            setDesignationImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDepartmentChange = (e) => {
        const deptId = e.target.value;
        setDepartmentId(deptId);

        if (deptId) {
            const selectedDept = departmentsData?.departments?.find(d => d.id === parseInt(deptId));
            if (selectedDept && selectedDept.permissions) {
                const perms = typeof selectedDept.permissions === 'string'
                    ? JSON.parse(selectedDept.permissions)
                    : selectedDept.permissions;

                const permObj = {};
                (Array.isArray(perms) ? perms : []).forEach(p => {
                    permObj[p] = true;
                });
                setSelectedPermissions(permObj);
                toast.success(`Loaded default permissions from ${selectedDept.department_name}`);
            }
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
        if (!designationName.trim() || !departmentId) {
            toast.error("Designation Name and Department are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("designation_name", designationName);
            formData.append("department_id", departmentId);
            formData.append("description", description);
            formData.append("status", status);

            const permissionsList = Object.keys(selectedPermissions).filter(id => selectedPermissions[id]);
            formData.append("permissions", JSON.stringify(permissionsList));

            if (designationImage) {
                formData.append("image", designationImage);
            }

            await updateDesignation({ id: designation.id, data: formData }).unwrap();

            if (refetchDashboard) {
                refetchDashboard();
            }

            toast.success("Designation updated successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update designation");
        }
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg transform transition-all disabled:opacity-50"
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
            title="Edit Designation"
            subtitle="Update role details"
            icon={<User size={24} />}
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
                    Role Permissions
                </button>
            </div>

            <div className={activeTab === "general" ? "block" : "hidden"}>
                <div className="space-y-5 text-black">
                    {/* Select Department */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Briefcase size={16} className="text-[#FF7B1D]" />
                            Select Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={departmentId}
                            onChange={handleDepartmentChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm bg-white"
                        >
                            <option value="">-- Choose Department --</option>
                            {departmentsData?.departments?.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Designation Name */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <User size={16} className="text-[#FF7B1D]" />
                            Designation Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={designationName}
                            onChange={(e) => setDesignationName(e.target.value.slice(0, 100))}
                            maxLength={100}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm"
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] text-gray-400 font-medium">
                                {designationName.length}/100
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm bg-white"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Designation Image */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Image size={16} className="text-[#FF7B1D]" />
                            Designation Image
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer focus:border-[#FF7B1D] outline-none bg-white"
                                />
                            </div>
                            {imagePreview && (
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-lg border overflow-hidden bg-gray-50">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FileText size={16} className="text-[#FF7B1D]" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                            maxLength={500}
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm bg-white"
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] text-gray-400 font-medium">
                                {description.length}/500
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={activeTab === "permissions" ? "block" : "hidden"}>
                <div className="bg-orange-50/50 p-4 rounded-lg mb-6 border border-orange-100 italic text-center text-black">
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

export default EditDesignationModal;
