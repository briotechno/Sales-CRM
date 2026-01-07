import React, { useState, useMemo, useEffect, useRef } from "react";

import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  useMarkAttendanceMutation,
  useGetEmployeeAttendanceQuery,
  useGetDashboardStatsQuery,
  useCheckOutMutation
} from "../../store/api/attendanceApi";
import { toast } from "react-hot-toast";

import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Timer,
  TrendingUp,
  Wifi,
  QrCode,
  Camera,
  X,
  Zap,
  Activity,
  Target,
  MapPin,
  Image as ImageIcon,
  Home,
  ClipboardList,
  FileText,
  Briefcase,
  LogOut
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function EmployeeAttendance() {
  const [currentPage, setCurrentPage] = useState("dashboard"); // Default to dashboard as requested
  const [userIP, setUserIP] = useState(null);
  const [isOnCompanyNetwork, setIsOnCompanyNetwork] = useState(false);
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const isEmployee = user?.role === "Employee";
  const employeeId = isEmployee ? user._id : null;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const companyIPRange = "192.168.1.";

  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useGetEmployeeAttendanceQuery(employeeId, {
    skip: !employeeId
  });

  const { data: statsResponse } = useGetDashboardStatsQuery(undefined, {
    skip: isEmployee // Employees might not need full dashboard stats, or we might want specific ones
  });

  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();

  const myRecords = attendanceResponse?.data || [];
  const myStats = attendanceResponse?.stats || {};

  const stats = useMemo(() => {
    return [
      {
        title: "Total Present",
        number: myStats.present_days || 0,
        icon: <CheckCircle className="text-green-600" size={24} />,
        iconBgColor: "bg-green-100",
        lineBorderClass: "border-green-500",
      },
      {
        title: "Total Absent",
        number: myStats.absent_days || 0,
        icon: <UserX className="text-red-600" size={24} />,
        iconBgColor: "bg-red-100",
        lineBorderClass: "border-red-500",
      },
      {
        title: "Total Leave",
        number: myStats.leave_days || 0,
        icon: <Briefcase className="text-orange-600" size={24} />,
        iconBgColor: "bg-orange-100",
        lineBorderClass: "border-orange-500",
      },
      {
        title: "Attendance Rate",
        number: myStats.total_days ? `${((myStats.present_days / myStats.total_days) * 100).toFixed(1)}% ` : "0%",
        icon: <TrendingUp className="text-blue-600" size={24} />,
        iconBgColor: "bg-blue-100",
        lineBorderClass: "border-blue-500",
      },
    ];
  }, [myStats]);

  useEffect(() => {
    const simulatedIP = `192.168.1.${Math.floor(Math.random() * 255)} `;
    setUserIP(simulatedIP);
    setIsOnCompanyNetwork(simulatedIP.startsWith(companyIPRange));
  }, []);

  useEffect(() => {
    if (showSelfieCapture) {
      startCamera();
      getCurrentLocation();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showSelfieCapture]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Unable to access camera. Please grant camera permissions.");
    }
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLoadingLocation(false);
        }
      );
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const closeSelfieCapture = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowSelfieCapture(false);
    setSelectedEmployee(null);
    setCapturedImage(null);
    setLocation(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      handleCheckIn(selectedEmployee, capturedImage, location);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setShowSelfieCapture(false);
      setCapturedImage(null);
      setLocation(null);
    }
  };


  const handleCheckInClick = (employee) => {
    if (!isOnCompanyNetwork) {
      alert("Please connect to company WiFi network to check in");
      return;
    }
    setSelectedEmployee(employee);
    setShowSelfieCapture(true);
  };

  const handleCheckIn = async (employee, selfieData, locationData) => {
    try {
      const response = await markAttendance({
        employee_id: user._id,
        selfie: selfieData,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        ip_address: userIP
      }).unwrap();

      toast.success(response.message || "Attendance marked successfully");
      setCurrentPage("dashboard");
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error.data?.message || "Failed to mark attendance");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Present",
        icon: CheckCircle,
      },
      absent: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Absent",
        icon: XCircle,
      },
      late: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Late",
        icon: AlertCircle,
      },
      "half-day": {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Half Day",
        icon: Timer,
      },
      leave: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Leave",
        icon: Briefcase,
      },
    };
    return badges[status] || badges.present;
  };

  const getMethodBadge = (method) => {
    const badges = {
      WiFi: { bg: "bg-green-100", text: "text-green-700", icon: Wifi },
      "QR Code": { bg: "bg-blue-100", text: "text-blue-700", icon: QrCode },
    };
    return (
      badges[method] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: Clock,
      }
    );
  };


  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* Navigation */}
        <nav className="bg-white border-b my-3 ">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    My Attendance
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <FiHome className="text-gray-700 text-sm" />

                    <span className="text-gray-600">HRM /</span>

                    <span className="text-[#FF7B1D] font-medium">
                      Attendance
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${currentPage === "dashboard"
                    ? "bg-[#FF7B1D] text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    } `}

                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("checkin")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${currentPage === "checkin"
                    ? "bg-[#FF7B1D] text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    } `}

                >
                  <Camera className="w-5 h-5" />
                  Check-In
                </button>
                <button
                  onClick={() => setCurrentPage("records")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${currentPage === "records"
                    ? "bg-[#FF7B1D] text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    } `}

                >
                  <ClipboardList className="w-5 h-5" />
                  Records
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="px-0 mt-4 py-0">

          {/* ==================== DASHBOARD PAGE ==================== */}
          {currentPage === "dashboard" && (
            <div className="space-y-6 px-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, <span className="text-[#FF7B1D]">{user?.employee_name || user?.username}</span>
                  </h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <Calendar size={16} />
                    {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-sm border border-orange-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-orange-900 uppercase tracking-wider">Active Session</span>
                </div>
              </div>

              {/* Current Status Banner (Integrated Check-Out Flow) */}
              {(() => {
                const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
                const todayRecord = myRecords.find(r => {
                  const rDate = new Date(r.date).toLocaleDateString('en-CA');
                  return rDate === todayStr;
                });


                if (todayRecord) {
                  const hasCheckedOut = todayRecord.check_out && todayRecord.check_out !== '-';
                  return (
                    <div className={`p-6 rounded-sm border-l-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${hasCheckedOut ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${hasCheckedOut ? 'bg-green-100' : 'bg-orange-100 animate-pulse'}`}>
                          {hasCheckedOut ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Timer className="w-8 h-8 text-orange-600" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {hasCheckedOut ? "Shift Completed" : "Currently On Duty"}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock size={14} className="text-orange-500" />
                              Checked In: <span className="font-bold">{todayRecord.check_in}</span>
                            </p>
                            {hasCheckedOut ? (
                              <>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <LogOut size={14} className="text-red-500" />
                                  Checked Out: <span className="font-bold">{todayRecord.check_out}</span>
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Zap size={14} className="text-blue-500" />
                                  Work Hours: <span className="font-bold text-blue-600">{todayRecord.work_hours}</span>
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-orange-600 font-bold flex items-center gap-1">
                                <Activity size={14} />
                                Status: {todayRecord.status.toUpperCase()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {!hasCheckedOut && (
                        <button
                          onClick={async () => {
                            try {
                              await checkOut({ id: todayRecord.id }).unwrap();
                              toast.success("Checked out successfully!");
                            } catch (error) {
                              toast.error(error.data?.message || "Failed to check out");
                            }
                          }}

                          disabled={isCheckingOut}
                          className="w-full md:w-auto px-8 py-3 bg-red-500 text-white rounded-sm font-bold shadow-lg hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isCheckingOut ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                          ) : (
                            <LogOut className="w-5 h-5" />
                          )}
                          CHECK OUT NOW
                        </button>
                      )}

                      {hasCheckedOut && (
                        <div className="bg-white px-4 py-2 rounded-full border border-green-200">
                          <span className="text-green-600 font-bold text-sm tracking-wide">HAVE A GREAT DAY!</span>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <MapPin className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Not Checked In</h3>
                          <p className="text-sm text-gray-600 mt-1">Start your day by marking your attendance.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentPage("checkin")}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-sm font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        GO TO CHECK-IN
                      </button>
                    </div>
                  );
                }
              })()}


              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <NumberCard
                    key={index}
                    title={stat.title}
                    number={stat.number}
                    icon={stat.icon}
                    iconBgColor={stat.iconBgColor}
                    lineBorderClass={stat.lineBorderClass}
                  />
                ))}
              </div>




              <div className="bg-white rounded-sm shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-orange-500" />
                  Recent Attendance
                </h2>
                <div className="space-y-4">
                  {myRecords.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-sm border-2 border-dashed border-gray-200">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No attendance records found yet.</p>
                    </div>
                  ) : (
                    myRecords.slice(0, 5).map((record, index) => {
                      const date = new Date(record.date).toLocaleDateString("en-US", {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      const isPresent = ['present', 'late', 'half-day'].includes(record.status);

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-orange-50 rounded-sm border border-orange-100 hover:shadow-md transition-shadow"
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPresent ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isPresent ? <CheckCircle className="w-6 h-6 text-green-600" /> : <UserX className="w-6 h-6 text-red-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {date}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${record.status === 'present' ? 'bg-green-500 text-white' :
                                record.status === 'late' ? 'bg-orange-500 text-white' :
                                  'bg-red-500 text-white'
                                }`}>
                                {record.status}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Wifi className="w-3 h-3" />
                                {record.check_in_method}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3 text-orange-500" />
                              <p className="text-sm font-bold text-gray-900">
                                {record.check_in}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {record.check_out && record.check_out !== '-' ? `Out: ${record.check_out}` : 'Working...'}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==================== CHECK-IN PAGE ==================== */}
          {currentPage === "checkin" && (
            <div className="space-y-8 px-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      My Check-In
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Check in with selfie & location
                    </p>
                  </div>
                </div>
              </div>

              {/* Network Warning */}
              {!isOnCompanyNetwork && (
                <div className="bg-red-50 border-2 border-red-300 rounded-sm p-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-bold text-red-900 text-lg">
                        Not Connected to Company Network
                      </p>
                      <p className="text-red-700">
                        Please connect to company WiFi to enable check-in
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee List (Here: Just the current user card for check-in) */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Today's Check-In
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
                    const todayRecord = myRecords.find(r => {
                      const rDate = new Date(r.date).toLocaleDateString('en-CA');
                      return rDate === todayStr;
                    });


                    if (!todayRecord && !isAttendanceLoading) {
                      return (
                        <button
                          onClick={() => handleCheckInClick({ name: user?.name, employeeId: user?.employee_id })}
                          disabled={!isOnCompanyNetwork}
                          className={`border-2 rounded-sm p-6 text-left ${isOnCompanyNetwork
                            ? "border-orange-200 hover:border-orange-500 hover:bg-orange-50 cursor-pointer shadow-md hover:shadow-sm"
                            : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                            }`}

                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                              <UserCheck className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-lg">
                                {user?.name}
                              </p>
                              <p className="text-sm text-gray-600 font-medium">
                                {user?.employee_id}
                              </p>
                            </div>
                          </div>
                          <div className="bg-orange-50 rounded-sm px-3 py-2">
                            <p className="text-xs text-orange-600">Action</p>
                            <p className="text-sm font-bold text-gray-900">
                              Check-In for Today
                            </p>
                          </div>
                          <div className="mt-4 text-center text-orange-600 font-semibold text-sm">
                            Click to Mark Attendance
                          </div>
                        </button>
                      );
                    } else if (todayRecord) {
                      const hasCheckedOut = todayRecord.check_out && todayRecord.check_out !== '-';
                      return (
                        <div className="col-span-full">
                          <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-sm">
                            <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                            <p className="text-gray-700 font-bold text-xl">
                              {hasCheckedOut ? "You have completed your attendance for today! 🎉" : "You have already checked in for today! 🎉"}
                            </p>
                            <div className="mt-4 space-y-2">
                              <p className="text-gray-500">
                                Checked in at <span className="font-bold text-orange-600">{todayRecord.check_in}</span>
                              </p>
                              {hasCheckedOut && (
                                <p className="text-gray-500">
                                  Checked out at <span className="font-bold text-orange-600">{todayRecord.check_out}</span>
                                </p>
                              )}
                              {hasCheckedOut && (
                                <p className="text-gray-500">
                                  Work Hours: <span className="font-bold text-orange-600">{todayRecord.work_hours}</span>
                                </p>
                              )}
                            </div>

                            {!hasCheckedOut && (
                              <button
                                onClick={async () => {
                                  try {
                                    await checkOut({ id: todayRecord.id }).unwrap();
                                    toast.success("Checked out successfully!");
                                  } catch (error) {
                                    toast.error(error.data?.message || "Failed to check out");
                                  }
                                }}

                                disabled={isCheckingOut}
                                className="mt-8 px-8 py-3 bg-red-500 text-white rounded-sm font-bold shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                              >
                                {isCheckingOut ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Clock className="w-5 h-5" />}
                                Check Out Now
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ==================== RECORDS PAGE ==================== */}
          {currentPage === "records" && (
            <div className="space-y-8 px-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                    <ClipboardList className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Attendance History
                    </h1>
                    <p className="text-gray-600 mt-1">
                      View your past attendance records
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Date</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Check In</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Method</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Check Out</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Work Hours</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Status</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myRecords.map((record) => {
                        const badge = getStatusBadge(record.status);
                        const StatusIcon = badge.icon;
                        const methodBadge = getMethodBadge(record.check_in_method);
                        const MethodIcon = methodBadge.icon;


                        return (
                          <tr key={record.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              {new Date(record.date).toLocaleDateString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span className="text-gray-900 font-semibold">{record.check_in}</span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 ${methodBadge.bg} ${methodBadge.text} rounded-sm text-xs font-bold`}>
                                <MethodIcon className="w-4 h-4" />
                                {record.check_in_method}
                              </span>
                            </td>


                            <td className="px-6 py-4 text-center text-gray-900 font-semibold">{record.check_out}</td>

                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-sm text-xs font-bold">
                                <Timer className="w-4 h-4" />
                                {record.work_hours}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 ${badge.bg} ${badge.text} rounded-sm text-xs font-bold`}>
                                <StatusIcon className="w-4 h-4" />
                                {badge.label}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setDetailsModal(record)}
                                className="text-orange-600 hover:text-orange-800 font-medium text-sm underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ==================== SELFIE CAPTURE MODAL ==================== */}
        {showSelfieCapture && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-sm max-w-2xl w-full">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center rounded-t-sm">
                <div className="flex items-center gap-3">
                  <Camera className="w-7 h-7 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Capture Selfie
                    </h2>
                    <p className="text-orange-100 text-sm">
                      {selectedEmployee.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSelfieCapture}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div
                  className="relative bg-gray-900 rounded-sm overflow-hidden mb-4"
                  style={{ height: "400px" }}
                >
                  {!capturedImage ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </>
                  ) : (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {location && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-sm p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-bold text-green-900">
                          Location Captured
                        </p>
                        <p className="text-sm text-green-700 font-mono">
                          {location.latitude.toFixed(6)},{" "}
                          {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-green-600">
                          Accuracy: {location.accuracy.toFixed(0)}m
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {loadingLocation && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-sm p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-yellow-600 animate-pulse" />
                      <p className="text-yellow-800 font-medium">
                        Getting location...
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!capturedImage ? (
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-sm font-bold hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={retakePhoto}
                        className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-sm font-bold hover:bg-gray-300 transition"
                      >
                        Retake
                      </button>
                      <button
                        onClick={confirmCapture}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-sm font-bold hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirm
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== DETAILS MODAL ==================== */}
        {detailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center rounded-t-sm">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Attendance Details
                  </h2>
                  <p className="text-orange-100">{detailsModal.date}</p>
                </div>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {detailsModal.selfie && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-orange-500" />
                      Check-in Selfie
                    </h3>
                    <img
                      src={detailsModal.selfie}
                      alt="Check-in selfie"
                      className="w-full max-w-md mx-auto rounded-sm shadow-lg"
                    />
                  </div>
                )}

                {!detailsModal.selfie && detailsModal.status !== "absent" && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-sm p-6 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No selfie captured for this check-in
                    </p>
                  </div>
                )}

                {detailsModal.location && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-sm p-4">
                    <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h3>
                    <p className="text-sm text-green-700 font-mono">
                      Lat: {detailsModal.location.latitude.toFixed(6)}, Long:{" "}
                      {detailsModal.location.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Accuracy: {detailsModal.location.accuracy.toFixed(0)}m
                    </p>
                  </div>
                )}

                {!detailsModal.location && detailsModal.status !== "absent" && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-sm p-4">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h3>
                    <p className="text-sm text-gray-600">
                      No location data available
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Check In</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.checkIn}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Check Out</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.checkOut}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Method</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.check_in_method}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">IP Address</p>
                    <p className="font-bold text-gray-900 font-mono text-sm">
                      {detailsModal.ip_address}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm col-span-2">
                    <p className="text-orange-600 text-sm mb-1">Work Hours</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.work_hours}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
