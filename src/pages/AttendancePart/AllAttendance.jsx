import React, { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
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
} from "lucide-react";
import {
  useGetAllAttendanceQuery,
  useGetDashboardStatsQuery,
  useMarkAttendanceMutation
} from "../../store/api/attendanceApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import NumberCard from "../../components/NumberCard";

export default function AttendanceApp() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userIP, setUserIP] = useState(null);
  const [isOnCompanyNetwork, setIsOnCompanyNetwork] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  // Live Monitoring State for Check-in Grid
  const [monitoringEmployee, setMonitoringEmployee] = useState(null);
  const [monitorStream, setMonitorStream] = useState(null);
  const [monitorType, setMonitorType] = useState(null); // 'camera' or 'mic'
  const monitorVideoRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const companyIPRange = "192.168.1.";

  // API Hooks
  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useGetAllAttendanceQuery({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    department_id: filterDepartment !== 'all' ? filterDepartment : undefined,
    date: new Date().toISOString().split('T')[0] // Default to today
  });

  const { data: statsResponse } = useGetDashboardStatsQuery();
  const { data: departmentsResponse } = useGetDepartmentsQuery({ limit: 100 });
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

  const attendanceData = attendanceResponse?.data || [];
  const departments = departmentsResponse?.departments || [];
  const statsData = statsResponse?.data || {};

  useEffect(() => {
    const simulatedIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
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

  const closeSelfieCapture = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowSelfieCapture(false);
    setSelectedEmployee(null);
    setCapturedImage(null);
    setLocation(null);
  };

  const handleCheckInClick = (employee) => {
    if (!isOnCompanyNetwork) {
      alert("Please connect to company WiFi network to check in");
      return;
    }
    stopLiveMonitoring();
    setSelectedEmployee(employee);
    setShowSelfieCapture(true);
  };

  const startLiveMonitoring = async (employee, type) => {
    try {
      // If already monitoring this employee and type, stop it
      if (monitoringEmployee?.id === employee.id && monitorType === type) {
        stopLiveMonitoring();
        return;
      }

      // Stop any existing stream first
      stopLiveMonitoring();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'camera',
        audio: true
      });

      setMonitorStream(stream);
      setMonitoringEmployee(employee);
      setMonitorType(type);

      if (type === 'camera' && monitorVideoRef.current) {
        monitorVideoRef.current.srcObject = stream;
      }

      toast.success(`Broadcasting live ${type} from ${employee.name}`, {
        icon: type === 'camera' ? '🎥' : '🎤',
        duration: 3000
      });
    } catch (error) {
      console.error("Monitoring access error:", error);
      toast.error(`Unable to access ${type}. Please grant permissions.`);
    }
  };

  const stopLiveMonitoring = () => {
    if (monitorStream) {
      monitorStream.getTracks().forEach(track => track.stop());
      setMonitorStream(null);
    }
    setMonitoringEmployee(null);
    setMonitorType(null);
  };

  const handleCheckIn = async (employee, selfieData, locationData) => {
    try {
      const response = await markAttendance({
        employee_id: employee.id, // Assuming selectedEmployee has id
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

  const handleExport = () => {
    const csv = [
      [
        "Employee ID",
        "Name",
        "Department",
        "Check In",
        "Check Out",
        "Status",
        "Work Hours",
        "Method",
        "IP Address",
      ],
      ...filteredAttendance.map((r) => [
        r.employeeId,
        r.name,
        r.department,
        r.checkIn,
        r.checkOut,
        r.status,
        r.workHours,
        r.checkInMethod,
        r.ipAddress,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = statsData.total || 0;
    const present = statsData.present || 0;
    const absent = statsData.absent || 0;
    const late = statsData.late || 0;
    const halfDay = statsData.half_day || 0;

    const attendanceRate =
      total > 0 ? (((present + late + halfDay) / total) * 100).toFixed(1) : 0;

    return [
      {
        title: "Total Employees",
        number: total,
        icon: Users,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        lineBorderClass: "border-blue-500",
      },
      {
        title: "Present Today",
        number: present,
        icon: UserCheck,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        lineBorderClass: "border-green-500",
      },
      {
        title: "Absent",
        number: absent,
        icon: UserX,
        iconBgColor: "bg-orange-100",
        iconColor: "text-orange-600",
        lineBorderClass: "border-orange-500",
      },
      {
        title: "Attendance Rate",
        number: `${attendanceRate}%`,
        icon: TrendingUp,
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        lineBorderClass: "border-purple-500",
      },
    ];
  }, [statsData]);


  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((record) => {
      const matchesSearch =
        (record.employee_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.emp_uid || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [attendanceData, searchQuery]);

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
                    Attendance System
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <FiHome className="text-gray-700 text-sm" />

                    <span className="text-gray-600">HRM /</span>

                    <span className="text-[#FF7B1D] font-medium">
                      All Attendance
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${currentPage === "dashboard"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    }`}
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("checkin")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${currentPage === "checkin"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    }`}
                >
                  <Camera className="w-5 h-5" />
                  Check-In
                </button>
                <button
                  onClick={() => setCurrentPage("records")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${currentPage === "records"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    }`}
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
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <NumberCard
                    key={index}
                    title={stat.title}
                    number={stat.number}
                    icon={<stat.icon size={24} className={stat.iconColor} />}
                    iconBgColor={stat.iconBgColor}
                    lineBorderClass={stat.lineBorderClass}
                  />
                ))}
              </div>


              {/* Network Status
              <div className="bg-white rounded-sm shadow-xl p-6 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-sm ${
                        isOnCompanyNetwork ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <Wifi
                        className={`w-6 h-6 ${
                          isOnCompanyNetwork ? "text-green-600" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Network Status
                      </h3>
                      <p
                        className={`text-sm font-medium ${
                          isOnCompanyNetwork ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isOnCompanyNetwork
                          ? "✓ Connected to company WiFi"
                          : "✗ Not on company network"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right bg-orange-50 px-4 py-2 rounded-sm">
                    <p className="text-xs text-orange-600 font-semibold uppercase">
                      Your IP
                    </p>
                    <p className="text-sm font-mono font-bold text-orange-900">
                      {userIP || "Loading..."}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Quick Actions */}
              <div className="bg-white rounded-sm shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentPage("checkin")}
                    className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-sm transform flex items-center justify-center gap-3 font-semibold"
                  >
                    <Camera className="w-6 h-6" />
                    Check-In with Selfie
                  </button>
                  <button
                    onClick={() => setCurrentPage("records")}
                    className="p-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-sm hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-sm transform  flex items-center justify-center gap-3 font-semibold"
                  >
                    <ClipboardList className="w-6 h-6" />
                    View Attendance Records
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-sm shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Check-ins
                </h2>
                <div className="space-y-4">
                  {attendanceData
                    .filter((a) => a.status !== "absent")
                    .slice(0, 5)
                    .map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-orange-50 rounded-sm"
                      >
                        {record.selfie && (
                          <img
                            src={record.selfie}
                            alt="Selfie"
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-300"
                          />
                        )}
                        {!record.selfie && (
                          <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-orange-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {record.employee_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.department_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-orange-600">
                            {record.check_in}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.check_in_method}
                          </p>
                        </div>

                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== CHECK-IN PAGE ==================== */}
          {currentPage === "checkin" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Employee Check-In
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Select employee to check in with selfie & location
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

              {/* Employee List */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Check-In <span className="text-orange-500">& Monitoring Terminal</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attendanceData
                    .map((employee) => {
                      const isCheckedIn = employee.status === 'present' || employee.status === 'late' || employee.status === 'half-day';
                      const isCheckedOut = employee.check_out && employee.check_out !== '-';
                      const canMonitor = isCheckedIn && !isCheckedOut;

                      return (
                        <div
                          key={employee.id}
                          className={`border-2 rounded-lg p-6 text-left transition-all duration-300 relative group overflow-hidden ${isOnCompanyNetwork
                            ? (canMonitor ? "border-green-200 bg-white shadow-md hover:shadow-xl" : "border-gray-100 bg-gray-50/50 shadow-sm")
                            : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                            }`}
                        >
                          {/* Live Feed HUD Overlay */}
                          {monitoringEmployee?.id === employee.id && canMonitor && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 animate-pulse z-20"></div>
                          )}

                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className={`transition-all duration-500 overflow-hidden rounded-xl shadow-lg ${(monitoringEmployee?.id === employee.id && monitorType === 'camera' && canMonitor) ? 'w-32 h-32' : 'w-16 h-16'}`}>
                                  {monitoringEmployee?.id === employee.id && monitorType === 'camera' && canMonitor ? (
                                    <video
                                      ref={monitorVideoRef}
                                      autoPlay
                                      playsInline
                                      className="w-full h-full object-cover scale-x-[-1]"
                                    />
                                  ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isCheckedIn ? (isCheckedOut ? 'bg-slate-400' : 'bg-green-500') : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
                                      {isCheckedIn ? <CheckCircle className="w-8 h-8 text-white" /> : <UserCheck className="w-8 h-8 text-white" />}
                                    </div>
                                  )}
                                </div>
                                {monitoringEmployee?.id === employee.id && canMonitor && (
                                  <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-lg">
                                    LIVE
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <p className="font-extrabold text-gray-900 text-xl tracking-tight leading-tight">
                                  {employee.name || employee.employee_name}
                                </p>
                                <p className="text-sm text-orange-600 font-bold mt-1">
                                  {employee.employeeId || employee.emp_uid}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {/* Camera Toggle - Enabled only if Checked In & Not Checked Out */}
                              <button
                                onClick={(e) => { e.stopPropagation(); if (canMonitor) startLiveMonitoring(employee, 'camera'); }}
                                disabled={!canMonitor}
                                className={`p-2.5 rounded-lg transition-all duration-300 shadow-sm border ${!canMonitor ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' :
                                  (monitoringEmployee?.id === employee.id && monitorType === 'camera' ? 'bg-orange-500 text-white border-orange-600 scale-110' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200')
                                  }`}
                                title={canMonitor ? "Toggle Camera Feed" : "Monitoring disabled (Employee not on duty)"}
                              >
                                <Camera className="w-5 h-5" />
                              </button>
                              {/* Mic Toggle - Enabled only if Checked In & Not Checked Out */}
                              <button
                                onClick={(e) => { e.stopPropagation(); if (canMonitor) startLiveMonitoring(employee, 'mic'); }}
                                disabled={!canMonitor}
                                className={`p-2.5 rounded-lg transition-all duration-300 shadow-sm border ${!canMonitor ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' :
                                  (monitoringEmployee?.id === employee.id && monitorType === 'mic' ? 'bg-blue-500 text-white border-blue-600 scale-110' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200')
                                  }`}
                                title={canMonitor ? "Toggle Audio Feed" : "Monitoring disabled (Employee not on duty)"}
                              >
                                {monitoringEmployee?.id === employee.id && monitorType === 'mic' && canMonitor ? <Activity className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-orange-50/50 rounded-xl px-4 py-3 border border-orange-100/50">
                              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mb-0.5">Department</p>
                              <p className="text-sm font-black text-gray-800 truncate">
                                {employee.department || employee.department_name}
                              </p>
                            </div>
                            <div className={`rounded-xl px-4 py-3 border ${isCheckedIn ? (isCheckedOut ? 'bg-slate-100 border-slate-200' : 'bg-green-50 border-green-100') : 'bg-slate-50 border-slate-100'}`}>
                              <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCheckedIn ? (isCheckedOut ? 'text-slate-500' : 'text-green-600') : 'text-slate-500'}`}>Status</p>
                              <p className={`text-sm font-black ${isCheckedIn ? (isCheckedOut ? 'text-slate-700' : 'text-green-700') : 'text-slate-700'}`}>
                                {isCheckedOut ? "CHECKED OUT" : employee.status.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          {!isCheckedIn && (
                            <button
                              onClick={() => handleCheckInClick(employee)}
                              disabled={!isOnCompanyNetwork}
                              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${isOnCompanyNetwork
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-orange-200 hover:-translate-y-1"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                              Check In Now
                            </button>
                          )}
                          {isCheckedIn && !isCheckedOut && (
                            <div className="w-full py-4 bg-green-100 text-green-700 rounded-xl text-center font-black text-sm uppercase tracking-widest border border-green-200">
                              Currently On Duty
                            </div>
                          )}
                          {isCheckedOut && (
                            <div className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-center font-black text-sm uppercase tracking-widest border border-slate-200 italic">
                              Shift Completed
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {attendanceData.length === 0 && (
                  <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-sm">
                    <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-bold text-xl">
                      All employees have checked in! 🎉
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== ATTENDANCE RECORDS PAGE ==================== */}
          {currentPage === "records" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                    <ClipboardList className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Attendance Records
                    </h1>
                    <p className="text-gray-600 mt-1">
                      View and manage employee attendance
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-sm flex items-center gap-2 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-sm shadow-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-4 py-3 border-2 border-orange-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border-2 border-orange-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="w-7 h-7" />
                    Records ({filteredAttendance.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                          Employee
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                          Department
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Check In
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Method
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Check Out
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Work Hours
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAttendance.map((record) => {
                        const badge = getStatusBadge(record.status);
                        const StatusIcon = badge.icon;
                        const methodBadge = getMethodBadge(
                          record.check_in_method
                        );
                        const MethodIcon = methodBadge.icon;


                        return (
                          <tr
                            key={record.id}
                            className="hover:bg-orange-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {record.selfie && (
                                  <img
                                    src={record.selfie}
                                    alt="Selfie"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
                                  />
                                )}
                                {!record.selfie && (
                                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <UserCheck className="w-5 h-5 text-orange-600" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-gray-900">
                                    {record.employee_name}
                                  </p>
                                  <p className="text-sm text-orange-600 font-medium">
                                    {record.emp_uid}
                                  </p>
                                </div>

                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-700 font-medium">
                                {record.department_name}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span className="text-gray-900 font-semibold">
                                  {record.check_in}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 ${methodBadge.bg} ${methodBadge.text} rounded-sm text-xs font-bold`}
                              >
                                <MethodIcon className="w-4 h-4" />
                                {record.check_in_method}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-900 font-semibold">
                                {record.check_out}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-sm text-xs font-bold">
                                <Timer className="w-4 h-4" />
                                {record.work_hours}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 ${badge.bg} ${badge.text} rounded-sm text-xs font-bold`}
                              >
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
                        );
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
                  <p className="text-orange-100">{detailsModal.name}</p>
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
                    <p className="text-orange-600 text-sm mb-1">Employee ID</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.emp_uid}
                    </p>

                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Department</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.department_name}
                    </p>

                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Check In</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.check_in}
                    </p>

                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Check Out</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.check_out}
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
