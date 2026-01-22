import React, { useState, useEffect, useRef } from "react";
import {
    X,
    Bell,
    User,
    Calendar,
    AlertCircle,
    Clock,
    Star,
    CheckCircle2,
    Briefcase,
    IdCard,
} from "lucide-react";
import { useGetTasksQuery } from "../store/api/taskApi";

export default function TaskReminderPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const audioRef = useRef(null);

    const { startDate, endDate } = React.useMemo(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return {
            startDate: start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
        };
    }, []);

    const { data, isLoading } = useGetTasksQuery({
        priority: "all",
        startDate,
        endDate,
    });

    // Pick first pending task
    const pendingTasks =
        data?.tasks?.filter((t) => {
            if (t.completed) return false;

            if (!t.due_date) return true;

            const due = new Date(t.due_date);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            return due <= end;
        }) || [];

    const playNotificationSound = (isHigh) => {
        if (!audioRef.current) return;

        audioRef.current.src = isHigh
            ? "https://cdn.freesound.org/previews/235/235911_2394245-lq.mp3" // urgent
            : "https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3";

        audioRef.current.play().catch(() => { });
    };


    // Show popup automatically after a delay if there's a pending task
    const todayKey = new Date().toDateString();

    useEffect(() => {
        if (!pendingTasks.length) return;

        const hasHighToday = pendingTasks.some(isHighPriorityToday);

        const timer = setTimeout(() => {
            setIsVisible(true);
            playNotificationSound(hasHighToday);
        }, 3000);


        return () => clearTimeout(timer);
    }, [pendingTasks]);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high": return "bg-red-100 text-red-700 border-red-300";
            case "medium": return "bg-orange-100 text-orange-700 border-orange-300";
            case "low": return "bg-green-100 text-green-700 border-green-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };
    const isHighPriorityToday = (task) => {
        if (task.priority?.toLowerCase() !== "high") return false;
        if (!task.due_date) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(task.due_date);
        due.setHours(0, 0, 0, 0);

        return due.getTime() === today.getTime();
    };

    if (!isVisible || !pendingTasks.length) return null;

    return (
        <>
            <audio ref={audioRef} preload="auto">
                <source
                    src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3"
                    type="audio/mpeg"
                />
            </audio>

            <div className="fixed top-4 left-4 z-[9999] animate-slideIn w-96">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-xl animate-bounce">
                                <Bell className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Task Reminder</h3>
                                <p className="text-white text-xs opacity-90">
                                    {pendingTasks.some((t) => isHighPriorityToday(t))
                                        ? "🚨 HIGH PRIORITY task due TODAY!"
                                        : "Pending tasks ⏰"}
                                </p>


                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="bg-white bg-opacity-20 p-1.5 rounded-lg"
                        >
                            <X className="text-white" size={18} />
                        </button>
                    </div>

                    {/* Content */}

                    <div className="p-5 bg-gradient-to-br from-orange-50 to-white overflow-y-auto max-h-[400px] space-y-4">

                        {pendingTasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white rounded-xl border p-3 shadow-sm space-y-3"
                            >
                                {isHighPriorityToday(task) && (
                                    <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
                                        🚨 ACTION REQUIRED TODAY – HIGH PRIORITY
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoBox icon={<Briefcase />} label="Task ID" value={task.id} />
                                    <InfoBox icon={<IdCard />} label="Lead ID" value={task.user_id || "-"} />
                                </div>

                                <InfoBox icon={<Star />} label="Task Title" value={task.title} />

                                <div className="bg-white p-3 rounded-xl border">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Task Category</p>
                                    <p className="text-sm font-semibold text-gray-800">{task.category || "-"}</p>
                                </div>

                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <AlertCircle size={14} className="text-orange-600" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">Priority</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                                            task.priority
                                        )}`}
                                    >
                                        {task.priority || "-"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Due Date */}
                                    <div className="flex flex-col gap-1 p-3 rounded-xl border bg-gradient-to-r from-orange-100 to-red-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="text-orange-700" size={14} />
                                            <span className="text-xs font-bold text-orange-700">Due Date</span>
                                        </div>
                                        <p className="text-sm font-bold text-orange-900">
                                            {task.due_date
                                                ? new Date(task.due_date).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* Due Time */}
                                    <div className="flex flex-col gap-1 p-3 rounded-xl border bg-gradient-to-r from-orange-100 to-red-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="text-orange-700" size={14} />
                                            <span className="text-xs font-bold text-orange-700">Due Time</span>
                                        </div>
                                        <p className="text-sm font-bold text-orange-900">
                                            {task.due_time ? task.due_time.slice(0, 5) : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <style>{`
        @keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse-slow { 0%,100%{opacity:1}50%{opacity:.8} }
        .animate-slideIn{animation:slideIn .5s ease-out}
        .animate-pulse-slow{animation:pulse-slow 2s infinite}
      `}</style>
        </>
    );
}

const InfoBox = ({ icon, label, value }) => (
    <div className="bg-white p-3 rounded-xl border">
        <div className="flex items-center gap-2 mb-1 text-orange-600">{icon}<p className="text-xs text-gray-500 font-medium">{label}</p></div>
        <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
);
