import { FileText } from "lucide-react";

const NumberCard = ({ title, number, lineBorderClass, icon, iconBgColor, up }) => {
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
        <div className="">
          <div className="flex items-center space-x-1 text-sm text-green-500 font-bold">{up}</div>
          <div className={`${iconBgColor} p-3 rounded-lg`} >
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
export default NumberCard;