import React from 'react';
import Modal from '../common/Modal';
import { Users, Briefcase, Building } from 'lucide-react';
import { useGetTeamByIdQuery } from '../../store/api/teamApi';

const TeamMembersModal = ({ isOpen, onClose, teamId }) => {
    const { data: team, isLoading } = useGetTeamByIdQuery(teamId, {
        skip: !isOpen || !teamId,
    });

    if (!isOpen) return null;

    const footer = (
        <div className="flex gap-4 w-full">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition text-xs uppercase tracking-widest font-primary"
            >
                Close Details
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={team ? `${team.team_name} - Members` : "Team Members"}
            subtitle="Direct list of all employees assigned to this team"
            icon={<Users size={24} strokeWidth={3} />}
            maxWidth="max-w-xl"
            footer={footer}
        >
            <div className="space-y-4 py-2">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : team?.members?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {team.members.map((member) => (
                            <div key={member.id} className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-orange-50 text-orange-600 rounded-sm font-black overflow-hidden border border-orange-100 shadow-inner">
                                    <span className="text-lg uppercase">{member.employee_name?.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-bold text-gray-800 tracking-tight capitalize">{member.employee_name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1.5 text-left">
                                            <Briefcase size={12} className="text-[#FF7B1D]" />
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                                {member.designation_name}
                                            </span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1.5 text-left">
                                            <Building size={12} className="text-blue-400" />
                                            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">
                                                {member.department_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-gray-50 rounded-sm border border-gray-100">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level {member.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-sm border-2 border-dashed border-gray-200">
                        <Users size={48} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400 font-bold capitalize tracking-widest text-xs">No Members Assigned</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TeamMembersModal;
