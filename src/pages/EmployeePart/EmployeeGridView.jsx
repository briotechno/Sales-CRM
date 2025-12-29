import React, { useState } from "react";
import {
  MoreVertical,
  X,
  Check,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  TrendingUp,
} from "lucide-react";
import {
  initialEmployees,
  permissionCategories,
} from "../../pages/EmployeePart/permissionsData";
import {
  PermissionModal,
  PromotionModal,
  ActionModal,
} from "../../pages/EmployeePart/EmployeeModals";

/**
 * Main Employee Grid View Component
 * Manages employee display and bulk actions
 */
const EmployeeGridView = () => {
  // State Management
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [promotionData, setPromotionData] = useState({
    newDesignation: "",
    salaryIncrease: "",
    effectiveDate: "",
    reason: "",
  });

  // Employee Selection Handlers
  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id));
    }
  };

  // Action Handlers
  const handleAction = (type) => {
    if (type === "Grant Permissions") {
      setShowPermissionModal(true);
    } else if (type === "Promote Employee") {
      if (selectedEmployees.length === 1) {
        setShowPromotionModal(true);
      } else {
        alert("Please select only one employee for promotion");
      }
    } else {
      setActionType(type);
      setShowActionModal(true);
    }
  };

  const executeAction = () => {
    const selectedNames = employees
      .filter((emp) => selectedEmployees.includes(emp.id))
      .map((emp) => emp.name)
      .join(", ");

    alert(`Action "${actionType}" applied to: ${selectedNames}`);
    setShowActionModal(false);
    setSelectedEmployees([]);
  };

  // Permission Handlers
  const togglePermission = (permId) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  };

  const selectCategoryPermissions = (category) => {
    const categoryPerms = permissionCategories[category];
    const newPermissions = { ...selectedPermissions };
    const allSelected = categoryPerms.every(
      (perm) => selectedPermissions[perm.id]
    );

    categoryPerms.forEach((perm) => {
      newPermissions[perm.id] = !allSelected;
    });

    setSelectedPermissions(newPermissions);
  };

  const applyPermissions = () => {
    const selectedNames = employees
      .filter((emp) => selectedEmployees.includes(emp.id))
      .map((emp) => emp.name)
      .join(", ");

    const grantedPerms = Object.entries(selectedPermissions)
      .filter(([_, value]) => value)
      .map(([key]) => {
        for (const category of Object.values(permissionCategories)) {
          const perm = category.find((p) => p.id === key);
          if (perm) return perm.label;
        }
        return key;
      })
      .join(", ");

    alert(
      `Permissions granted to: ${selectedNames}\n\nPermissions: ${
        grantedPerms || "None selected"
      }`
    );

    setShowPermissionModal(false);
    setSelectedEmployees([]);
    setSelectedPermissions({});
  };

  // Promotion Handlers
  const applyPromotion = () => {
    const employee = employees.find((emp) => emp.id === selectedEmployees[0]);

    if (
      !promotionData.newDesignation ||
      !promotionData.salaryIncrease ||
      !promotionData.effectiveDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newSalary =
      employee.salary + parseFloat(promotionData.salaryIncrease);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployees[0]
          ? {
              ...emp,
              designation: promotionData.newDesignation,
              salary: newSalary,
            }
          : emp
      )
    );

    alert(
      `Promotion Applied!\n\nEmployee: ${employee.name}\nNew Designation: ${
        promotionData.newDesignation
      }\nSalary Increase: $${
        promotionData.salaryIncrease
      }\nNew Salary: $${newSalary}\nEffective Date: ${
        promotionData.effectiveDate
      }\nReason: ${promotionData.reason || "N/A"}`
    );

    setShowPromotionModal(false);
    setSelectedEmployees([]);
    setPromotionData({
      newDesignation: "",
      salaryIncrease: "",
      effectiveDate: "",
      reason: "",
    });
  };

  // Utility Functions
  const getProductivityColor = (productivity) => {
    if (productivity >= 80) return "bg-green-500";
    if (productivity >= 50) return "bg-purple-500";
    if (productivity >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDesignationColor = (designation) => {
    const colors = [
      "text-pink-500 bg-pink-50",
      "text-purple-500 bg-purple-50",
      "text-blue-500 bg-blue-50",
      "text-cyan-500 bg-cyan-50",
      "text-teal-500 bg-teal-50",
      "text-green-500 bg-green-50",
    ];
    const hash = designation
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-0 p-0 ml-6">
      {/* Header with Actions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600 mt-1">
              {selectedEmployees.length > 0
                ? `${selectedEmployees.length} employee(s) selected`
                : ``}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedEmployees.length === employees.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Select All
            </label>
          </div>
        </div>

        {selectedEmployees.length > 0 && (
          <div className="flex gap-3 flex-wrap bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => handleAction("Grant Permissions")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Lock size={18} />
              Grant Permissions
            </button>
            <button
              onClick={() => handleAction("Promote Employee")}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <TrendingUp size={18} />
              Promote Employee
            </button>
            <button
              onClick={() => handleAction("Assign to Team")}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <UserPlus size={18} />
              Assign to Team
            </button>
            <button
              onClick={() => handleAction("Send Email")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Mail size={18} />
              Send Email
            </button>
            <button
              onClick={() => handleAction("Remove Access")}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              Remove Access
            </button>
            <button
              onClick={() => setSelectedEmployees([])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-auto"
            >
              <X size={18} />
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className={`bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-all p-6 relative ${
              selectedEmployees.includes(emp.id)
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <div className="absolute top-4 right-4">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="absolute top-4 left-4">
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.id)}
                onChange={() => toggleEmployee(emp.id)}
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
              />
            </div>

            {selectedEmployees.includes(emp.id) && (
              <div className="absolute top-4 left-12 flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                <Check size={12} />
                Selected
              </div>
            )}

            <div className="flex flex-col items-center mt-8">
              <div className="relative">
                <img
                  src={emp.image}
                  alt={emp.name}
                  className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mt-3">
                {emp.name}
              </h3>
              <p
                className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 ${getDesignationColor(
                  emp.designation
                )}`}
              >
                {emp.designation}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6 text-center">
              <div>
                <p className="text-xs text-gray-500">Total Leads</p>
                <p className="text-lg font-bold text-gray-800">
                  {emp.projects}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Done</p>
                <p className="text-lg font-bold text-gray-800">{emp.done}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-lg font-bold text-gray-800">
                  {emp.progress}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-600 font-medium">
                  Productivity
                </p>
                <p className="text-xs font-bold text-gray-800">
                  {emp.productivity}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProductivityColor(
                    emp.productivity
                  )}`}
                  style={{ width: `${emp.productivity}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <PermissionModal
        show={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        employees={employees}
        selectedEmployees={selectedEmployees}
        selectedPermissions={selectedPermissions}
        onTogglePermission={togglePermission}
        onSelectCategory={selectCategoryPermissions}
        onApply={applyPermissions}
      />

      <PromotionModal
        show={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        employees={employees}
        selectedEmployees={selectedEmployees}
        promotionData={promotionData}
        onPromotionDataChange={setPromotionData}
        onApply={applyPromotion}
      />

      <ActionModal
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
        actionType={actionType}
        employees={employees}
        selectedEmployees={selectedEmployees}
        onConfirm={executeAction}
      />
    </div>
  );
};

export default EmployeeGridView;
