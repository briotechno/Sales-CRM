import { FileText } from "lucide-react";

const NumberCard=({title,number,lineBorderClass,icon,iconBgColor})=>{
    return(
         <div className={`bg-white rounded-sm shadow-sm p-5 border-t-4 ${lineBorderClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {number}
                </p>
              </div>
              <div className={`${iconBgColor} p-3 rounded-lg`} >
               
                {icon}
              </div>
            </div>
          </div>
    )
}
export default NumberCard;