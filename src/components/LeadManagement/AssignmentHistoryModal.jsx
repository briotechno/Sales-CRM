import React from 'react';
import ReactDOM from 'react-dom';
import { X, User, Clock, ArrowRight, History, UserCheck } from 'lucide-react';
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

    const currentAssigneeName = latestOwnerName || lead?.employee_name || lead?.owner_name || lead?.assigner_name || resolveName(lead?.assigned_to) || 'Unassigned';
    const currentAssignee = typeof currentAssigneeName === 'string' ? currentAssigneeName : 'Unassigned';

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getTypeColor = (type) => {
        if (!type) return 'bg-gray-100 text-gray-600 border-gray-200';
        const t = type.toLowerCase();
        if (t === 'manual') return 'bg-orange-50 text-[#FF7B1D] border-orange-200';
        if (t === 'auto' || t === 'automatic') return 'bg-green-50 text-green-700 border-green-200';
        if (t === 'system') return 'bg-blue-50 text-blue-600 border-blue-200';
        return 'bg-gray-100 text-gray-600 border-gray-200';
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden font-primary flex flex-col" style={{ maxHeight: '88vh' }}>

                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100" style={{ background: 'linear-gradient(135deg, #FF7B1D 0%, #e86a0a 100%)' }}>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-sm flex-shrink-0">
                            <History size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white capitalize leading-tight tracking-wide">
                                Assignment History
                            </h2>
                            <p className="text-[12px] text-orange-100 font-medium mt-0.5 capitalize truncate max-w-[280px]" title={lead?.name}>
                                Tracking changes for — <span className="font-bold text-white">{lead?.name || 'Lead'}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/25 p-1.5 transition-all rounded-sm flex-shrink-0"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── BODY ── */}
                <div className="flex-1 p-5 space-y-5">

                    {/* Currently Assigned Card */}
                    <div>
                        <div className="flex items-center gap-2 mb-2.5">
                            <UserCheck size={13} className="text-[#FF7B1D]" />
                            <span className="text-[13px] font-bold text-gray-600 capitalize">Currently Assigned To</span>
                        </div>
                        <div className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-sm px-4 py-3">
                            <div className="w-11 h-11 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-base shadow-sm border-2 border-orange-200">
                                {currentAssignee.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[15px] font-bold text-gray-900 capitalize leading-tight truncate">{currentAssignee}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span className="text-[11px] text-gray-500 font-semibold">Currently Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Log Timeline */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={13} className="text-[#FF7B1D]" />
                            <span className="text-[13px] font-bold text-gray-600 capitalize">Assignment Log</span>
                            {history.length > 0 && (
                                <span className="ml-auto text-[10px] font-bold text-[#FF7B1D] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-sm">
                                    {history.length} {history.length === 1 ? 'entry' : 'entries'}
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="w-7 h-7 border-[3px] border-[#FF7B1D] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[12px] text-gray-400 font-semibold">Loading history...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-sm border border-dashed border-gray-200 gap-2">
                                <History size={28} className="text-gray-300" />
                                <p className="text-[13px] font-bold text-gray-400">No assignment history yet</p>
                                <p className="text-[11px] text-gray-300">Changes will appear here once assignments are made</p>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[300px] pr-1">
                                <div className="relative border-l-2 border-orange-100 ml-3 space-y-4 pb-1">
                                    {history.map((log, index) => {
                                        const fromName = resolveName(log.reassigned_from_name) ||
                                            (log.reassigned_from === '0' || log.reassigned_from === 0 ? 'System' : 'Unassigned');
                                        const toName = resolveName(log.employee_name) || 'Unknown';
                                        const isLatest = index === history.length - 1;

                                        return (
                                            <div key={log.id} className="relative pl-5">
                                                {/* Timeline dot */}
                                                <div className={`absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full border-2 border-white ring-2 ${isLatest ? 'bg-[#FF7B1D] ring-orange-200' : 'bg-gray-300 ring-gray-100'}`}></div>

                                                <div className="bg-white border border-gray-100 rounded-sm p-3.5 hover:border-orange-100 hover:bg-orange-50/30 transition-all">

                                                    {/* Top row: date + type badge */}
                                                    <div className="flex items-center justify-between gap-2 mb-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={11} className="text-gray-400 flex-shrink-0" />
                                                            <span className="text-[11px] font-bold text-gray-500">
                                                                {formatDate(log.created_at)}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${getTypeColor(log.assignment_type)}`}>
                                                            {log.assignment_type || 'Manual'}
                                                        </span>
                                                    </div>

                                                    {/* From → To */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-sm px-2.5 py-1 min-w-0">
                                                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-[9px] flex-shrink-0">
                                                                {fromName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-[12px] font-bold text-gray-600 capitalize truncate max-w-[90px]">{fromName}</span>
                                                        </div>

                                                        <ArrowRight size={14} className="text-[#FF7B1D] flex-shrink-0" />

                                                        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-sm px-2.5 py-1 min-w-0">
                                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                                                                {toName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-[12px] font-bold text-gray-900 capitalize truncate max-w-[90px]">{toName}</span>
                                                        </div>
                                                    </div>

                                                    {/* Reason */}
                                                    {log.reason && (
                                                        <div className="mt-2.5 flex items-start gap-1.5 bg-orange-50/60 border border-orange-100 rounded-sm px-2.5 py-1.5">
                                                            <span className="text-[#FF7B1D] font-bold text-[10px] flex-shrink-0 mt-0.5">Note:</span>
                                                            <p className="text-[11px] text-gray-600 italic leading-tight">{log.reason}</p>
                                                        </div>
                                                    )}

                                                    {/* Action by */}
                                                    <div className="flex items-center justify-end gap-1 mt-2.5">
                                                        <User size={10} className="text-gray-300" />
                                                        <span className="text-[10px] text-gray-400">Action by:</span>
                                                        <span className="text-[10px] font-bold text-gray-600 capitalize">{log.assigned_by || '—'}</span>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[11px] text-gray-400 font-medium">
                        {history.length > 0
                            ? `Last updated: ${formatDate(history[history.length - 1]?.created_at)}`
                            : 'No history available'}
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-[12px] font-bold text-white bg-[#FF7B1D] hover:bg-orange-600 rounded-sm transition-all capitalize"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default AssignmentHistoryModal;
