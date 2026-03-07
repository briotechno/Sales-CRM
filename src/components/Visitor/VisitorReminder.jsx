import React, { useState, useEffect, useRef } from "react";
import {
    X,
    Bell,
    User,
    Clock,
    Users,
    ShieldAlert,
    CheckCircle,
    MessageSquare
} from "lucide-react";
import { useGetDueVisitorsQuery } from "../../store/api/visitorApi";
import { useSelector } from "react-redux";

export default function VisitorReminder() {
    const { user } = useSelector((state) => state.auth);
    const [isVisible, setIsVisible] = useState(false);
    const [currentVisitor, setCurrentVisitor] = useState(null);
    const audioRef = useRef(null);
    const notifiedVisitors = useRef(new Set());

    const { data: dueVisitors } = useGetDueVisitorsQuery(null, {
        pollingInterval: 15000,
        skip: !user,
    });

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Sound failed", e));
        }
    };

    useEffect(() => {
        if (!dueVisitors || dueVisitors.length === 0) {
            if (isVisible) setIsVisible(false);
            return;
        }

        if (!isVisible) {
            const nextOne = dueVisitors.find(v => !notifiedVisitors.current.has(v.id));
            if (nextOne) {
                setCurrentVisitor(nextOne);
                setIsVisible(true);
                notifiedVisitors.current.add(nextOne.id);
                playSound();
            }
        }
    }, [dueVisitors, isVisible]);

    if (!isVisible || !currentVisitor) return null;

    return (
        <>
            <audio ref={audioRef} preload="auto">
                <source src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3" type="audio/mpeg" />
            </audio>

            <div className="fixed top-24 left-4 z-[9999] animate-slideIn">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-400 w-80 overflow-hidden font-primary">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-lg animate-pulse">
                                <Users size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Visitor Waiting</h3>
                                <p className="text-blue-50 text-[10px] opacity-80 font-medium">At the reception</p>
                            </div>
                        </div>
                        <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100">
                                {currentVisitor.visitor_name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{currentVisitor.visitor_name}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{currentVisitor.visitor_type}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Purpose</p>
                                <p className="text-xs font-bold text-gray-700 mt-0.5">{currentVisitor.purpose || "Meeting"}</p>
                            </div>
                            <Clock size={16} className="text-blue-500" />
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="w-full bg-[#FF7B1D] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-orange-100 hover:bg-[#e66a15] transition-all flex items-center justify-center gap-2 text-xs"
                        >
                            <CheckCircle size={14} />
                            Okay, I'm coming
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
        </>
    );
}
