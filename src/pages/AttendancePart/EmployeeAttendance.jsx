import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FiHome } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  useMarkAttendanceMutation,
  useGetEmployeeAttendanceQuery,
  useGetDashboardStatsQuery,
  useCheckOutMutation,
  useGetAttendanceSettingsQuery
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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [activeCheckInMethod, setActiveCheckInMethod] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();
  const urlQrSecret = searchParams.get("secret");
  const isEmployee = user?.role === "Employee";
  const employeeId = isEmployee ? user._id : null;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { data: settingsData } = useGetAttendanceSettingsQuery();
  const settings = settingsData?.data;

  useEffect(() => {
    // Check network if settings are available
    if (settings?.wifiEnabled && settings?.allowedIPs) {
      // Basic IP check logic - usually this happens on backend but we can show UI warning
      // For demo, we'll assume current network matches if it starts with the configured range
      // In production, you'd fetch user IP and compare
      setIsOnCompanyNetwork(true);
    } else if (settings && !settings.wifiEnabled) {
      setIsOnCompanyNetwork(true); // Don't block if WiFi not required
    }
  }, [settings]);

  const companyIPRange = "192.168.1.";

  useEffect(() => {
    let scanner = null;
    if (showQRScanner) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.type === 'attendance' && data.secret) {
              setScannedData(data);
              setShowQRScanner(false);
              scanner.clear();
              toast.success("QR Code scanned successfully!");

              // Directly trigger check-in if data is valid
              handleCheckInClick(user, { qrSecret: data.secret });
            } else {
              toast.error("Invalid QR Code for attendance");
            }
          } catch (e) {
            toast.error("Could not parse QR Code data");
          }
        },
        (error) => {
          // ignore scan errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [showQRScanner]);

  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useGetEmployeeAttendanceQuery(employeeId, {
    skip: !employeeId
  });

  const { data: statsResponse } = useGetDashboardStatsQuery(undefined, {
    skip: isEmployee
  });

  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();

  const myRecords = attendanceResponse?.data || [];
  const myStats = attendanceResponse?.stats || {};

  useEffect(() => {
    if (urlQrSecret && user && settings && !scannedData) {
      setScannedData({ secret: urlQrSecret });
      handleCheckInClick(user, { secret: urlQrSecret });
    }
  }, [urlQrSecret, user, settings]);

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
        audio: true, // Requested both for monitoring
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success("Live Monitoring Active: Camera and Microphone connected", { icon: '🎥' });
    } catch (error) {
      console.error("Camera/Mic access error:", error);
      toast.error("Unable to access camera or microphone. Both are required for check-in and active monitoring.");
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
    setScannedData(null);
    setActiveCheckInMethod([]);
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


  const handleCheckInClick = (employee, scanData = null, skipQR = false) => {
    if (settings?.wifiEnabled && !isOnCompanyNetwork) {
      alert(`Please connect to company WiFi (${settings?.wifiSSID}) network to check in`);
      return;
    }

    // Determine using methods
    const usingMethods = [];
    if (settings?.wifiEnabled) usingMethods.push('WiFi');

    // If QR is enabled and we haven't scanned it yet (and no scanData provided), show QR scanner
    if (settings?.qrCodeEnabled && !scannedData && !scanData && !skipQR) {
      setShowQRScanner(true);
      return;
    }

    if (scanData || scannedData) {
      usingMethods.push('QR');
    }

    if (settings?.gpsEnabled) {
      usingMethods.push('GPS');
      getCurrentLocation();
    }

    setActiveCheckInMethod(usingMethods);
    setSelectedEmployee(employee);
    setShowSelfieCapture(true);
    startCamera();
  };

  const handleCheckIn = async (employee, selfieData, locationData) => {
    try {
      const response = await markAttendance({
        employee_id: user._id,
        selfie: selfieData,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        ip_address: userIP,
        check_in_method: activeCheckInMethod.join(' + ') || 'Manual',
        qr_secret: scannedData?.secret
      }).unwrap();

      toast.success(response.message || "Attendance marked successfully");
      setScannedData(null);
      setActiveCheckInMethod([]);
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
      <div className="p-0 bg-white  min-h-screen text-black">
        {/* Navigation */}
        <nav className="bg-white border-b my-3 ">
          <div className="px-4 py-4">
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
        <div className="px-0 mt-2 py-0">

          {/* ==================== DASHBOARD PAGE ==================== */}
          {currentPage === "dashboard" && (
            <div className="space-y-6 px-4">
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
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-3xl shadow-xl shadow-orange-100 animate-bounce-subtle">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent tracking-tighter">
                      My Check-In
                    </h1>
                    <p className="text-gray-400 mt-1 font-bold text-sm tracking-wide flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-orange-200"></span>
                      Secure presence verification
                    </p>
                  </div>
                </div>

                {/* Network Warning */}
                {settings?.wifiEnabled && !isOnCompanyNetwork && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-sm p-6">
                    <div className="flex items-center gap-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="font-bold text-red-900 text-lg">
                          Not Connected to Company Network
                        </p>
                        <p className="text-red-700">
                          Please connect to company WiFi ({settings?.wifiSSID}) to enable check-in
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Employee List (Here: Just the current user card for check-in) */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                  Session <span className="text-orange-500 underline decoration-orange-200 decoration-4 underline-offset-8">Terminal</span>
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
                        <div className={`group bg-white border-2 rounded-xl p-6 transition-all duration-300 ${(!settings?.wifiEnabled || isOnCompanyNetwork)
                          ? "border-gray-100 hover:border-orange-200 hover:shadow-xl shadow-lg"
                          : "border-gray-100 opacity-75 grayscale shadow-none"
                          }`}>
                          <div className="flex items-center gap-5 mb-6">
                            <div className="relative">
                              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform">
                                <UserCheck className="w-8 h-8 text-white" />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-extrabold text-gray-900 text-xl tracking-tight">
                                {user?.name}
                              </p>
                              <p className="text-sm text-gray-500 font-semibold flex items-center gap-1.5 capitalize">
                                <Activity className="w-3.5 h-3.5 text-orange-500" />
                                {user?.employee_id}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            {settings?.wifiEnabled && (
                              <div className={`flex flex-col items-center gap-1 px-3 py-3 rounded-2xl text-[10px] font-bold transition-all duration-300 ${isOnCompanyNetwork ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                <Wifi className="w-5 h-5 mb-1" />
                                <span>WiFi {isOnCompanyNetwork ? 'OK' : 'Required'}</span>
                              </div>
                            )}
                            {settings?.qrCodeEnabled && (
                              <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors">
                                <QrCode className="w-5 h-5 mb-1" />
                                <span>QR Required</span>
                              </div>
                            )}
                            {settings?.gpsEnabled && (
                              <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors">
                                <MapPin className="w-5 h-5 mb-1" />
                                <span>GPS Tracking</span>
                              </div>
                            )}
                            {!settings?.wifiEnabled && !settings?.qrCodeEnabled && !settings?.gpsEnabled && (
                              <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                <Zap className="w-5 h-5 mb-1" />
                                <span>Direct Mode</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setShowCheckInModal(true)}
                            disabled={settings?.wifiEnabled && !isOnCompanyNetwork}
                            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${(!settings?.wifiEnabled || isOnCompanyNetwork)
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-orange-200 hover:-translate-y-1"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                          >
                            Check In
                          </button>
                        </div>
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
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-3xl shadow-xl shadow-orange-100">
                    <ClipboardList className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent tracking-tighter">
                      Attendance Logs
                    </h1>
                    <p className="text-gray-400 mt-1 font-bold text-sm tracking-wide flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-orange-200"></span>
                      Complete history of your check-in sessions
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      Selfie Hub
                    </h2>
                    <p className="text-orange-100 text-xs font-bold opacity-90 uppercase tracking-widest">
                      {selectedEmployee.name} • Verification
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSelfieCapture}
                  className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 relative z-10"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="p-10">
                <div
                  className="relative bg-gray-950 rounded-[2rem] overflow-hidden mb-8 border-4 border-orange-100 shadow-2xl"
                  style={{ height: "400px" }}
                >
                  {!capturedImage ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      <div className="absolute inset-0 border-[3px] border-white/20 rounded-[1.8rem] pointer-events-none m-4"></div>
                      <canvas ref={canvasRef} className="hidden" />
                    </>
                  ) : (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  )}
                </div>

                {location && (
                  <div className="bg-orange-50/50 border-2 border-orange-100 rounded-2xl p-6 mb-8 flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-500 transition-colors">
                      <MapPin className="w-6 h-6 text-orange-600 group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900 text-sm uppercase tracking-tight">
                        GPS Lock Engaged
                      </p>
                      <p className="text-xs text-orange-600 font-bold mt-0.5">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} • ±{location.accuracy.toFixed(0)}m
                      </p>
                    </div>
                  </div>
                )}

                {loadingLocation && (
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 mb-8 flex items-center gap-5 animate-pulse">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-blue-800 font-black text-sm uppercase tracking-tight">
                      Acquiring GPS Signal...
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  {!capturedImage ? (
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group"
                    >
                      <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      Capture Verification
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={retakePhoto}
                        className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 active:scale-95"
                      >
                        Retake
                      </button>
                      <button
                        onClick={() => handleCheckIn(selectedEmployee, capturedImage, location)}
                        disabled={isMarking || (settings?.gpsEnabled && !location)}
                        className="flex-[2] bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                      >
                        {isMarking ? (
                          <div className="w-6 h-6 border-3 border-white border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <CheckCircle className="w-6 h-6" />
                        )}
                        Finalize Check-In
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                    Attendance Details
                  </h2>
                  <p className="text-orange-100 font-bold text-sm tracking-widest flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {detailsModal.date}
                  </p>
                </div>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 relative z-10"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                {detailsModal.selfie && (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-orange-100 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                      <h3 className="font-black text-gray-900 mb-4 px-2 flex items-center gap-2 text-sm uppercase tracking-widest">
                        <Camera className="w-4 h-4 text-orange-500" />
                        Shift Verification Image
                      </h3>
                      <img
                        src={detailsModal.selfie}
                        alt="Check-in selfie"
                        className="w-full max-w-md mx-auto rounded-[2rem] shadow-2xl border-4 border-orange-50 hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}

                {!detailsModal.selfie && detailsModal.status !== "absent" && (
                  <div className="bg-orange-50/30 border-2 border-dashed border-orange-100 rounded-[2rem] p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-orange-200 mx-auto mb-4" />
                    <p className="text-orange-600 font-bold uppercase tracking-widest text-xs">
                      No visual verification captured
                    </p>
                  </div>
                )}

                {detailsModal.location && (
                  <div className="bg-orange-50/50 border-2 border-orange-100 rounded-2xl p-6 flex items-center gap-6 group hover:bg-white transition-all duration-300">
                    <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight">
                        Geographic Stamp
                      </h3>
                      <p className="text-orange-600 font-bold text-xs mt-1">
                        Lat: {detailsModal.location.latitude.toFixed(6)} • Long: {detailsModal.location.longitude.toFixed(6)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5 opacity-60">
                        Calculated Precision: ±{detailsModal.location.accuracy.toFixed(0)}m
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-orange-600">Check In</p>
                    <p className="font-black text-gray-900 text-xl tracking-tight">
                      {detailsModal.checkIn}
                    </p>
                  </div>
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-orange-600">Check Out</p>
                    <p className="font-black text-gray-900 text-xl tracking-tight">
                      {detailsModal.checkOut}
                    </p>
                  </div>
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-orange-600">Method</p>
                    <p className="font-extrabold text-gray-900 text-sm tracking-tight flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-orange-500" />
                      {detailsModal.check_in_method}
                    </p>
                  </div>
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-orange-600">Network IP</p>
                    <p className="font-bold text-gray-800 font-mono text-xs">
                      {detailsModal.ip_address}
                    </p>
                  </div>
                  <div className="bg-orange-600 p-6 rounded-2xl col-span-2 shadow-xl shadow-orange-100 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 animate-pulse"></div>
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Total Work Hours</p>
                    <p className="font-black text-white text-3xl tracking-tighter">
                      {detailsModal.work_hours}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-3/4 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCheckInModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white relative">
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">Portal</h2>
                <p className="text-orange-100 font-bold text-xs opacity-90 tracking-widest uppercase">Start your workspace session</p>
              </div>

              <div className="p-10 space-y-5 bg-white">
                {settings?.qrCodeEnabled && (
                  <button
                    onClick={() => {
                      setShowCheckInModal(false);
                      setShowQRScanner(true);
                    }}
                    className="w-full flex items-center gap-5 p-6 bg-purple-50/50 border-2 border-purple-100 rounded-3xl hover:border-purple-500 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 group"
                  >
                    <div className="bg-purple-100 p-4 rounded-2xl group-hover:bg-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <QrCode className="w-8 h-8 text-purple-600 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-gray-900 text-xl group-hover:text-purple-700 transition-colors tracking-tight">Scan Office QR</p>
                      <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-0.5">Physical Hub Verification</p>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowCheckInModal(false);
                    handleCheckInClick(user, null, true);
                  }}
                  className="w-full flex items-center gap-5 p-6 bg-orange-50/50 border-2 border-orange-100 rounded-3xl hover:border-orange-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 group"
                >
                  <div className="bg-orange-100 p-4 rounded-2xl group-hover:bg-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Camera className="w-8 h-8 text-orange-600 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 text-xl group-hover:text-orange-700 transition-colors tracking-tight">Selfie & GPS</p>
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mt-0.5">Biometric Handshake</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors active:scale-95"
                >
                  Cancel Session
                </button>
              </div>
            </div>
          </div>
        )}

        {showQRScanner && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              <div className="p-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white flex justify-between items-center bg-[length:200%_200%]">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Scan Office QR</h2>
                    <p className="text-orange-100 text-xs font-semibold opacity-90">Instant presence verification</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="p-10">
                <div id="reader" className="overflow-hidden rounded-[1.5rem] border-4 border-orange-100 mb-8 bg-slate-50 min-h-[350px] shadow-inner flex items-center justify-center relative">
                </div>
                <div className="flex items-start gap-4 bg-orange-50 p-6 rounded-[1.5rem] border border-orange-100 mb-8">
                  <div className="bg-orange-200 p-2 rounded-lg mt-1">
                    <Zap className="w-4 h-4 text-orange-700" />
                  </div>
                  <p className="text-sm text-gray-700 font-bold leading-relaxed">
                    Align the official office QR code within the frame. Once detected, you will be redirected to the photo verification step.
                  </p>
                </div>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="w-full py-5 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all duration-300 uppercase tracking-widest text-xs shadow-sm hover:shadow-lg active:scale-95"
                >
                  Cancel Scanning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
