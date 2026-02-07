import React from "react";
import { Users, X, LayoutGrid, CheckCircle, FileText, Settings, BadgeCheck } from "lucide-react";
import { useGetTeamByIdQuery } from "../../store/api/teamApi";

const ViewTeamModal = ({ isOpen, onClose, teamId }) => {
    const { data: team, isLoading } = useGetTeamByIdQuery(teamId, {
        skip: !isOpen || !teamId,
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar rounded-sm">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users size={24} />
                        {isLoading ? "Loading..." : `Team Details: ${team?.team_id}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 text-left">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : team ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
                                <div>
                                    <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
                                        <LayoutGrid size={14} className="text-[#FF7B1D]" />
                                        Team Name
                                    </p>
                                    <p className="text-lg font-bold text-gray-800 tracking-tight capitalize">{team.team_name}</p>
                                </div>
                                <div>
                                    <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
                                        <CheckCircle size={14} className="text-[#FF7B1D]" />
                                        Status
                                    </p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-bold border capitalize tracking-wider ${team.status === 'Active'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {team.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-2">
                                    <FileText size={14} className="text-[#FF7B1D]" />
                                    Description
                                </p>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words overflow-hidden leading-relaxed bg-gray-50 p-4 rounded-sm border border-gray-100 capitalize max-h-60 overflow-y-auto custom-scrollbar shadow-inner">{team.description || "No description provided."}</p>
                            </div>

                            <div>
                                <p className="flex items-center gap-2 text-sm font-bold text-gray-700 capitalize tracking-wider mb-6">
                                    <Settings size={14} className="text-[#FF7B1D]" />
                                    Team Structure (Levels)
                                </p>

                                <div className="space-y-10">
                                    {Object.entries(
                                        (team.members || []).reduce((acc, member) => {
                                            const level = member.level || 1;
                                            if (!acc[level]) acc[level] = [];
                                            acc[level].push(member);
                                            return acc;
                                        }, {})
                                    ).sort(([a], [b]) => a - b).map(([level, members], idx, arr) => (
                                        <div key={level} className="relative">
                                            {/* Level Indicator */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-[#FF7B1D] text-white flex items-center justify-center font-black shadow-md border-4 border-white ring-2 ring-orange-100">
                                                    {level}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-gray-800 capitalize tracking-widest leading-none">Level {level}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold mt-1 capitalize tracking-tight">{members.length} Members</p>
                                                </div>
                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-100 to-transparent"></div>
                                            </div>

                                            {/* Members Grid for this Level */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                                                {members.map((member) => (
                                                    <div key={member.id} className="group flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                                                        <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-orange-50 text-orange-600 rounded-sm font-black overflow-hidden border border-orange-100 shadow-inner">
                                                            <span className="text-sm uppercase">{member.employee_name?.charAt(0)}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-gray-800 line-clamp-1 capitalize">{member.employee_name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[9px] text-gray-400 font-bold capitalize tracking-tight">
                                                                    {member.designation_name}
                                                                </span>
                                                                <span className="text-[9px] text-gray-300">•</span>
                                                                <span className="text-[9px] text-blue-500 font-bold capitalize tracking-tight">
                                                                    {member.department_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Connector line to next level */}
                                            {idx < arr.length - 1 && (
                                                <div className="absolute left-5 top-10 w-0.5 h-10 bg-orange-100 translate-y-2"></div>
                                            )}
                                        </div>
                                    ))}

                                    {(!team.members || team.members.length === 0) && (
                                        <div className="text-center py-12 bg-gray-50 rounded-sm border-2 border-dashed border-gray-200">
                                            <Users size={48} className="mx-auto text-gray-200 mb-3" />
                                            <p className="text-gray-400 font-bold capitalize tracking-widest text-xs">No Level Structure Defined</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-red-500 py-10">Failed to load team details</div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-white border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-100 transition-all rounded-sm shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTeamModal;
