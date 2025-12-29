import React from "react";
import { X, Check, TrendingUp, Award } from "lucide-react";
import { permissionCategories } from "./permissionsData";

/**
 * Permission Modal Component
 * Displays a modal for granting permissions to selected employees
 */
export const PermissionModal = ({
  show,
  onClose,
  employees,
  selectedEmployees,
  selectedPermissions,
  onTogglePermission,
  onSelectCategory,
  onApply,
}) => {
  if (!show) return null;

  const selectedPermCount =
    Object.values(selectedPermissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Grant Permissions
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Managing permissions for {selectedEmployees.length} employee(s)
              {selectedPermCount > 0 &&
                ` • ${selectedPermCount} permission(s) selected`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Selected Employees:
          </p>
          <div className="flex flex-wrap gap-2">
            {employees
              .filter((emp) => selectedEmployees.includes(emp.id))
              .map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200"
                >
                  <img
                    src={emp.image}
                    alt={emp.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{emp.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {Object.entries(permissionCategories).map(
            ([category, permissions]) => {
              const allSelected = permissions.every(
                (perm) => selectedPermissions[perm.id]
              );
              const someSelected = permissions.some(
                (perm) => selectedPermissions[perm.id]
              );

              return (
                <div key={category} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-800">
                      {category}
                    </h4>
                    <button
                      onClick={() => onSelectCategory(category)}
                      className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                        allSelected
                          ? "bg-orange-500 text-white"
                          : someSelected
                          ? "bg-orange-200 text-orange-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((perm) => {
                      const Icon = perm.icon;
                      return (
                        <div
                          key={perm.id}
                          onClick={() => onTogglePermission(perm.id)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPermissions[perm.id]
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedPermissions[perm.id] || false}
                              onChange={() => {}}
                              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon size={16} className="text-gray-600" />
                                <span className="font-semibold text-sm text-gray-800">
                                  {perm.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {perm.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onApply}
              className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Apply Permissions{" "}
              {selectedPermCount > 0 && `(${selectedPermCount})`}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Promotion Modal Component
 * Displays a modal for promoting a single employee
 */
export const PromotionModal = ({
  show,
  onClose,
  employees,
  selectedEmployees,
  promotionData,
  onPromotionDataChange,
  onApply,
}) => {
  if (!show) return null;

  const selectedEmployee = employees.find(
    (emp) => emp.id === selectedEmployees[0]
  );

  if (!selectedEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-sm shadow-xl max-w-xl w-full my-8">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-full">
              <TrendingUp className="text-green-600" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Employee Promotion
              </h3>
              <p className="text-xs text-gray-600">
                Promote {selectedEmployee.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {/* Current Employee Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedEmployee.image}
                alt={selectedEmployee.name}
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
              <div className="flex-1">
                <h4 className="text-base font-bold text-gray-800">
                  {selectedEmployee.name}
                </h4>
                <p className="text-xs text-gray-600">
                  Current: {selectedEmployee.designation}
                </p>
                <p className="text-xs text-gray-600">
                  Salary: ${selectedEmployee.salary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Promotion Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                New Designation *
              </label>
              <input
                type="text"
                value={promotionData.newDesignation}
                onChange={(e) =>
                  onPromotionDataChange({
                    ...promotionData,
                    newDesignation: e.target.value,
                  })
                }
                placeholder="e.g., Lead Developer"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Salary Increase ($) *
              </label>
              <input
                type="number"
                value={promotionData.salaryIncrease}
                onChange={(e) =>
                  onPromotionDataChange({
                    ...promotionData,
                    salaryIncrease: e.target.value,
                  })
                }
                placeholder="e.g., 10000"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Effective Date *
              </label>
              <input
                type="date"
                value={promotionData.effectiveDate}
                onChange={(e) =>
                  onPromotionDataChange({
                    ...promotionData,
                    effectiveDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Reason for Promotion
              </label>
              <textarea
                value={promotionData.reason}
                onChange={(e) =>
                  onPromotionDataChange({
                    ...promotionData,
                    reason: e.target.value,
                  })
                }
                placeholder="Outstanding performance, leadership skills, etc."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {promotionData.salaryIncrease && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 mb-0.5">
                  New Salary Calculation
                </p>
                <p className="text-base font-bold text-green-600">
                  $
                  {(
                    selectedEmployee.salary +
                    parseFloat(promotionData.salaryIncrease || 0)
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={onApply}
              className="flex-1 bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Award size={16} />
              Apply Promotion
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Generic Action Modal Component
 * Displays a confirmation modal for various employee actions
 */
export const ActionModal = ({
  show,
  onClose,
  actionType,
  employees,
  selectedEmployees,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{actionType}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          You are about to apply "{actionType}" to {selectedEmployees.length}{" "}
          selected employee(s):
        </p>

        <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
          {employees
            .filter((emp) => selectedEmployees.includes(emp.id))
            .map((emp) => (
              <div key={emp.id} className="flex items-center gap-2 py-1">
                <Check size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">
                  {emp.name} - {emp.designation}
                </span>
              </div>
            ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
