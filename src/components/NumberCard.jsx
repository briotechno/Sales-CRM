import React from "react";
import { FileText } from "lucide-react";

const NumberCard = ({ title, number, lineBorderClass, icon, iconBgColor, up, down, children, variant = "default" }) => {
  if (variant === "matrix") {
    // Extract the color name (e.g., 'blue' from 'border-blue-500')
    const colorName = lineBorderClass?.split("-")[1] || "orange";
    const topBorderClass = `border-t-${colorName}-500`;
    const iconTextColor = `text-${colorName}-500`;
    const bgColorClass = `bg-${colorName}-50/50`;

    return (
      <div className={`rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 ${topBorderClass} ${bgColorClass} transition-all duration-300 hover:shadow-md`}>
        <div className="flex items-center justify-between font-primary">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
              {icon && React.isValidElement(icon)
                ? React.cloneElement(icon, { size: 20, className: iconTextColor })
                : icon}
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-[11px] font-bold text-gray-400 capitalize tracking-wider truncate">{title}</h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-2xl font-bold text-gray-800 leading-none">{number}</p>
                {up && <span className="text-[10px] font-bold text-green-600 bg-white px-1.5 py-0.5 rounded-sm border border-green-100 shadow-sm">{up}</span>}
                {down && <span className="text-[10px] font-bold text-red-600 bg-white px-1.5 py-0.5 rounded-sm border border-red-100 shadow-sm">{down}</span>}
              </div>
            </div>
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