import React from "react";
import {
  MoreVertical,
  Check,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

/**
 * Main Employee Grid View Component
 * Receives filtered employees and action handlers from parent
 */
const EmployeeGridView = ({ employees, onEdit, onDelete, onView }) => {
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
    if (!designation) return colors[0];
    const hash = designation
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-0 p-0 ml-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6 relative group"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onView(emp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm">
                <Eye size={16} />
              </button>
              <button onClick={() => onEdit(emp)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-sm">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(emp)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-col items-center mt-4">
              <div className="relative">
                {emp.profile_picture_url ? (
                  <img
                    src={emp.profile_picture_url}
                    alt={emp.employee_name}
                    className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl border-4 border-gray-100">
                    {emp.employee_name?.substring(0, 1)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mt-3 text-center">
                {emp.employee_name}
              </h3>
              <p className="text-sm text-orange-600 font-semibold mt-1">
                {emp.employee_id}
              </p>
              <p
                className={`text-xs font-semibold px-3 py-1 rounded-full mt-2 ${getDesignationColor(
                  emp.designation_name
                )}`}
              >
                {emp.designation_name || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">
                {emp.department_name || "N/A"}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6 text-center border-t pt-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Projects</p>
                <p className="text-sm font-bold text-gray-800">20</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Tasks</p>
                <p className="text-sm font-bold text-gray-800">13</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Gender</p>
                <p className="text-sm font-bold text-gray-800">{emp.gender}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-600 font-medium">
                  Productivity
                </p>
                <p className="text-xs font-bold text-gray-800">
                  {65}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getProductivityColor(65)}`}
                  style={{ width: `${65}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeGridView;
