import React from "react";
import {
    DollarSign,
    Calendar,
    Users,
    Briefcase,
} from "lucide-react";
import Modal from "../common/Modal";

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
};

const ViewSalaryModal = ({ isOpen, onClose, salary }) => {
    if (!salary) return null;

    const footer = (
        <button
            onClick={onClose}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-sm"
        >
            Close Details
        </button>
    );

    const icon = (
        <div className="bg-orange-500 text-white p-2 rounded-xl">
            <DollarSign size={22} />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={salary.employee_name || "Employee Salary"}
            subtitle={`${salary.designation} • ${salary.department}`}
            icon={icon}
            footer={footer}
        >
            <div className="space-y-8 text-black bg-white">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                        <div className="bg-blue-600 p-2 rounded-xl text-white mb-2">
                            <Briefcase size={20} />
                        </div>
                        <span className="text-sm font-bold text-blue-900">
                            {salary.designation || "-"}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                            Designation
                        </span>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center text-center">
                        <div className="bg-green-600 p-2 rounded-xl text-white mb-2">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-bold text-green-900">
                            {salary.department || "-"}
                        </span>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                            Department
                        </span>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
                        <div className="bg-orange-500 p-2 rounded-xl text-white mb-2">
                            <Calendar size={20} />
                        </div>
                        <span className="text-sm font-bold text-orange-900">
                            {formatDate(salary.pay_date)}
                        </span>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
                            Payment Date
                        </span>
                    </div>
                </div>

                {/* Salary Period Info */}
                {salary.start_date && salary.end_date && (
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Salary Period</p>
                                <p className="text-sm font-bold text-blue-900">
                                    {formatDate(salary.start_date)} - {formatDate(salary.end_date)}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Working</p>
                                    <p className="text-lg font-black text-blue-900">{salary.working_days || 30}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider mb-1">Present</p>
                                    <p className="text-lg font-black text-green-600">{salary.present_days !== undefined ? salary.present_days : salary.working_days || 30}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">Leaves</p>
                                    <p className="text-lg font-black text-rose-600">{salary.leave_days || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Salary Breakdown */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={16} /> Salary Breakdown
                    </h3>

                    <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Basic Salary</p>
                            <p className="text-gray-800 font-semibold">
                                ₹{salary.basic_salary?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Allowances</p>
                            <p className="text-green-600 font-semibold">
                                +₹{salary.allowances?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Deductions</p>
                            <p className="text-red-600 font-semibold">
                                -₹{salary.deductions?.toLocaleString() || 0}
                            </p>
                        </div>
                    </div>

                    {/* Calculation Formula */}
                    {salary.working_days && salary.present_days !== undefined && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pro-rata Calculation</p>
                            <div className="space-y-1 text-xs font-mono">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Base Adjusted:</span>
                                    <span className="text-slate-800 font-bold">
                                        ({salary.basic_salary?.toLocaleString() || 0} / {salary.working_days}) × {salary.present_days} = ₹{Math.round((salary.basic_salary / salary.working_days) * salary.present_days).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Final Mods:</span>
                                    <span className="text-slate-800 font-bold">
                                        + ₹{salary.allowances?.toLocaleString() || 0} - ₹{salary.deductions?.toLocaleString() || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Net Salary</p>
                            {salary.present_days !== undefined && (
                                <p className="text-xs text-orange-400 font-bold italic mt-0.5">
                                    * Adjusted for {salary.present_days} present days
                                </p>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-orange-600">
                            ₹{salary.net_salary?.toLocaleString() || 0}
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewSalaryModal;
