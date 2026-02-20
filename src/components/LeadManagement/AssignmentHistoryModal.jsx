import React from 'react';
import ReactDOM from 'react-dom';
import { X, User, Clock, ArrowRight, History } from 'lucide-react';
import { useGetLeadAssignmentHistoryQuery } from '../../store/api/leadApi';

const AssignmentHistoryModal = ({ open, onClose, lead, employees = [] }) => {
    const { data: history = [], isLoading } = useGetLeadAssignmentHistoryQuery(lead?.id, {
        skip: !open || !lead?.id,
    });

    if (!open) return null;

    const resolveName = (idOrName) => {
        if (!idOrName) return null;
        const employee = employees.find(emp =>
            String(emp.id) === String(idOrName) ||
            emp.employee_id === String(idOrName) ||
            emp.employee_name === String(idOrName)
        );
        return employee ? employee.employee_name : idOrName;
    };

    const latestLog = history.length > 0 ? history[history.length - 1] : null;
    const latestOwnerName = latestLog ? resolveName(latestLog.employee_name) : null;

    // Prioritize: Latest Log -> Lead Employee Name (from join) -> Lead Owner Name -> Lead Assigner Name -> ID resolution
    const currentAssigneeName = latestOwnerName || lead?.employee_name || lead?.owner_name || lead?.assigner_name || resolveName(lead?.assigned_to) || 'Unassigned';
    const currentAssignee = typeof currentAssigneeName === 'string' ? currentAssigneeName : 'Unassigned';

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden font-primary animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-sm">
                            <History size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white capitalize tracking-wide leading-tight">
                                Assignment History
                            </h2>
                            <p className="text-xs text-blue-100 font-medium opacity-90">
                                Track ownership changes for {lead?.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-1.5 transition-all rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Current Assignment */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <User size={14} /> Currently Assigned To
                        </h3>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm flex items-center gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                {currentAssignee.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-base capitalize">{currentAssignee}</p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Active Owner</p>
                            </div>
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={14} /> Assignment Log
                        </h3>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm font-medium">No assignment history found</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
                                {history.map((log, index) => (
                                    <div key={log.id} className="relative pl-6">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white ring-1 ring-gray-100 group-hover:bg-blue-500 transition-colors"></div>

                                        <div className="bg-white border border-gray-100 p-3 rounded-sm hover:shadow-md transition-shadow hover:border-blue-100 group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm">
                                                    {formatDate(log.created_at)}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100">
                                                    {log.assignment_type}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-1">
                                                <span className="text-gray-500">From</span>
                                                <span className="font-bold capitalize">{resolveName(log.reassigned_from_name) || (log.reassigned_from === '0' || log.reassigned_from === 0 ? 'System' : 'Unassigned')}</span>
                                                <ArrowRight size={12} className="text-gray-400" />
                                                <span className="font-bold capitalize text-gray-900">{resolveName(log.employee_name) || 'Unknown'}</span>
                                            </div>

                                            {log.reason && (
                                                <p className="text-xs text-gray-500 mt-1.5 italic bg-gray-50 p-1.5 rounded-sm border border-gray-100 inline-block">
                                                    "{log.reason}"
                                                </p>
                                            )}

                                            <p className="text-[10px] text-gray-400 mt-2 text-right">
                                                Action by: <span className="font-semibold">{log.assigned_by}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssignmentHistoryModal;
