
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Bell,
  User,
  Calendar,
  Target,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";

export default function LeadsReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  // Sample reminder data
  const reminder = {
    leadId: "LD-2024-00458",
    profile: "Rajesh Kumar",
    leadType: "Person",
    priority: "High",
    dateTime: "Nov 22, 2024 - 03:30 PM",
    interestedIn: "Enterprise Software Solution",
    pipeline: "Sales Pipeline",
    currentStage: 3,
    totalStages: 4,
    stageName: "Negotiation",
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  // Show reminder after 15 seconds
  useEffect(() => {
    const demoTimer = setTimeout(() => {
      setIsVisible(true);
      playNotificationSound();
    }, 15000);

    return () => {
      clearTimeout(demoTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <>
      {/* Hidden Audio Element for Notification Sound */}
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp+zPDTgjMGHm7A7+OZUA0PVbPoypZXEwxJoeHwtWcdBzKO1vPLey4FKYbN8NuQQw0RXK/m85tWEwtJoeHwuGgcB0SM1vLLezAFKYLM8NuVRw0RWK3m9JlbFg1Kn+HwuGgeB0CP1vLMfDQFKH/M8NqXTAwRU7Ll9KNcGBBJnODvumkeCj+M1fHNgDcHKYLO8N6ZVQwQT7Pi9KlgHBBImeDvvGsbCT+L1fHOhjsHLIXQ8N+cWQ4PWLPm9K5jHRJKnd/vvmwcCUCN1PHPiT4INYnU8OCfWw4QULjl9K5jHhFKnt7vv2sZCkKP1PHNiD8HLIfQ8N+dWw4PVLTm9K5jHhFKnd7vv2sZCkKP1fHPiUEHL4fR8N6cWQ0OWLTk9K1hHRBJnd7wvWwbCkGR1PHOiUEHL4rS8N6dXA4QU7nk9KtgHRBJnt7wvWscCkOQ1PHPiUEHL43S8N6dWw4PWrHk9KpgHBFJnt7vvWwaCkSQ1PHOiD8IMYnS8N+bWA0PVrPk9KxeHRBJneDvvWscCkSQ1PHOiD8HMInS8OCdXQ4PWK/k9KpeGxBJneDvvW0aCkSQ0/HPhEAHMozT8N+bVg0OV7rl9Kxd"
          type="audio/wav"
        />
      </audio>

      {/* Reminder Popup - Slides in from Right Side Only */}
      {isVisible && (
        <div className="fixed top-4 right-4 z-[9999] animate-slideInFromRight">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 w-96 overflow-hidden transform transition-all hover:scale-[1.02]">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-5 py-4 relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2.5 rounded-xl animate-bounce">
                    <Bell size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      Leads Reminder
                      <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse">
                        New
                      </span>
                    </h3>
                    <p className="text-white text-opacity-90 text-xs mt-0.5">
                      Follow-up notification 🔔
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-lg transition-all backdrop-blur-sm"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 bg-gradient-to-br from-orange-50 to-white">
              {/* Lead ID with Badge */}
              <div className="flex items-center justify-between bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertCircle size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Lead ID</p>
                    <p className="text-sm font-bold text-gray-800">
                      {reminder.leadId}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(
                    reminder.priority
                  )}`}
                >
                  {reminder.priority}
                </div>
              </div>

              {/* Profile & Lead Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">Profile</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {reminder.profile}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">
                      Lead Type
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {reminder.leadType}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 border-2 border-orange-200 animate-pulse-slow">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-orange-700" />
                  <p className="text-xs text-orange-700 font-bold">
                    Scheduled Date & Time
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={16} className="text-orange-600" />
                  <p className="text-sm font-bold text-orange-900">
                    {reminder.dateTime}
                  </p>
                </div>
              </div>

              {/* Interested In */}
              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={14} className="text-orange-600" />
                  <p className="text-xs text-gray-500 font-medium">
                    Interested In
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {reminder.interestedIn}
                </p>
              </div>

              {/* Pipeline */}
              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-orange-600" />
                  <p className="text-xs text-gray-500 font-medium">Pipeline</p>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-2">
                  {reminder.pipeline}
                </p>

                {/* Pipeline Stages Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">
                      Stage: {reminder.stageName}
                    </span>
                    <span className="text-xs font-bold text-orange-600">
                      {reminder.currentStage}/{reminder.totalStages}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-full transition-all duration-500 shadow-md"
                      style={{
                        width: `${
                          (reminder.currentStage / reminder.totalStages) * 100
                        }%`,
                      }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                    </div>
                  </div>

                  {/* Stage Indicators */}
                  <div className="flex justify-between items-center pt-1">
                    {Array.from({ length: reminder.totalStages }).map(
                      (_, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              index < reminder.currentStage
                                ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md"
                                : index === reminder.currentStage - 1
                                ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg ring-4 ring-orange-200 scale-110"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {index < reminder.currentStage ? (
                              <CheckCircle size={16} />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1 font-medium">
                            Stage {index + 1}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert("Opening lead details...")}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase size={16} />
                  View Lead
                </button>
                <button
                  onClick={() => {
                    alert("Reminder snoozed for 10 minutes");
                    handleClose();
                  }}
                  className="flex-1 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Clock size={16} />
                  Snooze
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes slideInFromRight {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }

            @keyframes pulse-slow {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.8;
              }
            }

            .animate-slideInFromRight {
              animation: slideInFromRight 0.6s ease-out;
            }

            .animate-shimmer {
              animation: shimmer 2s infinite;
            }

            .animate-pulse-slow {
              animation: pulse-slow 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
