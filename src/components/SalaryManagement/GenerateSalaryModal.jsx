import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import {
    Calculator,
    User,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ArrowRight,
    Receipt,
    Download
} from "lucide-react";
import { useGetEmployeeAttendanceQuery } from "../../store/api/attendanceApi";

const GenerateSalaryModal = ({ isOpen, onClose, salary }) => {
    const [calculations, setCalculations] = useState({
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        halfDays: 0,
        lateDays: 0,
        leaveCuts: 0,
        allowances: 0,
        deductions: 0,
        grossEarnings: 0,
        totalDeductions: 0,
        netSalary: 0,
        dayRate: 0,
        payableSalary: 0,
        basic: 0,
    });

    const { data: attendanceData, isLoading } = useGetEmployeeAttendanceQuery(
        salary?.employee_id,
        { skip: !salary?.employee_id || !isOpen }
    );

    useEffect(() => {
        if (attendanceData?.success && salary) {
            const records = attendanceData.data;

            // Get month and year from salary pay_date or current date
            const payDate = new Date(salary.pay_date || new Date());
            const month = payDate.getMonth();
            const year = payDate.getFullYear();

            // Filter records for this month
            const currentMonthRecords = records.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.getMonth() === month && recordDate.getFullYear() === year;
            });

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const present = currentMonthRecords.filter(r => r.status === 'present').length;
            const late = currentMonthRecords.filter(r => r.status === 'late').length;
            const halfDays = currentMonthRecords.filter(r => r.status === 'half-day').length;
            const absent = daysInMonth - (present + late + halfDays); // Over simplified but works for demo

            const totalEffectivePresent = present + late + (halfDays * 0.5);
            const basic = Number(salary.basic_salary || 0);
            const allowances = Number(salary.allowances || 0);
            const deductions = Number(salary.deductions || 0);

            const dayRate = basic / daysInMonth;

            // Deduction logic: (Total Days - Effective Present Days) * Day Rate
            const leaveCuts = (daysInMonth - totalEffectivePresent) * dayRate;

            const grossEarnings = basic + allowances;
            const totalDeductions = leaveCuts + deductions;
            const payable = grossEarnings - totalDeductions;

            setCalculations({
                totalDays: daysInMonth,
                presentDays: present + late,
                absentDays: Math.max(0, absent),
                halfDays: halfDays,
                lateDays: late,
                leaveCuts: Math.round(leaveCuts),
                allowances: allowances,
                deductions: deductions,
                basic: basic,
                grossEarnings: Math.round(grossEarnings),
                totalDeductions: Math.round(totalDeductions),
                netSalary: Number(salary.net_salary || 0),
                dayRate: Math.round(dayRate),
                payableSalary: Math.round(payable),
            });
        }
    }, [attendanceData, salary, isOpen]);

    const stats = [
        { label: "Total Days", value: calculations.totalDays, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-500" },
        { label: "Present", value: calculations.presentDays, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-500" },
        { label: "Half Days", value: calculations.halfDays, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-500" },
        { label: "Absent", value: calculations.absentDays, icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-500" },
        { label: "Late Markers", value: calculations.lateDays, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-500" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Generate Salary Statement"
            maxWidth="max-w-3xl"
            icon={
                <div className="bg-[#FF7B1D] p-2.5 rounded-xl shadow-lg shadow-orange-200">
                    <Calculator className="text-white w-6 h-6" />
                </div>
            }
        >
            <div className="space-y-6">
                {/* Employee Brief */}
                <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-[#FF7B1D] flex items-center justify-center text-2xl font-black shadow-xl">
                                {salary?.employee_name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{salary?.employee_name}</h3>
                                <p className="text-orange-400 font-bold text-sm tracking-widest uppercase">{salary?.designation}</p>
                                <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                                    <User size={12} />
                                    <span>ID: EMP-{salary?.employee_id}</span>
                                    <span className="mx-1">•</span>
                                    <Receipt size={12} />
                                    <span>Statement for {new Date(salary?.pay_date || new Date()).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">Basic Salary</p>
                            <p className="text-2xl font-black text-white">₹{calculations.basic.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-[#FF7B1D] rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold animate-pulse text-sm uppercase tracking-widest">Calculating Statement...</p>
                    </div>
                ) : (
                    <>
                        {/* Attendance Analytics */}
                        <div className="grid grid-cols-5 gap-3">
                            {stats.map((stat, i) => (
                                <div key={i} className={`${stat.bg} border-2 border-transparent transition-all rounded-2xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md`}>
                                    <div className={`p-2 rounded-xl bg-white mb-2 shadow-sm`}>
                                        <stat.icon className={`${stat.color}`} size={20} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter mb-1">{stat.label}</p>
                                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Breakdown */}
                        {/* Detailed Breakdown */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 relative overflow-hidden">
                                <h4 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Calculator className="text-orange-600 w-3.5 h-3.5" />
                                    </div>
                                    Earning Components
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500">Fixed Basic</span>
                                        <span className="text-gray-800">₹{calculations.basic.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500">Allowances</span>
                                        <span className="text-green-600">+ ₹{calculations.allowances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-md font-black">
                                        <span className="text-gray-900">Gross Earnings</span>
                                        <span className="text-[#FF7B1D]">₹{calculations.grossEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 relative overflow-hidden">
                                <h4 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                                        <AlertCircle className="text-red-600 w-3.5 h-3.5" />
                                    </div>
                                    Deduction Matrix
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500">Leave Cuts ({calculations.totalDays - (calculations.presentDays)} Days)</span>
                                        <span className="text-red-600">- ₹{calculations.leaveCuts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500">Other Deductions</span>
                                        <span className="text-red-600">- ₹{calculations.deductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-md font-black">
                                        <span className="text-red-700">Total Deductions</span>
                                        <span className="text-red-700">₹{calculations.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Block */}
                        <div className="bg-white border-2 border-orange-100 rounded-3xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-full bg-orange-50/50 skew-x-[30deg] translate-x-16"></div>

                            <div className="flex-1 flex flex-col items-center border-r-2 border-gray-50 px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gross Earnings</p>
                                <p className="text-xl font-black text-gray-800">₹{calculations.grossEarnings.toLocaleString()}</p>
                            </div>

                            <div className="flex items-center justify-center px-4">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black">-</div>
                            </div>

                            <div className="flex-1 flex flex-col items-center border-r-2 border-gray-50 px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Deductions</p>
                                <p className="text-xl font-black text-red-600">₹{calculations.totalDeductions.toLocaleString()}</p>
                            </div>

                            <div className="flex items-center justify-center px-4">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#FF7B1D] font-black">=</div>
                            </div>

                            <div className="flex-1 flex flex-col items-center px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Net Payable</p>
                                <p className="text-xl font-black text-[#FF7B1D]">₹{calculations.payableSalary.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Final Payout */}
                        <div className="bg-gradient-to-r from-[#FF7B1D] to-[#e66a15] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-200 transform hover:scale-[1.01] transition-all duration-300">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Net Payable Salary
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold opacity-80">₹</span>
                                        <h2 className="text-5xl font-black tracking-tighter">{calculations.payableSalary.toLocaleString()}</h2>
                                    </div>
                                    <p className="text-orange-100 text-xs font-bold mt-2">
                                        ₹{calculations.grossEarnings.toLocaleString()} (Gross) - ₹{calculations.totalDeductions.toLocaleString()} (Deductions)
                                    </p>
                                    <p className="text-orange-100/80 text-[10px] font-medium mt-1">
                                        Calculated based on {calculations.totalDays} days @ ₹{calculations.dayRate}/day
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.print()}
                                    className="bg-white text-[#FF7B1D] px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-orange-50 transition-colors shadow-lg shadow-black/10"
                                >
                                    <Download size={18} />
                                    Download Payslip
                                </button>
                            </div>
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-600">
                                <AlertCircle size={16} />
                            </div>
                            <p className="text-xs text-gray-700 font-medium">
                                Note: This breakdown is automatically generated based on biometric attendance records. Manual adjustments may be required for special cases.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default GenerateSalaryModal;
