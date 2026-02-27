
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGetDueRemindersQuery, useSnoozeLeadMutation, useUpdateLeadStatusMutation } from "../store/api/leadApi";
import { toast } from "react-hot-toast";

export default function LeadsReminder() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const audioRef = useRef(null);

  // Poll for due reminders every 5 seconds for more "instant" response
  const { data: dueReminders, refetch } = useGetDueRemindersQuery(null, {
    pollingInterval: 5000,
    skip: false,
  });

  const [snoozeLead] = useSnoozeLeadMutation();
  const [updateLeadStatus] = useUpdateLeadStatusMutation();

  // Reference to track if we've already notified for a specific lead
  const notifiedLeads = useRef(new Set());

  // Function to play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  useEffect(() => {
    if (!dueReminders) return;

    // Cleanup notified leads that are no longer due
    const currentDueIds = new Set(dueReminders.map((r) => r.id));
    notifiedLeads.current.forEach((id) => {
      if (!currentDueIds.has(id)) {
        notifiedLeads.current.delete(id);
      }
    });

    if (!isVisible) {
      // Find the first due reminder that we haven't shown yet
      const nextOne = dueReminders.find((r) => !notifiedLeads.current.has(r.id));

      if (nextOne) {
        setCurrentReminder(nextOne);
        setIsVisible(true);
        notifiedLeads.current.add(nextOne.id);
        // Play sound after a short delay to ensure DOM is ready
        setTimeout(() => {
          playNotificationSound();
        }, 150);
      }
    } else if (currentReminder) {
      // If already visible, update current reminder data if it's still in the list
      // This ensures we have the latest status/tag/time
      const updated = dueReminders.find((r) => r.id === currentReminder.id);
      if (updated) {
        setCurrentReminder(updated);
      } else {
        // If the lead we are showing is no longer in the due list, close the popup
        setIsVisible(false);
        setCurrentReminder(null);
      }
    }
  }, [dueReminders, isVisible, currentReminder?.id]);

  // Local timer to check for "Missed" expiration (5 minutes after appearing)
  useEffect(() => {
    let timer;
    if (isVisible && currentReminder && currentReminder.tag === 'Follow Up') {
      timer = setInterval(async () => {
        const nextCall = new Date(currentReminder.next_call_at);
        const now = new Date();
        const diffMinutes = (now - nextCall) / (1000 * 60);

        if (diffMinutes >= 5) {
          // It's been 5 minutes since scheduled time, mark as Missed
          try {
            await updateLeadStatus({ id: currentReminder.id, tag: 'Missed', status: currentReminder.status }).unwrap();
            toast.error(`Lead ${currentReminder.name || currentReminder.lead_id} marked as Missed`);
            // We keep it visible but it will show "Missed" status on next refetch or we can update locally
            refetch();
          } catch (err) {
            console.error("Failed to update status to Missed:", err);
          }
          clearInterval(timer);
        }
      }, 10000); // Check every 10 seconds
    }
    return () => clearInterval(timer);
  }, [isVisible, currentReminder, updateLeadStatus, refetch]);

  const handleClose = () => {
    setIsVisible(false);
    setCurrentReminder(null);
  };

  const handleSnooze = async () => {
    if (!currentReminder) return;
    try {
      await snoozeLead({ id: currentReminder.id, minutes: 10 }).unwrap();
      toast.success("Reminder snoozed for 10 minutes");
      setIsVisible(false);
      refetch();
    } catch (err) {
      toast.error("Failed to snooze reminder");
    }
  };

  const handleViewLead = () => {
    if (!currentReminder) return;
    navigate(`/crm/leads/profile/${currentReminder.id}`);
    setIsVisible(false);
    setCurrentReminder(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
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

  const leadName = currentReminder?.name || currentReminder?.full_name || "N/A";
  const displayDate = currentReminder?.next_call_at
    ? new Date(currentReminder.next_call_at).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    })
    : "N/A";

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source
          src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3"
          type="audio/mpeg"
        />
      </audio>

      {isVisible && currentReminder && (
        <div className="fixed top-4 right-4 z-[9999] animate-slideInFromRight">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 w-96 overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-5 py-4 relative overflow-hidden">
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

            <div className="p-5 space-y-3 bg-gradient-to-br from-orange-50 to-white">
              <div className="flex items-center justify-between bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertCircle size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Lead ID</p>
                    <p className="text-sm font-bold text-gray-800">
                      {currentReminder.lead_id || currentReminder.id}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(
                    currentReminder.priority || "Medium"
                  )}`}
                >
                  {currentReminder.priority || "Medium"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">Profile</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {leadName}
                  </p>
                </div>

                {currentReminder.type && (
                  <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={14} className="text-orange-600" />
                      <p className="text-xs text-gray-500 font-medium">
                        Lead Type
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {currentReminder.type}
                    </p>
                  </div>
                )}
              </div>

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
                    {displayDate}
                  </p>
                </div>
              </div>

              {currentReminder.interested_in && (
                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">
                      Interested In
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {currentReminder.interested_in}
                  </p>
                </div>
              )}
              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-orange-600" />
                  <p className="text-xs text-gray-500 font-medium">PIPELINE</p>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-2">
                  {currentReminder.pipeline_name || "N/A"}
                </p>

                {/* Pipeline Stages Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">
                      Stage: <span className="text-gray-900 font-extrabold">{currentReminder.stage_name || "N/A"}</span>
                    </span>
                    {currentReminder.total_stages > 0 && (
                      <span className="text-xs font-bold text-orange-600 italic">
                        {currentReminder.current_stage}/{currentReminder.total_stages}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {currentReminder.total_stages > 0 && (
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                      <div
                        className="absolute h-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                        style={{
                          width: `${(currentReminder.current_stage / currentReminder.total_stages) * 100}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                      </div>
                    </div>
                  )}

                  {/* Stage Indicators */}
                  {currentReminder.total_stages > 0 && (
                    <div className="flex justify-between items-start pt-2 px-1">
                      {Array.from({ length: currentReminder.total_stages }).map(
                        (_, index) => {
                          const isCompleted = index < currentReminder.current_stage;
                          const isActive = index === currentReminder.current_stage - 1;

                          return (
                            <div key={index} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-500 shadow-sm ${isCompleted
                                  ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                                  : "bg-gray-100 text-gray-400 border border-gray-200"
                                  } ${isActive ? "ring-4 ring-orange-100 scale-110 z-10" : ""}`}
                              >
                                {isCompleted ? (
                                  <CheckCircle size={14} className="animate-in zoom-in duration-300" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <span className={`text-[9px] mt-2 font-bold ${isCompleted ? "text-gray-700" : "text-gray-400"}`}>
                                Stage {index + 1}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>


              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleViewLead}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase size={16} />
                  View Lead
                </button>
                <button
                  onClick={handleSnooze}
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
