import React, { useState, useEffect, useRef } from "react";
import {
    X,
    Bell,
    Calendar,
    Clock,
} from "lucide-react";
import { useGetTasksQuery } from "../store/api/taskApi";

export default function TaskReminderPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [openTaskId, setOpenTaskId] = useState(null);
    const audioRef = useRef(null);

    const toggleTask = (id) => {
        setOpenTaskId((prev) => (prev === id ? null : id));
    };

    // Get tasks for the next 7 days
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

    const { data } = useGetTasksQuery({
        priority: "all",
        startDate,
        endDate,
    });

    // Filter pending tasks
    const pendingTasks =
        data?.tasks?.filter((t) => {
            if (t.completed) return false;
            if (!t.due_date) return true;

            const due = new Date(t.due_date);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            return due <= end;
        }) || [];

    // Play notification sound
    const playNotificationSound = (isHigh) => {
        if (!audioRef.current) return;

        audioRef.current.src = isHigh
            ? "https://cdn.freesound.org/previews/235/235911_2394245-lq.mp3"
            : "https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3";

        audioRef.current.play().catch(() => { });
    };

    // Check if task is high priority and due today
    const isHighPriorityToday = (task) => {
        if (task.priority?.toLowerCase() !== "high") return false;
        if (!task.due_date) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(task.due_date);
        due.setHours(0, 0, 0, 0);

        return due.getTime() === today.getTime();
    };

    // Get priority color classes
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-700 border-red-300";
            case "medium":
                return "bg-orange-100 text-orange-700 border-orange-300";
            case "low":
                return "bg-green-100 text-green-700 border-green-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    // Show popup after 6 seconds if there are pending tasks
    useEffect(() => {
        if (!pendingTasks.length) return;

        const hasHighToday = pendingTasks.some(isHighPriorityToday);

        const timer = setTimeout(() => {
            setIsVisible(true);
            playNotificationSound(hasHighToday);
        }, 6000);

        return () => clearTimeout(timer);
    }, [pendingTasks]);

    if (!isVisible || !pendingTasks.length) return null;

    return (
        <>
            <audio ref={audioRef} preload="auto">
                <source
                    src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3"
                    type="audio/mpeg"
                />
            </audio>

            <div className="fixed bottom-4 right-4 z-[9999] animate-slideIn w-96">
                <div className="bg-white rounded-lg shadow-2xl border border-orange-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-lg animate-bounce">
                                <Bell className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base">Task Reminder</h3>
                                <p className="text-white text-xs opacity-90">
                                    {pendingTasks.some((t) => isHighPriorityToday(t))
                                        ? "🚨 HIGH PRIORITY TASK DUE TODAY!"
                                        : "Pending tasks ⏰"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="bg-white bg-opacity-20 p-1.5 rounded-lg hover:bg-opacity-30 transition"
                        >
                            <X className="text-white" size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-white overflow-y-auto max-h-[400px] space-y-3">
                        {pendingTasks.map((task) => {
                            const isOpen = openTaskId === task.id;

                            return (
                                <div
                                    key={task.id}
                                    className="bg-white rounded-lg border shadow-sm overflow-hidden"
                                >
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 transition ${isHighPriorityToday(task)
                                            ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
                                            : "hover:bg-orange-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            {isHighPriorityToday(task) && (
                                                <span className="text-red-600 text-sm">🚨</span>
                                            )}
                                            <p
                                                className={`text-sm font-semibold truncate ${isHighPriorityToday(task)
                                                    ? "text-red-700"
                                                    : "text-gray-800"
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                                                    task.priority
                                                )} ${isHighPriorityToday(task) ? "animate-pulse" : ""}`}
                                            >
                                                {task.priority || "-"}
                                            </span>
                                            <span
                                                className={`text-xs transform transition-transform ${isOpen ? "rotate-180" : ""
                                                    } ${isHighPriorityToday(task)
                                                        ? "text-red-600"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                ▼
                                            </span>
                                        </div>
                                    </button>

                                    {/* Accordion Body */}
                                    {isOpen && (
                                        <div className="p-4 space-y-3 border-t bg-gradient-to-br from-orange-50 to-white">
                                            {isHighPriorityToday(task) && (
                                                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-xs font-bold animate-pulse">
                                                    🚨 ACTION REQUIRED TODAY – HIGH PRIORITY
                                                </div>
                                            )}

                                            {/* Category */}
                                            <div className="bg-white p-3 rounded-lg border">
                                                <p className="text-xs text-gray-500 font-medium mb-1">
                                                    Category
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {task.category || "-"}
                                                </p>
                                            </div>

                                            {/* Due Date & Time */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex flex-col gap-1 p-3 rounded-lg border bg-orange-50">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="text-orange-700" size={14} />
                                                        <span className="text-xs font-bold text-orange-700">
                                                            Due Date
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-orange-900">
                                                        {task.due_date
                                                            ? new Date(task.due_date).toLocaleDateString(
                                                                undefined,
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )
                                                            : "-"}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-1 p-3 rounded-lg border bg-orange-50">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className="text-orange-700" size={14} />
                                                        <span className="text-xs font-bold text-orange-700">
                                                            Due Time
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-orange-900">
                                                        {task.due_time ? task.due_time.slice(0, 5) : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
        </>
    );
}
