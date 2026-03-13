import React from "react";
import { FileText } from "lucide-react";

const NumberCard = ({ title, number, lineBorderClass, icon, iconBgColor, up, down, children, variant = "default" }) => {
  if (variant === "matrix") {
    // Extract the color name (e.g., 'blue' from 'border-blue-500')
    const colorName = lineBorderClass?.split("-")[1] || "orange";
    const topBorderClass = `border-t-${colorName}-500`;
    const iconTextColor = `text-${colorName}-500`;

    return (
      <div className={`bg-white rounded-sm shadow-sm border border-gray-100 border-t-4 ${topBorderClass} p-4 transition-all duration-300`}>
        <div className="flex items-center justify-between font-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-white border border-gray-100 shadow-sm">
              {icon && React.isValidElement(icon) 
                ? React.cloneElement(icon, { size: 20, className: iconTextColor }) 
                : icon}
            </div>
            <h3 className="text-[13px] font-bold text-gray-800 tracking-tight">{title}</h3>
          </div>
          <div className="min-w-[32px] h-6 flex items-center justify-center px-2 bg-white border border-gray-100 rounded-full shadow-sm">
            <span className="text-[11px] font-bold text-gray-600">
              {number}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-sm shadow-sm hover:shadow-md p-5 border-t-4 ${lineBorderClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {number}
          </p>
        </div>
        <div className="flex flex-col items-center">
          {up && (
            <div className="flex items-center px-2 my-1 text-sm text-green-500 bg-green-100 font-bold">
              {up}
            </div>
          )}
          {down && (
            <div className="flex items-center px-2 my-1 text-sm text-red-500 bg-red-100 font-bold">
              {down}
            </div>
          )}
          <div className={`${iconBgColor} p-3 rounded-lg`} >
            {icon}
          </div>
        </div>
      </div>
      {children && (
        <div className="flex gap-3 text-xs mt-4">
          {children}
        </div>
      )}
    </div>
  );
};
export default NumberCard;